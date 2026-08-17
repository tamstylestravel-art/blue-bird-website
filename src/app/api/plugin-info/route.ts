import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: ไม่พบ Token ยืนยันตัวตน' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Token ไม่ถูกต้องหรือหมดอายุ' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const db = getFirestore();
    
    // Check user data (Optional VIP check)
    // const userDoc = await db.collection('users').doc(uid).get();
    // if (!userDoc.exists || userDoc.data()?.subscriptionStatus !== 'active') {
    //   // If we want strictly VIP:
    //   // return NextResponse.json({ error: 'Forbidden: คุณไม่ใช่ VIP' }, { status: 403 });
    // }

    // Fetch latest version from system/plugin_info
    const docRef = db.collection('system').doc('plugin_info');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data());
    } else {
      // Default fallback if doc doesn't exist
      return NextResponse.json({ 
        latestVersion: '1.0.0', 
        downloadUrl: null 
      });
    }

  } catch (error) {
    console.error('Error fetching plugin info for user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
