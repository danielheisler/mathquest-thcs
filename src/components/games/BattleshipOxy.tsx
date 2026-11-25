import React, { useState, useEffect } from 'react';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { Target, Compass, Award, RotateCcw, Crosshair, Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface ShipTarget {
  id: string;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  clue: string;
  clueEn: string;
  formulaClue?: string;
  explanation: string;
  explanationEn: string;
  isHit: boolean;
  type: 'submarine' | 'destroyer' | 'carrier' | 'cruiser';
}

const INITIAL_SHIPS: ShipTarget[] = [
  {
    id: 'ship-1',
    name: 'Tàu Khu Trục Alpha',
    nameEn: 'Destroyer Alpha',
    x: 2,
    y: 3,
    clue: 'Nằm trên đường thẳng $y = x + 1$ với hoành độ $x = 2$.',
    clueEn: 'Lies on line $y = x + 1$ with x-coordinate $x = 2$.',
    formulaClue: 'y = 2 + 1 = 3 \\Rightarrow A(2; 3)',
    explanation: 'Thay $x = 2$ vào $y = x + 1$ ta được tung độ $y = 3$. Tọa độ hạm đội là $(2; 3)$.',
    explanationEn: 'Substitute $x = 2$ into $y = x + 1$ to get $y = 3$. Coordinates: $(2, 3)$.',
    isHit: false,
    type: 'destroyer'
  },
  {
    id: 'ship-2',
    name: 'Tàu Ngầm Kilo',
    nameEn: 'Submarine Kilo',
    x: 3,
    y: 2,
    clue: 'Điểm đối xứng của $M(-3; 2)$ qua trục tung $Oy$.',
    clueEn: 'Reflection of point $M(-3, 2)$ across the vertical y-axis ($Oy$).',
    formulaClue: 'M\'(x; y) \\text{ symmetric } M(-3; 2) / Oy \\Rightarrow M\'(3; 2)',
    explanation: 'Đối xứng qua trục tung $Oy$ giữ nguyên tung độ $y = 2$ và đổi dấu hoành độ: $-(-3) = 3$. Tọa độ $(3; 2)$.',
    explanationEn: 'Reflection across $Oy$ keeps $y = 2$ and flips $x$ sign to $3$. Coordinates: $(3, 2)$.',
    isHit: false,
    type: 'submarine'
  },
  {
    id: 'ship-3',
    name: 'Tuần Dương Hạm Beta',
    nameEn: 'Cruiser Beta',
    x: 2,
    y: 0,
    clue: 'Giao điểm của đường thẳng $y = 2x - 4$ với trục hoành $Ox$.',
    clueEn: 'x-intercept of the line $y = 2x - 4$ (intersection with $Ox$).',
    formulaClue: 'y = 0 \\Rightarrow 2x - 4 = 0 \\Rightarrow x = 2 \\Rightarrow B(2; 0)',
    explanation: 'Điểm thuộc trục hoành có tung độ $y = 0$. Giải $2x - 4 = 0 \\Rightarrow x = 2$. Tọa độ $(2; 0)$.',
    explanationEn: 'On the x-axis, $y = 0$. Solving $2x - 4 = 0$ gives $x = 2$. Coordinates: $(2, 0)$.',
    isHit: false,
    type: 'cruiser'
  },
  {
    id: 'ship-4',
    name: 'Hàng Không Mẫu Hạm Titan',
    nameEn: 'Carrier Titan',
    x: -1,
    y: -1,
    clue: 'Trung điểm của đoạn thẳng nối $P(-4; 2)$ và $Q(2; -4)$.',
    clueEn: 'Midpoint of segment connecting $P(-4, 2)$ and $Q(2, -4)$.',
    formulaClue: 'x_I = \\frac{-4 + 2}{2} = -1, \\; y_I = \\frac{2 + (-4)}{2} = -1',
    explanation: 'Tọa độ trung điểm: $x = \\frac{x_P + x_Q}{2} = -1$ và $y = \\frac{y_P + y_Q}{2} = -1$. Tọa độ $(-1; -1)$.',
    explanationEn: 'Midpoint formula: $x = (-4+2)/2 = -1$ and $y = (2-4)/2 = -1$. Coordinates: $(-1, -1)$.',
    isHit: false,
    type: 'carrier'
  },
  {
    id: 'ship-5',
    name: 'Tàu Hộ Vệ Gamma',
    nameEn: 'Frigate Gamma',
    x: -3,
    y: -4,
    clue: 'Thuộc Góc phần tư thứ III có hoành độ $-3$ và tung độ $-4$.',
    clueEn: 'Located in Quadrant III with $x = -3$ and $y = -4$.',
    formulaClue: 'C(-3; -4) \\in \\text{Quadrant III}',
    explanation: 'Góc phần tư thứ III có $x < 0, y < 0$. Điểm cần ngắm bắn chính là $(-3; -4)$.',
    explanationEn: 'Quadrant III has $x < 0, y < 0$. Target coordinates: $(-3, -4)$.',
    isHit: false,
    type: 'destroyer'
  }
];

export const BattleshipOxy: React.FC<{ language?: Language }> = ({ language = 'vi' }) => {
  const isEn = language === 'en';
  const [ships, setShips] = useState<ShipTarget[]>(INITIAL_SHIPS);
  const [currentShipIndex, setCurrentShipIndex] = useState<number>(0);
  const [selectedX, setSelectedX] = useState<number>(0);
  const [selectedY, setSelectedY] = useState<number>(0);
  const [lastShot, setLastShot] = useState<{ x: number; y: number; hit: boolean } | null>(null);
  const [shotHistory, setShotHistory] = useState<{ x: number; y: number; hit: boolean }[]>([]);
  const [score, setScore] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentShip = ships[currentShipIndex];
  const allSunk = ships.every(s => s.isHit);

  useEffect(() => {
    if (allSunk) {
      setIsGameOver(true);
      soundManager.playLevelUp();
    }
  }, [allSunk]);

  const handleFireAt = (x: number, y: number) => {
    if (isGameOver || !currentShip || currentShip.isHit) return;

    soundManager.playClick();
    const isHit = currentShip.x === x && currentShip.y === y;

    setLastShot({ x, y, hit: isHit });
    setShotHistory(prev => [{ x, y, hit: isHit }, ...prev]);

    if (isHit) {
      soundManager.playCorrect();
      setScore(prev => prev + 100);
      setShips(prev => prev.map((s, idx) => idx === currentShipIndex ? { ...s, isHit: true } : s));
      setShowExplanation(true);
    } else {
      soundManager.playWrong();
      setMisses(prev => prev + 1);
    }
  };

  const handleNextTarget = () => {
    soundManager.playClick();
    setShowExplanation(false);
    setLastShot(null);
    const nextIdx = ships.findIndex((s, i) => i > currentShipIndex && !s.isHit);
    if (nextIdx !== -1) {
      setCurrentShipIndex(nextIdx);
    } else {
      const anyUnHit = ships.findIndex(s => !s.isHit);
      if (anyUnHit !== -1) {
        setCurrentShipIndex(anyUnHit);
      }
    }
  };

  const handleResetGame = () => {
    soundManager.playClick();
    setShips(INITIAL_SHIPS.map(s => ({ ...s, isHit: false })));
    setCurrentShipIndex(0);
    setShotHistory([]);
    setLastShot(null);
    setScore(0);
    setMisses(0);
    setShowExplanation(false);
    setIsGameOver(false);
  };

  // Grid coordinates from -5 to 5
  const coords = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {isEn ? 'Unique Math Game · New' : 'Trò Chơi Toán Học Độc Đáo · Mới'}
              </span>
              <span className="text-xs text-slate-400">{isEn ? 'Cartesian Plane Oxy & Functions' : 'Hệ Trục Oxy & Hàm Số'}</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
              {isEn ? 'Coordinate Battleship (Oxy Plane)' : 'Hải Chiến Tọa Độ Oxy (Naval Battleship)'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Voyage Score' : 'Điểm Hải Trình'}</span>
            <span className="text-lg font-mono font-black text-cyan-400">{score}</span>
          </div>
          <div className="w-px h-7 bg-slate-700" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? 'Ships Sunk' : 'Đã Tiêu Diệt'}</span>
            <span className="text-lg font-mono font-black text-emerald-400">
              {ships.filter(s => s.isHit).length}/{ships.length}
            </span>
          </div>
          <button
            onClick={handleResetGame}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-slate-300 hover:text-white"
            title={isEn ? 'Restart game' : 'Chơi lại từ đầu'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gameplay Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Interactive Oxy Coordinate Grid */}
        <div className="lg:col-span-7 bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Crosshair className="w-4 h-4" /> Radar Sonar Oxy [-5, +5]
            </span>
            <span>{isEn ? 'Click grid point or use dials' : 'Click tọa độ trên lưới hoặc dùng bảng điều khiển'}</span>
          </div>

          {/* SVG Coordinate Grid */}
          <div className="relative w-full max-w-[420px] aspect-square select-none bg-slate-900/90 rounded-2xl p-2 border border-cyan-900/50 shadow-inner">
            <svg viewBox="-5.8 -5.8 11.6 11.6" className="w-full h-full">
              {/* Quadrant labels */}
              <text x="2.5" y="-3.5" fill="#334155" fontSize="0.7" fontWeight="bold">II (+,+)</text>
              <text x="-4.5" y="-3.5" fill="#334155" fontSize="0.7" fontWeight="bold">II (-,+)</text>
              <text x="-4.5" y="4.2" fill="#334155" fontSize="0.7" fontWeight="bold">III (-,-)</text>
              <text x="2.5" y="4.2" fill="#334155" fontSize="0.7" fontWeight="bold">IV (+,-)</text>

              {/* Grid Lines */}
              {coords.map(v => (
                <React.Fragment key={`grid-${v}`}>
                  {/* Vertical line (x = v) */}
                  <line
                    x1={v}
                    y1={-5}
                    x2={v}
                    y2={5}
                    stroke={v === 0 ? '#38bdf8' : '#1e293b'}
                    strokeWidth={v === 0 ? '0.08' : '0.02'}
                  />
                  {/* Horizontal line (y = v) - SVG y is flipped */}
                  <line
                    x1={-5}
                    y1={-v}
                    x2={5}
                    y2={-v}
                    stroke={v === 0 ? '#38bdf8' : '#1e293b'}
                    strokeWidth={v === 0 ? '0.08' : '0.02'}
                  />
                </React.Fragment>
              ))}

              {/* Axis labels */}
              <text x="5.2" y="0.25" fill="#38bdf8" fontSize="0.5" fontWeight="bold">x</text>
              <text x="-0.3" y="-5.2" fill="#38bdf8" fontSize="0.5" fontWeight="bold">y</text>
              <text x="0.15" y="0.4" fill="#94a3b8" fontSize="0.4">O</text>

              {/* Number marks */}
              {[-4, -2, 2, 4].map(v => (
                <React.Fragment key={`num-${v}`}>
                  <text x={v} y="0.4" fill="#64748b" fontSize="0.35" textAnchor="middle">{v}</text>
                  <text x="-0.3" y={-v + 0.12} fill="#64748b" fontSize="0.35" textAnchor="end">{v}</text>
                </React.Fragment>
              ))}

              {/* Miss / Hit History markers */}
              {shotHistory.map((s, idx) => (
                <g key={`shot-${idx}`}>
                  {s.hit ? (
                    <circle cx={s.x} cy={-s.y} r="0.28" fill="#10b981" stroke="#ffffff" strokeWidth="0.04" />
                  ) : (
                    <circle cx={s.x} cy={-s.y} r="0.16" fill="#ef4444" opacity="0.6" />
                  )}
                </g>
              ))}

              {/* Interactive Target Click Points */}
              {coords.map(x => coords.map(y => (
                <circle
                  key={`pt-${x}-${y}`}
                  cx={x}
                  cy={-y}
                  r="0.22"
                  className="cursor-pointer transition-all fill-transparent hover:fill-cyan-400/40 hover:r-[0.3]"
                  onClick={() => handleFireAt(x, y)}
                >
                  <title>Tọa độ ({x}; {y})</title>
                </circle>
              )))}

              {/* Current Aim Reticle */}
              <circle
                cx={selectedX}
                cy={-selectedY}
                r="0.35"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.05"
                strokeDasharray="0.1 0.05"
                className="animate-spin"
              />
            </svg>
          </div>

          {/* Quick coordinate picker controls */}
          <div className="w-full mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">{isEn ? 'Target Coordinates:' : 'Tọa độ ngắm bắn:'}</span>
              <div className="flex items-center gap-1 font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-cyan-400">x = {selectedX}</span>
                <span className="text-slate-500">,</span>
                <span className="text-indigo-400">y = {selectedY}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFireAt(selectedX, selectedY)}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
              >
                <Crosshair className="w-3.5 h-3.5" /> {isEn ? 'Fire' : 'Khai Hỏa'} ({selectedX}; {selectedY})
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Current Mission & Math Clue */}
        <div className="lg:col-span-5 space-y-4">
          {!isGameOver && currentShip && (
            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> {isEn ? 'Target' : 'Mục Tiêu'} {currentShipIndex + 1}/{ships.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentShip.type.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-2">{isEn ? currentShip.nameEn : currentShip.name}</h4>
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-sm text-slate-200">
                  <p className="font-medium text-slate-300 mb-2">{isEn ? 'Math Radar Clue:' : 'Tín hiệu trinh sát Toán học:'}</p>
                  <div className="text-cyan-300 font-semibold text-base py-1">
                    <MathView math={isEn ? currentShip.clueEn : currentShip.clue} />
                  </div>
                </div>
              </div>

              {/* Dial selectors for X and Y */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{isEn ? 'Select x-coordinate:' : 'Chọn hoành độ (x):'}</span>
                    <span className="font-mono font-bold text-cyan-400">{selectedX}</span>
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {coords.map(x => (
                      <button
                        key={`sel-x-${x}`}
                        onClick={() => setSelectedX(x)}
                        className={`py-1 rounded text-[11px] font-mono font-bold transition-all ${
                          selectedX === x
                            ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{isEn ? 'Select y-coordinate:' : 'Chọn tung độ (y):'}</span>
                    <span className="font-mono font-bold text-indigo-400">{selectedY}</span>
                  </div>
                  <div className="grid grid-cols-11 gap-1">
                    {coords.map(y => (
                      <button
                        key={`sel-y-${y}`}
                        onClick={() => setSelectedY(y)}
                        className={`py-1 rounded text-[11px] font-mono font-bold transition-all ${
                          selectedY === y
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-300'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback after shot */}
              {lastShot && !lastShot.hit && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    {isEn
                      ? `Missed at (${lastShot.x}, ${lastShot.y})! Re-check the formula and coordinates.`
                      : `Bắn trượt tại (${lastShot.x}; ${lastShot.y})! Hãy suy luận lại công thức và tọa độ.`}
                  </span>
                </div>
              )}

              {/* Success modal / explanation */}
              {showExplanation && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{isEn ? 'DIRECT HIT! (+100 PTS)' : 'MỤC TIÊU BỊ TIÊU DIỆT CHÍNH XÁC! (+100 ĐIỂM)'}</span>
                  </div>
                  <div className="text-xs text-emerald-100 bg-slate-950/60 p-3 rounded-lg border border-emerald-500/30">
                    <MathView math={isEn ? currentShip.explanationEn : currentShip.explanation} />
                  </div>
                  <button
                    onClick={handleNextTarget}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>{isEn ? 'Next Target' : 'Tiếp tục mục tiêu tiếp theo'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Victory View when all ships are sunk */}
          {isGameOver && (
            <div className="bg-gradient-to-b from-indigo-900/80 to-slate-900 rounded-2xl p-6 border border-indigo-500/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white">
                  {isEn ? 'EXCELLENT! MATH FLEET VICTORY' : 'XUẤT SẮC! HẠM ĐỘI TOÁN HỌC TOÀN THẮNG'}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {isEn
                    ? 'You mastered Oxy coordinates, axis reflections, midpoints, and linear intercepts!'
                    : 'Em đã nắm vững toàn bộ kiến thức hệ trục tọa độ Oxy, tính chất đối xứng và phương trình đường thẳng.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex justify-around">
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Total Score:' : 'Tổng điểm:'}</span>
                  <span className="text-lg font-mono font-bold text-amber-400">{score}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Misses:' : 'Số lần bắn trượt:'}</span>
                  <span className="text-lg font-mono font-bold text-slate-300">{misses}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Accuracy:' : 'Độ chuẩn xác:'}</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {Math.round((5 / (5 + misses)) * 100)}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetGame}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> {isEn ? 'Play New Battle' : 'Chơi Lại Trận Mới'}
              </button>
            </div>
          )}

          {/* Fleet status table */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-xs">
            <h5 className="font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" /> {isEn ? 'Enemy Fleet Checklist:' : 'Danh Sách Hạm Đội Cần Truy Tìm:'}
            </h5>
            <div className="space-y-1.5">
              {ships.map((s, idx) => (
                <div
                  key={s.id}
                  className={`p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    s.isHit
                      ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300'
                      : idx === currentShipIndex
                      ? 'bg-cyan-950/40 border border-cyan-800/60 text-cyan-200'
                      : 'bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <span className="font-medium truncate">{isEn ? s.nameEn : s.name}</span>
                  {s.isHit ? (
                    <span className="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ({s.x}; {s.y})
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-slate-500">???</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
