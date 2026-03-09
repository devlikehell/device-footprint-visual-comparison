"use client";

import React, { useState } from 'react';

interface Device {
  id: string;
  name: string;
  w: number;
  d: number;
  h: number;
  color: string;
  type: string;
  ports: string;
}

interface ThreeDViewerProps {
  devices: Device[];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  isDark: boolean;
}

interface CubeProps {
  device: Device;
  isHovered: boolean;
  isDark: boolean;
  scale: number;
  xOffset: number;
  onHover: (id: string) => void;
  onLeave: () => void;
}

const Cube = ({ 
  device, 
  isHovered, 
  isDark, 
  scale,
  xOffset,
  onHover,
  onLeave
}: CubeProps) => {
  const width = device.w * scale;
  const depth = device.d * scale;
  const height = device.h * scale;

  const wireframeColor = isDark ? 'rgba(74, 222, 128, 0.2)' : 'rgba(0,0,0,0.1)';
  const baseColor = device.color;
  
  // Lighting simulation: Adjust brightness based on face orientation
  const getFaceStyle = (transform: string, shading: number, w: number, h: number) => ({
    transform,
    width: `${w}px`,
    height: `${h}px`,
    backgroundColor: baseColor,
    borderColor: isHovered ? (isDark ? '#4ade80' : '#000') : wireframeColor,
    borderWidth: isHovered ? '2px' : '1px',
    opacity: isHovered ? 0.4 : 0.15,
    filter: `brightness(${shading})`,
    // Removed transitions for instant hover feedback
  });

  return (
    <div 
      className="absolute preserve-3d cursor-pointer"
      onMouseEnter={() => onHover(device.id)}
      onMouseLeave={() => onLeave()}
      style={{ 
        transform: `translate3d(${xOffset}px, 0, ${-depth / 2}px)`,
        width: `${width}px`,
        height: `${height}px`,
        transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)', // Smooth layout changes
      }}
    >
      {/* Shadow on floor */}
      <div 
        className="absolute"
        style={{
          width: `${width * 1.2}px`,
          height: `${depth * 1.2}px`,
          left: `${-width * 0.1}px`,
          top: `${-depth * 0.1}px`,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
          transform: `rotateX(90deg) translate3d(0, 0, 0px)`,
          opacity: isHovered ? 0.6 : 0.2,
          pointerEvents: 'none'
        }}
      />

      {/* Front */}
      <div className="absolute inset-0 border" style={getFaceStyle(`translate3d(0, 0, ${depth}px)`, 1.0, width, height)} />
      {/* Back */}
      <div className="absolute inset-0 border" style={getFaceStyle(`translate3d(0, 0, 0)`, 0.7, width, height)} />
      {/* Left */}
      <div className="absolute inset-0 border" style={getFaceStyle(`rotateY(-90deg)`, 0.8, depth, height)} />
      {/* Right */}
      <div className="absolute inset-0 border" style={getFaceStyle(`rotateY(-90deg) translate3d(0, 0, ${-width}px)`, 0.9, depth, height)} />
      {/* Top */}
      <div className="absolute inset-0 border" style={getFaceStyle(`rotateX(90deg) translate3d(0, 0, ${height}px)`, 1.2, width, depth)} />
      {/* Bottom */}
      <div className="absolute inset-0 border" style={getFaceStyle(`rotateX(90deg) translate3d(0, 0, 0)`, 0.5, width, depth)} />

      {/* CAD Dimensions - Bezier Curves */}
      <div className={`absolute inset-0 preserve-3d pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-40'}`}>
        {/* Width Label */}
        <div 
          className="absolute"
          style={{ 
            transform: `translate3d(0, ${height + 20}px, ${depth}px)`,
            width: `${width}px`,
            height: '40px'
          }}
        >
          <svg width="100%" height="100%" className="overflow-visible">
            <path 
              d={`M 0 0 Q ${width/2} 20 ${width} 0`} 
              fill="none" 
              stroke={isDark ? '#4ade80' : '#000'} 
              strokeWidth="1" 
              strokeDasharray="2 2"
            />
            <circle cx="0" cy="0" r="1.5" fill={isDark ? '#4ade80' : '#000'} />
            <circle cx={width} cy="0" r="1.5" fill={isDark ? '#4ade80' : '#000'} />
          </svg>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className={`text-[8px] font-mono ${isDark ? 'text-[#4ade80]' : 'text-black'} bg-inherit px-1`}>{device.w}mm</span>
          </div>
        </div>

        {/* Height Label */}
        <div 
          className="absolute"
          style={{ 
            transform: `translate3d(${width + 20}px, 0, ${depth}px)`,
            width: '40px',
            height: `${height}px`
          }}
        >
          <svg width="100%" height="100%" className="overflow-visible">
            <path 
              d={`M 0 0 Q 20 ${height/2} 0 ${height}`} 
              fill="none" 
              stroke={isDark ? '#4ade80' : '#000'} 
              strokeWidth="1" 
              strokeDasharray="2 2"
            />
            <circle cx="0" cy="0" r="1.5" fill={isDark ? '#4ade80' : '#000'} />
            <circle cx="0" cy={height} r="1.5" fill={isDark ? '#4ade80' : '#000'} />
          </svg>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center">
            <span className={`text-[8px] font-mono ${isDark ? 'text-[#4ade80]' : 'text-black'} whitespace-nowrap`}>{device.h}mm</span>
          </div>
        </div>

        {/* Depth Label */}
        <div 
          className="absolute"
          style={{ 
            transform: `translate3d(${width}px, ${height}px, 0) rotateY(-90deg)`,
            width: `${depth}px`,
            height: '40px'
          }}
        >
          <svg width="100%" height="100%" className="overflow-visible">
            <path 
              d={`M 0 0 Q ${depth/2} 20 ${depth} 0`} 
              fill="none" 
              stroke={isDark ? '#4ade80' : '#000'} 
              strokeWidth="1" 
              strokeDasharray="2 2"
            />
            <circle cx="0" cy="0" r="1.5" fill={isDark ? '#4ade80' : '#000'} />
            <circle cx={depth} cy="0" r="1.5" fill={isDark ? '#4ade80' : '#000'} />
          </svg>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className={`text-[8px] font-mono ${isDark ? 'text-[#4ade80]' : 'text-black'} bg-inherit px-1`}>{device.d}mm</span>
          </div>
        </div>
      </div>
      
      {/* Name Label */}
      <div 
        className={`absolute whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}
        style={{ 
          transform: `translate3d(0, ${height + 60}px, ${depth}px)`,
          color: device.color,
          textShadow: isDark ? '0 0 8px currentColor' : 'none'
        }}
      >
        {device.name}
      </div>

      {/* Port Tooltip */}
      {isHovered && (
        <div 
          className={`absolute z-50 p-2 border-2 ${isDark ? 'bg-black border-[#4ade80] text-[#4ade80]' : 'bg-white border-black text-black'} whitespace-nowrap animate-in fade-in zoom-in slide-in-from-bottom-2`}
          style={{ 
            transform: `translate3d(${width / 2}px, -40px, ${depth}px) translate(-50%, -100%)`,
            boxShadow: isDark ? '0 0 15px rgba(74, 222, 128, 0.3)' : '4px 4px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="text-[9px] font-bold border-b border-current mb-1 pb-1 uppercase tracking-tighter">I/O Interfaces</div>
          <div className="text-[8px] font-mono leading-tight">{device.ports}</div>
        </div>
      )}
    </div>
  );
};

export const ThreeDViewer = ({ devices, hoveredId, setHoveredId, isDark }: ThreeDViewerProps) => {
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Dynamic scaling to fit viewport (considering multiple devices side-by-side)
  const totalRawWidth = devices.reduce((acc, d) => acc + d.w, 0) + (devices.length - 1) * 40;
  const maxRawHeight = Math.max(...devices.map(d => d.h), 100);
  const maxRawDepth = Math.max(...devices.map(d => d.d), 100);
  const scale = Math.min(0.5, 700 / totalRawWidth, 350 / maxRawHeight, 350 / maxRawDepth);

  // Calculate layout for side-by-side comparison
  let currentX = 0;
  const gap = 40 * scale; // 40mm gap between objects
  const devicesWithPos = devices.map(d => {
    const w = d.w * scale;
    const x = currentX;
    currentX += w + gap;
    return { ...d, x, scaledW: w };
  });
  const totalW = currentX - gap;
  const startX = -totalW / 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden cursor-move select-none perspective-[1200px] ${isDark ? 'bg-black' : 'bg-[#c0c0c0]'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="relative preserve-3d transition-transform duration-100 ease-out"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate3d(0, 50px, 0)`,
        }}
      >
        {/* Grid Floor */}
        <div 
          className="absolute border border-current opacity-10"
          style={{ 
            width: '3000px', 
            height: '3000px', 
            transform: 'rotateX(90deg) translate3d(-1500px, -1500px, 0px)',
            backgroundImage: `linear-gradient(${isDark ? '#4ade80' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#4ade80' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Origin Axis Helper */}
        <div className="absolute preserve-3d opacity-40">
          <div className="absolute w-40 h-[1px] bg-red-500" style={{ transform: 'translate3d(0,0,0)' }} />
          <div className="absolute w-[1px] h-40 bg-green-500" style={{ transform: 'rotateZ(90deg) origin-top-left' }} />
          <div className="absolute w-40 h-[1px] bg-blue-500" style={{ transform: 'rotateY(-90deg) origin-left' }} />
          <div className={`absolute text-[8px] font-bold ${isDark ? 'text-[#4ade80]' : 'text-black'}`} style={{ transform: 'translate3d(45px, 5px, 0)' }}>X (W)</div>
          <div className={`absolute text-[8px] font-bold ${isDark ? 'text-[#4ade80]' : 'text-black'}`} style={{ transform: 'translate3d(5px, 45px, 0) rotateZ(-90deg)' }}>Y (H)</div>
          <div className={`absolute text-[8px] font-bold ${isDark ? 'text-[#4ade80]' : 'text-black'}`} style={{ transform: 'rotateY(-90deg) translate3d(45px, 5px, 0)' }}>Z (D)</div>
        </div>

        {devicesWithPos.map((device) => (
          <Cube 
            key={device.id} 
            device={device} 
            isHovered={hoveredId === device.id} 
            isDark={isDark}
            scale={scale}
            xOffset={startX + device.x}
            onHover={setHoveredId}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
        <div className={`px-2 py-1 border-2 ${isDark ? 'border-[#4ade80] bg-black text-[#4ade80]' : 'border-black bg-white text-black'} text-[10px] font-bold uppercase`}>
          CAD Comparison View
        </div>
        <div className={`px-2 py-1 border ${isDark ? 'border-[#4ade80]/30 text-[#4ade80]/70' : 'border-black/30 text-black/70'} text-[9px] font-mono`}>
          X: RED (WIDTH) | Y: GREEN (HEIGHT) | Z: BLUE (DEPTH)
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className={`px-2 py-1 border-2 ${isDark ? 'border-[#4ade80] bg-black text-[#4ade80]' : 'border-black bg-white text-black'} text-[10px] font-bold uppercase`}>
          Drag to Rotate | Hover to Inspect
        </div>
      </div>
    </div>
  );
};
