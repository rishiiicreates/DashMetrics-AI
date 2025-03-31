import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Random geometric shapes and doodles to add playfulness to the UI
export function DoodleDecorator({ className }: { className?: string }) {
  const colors = [
    "#FF7A5A", // Coral
    "#FFB85A", // Amber
    "#FFE55A", // Yellow
    "#8CC251", // Green
    "#34BBE6", // Blue
    "#A78AE6", // Purple
    "#F25C99"  // Pink
  ];

  // Generate a random position within constraints
  const getRandomPos = (max: number) => Math.floor(Math.random() * max);
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  
  // Generate 10-15 random doodle elements
  const doodleCount = Math.floor(Math.random() * 6) + 10;
  const doodles = Array.from({ length: doodleCount }, (_, i) => {
    const size = Math.floor(Math.random() * 40) + 15;
    // 0: circle, 1: square, 2: star, 3: triangle, 4: zigzag, 5: plus sign, 6: hexagon
    const type = Math.floor(Math.random() * 7); 
    const color = getRandomColor();
    const top = getRandomPos(90) + '%';
    const left = getRandomPos(90) + '%';
    const rotation = Math.floor(Math.random() * 360) + 'deg';
    const opacity = (Math.random() * 0.4 + 0.2).toFixed(2); // Between 0.2 and 0.6
    
    const style = {
      top,
      left,
      transform: `rotate(${rotation})`,
      borderColor: color,
      backgroundColor: type === 1 || type === 5 || type === 6 ? `${color}${Math.floor(parseInt(opacity) * 255).toString(16).padStart(2, '0')}` : 'transparent',
      width: (type === 0 || type === 1 || type === 5) ? size + 'px' : undefined,
      height: (type === 0 || type === 1 || type === 5) ? size + 'px' : undefined,
      borderTopColor: type === 3 ? color : undefined,
      borderWidth: (type === 0 || type === 1) ? Math.floor(Math.random() * 2) + 1 + 'px' : undefined,
      opacity
    };
    
    if (type === 0) {
      // Circle
      return <div key={i} className="doodle-circle" style={style} />;
    } else if (type === 1) {
      // Square
      return <div key={i} className="doodle-square" style={style} />;
    } else if (type === 2) {
      // Star
      return (
        <svg key={i} className="doodle-star" style={{...style, width: size + 'px', height: size + 'px'}} viewBox="0 0 24 24" fill={`${color}20`} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else if (type === 3) {
      // Triangle
      return <div key={i} className="doodle-triangle" style={{...style, borderTopWidth: '20px', borderTopColor: color}} />;
    } else if (type === 4) {
      // Zigzag pattern
      return (
        <svg key={i} className="doodle-zigzag" style={{...style, width: (size * 1.5) + 'px', height: (size * 0.8) + 'px'}} viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,20 L20,0 L40,20 L60,0 L80,20 L100,0" 
            stroke={color} 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (type === 5) {
      // Plus sign
      return (
        <div key={i} className="doodle-plus" style={{
          ...style,
          position: 'absolute',
          width: size + 'px',
          height: size + 'px'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '100%',
            height: (size / 5) + 'px',
            backgroundColor: color,
            transform: 'translateY(-50%)',
            borderRadius: (size / 10) + 'px'
          }}></div>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            height: '100%',
            width: (size / 5) + 'px',
            backgroundColor: color,
            transform: 'translateX(-50%)',
            borderRadius: (size / 10) + 'px'
          }}></div>
        </div>
      );
    } else {
      // Hexagon
      return (
        <svg key={i} className="doodle-hexagon" style={{...style, width: size + 'px', height: size + 'px'}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="12,2 22,7 22,17 12,22 2,17 2,7" 
            fill={`${color}20`}
            stroke={color} 
            strokeWidth="1"
          />
        </svg>
      );
    }
  });

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {doodles}
    </div>
  );
}

// Paper-style card with doodle decorations
export function PaperCard({ 
  children, 
  className,
  withDoodles = true
}: { 
  children: ReactNode, 
  className?: string,
  withDoodles?: boolean
}) {
  return (
    <div className={cn("paper-card relative p-4", className)}>
      {withDoodles && <DoodleDecorator />}
      {children}
    </div>
  );
}

// Highlight box with colorful underline
export function HighlightBox({ 
  children, 
  className 
}: { 
  children: ReactNode, 
  className?: string 
}) {
  return (
    <div className={cn("highlight-box", className)}>
      {children}
    </div>
  );
}

// Interactive button with animation
export function DoodleButton({ 
  children, 
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  children: ReactNode
}) {
  return (
    <button 
      className={cn("animated-button py-2 px-4 rounded-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

// Sketchy styled container 
export function SketchBox({ 
  children, 
  className 
}: { 
  children: ReactNode, 
  className?: string 
}) {
  return (
    <div className={cn("sketchy-border relative", className)}>
      {children}
    </div>
  );
}

// Handwritten style text
export function HandwrittenText({ 
  children, 
  className,
  as: Component = 'span'
}: { 
  children: ReactNode, 
  className?: string,
  as?: React.ElementType
}) {
  return (
    <Component className={cn("handwritten", className)}>
      {children}
    </Component>
  );
}