import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const colors = [
        '#ffffff', // white
        '#E0FFFF', // light cyan
        '#87CEFA', // light sky blue
        '#FF69B4', // hot pink
        '#9370DB', // medium purple
        '#00BFFF', // deep sky blue
        '#FFA500', // orange
        '#7CFC00'  // lawn green
      ];
      
      const newStars: Star[] = [];
      
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          duration: Math.random() * 100 + 50,
          delay: Math.random() * -100,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
  }, []);
  
  return (
    <div className="cosmic-bg">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="cosmic-particle"
          initial={{ 
            x: `${star.x}vw`, 
            y: `${star.y}vh`, 
            opacity: 0 
          }}
          animate={{ 
            opacity: [0, star.opacity, star.opacity, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear"
          }}
          style={{ 
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`
          }}
        />
      ))}
    </div>
  );
}

// Animated circles that float around the background
export function FloatingCircles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-5]">
      <div
        className="absolute -top-[25vh] -left-[25vh] w-[50vh] h-[50vh] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(121,40,202,0.2) 0%, rgba(121,40,202,0.05) 50%, rgba(121,40,202,0) 70%)",
          animation: "float-circle 25s infinite ease-in-out",
        }}
      />
      
      <div
        className="absolute top-[75vh] -right-[10vh] w-[40vh] h-[40vh] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,0,128,0.2) 0%, rgba(255,0,128,0.05) 50%, rgba(255,0,128,0) 70%)",
          animation: "float-circle 18s infinite ease-in-out reverse",
        }}
      />
      
      <div
        className="absolute top-[10vh] -right-[15vh] w-[30vh] h-[30vh] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(64,190,255,0.2) 0%, rgba(64,190,255,0.05) 50%, rgba(64,190,255,0) 70%)",
          animation: "float-circle 22s infinite ease-in-out 5s",
        }}
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-circle {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(5vh, 5vh) scale(1.05); }
          50% { transform: translate(10vh, -5vh) scale(1); }
          75% { transform: translate(-5vh, 10vh) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        `
      }} />
    </div>
  );
}

// Scanlines effect like in old anime
export function Scanlines() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10 opacity-10"
      style={{
        backgroundImage: "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)",
        backgroundSize: "100% 4px",
        mixBlendMode: "overlay"
      }}
    />
  );
}

// Glitch effect for text
export function GlitchText({ 
  children,
  className,
  intense = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  intense?: boolean;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      
      <span 
        className="absolute top-0 left-0 z-[8] text-[#0ff]"
        style={{
          animation: intense 
            ? "glitch-anim-1 5s infinite linear alternate-reverse" 
            : "glitch-anim-1 15s infinite linear alternate-reverse",
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          transform: "translate(-2px, 0)"
        }}
      >
        {children}
      </span>
      
      <span 
        className="absolute top-0 left-0 z-[9] text-[#f0f]"
        style={{
          animation: intense 
            ? "glitch-anim-2 3s infinite linear alternate-reverse" 
            : "glitch-anim-2 17s infinite linear alternate-reverse",
          clipPath: "polygon(0 60%, 100% 60%, 100% 100%, 0 100%)",
          transform: "translate(2px, 0)"
        }}
      >
        {children}
      </span>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes glitch-anim-1 {
          0%, 100% { opacity: 1; transform: translate(0); }
          20% { opacity: 1; transform: translate(-2px, 1px); }
          40% { opacity: 1; transform: translate(-2px, -1px); }
          60% { opacity: 0.75; transform: translate(1px, 1px) scale(1.01); }
          80% { opacity: 0.75; transform: translate(2px, -1px); }
        }
        
        @keyframes glitch-anim-2 {
          0%, 100% { opacity: 0.75; transform: translate(0); }
          10% { opacity: 1; transform: translate(1px, 1px); }
          30% { opacity: 1; transform: translate(-1px, -1px); }
          50% { opacity: 0.75; transform: translate(1px, -1px); }
          70% { opacity: 0.75; transform: translate(-1px, 1px) scale(0.99); }
          90% { opacity: 1; transform: translate(1px, -1px); }
        }
        `
      }} />
    </div>
  );
}