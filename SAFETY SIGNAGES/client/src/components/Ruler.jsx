import React from 'react';

const Ruler = ({ length, isHorizontal, zoom }) => {
  const step = 100; // 100px steps
  const ticks = [];
  
  for (let i = 0; i <= length; i += step) {
    ticks.push(i);
  }

  return (
    <div 
      className={`absolute bg-slate-100/90 border-slate-300 z-40 backdrop-blur-sm pointer-events-none select-none ${isHorizontal ? 'h-6 border-b top-0 left-0' : 'w-6 border-r top-0 left-0'}`}
      style={{
        width: isHorizontal ? '100%' : '24px',
        height: isHorizontal ? '24px' : '100%',
        position: 'absolute',
        left: 0,
        top: 0
      }}
    >
      {ticks.map(tick => (
        <div 
          key={tick} 
          className="absolute text-[9px] text-slate-500 font-mono flex items-start justify-start"
          style={{
            left: isHorizontal ? tick * zoom : 0,
            top: isHorizontal ? 0 : tick * zoom,
            borderLeft: isHorizontal ? '1px solid #94a3b8' : 'none',
            borderTop: !isHorizontal ? '1px solid #94a3b8' : 'none',
            height: isHorizontal ? '12px' : '1px',
            width: isHorizontal ? '1px' : '12px',
          }}
        >
          <span className="absolute pl-1 -mt-0.5 leading-none">{tick}</span>
        </div>
      ))}
    </div>
  );
};

export default Ruler;
