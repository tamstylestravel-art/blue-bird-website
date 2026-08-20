"use client";

import React, { useEffect, useRef } from "react";

export default function InteractiveSkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: SmokeParticle[] = [];
    let clouds: CloudPuff[] = [];
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 3, isHovering: false };
    
    const simConfig = {
      velocityMultiplier: 1.5,
      spreadRadius: 80,
      theme: 'day' as const
    };

    const themePalettes = {
      day: {
        bgGrad: ['#e0f2fe', '#bae6fd', '#f8fafc'],
        cloudColors: ['rgba(255, 255, 255, 0.45)', 'rgba(224, 242, 254, 0.35)', 'rgba(255, 255, 255, 0.2)'],
        particleColor: 'rgba(255, 255, 255, 0.35)'
      }
    };

    function resizeCanvas() {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      initBackgroundClouds();
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovering = true;

      for (let i = 0; i < 2; i++) {
        particles.push(new SmokeParticle(mouse.x, mouse.y));
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    class CloudPuff {
      x: number;
      y: number;
      radius: number;
      speed: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * ((canvas?.height || window.innerHeight) * 0.7);
        this.radius = Math.random() * 120 + 80;
        this.speed = (Math.random() * 0.3 + 0.1);
      }
      update() {
        if (!canvas) return;
        this.x += this.speed * simConfig.velocityMultiplier;
        if (this.x - this.radius > canvas.width) {
          this.x = -this.radius;
          this.y = Math.random() * (canvas.height * 0.7);
        }
      }
      draw() {
        if (!ctx) return;
        const palette = themePalettes[simConfig.theme];
        let grad = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.radius);
        grad.addColorStop(0, palette.cloudColors[0]);
        grad.addColorStop(0.6, palette.cloudColors[1]);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      life: number;
      decay: number;

      constructor(x: number, y: number, isBurst = false) {
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? (Math.random() * 6 + 2) : (Math.random() * 1.5 + 0.5);
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.5;
        
        this.radius = isBurst ? (Math.random() * 30 + 15) : (Math.random() * 15 + 8);
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.008;
      }

      update() {
        this.x += this.vx * simConfig.velocityMultiplier;
        this.y += this.vy * simConfig.velocityMultiplier;
        this.radius += 0.4;
        this.life -= this.decay;
      }

      draw() {
        if (!ctx || this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life * 0.4;
        const palette = themePalettes[simConfig.theme];

        let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, palette.particleColor);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initBackgroundClouds() {
      clouds = [];
      for (let i = 0; i < 8; i++) {
        clouds.push(new CloudPuff());
      }
    }

    let animationId: number;

    function animateCanvas() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const palette = themePalettes[simConfig.theme];
      let bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, palette.bgGrad[0]);
      bgGrad.addColorStop(0.5, palette.bgGrad[1]);
      bgGrad.addColorStop(1, palette.bgGrad[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      clouds.forEach(c => {
        c.update();
        c.draw();
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animateCanvas);
    }

    resizeCanvas();
    animateCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
}
