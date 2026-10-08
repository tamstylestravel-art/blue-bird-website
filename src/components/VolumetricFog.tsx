import React from 'react';

export default function VolumetricFog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Layer 3 - Farthest, slowest */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat fog-parallax fog-layer-3"
        style={{ 
          backgroundImage: 'url(/images/fog_layer_3_1789482130317.jpg)', 
          mixBlendMode: 'screen',
          opacity: 0.9
        }} 
      />
      {/* Layer 2 - Mid, medium speed */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat fog-parallax fog-layer-2"
        style={{ 
          backgroundImage: 'url(/images/fog_layer_2_1789482110459.jpg)', 
          mixBlendMode: 'screen',
          opacity: 0.7
        }} 
      />
      {/* Layer 1 - Closest, fastest */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat fog-parallax fog-layer-1"
        style={{ 
          backgroundImage: 'url(/images/fog_layer_1_1789482091936.jpg)', 
          mixBlendMode: 'screen',
          opacity: 0.8
        }} 
      />
    </div>
  );
}
