"use client";

import { useEffect, useRef, useState } from "react";

export default function AutoEditFeature() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 bg-[var(--background)] overflow-hidden">
      {/* Glow Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-brand-blue)]/5 blur-[100px] rounded-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-block px-4 py-2 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue-dark)] font-semibold text-sm border border-[var(--color-brand-blue)]/20 shadow-sm">
              ✨ ฟีเจอร์ใหม่ล่าสุด (Blue Bird Composer PRO)
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--foreground)] leading-tight tracking-tight">
              เปลี่ยนงาน 7 วัน <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">ให้จบใน 5 นาที</span>
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed">
              ไม่ต้องทนปวดหลังนั่งตัดต่อแบบเดิมๆ อีกต่อไป ด้วยระบบ AI ที่ออกแบบมาสำหรับครีเอเตอร์และโปรดักชั่นมืออาชีพโดยเฉพาะ
            </p>
            
            <div className="space-y-6 pt-4">
              {/* Feature 1 */}
              <div className={`flex gap-4 items-start transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">Multi-cam Auto Switch</h3>
                  <p className="text-gray-500 mt-1">รองรับกล้อง 3-4 ตัว สลับภาพมุมกล้องตามเสียงคนพูดอัตโนมัติแบบเรียลไทม์ แม่นยำทุกเฟรม</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className={`flex gap-4 items-start transition-all duration-700 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">AIP Audio Analysis</h3>
                  <p className="text-gray-500 mt-1">วิเคราะห์ประโยค ตัดช่วงเงียบ (Dead Air) และตัดคำขยะทิ้งให้เนียนกริบ โดยที่คุณไม่ต้องเสียเวลาไล่ฟังเอง</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Images / Visuals */}
          <div className={`relative transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            {/* Background decorative card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
            
            <div className="relative glass-panel rounded-3xl p-4 md:p-6 shadow-2xl border border-[var(--border)] bg-white/50 dark:bg-black/20">
              {/* Fake UI Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="text-xs text-gray-500 font-mono ml-2">timeline_comparison.prproj</div>
              </div>
              
              <div className="space-y-4">
                {/* Before */}
                <div className="relative group overflow-hidden rounded-xl bg-gray-900 border border-gray-800 aspect-video flex items-center justify-center">
                  <div className="absolute top-3 left-3 z-10 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md shadow-lg">
                    BEFORE (7 Days)
                  </div>
                  {/* Fallback pattern if image is missing */}
                  <img src="/images/timeline-before.png" alt="Before" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute text-gray-600 font-mono text-sm pointer-events-none -z-10">Waiting for timeline-before.png</div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center -my-6 relative z-20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-xl border-4 border-white dark:border-[#202124]">
                    <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                </div>

                {/* After */}
                <div className="relative group overflow-hidden rounded-xl bg-gray-900 border border-gray-800 aspect-video flex items-center justify-center">
                  <div className="absolute top-3 left-3 z-10 bg-green-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-md backdrop-blur-md shadow-lg">
                    AFTER (5 Mins)
                  </div>
                  <div className="absolute inset-0 border-2 border-green-400/30 rounded-xl z-20 pointer-events-none animate-pulse"></div>
                  {/* Fallback pattern if image is missing */}
                  <img src="/images/timeline-after.png" alt="After" className="w-full h-full object-cover shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute text-gray-600 font-mono text-sm pointer-events-none -z-10">Waiting for timeline-after.png</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
