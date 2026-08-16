import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Need to read raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Note: To test webhooks locally, you need a STRIPE_WEBHOOK_SECRET
    // For now, we will bypass signature verification if there's no webhook secret, 
    // BUT IN PRODUCTION, YOU MUST USE THE WEBHOOK SECRET.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Unsafe parsing only for dev if secret is missing
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    const db = getFirestore();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        // Update user's firestore document
        await db.collection('users').doc(userId).set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: 'active',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Subscription activated for user ${userId}`);
      }
    } 
    
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      
      if (subscriptionId) {
        // Find user by subscriptionId and update status
        const usersSnapshot = await db.collection('users')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .get();
          
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: 'active',
            lastPaymentDate: new Date().toISOString()
          });
        }
      }
    }
    
    else if (event.type === 'invoice.payment_failed' || event.type === 'customer.subscription.deleted') {
      const subscriptionObj = event.data.object as any;
      const subscriptionId = event.type === 'invoice.payment_failed' ? subscriptionObj.subscription : subscriptionObj.id;

      if (subscriptionId) {
        const usersSnapshot = await db.collection('users')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .get();
          
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: 'inactive', // or 'past_due'
            updatedAt: new Date().toISOString()
          });
          console.log(`❌ Subscription deactivated for user ${userDoc.id}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
