import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';

export const LinearFunctionLab: React.FC = () => {
  // Primary line d1: y = a1*x + b1
  const [a1, setA1] = useState<number>(2);
  const [b1, setB1] = useState<number>(1);

  // Comparison line d2: y = a2*x + b2 (optional comparison mode)
  const [showD2, setShowD2] = useState<boolean>(false);
  const [a2, setA2] = useState<number>(-1);
  const [b2, setB2] = useState<number>(3);

  // Canvas bounds: -5 to +5 on both axes
  const minX = -6;
  const maxX = 6;
  const minY = -6;
  const maxY = 6;

  const width = 420;
  const height = 400;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * width;
  const toSvgY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

  // Points for line 1
  const xLeft = minX;
  const yLeft1 = a1 * xLeft + b1;
  const xRight = maxX;
  const yRight1 = a1 * xRight + b1;

  // Points for line 2
  const yLeft2 = a2 * xLeft + b2;
  const yRight2 = a2 * xRight + b2;

  // Intercepts of line 1
  const xIntercept1 = a1 !== 0 ? -b1 / a1 : null;
  const yIntercept1 = b1;

  // Angle alpha in degrees
  const angleAlpha = a1 > 0 ? (Math.atan(a1) * 180) / Math.PI : 180 + (Math.atan(a1) * 180) / Math.PI;

  // Relative position status
  let relativeStatus = '';
  if (showD2) {
    if (a1 === a2 && b1 === b2) {
      relativeStatus = 'Hai đường thẳng TRÙNG NHAU (a₁ = a₂, b₁ = b₂)';
    } else if (a1 === a2 && b1 !== b2) {
      relativeStatus = 'Hai đường thẳng SONG SONG (a₁ = a₂, b₁ ≠ b₂)';
    } else if (a1 * a2 === -1) {
      relativeStatus = 'Hai đường thẳng VUÔNG GÓC VỚI NHAU (a₁ · a₂ = -1)';
    } else {
      relativeStatus = 'Hai đường thẳng CẮT NHAU (a₁ ≠ a₂)';
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">Mô phỏng Đại số THCS · Khối 9</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Đồ Thị & Tính Chất Hàm Số Bậc Nhất y = ax + b</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Khám phá trực quan hệ số góc <span className="font-mono font-bold text-blue-600">a</span>, tung độ gốc <span className="font-mono font-bold text-emerald-600">b</span> và vị trí tương đối giữa hai đường thẳng.
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            setShowD2(!showD2);
          }}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            showD2 
              ? 'bg-rose-50 border-rose-300 text-rose-700' 
              : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {showD2 ? 'Ẩn đường thẳng d₂' : '+ Thêm đường thẳng d₂ để so sánh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Cartesian Canvas: 7 cols */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[420px]">
          <div className="absolute top-3 left-4 text-xs font-mono text-slate-400">
            Hệ tọa độ Oxy: <span className="text-blue-400 font-bold">d₁: y = {a1}x {b1 >= 0 ? `+ ${b1}` : `- ${Math.abs(b1)}`}</span>
            {showD2 && <span className="text-rose-400 font-bold ml-3">d₂: y = {a2}x {b2 >= 0 ? `+ ${b2}` : `- ${Math.abs(b2)}`}</span>}
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[420px] h-auto drop-shadow-md">
            {/* Grid lines */}
            {Array.from({ length: 13 }).map((_, i) => {
              const val = i - 6;
              const xPos = toSvgX(val);
              const yPos = toSvgY(val);
              return (
                <g key={`grid-${i}`}>
                  <line x1={xPos} y1="0" x2={xPos} y2={height} stroke="#1e293b" strokeWidth="0.8" />
                  <line x1="0" y1={yPos} x2={width} y2={yPos} stroke="#1e293b" strokeWidth="0.8" />
                  {val !== 0 && (
                    <>
                      <text x={xPos} y={toSvgY(0) + 12} fill="#64748b" fontSize="9" textAnchor="middle" className="font-mono">{val}</text>
                      <text x={toSvgX(0) - 8} y={yPos + 3} fill="#64748b" fontSize="9" textAnchor="end" className="font-mono">{val}</text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Coordinate Axes */}
            <line x1="0" y1={toSvgY(0)} x2={width} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={toSvgX(0)} y1="0" x2={toSvgX(0)} y2={height} stroke="#94a3b8" strokeWidth="1.5" />

            {/* Axis labels */}
            <text x={width - 15} y={toSvgY(0) - 6} fill="#f1f5f9" fontSize="12" fontWeight="bold">x</text>
            <text x={toSvgX(0) + 8} y="15" fill="#f1f5f9" fontSize="12" fontWeight="bold">y</text>
            <text x={toSvgX(0) - 10} y={toSvgY(0) + 14} fill="#cbd5e1" fontSize="11" fontWeight="bold">O</text>

            {/* Line d2 if active */}
            {showD2 && (
              <line 
                x1={toSvgX(xLeft)} 
                y1={toSvgY(yLeft2)} 
                x2={toSvgX(xRight)} 
                y2={toSvgY(yRight2)} 
                stroke="#f43f5e" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
              />
            )}

            {/* Line d1 */}
            <line 
              x1={toSvgX(xLeft)} 
              y1={toSvgY(yLeft1)} 
              x2={toSvgX(xRight)} 
              y2={toSvgY(yRight1)} 
              stroke="#38bdf8" 
              strokeWidth="3" 
            />

            {/* y-intercept point (0, b1) */}
            <circle cx={toSvgX(0)} cy={toSvgY(yIntercept1)} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            
            {/* x-intercept point (-b1/a1, 0) */}
            {xIntercept1 !== null && xIntercept1 >= minX && xIntercept1 <= maxX && (
              <circle cx={toSvgX(xIntercept1)} cy={toSvgY(0)} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            )}
          </svg>

          <div className="mt-3 flex flex-wrap items-center justify-between w-full px-2 text-xs text-slate-300 gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Giao điểm Oy: <b className="text-emerald-400 font-mono">(0; {b1})</b>
            </span>
            {xIntercept1 !== null && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Giao điểm Ox: <b className="text-amber-400 font-mono">({xIntercept1.toFixed(2)}; 0)</b>
              </span>
            )}
            <span className="flex items-center gap-1">
              Hệ số góc: <b className="text-blue-400 font-mono">a = {a1}</b> (α ≈ {angleAlpha.toFixed(1)}°)
            </span>
          </div>
        </div>

        {/* Controls & Theoretical properties: 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Tham Số Đường Thẳng d₁
            </h4>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
                  <span>Hệ số góc a₁:</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">{a1}</span>
                </div>
                <input 
                  type="range" 
                  min="-4" 
                  max="4" 
                  step="0.5" 
                  value={a1} 
                  onChange={(e) => setA1(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
                  <span>Tung độ gốc b₁:</span>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">{b1}</span>
                </div>
                <input 
                  type="range" 
                  min="-5" 
                  max="5" 
                  step="0.5" 
                  value={b1} 
                  onChange={(e) => setB1(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Properties summary */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Nhận xét sư phạm:
              </div>
              <p className="text-slate-600">
                • Tính đồng biến / nghịch biến: {a1 > 0 ? (
                  <span className="text-emerald-600 font-semibold">ĐỒNG BIẾN trên ℝ (do a = {a1} &gt; 0)</span>
                ) : a1 < 0 ? (
                  <span className="text-rose-600 font-semibold">NGHỊCH BIẾN trên ℝ (do a = {a1} &lt; 0)</span>
                ) : (
                  <span className="text-amber-600 font-semibold">HÀM HẰNG y = {b1} (song song trục Ox)</span>
                )}
              </p>
              <p className="text-slate-600">
                • Góc tạo với tia Ox: {a1 > 0 ? 'GÓC NHỌN (< 90°)' : a1 < 0 ? 'GÓC TÙ (> 90°)' : 'BẰNG 0°'}.
              </p>
            </div>
          </div>

          {/* D2 controls if active */}
          {showD2 && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-rose-900 mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-600" /> Tham Số Đường Thẳng d₂
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-rose-800 font-medium block mb-1">Hệ số a₂: {a2}</label>
                  <input 
                    type="range" min="-4" max="4" step="0.5" value={a2} 
                    onChange={(e) => setA2(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-rose-800 font-medium block mb-1">Tung độ b₂: {b2}</label>
                  <input 
                    type="range" min="-5" max="5" step="0.5" value={b2} 
                    onChange={(e) => setB2(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-xs font-semibold text-rose-800">
                {relativeStatus}
              </div>
            </div>
          )}

          {/* Quick teacher presentation tip */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Mẹo Giảng Dạy Trên Lớp:
            </span>
            Kéo thanh trượt hệ số <span className="font-bold">a</span> từ âm sang dương để học sinh trực tiếp nhìn thấy đường thẳng xoay chiều từ dốc xuống sang dốc lên, khắc sâu khái niệm đồng biến - nghịch biến.
          </div>
        </div>
      </div>
    </div>
  );
};
