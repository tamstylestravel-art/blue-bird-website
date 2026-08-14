import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import AuthNav from "@/components/layout/AuthNav";

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
      <nav className="fixed w-full z-50 glass-panel border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/images/bird.png" alt="Blue Bird Pictures Studio Logo" className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">
                Blue Bird Pictures Studio
              </span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("features")}</a>
                <a href="#download" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("download")}</a>
                <a href="#contact" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">{tNav("contact")}</a>
              </div>
              <div className="flex items-center gap-3 border-l border-[var(--border)] pl-4">
                <LanguageSwitcher />
                <AuthNav loginText={tNav("login")} dashboardText="Dashboard" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex-grow min-h-screen flex flex-col justify-center overflow-hidden bg-[#6fb5f6]">
        {/* Layer 1: Background Sky */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/images/sky-clouds.jpeg')" }}
        ></div>
        
        {/* Layer 2: Floating Assets Image */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-16">
           <img 
             src="/images/asset-management.png" 
             alt="Asset Management" 
             className="max-w-7xl w-[90vw] md:w-[80vw] lg:w-[70vw] h-auto object-contain animate-[float_6s_ease-in-out_infinite] px-4 drop-shadow-2xl" 
           />
        </div>

        {/* Layer 3: Foreground Clouds Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-48 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/80 to-transparent pointer-events-none"></div>
      </main>

      {/* Intro Text Section */}
      <section className="relative z-30 py-24 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase drop-shadow-sm">{tHero("badge")}</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
            {tHero("title1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-blue)] to-cyan-500">
              {tHero("title2")}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {tHero("subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-bold shadow-xl shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] transform hover:-translate-y-1 transition-all duration-300">
              {tHero("getStarted")}
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-[var(--foreground)] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-sm">
              {tHero("watchDemo")}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">{tFeat("title")}</h2>
            <p className="text-gray-500">{tFeat("subtitle")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{tFeat("f1Title")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tFeat("f1Desc")}</p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-red)]/10 flex items-center justify-center text-[var(--color-brand-red)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{tFeat("f2Title")}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tFeat("f2Desc")}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
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
            <span className="font-semibold text-sm text-[var(--foreground)]">Blue Bird Pictures Studio</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Blue Bird Pictures Studio. {tFoot("rights")}</p>
        </div>
      </footer>
    </div>
  );
}
