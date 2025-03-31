import React from "react";
import { motion } from "framer-motion";

interface AnimatedShapeProps {
  color: string;
  className?: string;
  initialX?: number;
  initialY?: number;
  size?: number;
  duration?: number;
  delay?: number;
  type?: 'circle' | 'square' | 'triangle' | 'blob';
}

export function AnimatedShape({
  color,
  className = "",
  initialX = 0,
  initialY = 0,
  size = 80,
  duration = 20,
  delay = 0,
  type = 'circle'
}: AnimatedShapeProps) {
  
  // Randomize movement path
  const x1 = Math.random() * 40 - 20;
  const y1 = Math.random() * 40 - 20;
  const x2 = Math.random() * 40 - 20;
  const y2 = Math.random() * 40 - 20;
  
  // Create shape path based on type
  const renderShape = () => {
    switch (type) {
      case 'circle':
        return (
          <div 
            className={`rounded-full ${className}`}
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: color,
              filter: 'blur(8px)',
              opacity: 0.6
            }}
          />
        );
      case 'square':
        return (
          <div 
            className={`rounded-md ${className}`}
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: color,
              transform: 'rotate(45deg)',
              filter: 'blur(8px)',
              opacity: 0.6
            }}
          />
        );
      case 'triangle':
        return (
          <div
            className={className}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              filter: 'blur(8px)',
              opacity: 0.6
            }}
          />
        );
      case 'blob':
        return (
          <div
            className={`${className}`}
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: '60% 40% 50% 30% / 40% 50% 60% 50%',
              filter: 'blur(8px)',
              opacity: 0.6
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{ left: initialX, top: initialY }}
      animate={{
        x: [0, x1, x2, 0],
        y: [0, y1, y2, 0],
        rotate: [0, Math.random() * 180, Math.random() * 360, 0],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
        repeatType: "loop"
      }}
    >
      {renderShape()}
    </motion.div>
  );
}

interface AnimatedShapesProps {
  className?: string;
  count?: number;
  area?: 'left' | 'right' | 'full';
}

export function AnimatedShapes({ 
  className = "",
  count = 5,
  area = 'full'
}: AnimatedShapesProps) {
  
  // Colorful vibrant palette
  const colors = [
    '#FF5F7E', // Vibrant pink
    '#6A7FDB', // Bright blue
    '#42E2B8', // Teal
    '#F9C846', // Yellow
    '#FFBD71', // Orange
    '#C355F5', // Purple
    '#35D0BA', // Seafoam
    '#FF7676'  // Coral
  ];
  
  // Shape types
  const shapeTypes: ('circle' | 'square' | 'triangle' | 'blob')[] = ['circle', 'square', 'triangle', 'blob'];
  
  // Calculate positional offsets based on area
  const getPosition = () => {
    let xRange: [number, number] = [0, 0];
    
    switch (area) {
      case 'left':
        xRange = [50, 400];
        break;
      case 'right':
        xRange = [50, 400];
        break;
      case 'full':
      default:
        xRange = [50, window.innerWidth - 100];
    }
    
    const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
    const y = Math.random() * (window.innerHeight - 200) + 100;
    
    return { x, y };
  };
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const position = getPosition();
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const randomSize = Math.random() * 50 + 50;
        const randomDuration = Math.random() * 15 + 15;
        
        return (
          <AnimatedShape
            key={i}
            color={randomColor}
            initialX={position.x}
            initialY={position.y}
            size={randomSize}
            duration={randomDuration}
            delay={i * 2}
            type={randomType}
          />
        );
      })}
    </div>
  );
}