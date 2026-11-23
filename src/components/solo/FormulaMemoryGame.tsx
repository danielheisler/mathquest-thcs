import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Check, Brain, Timer } from 'lucide-react';
import { MathView } from '../common/MathView';

interface CardItem {
  id: string;
  pairId: number;
  content: string;
  isFormula: boolean;
  isFlipped: boolean;
  isMatched: boolean;
}

const pairsData = [
  { pairId: 1, formula: 'a^2 + b^2 = c^2', title: 'Định lý Pythagoras (Tam giác vuông)' },
  { pairId: 2, formula: '(A + B)^2 = A^2 + 2AB + B^2', title: 'Bình phương của một tổng' },
  { pairId: 3, formula: 'S = \\frac{1}{2} \\cdot a \\cdot h', title: 'Diện tích hình tam giác' },
  { pairId: 4, formula: 'C = 2 \\cdot \\pi \\cdot R', title: 'Chu vi hình tròn bán kính R' },
  { pairId: 5, formula: '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ', title: 'Tổng ba góc trong một tam giác' },
  { pairId: 6, formula: 'A^2 - B^2 = (A - B)(A + B)', title: 'Hiệu hai bình phương' }
];

export const FormulaMemoryGame: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const initGame = () => {
    soundManager.playClick();
    const newCards: CardItem[] = [];
    pairsData.forEach((pair) => {
      newCards.push({
        id: `f-${pair.pairId}`,
        pairId: pair.pairId,
        content: pair.formula,
        isFormula: true,
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: `t-${pair.pairId}`,
        pairId: pair.pairId,
        content: pair.title,
        isFormula: false,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsWon(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) {
      return;
    }

    soundManager.playClick();
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        soundManager.playCorrect();
        setTimeout(() => {
          updatedCards[firstIdx].isMatched = true;
          updatedCards[secondIdx].isMatched = true;
          setCards([...updatedCards]);
          setFlippedCards([]);

          // Check win
          if (updatedCards.every(c => c.isMatched)) {
            setIsWon(true);
            setIsPlaying(false);
            soundManager.playVictory();
            try {
              confetti({ particleCount: 90, spread: 70 });
            } catch {}
          }
        }, 400);
      } else {
        soundManager.playWrong();
        setTimeout(() => {
          updatedCards[firstIdx].isFlipped = false;
          updatedCards[secondIdx].isFlipped = false;
          setCards([...updatedCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Trò chơi cá nhân · Trí nhớ & Công thức</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Lật Thẻ Ghép Đôi Công Thức & Định Lý</h3>
          <p className="text-sm text-slate-600">Ghép đúng công thức toán học với tên gọi hoặc định lý tương ứng.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">
            <Timer className="w-3.5 h-3.5 text-slate-500" />
            <span>{seconds}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>{moves} Lượt lật</span>
          </div>
          <button
            onClick={initGame}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            title="Chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isWon && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
          <h4 className="text-lg font-bold text-emerald-900">🎉 Tuyệt vời! Bạn đã ghép thành công toàn bộ thẻ!</h4>
          <p className="text-xs text-emerald-700 mt-1">
            Thời gian: <b>{seconds} giây</b> | Số lượt lật thẻ: <b>{moves}</b>. Trí nhớ toán học của bạn rất đáng nể!
          </p>
        </div>
      )}

      {/* Cards Grid: 12 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`min-h-[110px] p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 select-none ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-80 cursor-default'
                  : isRevealed
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-200 shadow-md'
                  : 'bg-gradient-to-br from-indigo-700 to-slate-800 text-white border-indigo-800 hover:scale-[1.02] shadow-sm cursor-pointer'
              }`}
            >
              {isRevealed ? (
                <div className="space-y-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    card.isFormula ? 'text-indigo-600' : 'text-emerald-700'
                  }`}>
                    {card.isFormula ? 'Công thức' : 'Khái niệm'}
                  </span>
                  <div className={`text-xs font-bold leading-tight ${
                    card.isFormula ? 'text-indigo-900 text-sm' : 'text-slate-800'
                  }`}>
                    <MathView math={card.content} displayMode={card.isFormula} />
                  </div>
                  {card.isMatched && (
                    <span className="inline-block mt-1 text-emerald-600">
                      <Check className="w-3.5 h-3.5 mx-auto" />
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                  <span className="text-[11px] font-mono tracking-widest text-indigo-200">THCS MATH</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
