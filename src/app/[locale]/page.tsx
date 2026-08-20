import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import AuthNav from "@/components/layout/AuthNav";
import { FaApple, FaWindows } from 'react-icons/fa';
import InteractiveSkyCanvas from "@/components/InteractiveSkyCanvas";
import AutoEditFeature from "@/components/AutoEditFeature";
import AssetFilterFeature from "@/components/AssetFilterFeature";

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
  const tFoot = await getTranslations("Footer");

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/75 backdrop-blur-2xl border-b border-[var(--border)] opacity-0 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
              <span className="font-k2d font-extrabold text-lg sm:text-xl tracking-tight text-[var(--foreground)] hidden sm:block">
                Blue Bird Pictures Studio
              </span>
              <span className="font-k2d font-extrabold text-lg tracking-tight text-[var(--foreground)] block sm:hidden">
                Blue Bird
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("features")}</a>
                <a href="#download" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("download")}</a>
                <a href="#contact" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("contact")}</a>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-3 border-l border-[var(--border)] pl-2 sm:pl-4">
                <LanguageSwitcher />
                <AuthNav loginText={tNav("login")} signupText={tNav("register")} dashboardText="Dashboard" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex-grow min-h-screen flex flex-col items-center justify-start sm:justify-center overflow-hidden pt-20 sm:pt-24 pb-12">
        <InteractiveSkyCanvas />
        
        {/* Layer 2: Content (Image + Text) */}
        <div className="relative z-30 w-full max-w-7xl px-4 flex flex-col items-center justify-center mt-0 sm:mt-4">
           <div className="opacity-0 animate-bounce-in-custom w-full flex justify-center mb-4 sm:mb-6" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
             <div className="animate-[float-soft_6s_ease-in-out_infinite] sm:animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }}>
               <div 
                 className="relative inline-block"
                 style={{ 
                   WebkitMaskImage: 'url(/images/BLUE-BIRD-COMPOSER-01.png)', 
                   WebkitMaskSize: 'contain', 
                   WebkitMaskRepeat: 'no-repeat', 
                   WebkitMaskPosition: 'center' 
                 }}
               >
                 <img 
                   src="/images/BLUE-BIRD-COMPOSER-01.png" 
                   alt="Blue Bird Composer" 
                   className="w-[95vw] md:w-[85vw] lg:w-[75vw] max-w-6xl h-auto object-contain drop-shadow-2xl" 
                 />
                 {/* Shine Sweep Effect */}
                 <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shine_4s_infinite_1.5s]" />
               </div>
             </div>
           </div>
           
           {/* Text Content overlaying the sky */}
           <div className="text-center space-y-5 opacity-0 animate-fade-in-up z-20" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <h1 className="flex flex-col items-center justify-center font-extrabold tracking-tight leading-tight space-y-3 sm:space-y-4">
                <div className="flex flex-row items-end justify-center flex-wrap gap-2 sm:gap-4 px-2">
                  {locale === 'th' ? (
                    <>
                      <span className="block text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-skybrand-900)] to-[var(--color-skybrand-600)] drop-shadow-sm pb-1 sm:pb-2 leading-none">ติดปีก</span>
                      <span className="block text-2xl sm:text-4xl md:text-5xl text-[var(--color-skybrand-800)] opacity-90 pb-2 sm:pb-4 leading-none">ให้งานตัดต่อของคุณ</span>
                    </>
                  ) : (
                    <>
                      <span className="block text-2xl sm:text-4xl md:text-5xl text-[var(--color-skybrand-800)] opacity-90 pb-2 sm:pb-4 leading-none">Give Your Video Editing</span>
                      <span className="block text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-skybrand-900)] to-[var(--color-skybrand-600)] drop-shadow-sm pb-1 sm:pb-2 leading-none">Wings</span>
                    </>
                  )}
                </div>
                
                <div className="mt-2 sm:mt-6 relative inline-block group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-skybrand-400)] to-[var(--color-skybrand-600)] rounded-2xl sm:rounded-3xl transform rotate-1 sm:rotate-2 scale-105 opacity-20 group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="relative px-6 py-2 sm:py-4 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl shadow-sm">
                    <span className="text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-skybrand-600)] to-[var(--color-skybrand-900)] font-black italic tracking-widest uppercase pr-2">
                      {tHero("title2")}
                    </span>
                  </div>
                </div>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                {tHero.rich("subtitle", {
                  highlight: (chunks) => <span className="font-bold text-[var(--color-skybrand-700)] bg-[var(--color-skybrand-100)] px-2 py-0.5 rounded-md mx-1">{chunks}</span>
                })}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <a href="/downloads/BlueBirdComposer_Installer.exe" download className="w-full sm:w-auto">
                  <button className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[320px] h-[50px] sm:h-[60px] px-4 sm:px-6 rounded-2xl bg-[var(--color-skybrand-900)] text-white text-sm sm:text-base font-bold shadow-xl hover:bg-black hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-[var(--color-skybrand-700)]">
                    <WindowsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wider text-[var(--color-skybrand-300)]">{tHero("downloadFor")?.split(' ')[0] || 'ดาวน์โหลดเวอร์ชัน'}</span>
                      <span>{tHero("dlWin")}</span>
                    </div>
                  </button>
                </a>
                <a href="/downloads/BlueBirdComposer.zxp" download className="w-full sm:w-auto">
                  <button className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-[320px] h-[50px] sm:h-[60px] px-4 sm:px-6 rounded-2xl bg-[var(--color-skybrand-800)] text-white text-sm sm:text-base font-bold shadow-xl hover:bg-[var(--color-skybrand-900)] hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-[var(--color-skybrand-600)]">
                    <AppleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wider text-[var(--color-skybrand-200)]">{tHero("downloadFor")?.split(' ')[0] || 'ดาวน์โหลดเวอร์ชัน'}</span>
                      <span>{tHero("dlMac")}</span>
                    </div>
                  </button>
                </a>
              </div>
            </div>
        </div>

        {/* Layer 3: Foreground Clouds Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/80 to-transparent pointer-events-none"></div>
      </main>

      {/* Auto Edit Feature Section */}
      <AutoEditFeature />

      {/* Asset Filter Interactive Section */}
      <AssetFilterFeature />

      {/* Features Section */}
      <section id="features" className="relative z-30 py-20 bg-[var(--surface)] border-t border-[var(--border)]">
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

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-6 h-6 object-contain" />
            <span className="font-k2d font-extrabold text-sm text-[var(--foreground)]">Blue Bird Pictures Studio</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Blue Bird Pictures Studio. {tFoot("rights")}</p>
        </div>
      </footer>
    </div>
  );
}
