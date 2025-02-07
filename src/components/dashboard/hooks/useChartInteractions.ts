
import { useState, useCallback, useEffect } from "react";

type InteractionState = 'IDLE' | 'DRAGGING' | 'RESIZING';
type Position = { x: number; y: number };

const MIN_CHART_WIDTH = 300;

export const useChartInteractions = (
  initialPosition: Position,
  initialWidth: number,
  onPositionChange: (position: Position) => void,
  onWidthChange: (width: number) => void,
  onPreferencesSave: (width: number, x: number, y: number) => void
) => {
  const [interactionState, setInteractionState] = useState<InteractionState>('IDLE');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [containerWidth, setContainerWidth] = useState(initialWidth);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (interactionState !== 'IDLE') return;
    
    e.preventDefault();
    setInteractionState('DRAGGING');
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [interactionState, position]);

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (interactionState !== 'DRAGGING') return;

    const parentRect = document.querySelector('.relative.w-full.min-h-\\[600px\\]')?.getBoundingClientRect();
    if (!parentRect) return;

    const containerRect = document.querySelector('.resize-container')?.getBoundingClientRect();
    if (!containerRect) return;

    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    newX = Math.max(0, Math.min(newX, parentRect.width - containerRect.width));
    newY = Math.max(0, Math.min(newY, parentRect.height - containerRect.height));
    
    setPosition({ x: newX, y: newY });
    onPositionChange({ x: newX, y: newY });
    onPreferencesSave(containerWidth, newX, newY);
  }, [interactionState, dragStart, containerWidth, onPositionChange, onPreferencesSave]);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (interactionState !== 'IDLE') return;
    
    e.stopPropagation();
    setInteractionState('RESIZING');
  }, [interactionState]);

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (interactionState !== 'RESIZING') return;

    const container = document.querySelector('.resize-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const parentRect = document.querySelector('.relative.w-full.min-h-\\[600px\\]')?.getBoundingClientRect();
    if (!parentRect) return;

    const maxWidth = parentRect.width - position.x;
    const newWidth = Math.max(MIN_CHART_WIDTH, Math.min(maxWidth, e.clientX - rect.left));
    
    setContainerWidth(newWidth);
    onWidthChange(newWidth);
    onPreferencesSave(newWidth, position.x, position.y);
  }, [interactionState, position.x, position.y, onWidthChange, onPreferencesSave]);

  // Handle all mouse up events
  const handleInteractionEnd = useCallback(() => {
    setInteractionState('IDLE');
  }, []);

  // Set up and clean up event listeners
  useEffect(() => {
    if (interactionState === 'DRAGGING') {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleInteractionEnd);
    } else if (interactionState === 'RESIZING') {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleInteractionEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [interactionState, handleDragMove, handleResizeMove, handleInteractionEnd]);

  return {
    interactionState,
    position,
    containerWidth,
    handleDragStart,
    handleResizeStart
  };
};
