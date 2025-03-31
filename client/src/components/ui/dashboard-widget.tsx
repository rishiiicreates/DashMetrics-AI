import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDragDrop } from "@/hooks/useDragDrop";
import { motion } from "framer-motion";

interface DashboardWidgetProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  initialPos?: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
}

export default function DashboardWidget({
  id,
  className,
  children,
  initialPos,
  onPositionChange
}: DashboardWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { isDragging, position, handleMouseDown } = useDragDrop(widgetRef, initialPos);
  
  // Call onPositionChange callback when position changes
  useEffect(() => {
    if (onPositionChange && position) {
      onPositionChange(id, position);
    }
  }, [id, position, onPositionChange]);
  
  return (
    <motion.div
      ref={widgetRef}
      className={cn(
        "absolute",
        isDragging && "z-50",
        className
      )}
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
        <div 
          className="absolute top-0 left-0 right-0 h-6 bg-transparent cursor-move"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        />
        {children}
      </Card>
    </motion.div>
  );
}
