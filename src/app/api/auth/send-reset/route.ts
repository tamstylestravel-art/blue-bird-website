import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { email, locale = 'th' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate the password reset link
    const actionCodeSettings = {
      // URL you want to redirect back to.
      url: `https://bluebirdpicturesstudio.com/${locale}/login`,
      handleCodeInApp: true,
    };
    
    let link = await adminAuth.generatePasswordResetLink(email, actionCodeSettings);
    
    // Parse the generated link to extract the oobCode
    const urlObj = new URL(link);
    const oobCode = urlObj.searchParams.get('oobCode');
    
    // Construct our custom URL
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://bluebirdpicturesstudio.com';
    const customUrl = new URL(`${origin}/${locale}/reset-password`);
    if (oobCode) customUrl.searchParams.set('oobCode', oobCode);
    
    link = customUrl.toString();

    const isThai = locale === 'th';
    const subject = isThai ? 'รีเซ็ตรหัสผ่านของคุณ - Blue Bird Pictures Studio' : 'Reset your password for Blue Bird Pictures Studio';
    
    const title = isThai ? 'คำขอรีเซ็ตรหัสผ่าน' : 'Password Reset Request';
    const desc1 = isThai 
      ? 'เราได้รับคำขอให้รีเซ็ตรหัสผ่านของคุณ หากคุณไม่ได้เป็นผู้ทำคำขอนี้ คุณสามารถเพิกเฉยต่ออีเมลฉบับนี้ได้เลย'
      : 'We received a request to reset your password. If you didn\'t make this request, you can safely ignore this email.';
    const desc2 = isThai
      ? 'แต่ถ้าใช่ กรุณาคลิกที่ปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:'
      : 'Otherwise, click the button below to set a new password:';
    const btnText = isThai ? 'ตั้งรหัสผ่านใหม่' : 'Reset Password';
    const altText = isThai
      ? 'ถ้าปุ่มใช้งานไม่ได้ คุณสามารถคัดลอกลิงก์ด้านล่างไปวางในเบราว์เซอร์ได้เลย:'
      : 'If the button doesn\'t work, you can also copy and paste the following link into your browser:';

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Blue Bird Pictures Studio <support@bluebirdpicturesstudio.com>',
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://bluebirdpicturesstudio.com/images/bird.png" alt="Blue Bird Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: #0ea5e9; margin: 0;">Blue Bird</h1>
            <h3 style="margin-top: 5px; color: #666;">Pictures Studio</h3>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h2 style="margin-top: 0; text-align: center;">${title}</h2>
            <p style="font-size: 16px; line-height: 1.5; text-align: center;">
              ${desc1}
            </p>
            <p style="font-size: 16px; line-height: 1.5; text-align: center;">
              ${desc2}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                ${btnText}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              ${altText}
              <br><br>
              <a href="${link}" style="color: #0ea5e9; word-break: break-all;">${link}</a>
            </p>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 30px;">
            &copy; ${new Date().getFullYear()} Blue Bird Pictures Studio. All rights reserved.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error sending reset email:', error);
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: 'auth/user-not-found' }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
