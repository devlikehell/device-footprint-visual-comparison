"use client";

import React, { useState, useMemo } from 'react';
import { Monitor, Usb, Maximize, Layers, Download, Filter } from 'lucide-react';

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

const renderPortIcon = (portType: string, x: number, yCenter: number, opacity: number) => {
  const fill = `rgba(15, 23, 42, ${opacity})`; // slate-900
  const innerFill = `rgba(255, 255, 255, ${opacity * 0.5})`;
  
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4 sm:p-8 font-mono">
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 flex items-center gap-2 uppercase">
            <Layers className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            Device Footprint
          </h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Compare physical dimensions and ports.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <div className="flex flex-wrap gap-2">
            {DEVICE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-2 py-1 text-xs font-bold uppercase border-2 transition-colors ${
                  activeTypes.includes(type) 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
          <div className="p-3 border-b-2 border-slate-900 bg-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Devices</h2>
          </div>
          <div className="p-2 space-y-1 max-h-[500px] overflow-y-auto">
            {filteredDatabase.map(device => {
              const isSelected = selectedIds.includes(device.id);
              return (
                <label 
                  key={device.id}
                  className={`flex items-center gap-3 p-2 cursor-pointer transition-colors border-2 ${isSelected ? 'bg-slate-100 border-slate-900' : 'border-transparent hover:border-slate-300'}`}
                  onMouseEnter={() => setHoveredId(device.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleSelection(device.id)} />
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-400'}`}>
                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                    {device.name} <span className="text-[10px] text-slate-400 ml-1">[{device.type}]</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 min-w-0">
        {selectedDevices.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-white border-2 border-slate-900 border-dashed">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Select at least one device</p>
          </div>
        ) : (
          <>
            <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6 border-b-2 border-slate-900 pb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                  <Maximize className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                  Top-Down Footprint
                </h3>
                <button onClick={exportSvg} className="flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-white bg-white hover:bg-slate-900 border-2 border-slate-900 px-3 py-1.5 transition-colors uppercase tracking-widest">
                  <Download className="w-4 h-4" strokeWidth={2.5} /> Export SVG
                </button>
              </div>
              <div className="relative w-full aspect-[4/3] max-h-[600px] flex items-center justify-center bg-slate-50 border-2 border-slate-900 p-4 overflow-hidden">
                <svg id="footprint-svg" viewBox={`0 0 ${maxW + 300} ${Math.max(maxD + 40, selectedDevices.length * 25 + 60)}`} className="w-full h-full" style={{ maxHeight: '100%', maxWidth: '100%' }}>
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2"/>
                    </pattern>
                  </defs>
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
                          d={`M ${xCorner} ${yCorner} L ${xCorner + 20} ${labelY} L ${labelX} ${labelY}`}
                          fill="none"
                          stroke={device.color}
                          strokeWidth="1.5"
                          opacity={strokeOpacity}
                          strokeDasharray="4 2"
                          className="transition-all duration-300"
                        />
                        <circle cx={xCorner} cy={yCorner} r="3" fill={device.color} opacity={strokeOpacity} className="transition-all duration-300" />
                        
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
            </div>

            <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-6 overflow-hidden mt-8">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest border-b-2 border-slate-900 pb-4">
                <Monitor className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                Thickness & Ports
              </h3>
              <div className="relative w-full overflow-x-auto bg-slate-50 border-2 border-slate-900 p-6">
                <svg viewBox={`0 0 500 ${totalThicknessHeight}`} className="w-full min-w-[400px] h-auto">
                  {selectedDevices.map((device, i) => {
                    const yPos = 20 + i * thicknessSpacing;
                    const isHovered = hoveredId === device.id;
                    const opacity = hoveredId ? (isHovered ? 1 : 0.3) : 0.85;
                    return (
                      <g key={`thick-${device.id}`} className="transition-all duration-300 cursor-pointer" onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                        <text x={0} y={yPos + device.h / 2} dominantBaseline="middle" fill={isHovered ? device.color : "#475569"} fontSize={11} fontWeight="bold" fontFamily="monospace" className="uppercase tracking-wider transition-colors duration-300">
                          {device.name}
                        </text>
                        <rect x={160} y={yPos} width={260} height={device.h} fill={device.color} fillOpacity={opacity} rx={0} className="transition-all duration-300" />
                        
                        {/* Draw Ports */}
                        {(() => {
                          let currentX = 160 + 15; // Start padding
                          return device.portIcons.map((port, pIdx) => {
                            const pWidth = getPortWidth(port);
                            const element = (
                              <g key={pIdx} className="transition-all duration-300">
                                {renderPortIcon(port, currentX, yPos + device.h / 2, opacity)}
                              </g>
                            );
                            currentX += pWidth + 6; // Add spacing between ports
                            return element;
                          });
                        })()}

                        <text x={435} y={yPos + device.h / 2} dominantBaseline="middle" fill={device.color} fillOpacity={opacity} fontSize={12} fontWeight="bold" fontFamily="monospace" className="transition-all duration-300">
                          {device.h} mm
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden mt-8">
              <div className="p-6 border-b-2 border-slate-900 bg-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                  <Usb className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                  Specifications
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="text-slate-900 uppercase bg-slate-200 border-b-2 border-slate-900 tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-bold border-r-2 border-slate-900">Device</th>
                      <th className="px-6 py-4 font-bold border-r-2 border-slate-900">Dimensions</th>
                      <th className="px-6 py-4 font-bold">Ports</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-900">
                    {selectedDevices.map(device => (
                      <tr key={`table-${device.id}`} className={`transition-colors ${hoveredId === device.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onMouseEnter={() => setHoveredId(device.id)} onMouseLeave={() => setHoveredId(null)}>
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3 border-r-2 border-slate-900 uppercase">
                          <div className="w-3 h-3 border border-slate-900" style={{ backgroundColor: device.color }} />
                          {device.name}
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-bold border-r-2 border-slate-900">{device.w} × {device.d} × {device.h} mm</td>
                        <td className="px-6 py-4 text-slate-900 font-medium">{device.ports}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
