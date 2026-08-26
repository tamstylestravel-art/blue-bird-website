"use client";

import React, { useRef, useState, MouseEvent, useCallback, useEffect } from "react";

// 1. Spotlight Wrapper
export function SpotlightWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 60%)`,
        }}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

// 2. Magnetic Button
export function MagneticButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (e.clientX - centerX) * 0.15; // Strength
    const y = (e.clientY - centerY) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// 3. Particle Input
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  tx: number;
  ty: number;
  rot: number;
  sizeClass: string;
  iconFile: string;
}

export function ParticleInput({ icon, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const particleId = useRef(0);

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    
    // Create 1-2 particles per keystroke
    const newParticles = Array.from({ length: 2 }).map(() => {
      return {
        id: particleId.current++,
        x: 10 + Math.random() * 80, // Spawn randomly along the width of the input
        y: 50, // Start around the middle vertically
        color: ['#38bdf8', '#0ea5e9', '#bae6fd'][Math.floor(Math.random() * 3)],
        sizeClass: ['w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-8 h-8'][Math.floor(Math.random() * 4)],
        iconFile: ['/feather_icon_1.svg', '/feather_icon_black_1.svg', '/feather_icon_black_2.svg'][Math.floor(Math.random() * 3)],
        tx: (Math.random() - 0.5) * 120,
        ty: -50 - Math.random() * 100,
        rot: (Math.random() - 0.5) * 180,
      };
    });

    setParticles(prev => [...prev, ...newParticles].slice(-25)); // Keep max 25 particles
    
    if (props.onChange) {
       props.onChange(e as any);
    }
  }, [props.onChange]);

  // Clean up particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div className="relative">
      <input ref={inputRef} {...props} onChange={handleInput} className={className} />
      {icon && (
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
           {icon}
         </div>
      )}
      <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute opacity-0 pointer-events-none drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `particleFly 3s ease-out forwards`,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--rot': `${p.rot}deg`,
            } as any}
          >
            {/* Feather SVG via Mask */}
            <div 
              className={`${p.sizeClass}`}
              style={{
                backgroundColor: p.color,
                WebkitMaskImage: `url('${p.iconFile}')`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
