import os

with open('src/app/[locale]/dashboard/DashboardOverview.tsx', 'r', encoding='utf-8') as f:
    js = f.read()

import_code = """import { useEffect, useState } from "react";"""
new_import_code = """import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";"""

js = js.replace(import_code, new_import_code)

hook_code = """  const t = useTranslations("Dashboard");
  const [user, setUser] = useState<User | null>(null);"""
new_hook_code = """  const t = useTranslations("Dashboard");
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const [appConnected, setAppConnected] = useState(false);"""

js = js.replace(hook_code, new_hook_code)

effect_code = """  useEffect(() => {
    setUser(auth.currentUser);
  }, []);"""
new_effect_code = """  useEffect(() => {
    setUser(auth.currentUser);
    
    // Desktop App Connection Logic
    const appPort = searchParams.get('app_port');
    if (appPort && auth.currentUser) {
      auth.currentUser.getIdToken().then(token => {
        fetch(http://localhost:/callback?idToken=)
          .then(() => setAppConnected(true))
          .catch(err => console.error("Desktop app connection failed:", err));
      });
    }
  }, [searchParams]);"""

js = js.replace(effect_code, new_effect_code)

render_code = """    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">"""
new_render_code = """    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {appConnected && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in-up">
          <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">เชื่อมต่อกับ Blue Bird Hub สำเร็จแล้ว!</h2>
          <p className="text-gray-500">คุณสามารถปิดหน้าต่างนี้และกลับไปที่โปรแกรมได้เลยครับ</p>
        </div>
      )}"""

js = js.replace(render_code, new_render_code)

with open('src/app/[locale]/dashboard/DashboardOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(js)
