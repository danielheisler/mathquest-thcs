import React, { useState } from 'react';
import { Question, LeaderboardEntry } from '../../types/math';
import { SpeedMathGame } from './SpeedMathGame';
import { MathEscapeRoom } from './MathEscapeRoom';
import { FormulaMemoryGame } from './FormulaMemoryGame';
import { BattleshipOxy } from '../games/BattleshipOxy';
import { PrimeDefense } from '../games/PrimeDefense';
import { BodyCameraGamesHub } from '../camera_games/BodyCameraGamesHub';
import { soundManager } from '../../utils/sound';
import { Zap, KeyRound, Brain, Compass, Flame, Camera } from 'lucide-react';

interface SoloGamesHubProps {
  questions: Question[];
  onSaveScore?: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
  activeStudentName?: string;
  activeClassName?: string;
}

export const SoloGamesHub: React.FC<SoloGamesHubProps> = ({
  questions,
  onSaveScore,
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1'
}) => {
  const [activeGame, setActiveGame] = useState<'camera_motion' | 'speed' | 'escape' | 'memory' | 'battleship' | 'prime'>('camera_motion');

  const games = [
    {
      id: 'camera_motion',
      title: 'Vận Động Cơ Thể Camera',
      subtitle: 'Tạo dáng cơ thể chọn đáp án chuẩn lớp học',
      icon: Camera,
      badge: 'Camera Lớp Học ⭐',
      color: 'bg-indigo-600 text-white'
    },
    {
      id: 'speed',
      title: 'Thử Thách Tốc Độ (Speed Math)',
      subtitle: 'Đua tính nhẩm 60s, chuỗi combo x2 x3',
      icon: Zap,
      badge: 'Khởi động nhanh',
      color: 'bg-amber-500 text-white'
    },
    {
      id: 'battleship',
      title: 'Hải Chiến Tọa Độ Oxy',
      subtitle: 'Trò chơi lạ: Dò radar, bắn hạm đội tọa độ Oxy',
      icon: Compass,
      badge: 'Trò chơi mới & Độc đáo ⭐',
      color: 'bg-cyan-600 text-white'
    },
    {
      id: 'prime',
      title: 'Pháo Đài Thừa Số Nguyên Tố',
      subtitle: 'Bắn hạ quái vật số học bằng thừa số nguyên tố',
      icon: Flame,
      badge: 'Trò chơi mới & Kịch tính 🔥',
      color: 'bg-rose-600 text-white'
    },
    {
      id: 'escape',
      title: 'Mật Mã Số Học (Math Quest)',
      subtitle: 'Giải 4 ổ khóa toán học mở hòm kho báu',
      icon: KeyRound,
      badge: 'Tư duy logic',
      color: 'bg-purple-600 text-white'
    },
    {
      id: 'memory',
      title: 'Lật Thẻ Ghép Đôi Công Thức',
      subtitle: 'Ghi nhớ định lý Pythagoras & Hằng đẳng thức',
      icon: Brain,
      badge: 'Khắc sâu lý thuyết',
      color: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Game Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {games.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                soundManager.playClick();
                setActiveGame(g.id as any);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'bg-white/70 hover:bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-xl shrink-0 ${g.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 truncate">{g.badge}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{g.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{g.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Area */}
      <div>
        {activeGame === 'camera_motion' && (
          <BodyCameraGamesHub
            activeStudentName={activeStudentName}
            activeClassName={activeClassName}
          />
        )}
        {activeGame === 'speed' && (
          <SpeedMathGame
            questions={questions}
            onSaveScore={onSaveScore}
            studentName={activeStudentName}
            className={activeClassName}
          />
        )}
        {activeGame === 'battleship' && <BattleshipOxy />}
        {activeGame === 'prime' && <PrimeDefense />}
        {activeGame === 'escape' && <MathEscapeRoom />}
        {activeGame === 'memory' && <FormulaMemoryGame />}
      </div>
    </div>
  );
};
