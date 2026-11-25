import React, { useState } from 'react';
import { Question, LeaderboardEntry } from '../../types/math';
import { SpeedMathGame } from './SpeedMathGame';
import { MathEscapeRoom } from './MathEscapeRoom';
import { FormulaMemoryGame } from './FormulaMemoryGame';
import { BattleshipOxy } from '../games/BattleshipOxy';
import { PrimeDefense } from '../games/PrimeDefense';
import { BodyCameraGamesHub } from '../camera_games/BodyCameraGamesHub';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import { Zap, KeyRound, Brain, Compass, Flame, Camera } from 'lucide-react';

interface SoloGamesHubProps {
  questions: Question[];
  onSaveScore?: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
  activeStudentName?: string;
  activeClassName?: string;
  language?: Language;
}

export const SoloGamesHub: React.FC<SoloGamesHubProps> = ({
  questions,
  onSaveScore,
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1',
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [activeGame, setActiveGame] = useState<'camera_motion' | 'speed' | 'escape' | 'memory' | 'battleship' | 'prime'>('camera_motion');

  const games = [
    {
      id: 'camera_motion',
      title: isEn ? 'Body Camera Motion' : 'Vận Động Cơ Thể Camera',
      subtitle: isEn ? 'Pose in front of camera to pick answers' : 'Tạo dáng cơ thể chọn đáp án chuẩn lớp học',
      icon: Camera,
      badge: isEn ? 'Class Cam ⭐' : 'Camera Lớp Học ⭐',
      color: 'bg-indigo-600 text-white'
    },
    {
      id: 'speed',
      title: isEn ? 'Speed Math Challenge' : 'Thử Thách Tốc Độ (Speed Math)',
      subtitle: isEn ? '60s mental math race with x2 x3 combos' : 'Đua tính nhẩm 60s, chuỗi combo x2 x3',
      icon: Zap,
      badge: isEn ? 'Quick Warm-up' : 'Khởi động nhanh',
      color: 'bg-amber-500 text-white'
    },
    {
      id: 'battleship',
      title: isEn ? 'Oxy Coordinate Battleship' : 'Hải Chiến Tọa Độ Oxy',
      subtitle: isEn ? 'Radar scan & coordinate plane fleet battle' : 'Trò chơi lạ: Dò radar, bắn hạm đội tọa độ Oxy',
      icon: Compass,
      badge: isEn ? 'Unique Game ⭐' : 'Trò chơi mới & Độc đáo ⭐',
      color: 'bg-cyan-600 text-white'
    },
    {
      id: 'prime',
      title: isEn ? 'Prime Factor Fortress' : 'Pháo Đài Thừa Số Nguyên Tố',
      subtitle: isEn ? 'Defeat monsters with prime factorization' : 'Bắn hạ quái vật số học bằng thừa số nguyên tố',
      icon: Flame,
      badge: isEn ? 'Action Math 🔥' : 'Trò chơi mới & Kịch tính 🔥',
      color: 'bg-rose-600 text-white'
    },
    {
      id: 'escape',
      title: isEn ? 'Math Escape Room' : 'Mật Mã Số Học (Math Quest)',
      subtitle: isEn ? 'Unlock 4 math locks to open the chest' : 'Giải 4 ổ khóa toán học mở hòm kho báu',
      icon: KeyRound,
      badge: isEn ? 'Logic Puzzle' : 'Tư duy logic',
      color: 'bg-purple-600 text-white'
    },
    {
      id: 'memory',
      title: isEn ? 'Formula Memory Match' : 'Lật Thẻ Ghép Đôi Công Thức',
      subtitle: isEn ? 'Master Pythagoras & Algebraic Identities' : 'Ghi nhớ định lý Pythagoras & Hằng đẳng thức',
      icon: Brain,
      badge: isEn ? 'Theory Recall' : 'Khắc sâu lý thuyết',
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
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isSelected
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
            language={language}
          />
        )}
        {activeGame === 'speed' && (
          <SpeedMathGame
            questions={questions}
            onSaveScore={onSaveScore}
            studentName={activeStudentName}
            className={activeClassName}
            language={language}
          />
        )}
        {activeGame === 'battleship' && <BattleshipOxy language={language} />}
        {activeGame === 'prime' && <PrimeDefense language={language} />}
        {activeGame === 'escape' && <MathEscapeRoom language={language} />}
        {activeGame === 'memory' && <FormulaMemoryGame language={language} />}
      </div>
    </div>
  );
};
