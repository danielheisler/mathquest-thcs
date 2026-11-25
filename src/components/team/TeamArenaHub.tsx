import React, { useState } from 'react';
import { Question, Classroom, Student, LeaderboardEntry } from '../../types/math';
import { TeamVersusGame } from './TeamVersusGame';
import { LiveLeaderboard } from './LiveLeaderboard';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { Users, Trophy, Flag, Sparkles } from 'lucide-react';

interface TeamArenaHubProps {
  questions: Question[];
  classrooms: Classroom[];
  students: Student[];
  leaderboardEntries: LeaderboardEntry[];
  onSaveLeaderboard: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
  language?: Language;
}

export const TeamArenaHub: React.FC<TeamArenaHubProps> = ({
  questions,
  classrooms,
  students,
  leaderboardEntries,
  onSaveLeaderboard,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'battle' | 'leaderboard'>('battle');

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl w-fit">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('battle');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'battle'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flag className="w-4 h-4 text-indigo-600" />
          <span>{isEn ? 'Team Math Battle Arena' : 'Đấu Trường Thi Đấu Đội Nhóm'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('leaderboard');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>{isEn ? 'Speed & Score Leaderboard' : 'Bảng Xếp Hạng Thời Gian & Kết Quả'}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'battle' && (
        <TeamVersusGame
          questions={questions}
          classrooms={classrooms}
          students={students}
          onSaveLeaderboard={onSaveLeaderboard}
          language={language}
        />
      )}

      {activeTab === 'leaderboard' && (
        <LiveLeaderboard entries={leaderboardEntries} language={language} />
      )}
    </div>
  );
};
