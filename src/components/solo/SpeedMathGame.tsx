import React, { useState, useEffect } from 'react';
import { Question, GradeLevel, LeaderboardEntry } from '../../types/math';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { MathView } from '../common/MathView';
import { Language } from '../../i18n/translations';
import { getLocalizedQuestion } from '../../utils/localize';

interface SpeedMathGameProps {
  questions: Question[];
  onSaveScore?: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
  studentName?: string;
  className?: string;
  language?: Language;
}

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({
  questions,
  onSaveScore,
  studentName = 'Học sinh',
  className = 'Lớp 8B',
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Filter questions based on grade
  const filteredQuestions = selectedGrade === 'all' 
    ? questions 
    : questions.filter(q => q.grade === selectedGrade);

  // Start game
  const startGame = () => {
    soundManager.playClick();
    // Shuffle filtered questions
    const pool = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setCurrentQuestions(pool.length > 0 ? pool : questions.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setCorrectCount(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setElapsedTime(0);
    setGameState('playing');
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameEnd();
            return 0;
          }
          if (prev <= 5) soundManager.playTick();
          return prev - 1;
        });
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleGameEnd = () => {
    soundManager.playVictory();
    setGameState('ended');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    if (onSaveScore) {
      onSaveScore({
        studentName,
        className,
        score,
        timeSec: Math.max(1, elapsedTime),
        accuracy: currentQuestions.length > 0 ? Math.round((correctCount / currentQuestions.length) * 100) : 100,
        gameMode: 'Thử thách Tốc độ',
        date: new Date().toLocaleDateString('vi-VN')
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = idx === currentQ.correctAnswerIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      const bonusMultiplier = streak >= 3 ? 1.5 : streak >= 1 ? 1.2 : 1;
      const points = Math.round(100 * bonusMultiplier);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleGameEnd();
    }
  };

    const currentQ = currentQuestions[currentIndex];
    const localizedQ = currentQ ? getLocalizedQuestion(currentQ, language) : null;

  if (gameState === 'idle') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          {isEn ? 'Speed Math Challenge' : 'Thử Thách Tốc Độ Số Học (Speed Math)'}
        </h3>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          {isEn ? (
            <>Race the 60-second clock! Answer streaks unlock <span className="font-semibold text-amber-600">Bonus Combo Multipliers</span> on the class leaderboard.</>
          ) : (
            <>Chạy đua với thời gian trong 60 giây! Trả lời liên tiếp để kích hoạt <span className="font-semibold text-amber-600">Chuỗi Combo Điểm Thưởng</span> và ghi danh lên bảng vàng lớp học.</>
          )}
        </p>

        {/* Grade Selector */}
        <div className="mt-6 mb-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">{isEn ? 'Select Grade:' : 'Chọn Khối Lớp:'}</span>
          {(['all', 6, 7, 8, 9] as const).map(grade => (
            <button
              key={grade}
              onClick={() => {
                soundManager.playClick();
                setSelectedGrade(grade);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                selectedGrade === grade
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {grade === 'all' ? (isEn ? 'All Middle School Grades' : 'Tất cả Khối THCS') : (isEn ? `Grade ${grade}` : `Khối ${grade}`)}
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-base flex items-center gap-2 mx-auto"
        >
          <Zap className="w-5 h-5" /> {isEn ? 'Start Challenge Now' : 'Bắt Đầu Thử Thách Ngay'}
        </button>
      </div>
    );
  }

  if (gameState === 'ended') {
    const accuracy = currentQuestions.length > 0 ? Math.round((correctCount / currentQuestions.length) * 100) : 0;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          {isEn ? 'Speed Challenge Complete!' : 'Hoàn Thành Thử Thách Tốc Độ!'}
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {isEn ? `Result for ${studentName} (${className}):` : `Kết quả của ${studentName} (${className}):`}
        </p>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <span className="text-xs text-amber-700 block font-medium">{isEn ? 'Total Score' : 'Tổng Điểm'}</span>
            <span className="text-2xl font-black text-amber-600 font-mono">{score}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <span className="text-xs text-emerald-700 block font-medium">{isEn ? 'Accuracy' : 'Độ Chính Xác'}</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">{accuracy}%</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <span className="text-xs text-blue-700 block font-medium">{isEn ? 'Correct / Total' : 'Đúng / Tổng'}</span>
            <span className="text-2xl font-black text-blue-600 font-mono">{correctCount}/{currentQuestions.length}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> {isEn ? 'Play Another Round' : 'Chơi Lại Vòng Khác'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-bold font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{score} {isEn ? 'Pts' : 'Điểm'}</span>
          </div>
          {streak >= 2 && (
            <div className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg animate-pulse">
              🔥 Combo x{streak}!
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <span className="text-slate-500">{isEn ? `Q ${currentIndex + 1}/${currentQuestions.length}` : `Câu ${currentIndex + 1}/${currentQuestions.length}`}</span>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            timeLeft <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && localizedQ && (
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-indigo-600">
                {isEn ? `Grade ${currentQ.grade}` : `Khối ${currentQ.grade}`} · {localizedQ.topicName}
              </span>
              <span className="capitalize px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-medium">{currentQ.difficulty}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 leading-snug">
              <MathView math={localizedQ.questionText} />
            </h4>
            {currentQ.formula && (
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-lg font-bold text-indigo-700 text-center shadow-xs">
                <MathView math={currentQ.formula} displayMode={true} />
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localizedQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-50 border-rose-500 text-rose-800';
                } else {
                  buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-3.5 text-left rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${buttonStyle}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>
                      <MathView math={opt} />
                    </span>
                  </span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-900 block">
                {isEn ? 'Detailed Explanation:' : 'Giải thích chi tiết (Chuẩn MathType):'}
              </span>
              <p className="text-indigo-800 leading-relaxed">
                <MathView math={localizedQ.explanation} />
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{currentIndex + 1 < currentQuestions.length ? (isEn ? 'Next Question' : 'Câu Tiếp Theo') : (isEn ? 'View Results' : 'Xem Kết Quả')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
