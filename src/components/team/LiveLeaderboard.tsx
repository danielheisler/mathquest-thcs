import React, { useState } from 'react';
import { LeaderboardEntry } from '../../types/math';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { Trophy, Medal, Timer, Target, Search, Filter } from 'lucide-react';

interface LiveLeaderboardProps {
  entries: LeaderboardEntry[];
  language?: Language;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ entries, language = 'vi' }) => {
  const isEn = language === 'en';
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = entries.filter((entry) => {
    const matchClass = filterClass === 'all' || entry.className.toLowerCase().includes(filterClass.toLowerCase());
    const matchMode = filterMode === 'all' || entry.gameMode.toLowerCase().includes(filterMode.toLowerCase());
    const matchSearch = entry.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchMode && matchSearch;
  });

  // Sort by score desc, then timeSec asc (quicker is better)
  const sorted = [...filtered].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSec - b.timeSec;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-amber-600 tracking-wider uppercase">
            {isEn ? 'Middle School Hall of Fame' : 'Bảng Vàng Danh Dự THCS'}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
            {isEn ? 'Speed & Score Leaderboard' : 'Bảng Xếp Hạng Thời Gian & Kết Quả'}
          </h3>
          <p className="text-sm text-slate-600">
            {isEn ? 'Accurate live record of scores, accuracy, and speed across students and teams.' : 'Ghi nhận chính xác thành tích thi đấu, điểm số và tốc độ giải toán của từng học sinh và đội nhóm.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? 'Search student...' : 'Tìm theo tên...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-36"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700"
          >
            <option value="all">{isEn ? 'All Classes' : 'Tất cả các lớp'}</option>
            <option value="6A1">{isEn ? 'Class 6A1' : 'Lớp 6A1'}</option>
            <option value="7A2">{isEn ? 'Class 7A2' : 'Lớp 7A2'}</option>
            <option value="8B">{isEn ? 'Class 8B' : 'Lớp 8B'}</option>
            <option value="9C">{isEn ? 'Class 9C' : 'Lớp 9C'}</option>
          </select>

          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700"
          >
            <option value="all">{isEn ? 'All Modes' : 'Mọi thể thức'}</option>
            <option value="tốc độ">{isEn ? 'Speed Math' : 'Thử thách Tốc độ'}</option>
            <option value="đội nhóm">{isEn ? 'Team Battle' : 'Đấu trường Đội nhóm'}</option>
            <option value="mật mã">{isEn ? 'Math Escape Room' : 'Mật mã Số học'}</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
          {/* Rank 2 */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-center order-2 md:order-1">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-2 font-bold font-mono">
              🥈 2
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate">{sorted[1].studentName}</h4>
            <span className="text-xs text-slate-500">{sorted[1].className}</span>
            <div className="mt-2 font-mono font-bold text-base text-slate-800">{sorted[1].score} Điểm</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">⏱ {sorted[1].timeSec}s · {sorted[1].accuracy}%</div>
          </div>

          {/* Rank 1 */}
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-4 text-center order-1 md:order-2 shadow-sm relative -translate-y-1">
            <div className="w-12 h-12 bg-amber-400 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold font-mono text-xl shadow-md">
              👑 1
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full inline-block mb-1">
              Quán Quân
            </span>
            <h4 className="font-extrabold text-slate-900 text-base truncate">{sorted[0].studentName}</h4>
            <span className="text-xs text-slate-600 font-medium">{sorted[0].className}</span>
            <div className="mt-2 font-mono font-black text-xl text-amber-600">{sorted[0].score} Điểm</div>
            <div className="text-xs text-amber-800 font-mono font-semibold mt-0.5">⚡ {sorted[0].timeSec}s · {sorted[0].accuracy}% đúng</div>
          </div>

          {/* Rank 3 */}
          <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 text-center order-3">
            <div className="w-10 h-10 bg-amber-700/20 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2 font-bold font-mono">
              🥉 3
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate">{sorted[2].studentName}</h4>
            <span className="text-xs text-slate-500">{sorted[2].className}</span>
            <div className="mt-2 font-mono font-bold text-base text-slate-800">{sorted[2].score} Điểm</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">⏱ {sorted[2].timeSec}s · {sorted[2].accuracy}%</div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center w-16">Hạng</th>
              <th className="py-3 px-4">Thí Sinh / Đội Nhóm</th>
              <th className="py-3 px-4">Lớp Học</th>
              <th className="py-3 px-4 text-center">Thể Thức</th>
              <th className="py-3 px-4 text-right">Thời Gian</th>
              <th className="py-3 px-4 text-right">Độ Chính Xác</th>
              <th className="py-3 px-4 text-right">Điểm Số</th>
              <th className="py-3 px-4 text-center">Ngày Đạt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {sorted.map((item, index) => {
              const rank = index + 1;
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : `#${rank}`}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.studentName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      {item.className}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{item.gameMode}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-600">
                    {item.timeSec.toFixed(1)}s
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600">
                    {item.accuracy}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-600 text-sm">
                    {item.score}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {item.date}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                  Không tìm thấy kết quả phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
