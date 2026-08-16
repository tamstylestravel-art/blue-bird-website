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
    if (decodedToken.email !== 'tamstylestravel@gmail.com') {
      return NextResponse.json({ error: 'Forbidden: บัญชีนี้ไม่มีสิทธิ์แอดมิน' }, { status: 403 });
    }

    const body = await request.json();
    const { version, downloadUrl } = body;

    if (!version || !downloadUrl) {
      return NextResponse.json({ error: 'Bad Request: ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const db = getFirestore();
    const docRef = db.collection('system').doc('plugin_info');
    await docRef.set({
      latestVersion: version,
      downloadUrl: downloadUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'บันทึกอัปเดตเรียบร้อยแล้ว' });

  } catch (error) {
    console.error('Error updating plugin info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
