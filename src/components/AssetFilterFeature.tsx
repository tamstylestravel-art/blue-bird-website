"use client";

import { useState, useEffect, useRef } from "react";

export default function AssetFilterFeature() {
  const [orangeOn, setOrangeOn] = useState(true);
  const [blueOn, setBlueOn] = useState(true);
  const [greenOn, setGreenOn] = useState(true);
  const [redOn, setRedOn] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-[#070d19] overflow-hidden border-t border-gray-800">
      {/* Glow Effects */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            เปิด/ปิดไฟล์ที่แสดงด้วย <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ปุ่มสี</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            กรองและควบคุมสื่อของคุณด้วยปลั๊กอิน Blue Bird ได้อย่างอิสระ 
            <br className="hidden md:block" /> เพียงปลายนิ้วสัมผัส ก็สามารถค้นหาไฟล์ที่ต้องการได้ทันที
          </p>
        </div>

        {/* Plugin Mockup Showcase */}
        <div className={`max-w-5xl mx-auto mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
           <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,180,219,0.2)] group">
             <img src="/images/Translate_text_to_English.jpeg" alt="Blue Bird Plugin Interface" className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" />
             {/* Gradient overlay to blend bottom edge into the dark background */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#070d19] via-transparent to-transparent opacity-90 pointer-events-none"></div>
           </div>
        </div>

        {/* Interactive App UI */}
        <div className={`max-w-5xl mx-auto mb-24 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,180,219,0.15)]">
            
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-10 tracking-wide">ลองเล่นจำลองการทำงาน (Live Demo)</h3>
              
              {/* The 4 Buttons */}
              <div className="flex justify-center gap-6 sm:gap-10 md:gap-16">
                
                {/* Blue - Video */}
                <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setBlueOn(!blueOn)}>
                  <div className="relative">
                    <img src={blueOn ? "/images/Blue button-On.png" : "/images/Blue button-Off.png"} alt="Blue Button" className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 brightness-75 group-hover:brightness-125" />
                    {blueOn && <div className="absolute inset-0 bg-blue-500 blur-2xl rounded-full z-0 transition-opacity duration-300 opacity-20 group-hover:opacity-80"></div>}
                  </div>
                  <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${blueOn ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : 'text-gray-600'}`}>วิดีโอ (Video)</span>
                </div>

                {/* Orange - Images */}
                <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setOrangeOn(!orangeOn)}>
                  <div className="relative">
                    <img src={orangeOn ? "/images/Orange button-On.png" : "/images/Orange button-Off.png"} alt="Orange Button" className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 brightness-75 group-hover:brightness-125" />
                    {orangeOn && <div className="absolute inset-0 bg-orange-500 blur-2xl rounded-full z-0 transition-opacity duration-300 opacity-20 group-hover:opacity-80"></div>}
                  </div>
                  <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${orangeOn ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]' : 'text-gray-600'}`}>รูปภาพ (Images)</span>
                </div>
                
                {/* Green - Audio */}
                <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setGreenOn(!greenOn)}>
                  <div className="relative">
                    <img src={greenOn ? "/images/Green button-On.png" : "/images/Green button-Off.png"} alt="Green Button" className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 brightness-75 group-hover:brightness-125" />
                    {greenOn && <div className="absolute inset-0 bg-green-500 blur-2xl rounded-full z-0 transition-opacity duration-300 opacity-20 group-hover:opacity-80"></div>}
                  </div>
                  <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${greenOn ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'text-gray-600'}`}>เสียง (Audio)</span>
                </div>
                
                {/* Red - Mogrt */}
                <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => setRedOn(!redOn)}>
                  <div className="relative">
                    <img src={redOn ? "/images/Red button-On.png" : "/images/Red button-Off.png"} alt="Red Button" className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 brightness-75 group-hover:brightness-125" />
                    {redOn && <div className="absolute inset-0 bg-red-500 blur-2xl rounded-full z-0 transition-opacity duration-300 opacity-20 group-hover:opacity-80"></div>}
                  </div>
                  <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${redOn ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]' : 'text-gray-600'}`}>โมชัน (Mogrt)</span>
                </div>
              </div>
            </div>

            {/* Asset Grid Preview */}
            <div className="bg-[#121622] rounded-2xl p-6 md:p-8 border border-white/5 shadow-inner">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                
                {/* Image Asset 1 (Orange) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${orangeOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-orange-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.jpg</span>
                  {!orangeOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>
                
                {/* Image Asset 2 (Orange) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${orangeOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-orange-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.png</span>
                  {!orangeOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

                {/* Video Asset 1 (Blue) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${blueOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.mp4</span>
                  {!blueOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

                {/* Audio Asset 1 (Green) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${greenOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.wav</span>
                  {!greenOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

                {/* Image Asset 3 (Orange) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${orangeOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-orange-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.jpg</span>
                  {!orangeOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

                {/* Audio Asset 2 (Green) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${greenOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.mp3</span>
                  {!greenOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

                {/* Mogrt Asset 1 (Red) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${redOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.mogrt</span>
                  {!redOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>
                
                {/* Mogrt Asset 2 (Red) */}
                <div className={`aspect-video rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${redOn ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'}`}>
                  <svg className="w-12 h-12 text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-0.5 rounded text-white font-mono">.mogrt</span>
                  {!redOn && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 font-bold tracking-widest bg-black/60 backdrop-blur-sm">DISABLED</div>}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Feature Explanations */}
        <div className={`max-w-4xl mx-auto text-gray-300 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/5 p-8 sm:p-12 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
            
            <p className="text-xl sm:text-2xl text-center mb-12 text-white font-semibold">
              รองรับไฟล์ทุกประเภท ใช้งานง่ายเหมือนพลิกฝ่ามือ:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                </div>
                <div>
                  <strong className="text-blue-400 text-lg block mb-2">วิดีโอ (Video)</strong>
                  <div className="flex flex-wrap gap-2">
                    {['.mp4', '.mov', '.avi', '.mkv', '.webm'].map(ext => (
                      <span key={ext} className="bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-300">{ext}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0 border border-orange-500/30">
                  <div className="w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]"></div>
                </div>
                <div>
                  <strong className="text-orange-400 text-lg block mb-2">รูปภาพ (Images)</strong>
                  <div className="flex flex-wrap gap-2">
                    {['.jpg', '.png', '.jpeg', '.webp', '.gif'].map(ext => (
                      <span key={ext} className="bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-300">{ext}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 border border-green-500/30">
                  <div className="w-5 h-5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]"></div>
                </div>
                <div>
                  <strong className="text-green-400 text-lg block mb-2">เสียง (Audio)</strong>
                  <div className="flex flex-wrap gap-2">
                    {['.mp3', '.wav', '.m4a', '.aac', '.flac'].map(ext => (
                      <span key={ext} className="bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-300">{ext}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                  <div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                </div>
                <div>
                  <strong className="text-red-400 text-lg block mb-2">โมชันกราฟิก (Mogrt)</strong>
                  <div className="flex flex-wrap gap-2">
                    {['.mogrt'].map(ext => (
                      <span key={ext} className="bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-300">{ext}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
