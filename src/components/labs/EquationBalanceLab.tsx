import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { Scale, RotateCcw, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface EquationStep {
  desc: string;
  leftX: number;
  leftConst: number;
  rightX: number;
  rightConst: number;
}

export const EquationBalanceLab: React.FC = () => {
  // Target equation presets
  const presets = [
    { label: '2x + 4 = 10', leftX: 2, leftConst: 4, rightX: 0, rightConst: 10, targetSolution: 3 },
    { label: '3x + 2 = 14', leftX: 3, leftConst: 2, rightX: 0, rightConst: 14, targetSolution: 4 },
    { label: '3x + 1 = x + 7', leftX: 3, leftConst: 1, rightX: 1, rightConst: 7, targetSolution: 3 },
    { label: '4x + 6 = 22', leftX: 4, leftConst: 6, rightX: 0, rightConst: 22, targetSolution: 4 }
  ];

  const [currentPresetIndex, setCurrentPresetIndex] = useState<number>(0);
  const [leftX, setLeftX] = useState<number>(presets[0].leftX);
  const [leftConst, setLeftConst] = useState<number>(presets[0].leftConst);
  const [rightX, setRightX] = useState<number>(presets[0].rightX);
  const [rightConst, setRightConst] = useState<number>(presets[0].rightConst);

  const [history, setHistory] = useState<EquationStep[]>([
    { desc: 'Phương trình ban đầu', leftX: presets[0].leftX, leftConst: presets[0].leftConst, rightX: presets[0].rightX, rightConst: presets[0].rightConst }
  ]);

  const [message, setMessage] = useState<string>('Mục tiêu: Đưa về dạng 1x = ? để tìm nghiệm x');

  const targetX = presets[currentPresetIndex].targetSolution;

  // Calculate simulated weights with targetX to determine tilt
  const totalWeightLeft = leftX * targetX + leftConst;
  const totalWeightRight = rightX * targetX + rightConst;
  const diff = totalWeightLeft - totalWeightRight;
  const tiltDeg = Math.max(-12, Math.min(12, diff * 3));

  const isSolved = leftX === 1 && leftConst === 0 && rightX === 0 && rightConst === targetX;

  const handleSubtractConst = (amount: number) => {
    soundManager.playClick();
    if (leftConst >= amount && rightConst >= amount) {
      const nLeft = leftConst - amount;
      const nRight = rightConst - amount;
      setLeftConst(nLeft);
      setRightConst(nRight);
      setHistory([...history, { desc: `Trừ ${amount} ở cả hai vế`, leftX, leftConst: nLeft, rightX, rightConst: nRight }]);
      setMessage(`Đã trừ ${amount} ở cả 2 vế. Cân vẫn thăng bằng!`);
      if (leftX === 1 && nLeft === 0 && rightX === 0 && nRight === targetX) {
        soundManager.playVictory();
      }
    } else {
      soundManager.playWrong();
      setMessage('Không thể trừ số lớn hơn giá trị hiện có trên đĩa cân!');
    }
  };

  const handleSubtractX = () => {
    soundManager.playClick();
    if (leftX > 0 && rightX > 0) {
      const nLeftX = leftX - 1;
      const nRightX = rightX - 1;
      setLeftX(nLeftX);
      setRightX(nRightX);
      setHistory([...history, { desc: 'Bỏ 1 quả x ở cả hai vế', leftX: nLeftX, leftConst, rightX: nRightX, rightConst }]);
      setMessage('Đã bỏ 1 quả cân x ở cả 2 vế.');
    }
  };

  const handleDivide = (divisor: number) => {
    soundManager.playClick();
    if (leftX % divisor === 0 && rightConst % divisor === 0 && leftConst === 0 && rightX === 0) {
      const nLeftX = leftX / divisor;
      const nRightConst = rightConst / divisor;
      setLeftX(nLeftX);
      setRightConst(nRightConst);
      setHistory([...history, { desc: `Chia cả hai vế cho ${divisor}`, leftX: nLeftX, leftConst: 0, rightX: 0, rightConst: nRightConst }]);
      setMessage(`Đã chia cả hai vế cho ${divisor}!`);
      if (nLeftX === 1 && nRightConst === targetX) {
        soundManager.playVictory();
      }
    } else {
      soundManager.playWrong();
      setMessage(`Chỉ nên chia khi các quả cân không còn hằng số tự do và chia hết cho ${divisor}.`);
    }
  };

  const resetPreset = (idx: number) => {
    soundManager.playClick();
    setCurrentPresetIndex(idx);
    const p = presets[idx];
    setLeftX(p.leftX);
    setLeftConst(p.leftConst);
    setRightX(p.rightX);
    setRightConst(p.rightConst);
    setHistory([{ desc: 'Phương trình ban đầu', leftX: p.leftX, leftConst: p.leftConst, rightX: p.rightX, rightConst: p.rightConst }]);
    setMessage('Hãy vận dụng các thao tác đại số để giữ cân luôn thăng bằng!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">Mô phỏng Đại số THCS · Khối 6, 7, 8</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Cân Thăng Bằng Giải Phương Trình</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Trực quan hóa quy tắc chuyển vế đổi dấu: Thao tác như nhau trên hai vế giúp phương trình luôn giữ nguyên giá trị nghiệm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {presets.map((p, idx) => (
            <button
              key={p.label}
              onClick={() => resetPreset(idx)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                currentPresetIndex === idx 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Balance Scale Stage: 7 cols */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="absolute top-3 left-4 text-xs font-mono text-slate-300">
            Trạng thái vế trái: <b className="text-blue-400">{leftX > 0 ? `${leftX}x` : ''}{leftConst > 0 ? ` + ${leftConst}` : ''}</b> | Trạng thái vế phải: <b className="text-emerald-400">{rightX > 0 ? `${rightX}x` : ''}{rightConst > 0 ? ` ${rightConst}` : ''}</b>
          </div>

          <svg viewBox="0 0 500 320" className="w-full max-w-[460px] h-auto drop-shadow-lg">
            {/* Base Pillar */}
            <rect x="238" y="140" width="24" height="150" fill="#334155" rx="4" />
            <polygon points="200,290 300,290 270,260 230,260" fill="#475569" />
            {/* Center Pivot */}
            <circle cx="250" cy="140" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

            {/* Tilting Balance Beam */}
            <g transform={`rotate(${tiltDeg}, 250, 140)`}>
              {/* Horizontal Beam */}
              <line x1="80" y1="140" x2="420" y2="140" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

              {/* Left Pan Chains & Plate */}
              <g transform="translate(100, 140)">
                <line x1="0" y1="0" x2="-35" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="35" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M -50 70 Q 0 90 50 70 Z" fill="#3b82f6" fillOpacity="0.8" stroke="#60a5fa" strokeWidth="2" />
                
                {/* Left Pan Items */}
                <g transform="translate(0, 60)">
                  {/* Quả cân x */}
                  {Array.from({ length: leftX }).map((_, i) => (
                    <g key={`lx-${i}`} transform={`translate(${(i - (leftX - 1) / 2) * 22}, -8)`}>
                      <rect x="-9" y="-18" width="18" height="18" rx="3" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                      <text x="0" y="-5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">x</text>
                    </g>
                  ))}
                  {/* Quả cân số hằng số */}
                  {leftConst > 0 && (
                    <g transform={`translate(0, -32)`}>
                      <circle cx="0" cy="0" r="11" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                      <text x="0" y="4" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">{leftConst}</text>
                    </g>
                  )}
                </g>
              </g>

              {/* Right Pan Chains & Plate */}
              <g transform="translate(400, 140)">
                <line x1="0" y1="0" x2="-35" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="35" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M -50 70 Q 0 90 50 70 Z" fill="#10b981" fillOpacity="0.8" stroke="#34d399" strokeWidth="2" />

                {/* Right Pan Items */}
                <g transform="translate(0, 60)">
                  {/* Quả cân x bên phải nếu có */}
                  {Array.from({ length: rightX }).map((_, i) => (
                    <g key={`rx-${i}`} transform={`translate(${(i - (rightX - 1) / 2) * 22}, -8)`}>
                      <rect x="-9" y="-18" width="18" height="18" rx="3" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                      <text x="0" y="-5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">x</text>
                    </g>
                  ))}
                  {/* Quả cân số bên phải */}
                  {rightConst > 0 && (
                    <g transform={`translate(0, -12)`}>
                      <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#78350f" fontSize="12" fontWeight="bold" textAnchor="middle">{rightConst}</text>
                    </g>
                  )}
                </g>
              </g>
            </g>
          </svg>

          {isSolved ? (
            <div className="mt-3 px-4 py-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-emerald-300 font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              CHÚC MỪNG! Nghiệm của phương trình là x = {targetX}!
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-400">
              {message}
            </div>
          )}
        </div>

        {/* Control Actions & Equation Solving Steps: 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" /> Thao Tác Đại Số Trên Hai Vế
            </h4>

            <div className="space-y-3">
              {/* Subtract constant */}
              {leftConst > 0 && rightConst > 0 && (
                <div>
                  <span className="text-xs font-medium text-slate-700 block mb-1">Quy tắc 1: Trừ cùng số đơn vị ở cả hai vế</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubtractConst(leftConst)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Trừ {leftConst} ở cả 2 vế
                    </button>
                    {leftConst > 1 && (
                      <button
                        onClick={() => handleSubtractConst(1)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        Trừ 1 ở cả 2 vế
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Subtract x */}
              {leftX > 0 && rightX > 0 && (
                <div>
                  <span className="text-xs font-medium text-slate-700 block mb-1">Quy tắc 2: Bớt ẩn x ở cả hai vế</span>
                  <button
                    onClick={handleSubtractX}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Bỏ 1 quả x ở cả hai vế
                  </button>
                </div>
              )}

              {/* Divide both sides */}
              {leftX > 1 && leftConst === 0 && (
                <div>
                  <span className="text-xs font-medium text-slate-700 block mb-1">Quy tắc 3: Chia cả hai vế cho hệ số của x</span>
                  <button
                    onClick={() => handleDivide(leftX)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Chia cả 2 vế cho {leftX}
                  </button>
                </div>
              )}

              <button
                onClick={() => resetPreset(currentPresetIndex)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Khôi phục phương trình gốc
              </button>
            </div>
          </div>

          {/* Step History */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
              Lịch Sử Các Bước Biến Đổi:
            </h5>
            <ol className="space-y-2 text-xs">
              {history.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="font-mono font-bold text-slate-400 shrink-0">{idx + 1}.</span>
                  <div>
                    <span className="font-medium text-slate-800">{step.desc}</span>
                    <div className="font-mono text-indigo-600">
                      {step.leftX}x {step.leftConst > 0 ? `+ ${step.leftConst}` : ''} = {step.rightX > 0 ? `${step.rightX}x + ` : ''}{step.rightConst}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
