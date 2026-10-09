'use client';

import React, { useEffect, useRef } from 'react';

export default function NetworkCloudBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 200 
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY + window.scrollY; 
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;
      glow: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        // เคลื่อนที่ช้าๆ ให้ดูเหมือนฝุ่นอวกาศ
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        
        // สุ่มสีระหว่าง Cyan กับ Purple/Blue
        const colors = [
          { c: '#22d3ee', g: '#06b6d4' }, // Cyan
          { c: '#c084fc', g: '#9333ea' }, // Purple
          { c: '#60a5fa', g: '#2563eb' }  // Blue
        ];
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        this.color = colorSet.c;
        this.glow = colorSet.g;
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) this.vx = -this.vx;
        if (this.y > canvas!.height || this.y < 0) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = '#ffffff'; // แกนกลางสีขาวสว่าง
        ctx!.shadowBlur = 15;
        ctx!.shadowColor = this.glow;
        ctx!.fill();
        ctx!.shadowBlur = 0; // reset
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 7000; // จำนวนจุดเพิ่มขึ้นนิดหน่อย
      for (let i = 0; i < Math.min(numberOfParticles, 250); i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // ตาข่ายระหว่างจุด
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            // เส้นเรืองแสง
            const alpha = 0.3 - (distance / 300);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`; // Cyan line
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            
            // วาดเส้นโค้งนิดๆ ให้ดูเหมือน Fiber แทนที่จะเป็นเส้นตรงทื่อๆ
            const midX = (particles[i].x + particles[j].x) / 2 + (Math.random() - 0.5) * 5;
            const midY = (particles[i].y + particles[j].y) / 2 + (Math.random() - 0.5) * 5;
            
            ctx.quadraticCurveTo(midX, midY, particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // เชื่อมจุดกับเมาส์
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < mouse.radius) {
          ctx.beginPath();
          const alpha = 0.6 - (distanceMouse / (mouse.radius * 1.5));
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`; // Purple/Pink line when interacting
          ctx.lineWidth = 1.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // เอฟเฟกต์ดูดเข้าหาเมาส์แบบนุ่มนวล
          particles[i].x -= dxMouse * 0.015;
          particles[i].y -= dyMouse * 0.015;
          
          // ขนาดจุดใหญ่ขึ้นเมื่ออยู่ใกล้เมาส์
          particles[i].size = particles[i].baseSize + (mouse.radius - distanceMouse) * 0.02;
        } else {
          particles[i].size = particles[i].baseSize;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020617]">
      {/* 1. อวกาศมืดๆ เป็นพื้นหลังหลัก */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black" />
      
      {/* 2. เนบิวลา/ก้อนเมฆเรืองแสง (ทำด้วย CSS Blur) */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-[40%] right-[15%] w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[10%] left-[40%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[130px] mix-blend-screen animate-[pulse_7s_ease-in-out_infinite]" />
      <div className="absolute -top-[10%] right-[40%] w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen" />

      {/* 3. ตาข่าย Network (Fiber) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-90"
      />
      
      {/* Overlay สำหรับความมืดไล่ระดับขอบๆ ให้ดูมีมิติ */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
