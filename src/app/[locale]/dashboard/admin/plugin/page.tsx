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
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // กำหนดให้อีเมลแอดมินคือ tamstylestravel@gmail.com หรือมีจุด
        const adminEmails = ['tamstylestravel@gmail.com', 'tamstyles.travel@gmail.com'];
        if (currentUser.email && adminEmails.includes(currentUser.email)) {
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

  // Fetch current version when admin is verified
  useEffect(() => {
    if (isAdmin && user) {
      const fetchCurrentVersion = async () => {
        try {
          const idToken = await user.getIdToken();
          const res = await fetch('/api/admin/plugin-update', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.latestVersion) {
              setCurrentVersion(data.latestVersion);
              setVersion(data.latestVersion);
            }
            if (data.downloadUrl) {
              setDownloadUrl(data.downloadUrl);
            }
          }
        } catch (error) {
          console.error("Failed to fetch current version", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchCurrentVersion();
    } else if (isAdmin === false) {
      setIsFetching(false);
    }
  }, [isAdmin, user]);

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
        setCurrentVersion(version); // อัปเดตป้าย ปัจจุบัน ทันที
        // ไม่ต้อง setVersion('') เพื่อให้เลขยังคาอยู่ในช่อง
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
      <div className="flex items-center justify-center p-12">
        <span className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  // ไม่ใช่แอดมิน
  if (isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="max-w-md w-full glass-panel rounded-xl p-8 text-center border-red-500/30">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-[var(--foreground)] opacity-70 mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (เฉพาะแอดมินเท่านั้น)</p>
          <button onClick={() => router.push('/dashboard')} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors">
            กลับหน้า Dashboard
          </button>
        </div>
      </div>
    );
  }

  // แอดมินตัวจริง
  return (
    <div className="w-full pt-4 flex justify-center">
      <div className="glass-panel rounded-xl p-6 shadow-sm w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-1">ปล่อยอัปเดตปลั๊กอิน (Auto-Updater)</h2>
        <p className="text-sm opacity-70 mb-6">กำหนดเวอร์ชันล่าสุดและลิงก์สำหรับดาวน์โหลดไฟล์ .zxp ใหม่</p>

        {status && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            status.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 
            status.type === 'error' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
            'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
          }`}>
            {status.message}
          </div>
        )}

        {isFetching ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="block text-sm font-medium">เลขเวอร์ชันใหม่ (Version)</label>
                {currentVersion && (
                  <span className="text-xs font-medium text-sky-500 bg-sky-500/10 px-2 py-1 rounded-full">
                    ปัจจุบัน: {currentVersion}
                  </span>
                )}
              </div>
              <input 
                type="text" 
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="เช่น 1.0.1" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ลิงก์ดาวน์โหลด (URL)</label>
              <input 
                type="text" 
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                required
              />
              <p className="text-xs opacity-60 mt-2">มักจะไม่ต้องเปลี่ยน ปล่อยไว้แบบนี้ได้เลย</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-auto bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
              ) : (
                'ประกาศอัปเดต'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
