'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';

export default function AdminPluginUpdatePage() {
  const t = useTranslations('auth'); // or create specific translations
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  const [version, setVersion] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('https://bluebirdpicturesstudio.com/downloads/update.zip');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // กำหนดให้อีเมลแอดมินคือ tamstylestravel@gmail.com
        if (currentUser.email === 'tamstylestravel@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        // ถ้ายังไม่ได้ล็อกอิน ให้เด้งกลับไปหน้า login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setStatus(null);

    try {
      // ดึง Token จากบัญชีผู้ใช้เพื่อยืนยันตัวตน
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/plugin-update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ version, downloadUrl })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: '🎉 ประกาศอัปเดตเวอร์ชัน ' + version + ' สำเร็จแล้ว! ลูกค้าจะได้รับอัปเดตทันทีที่เปิดปลั๊กอิน' });
        setVersion('');
      } else {
        setStatus({ type: 'error', message: data.error || 'เกิดข้อผิดพลาด' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setIsLoading(false);
    }
  };

  // กำลังโหลดเช็คสิทธิ์
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // ไม่ใช่แอดมิน
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-500/50 rounded-xl p-8 shadow-2xl text-center">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (เฉพาะแอดมินเท่านั้น)</p>
          <button onClick={() => router.push('/')} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // แอดมินตัวจริง
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-500/20 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-2xl font-bold text-sky-400 mb-2">🚀 Admin Panel</h1>
          <p className="text-gray-400 text-sm">ระบบปล่อยอัปเดตปลั๊กอิน (Auto-Updater)</p>
          <div className="mt-2 text-xs text-sky-300/60 bg-sky-500/10 inline-block px-3 py-1 rounded-full">
            Logged in as Admin
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">เลขเวอร์ชันใหม่ (Version)</label>
            <input 
              type="text" 
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="เช่น 1.0.1" 
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ลิงก์ดาวน์โหลด (URL)</label>
            <input 
              type="text" 
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">มักจะไม่ต้องเปลี่ยน ปล่อยไว้แบบนี้ได้เลย</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            ) : (
              'ประกาศอัปเดตให้ลูกค้าทุกคน'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
