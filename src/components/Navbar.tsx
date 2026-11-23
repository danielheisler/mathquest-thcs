import React from 'react';
import { soundManager } from '../utils/sound';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, Globe, GraduationCap, Users, UserCheck, 
  Wifi, WifiOff, Lock, Unlock, KeyRound
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { MainPortal, TeacherRole } from '../types/math';

export type NavTab = 
  | 'solo' | 'body_games' | 'custom_game' | 'exams' | 'ai_exam_studio' | 'homework' | 'ai_duel' | 'labs' 
  | 'parent_portal' 
  | 'classroom' | 'anti_cheat_monitor' | 'homework_tracker' | 'teacher_exams' | 'questions' | 'reports'
  | 'seating_chart' | 'vnedu_gradebook';

interface NavbarProps {
  mainPortal: MainPortal;
  onPortalChange: (portal: MainPortal) => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  teacherRole?: TeacherRole;
  onTeacherRoleChange?: (role: TeacherRole) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  language: Language;
  onToggleLanguage: () => void;
  isOnline: boolean;
  isTeacherUnlocked?: boolean;
  isParentUnlocked?: boolean;
  onLockTeacher?: () => void;
  onLockParent?: () => void;
  onOpenPinSettings?: () => void;
  ongoingTestType?: 'exam' | 'homework' | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  mainPortal,
  onPortalChange,
  activeTab,
  onTabChange,
  teacherRole = 'subject_teacher',
  onTeacherRoleChange,
  isSoundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  language,
  onToggleLanguage,
  isOnline,
  isTeacherUnlocked = false,
  isParentUnlocked = false,
  onLockTeacher,
  onLockParent,
  onOpenPinSettings,
  ongoingTestType = null
}) => {
  const t = translations[language];

  // Secondary nav items depending on active main portal
  const studentNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'solo', label: 'Trò Chơi Toán Học', badge: '5 Game' },
    { id: 'body_games', label: 'Vận Động Cơ Thể Camera', badge: 'Mới ⭐' },
    { id: 'custom_game', label: 'Tạo Trò Chơi Theo Yêu Cầu', badge: 'Studio 🎨' },
    { 
      id: 'exams', 
      label: 'Luyện Đề Giữa/Cuối Kỳ', 
      badge: ongoingTestType === 'exam' ? '🔴 ĐANG LÀM' : 'Khối 6-9' 
    },
    { id: 'ai_exam_studio', label: 'Tạo Đề AI & Giải Chi Tiết', badge: 'AI Mới ✨' },
    { 
      id: 'homework', 
      label: 'Làm Bài Tập Về Nhà', 
      badge: ongoingTestType === 'homework' ? '🔴 ĐANG LÀM' : 'BTVN' 
    },
    { id: 'ai_duel', label: 'Đấu Trí AI MathBot', badge: 'AI' },
    { id: 'labs', label: 'Bài Giảng Trực Quan', badge: 'Lớp 6-9' },
  ];

  // GV Bộ Môn Toán (Cô Diễm Quỳnh)
  const subjectTeacherNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'classroom', label: 'Sổ Điểm Môn Toán & Thứ Hạng', badge: 'Cô Quỳnh' },
    { id: 'ai_exam_studio', label: 'Tạo Đề AI & Giải Chi Tiết', badge: 'AI Mới ✨' },
    { id: 'anti_cheat_monitor', label: 'Radar Chống Chuyển Tab (Live)', badge: '🔴 Live' },
    { id: 'homework_tracker', label: 'Giám Sát BTVN & SMS PH', badge: 'SMS PH' },
    { id: 'teacher_exams', label: 'Đề Thi Thử Học Kỳ & In Đề A4' },
    { id: 'questions', label: 'Ngân Hàng Câu Hỏi MathType' },
    { id: 'reports', label: 'Báo Cáo Tiến Độ Môn Toán & PDF' },
  ];

  // GV Chủ Nhiệm (Sơ Đồ Lớp & VnEdu)
  const homeroomTeacherNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'seating_chart', label: 'Sơ Đồ Chỗ Ngồi Lớp Học', badge: '4 Dãy/Tổ 🪑' },
    { id: 'vnedu_gradebook', label: 'Sổ Điểm Điện Tử VnEdu (Các Môn)', badge: 'VnEdu 📊' },
    { id: 'reports', label: 'Báo Cáo Toàn Diện Lớp & Xuất PDF' },
  ];

  const teacherNavItems = teacherRole === 'subject_teacher' 
    ? subjectTeacherNavItems 
    : homeroomTeacherNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print shadow-xs">
      {/* Offline Alert Strip if no internet */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 text-center">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Chế độ Ngoại tuyến (Offline): Ứng dụng hoạt động 100% mượt mà từ bộ nhớ máy, không cần kết nối mạng.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Brand & 3 Primary Corner Portals */}
        <div className="flex items-center justify-between gap-4 h-16 border-b border-slate-100">
          {/* Brand Wordmark */}
          <button
            onClick={() => {
              onPortalChange('student');
              onTabChange('solo');
            }}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer text-slate-900 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              ∑
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                MathQuest THCS
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase block">
                Cô Diễm Quỳnh · GV Toán THCS
              </span>
            </div>
          </button>

          {/* 3 Main Space Portals (Center Segmented Pill) */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                soundManager.playClick();
                onPortalChange('student');
                if (
                  activeTab === 'classroom' ||
                  activeTab === 'anti_cheat_monitor' ||
                  activeTab === 'homework_tracker' ||
                  activeTab === 'teacher_exams' ||
                  activeTab === 'questions' ||
                  activeTab === 'reports' ||
                  activeTab === 'seating_chart' ||
                  activeTab === 'vnedu_gradebook' ||
                  activeTab === 'parent_portal'
                ) {
                  onTabChange('solo');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainPortal === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Góc Học Sinh</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onPortalChange('parent');
                onTabChange('parent_portal');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainPortal === 'parent'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Góc Phụ Huynh</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                mainPortal === 'parent' 
                  ? 'bg-emerald-700 text-white' 
                  : isParentUnlocked
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-800'
              }`}>
                {isParentUnlocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                {isParentUnlocked ? 'Đã mở' : 'Mã riêng'}
              </span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onPortalChange('teacher');
                if (
                  activeTab !== 'classroom' &&
                  activeTab !== 'ai_exam_studio' &&
                  activeTab !== 'anti_cheat_monitor' &&
                  activeTab !== 'homework_tracker' &&
                  activeTab !== 'teacher_exams' &&
                  activeTab !== 'questions' &&
                  activeTab !== 'reports' &&
                  activeTab !== 'seating_chart' &&
                  activeTab !== 'vnedu_gradebook'
                ) {
                  onTabChange('classroom');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainPortal === 'teacher'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-300" />
              <span>Góc Giáo Viên (Cô Diễm Quỳnh)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                mainPortal === 'teacher' 
                  ? 'bg-indigo-900 text-indigo-200' 
                  : isTeacherUnlocked
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-rose-100 text-rose-700'
              }`}>
                {isTeacherUnlocked ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                {isTeacherUnlocked ? 'Đã mở' : 'Mã riêng'}
              </span>
            </button>
          </div>

          {/* Zone 3: Utilities & Portal Lock Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Contextual Lock / PIN Buttons */}
            {mainPortal === 'teacher' && isTeacherUnlocked && (
              <>
                {onOpenPinSettings && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenPinSettings();
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    title="Đổi mã bảo mật cho Giáo Viên & Phụ Huynh"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Cài Đặt PIN</span>
                  </button>
                )}
                {onLockTeacher && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onLockTeacher();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    title="Khóa góc giáo viên để bảo vệ dữ liệu"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Khóa Góc GV</span>
                  </button>
                )}
              </>
            )}

            {mainPortal === 'parent' && isParentUnlocked && onLockParent && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onLockParent();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Khóa góc phụ huynh"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khóa Góc PH</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleLanguage();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Chuyển đổi ngôn ngữ / Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                isSoundEnabled
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={isSoundEnabled ? t.soundOff : t.soundOn}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen / Projector */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title={t.projectorMode}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Corner Selector */}
        <div className="md:hidden flex items-center justify-around py-2 border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => {
              onPortalChange('student');
              onTabChange('solo');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              mainPortal === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Học Sinh</span>
          </button>
          <button
            onClick={() => {
              onPortalChange('parent');
              onTabChange('parent_portal');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              mainPortal === 'parent' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Phụ Huynh</span>
            <span className="text-[10px]">
              {isParentUnlocked ? '🔓' : '🔒'}
            </span>
          </button>
          <button
            onClick={() => {
              onPortalChange('teacher');
              onTabChange('classroom');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              mainPortal === 'teacher' ? 'bg-indigo-700 text-white' : 'text-slate-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Giáo Viên</span>
            <span className="text-[10px]">
              {isTeacherUnlocked ? '🔓' : '🔒'}
            </span>
          </button>
        </div>

        {/* Tier 2: Sub-navigation links based on current portal */}
        {mainPortal === 'student' && (
          <nav className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {studentNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {mainPortal === 'teacher' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
            {/* Teacher Role Selector Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onTeacherRoleChange?.('subject_teacher');
                  onTabChange('classroom');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  teacherRole === 'subject_teacher'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧑‍🏫 GV Bộ Môn Toán (Cô Diễm Quỳnh)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onTeacherRoleChange?.('homeroom_teacher');
                  onTabChange('seating_chart');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  teacherRole === 'homeroom_teacher'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏫 GV Chủ Nhiệm (Sơ Đồ Lớp & VnEdu)</span>
              </button>
            </div>

            {/* Secondary Nav Items */}
            <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {teacherNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      onTabChange(item.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
