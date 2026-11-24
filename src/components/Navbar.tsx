import React from 'react';
import { soundManager } from '../utils/sound';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, Globe, GraduationCap, Users, UserCheck, 
  WifiOff, KeyRound, LogOut
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { MainPortal, TeacherRole } from '../types/math';
import { AuthUser, getDefaultTabForRole } from '../utils/auth';

export type NavTab = 
  | 'solo' | 'body_games' | 'custom_game' | 'exams' | 'ai_exam_studio' | 'homework' | 'ai_duel' | 'labs' 
  | 'parent_portal' 
  | 'classroom' | 'gradebook' | 'anti_cheat_monitor' | 'homework_tracker' | 'teacher_exams' | 'questions' | 'reports'
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
  currentUser: AuthUser;
  onLogout: () => void;
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
  currentUser,
  onLogout,
  isTeacherUnlocked = false,
  onOpenPinSettings,
  ongoingTestType = null
}) => {
  const t = translations[language];

  // Secondary nav items depending on active main portal
  const studentNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'solo', label: 'Trò Chơi Toán Học', badge: '5 Game' },
    { id: 'body_games', label: 'Vận Động Cơ Thể Camera', badge: 'Mới ⭐' },
    { 
      id: 'exams', 
      label: 'Luyện Đề Giữa/Cuối Kỳ', 
      badge: ongoingTestType === 'exam' ? '🔴 ĐANG LÀM' : 'Khối 6-9' 
    },
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
    { id: 'gradebook', label: 'Bảng Điểm (TX, GK, CK)', badge: 'ĐTB 📊' },
    { id: 'ai_exam_studio', label: 'Tạo Đề AI & Giải Chi Tiết', badge: 'AI Mới ✨' },
    { id: 'custom_game', label: 'Tạo Trò Chơi Cho Lớp', badge: 'Studio 🎨' },
    { id: 'anti_cheat_monitor', label: 'Radar Chống Chuyển Tab (Live)', badge: '🔴 Live' },
    { id: 'homework_tracker', label: 'Giám Sát BTVN & SMS PH', badge: 'SMS PH' },
    { id: 'teacher_exams', label: 'Đề Thi Thử Học Kỳ & In Đề A4' },
    { id: 'questions', label: 'Ngân Hàng Câu Hỏi MathType' },
    { id: 'reports', label: 'Báo Cáo Tiến Độ Môn Toán & PDF' },
  ];

  // GV Chủ Nhiệm (Sơ Đồ Lớp & VnEdu)
  const homeroomTeacherNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'seating_chart', label: 'Sơ Đồ Chỗ Ngồi Lớp Học', badge: '4 Dãy/Tổ 🪑' },
    { id: 'gradebook', label: 'Bảng Điểm (TX, GK, CK)', badge: 'ĐTB 📊' },
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
              onPortalChange(currentUser.role);
              onTabChange(getDefaultTabForRole(currentUser.role));
            }}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer text-slate-900 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              M
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

          {/* Authorized Portal Role Pill (RBAC) */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {currentUser.role === 'student' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-700 shadow-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Góc Học Sinh</span>
              </div>
            )}

            {currentUser.role === 'parent' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-100" />
                <span>Góc Phụ Huynh</span>
              </div>
            )}

            {currentUser.role === 'teacher' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-700 text-white shadow-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-200" />
                <span>Góc Giáo Viên (Cô Diễm Quỳnh)</span>
              </div>
            )}
          </div>

          {/* Zone 3: Utilities, User Role & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser.role === 'teacher' && isTeacherUnlocked && onOpenPinSettings && (
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

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span className="text-indigo-700">{currentUser.roleLabel}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-600">{currentUser.phone}</span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Đăng xuất tài khoản"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>

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

        {/* Mobile Role Indicator */}
        <div className="md:hidden flex items-center justify-between py-2 border-b border-slate-100 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            {currentUser.role === 'student' && <GraduationCap className="w-4 h-4" />}
            {currentUser.role === 'parent' && <Users className="w-4 h-4 text-emerald-600" />}
            {currentUser.role === 'teacher' && <UserCheck className="w-4 h-4" />}
            <span>{currentUser.roleLabel}</span>
          </div>
          <span className="font-mono text-slate-500">{currentUser.phone}</span>
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
