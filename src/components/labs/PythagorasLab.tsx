import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { CheckCircle2, RotateCcw, Lightbulb, Play } from 'lucide-react';
import { MathView } from '../common/MathView';

export const PythagorasLab: React.FC = () => {
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(4);
  const [quizInput, setQuizInput] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const cSquared = a * a + b * b;
  const c = Math.sqrt(cSquared);
  const isPerfectSquare = Number.isInteger(c);

  // SVG scaling
  const scale = 18;
  const originX = 140;
  const originY = 280;

  const handleCheckQuiz = () => {
    const val = parseFloat(quizInput);
    if (Math.abs(val - c) < 0.05) {
      soundManager.playCorrect();
      setQuizFeedback('Chính xác! Bạn đã vận dụng hoàn hảo định lý Pythagoras!');
    } else {
      soundManager.playWrong();
      setQuizFeedback(`Chưa chính xác. Áp dụng c = √(a² + b²) = √(${a*a} + ${b*b}) = ${c.toFixed(2)}.`);
    }
  };

  const setPreset = (presetA: number, presetB: number) => {
    soundManager.playClick();
    setA(presetA);
    setB(presetB);
    setQuizFeedback(null);
    setQuizInput('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">Mô phỏng Hình học THCS · Khối 7 & 8</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Khám Phá Trực Quan Định Lý Pythagoras</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông: <span className="font-bold text-indigo-600"><MathView math="a^2 + b^2 = c^2" /></span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Bộ ba Pytago chuẩn:</span>
          <button onClick={() => setPreset(3, 4)} className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors">3 - 4 - 5</button>
          <button onClick={() => setPreset(6, 8)} className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors">6 - 8 - 10</button>
          <button onClick={() => setPreset(5, 12)} className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors">5 - 12 - 13</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Canvas: 7 cols */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[420px] overflow-hidden">
          <div className="absolute top-3 left-4 text-xs font-mono text-slate-400">
            Hệ trực quan: Cạnh huyền c = {c.toFixed(2)} (c² = {cSquared})
          </div>
          
          <svg viewBox="0 0 460 400" className="w-full max-w-[420px] h-auto drop-shadow-md">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="460" height="400" fill="url(#grid)" />

            {/* Square on side a (Blue) */}
            <rect 
              x={originX - a * scale} 
              y={originY - a * scale} 
              width={a * scale} 
              height={a * scale} 
              fill="#3b82f6" 
              fillOpacity="0.25" 
              stroke="#3b82f6" 
              strokeWidth="2" 
            />
            <text 
              x={originX - (a * scale) / 2} 
              y={originY - (a * scale) / 2} 
              fill="#60a5fa" 
              fontSize="12" 
              fontWeight="bold" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="font-mono"
            >
              a² = {a * a}
            </text>

            {/* Square on side b (Emerald) */}
            <rect 
              x={originX} 
              y={originY} 
              width={b * scale} 
              height={b * scale} 
              fill="#10b981" 
              fillOpacity="0.25" 
              stroke="#10b981" 
              strokeWidth="2" 
            />
            <text 
              x={originX + (b * scale) / 2} 
              y={originY + (b * scale) / 2} 
              fill="#34d399" 
              fontSize="12" 
              fontWeight="bold" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="font-mono"
            >
              b² = {b * b}
            </text>

            {/* Right Triangle */}
            <polygon 
              points={`${originX},${originY} ${originX},${originY - a * scale} ${originX + b * scale},${originY}`} 
              fill="#6366f1" 
              fillOpacity="0.5" 
              stroke="#818cf8" 
              strokeWidth="3" 
            />

            {/* Right angle marker */}
            <rect 
              x={originX} 
              y={originY - 12} 
              width="12" 
              height="12" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="1.5" 
            />

            {/* Labels */}
            <text x={originX - 10} y={originY - (a * scale) / 2} fill="#93c5fd" fontSize="13" fontWeight="bold" textAnchor="end">a = {a}</text>
            <text x={originX + (b * scale) / 2} y={originY + 18} fill="#a7f3d0" fontSize="13" fontWeight="bold" textAnchor="middle">b = {b}</text>
            <text 
              x={originX + (b * scale) / 2 + 10} 
              y={originY - (a * scale) / 2 - 8} 
              fill="#fef08a" 
              fontSize="14" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              c = {c.toFixed(2)}
            </text>
          </svg>

          <div className="mt-3 flex items-center justify-between w-full px-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Hình vuông cạnh a: {a * a} đvdt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Hình vuông cạnh b: {b * b} đvdt
            </span>
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              Tổng a² + b² = c² = {cSquared}
            </span>
          </div>
        </div>

        {/* Right Controls: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-600" /> Bảng Điều Khiển Kích Thước Cạnh
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-700 mb-1">
                  <span>Cạnh góc vuông a:</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{a} cm</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  step="1" 
                  value={a} 
                  onChange={(e) => { setA(parseInt(e.target.value)); setQuizFeedback(null); }}
                  className="w-full accent-blue-600 cursor-pointer" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-700 mb-1">
                  <span>Cạnh góc vuông b:</span>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{b} cm</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  step="1" 
                  value={b} 
                  onChange={(e) => { setB(parseInt(e.target.value)); setQuizFeedback(null); }}
                  className="w-full accent-emerald-600 cursor-pointer" 
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Bình phương a²</span>
                <span className="font-mono text-base font-bold text-blue-600">{a * a}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Bình phương b²</span>
                <span className="font-mono text-base font-bold text-emerald-600">{b * b}</span>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200">
                <span className="text-[11px] text-indigo-700 block">Cạnh huyền c</span>
                <span className="font-mono text-base font-bold text-indigo-700">{c.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick interactive knowledge check for students */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <h5 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Thử Thách Nhanh Cho Học Sinh
            </h5>
            <p className="text-xs text-amber-800 mb-3">
              Với a = {a} và b = {b}, em hãy tính độ dài cạnh huyền <span className="font-mono font-bold">c</span> (làm tròn 2 chữ số thập phân nếu cần):
            </p>
            <div className="flex gap-2">
              <input 
                type="number" 
                step="0.01"
                placeholder="Nhập giá trị c..." 
                value={quizInput} 
                onChange={(e) => setQuizInput(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button 
                onClick={handleCheckQuiz}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shrink-0 transition-colors"
              >
                Kiểm tra
              </button>
            </div>
            {quizFeedback && (
              <div className="mt-2 text-xs font-medium text-slate-800 bg-white/80 p-2 rounded border border-amber-200">
                {quizFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
