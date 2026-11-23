import React, { useState, useEffect } from 'react';
import { Question, TeamScore, LeaderboardEntry, Classroom, Student } from '../../types/math';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Users, Trophy, Flag, Zap, Bell, Check, X, Timer, RotateCcw, Play, Maximize2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface TeamVersusGameProps {
  questions: Question[];
  classrooms: Classroom[];
  students: Student[];
  onSaveLeaderboard: (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
}

export const TeamVersusGame: React.FC<TeamVersusGameProps> = ({
  questions,
  classrooms,
  students,
  onSaveLeaderboard
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [teamCount, setTeamCount] = useState<2 | 4>(2);
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'buzzer_active' | 'finished'>('setup');
  
  // Teams
  const [teams, setTeams] = useState<TeamScore[]>([
    { id: 'team-1', name: 'Đội Rồng Xanh', color: '#2563eb', score: 0, correctAnswers: 0, streak: 0, boatPosition: 0, members: [] },
    { id: 'team-2', name: 'Đội Hổ Đỏ', color: '#dc2626', score: 0, correctAnswers: 0, streak: 0, boatPosition: 0, members: [] },
    { id: 'team-3', name: 'Đội Đại Bàng Vàng', color: '#d97706', score: 0, correctAnswers: 0, streak: 0, boatPosition: 0, members: [] },
    { id: 'team-4', name: 'Đội Phượng Hoàng Tím', color: '#9333ea', score: 0, correctAnswers: 0, streak: 0, boatPosition: 0, members: [] }
  ]);

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [buzzedTeamId, setBuzzedTeamId] = useState<string | null>(null);
  const [buzzerTimeLeft, setBuzzerTimeLeft] = useState<number>(15);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [winningTeam, setWinningTeam] = useState<TeamScore | null>(null);

  // Initialize teams with student rosters
  useEffect(() => {
    const classStudents = students.filter(s => s.classId === selectedClassId);
    const updated = teams.map((t, i) => {
      // Distribute students
      const assigned = classStudents
        .filter((_, idx) => idx % teamCount === i)
        .map(s => s.name);
      return { ...t, members: assigned };
    });
    setTeams(updated);
  }, [selectedClassId, teamCount, students]);

  // Overall timer when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === 'playing' || gameStatus === 'buzzer_active') {
      timer = setInterval(() => {
        setTotalElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  // Buzzer 15s countdown
  useEffect(() => {
    let bTimer: NodeJS.Timeout;
    if (gameStatus === 'buzzer_active' && buzzerTimeLeft > 0) {
      bTimer = setInterval(() => {
        setBuzzerTimeLeft(prev => {
          if (prev <= 1) {
            handleBuzzerTimeout();
            return 0;
          }
          if (prev <= 4) soundManager.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(bTimer);
  }, [gameStatus, buzzerTimeLeft]);

  const startTeamBattle = () => {
    soundManager.playClick();
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 8);
    setActiveQuestions(shuffled);
    setCurrentQIndex(0);
    setTotalElapsedTime(0);
    setBuzzedTeamId(null);
    setWinningTeam(null);

    // Reset scores & boat positions
    setTeams(prev => prev.map(t => ({
      ...t,
      score: 0,
      correctAnswers: 0,
      streak: 0,
      boatPosition: 0
    })));

    setGameStatus('playing');
  };

  const handleRingBuzzer = (teamId: string) => {
    if (gameStatus !== 'playing') return;
    soundManager.playBuzzer();
    setBuzzedTeamId(teamId);
    setBuzzerTimeLeft(15);
    setGameStatus('buzzer_active');
  };

  const handleBuzzerTimeout = () => {
    soundManager.playWrong();
    setGameStatus('playing');
    setBuzzedTeamId(null);
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (!buzzedTeamId) return;

    if (isCorrect) {
      soundManager.playCorrect();
      setTeams(prev => {
        const next = prev.map(t => {
          if (t.id === buzzedTeamId) {
            const newStreak = t.streak + 1;
            const pts = 100 + (newStreak > 1 ? 50 : 0);
            const newPos = Math.min(100, t.boatPosition + 15);
            return {
              ...t,
              score: t.score + pts,
              correctAnswers: t.correctAnswers + 1,
              streak: newStreak,
              boatPosition: newPos
            };
          }
          return t;
        });

        // Check if any team crossed the finish line
        const winner = next.find(t => t.boatPosition >= 100);
        if (winner) {
          finishGame(winner, next);
        }
        return next;
      });
    } else {
      soundManager.playWrong();
      setTeams(prev => prev.map(t => {
        if (t.id === buzzedTeamId) {
          return {
            ...t,
            score: Math.max(0, t.score - 30),
            streak: 0
          };
        }
        return t;
      }));
    }

    setGameStatus('playing');
    setBuzzedTeamId(null);

    // Advance question
    if (currentQIndex + 1 < activeQuestions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Find team with highest score
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      finishGame(sorted[0], teams);
    }
  };

  const finishGame = (winner: TeamScore, allTeams: TeamScore[]) => {
    soundManager.playVictory();
    setWinningTeam(winner);
    setGameStatus('finished');

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {}

    const selectedClass = classrooms.find(c => c.id === selectedClassId);
    onSaveLeaderboard({
      studentName: `${winner.name} 🏆`,
      className: selectedClass?.name || 'Lớp THCS',
      score: winner.score,
      timeSec: Math.max(1, totalElapsedTime),
      accuracy: 95,
      gameMode: `Đấu Trường Đội Nhóm (${teamCount} đội)`,
      date: new Date().toLocaleDateString('vi-VN')
    });
  };

  const currentQ = activeQuestions[currentQIndex];
  const activeTeamsList = teams.slice(0, teamCount);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Top Banner / Setup bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Chế độ Tập thể · Đấu trường Máy chiếu Lớp học</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Đua Thuyền Toán Học & Đấu Trường Đội Nhóm</h3>
          <p className="text-sm text-slate-600">
            Giáo viên chiếu lên bảng tivi lớp học, học sinh bấm chuông trả lời, đội đúng đẩy thuyền về đích!
          </p>
        </div>

        {gameStatus === 'setup' && (
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-xs text-slate-500 mr-2 font-medium">Lớp:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.roomNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-xs text-slate-500 mr-2 font-medium">Số đội:</span>
              <button
                onClick={() => setTeamCount(2)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  teamCount === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                2 Đội
              </button>
              <button
                onClick={() => setTeamCount(4)}
                className={`ml-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  teamCount === 4 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                4 Đội
              </button>
            </div>
            <button
              onClick={startTeamBattle}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Xuất Phát Trận Đấu
            </button>
          </div>
        )}

        {gameStatus !== 'setup' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg">
              <Timer className="w-4 h-4 text-slate-500" />
              <span>Thời gian: {totalElapsedTime}s</span>
            </div>
            <button
              onClick={() => setGameStatus('setup')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Thiết lập lại
            </button>
          </div>
        )}
      </div>

      {/* Roster preview in setup mode */}
      {gameStatus === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {activeTeamsList.map(t => (
            <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.color }}></span>
                <span className="font-bold text-slate-900 text-sm">{t.name}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mb-2">Thành viên ({t.members.length} bạn):</span>
              <div className="flex flex-wrap gap-1">
                {t.members.length > 0 ? (
                  t.members.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Chưa có danh sách</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Water Race Track Canvas */}
      <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-2 font-mono uppercase tracking-wider">
            <Flag className="w-4 h-4 text-emerald-400" /> Đường Đua Thuyền Toán Học (Vạch Đích 100m)
          </span>
          <span className="text-amber-400 font-bold">Câu hỏi {currentQIndex + 1}/{activeQuestions.length || 8}</span>
        </div>

        {/* Tracks */}
        <div className="space-y-4">
          {activeTeamsList.map((team) => (
            <div key={team.id} className="relative">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2" style={{ color: team.color }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }}></span>
                  {team.name}
                  {team.streak > 1 && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                      ⚡ x{team.streak}
                    </span>
                  )}
                </span>
                <span className="font-mono text-slate-300">{team.score} Điểm · {team.boatPosition}%</span>
              </div>

              {/* Water Channel */}
              <div className="h-10 bg-slate-800/90 rounded-xl relative border border-slate-700/80 overflow-hidden flex items-center px-2">
                {/* Finish Line */}
                <div className="absolute right-0 top-0 bottom-0 w-8 border-l-2 border-dashed border-emerald-400/80 bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold rotate-90">ĐÍCH</span>
                </div>

                {/* Animated Boat */}
                <div
                  className="absolute transition-all duration-700 ease-out flex items-center gap-1.5"
                  style={{ left: `calc(${Math.min(90, team.boatPosition)}%)` }}
                >
                  <div
                    className="p-1.5 rounded-lg shadow-md flex items-center gap-1"
                    style={{ backgroundColor: team.color }}
                  >
                    <span className="text-sm">⛵</span>
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{team.name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playing / Buzzer Action Area */}
      {gameStatus === 'playing' && currentQ && (
        <div className="space-y-5">
          {/* Big Classroom Screen for current question */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-2xl p-6 border border-indigo-100 text-center">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Câu hỏi số {currentQIndex + 1} ({currentQ.grade} · {currentQ.topicName})
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 max-w-2xl mx-auto leading-snug">
              <MathView math={currentQ.questionText} />
            </h3>
            {currentQ.formula && (
              <div className="mt-3 p-3 bg-white rounded-xl inline-block border border-indigo-200 text-lg font-bold text-indigo-700 shadow-xs">
                <MathView math={currentQ.formula} displayMode={true} />
              </div>
            )}
          </div>

          {/* Buzzer Buttons for Teams */}
          <div>
            <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              BẤM CHUÔNG ĐỂ GIÀNH QUYỀN TRẢ LỜI:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeTeamsList.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleRingBuzzer(t.id)}
                  className="p-4 rounded-2xl border-2 text-white font-bold transition-all shadow-md hover:scale-[1.02] flex flex-col items-center justify-center gap-2 active:scale-95"
                  style={{ backgroundColor: t.color, borderColor: t.color }}
                >
                  <Bell className="w-6 h-6 animate-bounce" />
                  <span className="text-sm">{t.name} BẤM</span>
                  <span className="text-[10px] opacity-80 font-normal">Giành quyền ưu tiên</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buzzer Active State - Question options unlocked for buzzed team */}
      {gameStatus === 'buzzer_active' && currentQ && (
        <div className="space-y-5">
          {/* Buzzed Team Header Banner */}
          {(() => {
            const team = teams.find(t => t.id === buzzedTeamId);
            return (
              <div
                className="p-4 rounded-xl text-white flex items-center justify-between shadow-md animate-pulse"
                style={{ backgroundColor: team?.color }}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-80 block">Đang trả lời:</span>
                    <h4 className="text-lg font-extrabold">{team?.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-lg font-mono font-black text-lg">
                  <Timer className="w-5 h-5" />
                  <span>{buzzerTimeLeft}s</span>
                </div>
              </div>
            );
          })()}

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              <MathView math={currentQ.questionText} />
            </h3>
            {currentQ.formula && (
              <div className="p-2.5 bg-white border rounded-lg text-center font-bold text-indigo-700 max-w-md mx-auto mb-3">
                <MathView math={currentQ.formula} displayMode={true} />
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = idx === currentQ.correctAnswerIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSubmit(isCorrect)}
                    className="p-3.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-xl text-left text-sm font-semibold text-slate-800 transition-all flex items-center gap-3 shadow-xs"
                  >
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>
                      <MathView math={opt} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Teacher direct manual grading override */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Thầy/Cô chấm điểm trực tiếp:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnswerSubmit(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Đúng (+100đ & Thuyền tiến)
                </button>
                <button
                  onClick={() => handleAnswerSubmit(false)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Sai (-30đ)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finished Game Summary */}
      {gameStatus === 'finished' && winningTeam && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">
            {winningTeam.name.toUpperCase()} ĐOẠT CÚP VÔ ĐỊCH!
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Tổng điểm: <b className="font-mono text-amber-600 text-lg">{winningTeam.score} điểm</b> · Thời gian đua: <b className="font-mono text-indigo-600">{totalElapsedTime} giây</b>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto my-6">
            {[...activeTeamsList].sort((a, b) => b.score - a.score).map((team, rank) => (
              <div key={team.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">Hạng #{rank + 1}</div>
                <div className="font-bold text-slate-900 text-sm">{team.name}</div>
                <div className="font-mono font-bold text-base mt-1" style={{ color: team.color }}>
                  {team.score} Điểm
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{team.correctAnswers} câu đúng</div>
              </div>
            ))}
          </div>

          <button
            onClick={startTeamBattle}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Bắt Đầu Trận Đấu Mới
          </button>
        </div>
      )}
    </div>
  );
};
