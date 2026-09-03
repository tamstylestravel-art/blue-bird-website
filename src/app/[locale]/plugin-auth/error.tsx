"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function PluginAuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PluginAuth Error Boundary caught:", error);
    
    // Automatically try to recover from ChunkLoadError or AbortError
    // which happens often after new deployments when CEF cache is stale
    if (
      error.name === 'ChunkLoadError' || 
      error.message.toLowerCase().includes('fetch') || 
      error.message.toLowerCase().includes('load')
    ) {
      const hasReloaded = sessionStorage.getItem('plugin_auth_reloaded');
      if (!hasReloaded) {
        sessionStorage.setItem('plugin_auth_reloaded', 'true');
        // Append a timestamp to bypass browser cache
        const url = new URL(window.location.href);
        url.searchParams.set('t', Date.now().toString());
        window.location.replace(url.toString());
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[var(--background)]">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url(/images/User_requesting_cloud.webp)' }}
      ></div>
      
      <div className="relative z-10 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl max-w-md w-full text-center backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <Image 
            src="/images/BLUE-BIRD-PGS01.png" 
            alt="Blue Bird Logo" 
            width={200} 
            height={60} 
            className="drop-shadow-lg object-contain"
          />
        </div>
        
        <h2 className="text-xl font-bold text-red-500 mb-3">Connection Error</h2>
        <p className="text-gray-400 text-sm mb-6">
          We encountered an issue loading the authentication module. This is usually caused by a recent update or network glitch.
        </p>
        
        <button 
          onClick={() => {
            sessionStorage.removeItem('plugin_auth_reloaded');
            const url = new URL(window.location.href);
            url.searchParams.set('t', Date.now().toString());
            window.location.replace(url.toString());
          }}
          className="bg-[var(--color-brand-blue)] text-white w-full py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
