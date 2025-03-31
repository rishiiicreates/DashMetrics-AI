import React from "react";

interface PaperTextureProps {
  className?: string;
  opacity?: number;
}

export function PaperTexture({ className = "", opacity = 0.07 }: PaperTextureProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
        mixBlendMode: 'overlay'
      }}
    />
  );
}