'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { auth } from '@/lib/firebase';
import { useRouter } from '@/i18n/routing';

export default function PricingPage() {
  const t = useTranslations('auth'); // Fallback to auth translations if specific pricing ones don't exist
  const router = useRouter();
  const [loading, setLoading] = useState<'month' | 'year' | null>(null);

  const handleSubscribe = async (interval: 'month' | 'year') => {
    // 1. Check if user is logged in
    if (!auth.currentUser) {
      alert("กรุณาล็อกอินก่อนสมัครสมาชิก");
      router.push('/login');
      return;
    }

    setLoading(interval);

    try {
      // 2. Get auth token
      const idToken = await auth.currentUser.getIdToken();

      // 3. Call checkout API
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ interval })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // 4. Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการสร้างเซสชันชำระเงิน");
      }
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 flex flex-col items-center">
      <div className="text-center mb-16 relative">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-4 relative z-10">
          อัปเกรดเพื่อปลดล็อกฟีเจอร์ทั้งหมด
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto relative z-10">
          เลือกแพ็กเกจที่เหมาะกับการทำงานของคุณ เพื่อเพิ่มประสิทธิภาพในการตัดต่อวิดีโอด้วย Blue Bird Composer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* Monthly Plan */}
        <div className="bg-gray-900 border border-gray-800 hover:border-sky-500/50 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 group">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">รายเดือน (Monthly)</h2>
            <p className="text-gray-400 text-sm h-10">ยืดหยุ่น จ่ายแบบเดือนต่อเดือน ยกเลิกได้ตลอดเวลา</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold">฿490</span>
              <span className="text-gray-500">/ เดือน</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1 text-gray-300">
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ใช้งานฟีเจอร์พื้นฐานครบถ้วน
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              เข้าถึงเอฟเฟกต์และเทมเพลตใหม่ทุกเดือน
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              อัปเดตเวอร์ชันใหม่ฟรีตลอดอายุสมาชิก
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('month')}
            disabled={loading !== null}
            className="w-full bg-gray-800 hover:bg-sky-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
          >
            {loading === 'month' ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
              'สมัครแพ็กเกจรายเดือน'
            )}
          </button>
        </div>

        {/* Yearly Plan (Popular) */}
        <div className="bg-gray-900 border-2 border-sky-500 rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-sky-500/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
            คุ้มค่าที่สุด (Popular)
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-sky-400">รายปี (Yearly)</h2>
            <p className="text-gray-400 text-sm h-10">ประหยัดกว่าเมื่อจ่ายเป็นรายปี เหมาะสำหรับมืออาชีพ</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold">฿4,900</span>
              <span className="text-gray-500">/ ปี</span>
            </div>
            <div className="mt-2 text-sm text-green-400 font-medium">✨ ประหยัดไปกว่า 980 บาท</div>
          </div>

          <ul className="space-y-4 mb-8 flex-1 text-gray-300">
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ใช้งานฟีเจอร์พื้นฐานครบถ้วน
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              เข้าถึงเอฟเฟกต์และเทมเพลตใหม่ทุกเดือน
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              สิทธิ์ทดลองใช้งานฟีเจอร์ AI ใหม่ก่อนใคร
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ซัพพอร์ตช่วยเหลือระดับ VIP 24/7
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('year')}
            disabled={loading !== null}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex justify-center items-center gap-2"
          >
            {loading === 'year' ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
              'สมัครแพ็กเกจรายปี'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
