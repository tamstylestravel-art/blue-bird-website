import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
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

    // ตรวจสอบอีเมลแอดมิน
    const adminEmails = ['tamstylestravel@gmail.com', 'tamstyles.travel@gmail.com'];
    if (!decodedToken.email || !adminEmails.includes(decodedToken.email)) {
      return NextResponse.json({ error: 'Forbidden: บัญชีนี้ไม่มีสิทธิ์แอดมิน' }, { status: 403 });
    }

    const body = await request.json();
    const { version, downloadUrl, releaseNotes } = body;

    const db = getFirestore();
    const docRef = db.collection('system').doc('plugin_info');
    
    // Build update object based on what is provided
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (version) updateData.latestVersion = version;
    if (downloadUrl) updateData.downloadUrl = downloadUrl;
    if (releaseNotes) updateData.releaseNotes = releaseNotes;

    await docRef.set(updateData, { merge: true });

    return NextResponse.json({ success: true, message: 'บันทึกอัปเดตเรียบร้อยแล้ว' });

  } catch (error) {
    console.error('Error updating plugin info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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

    // ตรวจสอบอีเมลแอดมิน
    const adminEmails = ['tamstylestravel@gmail.com', 'tamstyles.travel@gmail.com'];
    if (!decodedToken.email || !adminEmails.includes(decodedToken.email)) {
      return NextResponse.json({ error: 'Forbidden: บัญชีนี้ไม่มีสิทธิ์แอดมิน' }, { status: 403 });
    }

    const db = getFirestore();
    const docRef = db.collection('system').doc('plugin_info');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data());
    } else {
      // Default fallback
      return NextResponse.json({ 
        latestVersion: '1.0.0', 
        downloadUrl: 'https://bluebirdpicturesstudio.com/downloads/update.zip' 
      });
    }

  } catch (error) {
    console.error('Error fetching plugin info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
