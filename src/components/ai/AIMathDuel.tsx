import React, { useState, useEffect } from 'react';
import { Question } from '../../types/math';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import { Language, translations } from '../../i18n/translations';
import confetti from 'canvas-confetti';
import { Bot, User, Zap, Timer, Trophy, RotateCcw, Swords, ShieldAlert, Sparkles, Check, X } from 'lucide-react';

interface AIMathDuelProps {
  questions: Question[];
  language: Language;
}

export const AIMathDuel: React.FC<AIMathDuelProps> = ({ questions, language }) => {
  const t = translations[language];
  const [gameState, setGameState] = useState<'setup' | 'dueling' | 'ended'>('setup');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [classCode, setClassCode] = useState<string>('20112002');
  
  // Game session state
  const [duelQuestions, setDuelQuestions] = useState<Question[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState<number>(15);
  const [selectedUserOpt, setSelectedUserOpt] = useState<number | null>(null);
  const [aiChoice, setAiChoice] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState<boolean>(true);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);

  // Round 15s timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'dueling' && !roundFinished && roundTimeLeft > 0) {
      timer = setInterval(() => {
        setRoundTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          if (prev <= 4) soundManager.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, roundFinished, roundTimeLeft]);

  // AI response delay simulation
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (gameState === 'dueling' && !roundFinished && duelQuestions[currentRound]) {
      setAiThinking(true);
      setAiChoice(null);

      // AI think time based on difficulty
      const delay = aiDifficulty === 'hard' ? 3500 : aiDifficulty === 'medium' ? 5000 : 7000;
      const targetQ = duelQuestions[currentRound];

      timeout = setTimeout(() => {
        setAiThinking(false);
        // AI accuracy: easy 60%, medium 80%, hard 95%
        const accuracyChance = aiDifficulty === 'hard' ? 0.95 : aiDifficulty === 'medium' ? 0.8 : 0.6;
        const willBeCorrect = Math.random() < accuracyChance;

        if (willBeCorrect) {
          setAiChoice(targetQ.correctAnswerIndex);
        } else {
          // pick random wrong option
          const wrongOptions = [0, 1, 2, 3].filter(idx => idx !== targetQ.correctAnswerIndex);
          const picked = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
          setAiChoice(picked);
        }
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [gameState, currentRound, roundFinished]);

  const handleStartDuel = () => {
    soundManager.playClick();
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setDuelQuestions(shuffled);
    setCurrentRound(0);
    setUserScore(0);
    setAiScore(0);
    setRoundTimeLeft(15);
    setSelectedUserOpt(null);
    setAiChoice(null);
    setRoundFinished(false);
    setGameState('dueling');
  };

  const handleUserSelect = (optIndex: number) => {
    if (roundFinished || selectedUserOpt !== null) return;
    setSelectedUserOpt(optIndex);
    finishRound(optIndex, aiChoice);
  };

  const handleTimeOut = () => {
    finishRound(selectedUserOpt, aiChoice);
  };

  const finishRound = (uChoice: number | null, aChoice: number | null) => {
    setRoundFinished(true);
    const targetQ = duelQuestions[currentRound];
    const isUserCorrect = uChoice === targetQ.correctAnswerIndex;
    const isAiCorrect = (aChoice ?? targetQ.correctAnswerIndex) === targetQ.correctAnswerIndex;

    if (isUserCorrect) {
      soundManager.playCorrect();
      setUserScore(prev => prev + 100);
    } else {
      soundManager.playWrong();
    }

    if (isAiCorrect) {
      setAiScore(prev => prev + 100);
    }
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (currentRound + 1 < duelQuestions.length) {
      setCurrentRound(prev => prev + 1);
      setSelectedUserOpt(null);
      setAiChoice(null);
      setRoundTimeLeft(15);
      setRoundFinished(false);
    } else {
      // Game ended
      setGameState('ended');
      if (userScore > aiScore) {
        soundManager.playVictory();
        try {
          confetti({ particleCount: 120, spread: 80 });
        } catch {}
      } else {
        soundManager.playWrong();
      }
    }
  };

  const currentQ = duelQuestions[currentRound];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-purple-600 tracking-wider uppercase">
              Chế Độ Chơi AI Mới Mẻ
            </span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[11px] font-mono font-bold">
              Mã: {classCode}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Thách Đấu Với AI MathBot Siêu Trí Tuệ
          </h3>
          <p className="text-xs text-slate-600">
            Đối kháng 5 hiệp với trí tuệ nhân tạo! Trả lời nhanh hơn và chính xác hơn để giành chiến thắng.
          </p>
        </div>
      </div>

      {/* Setup screen */}
      {gameState === 'setup' && (
        <div className="space-y-6 text-center max-w-md mx-auto py-4">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Bot className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">Thiết Lập Đấu Trường AI</h4>
            <p className="text-xs text-slate-500 mt-1">Chọn cấp độ tư duy của đối thủ máy tính:</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setAiDifficulty('easy')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                aiDifficulty === 'easy'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              Tân Binh (Dễ)
            </button>
            <button
              onClick={() => setAiDifficulty('medium')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                aiDifficulty === 'medium'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              Chuyên Gia (Vừa)
            </button>
            <button
              onClick={() => setAiDifficulty('hard')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                aiDifficulty === 'hard'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              Bậc Thầy (Khó)
            </button>
          </div>

          <button
            onClick={handleStartDuel}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" /> Bắt Đầu Thách Đấu Ngay
          </button>
        </div>
      )}

      {/* Dueling screen */}
      {gameState === 'dueling' && currentQ && (
        <div className="space-y-6">
          {/* Live Scoreboard (You vs AI) */}
          <div className="grid grid-cols-3 items-center bg-slate-900 text-white p-4 rounded-2xl shadow-md">
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-blue-300 font-semibold block">{t.you}</span>
                <span className="font-mono text-xl font-bold text-white">{userScore} Điểm</span>
              </div>
            </div>

            {/* Round & Timer */}
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                Hiệp {currentRound + 1}/5
              </span>
              <div className={`inline-flex items-center gap-1 font-mono font-black text-xl px-3 py-0.5 rounded-lg ${
                roundTimeLeft <= 5 ? 'text-rose-400 bg-rose-950 animate-pulse' : 'text-amber-400'
              }`}>
                <Timer className="w-4 h-4" /> {roundTimeLeft}s
              </div>
            </div>

            {/* AI Bot */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <span className="text-[11px] text-purple-300 font-semibold block">{t.aiBot}</span>
                <span className="font-mono text-xl font-bold text-white">{aiScore} Điểm</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md inline-block mb-2">
              Khối {currentQ.grade} · {currentQ.topicName}
            </span>
            <h4 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed max-w-xl mx-auto">
              <MathView math={currentQ.questionText} />
            </h4>
            {currentQ.formula && (
              <div className="my-3 p-3 bg-white rounded-xl inline-block border border-slate-200 text-lg font-bold text-indigo-700 shadow-xs">
                <MathView math={currentQ.formula} displayMode={true} />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isUserPicked = selectedUserOpt === idx;
              const isAiPicked = aiChoice === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let style = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
              if (roundFinished) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isUserPicked) {
                  style = 'bg-rose-50 border-rose-400 text-rose-800';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleUserSelect(idx)}
                  disabled={roundFinished}
                  className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>
                      <MathView math={opt} />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUserPicked && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                        Bạn
                      </span>
                    )}
                    {isAiPicked && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-bold">
                        AI
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Round Button */}
          {roundFinished && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                {currentRound + 1 < duelQuestions.length ? 'Hiệp Tiếp Theo' : 'Xem Kết Quả Chung Cuộc'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ended screen */}
      {gameState === 'ended' && (
        <div className="text-center py-8 space-y-5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner bg-amber-100 text-amber-600">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {userScore > aiScore ? '🎉 BẠN ĐÃ CHIẾN THẮNG AI MATHBOT!' : userScore === aiScore ? 'HÒA NHAU VỚI AI!' : 'AI MATHBOT ĐÃ DẪN ĐẦU!'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Điểm số của bạn: <b className="text-indigo-600 font-mono text-sm">{userScore}</b> vs AI: <b className="text-purple-600 font-mono text-sm">{aiScore}</b>
            </p>
          </div>

          <button
            onClick={() => setGameState('setup')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Thách Đấu Lại
          </button>
        </div>
      )}
    </div>
  );
};
