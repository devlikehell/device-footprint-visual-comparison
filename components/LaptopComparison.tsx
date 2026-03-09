"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Monitor, Usb, Maximize, Layers, Download, Filter, Terminal, X, Square, Box, Ruler } from 'lucide-react';
import { ThreeDViewer } from './ThreeDViewer';

const DATABASE = [
  { id: "t14", type: "Laptop", name: "ThinkPad T14 Gen 6", w: 315.9, d: 223.7, h: 17.7, color: "#ef4444", ports: "2x USB-C, 2x USB-A, HDMI, Audio", portIcons: ['C', 'C', 'A', 'A', 'H', 'J'] },
  { id: "x13", type: "Laptop", name: "ThinkPad X13 Gen 6", w: 299.3, d: 207.0, h: 13.3, color: "#3b82f6", ports: "2x USB-C, 2x USB-A, HDMI, Audio", portIcons: ['C', 'C', 'A', 'A', 'H', 'J'] },
  { id: "m2air", type: "Laptop", name: "MacBook Air M2", w: 304.1, d: 215.0, h: 11.3, color: "#22c55e", ports: "2x USB-C, MagSafe, Audio", portIcons: ['M', 'C', 'C', 'J'] },
  { id: "mbp16", type: "Laptop", name: "MacBook Pro 16 M3", w: 355.7, d: 248.1, h: 16.8, color: "#10b981", ports: "3x USB-C, MagSafe, HDMI, SD, Audio", portIcons: ['M', 'C', 'C', 'C', 'H', 'J'] },
  { id: "ip15p", type: "Phone", name: "iPhone 15 Pro", w: 70.6, d: 146.6, h: 8.25, color: "#f59e0b", ports: "USB-C", portIcons: ['C'] },
  { id: "s24u", type: "Phone", name: "Galaxy S24 Ultra", w: 79.0, d: 162.3, h: 8.6, color: "#8b5cf6", ports: "USB-C", portIcons: ['C'] },
  { id: "ipadp13", type: "Tablet", name: "iPad Pro 13 M4", w: 215.5, d: 281.6, h: 5.1, color: "#ec4899", ports: "USB-C", portIcons: ['C'] },
  { id: "kindle", type: "E-Reader", name: "Kindle Paperwhite", w: 124.6, d: 174.2, h: 8.1, color: "#6366f1", ports: "USB-C", portIcons: ['C'] },
  { id: "bq501", type: "PC Case", name: "be quiet! Pure Base 501", w: 231, d: 450, h: 463, color: "#94a3b8", ports: "1x USB-C, 2x USB-A, Audio", portIcons: ['C', 'A', 'A', 'J'] },
  { id: "jonsboz20", type: "PC Case", name: "Jonsbo Z20", w: 186, d: 370, h: 295, color: "#fbbf24", ports: "1x USB-C, 1x USB-A, Audio", portIcons: ['C', 'A', 'J'] },
];

const DEVICE_TYPES = ["Laptop", "Phone", "Tablet", "E-Reader", "PC Case"];

const PORT_NAMES: Record<string, string> = {
  'C': 'USB-C',
  'A': 'USB-A',
  'H': 'HDMI',
  'J': 'Audio Jack',
  'M': 'MagSafe',
  'S': 'SD Card'
};

const getPortWidth = (type: string) => {
  if (type === 'C') return 12;
  if (type === 'A') return 14;
  if (type === 'H') return 16;
  if (type === 'J') return 6;
  if (type === 'M') return 14;
  if (type === 'S') return 18;
  return 10;
};

const renderPortIcon = (type: string, x: number, y: number, isDark: boolean) => {
  const width = getPortWidth(type);
  const height = 4;
  const color = isDark ? '#000000' : '#ffffff';
  const stroke = isDark ? '#4ade80' : '#000000';

  if (type === 'C') return <rect x={x} y={y - 2} width={width} height={height} rx={2} fill={color} stroke={stroke} strokeWidth="1" />;
  if (type === 'A') return <rect x={x} y={y - 2} width={width} height={height} rx={0} fill={color} stroke={stroke} strokeWidth="1" />;
  if (type === 'H') return <polygon points={`${x},${y-2} ${x+width},${y-2} ${x+width-2},${y+2} ${x+2},${y+2}`} fill={color} stroke={stroke} strokeWidth="1" />;
  if (type === 'J') return <circle cx={x + 3} cy={y} r={3} fill={color} stroke={stroke} strokeWidth="1" />;
  if (type === 'M') return <rect x={x} y={y - 2} width={width} height={height} rx={1} fill={color} stroke={stroke} strokeWidth="1" />;
  if (type === 'S') return <rect x={x} y={y - 2} width={width} height={height} rx={0} fill={color} stroke={stroke} strokeWidth="1" />;
  return <rect x={x} y={y - 2} width={width} height={height} fill={color} stroke={stroke} strokeWidth="1" />;
};

const RetroWindow = ({ 
  title, 
  children, 
  action = null, 
  borderColor, 
  panelBg, 
  shadow, 
  titleBg, 
  isDark, 
  textColor 
}: { 
  title: string, 
  children: React.ReactNode, 
  action?: React.ReactNode,
  borderColor: string,
  panelBg: string,
  shadow: string,
  titleBg: string,
  isDark: boolean,
  textColor: string
}) => (
  <div className={`border-2 ${borderColor} ${panelBg} ${shadow} flex flex-col mb-8`}>
    <div className={`px-2 py-1 border-b-2 ${borderColor} ${titleBg} flex justify-between items-center`}>
      <span className="font-bold tracking-widest text-sm uppercase">{title}</span>
      <div className="flex gap-2 items-center">
        {action}
        <div className={`w-4 h-4 border-2 ${isDark ? 'border-black bg-[#4ade80]' : 'border-white bg-black text-white'} flex items-center justify-center text-[10px] font-bold cursor-pointer`}>■</div>
      </div>
    </div>
    <div className={`p-4 ${textColor}`}>
      {children}
    </div>
  </div>
);

export default function LaptopComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["t14", "m2air", "ip15p"]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [isDark, setIsDark] = useState<boolean>(false); // Default to Light mode (Unix X11 vibe)
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [show3D, setShow3D] = useState<boolean>(false);

  // Theme variables
  const themeBg = isDark ? 'bg-black' : 'bg-[#a0a0a0]';
  const panelBg = isDark ? 'bg-black' : 'bg-[#dfdfdf]';
  const borderColor = isDark ? 'border-[#4ade80]' : 'border-black';
  const textColor = isDark ? 'text-[#4ade80]' : 'text-black';
  const titleBg = isDark ? 'bg-[#4ade80] text-black' : 'bg-black text-white';
  const shadow = isDark ? 'shadow-[4px_4px_0px_0px_#4ade80]' : 'shadow-[4px_4px_0px_0px_#000000]';
  const gridColor = isDark ? '#14532d' : '#999999';
  const mutedBg = isDark ? 'bg-[#052e16]' : 'bg-[#cccccc]';

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleType = (type: string) => {
    setActiveTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const filteredDatabase = useMemo(() => {
    if (activeTypes.length === 0) return DATABASE;
    return DATABASE.filter(d => activeTypes.includes(d.type));
  }, [activeTypes]);

  const selectedDevices = useMemo(() => {
    return DATABASE.filter(l => selectedIds.includes(l.id))
      .sort((a, b) => (b.w * b.d) - (a.w * a.d));
  }, [selectedIds]);

  const maxW = Math.max(...selectedDevices.map(l => l.w), 320);
  const maxD = Math.max(...selectedDevices.map(l => l.d), 240);
  
  const thicknessGap = 30;
  const profileData = useMemo(() => {
    return selectedDevices.map((device, index) => {
      const previousHeight = selectedDevices.slice(0, index).reduce((sum, d) => sum + d.h + thicknessGap, 0);
      return { ...device, yPos: 20 + previousHeight };
    });
  }, [selectedDevices]);

  const totalThicknessHeight = profileData.length > 0 ? profileData[profileData.length - 1].yPos + profileData[profileData.length - 1].h + 20 : 100;

  const exportSvg = (svgId: string, filename: string) => {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 ${themeBg} ${textColor} pb-12`}>
      {/* CRT Scanline Effect for Dark Mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden crt-flicker">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      )}

      {/* Top Menu Bar */}
      <div className={`border-b-2 px-4 py-1 flex justify-between items-center ${panelBg} ${borderColor} ${textColor}`}>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-widest items-center">
          <button onClick={() => setShowGrid(!showGrid)} className="cursor-pointer hover:underline flex items-center gap-1">
            <Layers className="w-3 h-3" /> Grid
          </button>
          <button onClick={() => setShow3D(!show3D)} className={`cursor-pointer hover:underline flex items-center gap-1 ${show3D ? 'underline text-[#4ade80]' : ''}`}>
            <Box className="w-3 h-3" /> 3D Mode
          </button>
          <button onClick={() => setSelectedIds([])} className="cursor-pointer hover:underline">Clear</button>
          <button onClick={() => exportSvg('footprint-svg', 'footprint.svg')} className="cursor-pointer hover:underline flex items-center gap-1">
            <Download className="w-3 h-3" /> Footprint
          </button>
          <button onClick={() => exportSvg('profile-svg', 'profile.svg')} className="cursor-pointer hover:underline flex items-center gap-1">
            <Download className="w-3 h-3" /> Profile
          </button>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)} 
          className={`px-3 py-0.5 border-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            isDark ? 'border-[#4ade80] hover:bg-[#4ade80] hover:text-black' : 'border-black hover:bg-black hover:text-white'
          }`}
        >
          {isDark ? 'xsetroot -solid gray' : 'xsetroot -solid black'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1600px] mx-auto p-4 sm:p-8 mt-4">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <RetroWindow 
            title="/etc/filters.conf"
            borderColor={borderColor}
            panelBg={panelBg}
            shadow={shadow}
            titleBg={titleBg}
            isDark={isDark}
            textColor={textColor}
          >
            <div className="grid grid-cols-2 gap-2">
              {DEVICE_TYPES.map(type => {
                const isActive = activeTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-2 py-1.5 text-xs font-bold uppercase border-2 transition-colors ${
                      isActive 
                        ? (isDark ? 'bg-[#4ade80] text-black border-[#4ade80]' : 'bg-black text-white border-black')
                        : `bg-transparent ${borderColor} hover:${mutedBg}`
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </RetroWindow>

          <RetroWindow 
            title="/etc/devices.conf"
            borderColor={borderColor}
            panelBg={panelBg}
            shadow={shadow}
            titleBg={titleBg}
            isDark={isDark}
            textColor={textColor}
          >
            <div className="mb-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest">Select Targets:</span>
              <button 
                onClick={() => setSelectedIds([])} 
                className={`px-2 py-1 text-[10px] font-bold uppercase border-2 transition-colors ${
                  isDark ? 'border-[#4ade80] hover:bg-[#4ade80] hover:text-black' : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                Clear Selection
              </button>
            </div>
            <div className={`p-2 space-y-1 max-h-[600px] overflow-y-auto border-2 ${borderColor} ${mutedBg}`}>
              {filteredDatabase.map(device => {
                const isSelected = selectedIds.includes(device.id);
                const isHovered = hoveredId === device.id;
                return (
                  <label 
                    key={device.id}
                    className={`flex items-center gap-3 p-2 cursor-pointer transition-colors border-2 ${
                      isSelected 
                        ? (isDark ? 'border-[#4ade80] bg-[#14532d]' : 'border-black bg-[#a0a0a0]') 
                        : 'border-transparent hover:border-dashed hover:border-current'
                    } ${isHovered ? (isDark ? 'bg-[#14532d]/50' : 'bg-black/10') : ''}`}
                    onMouseEnter={() => setHoveredId(device.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleSelection(device.id)} />
                    <div className={`w-4 h-4 border-2 flex items-center justify-center text-[10px] font-bold ${borderColor}`}>
                      {isSelected ? 'X' : ' '}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide`}>
                      {device.name} <span className="text-[10px] opacity-70 ml-1">[{device.type}]</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </RetroWindow>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {selectedDevices.length === 0 ? (
            <div className={`h-64 flex items-center justify-center border-2 border-dashed ${borderColor} ${panelBg}`}>
              <p className="font-bold uppercase tracking-widest animate-pulse">Awaiting Selection...</p>
            </div>
          ) : (
            <>
              {show3D ? (
                <RetroWindow 
                  title="/usr/bin/3d_viewer"
                  borderColor={borderColor}
                  panelBg={panelBg}
                  shadow={shadow}
                  titleBg={titleBg}
                  isDark={isDark}
                  textColor={textColor}
                  action={<Box className="w-4 h-4" />}
                >
                  <div className={`relative w-full aspect-[16/9] border-2 ${borderColor} ${mutedBg} overflow-hidden`}>
                    <ThreeDViewer devices={selectedDevices} hoveredId={hoveredId} setHoveredId={setHoveredId} isDark={isDark} />
                  </div>
                </RetroWindow>
              ) : (
                <>
                  <RetroWindow 
                    title="/usr/bin/footprint"
                    borderColor={borderColor}
                    panelBg={panelBg}
                    shadow={shadow}
                    titleBg={titleBg}
                    isDark={isDark}
                    textColor={textColor}
                  >
                    <div className={`relative w-full aspect-[4/3] max-h-[600px] flex items-center justify-center border-2 ${borderColor} ${mutedBg} p-4 overflow-hidden`}>
                      <svg id="footprint-svg" viewBox={`0 0 ${maxW + 300} ${Math.max(maxD + 40, selectedDevices.length * 25 + 60)}`} className="w-full h-full" style={{ maxHeight: '100%', maxWidth: '100%' }}>
                        <defs>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridColor} strokeWidth="1" strokeDasharray="2 2"/>
                          </pattern>
                          {selectedDevices.map(d => (
                            <marker key={`arrow-${d.id}`} id={`arrow-${d.id}`} markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                              <path d="M 0 0 L 8 4 L 0 8 Z" fill={d.color} />
                            </marker>
                          ))}
                        </defs>
                        <rect width="100%" height="100%" fill={isDark ? '#000000' : '#c0c0c0'} />
                        {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}
                        {selectedDevices.map((device, i) => {
                          const isHovered = hoveredId === device.id;
                          const opacity = hoveredId ? (isHovered ? 0.4 : 0.05) : 0.2;
                          const strokeOpacity = hoveredId ? (isHovered ? 1 : 0.2) : 0.8;
                          
                          const xCorner = 20 + device.w;
                          const yCorner = 20 + device.d;
                          const labelY = 40 + i * 25;
                          const labelX = maxW + 60;

                          return (
                            <g key={device.id} className="transition-all duration-300 ease-in-out cursor-pointer" onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                              <rect x={20} y={20} width={device.w} height={device.d} fill={device.color} fillOpacity={opacity} rx={0} className="transition-all duration-300" />
                              <rect x={20} y={20} width={device.w} height={device.d} fill="none" stroke={device.color} strokeWidth={isHovered ? 3 : 1.5} strokeOpacity={strokeOpacity} rx={0} className="transition-all duration-300" filter={isHovered ? "url(#glow)" : undefined} />
                              
                              {/* CAD Leader Line */}
                              <path 
                                d={`M ${labelX} ${labelY} L ${xCorner + 20} ${labelY} L ${xCorner} ${yCorner}`}
                                fill="none"
                                stroke={device.color}
                                strokeWidth="1.5"
                                opacity={strokeOpacity}
                                strokeDasharray="4 2"
                                markerEnd={`url(#arrow-${device.id})`}
                                className="transition-all duration-300"
                              />
                              
                              {/* CAD Label */}
                              <text 
                                x={labelX + 5} 
                                y={labelY + 4} 
                                fill={device.color} 
                                fontSize={11} 
                                fontWeight="bold"
                                fontFamily="monospace"
                                opacity={strokeOpacity}
                                className="uppercase tracking-wider transition-all duration-300"
                              >
                                {device.name} [{device.w}×{device.d}]
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </RetroWindow>

                  <RetroWindow 
                    title="/usr/bin/side_profile"
                    borderColor={borderColor}
                    panelBg={panelBg}
                    shadow={shadow}
                    titleBg={titleBg}
                    isDark={isDark}
                    textColor={textColor}
                  >
                    <div className={`relative w-full overflow-x-auto border-2 ${borderColor} ${mutedBg} p-6`}>
                      <svg id="profile-svg" viewBox={`0 0 520 ${totalThicknessHeight}`} className="w-full min-w-[450px] h-auto">
                        <defs>
                          <filter id="glow-profile" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                          {selectedDevices.map(d => (
                            <marker key={`thick-arrow-${d.id}`} id={`thick-arrow-${d.id}`} markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                              <path d="M 0 0 L 8 4 L 0 8 Z" fill={d.color} />
                            </marker>
                          ))}
                        </defs>
                        {profileData.map((device) => {
                          const yPos = device.yPos;
                          const isHovered = hoveredId === device.id;
                          const opacity = hoveredId ? (isHovered ? 1 : 0.3) : 0.85;
                          return (
                            <g key={`thick-${device.id}`} className="transition-all duration-300 cursor-pointer" onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                              <text x={0} y={yPos + Math.min(device.h / 2, 15)} dominantBaseline="middle" fill={isHovered ? device.color : (isDark ? '#4ade80' : '#404040')} fontSize={11} fontWeight="bold" fontFamily="monospace" className="uppercase tracking-wider transition-colors duration-300">
                                {device.name}
                              </text>
                              
                              {/* CAD Leader Line for Thickness */}
                              <line 
                                x1={135} y1={yPos + Math.min(device.h / 2, 15)} 
                                x2={165} y2={yPos + Math.min(device.h / 2, 15)} 
                                stroke={device.color} 
                                strokeWidth={isHovered ? 2.5 : 1.5} 
                                opacity={opacity}
                                strokeDasharray="4 2"
                                markerEnd={`url(#thick-arrow-${device.id})`}
                                className="transition-all duration-300"
                              />

                              <rect x={175} y={yPos} width={260} height={device.h} fill={device.color} fillOpacity={opacity} rx={0} className="transition-all duration-300" filter={isHovered ? "url(#glow-profile)" : undefined} />
                              
                              {/* Draw Ports */}
                              {(() => {
                                let currentX = 175 + 15; // Start padding
                                // For very tall devices (PC cases), we draw ports at the top
                                const portY = device.h > 40 ? yPos + 15 : yPos + device.h / 2;
                                return device.portIcons.map((port, pIdx) => {
                                  const pWidth = getPortWidth(port);
                                  const element = (
                                    <g key={pIdx} className="transition-all duration-300">
                                      {/* Draw ports as black holes on the colored laptop body */}
                                      {renderPortIcon(port, currentX, portY, isDark)}
                                    </g>
                                  );
                                  currentX += pWidth + 8; // spacing between ports
                                  return element;
                                });
                              })()}

                              <text x={450} y={yPos + Math.min(device.h / 2, 15)} dominantBaseline="middle" fill={device.color} fillOpacity={opacity} fontSize={12} fontWeight="bold" fontFamily="monospace" className="transition-all duration-300">
                                {device.h} mm
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Port Legend */}
                    <div className={`mt-6 p-4 border-2 ${borderColor} ${panelBg}`}>
                      <h4 className={`text-xs font-bold uppercase mb-4 border-b-2 ${borderColor} pb-2`}>Port Legend</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                        {Object.entries(PORT_NAMES).map(([key, name]) => (
                          <div key={key} className="flex items-center gap-3">
                            <svg width="24" height="12" viewBox="0 0 24 12" className="flex-shrink-0">
                              {/* Draw legend ports using the theme's text color */}
                              {renderPortIcon(key, 12 - getPortWidth(key)/2, 6, isDark)}
                            </svg>
                            <span className="text-[10px] sm:text-xs uppercase font-bold">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RetroWindow>
                </>
              )}

              <RetroWindow 
                title="/var/log/specs.log"
                borderColor={borderColor}
                panelBg={panelBg}
                shadow={shadow}
                titleBg={titleBg}
                isDark={isDark}
                textColor={textColor}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className={`uppercase ${mutedBg} border-b-2 ${borderColor} tracking-widest`}>
                      <tr>
                        <th className={`px-4 py-3 font-bold border-r-2 ${borderColor}`}>Device</th>
                        <th className={`px-4 py-3 font-bold border-r-2 ${borderColor}`}>Dimensions</th>
                        <th className="px-4 py-3 font-bold">Ports</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y-2 ${isDark ? 'divide-[#00ff00]' : 'divide-black'}`}>
                      {selectedDevices.map(device => (
                        <tr key={`table-${device.id}`} className={`transition-colors ${hoveredId === device.id ? mutedBg : 'hover:opacity-80'}`} onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                          <td className={`px-4 py-3 font-bold flex items-center gap-3 border-r-2 ${borderColor} uppercase`}>
                            <div className={`w-3 h-3 border-2 ${borderColor}`} style={{ backgroundColor: device.color }} />
                            {device.name}
                          </td>
                          <td className={`px-4 py-3 font-bold border-r-2 ${borderColor}`}>{device.w} × {device.d} × {device.h} mm</td>
                          <td className="px-4 py-3 font-medium">{device.ports}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </RetroWindow>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
