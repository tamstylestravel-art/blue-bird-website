import React from 'react';

export default function VerticalParallaxBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden bg-black">
      {/* 
        This inner container is 200vh tall.
        Top half is the Sky image.
        Bottom half is the Ground image.
        It starts at top: 0 and animates to transform: translateY(-50%) on scroll.
      */}
      <div className="absolute top-0 left-0 w-full h-[200vh] parallax-scroll-bg">
        
        {/* Sky Section (Top 120vh) */}
        {/* Fades out smoothly in the bottom 40vh */}
        <div 
          className="absolute top-0 left-0 w-full h-[120vh] bg-cover bg-center bg-no-repeat z-10"
          style={{ 
            backgroundImage: "url('/images/Floating_mountains_in_bright_sky_1080.jpg')",
            WebkitMaskImage: 'linear-gradient(to bottom, black 66.6%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 66.6%, transparent 100%)'
          }}
        />
        
        {/* Ground Section (Bottom 120vh) */}
        {/* Overlaps with Sky in the top 40vh */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[120vh] bg-cover bg-top bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/ground_landscape.jpg')" }}
        />

      </div>
    </div>
  );
}
