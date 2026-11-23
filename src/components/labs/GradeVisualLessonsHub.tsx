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

  // Grade 7 Interactive States
  const [g7SideA, setG7SideA] = useState<number>(3);
  const [g7SideB, setG7SideB] = useState<number>(4);
  const g7SideC = Math.sqrt(g7SideA * g7SideA + g7SideB * g7SideB);

  // Grade 8 Interactive States (7 Hằng Đẳng Thức Hình Học)
  const [g8A, setG8A] = useState<number>(5);
  const [g8B, setG8B] = useState<number>(3);
  const [g8Identity, setG8Identity] = useState<'sum_sq' | 'diff_sq' | 'diff_two_sq'>('sum_sq');

  // Grade 9 Interactive States (Parabol & Đường Thẳng)
  const [g9A, setG9A] = useState<number>(0.5);
  const [g9M, setG9M] = useState<number>(1);
  const [g9N, setG9N] = useState<number>(2);

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
          3. TOÁN LỚP 7: ĐỊNH LÝ PYTHAGORAS & TAM GIÁC
          ======================================================== */}
      {activeGrade === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Định Lý Pythagoras Trực Quan: a² + b² = c²
                </h3>
                <p className="text-xs text-slate-500">Khối 7 · Hình học tam giác vuông</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Canvas */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
              <svg viewBox="0 0 340 280" className="w-full max-w-sm h-64">
                {/* Right triangle in center */}
                <polygon
                  points="120,200 240,200 120,110"
                  fill="rgba(99, 102, 241, 0.4)"
                  stroke="#818CF8"
                  strokeWidth="3"
                />
                {/* Square on side a (vertical 90px) */}
                <rect x="30" y="110" width="90" height="90" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
                <text x="75" y="160" fill="#FCA5A5" fontSize="12" textAnchor="middle">a² = {g7SideA * g7SideA}</text>

                {/* Square on side b (horizontal 120px) */}
                <rect x="120" y="200" width="120" height="60" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="2" />
                <text x="180" y="235" fill="#6EE7B7" fontSize="12" textAnchor="middle">b² = {g7SideB * g7SideB}</text>

                {/* Hypotenuse text */}
                <text x="195" y="145" fill="#FDE047" fontSize="12" fontWeight="bold">c² = a² + b² = {g7SideA * g7SideA + g7SideB * g7SideB}</text>
              </svg>
            </div>

            {/* Interactive sliders */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Cạnh góc vuông a:</span>
                    <span className="font-mono text-rose-600 font-bold">{g7SideA} cm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={g7SideA}
                    onChange={(e) => setG7SideA(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Cạnh góc vuông b:</span>
                    <span className="font-mono text-emerald-600 font-bold">{g7SideB} cm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={g7SideB}
                    onChange={(e) => setG7SideB(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Formula & Calculation Box */}
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                <span className="font-bold text-indigo-900 block">Công thức tính cạnh huyền c:</span>
                <div className="text-sm font-mono text-indigo-700 font-bold">
                  c = √(a² + b²) = √({g7SideA}² + {g7SideB}²) = √{g7SideA * g7SideA + g7SideB * g7SideB} ≈ {g7SideC.toFixed(2)} cm
                </div>
                <p className="text-[11px] text-slate-600">
                  Diện tích hình vuông dựng trên cạnh huyền luôn bằng tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. TOÁN LỚP 8: 7 HẰNG ĐẲNG THỨC ĐÁNG NHỚ TRỰC QUAN
          ======================================================== */}
      {activeGrade === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Hình Học Hóa Hằng Đẳng Thức: (a + b)² = a² + 2ab + b²
                </h3>
                <p className="text-xs text-slate-500">Khối 8 · 7 Hằng đẳng thức đáng nhớ</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Big Square cut into 4 parts */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
              <div className="relative border-4 border-white/20 rounded-xl overflow-hidden shadow-2xl" style={{ width: 220, height: 220 }}>
                {/* Box a^2 */}
                <div 
                  className="absolute top-0 left-0 bg-blue-600/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                  style={{ width: `${(g8A / (g8A + g8B)) * 100}%`, height: `${(g8A / (g8A + g8B)) * 100}%` }}
                >
                  a² ({g8A * g8A})
                </div>
                {/* Box ab top-right */}
                <div 
                  className="absolute top-0 right-0 bg-amber-500/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                  style={{ width: `${(g8B / (g8A + g8B)) * 100}%`, height: `${(g8A / (g8A + g8B)) * 100}%` }}
                >
                  ab ({g8A * g8B})
                </div>
                {/* Box ab bottom-left */}
                <div 
                  className="absolute bottom-0 left-0 bg-amber-500/80 border border-white/40 flex items-center justify-center font-bold text-white text-xs"
                  style={{ width: `${(g8A / (g8A + g8B)) * 100}%`, height: `${(g8B / (g8A + g8B)) * 100}%` }}
                >
                  ab ({g8A * g8B})
                </div>
                {/* Box b^2 bottom-right */}
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
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={g8A}
                    onChange={(e) => setG8A(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Độ dài đoạn b:</span>
                    <span className="font-mono text-emerald-600 font-bold">{g8B} cm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={g8B}
                    onChange={(e) => setG8B(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Expansion Result */}
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
        </div>
      )}

      {/* ========================================================
          5. TOÁN LỚP 9: PARABOL y = ax² & HÀM SỐ BẬC NHẤT
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
                  Tương Giao Đồ Thị Parabol (P): y = ax² & Đường Thẳng (d): y = mx + n
                </h3>
                <p className="text-xs text-slate-500">Khối 9 · Hàm số bậc nhất và bậc hai</p>
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
                <span className="font-bold text-indigo-900 block">Phương trình hoành độ giao điểm:</span>
                <div className="font-mono text-sm font-bold text-indigo-700">
                  {g9A}x² - ({g9M})x - ({g9N}) = 0
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Biệt thức Δ = b² - 4ac quyết định số lượng giao điểm giữa đường thẳng và Parabol (Cắt nhau tại 2 điểm, tiếp xúc tại 1 điểm, hoặc không cắt nhau).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
