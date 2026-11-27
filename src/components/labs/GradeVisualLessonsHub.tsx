import React, { useState } from 'react';
import { GradeLevel } from '../../types/math';
import { MathView } from '../common/MathView';
import { Math3DAnimationTheater } from './Math3DAnimationTheater';
import { soundManager } from '../../utils/sound';
import { 
  Shapes, Compass, TrendingUp, Scale, MonitorPlay, 
  Sparkles, Sliders, ChevronRight, BookOpen, Layers, Eye
} from 'lucide-react';

export const GradeVisualLessonsHub: React.FC = () => {
  const [activeGrade, setActiveGrade] = useState<GradeLevel | '3d_theater'>('3d_theater');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  // Grade 6 Interactive States
  const [g6Shape, setG6Shape] = useState<'square' | 'rhombus' | 'parallelogram' | 'trapezoid'>('parallelogram');
  const [g6SideA, setG6SideA] = useState<number>(6);
  const [g6Height, setG6Height] = useState<number>(4);
  const [g6SideB, setG6SideB] = useState<number>(8);

  const [g6Numerator, setG6Numerator] = useState<number>(3);
  const [g6Denominator, setG6Denominator] = useState<number>(8);

  // Grade 7 Interactive States (Bất đẳng thức tam giác & Tổng 3 góc — Chuẩn Toán 7 CT GDPT 2018)
  const [g7TriA, setG7TriA] = useState<number>(6);
  const [g7TriB, setG7TriB] = useState<number>(5);
  const [g7TriC, setG7TriC] = useState<number>(7);
  const isG7ValidTriangle = g7TriA + g7TriB > g7TriC && g7TriA + g7TriC > g7TriB && g7TriB + g7TriC > g7TriA;

  // Grade 8 Interactive States (7 Hằng Đẳng Thức & Định lí Pythagore — Chuẩn Toán 8 CT GDPT 2018)
  const [g8A, setG8A] = useState<number>(5);
  const [g8B, setG8B] = useState<number>(3);
  const [g8Module, setG8Module] = useState<'identity' | 'pythagore'>('identity');
  const [g8PyA, setG8PyA] = useState<number>(3);
  const [g8PyB, setG8PyB] = useState<number>(4);
  const g8PyC = Math.sqrt(g8PyA * g8PyA + g8PyB * g8PyB);

  // Grade 9 Interactive States (Parabol y = ax² & Phương trình bậc hai / Định lí Viète — Chuẩn Toán 9 CT GDPT 2018)
  const [g9A, setG9A] = useState<number>(0.5);
  const [g9M, setG9M] = useState<number>(1);
  const [g9N, setG9N] = useState<number>(2);
  const g9Delta = g9M * g9M + 4 * g9A * g9N;

  return (
    <div className="space-y-6">
      
      {/* Grade Selector Tabs Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Bài Giảng Trực Quan Toán Học THCS (Khối 6 - 9)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Mô Phỏng Tương Tác
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hình ảnh hóa các định lý, công thức đại số và hình học giúp học sinh dễ hiểu, khắc sâu kiến thức.
          </p>
        </div>

        {/* Grade Pills */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveGrade('3d_theater');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeGrade === '3d_theater'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Phim 3D HD (16:9) ⭐</span>
          </button>

          {([6, 7, 8, 9] as const).map(g => (
            <button
              key={g}
              onClick={() => {
                soundManager.playClick();
                setActiveGrade(g);
                setActiveTopicIndex(0);
              }}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeGrade === g
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toán Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          1. 3D THEATER HD (16:9) PROJECTION MODE
          ======================================================== */}
      {activeGrade === '3d_theater' && (
        <div className="space-y-4">
          <Math3DAnimationTheater />
        </div>
      )}

      {/* ========================================================
          2. TOÁN LỚP 6: HÌNH HỌC TRỰC QUAN & BÁNH PHÂN SỐ
          ======================================================== */}
      {activeGrade === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module 6.1: Hình Học Trực Quan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Shapes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Bài 1: Hình Phẳng Trực Quan & Diện Tích
                  </h3>
                  <span className="text-[11px] text-slate-500">Khối 6 · Hình học và Đo lường</span>
                </div>
              </div>
            </div>

            {/* Shape toggle buttons */}
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {[
                { id: 'parallelogram', label: 'Hình bình hành' },
                { id: 'rhombus', label: 'Hình thoi' },
                { id: 'trapezoid', label: 'Hình thang' },
                { id: 'square', label: 'Hình vuông' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setG6Shape(s.id as any);
                  }}
                  className={`py-2 px-2 rounded-xl text-center border transition-all ${
                    g6Shape === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Visual Canvas Rendering */}
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <svg viewBox="0 0 300 160" className="w-full max-w-[280px] h-36">
                {g6Shape === 'parallelogram' && (
                  <g>
                    <polygon
                      points="60,120 180,120 240,40 120,40"
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="#3B82F6"
                      strokeWidth="3"
                    />
                    <line x1="120" y1="40" x2="120" y2="120" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="135" y="140" fill="#94A3B8" fontSize="12" textAnchor="middle">đáy a = {g6SideA} cm</text>
                    <text x="130" y="85" fill="#F59E0B" fontSize="12">h = {g6Height} cm</text>
                  </g>
                )}
                {g6Shape === 'rhombus' && (
                  <g>
                    <polygon
                      points="150,20 230,80 150,140 70,80"
                      fill="rgba(16, 185, 129, 0.3)"
                      stroke="#10B981"
                      strokeWidth="3"
                    />
                    <line x1="70" y1="80" x2="230" y2="80" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="150" y1="20" x2="150" y2="140" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="150" y="70" fill="#EF4444" fontSize="11" textAnchor="middle">d₁ = {g6SideA} cm</text>
                    <text x="165" y="110" fill="#F59E0B" fontSize="11">d₂ = {g6Height} cm</text>
                  </g>
                )}
                {g6Shape === 'trapezoid' && (
                  <g>
                    <polygon
                      points="50,120 250,120 200,40 100,40"
                      fill="rgba(236, 72, 153, 0.3)"
                      stroke="#EC4899"
                      strokeWidth="3"
                    />
                    <line x1="100" y1="40" x2="100" y2="120" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="150" y="32" fill="#94A3B8" fontSize="11" textAnchor="middle">đáy nhỏ a = {g6SideA} cm</text>
                    <text x="150" y="140" fill="#94A3B8" fontSize="11" textAnchor="middle">đáy lớn b = {g6SideB} cm</text>
                    <text x="110" y="85" fill="#F59E0B" fontSize="11">h = {g6Height} cm</text>
                  </g>
                )}
                {g6Shape === 'square' && (
                  <g>
                    <rect
                      x="90" y="30" width="100" height="100"
                      fill="rgba(147, 51, 234, 0.3)"
                      stroke="#9333EA"
                      strokeWidth="3"
                    />
                    <text x="140" y="150" fill="#94A3B8" fontSize="12" textAnchor="middle">cạnh a = {g6SideA} cm</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Kích thước a:</span>
                  <span className="font-mono text-indigo-600 font-bold">{g6SideA} cm</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={g6SideA}
                  onChange={(e) => setG6SideA(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Chiều cao / Đường chéo h:</span>
                  <span className="font-mono text-amber-600 font-bold">{g6Height} cm</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={g6Height}
                  onChange={(e) => setG6Height(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>

            {/* Calculated Results */}
            <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-950">
              <span>Công thức tính diện tích:</span>
              <span className="font-mono text-sm text-indigo-700">
                {g6Shape === 'parallelogram' && `S = a × h = ${g6SideA} × ${g6Height} = ${g6SideA * g6Height} cm²`}
                {g6Shape === 'rhombus' && `S = ½ (d₁ × d₂) = ½ (${g6SideA} × ${g6Height}) = ${(g6SideA * g6Height) / 2} cm²`}
                {g6Shape === 'trapezoid' && `S = ½ (a + b) × h = ½ (${g6SideA} + ${g6SideB}) × ${g6Height} = ${((g6SideA + g6SideB) * g6Height) / 2} cm²`}
                {g6Shape === 'square' && `S = a² = ${g6SideA}² = ${g6SideA * g6SideA} cm²`}
              </span>
            </div>
          </div>

          {/* Module 6.2: Bánh Phân Số Trực Quan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  🍕
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Bài 2: Trực Quan Hóa Khái Niệm Phân Số
                  </h3>
                  <span className="text-[11px] text-slate-500">Khối 6 · Số học & Phân số</span>
                </div>
              </div>
            </div>

            {/* Visual Pizza / Pie Chart */}
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                {Array.from({ length: g6Denominator }).map((_, i) => {
                  const anglePerSlice = (2 * Math.PI) / g6Denominator;
                  const startAngle = i * anglePerSlice - Math.PI / 2;
                  const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

                  const x1 = 80 + 65 * Math.cos(startAngle);
                  const y1 = 80 + 65 * Math.sin(startAngle);
                  const x2 = 80 + 65 * Math.cos(endAngle);
                  const y2 = 80 + 65 * Math.sin(endAngle);

                  const isFilled = i < g6Numerator;
                  const pathData = `M 80 80 L ${x1} ${y1} A 65 65 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <path
                      key={i}
                      d={pathData}
                      fill={isFilled ? '#F59E0B' : '#334155'}
                      stroke="#0F172A"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Sliders for Numerator & Denominator */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Tử số (số phần lấy):</span>
                  <span className="font-mono text-amber-600 font-bold">{g6Numerator}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={g6Denominator}
                  value={g6Numerator}
                  onChange={(e) => setG6Numerator(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Mẫu số (tổng số phần bằng nhau):</span>
                  <span className="font-mono text-indigo-600 font-bold">{g6Denominator}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={g6Denominator}
                  onChange={(e) => {
                    const newDenom = Number(e.target.value);
                    setG6Denominator(newDenom);
                    if (g6Numerator > newDenom) setG6Numerator(newDenom);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-950">
              <span>Phân số biểu diễn:</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono text-amber-700 font-black">
                  {g6Numerator} / {g6Denominator}
                </span>
                <span className="text-slate-500 font-normal">
                  = {((g6Numerator / g6Denominator) * 100).toFixed(1)}% chiếc bánh
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          3. TOÁN LỚP 7 (CT GDPT 2018): BẤT ĐẲNG THỨC & TỔNG 3 GÓC TAM GIÁC
          ======================================================== */}
      {activeGrade === 7 && (() => {
        const angleA = isG7ValidTriangle
          ? (Math.acos((g7TriB * g7TriB + g7TriC * g7TriC - g7TriA * g7TriA) / (2 * g7TriB * g7TriC)) * 180) / Math.PI
          : 0;
        const angleB = isG7ValidTriangle
          ? (Math.acos((g7TriA * g7TriA + g7TriC * g7TriC - g7TriB * g7TriB) / (2 * g7TriA * g7TriC)) * 180) / Math.PI
          : 0;
        const angleC = isG7ValidTriangle ? Math.max(0, 180 - angleA - angleB) : 0;

        // Compute SVG triangle vertices when valid (base = g7TriC along horizontal)
        const scale = 22;
        const bx = 60;
        const by = 215;
        const cx = bx + g7TriC * scale;
        const cy = by;
        const cosB = isG7ValidTriangle
          ? (g7TriC * g7TriC + g7TriA * g7TriA - g7TriB * g7TriB) / (2 * g7TriC * g7TriA)
          : 0.5;
        const sinB = Math.sqrt(Math.max(0, 1 - cosB * cosB));
        const ax = bx + g7TriA * scale * cosB;
        const ay = by - g7TriA * scale * sinB;

        const triType = !isG7ValidTriangle
          ? 'Không lập thành tam giác'
          : g7TriA === g7TriB && g7TriB === g7TriC
            ? 'Tam giác đều (3 cạnh bằng nhau, mỗi góc 60°)'
            : Math.abs(angleA - 90) < 0.6 || Math.abs(angleB - 90) < 0.6 || Math.abs(angleC - 90) < 0.6
              ? 'Tam giác vuông'
              : g7TriA === g7TriB || g7TriB === g7TriC || g7TriA === g7TriC
                ? 'Tam giác cân'
                : Math.max(angleA, angleB, angleC) > 90
                  ? 'Tam giác tù'
                  : 'Tam giác nhọn';

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Bất Đẳng Thức Tam Giác & Định Lí Tổng Ba Góc (∠A + ∠B + ∠C = 180°)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khối 7 · Hình học tam giác (Chuẩn CT GDPT 2018 — Định lí Pythagore chuyển lên Toán 8)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Visual Canvas */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
                <svg viewBox="0 0 340 260" className="w-full max-w-sm h-64">
                  {isG7ValidTriangle ? (
                    <g>
                      <polygon
                        points={`${bx},${by} ${cx},${cy} ${ax.toFixed(1)},${ay.toFixed(1)}`}
                        fill="rgba(99, 102, 241, 0.35)"
                        stroke="#818CF8"
                        strokeWidth="3"
                      />
                      <circle cx={ax} cy={ay} r="4" fill="#FDE047" />
                      <circle cx={bx} cy={by} r="4" fill="#34D399" />
                      <circle cx={cx} cy={cy} r="4" fill="#F472B6" />
                      <text x={ax} y={Math.max(18, ay - 10)} fill="#FDE047" fontSize="11" fontWeight="bold" textAnchor="middle">
                        A ({angleA.toFixed(1)}°)
                      </text>
                      <text x={bx - 8} y={by + 18} fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
                        B ({angleB.toFixed(1)}°)
                      </text>
                      <text x={cx + 8} y={cy + 18} fill="#F472B6" fontSize="11" fontWeight="bold" textAnchor="middle">
                        C ({angleC.toFixed(1)}°)
                      </text>
                      <text x={(bx + cx) / 2} y={by + 20} fill="#CBD5E1" fontSize="11" textAnchor="middle">
                        c = {g7TriC} cm
                      </text>
                      <text x={(bx + ax) / 2 - 14} y={(by + ay) / 2} fill="#93C5FD" fontSize="11" textAnchor="middle">
                        a = {g7TriA}
                      </text>
                      <text x={(cx + ax) / 2 + 16} y={(cy + ay) / 2} fill="#FCA5A5" fontSize="11" textAnchor="middle">
                        b = {g7TriB}
                      </text>
                    </g>
                  ) : (
                    <g>
                      <line x1="40" y1="150" x2="300" y2="150" stroke="#F43F5E" strokeWidth="4" strokeDasharray="6 4" />
                      <text x="170" y="110" fill="#FCA5A5" fontSize="14" fontWeight="bold" textAnchor="middle">
                        Không tạo thành tam giác!
                      </text>
                      <text x="170" y="135" fill="#CBD5E1" fontSize="11" textAnchor="middle">
                        Vi phạm bất đẳng thức tam giác: |b - c| &lt; a &lt; b + c
                      </text>
                    </g>
                  )}
                </svg>
                <div className="text-xs font-bold text-amber-300 mt-1">
                  Phân loại: {triType}
                </div>
              </div>

              {/* Interactive sliders */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cạnh a (đối diện đỉnh A):</span>
                      <span className="font-mono text-sky-600 font-bold">{g7TriA} cm</span>
                    </div>
                    <input type="range" min="2" max="10" value={g7TriA} onChange={(e) => setG7TriA(Number(e.target.value))} className="w-full accent-sky-600" />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cạnh b (đối diện đỉnh B):</span>
                      <span className="font-mono text-rose-600 font-bold">{g7TriB} cm</span>
                    </div>
                    <input type="range" min="2" max="10" value={g7TriB} onChange={(e) => setG7TriB(Number(e.target.value))} className="w-full accent-rose-600" />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cạnh c (cạnh đáy BC):</span>
                      <span className="font-mono text-emerald-600 font-bold">{g7TriC} cm</span>
                    </div>
                    <input type="range" min="2" max="10" value={g7TriC} onChange={(e) => setG7TriC(Number(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
                </div>

                {/* Formula & Verification Box */}
                <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isG7ValidTriangle ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <span className="font-bold text-slate-900 block">
                    Kiểm tra Bất đẳng thức tam giác:
                  </span>
                  <div className="font-mono text-xs font-bold text-indigo-800">
                    |{g7TriB} - {g7TriC}| &lt; {g7TriA} &lt; {g7TriB} + {g7TriC} ⇔ {Math.abs(g7TriB - g7TriC)} &lt; {g7TriA} &lt; {g7TriB + g7TriC}
                  </div>
                  {isG7ValidTriangle ? (
                    <p className="text-[11px] text-emerald-800 font-semibold">
                      ✅ Hợp lệ! Tổng 3 góc: {angleA.toFixed(1)}° + {angleB.toFixed(1)}° + {angleC.toFixed(1)}° = 180°.
                    </p>
                  ) : (
                    <p className="text-[11px] text-rose-700 font-semibold">
                      ❌ Không thỏa mãn! Tổng hai cạnh phải luôn lớn hơn cạnh còn lại.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          4. TOÁN LỚP 8 (CT GDPT 2018): 7 HẰNG ĐẲNG THỨC & ĐỊNH LÍ PYTHAGORE
          ======================================================== */}
      {activeGrade === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {g8Module === 'identity'
                    ? 'Hình Học Hóa Hằng Đẳng Thức: (a + b)² = a² + 2ab + b²'
                    : 'Định Lí Pythagore Trực Quan: a² + b² = c² (Toán 8 – CT 2018)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Khối 8 · Chương II (Hằng đẳng thức) & Chương IX (Định lí Pythagore — CT GDPT 2018)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setG8Module('identity');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${g8Module === 'identity' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Hằng Đẳng Thức
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setG8Module('pythagore');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${g8Module === 'pythagore' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Định Lí Pythagore ⭐
              </button>
            </div>
          </div>

          {g8Module === 'identity' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Visual Big Square cut into 4 parts */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
                <div className="relative border-4 border-white/20 rounded-xl overflow-hidden shadow-2xl" style={{ width: 220, height: 220 }}>
                  <div
                    className="absolute top-0 left-0 bg-blue-600/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                    style={{ width: `${(g8A / (g8A + g8B)) * 100}%`, height: `${(g8A / (g8A + g8B)) * 100}%` }}
                  >
                    a² ({g8A * g8A})
                  </div>
                  <div
                    className="absolute top-0 right-0 bg-amber-500/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                    style={{ width: `${(g8B / (g8A + g8B)) * 100}%`, height: `${(g8A / (g8A + g8B)) * 100}%` }}
                  >
                    ab ({g8A * g8B})
                  </div>
                  <div
                    className="absolute bottom-0 left-0 bg-amber-500/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                    style={{ width: `${(g8A / (g8A + g8B)) * 100}%`, height: `${(g8B / (g8A + g8B)) * 100}%` }}
                  >
                    ab ({g8A * g8B})
                  </div>
                  <div
                    className="absolute bottom-0 right-0 bg-emerald-600/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                    style={{ width: `${(g8B / (g8A + g8B)) * 100}%`, height: `${(g8B / (g8A + g8B)) * 100}%` }}
                  >
                    b² ({g8B * g8B})
                  </div>
                </div>
              </div>

              {/* Sliders and Identity details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Độ dài đoạn a:</span>
                      <span className="font-mono text-blue-600 font-bold">{g8A} cm</span>
                    </div>
                    <input type="range" min="2" max="8" value={g8A} onChange={(e) => setG8A(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Độ dài đoạn b:</span>
                      <span className="font-mono text-emerald-600 font-bold">{g8B} cm</span>
                    </div>
                    <input type="range" min="1" max="6" value={g8B} onChange={(e) => setG8B(Number(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                  <span className="font-bold text-indigo-900 block">Khai triển diện tích hình vuông lớn (a + b)²:</span>
                  <div className="font-mono text-sm font-bold text-indigo-700">
                    ({g8A} + {g8B})² = {g8A}² + 2×({g8A}×{g8B}) + {g8B}²
                  </div>
                  <div className="font-mono text-sm font-bold text-emerald-700">
                    = {g8A * g8A} + {2 * g8A * g8B} + {g8B * g8B} = {(g8A + g8B) * (g8A + g8B)} cm²
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Hình vuông lớn có cạnh (a + b) được chia thành 1 hình vuông xanh a², 1 hình vuông lục b² và 2 hình chữ nhật vàng diện tích ab!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
                <svg viewBox="0 0 340 280" className="w-full max-w-sm h-64">
                  <polygon points="120,200 240,200 120,110" fill="rgba(99, 102, 241, 0.4)" stroke="#818CF8" strokeWidth="3" />
                  <rect x="30" y="110" width="90" height="90" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
                  <text x="75" y="160" fill="#FCA5A5" fontSize="12" textAnchor="middle">a² = {g8PyA * g8PyA}</text>
                  <rect x="120" y="200" width="120" height="60" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="2" />
                  <text x="180" y="235" fill="#6EE7B7" fontSize="12" textAnchor="middle">b² = {g8PyB * g8PyB}</text>
                  <text x="195" y="145" fill="#FDE047" fontSize="12" fontWeight="bold">c² = a² + b² = {g8PyA * g8PyA + g8PyB * g8PyB}</text>
                </svg>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cạnh góc vuông a:</span>
                      <span className="font-mono text-rose-600 font-bold">{g8PyA} cm</span>
                    </div>
                    <input type="range" min="1" max="12" value={g8PyA} onChange={(e) => setG8PyA(Number(e.target.value))} className="w-full accent-rose-600" />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Cạnh góc vuông b:</span>
                      <span className="font-mono text-emerald-600 font-bold">{g8PyB} cm</span>
                    </div>
                    <input type="range" min="1" max="12" value={g8PyB} onChange={(e) => setG8PyB(Number(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                  <span className="font-bold text-indigo-900 block">Công thức Định lí Pythagore (Toán 8):</span>
                  <div className="text-sm font-mono text-indigo-700 font-bold">
                    c = √(a² + b²) = √({g8PyA}² + {g8PyB}²) = √{g8PyA * g8PyA + g8PyB * g8PyB} ≈ {g8PyC.toFixed(2)} cm
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông (Chương IX – Toán 8 GDPT 2018).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. TOÁN LỚP 9 (CT GDPT 2018): HÀM SỐ y = ax² (a ≠ 0) & ĐỊNH LÍ VIÈTE
          ======================================================== */}
      {activeGrade === 9 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Đồ Thị Hàm Số (P): y = ax² (a ≠ 0) & Tương Giao Với Đường Thẳng (d): y = mx + n
                </h3>
                <p className="text-xs text-slate-500">Khối 9 · Hàm số y = ax², Phương trình bậc hai & Định lí Viète (CT GDPT 2018)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Coordinate Plot */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
              <svg viewBox="0 0 320 240" className="w-full max-w-sm h-64">
                {/* Grid */}
                <line x1="20" y1="120" x2="300" y2="120" stroke="#475569" strokeWidth="1.5" />
                <line x1="160" y1="20" x2="160" y2="220" stroke="#475569" strokeWidth="1.5" />
                <text x="290" y="135" fill="#94A3B8" fontSize="11">x</text>
                <text x="170" y="30" fill="#94A3B8" fontSize="11">y</text>
                <text x="145" y="135" fill="#94A3B8" fontSize="11">O</text>

                {/* Parabola curve y = a * x^2 (drawn inverted for SVG coords where y goes down) */}
                <path
                  d={(() => {
                    const points = [];
                    for (let x = -8; x <= 8; x += 0.5) {
                      const screenX = 160 + x * 15;
                      const yVal = g9A * x * x;
                      const screenY = 120 - yVal * 15;
                      points.push(`${screenX},${screenY}`);
                    }
                    return `M ${points.join(' L ')}`;
                  })()}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />

                {/* Line y = m * x + n */}
                <line
                  x1="40"
                  y1={120 - (g9M * (-8) + g9N) * 15}
                  x2="280"
                  y2={120 - (g9M * 8 + g9N) * 15}
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Hệ số a của Parabol:</span>
                    <span className="font-mono text-sky-600 font-bold">a = {g9A}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.1"
                    value={g9A}
                    onChange={(e) => setG9A(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Hệ số góc m của đường thẳng:</span>
                    <span className="font-mono text-rose-600 font-bold">m = {g9M}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.5"
                    value={g9M}
                    onChange={(e) => setG9M(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Tung độ gốc n:</span>
                    <span className="font-mono text-amber-600 font-bold">n = {g9N}</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="6"
                    step="1"
                    value={g9N}
                    onChange={(e) => setG9N(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              {/* Analysis Box */}
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-1.5 text-xs">
                <span className="font-bold text-indigo-900 block">Phương trình hoành độ giao điểm (Toán 9 – CT 2018):</span>
                <div className="font-mono text-sm font-bold text-indigo-700">
                  {g9A}x² - ({g9M})x - ({g9N}) = 0
                </div>
                <div className="font-mono text-xs font-bold text-emerald-700">
                  Δ = (-{g9M})² - 4·({g9A})·(-{g9N}) = {g9Delta.toFixed(2)}{' '}
                  {g9Delta > 0 ? '> 0 (2 giao điểm)' : g9Delta === 0 ? '= 0 (tiếp xúc)' : '< 0 (không cắt)'}
                </div>
                {g9Delta >= 0 && (
                  <div className="font-mono text-[11px] font-bold text-slate-700">
                    Định lí Viète: x₁ + x₂ = {(g9M / g9A).toFixed(2)} ; x₁ · x₂ = {(-g9N / g9A).toFixed(2)}
                  </div>
                )}
                <div className="text-[11px] text-slate-600 mt-1">
                  Đồ thị (P): y = ax² (a ≠ 0) nhận trục tung Oy làm trục đối xứng; biệt thức Δ quyết định số giao điểm với đường thẳng (d).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
