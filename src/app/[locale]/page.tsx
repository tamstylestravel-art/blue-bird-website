import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Image from 'next/image';
import AutoEditFeature from "@/components/AutoEditFeature";
import AssetFilterFeature from "@/components/AssetFilterFeature";
import BasicToolsFeature from "@/components/BasicToolsFeature";
import NetworkCloudBackground from "@/components/NetworkCloudBackground";

const WindowsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" height="1em" width="1em" viewBox="0 0 305 305" xmlns="http://www.w3.org/2000/svg">
    <path d="M139.999,25.775v116.724c0,1.381,1.119,2.5,2.5,2.5H302.46c1.381,0,2.5-1.119,2.5-2.5V2.5 c0-0.726-0.315-1.416-0.864-1.891c-0.548-0.475-1.275-0.687-1.996-0.583L142.139,23.301 C140.91,23.48,139.999,24.534,139.999,25.775z"/>
    <path d="M122.501,279.948c0.601,0,1.186-0.216,1.644-0.616c0.544-0.475,0.856-1.162,0.856-1.884V162.5 c0-1.381-1.119-2.5-2.5-2.5H2.592c-0.663,0-1.299,0.263-1.768,0.732c-0.469,0.469-0.732,1.105-0.732,1.768l0.006,98.515 c0,1.25,0.923,2.307,2.16,2.477l119.903,16.434C122.274,279.94,122.388,279.948,122.501,279.948z"/>
    <path d="M2.609,144.999h119.892c1.381,0,2.5-1.119,2.5-2.5V28.681c0-0.722-0.312-1.408-0.855-1.883 c-0.543-0.475-1.261-0.693-1.981-0.594L2.164,42.5C0.923,42.669-0.001,43.728,0,44.98l0.109,97.521 C0.111,143.881,1.23,144.999,2.609,144.999z"/>
    <path d="M302.46,305c0.599,0,1.182-0.215,1.64-0.613c0.546-0.475,0.86-1.163,0.86-1.887l0.04-140 c0-0.663-0.263-1.299-0.732-1.768c-0.469-0.469-1.105-0.732-1.768-0.732H142.499c-1.381,0-2.5,1.119-2.5,2.5v117.496 c0,1.246,0.918,2.302,2.151,2.476l159.961,22.504C302.228,304.992,302.344,305,302.46,305z"/>
  </svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="-1.5 0 20 20" height="1em" width="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485" transform="translate(-46.000000, -7279.000000)" />
  </svg>
);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const { params } = props;
  const { locale } = await params;
  
  setRequestLocale(locale);

  const tNav = await getTranslations("Navigation");
  const tHero = await getTranslations("Hero");
  const tFeat = await getTranslations("Features");

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 transition-colors duration-300">
      {/* Navigation */}

      {/* Hero Section */}
      <main className="relative flex-grow min-h-screen flex flex-col items-center justify-start overflow-hidden pt-28 sm:pt-36 pb-12">
        {/* Image Background */}
        <div className="absolute inset-0 bg-black z-0">
          <Image 
            src="/images/hero_bg_optimized.jpg"
            alt="Video Editor Studio Background"
            fill
            className="object-cover object-center opacity-30 sm:opacity-40"
            priority
          />
          {/* Subtle overlay to blend - Darker on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 sm:from-black/40 sm:via-black/10 to-transparent" />
        </div>
        
        {/* Transition into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[var(--background)] pointer-events-none z-10" />

        
        {/* Layer 2: Content (Image + Text) */}
        <div className="relative z-30 w-full max-w-7xl px-4 flex flex-col items-center justify-center mt-0 sm:mt-4">

           <div className="opacity-0 animate-bounce-in-custom w-full flex justify-center mb-0 sm:mb-2" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
             <div className="animate-[float-soft_6s_ease-in-out_infinite] sm:animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }}>
               <div 
                 className="relative inline-block"
                 style={{ 
                   WebkitMaskImage: 'url(/images/BLUE-BIRD-COMPOSER-03.png)', 
                   WebkitMaskSize: 'contain', 
                   WebkitMaskRepeat: 'no-repeat', 
                   WebkitMaskPosition: 'center' 
                 }}
               >
                 <img 
                   src="/images/BLUE-BIRD-COMPOSER-03.png" 
                   alt="Blue Bird Composer" 
                   className="w-[90vw] sm:w-[75vw] max-w-[400px] md:max-w-2xl lg:max-w-4xl h-auto object-contain drop-shadow-2xl" 
                 />
                 {/* Shine Sweep Effect */}
                 <div 
                   className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shine_4s_infinite]" 
                   style={{ animationDelay: '1.5s', animationFillMode: 'both' }}
                 />
               </div>
             </div>
           </div>
           
           {/* Text Content overlaying the sky */}
           <div className="text-center space-y-1 sm:space-y-4 opacity-0 animate-fade-in-up z-20" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <h1 className="flex flex-col items-center justify-center tracking-tight leading-tight space-y-1 sm:space-y-3">
                <div className="flex flex-row items-end justify-center flex-wrap gap-2 sm:gap-4 px-2">
                  {locale === 'th' ? (
                    <>
                      <span className="block text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] pb-0 leading-none">ติดปีก</span>
                      <span className="block text-xl sm:text-3xl md:text-4xl font-medium text-slate-200 opacity-90 pb-0 sm:pb-2 leading-none">ให้งานตัดต่อของคุณ</span>
                    </>
                  ) : (
                    <>
                      <span className="block text-xl sm:text-3xl md:text-4xl font-medium text-slate-200 opacity-90 pb-0 sm:pb-2 leading-none">Give Your Video Editing</span>
                      <span className="block text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] pb-0 leading-none">Wings</span>
                    </>
                  )}
                </div>
                
                <div className="mt-0 sm:mt-2 relative inline-block">
                  <span className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 tracking-wider sm:tracking-[0.1em] drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    {tHero("title2")}
                  </span>
                </div>
              </h1>
              
              <p className="text-[13px] min-[390px]:text-[14px] sm:text-xl md:text-2xl text-slate-300 font-normal max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                {tHero.rich("subtitle", {
                  highlight: (chunks) => <span className="inline-block whitespace-nowrap font-medium text-cyan-200 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mx-1">{chunks}</span>,
                  block: (chunks) => <span className="block mt-1">{chunks}</span>,
                  nowrap: (chunks) => <span className="whitespace-nowrap">{chunks}</span>
                })}
              </p>
              
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 pt-2 sm:pt-4 px-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <a href="/downloads/BlueBirdComposer_Installer.exe" download className="w-full md:w-auto">
                  <button className="relative overflow-hidden group flex items-center justify-center gap-3 w-full md:w-[320px] h-[56px] sm:h-[64px] px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transform hover:-translate-y-1 transition-all duration-300 border-t border-cyan-300/30">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <WindowsIcon className="relative z-10 w-6 h-6 sm:w-7 sm:h-7" />
                    <div className="relative z-10 flex flex-col text-left leading-tight">
                      <span className="text-[10px] sm:text-xs opacity-90 uppercase tracking-wider text-cyan-100">{tHero("downloadFor")?.split(' ')[0] || 'ดาวน์โหลดเวอร์ชัน'}</span>
                      <span className="text-sm sm:text-base">{tHero("dlWin")}</span>
                    </div>
                  </button>
                </a>
                
                <a href="/downloads/BlueBirdComposer.zxp" download className="w-full md:w-auto">
                  <button className="relative overflow-hidden group flex items-center justify-center gap-3 w-full md:w-[320px] h-[56px] sm:h-[64px] px-4 rounded-2xl bg-slate-800/80 backdrop-blur-md text-slate-200 font-bold shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-slate-700/80 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transform hover:-translate-y-1 transition-all duration-300 border border-slate-600/50 hover:border-slate-400/50">
                    <AppleIcon className="relative z-10 w-6 h-6 sm:w-7 sm:h-7" />
                    <div className="relative z-10 flex flex-col text-left leading-tight">
                      <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wider text-slate-400">{tHero("downloadFor")?.split(' ')[0] || 'ดาวน์โหลดเวอร์ชัน'}</span>
                      <span className="text-sm sm:text-base">{tHero("dlMac")}</span>
                    </div>
                  </button>
                </a>
              </div>
              
              {/* Version Info */}
              <div className="mt-8 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                <p className="text-sm sm:text-base text-slate-400 font-light tracking-wide">{tHero("versionInfo")}</p>
              </div>
            </div>
        </div>

      </main>

      {/* Basic Tools Feature Section */}
      <BasicToolsFeature />

      {/* Auto Edit Feature Section */}
      <AutoEditFeature />

      {/* Asset Filter Interactive Section */}
      <AssetFilterFeature />

      {/* Features Section */}
      <section id="features" className="relative z-30 py-20 border-t border-[var(--border)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">{tFeat("title")}</h2>
            <p className="text-gray-500">{tFeat("subtitle")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.0s', animationFillMode: 'both' }}>
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{tFeat("f1Title")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tFeat("f1Desc")}</p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-red)]/10 flex items-center justify-center text-[var(--color-brand-red)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{tFeat("f2Title")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tFeat("f2Desc")}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-green)]/10 flex items-center justify-center text-[var(--color-brand-green)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{tFeat("f3Title")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tFeat("f3Desc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
