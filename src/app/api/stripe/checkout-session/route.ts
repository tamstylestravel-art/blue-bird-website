import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia' as any, // Use latest stable
});

export async function POST(request: Request) {
  try {
    // 1. ตรวจสอบว่าผู้ใช้ล็อกอินอยู่ไหม
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // 2. รับข้อมูลแพ็กเกจ (รายเดือน หรือ รายปี)
    const body = await request.json();
    const { interval } = body; // 'month' or 'year'

    if (interval !== 'month' && interval !== 'year') {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

    const priceAmount = interval === 'month' ? 49000 : 490000; // 490 THB / month, 4900 THB / year (in satang)

    // 3. สร้าง Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `Blue Bird Plugin - ${interval === 'month' ? 'รายเดือน' : 'รายปี'}`,
              description: 'ปลดล็อกฟีเจอร์ทั้งหมดของปลั๊กอินสำหรับ Adobe Premiere Pro',
            },
            unit_amount: priceAmount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: userId,
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
