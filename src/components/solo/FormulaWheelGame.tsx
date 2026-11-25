import React, { useState } from 'react';
import { Question, GradeLevel, LeaderboardEntry } from '../../types/math';
import { Language } from '../../i18n/translations';
import { getLocalizedQuestion } from '../../utils/localize';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Disc, Sparkles, RotateCw, CheckCircle2, XCircle, Trophy, Filter } from 'lucide-react';

interface WheelSegment {
  id: string;
  labelVi: string;
  labelEn: string;
  formula: string;
  color: string;
  keywords: string[];
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: 'seg-1',
    labelVi: 'Hằng đẳng thức',
    labelEn: 'Algebraic Identities',
    formula: '(A + B)^2 = A^2 + 2AB + B^2',
    color: '#4f46e5',
    keywords: ['hằng đẳng thức', 'bình phương', 'x²', 'identity'],
  },
  {
    id: 'seg-2',
    labelVi: 'Định lý Pythagore',
    labelEn: 'Pythagorean Theorem',
    formula: 'a^2 + b^2 = c^2',
    color: '#0891b2',
    keywords: ['pythagoras', 'tam giác vuông', 'cạnh huyền', 'right triangle'],
  },
  {
    id: 'seg-3',
    labelVi: 'Hệ thức lượng & Δ',
    labelEn: 'Quadratic & Vieta',
    formula: '\\Delta = b^2 - 4ac',
    color: '#059669',
    keywords: ['phương trình', 'bậc hai', 'delta', 'quadratic', 'vi-ét'],
  },
  {
    id: 'seg-4',
    labelVi: 'Số nguyên & ƯCLN',
    labelEn: 'Integers & GCD',
    formula: '\\text{ƯCLN}(a, b)',
    color: '#d97706',
    keywords: ['nguyên', 'ước', 'nguyên tố', 'prime', 'integer', 'gcd'],
  },
  {
    id: 'seg-5',
    labelVi: 'Hàm số y = ax + b',
    labelEn: 'Linear Functions',
    formula: 'y = ax + b \\; (a \\neq 0)',
    color: '#dc2626',
    keywords: ['hàm số', 'đường thẳng', 'tọa độ', 'linear', 'slope'],
  },
  {
    id: 'seg-6',
    labelVi: 'Góc & Tam giác',
    labelEn: 'Angles & Triangles',
    formula: '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ',
    color: '#7c3aed',
    keywords: ['góc', 'tam giác', 'tứ giác', 'angle', 'triangle'],
  },
  {
    id: 'seg-7',
    labelVi: 'Phân số & Tỉ lệ',
    labelEn: 'Fractions & Ratios',
    formula: '\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad = bc',
    color: '#db2777',
    keywords: ['phân số', 'hữu tỉ', 'tỉ lệ', 'fraction', 'rational'],
  },
  {
    id: 'seg-8',
    labelVi: 'Thống kê & Xác suất',
    labelEn: 'Stats & Probability',
    formula: 'P(A) = \\frac{n(A)}{n(\\Omega)}',
    color: '#0d9488',
    keywords: ['xác suất', 'thống kê', 'xúc xắc', 'probability', 'statistics'],
  },
];

interface FormulaWheelGameProps {
  questions: Question[];
  onSaveScore?: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
  studentName?: string;
  className?: string;
  language?: Language;
}

export const FormulaWheelGame: React.FC<FormulaWheelGameProps> = ({
  questions,
  onSaveScore,
  studentName = 'Nguyễn Minh Quân',
  className = 'Lớp 6A1',
  language = 'vi',
}) => {
  const isEn = language === 'en';
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'all'>('all');
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);

  const pickQuestionForSegment = (seg: WheelSegment): Question => {
    const gradePool =
      gradeFilter === 'all' ? questions : questions.filter((q) => q.grade === gradeFilter);
    const pool = gradePool.length > 0 ? gradePool : questions;
    const matched = pool.filter((q) => {
      const hay = `${q.topicName} ${q.questionText}`.toLowerCase();
      return seg.keywords.some((kw) => hay.includes(kw));
    });
    const finalPool = matched.length > 0 ? matched : pool;
    return finalPool[Math.floor(Math.random() * finalPool.length)];
  };

  const handleSpin = () => {
    if (isSpinning || questions.length === 0) return;
    soundManager.playClick();
    setIsSpinning(true);
    setPickedOption(null);

    const segIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segAngle = 360 / WHEEL_SEGMENTS.length;
    // Pointer is at top (0 deg). Center of segment i is at (i * segAngle + segAngle/2).
    const targetMod = (360 - (segIndex * segAngle + segAngle / 2)) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((targetMod - currentMod) + 360) % 360;
    const nextRotation = rotation + 360 * 5 + delta;
    setRotation(nextRotation);

    setTimeout(() => {
      const seg = WHEEL_SEGMENTS[segIndex];
      const q = pickQuestionForSegment(seg);
      setSelectedSegment(seg);
      setActiveQuestion(q);
      setIsSpinning(false);
      soundManager.playCorrect();
    }, 2800);
  };

  const handleAnswer = (optIdx: number) => {
    if (!activeQuestion || pickedOption !== null) return;
    setPickedOption(optIdx);
    const isCorrect = optIdx === activeQuestion.correctAnswerIndex;
    const nextRounds = roundsPlayed + 1;
    setRoundsPlayed(nextRounds);

    if (isCorrect) {
      soundManager.playCorrect();
      const gained = 100 + streak * 25;
      const nextScore = score + gained;
      setScore(nextScore);
      setStreak((s) => s + 1);
      try {
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
      } catch {}
      onSaveScore?.({
        studentName,
        className,
        score: nextScore,
        timeSec: nextRounds * 15,
        accuracy: 100,
        gameMode: isEn ? 'Formula Spin Wheel' : 'Vòng Quay Công Thức',
        date: new Date().toLocaleDateString('vi-VN'),
      });
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const locQ = activeQuestion ? getLocalizedQuestion(activeQuestion, language) : null;
  const segAngle = 360 / WHEEL_SEGMENTS.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold mb-1">
            <Disc className="w-3.5 h-3.5" />
            <span>{isEn ? 'Formula Roulette · Class & Solo Review' : 'Vòng Quay May Mắn Ôn Tập Công Thức'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {isEn ? 'Spin the Wheel · Formula Challenge' : 'Quay Trúng Định Lý – Vận Dụng Giải Ngay'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEn
              ? 'Spin to land on a random math theorem/formula, then state or solve the matching problem.'
              : 'Giáo viên hoặc học sinh bấm quay để chọn ngẫu nhiên một định lý/công thức và trả lời nhanh câu hỏi vận dụng.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={gradeFilter}
              onChange={(e) =>
                setGradeFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as GradeLevel))
              }
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">{isEn ? 'All Grades 6–9' : 'Tất cả Khối 6–9'}</option>
              <option value="6">{isEn ? 'Grade 6' : 'Toán 6'}</option>
              <option value="7">{isEn ? 'Grade 7' : 'Toán 7'}</option>
              <option value="8">{isEn ? 'Grade 8' : 'Toán 8'}</option>
              <option value="9">{isEn ? 'Grade 9' : 'Toán 9'}</option>
            </select>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-black flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{score} pts</span>
            {streak > 1 && <span className="text-rose-600 dark:text-rose-400">· 🔥 x{streak}</span>}
          </div>
        </div>
      </div>

      {/* Main Layout: Wheel Left + Active Theorem & Quiz Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Wheel Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Top Pointer */}
            <div
              aria-hidden="true"
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-md"
            />

            {/* Rotating SVG Wheel */}
            <svg
              viewBox="-110 -110 220 220"
              className="w-full h-full drop-shadow-xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 2.8s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              }}
            >
              {WHEEL_SEGMENTS.map((seg, i) => {
                const startDeg = i * segAngle - 90;
                const endDeg = startDeg + segAngle;
                const startRad = (startDeg * Math.PI) / 180;
                const endRad = (endDeg * Math.PI) / 180;
                const r = 102;
                const x1 = r * Math.cos(startRad);
                const y1 = r * Math.sin(startRad);
                const x2 = r * Math.cos(endRad);
                const y2 = r * Math.sin(endRad);
                const midDeg = startDeg + segAngle / 2;

                return (
                  <g key={seg.id}>
                    <path
                      d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x="60"
                      y="3"
                      fill="#ffffff"
                      fontSize="7.2"
                      fontWeight="800"
                      textAnchor="middle"
                      transform={`rotate(${midDeg})`}
                    >
                      {(isEn ? seg.labelEn : seg.labelVi).slice(0, 16)}
                    </text>
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9" fontWeight="900" fill="#4f46e5">
                SPIN
              </text>
            </svg>
          </div>

          <button
            type="button"
            onClick={handleSpin}
            disabled={isSpinning}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-60 text-white rounded-2xl text-sm font-black shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? isEn
                  ? 'Spinning...'
                  : 'Đang quay...'
                : isEn
                  ? 'Spin the Formula Wheel!'
                  : 'Quay Vòng Quay Công Thức!'}
            </span>
          </button>
        </div>

        {/* Result & Applied Problem Column */}
        <div className="lg:col-span-7">
          {!selectedSegment || !activeQuestion || !locQ ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-500 mx-auto" />
              <h4 className="text-base font-extrabold text-slate-800 dark:text-white">
                {isEn ? 'Ready for Formula Review!' : 'Sẵn Sàng Quay Vòng Ôn Tập!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isEn
                  ? 'Click "Spin the Formula Wheel!" to pick a random theorem or identity. The student states the rule and solves the challenge question right away.'
                  : 'Nhấn "Quay Vòng Quay Công Thức!" để chọn ngẫu nhiên một chuyên đề công thức. Học sinh phát biểu công thức và giải nhanh bài tập vận dụng.'}
              </p>
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-slate-800/60 space-y-4">
              {/* Spun Theorem Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isEn ? 'Spun Theorem / Topic' : 'Ô Công Thức Quay Trúng'}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {isEn ? selectedSegment.labelEn : selectedSegment.labelVi}
                  </h4>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-amber-300 text-sm font-bold">
                  <MathView math={selectedSegment.formula} />
                </div>
              </div>

              {/* Applied Question */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">
                    {isEn ? `Grade ${activeQuestion.grade}` : `Toán ${activeQuestion.grade}`}
                  </span>
                  <span>{locQ.topicName}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  <MathView math={locQ.questionText} />
                </div>
                {activeQuestion.formula && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-indigo-700 dark:text-indigo-300">
                    <MathView math={activeQuestion.formula} displayMode={true} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {locQ.options.map((opt, oIdx) => {
                    const isPicked = pickedOption === oIdx;
                    const isCorrect = oIdx === activeQuestion.correctAnswerIndex;
                    let cls =
                      'bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';
                    if (pickedOption !== null) {
                      if (isCorrect) {
                        cls = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isPicked) {
                        cls = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else {
                        cls = 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60';
                      }
                    }
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleAnswer(oIdx)}
                        disabled={pickedOption !== null}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${cls}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <MathView math={opt} />
                        </span>
                        {pickedOption !== null && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {pickedOption !== null && isPicked && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {pickedOption !== null && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                    <b>{isEn ? 'Explanation: ' : 'Giải thích: '}</b>
                    <MathView math={locQ.explanation} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
