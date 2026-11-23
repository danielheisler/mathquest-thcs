import React, { useState } from 'react';
import { PythagorasLab } from './PythagorasLab';
import { LinearFunctionLab } from './LinearFunctionLab';
import { EquationBalanceLab } from './EquationBalanceLab';
import { Math3DAnimationTheater } from './Math3DAnimationTheater';
import { GradeVisualLessonsHub } from './GradeVisualLessonsHub';
import { soundManager } from '../../utils/sound';
import { Compass, TrendingUp, Scale, Shapes, Presentation, Sparkles, MonitorPlay, BookOpen } from 'lucide-react';

export const InteractiveLabsHub: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'visual_grades' | 'theater' | 'pythagoras' | 'linear' | 'balance'>('visual_grades');

  const labs = [
    {
      id: 'visual_grades',
      title: 'Bài Giảng Trực Quan Khối 6-9',
      grade: 'Lớp 6, 7, 8, 9 · Đầy Đủ 4 Khối',
      desc: 'Hình học trực quan, Bánh phân số, 7 Hằng đẳng thức và Đồ thị Parabol',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Đủ 4 Khối Lớp ⭐'
    },
    {
      id: 'theater',
      title: 'Bài Giảng Hoạt Hình 3D HD',
      grade: 'Khối 6-9 · 16:9 HD',
      desc: 'Mô phỏng 3D hoạt hình giáo dục tỷ lệ 16:9 thích hợp trình chiếu lớp học',
      icon: MonitorPlay,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badge: 'Trình Chiếu 3D AI ⭐'
    },
    {
      id: 'pythagoras',
      title: 'Định Lý Pythagoras',
      grade: 'Khối 7 & 8',
      desc: 'Trực quan hóa a² + b² = c² qua diện tích hình vuông trên ba cạnh',
      icon: Compass,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'linear',
      title: 'Hàm Số Bậc Nhất y = ax + b',
      grade: 'Khối 9',
      desc: 'Hệ số góc, tung độ gốc và vị trí tương đối giữa hai đường thẳng trên hệ Oxy',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'balance',
      title: 'Cân Thăng Bằng Phương Trình',
      grade: 'Khối 6, 7 & 8',
      desc: 'Mô phỏng đĩa cân thực tế giải thích quy tắc chuyển vế đổi dấu',
      icon: Scale,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Lab Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {labs.map((lab) => {
          const Icon = lab.icon;
          const isActive = activeLab === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveLab(lab.id as any);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 rounded-xl shrink-0 ${lab.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {lab.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {lab.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{lab.title}</span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 block mt-0.5">{lab.grade}</span>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Lab Component */}
      <div>
        {activeLab === 'visual_grades' && <GradeVisualLessonsHub />}
        {activeLab === 'theater' && <Math3DAnimationTheater />}
        {activeLab === 'pythagoras' && <PythagorasLab />}
        {activeLab === 'linear' && <LinearFunctionLab />}
        {activeLab === 'balance' && <EquationBalanceLab />}
      </div>
    </div>
  );
};
