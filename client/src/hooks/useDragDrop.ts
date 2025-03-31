import { useState, useRef, useEffect, RefObject } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseDragDropResult {
  isDragging: boolean;
  position: Position | null;
  handleMouseDown: (event: React.MouseEvent | React.TouchEvent) => void;
}

export function useDragDrop(
  elementRef: RefObject<HTMLElement>,
  initialPosition?: Position
): UseDragDropResult {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position | null>(initialPosition || null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialPosRef = useRef<Position | null>(null);

  // Update position if initialPosition prop changes
  useEffect(() => {
    if (initialPosition && !isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    if (!elementRef.current) return;

    // Prevent default behavior to avoid text selection
    event.preventDefault();

    let clientX: number, clientY: number;

    if ('touches' in event) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Store initial element position for calculation
    const rect = elementRef.current.getBoundingClientRect();
    initialPosRef.current = {
      x: rect.left,
      y: rect.top,
    };

    // Store drag start position
    dragStartRef.current = {
      x: clientX,
      y: clientY,
    };

    setIsDragging(true);

    // Add event listeners for move and end events
    if ('touches' in event) {
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !initialPosRef.current) return;

    // Prevent default to avoid scrolling on touch devices
    event.preventDefault();

    let clientX: number, clientY: number;

    if ('touches' in event) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Calculate the distance moved
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Update position
    setPosition({
      x: initialPosRef.current.x + deltaX,
      y: initialPosRef.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    initialPosRef.current = null;

    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return {
    isDragging,
    position,
    handleMouseDown,
  };
}
