"use client";

import { useEffect, useRef, useState } from "react";

const tabs = [
  {
    id: "library",
    title: "Smart Library",
    desc: "จัดการคลังสื่ออย่างเป็นระบบ เพิ่มโฟลเดอร์ ค้นหาไว และแยกสีโฟลเดอร์ได้ถึง 8 สี เพื่อให้คุณหาไฟล์เจอในเสี้ยววินาที",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  {
    id: "album",
    title: "Dynamic Album Covers",
    desc: "ตกแต่งคลังสื่อให้สวยงามด้วยแบนเนอร์ภาพปกอัลบั้ม พร้อมฟีเจอร์ Crop รูปในตัว และสั่งใช้กับโฟลเดอร์ย่อยได้อัตโนมัติ",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: "player",
    title: "Advanced Audio Player",
    desc: "พรีวิวเสียงทันทีที่ปลายเมาส์ชี้ โชว์กราฟคลื่นเสียง (Waveform) พร้อมแถบเครื่องมือดัด Pitch และเล่นเสียงย้อนกลับ (Reverse)",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  {
    id: "sync",
    title: "1-Click Premiere Sync",
    desc: "คลิกปุ่ม Add to Timeline เพื่อส่งไฟล์มีเดียพร้อมเอฟเฟกต์ เข้าไปวางบนช่องว่างใน Premiere Pro ให้พอดีเป๊ะแบบอัตโนมัติ",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export default function BasicToolsFeature() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-32 bg-[var(--background)] overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-skybrand-400)]/5 blur-[120px] rounded-full transition-opacity duration-1000 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-skybrand-100)] text-[var(--color-skybrand-800)] font-semibold text-sm border border-[var(--color-skybrand-200)] shadow-sm mb-6">
            🛠️ Core Tools
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--foreground)] leading-tight tracking-tight mb-6">
            จัดการไฟล์ได้ดั่งใจ <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-skybrand-500)] to-[var(--color-skybrand-800)]">เร็วกว่าที่เคยสัมผัส</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            ไม่ใช่แค่ปลั๊กอินเอฟเฟกต์ แต่ Blue Bird Composer คือผู้ช่วยจัดการคลังสื่อส่วนตัว ที่จะทำให้คุณหาไฟล์ที่ใช่ เจอในเวลาที่เร็วกว่าเดิม
          </p>
        </div>

        {/* Content Section: Tabs (Left/Top) + Showcase (Right/Bottom) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Tabs Menu */}
          <div className={`w-full lg:w-5/12 flex flex-col gap-3 sm:gap-4 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 border ${
                    isActive 
                      ? 'bg-white border-[var(--color-skybrand-200)] shadow-lg shadow-[var(--color-skybrand-500)]/10 scale-[1.02] transform' 
                      : 'bg-transparent border-transparent hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl mt-1 transition-colors duration-300 flex-shrink-0 ${
                      isActive 
                        ? 'bg-[var(--color-skybrand-100)] text-[var(--color-skybrand-600)] shadow-inner' 
                        : 'bg-black/5 text-gray-400'
                    }`}>
                      {tab.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${
                        isActive ? 'text-[var(--color-skybrand-900)]' : 'text-gray-600'
                      }`}>
                        {tab.title}
                      </h3>
                      <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {tab.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Showcase Window */}
          <div className={`w-full lg:w-7/12 relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
              
              {/* Mac-like Window Header */}
              <div className="absolute top-0 w-full h-8 sm:h-10 bg-[#2d2d2d] border-b border-gray-900 flex items-center px-4 z-20">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider">Blue Bird Composer</div>
              </div>

              {/* Dynamic Content Based on Tab */}
              <div className="relative w-full h-full pt-8 sm:pt-10 flex items-center justify-center p-4 sm:p-8">
                
                {activeTab === 'library' && (
                  <div className="w-full max-w-sm bg-[#222] rounded-xl border border-gray-700 shadow-xl overflow-hidden animate-fade-in-up">
                    <div className="p-3 border-b border-gray-700 bg-[#2a2a2a] flex items-center gap-2">
                      <div className="text-gray-400">🔍</div>
                      <div className="bg-[#1a1a1a] text-xs text-gray-500 px-3 py-1.5 rounded-md flex-1">Search media...</div>
                    </div>
                    <div className="p-3 space-y-2">
                      {[
                        {name: 'CINEMATIC SOUNDS', color: 'bg-red-500'},
                        {name: 'FUNNY EFFECTS', color: 'bg-yellow-500'},
                        {name: 'TRANSITIONS', color: 'bg-cyan-500'},
                        {name: 'BACKGROUND MUSIC', color: 'bg-purple-500'}
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#333] rounded-lg cursor-pointer transition-colors">
                          <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                          <span className="text-sm font-medium text-gray-200">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'album' && (
                  <div className="w-full h-full flex flex-col gap-4 animate-fade-in-up">
                    <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl relative overflow-hidden shadow-lg border border-gray-700 group">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm border border-white/20 backdrop-blur-md">
                          🖼️ Set Album Cover
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-white font-bold text-lg sm:text-xl drop-shadow-md">EPIC TRAILER MUSIC</div>
                        <div className="text-white/70 text-xs sm:text-sm">120 Audio Files</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 flex-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="bg-[#2a2a2a] rounded-lg border border-gray-700 p-2 sm:p-3 flex flex-col items-center justify-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-blue-400">🎵</div>
                           <div className="w-16 sm:w-20 h-2 bg-[#333] rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'player' && (
                  <div className="w-full max-w-md bg-[#222] rounded-xl border border-gray-700 shadow-xl overflow-hidden animate-fade-in-up flex flex-col">
                    <div className="h-24 sm:h-32 bg-[#1a1a1a] flex items-center justify-center relative p-4 border-b border-gray-700">
                      {/* Fake Waveform */}
                      <div className="flex items-center gap-0.5 sm:gap-1 h-full w-full opacity-70">
                        {Array.from({length: 40}).map((_, i) => (
                          <div key={i} className="w-full bg-blue-500 rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
                        ))}
                      </div>
                      <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
                      <div className="flex items-center justify-between">
                        <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">▶</button>
                        <div className="text-xs text-gray-400 font-mono">00:01:23 / 00:03:45</div>
                      </div>
                      <div className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                        <span className="text-xs text-gray-400 w-8">Pitch</span>
                        <input type="range" className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none" />
                        <span className="text-xs text-blue-400 font-mono">+2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded bg-[#1a1a1a] border-gray-700" />
                        <span className="text-xs text-gray-400">Reverse Audio</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sync' && (
                  <div className="w-full h-full flex items-center justify-center animate-fade-in-up">
                    <div className="relative">
                      {/* Premiere UI Mockup */}
                      <div className="w-[280px] sm:w-[400px] h-[160px] sm:h-[220px] bg-[#222] rounded-lg border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
                        <div className="h-6 bg-[#333] border-b border-gray-700 flex items-center px-3">
                          <span className="text-[10px] text-gray-400">Timeline: Sequence 01</span>
                        </div>
                        <div className="flex-1 flex flex-col p-2 gap-1 relative">
                          <div className="h-8 sm:h-12 border-b border-gray-700 flex items-center relative">
                             <div className="absolute left-0 w-8 sm:w-12 h-full bg-[#1a1a1a] border-r border-gray-700 flex items-center justify-center text-[10px] text-gray-500">V1</div>
                             <div className="ml-10 sm:ml-16 w-32 sm:w-48 h-6 sm:h-8 bg-indigo-500/80 rounded border border-indigo-400 flex items-center px-2 text-[10px] text-white">Video Clip.mp4</div>
                          </div>
                          <div className="h-8 sm:h-12 border-b border-gray-700 flex items-center relative">
                             <div className="absolute left-0 w-8 sm:w-12 h-full bg-[#1a1a1a] border-r border-gray-700 flex items-center justify-center text-[10px] text-gray-500">A1</div>
                             <div className="ml-10 sm:ml-16 w-32 sm:w-48 h-6 sm:h-8 bg-emerald-600/80 rounded border border-emerald-400 flex items-center px-2 text-[10px] text-white">Original Audio.wav</div>
                          </div>
                          <div className="h-8 sm:h-12 border-b border-gray-700 flex items-center relative">
                             <div className="absolute left-0 w-8 sm:w-12 h-full bg-[#1a1a1a] border-r border-gray-700 flex items-center justify-center text-[10px] text-gray-500">A2</div>
                             {/* Dropped Clip */}
                             <div className="ml-[140px] sm:ml-[220px] w-20 sm:w-24 h-6 sm:h-8 bg-teal-500 rounded border border-teal-300 flex items-center px-2 text-[10px] text-white shadow-[0_0_15px_rgba(20,184,166,0.6)] animate-pulse">
                               SFX_Whoosh.wav
                             </div>
                          </div>
                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 left-[140px] sm:left-[220px] w-0.5 bg-blue-500 z-10">
                            <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-blue-500 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Button overlapping */}
                      <button className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-[0_10px_20px_rgba(37,99,235,0.4)] border border-blue-400 hover:scale-105 transition-transform flex items-center gap-2">
                        <span>➕ Add to Timeline</span>
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
