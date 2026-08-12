import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-panel border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Logo Placeholder - You can replace this with actual img later */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-navy flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-blue/30">
                B
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">
                Blue Bird Studio
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">Features</a>
                <a href="#download" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">Download</a>
                <a href="#contact" className="text-[var(--foreground)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">Contact</a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 py-12 lg:py-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-blue)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-blue)]"></span>
                </span>
                <span className="text-xs font-medium text-[var(--foreground)]">Blue Bird Composer is now live</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
                Create Videos <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-navy)]">
                  With Precision
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The ultimate Premiere Pro extension for seamless workflow. Manage your assets, synchronize beats, and generate previews directly within your workspace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--color-brand-blue)] text-white font-semibold shadow-lg shadow-brand-blue/30 hover:bg-[var(--color-brand-blue-dark)] transform hover:-translate-y-0.5 transition-all duration-200">
                  Get Started Free
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel text-[var(--foreground)] font-semibold hover:bg-[var(--border)] transition-colors duration-200">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Visual/Mockup */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-blue)]/20 to-transparent blur-3xl rounded-full transform scale-110 -z-10"></div>
              <div className="relative rounded-2xl glass-panel p-2 shadow-2xl border border-[var(--border)] overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-[var(--bg-dark)] rounded-xl overflow-hidden shadow-inner border border-[#333]">
                  {/* Mockup Header */}
                  <div className="flex items-center px-4 py-3 bg-[#1e1e1e] border-b border-[#333]">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-xs font-medium text-gray-400">Blue Bird Composer - Workspace</div>
                  </div>
                  {/* Mockup Body */}
                  <div className="h-64 sm:h-80 bg-[#141414] p-6 flex flex-col gap-4">
                    <div className="h-8 w-3/4 bg-[#2a2a2a] rounded animate-pulse"></div>
                    <div className="flex gap-4 h-full">
                      <div className="w-1/3 bg-[#2a2a2a] rounded-lg animate-pulse"></div>
                      <div className="w-2/3 bg-[#2a2a2a] rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Powerful tools at your fingertips</h2>
            <p className="text-gray-500">Everything you need to organize and edit your media inside Premiere Pro faster than ever before.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center text-[var(--color-brand-blue)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Asset Management</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Organize your folders, set custom cover arts, and color-code your library directly within the extension panel.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-red)]/10 flex items-center justify-center text-[var(--color-brand-red)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Audio & Beat Sync</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Advanced audio waveform preview, precise playback controls, and automatic beat detection for seamless cutting.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-green)]/10 flex items-center justify-center text-[var(--color-brand-green)] mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Auto Cut</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Instantly slice your footage perfectly to the beat. Save hours of tedious manual cutting with our smart algorithm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-blue to-brand-navy flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-semibold text-sm text-[var(--foreground)]">Blue Bird Studio</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Blue Bird Pictures Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
