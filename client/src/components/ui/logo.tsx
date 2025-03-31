import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  color?: string;
}

export function Logo({ 
  className, 
  size = 50, 
  animated = true,
  color = "#ffffff"
}: LogoProps) {
  // Animation variants for the bars
  const barVariants = {
    initial: { height: 0 },
    animate: (custom: number) => ({
      height: custom,
      transition: {
        duration: 0.5,
        delay: custom * 0.1,
        ease: [0.16, 1, 0.3, 1],
        repeat: animated ? Infinity : 0,
        repeatType: "reverse" as const,
        repeatDelay: animated ? 2 : 0
      }
    })
  };

  // Heights for each bar (percentage of container)
  const barHeights = [40, 80, 55, 70];
  
  return (
    <motion.div 
      className={cn("relative", className)}
      style={{ 
        width: size, 
        height: size,
        borderRadius: size * 0.2,
        background: "#161616",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-evenly",
        padding: size * 0.15,
        border: `${size * 0.03}px solid ${color}`,
        overflow: "hidden"
      }}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          custom={height}
          variants={barVariants}
          style={{
            width: `${size * 0.12}px`,
            borderRadius: `${size * 0.06}px`,
            backgroundColor: color,
            maxHeight: `${height}%`,
          }}
        />
      ))}
    </motion.div>
  );
}

export function LogoWithText({ 
  className, 
  size = 50,
  animated = true,
  textSize = 24,
  color = "#ffffff"
}: LogoProps & { textSize?: number }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Logo size={size} animated={animated} color={color} />
      <motion.span 
        className="font-bold ml-3"
        style={{ fontSize: textSize, color }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        DashMetrics
      </motion.span>
    </div>
  );
}