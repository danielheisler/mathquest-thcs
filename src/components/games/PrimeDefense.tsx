import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import { MathView } from '../common/MathView';
import { Shield, Zap, Sparkles, AlertTriangle, RotateCcw, Award, Flame, Heart } from 'lucide-react';

interface Invader {
  id: string;
  originalNumber: number;
  currentNumber: number;
  primeFactors: number[];
  speed: number;
  progress: number; // 0% to 100% towards fortress
}

const PRIMES = [2, 3, 5, 7, 11, 13];

const SAMPLE_NUMBERS = [24, 36, 45, 60, 72, 84, 90, 105, 120, 150];

export const PrimeDefense: React.FC = () => {
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [score, setScore] = useState<number>(0);
  const [fortressHp, setFortressHp] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [superCharge, setSuperCharge] = useState<number>(100); // 0 to 100%
  const [level, setLevel] = useState<number>(1);

  // Helper to factorize
  const getPrimeFactors = (num: number): number[] => {
    const factors: number[] = [];
    let n = num;
    let d = 2;
    while (n > 1) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
      d++;
      if (d * d > n) {
        if (n > 1) factors.push(n);
        break;
      }
    }
    return factors;
  };

  // Spawn invaders
  const spawnInvader = () => {
    const num = SAMPLE_NUMBERS[Math.floor(Math.random() * SAMPLE_NUMBERS.length)];
    const newInv: Invader = {
      id: `inv-${Date.now()}-${Math.random()}`,
      originalNumber: num,
      currentNumber: num,
      primeFactors: getPrimeFactors(num),
      speed: 0.8 + level * 0.2,
      progress: 0
    };
    setInvaders(prev => [...prev.slice(-3), newInv]);
    if (!selectedTargetId) setSelectedTargetId(newInv.id);
  };

  // Game loop tick
  useEffect(() => {
    if (isGameOver) return;

    // Initial spawn if empty
    if (invaders.length === 0) {
      spawnInvader();
    }

    const interval = setInterval(() => {
      setInvaders(prev => {
        let hpDeduction = 0;
        const next = prev.map(inv => {
          const nextProg = inv.progress + inv.speed;
          if (nextProg >= 100) {
            hpDeduction += 20;
            soundManager.playWrong();
            return null;
          }
          return { ...inv, progress: nextProg };
        }).filter(Boolean) as Invader[];

        if (hpDeduction > 0) {
          setFortressHp(hp => {
            const nextHp = Math.max(0, hp - hpDeduction);
            if (nextHp === 0) setIsGameOver(true);
            return nextHp;
          });
          setCombo(0);
        }

        // Auto spawn new if count is low
        if (next.length < 3 && Math.random() < 0.25) {
          const num = SAMPLE_NUMBERS[Math.floor(Math.random() * SAMPLE_NUMBERS.length)];
          next.push({
            id: `inv-${Date.now()}`,
            originalNumber: num,
            currentNumber: num,
            primeFactors: getPrimeFactors(num),
            speed: 0.8 + level * 0.2,
            progress: 0
          });
        }

        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGameOver, level, invaders.length]);

  // Target selection
  const activeInvader = invaders.find(inv => inv.id === selectedTargetId) || invaders[0];

  // Fire Prime Cannon
  const handleFirePrime = (prime: number) => {
    if (isGameOver || !activeInvader) return;

    if (activeInvader.currentNumber % prime === 0) {
      // Correct prime factor!
      soundManager.playCorrect();
      const nextNum = activeInvader.currentNumber / prime;
      const pts = prime * 10 * (1 + combo * 0.1);
      setScore(prev => Math.round(prev + pts));
      setCombo(prev => prev + 1);
      setSuperCharge(prev => Math.min(100, prev + 15));

      if (nextNum === 1) {
        // Destroyed!
        soundManager.playLevelUp();
        setInvaders(prev => prev.filter(inv => inv.id !== activeInvader.id));
        setSelectedTargetId(null);
      } else {
        setInvaders(prev => prev.map(inv => inv.id === activeInvader.id ? { ...inv, currentNumber: nextNum } : inv));
      }
    } else {
      // Wrong factor!
      soundManager.playWrong();
      setCombo(0);
    }
  };

  // Super GCD Blast
  const handleSuperBlast = () => {
    if (superCharge < 100 || invaders.length === 0) return;
    soundManager.playLevelUp();
    setSuperCharge(0);
    setScore(prev => prev + invaders.length * 150);
    setInvaders([]);
    setCombo(prev => prev + 3);
  };

  const handleRestart = () => {
    setInvaders([]);
    setScore(0);
    setFortressHp(100);
    setCombo(0);
    setSuperCharge(100);
    setIsGameOver(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Trò Chơi Số Học Khắc Sâu · Mới
              </span>
              <span className="text-xs text-slate-400">Phân Tích Thừa Số Nguyên Tố & Chia Hết</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Pháo Đài Thừa Số Nguyên Tố (Prime Defense)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1 justify-end">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> HP Pháo Đài
            </span>
            <span className={`text-lg font-mono font-black ${fortressHp < 30 ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`}>
              {fortressHp}%
            </span>
          </div>
          <div className="w-px h-7 bg-slate-700" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Điểm Phòng Thủ</span>
            <span className="text-lg font-mono font-black text-amber-400">{score}</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-slate-300"
            title="Chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Battlefield Display */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden min-h-[220px]">
        {/* Fortress Line on right */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-600/30 to-transparent border-r-4 border-indigo-500 flex items-center justify-center">
          <Shield className="w-6 h-6 text-indigo-400 opacity-60" />
        </div>

        <div className="text-xs text-slate-400 mb-4 flex items-center justify-between">
          <span>Quái vật số hợp thành đang tiến về thành lũy (Click vào quái vật để nhắm bắn):</span>
          {combo > 1 && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> Combo x{combo}
            </span>
          )}
        </div>

        {/* Invaders Track */}
        <div className="space-y-4">
          {invaders.map(inv => {
            const isTargeted = activeInvader?.id === inv.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedTargetId(inv.id)}
                className={`cursor-pointer p-3 rounded-xl border transition-all relative ${
                  isTargeted
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-mono font-black text-lg flex items-center justify-center shadow-md">
                      {inv.currentNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          Gốc: <span className="font-mono text-slate-400">{inv.originalNumber}</span>
                        </span>
                        {isTargeted && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                            Đang Ngắm
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Cần chia hết cho các thừa số nguyên tố
                      </span>
                    </div>
                  </div>

                  {/* Progress bar towards wall */}
                  <div className="w-32 sm:w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${
                        inv.progress > 75 ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${inv.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {invaders.length === 0 && !isGameOver && (
            <div className="py-8 text-center text-slate-500 text-xs italic">
              Chiến trường an toàn! Đang dò quét làn sóng quái vật tiếp theo...
            </div>
          )}
        </div>
      </div>

      {/* Control Cannons: Prime Buttons */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Chọn Thừa Số Nguyên Tố Để Bắn (Nạp Đạn):
          </span>
          {activeInvader && (
            <span className="text-xs font-mono font-bold text-rose-400">
              Mục Tiêu Hiện Tại: {activeInvader.currentNumber}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PRIMES.map(p => {
            const isDivisible = activeInvader ? activeInvader.currentNumber % p === 0 : false;
            return (
              <button
                key={`prime-${p}`}
                onClick={() => handleFirePrime(p)}
                disabled={isGameOver || !activeInvader}
                className="group relative py-4 px-3 bg-gradient-to-b from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 active:scale-95 disabled:opacity-40 border border-slate-600 rounded-2xl font-mono font-black text-2xl text-white shadow-lg transition-all text-center"
              >
                <span>{p}</span>
                <span className="text-[10px] block font-sans font-semibold text-slate-300 group-hover:text-amber-100 uppercase tracking-wider mt-0.5">
                  Nguyên tố
                </span>
              </button>
            );
          })}
        </div>

        {/* Super Blast Skill */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Năng lượng Sóng Thần Ước Lớn Nhất (ƯCLN):</span>
            <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all"
                style={{ width: `${superCharge}%` }}
              />
            </div>
            <span className="font-mono font-bold text-purple-400">{superCharge}%</span>
          </div>

          <button
            onClick={handleSuperBlast}
            disabled={superCharge < 100 || invaders.length === 0}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30"
          >
            <Sparkles className="w-3.5 h-3.5" /> Khai Hỏa Siêu Pháo Bão Số (Diệt Toàn Bộ)
          </button>
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="bg-rose-950/80 rounded-2xl p-6 border border-rose-500/50 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-400/30">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white">PHÁO ĐÀI ĐÃ BỊ XÂM NHẬP!</h4>
            <p className="text-xs text-rose-200 mt-1">
              Đừng nản lòng! Phân tích thừa số nguyên tố nhanh hơn để bảo vệ pháo đài.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl max-w-xs mx-auto text-xs">
            <span className="text-slate-400 block">Tổng điểm đạt được:</span>
            <span className="text-xl font-mono font-black text-amber-400">{score}</span>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg"
          >
            Chơi Lại Trận Mới
          </button>
        </div>
      )}
    </div>
  );
};
