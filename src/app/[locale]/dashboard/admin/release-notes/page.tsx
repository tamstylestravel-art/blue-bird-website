'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';

export default function AdminReleaseNotesPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  const [releaseNotes, setReleaseNotes] = useState<{title: string, details: string}[]>([
    { title: '', details: '' }
  ]);
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminEmails = ['tamstylestravel@gmail.com', 'tamstyles.travel@gmail.com'];
        if (currentUser.email && adminEmails.includes(currentUser.email)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (isAdmin && user) {
      const fetchCurrentData = async () => {
        try {
          const idToken = await user.getIdToken();
          const res = await fetch('/api/admin/plugin-update', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.releaseNotes && Array.isArray(data.releaseNotes) && data.releaseNotes.length > 0) {
              setReleaseNotes(data.releaseNotes);
            }
          }
        } catch (error) {
          console.error("Failed to fetch current version", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchCurrentData();
    } else if (isAdmin === false) {
      setIsFetching(false);
    }
  }, [isAdmin, user]);

  const handleNoteChange = (index: number, field: 'title' | 'details', value: string) => {
    const newNotes = [...releaseNotes];
    newNotes[index][field] = value;
    setReleaseNotes(newNotes);
  };

  const addNote = () => {
    setReleaseNotes([...releaseNotes, { title: '', details: '' }]);
  };

  const removeNote = (index: number) => {
    const newNotes = [...releaseNotes];
    newNotes.splice(index, 1);
    if (newNotes.length === 0) {
      newNotes.push({ title: '', details: '' }); // always keep at least one
    }
    setReleaseNotes(newNotes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setStatus(null);

    // Filter out empty notes
    const validNotes = releaseNotes.filter(n => n.title.trim() !== '' || n.details.trim() !== '');

    try {
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/plugin-update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ releaseNotes: validNotes })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: '🎉 บันทึก Release Notes เรียบร้อยแล้ว!' });
      } else {
        setStatus({ type: 'error', message: data.error || 'เกิดข้อผิดพลาด' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

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

  return (
    <div className="w-full pt-4 flex justify-center">
      <div className="glass-panel rounded-xl p-6 shadow-sm w-full max-w-3xl">
        
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold">รายละเอียดการอัปเดต (Release Notes)</h2>
          <button type="button" onClick={addNote} className="bg-[var(--background)] hover:bg-sky-500/10 border border-[var(--border)] text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            + เพิ่มหัวข้อ
          </button>
        </div>
        <p className="text-sm opacity-70 mb-6">ระบุหัวข้อและรายละเอียดว่าในแพตช์นี้มีอะไรใหม่บ้าง</p>

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
            
            <div className="space-y-4">
              {releaseNotes.map((note, idx) => (
                <div key={idx} className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl relative group">
                  <button 
                    type="button"
                    onClick={() => removeNote(idx)}
                    className="absolute top-3 right-3 text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                    title="ลบหัวข้อนี้"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>

                  <div className="mb-3 pr-8">
                    <label className="block text-xs font-semibold mb-1 opacity-70">หัวข้อ (Title)</label>
                    <input 
                      type="text" 
                      value={note.title}
                      onChange={(e) => handleNoteChange(idx, 'title', e.target.value)}
                      placeholder="เช่น เพิ่มปลั๊กอินลบเสียงรบกวน, แก้ไขบั๊กอินเทอร์เน็ตหลุด" 
                      className="w-full bg-transparent border-b border-[var(--border)] focus:border-sky-500 outline-none pb-1 text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-70">รายละเอียด (Details)</label>
                    <textarea 
                      value={note.details}
                      onChange={(e) => handleNoteChange(idx, 'details', e.target.value)}
                      rows={3}
                      placeholder="พิมพ์รายละเอียด (เว้นบรรทัดเพื่อให้แสดงเป็นหลายข้อได้)" 
                      className="w-full bg-[var(--background)] bg-opacity-50 border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500 transition-colors resize-y"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-auto bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
              ) : (
                'บันทึกและประกาศอัปเดต'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
