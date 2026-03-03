"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Monitor, Usb, Maximize, Layers, Download, Filter, Terminal, X, Square } from 'lucide-react';

const DATABASE = [
  { id: "t14", type: "Laptop", name: "ThinkPad T14 Gen 6", w: 315.9, d: 223.7, h: 17.7, color: "#ef4444", ports: "2x USB-C, 2x USB-A, HDMI, Audio", portIcons: ['C', 'C', 'A', 'A', 'H', 'J'] },
  { id: "x13", type: "Laptop", name: "ThinkPad X13 Gen 6", w: 299.3, d: 207.0, h: 13.3, color: "#3b82f6", ports: "2x USB-C, 2x USB-A, HDMI, Audio", portIcons: ['C', 'C', 'A', 'A', 'H', 'J'] },
  { id: "m2air", type: "Laptop", name: "MacBook Air M2", w: 304.1, d: 215.0, h: 11.3, color: "#22c55e", ports: "2x USB-C, MagSafe, Audio", portIcons: ['M', 'C', 'C', 'J'] },
  { id: "mbp16", type: "Laptop", name: "MacBook Pro 16 M3", w: 355.7, d: 248.1, h: 16.8, color: "#10b981", ports: "3x USB-C, MagSafe, HDMI, SD, Audio", portIcons: ['M', 'C', 'C', 'C', 'H', 'J'] },
  { id: "xps13", type: "Laptop", name: "Dell XPS 13", w: 295.3, d: 199.1, h: 14.8, color: "#f97316", ports: "2x USB-C", portIcons: ['C', 'C'] },
  { id: "ip15p", type: "Phone", name: "iPhone 15 Pro", w: 70.6, d: 146.6, h: 8.25, color: "#8b5cf6", ports: "1x USB-C", portIcons: ['C'] },
  { id: "ip15pm", type: "Phone", name: "iPhone 15 Pro Max", w: 76.7, d: 159.9, h: 8.25, color: "#6366f1", ports: "1x USB-C", portIcons: ['C'] },
  { id: "s24u", type: "Phone", name: "Galaxy S24 Ultra", w: 79.0, d: 162.3, h: 8.6, color: "#d946ef", ports: "1x USB-C", portIcons: ['C'] },
  { id: "pxl8p", type: "Phone", name: "Pixel 8 Pro", w: 76.5, d: 162.6, h: 8.8, color: "#ec4899", ports: "1x USB-C", portIcons: ['C'] },
  { id: "ipad11", type: "Tablet", name: "iPad Pro 11", w: 177.5, d: 249.7, h: 5.3, color: "#0ea5e9", ports: "1x USB-C", portIcons: ['C'] },
  { id: "ipadmini", type: "Tablet", name: "iPad Mini 6", w: 134.8, d: 195.4, h: 6.3, color: "#06b6d4", ports: "1x USB-C", portIcons: ['C'] },
  { id: "tabs9u", type: "Tablet", name: "Galaxy Tab S9 Ultra", w: 326.4, d: 208.6, h: 5.5, color: "#38bdf8", ports: "1x USB-C", portIcons: ['C'] },
  { id: "surfp11", type: "Tablet", name: "Surface Pro 11", w: 287.0, d: 209.0, h: 9.3, color: "#a855f7", ports: "2x USB-C, Surface Connect", portIcons: ['C', 'C', 'M'] },
  { id: "kindle", type: "E-Reader", name: "Kindle Paperwhite", w: 124.6, d: 174.2, h: 8.1, color: "#14b8a6", ports: "1x USB-C", portIcons: ['C'] },
  { id: "rm2", type: "E-Reader", name: "reMarkable 2", w: 188.0, d: 246.0, h: 4.7, color: "#64748b", ports: "1x USB-C", portIcons: ['C'] },
  { id: "steamdeck", type: "Handheld", name: "Steam Deck OLED", w: 298.0, d: 117.0, h: 49.0, color: "#f43f5e", ports: "1x USB-C, Audio", portIcons: ['C', 'J'] },
  { id: "switch", type: "Handheld", name: "Switch OLED", w: 242.0, d: 102.0, h: 13.9, color: "#ef4444", ports: "1x USB-C, Audio", portIcons: ['C', 'J'] },
];

const DEVICE_TYPES = Array.from(new Set(DATABASE.map(d => d.type)));

const PORT_NAMES: Record<string, string> = {
  'C': 'USB-C / USB4',
  'A': 'USB-A',
  'H': 'HDMI',
  'J': 'Audio Jack',
  'M': 'MagSafe / Surface',
  'S': 'SD Card'
};

const getPortWidth = (portType: string) => {
  switch (portType) {
    case 'C': return 8.4;
    case 'A': return 12;
    case 'H': return 14;
    case 'J': return 3.5;
    case 'M': return 10;
    case 'S': return 24;
    default: return 0;
  }
};

const renderPortIcon = (portType: string, x: number, yCenter: number, isDark: boolean) => {
  // Ports are always drawn as "holes" (black) regardless of the theme, 
  // except in dark mode where we might want them to be neon green if drawn on a black background.
  // We'll use the theme's text color for the legend, and black for the actual laptop body holes.
  const fill = isDark ? '#00ff00' : '#000000';
  const innerFill = isDark ? '#000000' : '#ffffff';
  
  switch (portType) {
    case 'C': // USB-C
      return (
        <g>
          <rect x={x} y={yCenter - 1.3} width={8.4} height={2.6} rx={0} fill={fill} />
          <rect x={x + 1.5} y={yCenter - 0.5} width={5.4} height={1} rx={0} fill={innerFill} />
        </g>
      );
    case 'A': // USB-A
      return (
        <g>
          <rect x={x} y={yCenter - 2.25} width={12} height={4.5} rx={0} fill={fill} />
          <rect x={x + 1} y={yCenter - 1.25} width={10} height={2.5} rx={0} fill={innerFill} />
        </g>
      );
    case 'H': // HDMI
      return (
        <path d={`M ${x} ${yCenter - 2.25} h 14 v 3 l -1.5 1.5 h -11 l -1.5 -1.5 Z`} fill={fill} />
      );
    case 'J': // Audio Jack
      return <rect x={x} y={yCenter - 1.75} width={3.5} height={3.5} rx={0} fill={fill} />;
    case 'M': // MagSafe / Surface Connect
      return <rect x={x} y={yCenter - 1} width={10} height={2} rx={0} fill={fill} />;
    case 'S': // SD Card
      return <rect x={x} y={yCenter - 1.05} width={24} height={2.1} rx={0} fill={fill} />;
    default:
      return null;
  }
};

export default function LaptopComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["t14", "m2air", "ip15p"]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [isDark, setIsDark] = useState<boolean>(false); // Default to Light mode (Unix X11 vibe)

  // Theme variables
  const themeBg = isDark ? 'bg-black' : 'bg-[#a0a0a0]';
  const panelBg = isDark ? 'bg-black' : 'bg-[#dfdfdf]';
  const borderColor = isDark ? 'border-[#00ff00]' : 'border-black';
  const textColor = isDark ? 'text-[#00ff00]' : 'text-black';
  const titleBg = isDark ? 'bg-[#00ff00] text-black' : 'bg-black text-white';
  const shadow = isDark ? 'shadow-[4px_4px_0px_0px_#00ff00]' : 'shadow-[4px_4px_0px_0px_#000000]';
  const gridColor = isDark ? '#003300' : '#999999';
  const mutedBg = isDark ? 'bg-[#001100]' : 'bg-[#cccccc]';

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
  const thicknessSpacing = 40;
  const totalThicknessHeight = selectedDevices.length * thicknessSpacing + 20;

  const exportSvg = () => {
    const svg = document.getElementById('footprint-svg');
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
    link.download = 'device-footprint.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const RetroWindow = ({ title, children, action = null }: { title: string, children: React.ReactNode, action?: React.ReactNode }) => (
    <div className={`border-2 ${borderColor} ${panelBg} ${shadow} flex flex-col mb-8`}>
      <div className={`px-2 py-1 border-b-2 ${borderColor} ${titleBg} flex justify-between items-center`}>
        <span className="font-bold tracking-widest text-sm uppercase">{title}</span>
        <div className="flex gap-2 items-center">
          {action}
          <div className={`w-4 h-4 border-2 ${isDark ? 'border-black bg-[#00ff00]' : 'border-white bg-black text-white'} flex items-center justify-center text-[10px] font-bold cursor-pointer`}>■</div>
        </div>
      </div>
      <div className={`p-4 ${textColor}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 ${themeBg} ${textColor} pb-12`}>
      {/* Top Menu Bar */}
      <div className={`border-b-2 px-4 py-1 flex justify-between items-center ${panelBg} ${borderColor} ${textColor}`}>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-widest">
          <span className="cursor-pointer hover:underline">Host</span>
          <span className="cursor-pointer hover:underline">Display</span>
          <span className="cursor-pointer hover:underline">Config</span>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)} 
          className={`px-3 py-0.5 border-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            isDark ? 'border-[#00ff00] hover:bg-[#00ff00] hover:text-black' : 'border-black hover:bg-black hover:text-white'
          }`}
        >
          {isDark ? 'xsetroot -solid gray' : 'xsetroot -solid black'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1600px] mx-auto p-4 sm:p-8 mt-4">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <RetroWindow title="/etc/filters.conf">
            <div className="grid grid-cols-2 gap-2">
              {DEVICE_TYPES.map(type => {
                const isActive = activeTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-2 py-1.5 text-xs font-bold uppercase border-2 transition-colors ${
                      isActive 
                        ? (isDark ? 'bg-[#00ff00] text-black border-[#00ff00]' : 'bg-black text-white border-black')
                        : `bg-transparent ${borderColor} hover:${mutedBg}`
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </RetroWindow>

          <RetroWindow title="/etc/devices.conf">
            <div className="mb-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest">Select Targets:</span>
              <button 
                onClick={() => setSelectedIds([])} 
                className={`px-2 py-1 text-[10px] font-bold uppercase border-2 transition-colors ${
                  isDark ? 'border-[#00ff00] hover:bg-[#00ff00] hover:text-black' : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                Clear Selection
              </button>
            </div>
            <div className={`p-2 space-y-1 max-h-[600px] overflow-y-auto border-2 ${borderColor} ${mutedBg}`}>
              {filteredDatabase.map(device => {
                const isSelected = selectedIds.includes(device.id);
                return (
                  <label 
                    key={device.id}
                    className={`flex items-center gap-3 p-2 cursor-pointer transition-colors border-2 ${
                      isSelected 
                        ? (isDark ? 'border-[#00ff00] bg-[#003300]' : 'border-black bg-[#a0a0a0]') 
                        : 'border-transparent hover:border-dashed hover:border-current'
                    }`}
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
              <RetroWindow 
                title="/usr/bin/footprint" 
                action={
                  <button onClick={exportSvg} className={`mr-2 px-2 py-0.5 text-[10px] font-bold uppercase border-2 ${isDark ? 'border-black bg-[#00ff00] text-black hover:bg-black hover:text-[#00ff00] hover:border-[#00ff00]' : 'border-white bg-[#dfdfdf] text-black hover:bg-black hover:text-white hover:border-black'} transition-colors`}>
                    Export SVG
                  </button>
                }
              >
                <div className={`relative w-full aspect-[4/3] max-h-[600px] flex items-center justify-center border-2 ${borderColor} ${mutedBg} p-4 overflow-hidden`}>
                  <svg id="footprint-svg" viewBox={`0 0 ${maxW + 300} ${Math.max(maxD + 40, selectedDevices.length * 25 + 60)}`} className="w-full h-full" style={{ maxHeight: '100%', maxWidth: '100%' }}>
                    <defs>
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
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {selectedDevices.map((device, i) => {
                      const isHovered = hoveredId === device.id;
                      const opacity = hoveredId ? (isHovered ? 0.4 : 0.05) : 0.2;
                      const strokeOpacity = hoveredId ? (isHovered ? 1 : 0.2) : 0.8;
                      
                      const xCorner = 20 + device.w;
                      const yCorner = 20 + device.d;
                      const labelY = 40 + i * 25;
                      const labelX = maxW + 60;

                      return (
                        <g key={device.id} className="transition-all duration-300 ease-in-out" onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                          <rect x={20} y={20} width={device.w} height={device.d} fill={device.color} fillOpacity={opacity} rx={0} className="transition-all duration-300" />
                          <rect x={20} y={20} width={device.w} height={device.d} fill="none" stroke={device.color} strokeWidth={isHovered ? 3 : 1.5} strokeOpacity={strokeOpacity} rx={0} className="transition-all duration-300" />
                          
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

              <RetroWindow title="/usr/bin/side_profile">
                <div className={`relative w-full overflow-x-auto border-2 ${borderColor} ${mutedBg} p-6`}>
                  <svg viewBox={`0 0 520 ${totalThicknessHeight}`} className="w-full min-w-[450px] h-auto">
                    <defs>
                      {selectedDevices.map(d => (
                        <marker key={`thick-arrow-${d.id}`} id={`thick-arrow-${d.id}`} markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                          <path d="M 0 0 L 8 4 L 0 8 Z" fill={d.color} />
                        </marker>
                      ))}
                    </defs>
                    {selectedDevices.map((device, i) => {
                      const yPos = 20 + i * thicknessSpacing;
                      const isHovered = hoveredId === device.id;
                      const opacity = hoveredId ? (isHovered ? 1 : 0.3) : 0.85;
                      return (
                        <g key={`thick-${device.id}`} className="transition-all duration-300 cursor-pointer" onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                          <text x={0} y={yPos + device.h / 2} dominantBaseline="middle" fill={isHovered ? device.color : (isDark ? '#00aa00' : '#404040')} fontSize={11} fontWeight="bold" fontFamily="monospace" className="uppercase tracking-wider transition-colors duration-300">
                            {device.name}
                          </text>
                          
                          {/* CAD Leader Line for Thickness */}
                          <line 
                            x1={135} y1={yPos + device.h / 2} 
                            x2={165} y2={yPos + device.h / 2} 
                            stroke={device.color} 
                            strokeWidth="1.5" 
                            opacity={opacity}
                            strokeDasharray="4 2"
                            markerEnd={`url(#thick-arrow-${device.id})`}
                            className="transition-all duration-300"
                          />

                          <rect x={175} y={yPos} width={260} height={device.h} fill={device.color} fillOpacity={opacity} rx={0} className="transition-all duration-300" />
                          
                          {/* Draw Ports */}
                          {(() => {
                            let currentX = 175 + 15; // Start padding
                            return device.portIcons.map((port, pIdx) => {
                              const pWidth = getPortWidth(port);
                              const element = (
                                <g key={pIdx} className="transition-all duration-300">
                                  {/* Draw ports as black holes on the colored laptop body */}
                                  {renderPortIcon(port, currentX, yPos + device.h / 2, false)}
                                </g>
                              );
                              currentX += pWidth + 6; // Add spacing between ports
                              return element;
                            });
                          })()}

                          <text x={450} y={yPos + device.h / 2} dominantBaseline="middle" fill={device.color} fillOpacity={opacity} fontSize={12} fontWeight="bold" fontFamily="monospace" className="transition-all duration-300">
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

              <RetroWindow title="/var/log/specs.log">
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
