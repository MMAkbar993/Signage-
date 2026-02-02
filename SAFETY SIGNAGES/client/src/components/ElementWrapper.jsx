import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

const ElementWrapper = ({ 
  element, 
  isSelected, 
  onSelect, 
  onChange, 
  zoom, 
  children 
}) => {
  const { id, x, y, width, height } = element;
  
  // Local state for smooth interactions without parent round-trips
  const [localState, setLocalState] = useState({ x, y, width, height });
  const isInteracting = useRef(false);
  const startRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Sync local state with props when not interacting
  useEffect(() => {
    if (!isInteracting.current) {
      setLocalState({ x, y, width, height });
    }
  }, [x, y, width, height]);

  const handleResizeStart = (e, direction, ref) => {
    isInteracting.current = true;
    startRef.current = {
      x: localState.x,
      y: localState.y,
      width: localState.width,
      height: localState.height
    };
  };

  const handleResize = (e, direction, ref, d) => {
    const start = startRef.current;
    let newX = start.x;
    let newY = start.y;
    
    // Calculate new position based on direction
    // If we resize from left, x must decrease by the amount width increases
    if (direction.includes('left')) {
      newX = start.x - d.width;
    }
    if (direction.includes('top')) {
      newY = start.y - d.height;
    }

    const newWidth = start.width + d.width;
    const newHeight = start.height + d.height;

    const newState = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    };

    setLocalState(newState);
    
    // Optional: Notify parent for live updates (e.g. property panel)
    // We pass true for isResizing to avoid history snapshots
    onChange(id, newState, true);
  };

  const handleResizeStop = (e, direction, ref, d) => {
    const start = startRef.current;
    let newX = start.x;
    let newY = start.y;
    
    if (direction.includes('left')) {
      newX = start.x - d.width;
    }
    if (direction.includes('top')) {
      newY = start.y - d.height;
    }

    const finalState = {
      width: start.width + d.width,
      height: start.height + d.height,
      x: newX,
      y: newY
    };

    setLocalState(finalState);
    isInteracting.current = false;
    
    onChange(id, finalState, false); // Commit to history
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    onSelect(id, e);
    isInteracting.current = true;
  };

  const handleDrag = (e, d) => {
    const newState = { ...localState, x: d.x, y: d.y };
    setLocalState(newState);
    onChange(id, { x: d.x, y: d.y }, true);
  };

  const handleDragStop = (e, d) => {
    isInteracting.current = false;
    onChange(id, { x: d.x, y: d.y }, false);
  };

  return (
    <Draggable
      position={{ x: localState.x, y: localState.y }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      cancel=".resize-handle"
      scale={zoom}
    >
      <div 
        className={`absolute top-0 left-0 group/element ${isSelected ? 'z-50' : 'z-10'}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id, e);
        }}
      >
        <Resizable
          size={{ width: localState.width, height: localState.height }}
          scale={zoom}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          onResize={handleResize} 
          enable={{ 
            top: true, right: true, bottom: true, left: true, 
            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true 
          }}
          className={`${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border border-blue-400' : 'hover:ring-1 hover:ring-blue-300 ring-offset-1 border border-transparent'}`}
          handleClasses={{
            bottomRight: 'resize-handle',
            bottomLeft: 'resize-handle',
            topRight: 'resize-handle',
            topLeft: 'resize-handle',
            top: 'resize-handle',
            bottom: 'resize-handle',
            left: 'resize-handle',
            right: 'resize-handle'
          }}
          handleStyles={{
            bottomRight: { cursor: 'se-resize', width: '20px', height: '20px', right: '-10px', bottom: '-10px' },
            bottomLeft: { cursor: 'sw-resize', width: '20px', height: '20px', left: '-10px', bottom: '-10px' },
            topRight: { cursor: 'ne-resize', width: '20px', height: '20px', right: '-10px', top: '-10px' },
            topLeft: { cursor: 'nw-resize', width: '20px', height: '20px', left: '-10px', top: '-10px' },
            top: { cursor: 'n-resize', height: '10px', top: '-5px' },
            bottom: { cursor: 's-resize', height: '10px', bottom: '-5px' },
            left: { cursor: 'w-resize', width: '10px', left: '-5px' },
            right: { cursor: 'e-resize', width: '10px', right: '-5px' }
          }}
        >
          {/* Resize Handles (Only show when selected) */}
          {isSelected && (
            <>
              <div className="resize-handle absolute -left-1.5 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute left-1/2 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-x-1/2"></div>
              <div className="resize-handle absolute -right-1.5 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute -right-1.5 top-1/2 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-y-1/2"></div>
              <div className="resize-handle absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-x-1/2"></div>
              <div className="resize-handle absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute -left-1.5 top-1/2 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-y-1/2"></div>
            </>
          )}

          {/* Render Children (The actual content) */}
          <div 
            className="w-full h-full overflow-hidden relative"
            style={{ opacity: element.opacity !== undefined ? element.opacity : 1 }}
          >
            {children}
          </div>

        </Resizable>
      </div>
    </Draggable>
  );
};

export default ElementWrapper;
