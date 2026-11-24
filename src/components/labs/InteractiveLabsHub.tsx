import React, { useState } from 'react';
import { PythagorasLab } from './PythagorasLab';
import { LinearFunctionLab } from './LinearFunctionLab';
import { EquationBalanceLab } from './EquationBalanceLab';
import { Math3DAnimationTheater } from './Math3DAnimationTheater';
import { GradeVisualLessonsHub } from './GradeVisualLessonsHub';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import { Compass, TrendingUp, Scale, Shapes, Presentation, Sparkles, MonitorPlay, BookOpen } from 'lucide-react';

interface InteractiveLabsHubProps {
  language?: Language;
}

export const InteractiveLabsHub: React.FC<InteractiveLabsHubProps> = ({ language = 'vi' }) => {
  const isEn = language === 'en';
  const [activeLab, setActiveLab] = useState<'visual_grades' | 'theater' | 'pythagoras' | 'linear' | 'balance'>('visual_grades');

  const labs = [
    {
      id: 'visual_grades',
      title: isEn ? 'Visual Math Lessons (Grades 6–9)' : 'Bài Giảng Trực Quan Khối 6-9',
      grade: isEn ? 'Grades 6, 7, 8, 9 · All Levels' : 'Lớp 6, 7, 8, 9 · Đầy Đủ 4 Khối',
      desc: isEn ? 'Geometry, Fraction Pies, Identities & Parabola Graphs' : 'Hình học trực quan, Bánh phân số, 7 Hằng đẳng thức và Đồ thị Parabol',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: isEn ? 'All 4 Grades ⭐' : 'Đủ 4 Khối Lớp ⭐'
    },
    {
      id: 'theater',
      title: isEn ? '3D Animated Math Theater HD' : 'Bài Giảng Hoạt Hình 3D HD',
      grade: isEn ? 'Grades 6–9 · 16:9 HD' : 'Khối 6-9 · 16:9 HD',
      desc: isEn ? 'Interactive 16:9 3D educational simulations for classroom projection' : 'Mô phỏng 3D hoạt hình giáo dục tỷ lệ 16:9 thích hợp trình chiếu lớp học',
      icon: MonitorPlay,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badge: isEn ? '3D AI Projection ⭐' : 'Trình Chiếu 3D AI ⭐'
    },
    {
      id: 'pythagoras',
      title: isEn ? 'Pythagorean Theorem Lab' : 'Định Lý Pythagoras',
      grade: isEn ? 'Grades 7 & 8' : 'Khối 7 & 8',
      desc: isEn ? 'Visualize a² + b² = c² via squares on triangle sides' : 'Trực quan hóa a² + b² = c² qua diện tích hình vuông trên ba cạnh',
      icon: Compass,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'linear',
      title: isEn ? 'Linear Function y = ax + b' : 'Hàm Số Bậc Nhất y = ax + b',
      grade: isEn ? 'Grade 9' : 'Khối 9',
      desc: isEn ? 'Slope, y-intercept, and line intersections on the Oxy plane' : 'Hệ số góc, tung độ gốc và vị trí tương đối giữa hai đường thẳng trên hệ Oxy',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'balance',
      title: isEn ? 'Equation Balance Scale' : 'Cân Thăng Bằng Phương Trình',
      grade: isEn ? 'Grades 6, 7 & 8' : 'Khối 6, 7 & 8',
      desc: isEn ? 'Interactive scale explaining equation balancing rules' : 'Mô phỏng đĩa cân thực tế giải thích quy tắc chuyển vế đổi dấu',
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
