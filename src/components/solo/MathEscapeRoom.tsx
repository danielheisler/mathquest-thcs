import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Lock, Unlock, KeyRound, Sparkles, HelpCircle, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { MathView } from '../common/MathView';

interface QuestStage {
  id: number;
  title: string;
  grade: string;
  lore: string;
  riddle: string;
  formula: string;
  hint: string;
  correctCode: string;
  explanation: string;
}

export const MathEscapeRoom: React.FC = () => {
  const stages: QuestStage[] = [
    {
      id: 1,
      title: 'Ải 1: Cửa Đá Cổ - Phong Ấn Số Nguyên',
      grade: 'Toán 6',
      lore: 'Bạn đứng trước cánh cổng đá ngàn năm khắc các số nguyên âm và dương. Để cánh cửa mở ra, bạn phải giải phong ấn!',
      riddle: 'Tính giá trị của mật mã: A = (-8) × 4 + 50',
      formula: '(-8) \\times 4 + 50 = ?',
      hint: 'Thực hiện phép nhân trước: (-8) × 4 = -32, sau đó cộng 50.',
      correctCode: '18',
      explanation: '(-8) × 4 = -32. Tiếp tục: -32 + 50 = 18. Mật mã là 18!'
    },
    {
      id: 2,
      title: 'Ải 2: Tháp Bạc - Hằng Đẳng Thức Bí Truyền',
      grade: 'Toán 8',
      lore: 'Một bức tượng nhân sư canh giữ cây cầu treo, yêu cầu bạn tìm giá trị của x để giải mã!',
      riddle: 'Biết x² - 25 = 0 và x là một số dương. Giá trị x là:',
      formula: 'x^2 - 25 = 0 \\quad (x > 0)',
      hint: 'x² = 25. Số dương nào bình phương lên bằng 25?',
      correctCode: '5',
      explanation: 'x² - 25 = (x - 5)(x + 5) = 0. Vì x > 0 nên x = 5!'
    },
    {
      id: 3,
      title: 'Ải 3: Mê Cung Pythagoras',
      grade: 'Toán 7 & 8',
      lore: 'Bức tường mê cung chia thành tam giác vuông có 2 cạnh góc vuông dài 9 mét và 12 mét. Độ dài cạnh huyền là mã mở cửa!',
      riddle: 'Tìm cạnh huyền c của tam giác vuông có hai cạnh góc vuông a = 9 và b = 12:',
      formula: 'c = \\sqrt{9^2 + 12^2}',
      hint: '9² = 81, 12² = 144. Tổng là 225. Căn bậc hai của 225 là bao nhiêu?',
      correctCode: '15',
      explanation: 'c² = 9² + 12² = 81 + 144 = 225 => c = 15. Mã mở là 15!'
    },
    {
      id: 4,
      title: 'Ải 4: Kho Báu Hoàng Gia - Hệ Phương Trình Thần Tốc',
      grade: 'Toán 9',
      lore: 'Hòm kho báu vàng ròng được khóa bởi một hệ phương trình ma thuật. Tìm giá trị của tích x · y!',
      riddle: 'Giải hệ: x + y = 10 và x - y = 4. Nhập mật khẩu là tích x × y:',
      formula: '\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases} \\implies Mật\\;khẩu = x \\cdot y',
      hint: 'Cộng 2 vế: 2x = 14 => x = 7. Khi đó y = 3. Mật khẩu là 7 × 3.',
      correctCode: '21',
      explanation: 'Cộng hai phương trình: 2x = 14 => x = 7 => y = 3. Tích x · y = 7 × 3 = 21!'
    }
  ];

  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [inputCode, setInputCode] = useState<string>('');
  const [unlockedStages, setUnlockedStages] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const stage = stages[currentStageIdx];

  const handleUnlockAttempt = () => {
    if (inputCode.trim() === stage.correctCode) {
      soundManager.playCorrect();
      setFeedback({
        isCorrect: true,
        text: `Chính xác! Cửa ải đã mở! ${stage.explanation}`
      });
      if (!unlockedStages.includes(stage.id)) {
        setUnlockedStages([...unlockedStages, stage.id]);
      }
      if (currentStageIdx === stages.length - 1) {
        setIsCompleted(true);
        soundManager.playVictory();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {}
      }
    } else {
      soundManager.playWrong();
      setFeedback({
        isCorrect: false,
        text: 'Mật mã chưa chính xác! Hãy kiểm tra lại các bước tính hoặc xem gợi ý bên dưới.'
      });
    }
  };

  const handleNextStage = () => {
    soundManager.playClick();
    if (currentStageIdx + 1 < stages.length) {
      setCurrentStageIdx(prev => prev + 1);
      setInputCode('');
      setFeedback(null);
      setShowHint(false);
    }
  };

  const resetQuest = () => {
    soundManager.playClick();
    setCurrentStageIdx(0);
    setInputCode('');
    setUnlockedStages([]);
    setFeedback(null);
    setShowHint(false);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-purple-600 tracking-wider uppercase">Trò chơi cá nhân · Vượt chướng ngại vật</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Mật Mã Số Học & Hòm Kho Báu Tri Thức</h3>
          <p className="text-sm text-slate-600">Vận dụng kiến thức Số học, Hằng đẳng thức, Pythagoras và Hệ phương trình để giải mã.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {stages.map((s, idx) => {
            const isDone = unlockedStages.includes(s.id);
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={s.id}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all border ${
                  isDone
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : isCurrent
                    ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : s.id}
              </div>
            );
          })}
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner animate-bounce">
            <Unlock className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-slate-900">CHÚC MỪNG BẬC THẦY MẬT MÃ!</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
            Bạn đã xuất sắc vượt qua toàn bộ 4 ải mật mã toán học, mở khóa thành công Hòm Kho Báu Tri Thức của vương quốc Toán THCS!
          </p>
          <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto text-amber-800 text-xs">
            🏆 Danh hiệu trao tặng: <b>Chuyên Gia Giải Mã Toán Học THCS</b><br />
            Điểm thưởng tích lũy: <b>+1000 EXP</b> vào hồ sơ học tập.
          </div>
          <button
            onClick={resetQuest}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Chơi Lại Vòng Khác
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stage Lore & Challenge Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-purple-700 uppercase tracking-wider">{stage.title}</span>
              <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-semibold text-[11px]">{stage.grade}</span>
            </div>
            
            <p className="text-sm text-slate-700 italic mb-4 leading-relaxed">
              "{stage.lore}"
            </p>

            <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Câu hỏi giải mã:</div>
              <div className="text-base font-bold text-slate-900 mb-2">
                <MathView math={stage.riddle} />
              </div>
              <div className="p-3 bg-purple-950 text-amber-300 text-center text-lg font-bold rounded-lg shadow-inner">
                <MathView math={stage.formula} displayMode={true} />
              </div>
            </div>
          </div>

          {/* Keycode Input Pad */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-purple-600" /> Nhập Mã Khóa Số Để Mở Ải:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nhập con số giải mã..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
                className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
              <button
                onClick={handleUnlockAttempt}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Mở Khóa
              </button>
            </div>

            {/* Hint toggle */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(!showHint);
                }}
                className="text-slate-500 hover:text-purple-600 font-medium flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Ẩn gợi ý' : 'Cần gợi ý suy luận?'}
              </button>
            </div>

            {showHint && (
              <div className="mt-2.5 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                💡 <b>Gợi ý của sư phụ:</b> {stage.hint}
              </div>
            )}

            {/* Feedback message */}
            {feedback && (
              <div className={`mt-3 p-3 rounded-lg border text-xs font-medium ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                {feedback.text}
              </div>
            )}
          </div>

          {/* Next Stage Button */}
          {feedback?.isCorrect && currentStageIdx < stages.length - 1 && (
            <div className="flex justify-end">
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Tiến Vào Ải Tiếp Theo ({currentStageIdx + 2}/{stages.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
