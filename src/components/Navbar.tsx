import React from 'react';
import { soundManager } from '../utils/sound';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Globe,
  GraduationCap,
  Users,
  UserCheck,
  WifiOff,
  KeyRound,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { MainPortal, TeacherRole } from '../types/math';
import { AuthUser, getDefaultTabForRole, getInitialFromName } from '../utils/auth';

export type NavTab =
  | 'solo'
  | 'body_games'
  | 'custom_game'
  | 'exams'
  | 'ai_exam_studio'
  | 'homework'
  | 'ai_duel'
  | 'labs'
  | 'sharing_box'
  | 'parent_portal'
  | 'classroom'
  | 'gradebook'
  | 'lesson_plans'
  | 'slide_studio'
  | 'anti_cheat_monitor'
  | 'homework_tracker'
  | 'teacher_exams'
  | 'questions'
  | 'reports'
  | 'seating_chart'
  | 'vnedu_gradebook'
  | 'class_life';

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
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
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
  theme,
  onToggleTheme,
  isOnline,
  currentUser,
  onLogout,
  isTeacherUnlocked = false,
  onOpenPinSettings,
  ongoingTestType = null,
}) => {
  const t = translations[language];

  const roleDisplayName =
    currentUser.role === 'teacher'
      ? t.roleTeacher
      : currentUser.role === 'parent'
        ? t.roleParent
        : t.roleStudent;

  const studentInitial = getInitialFromName(currentUser.name);

  // Secondary nav items depending on active main portal
  const studentNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'solo', label: t.navSolo, badge: t.navSoloBadge },
    { id: 'body_games', label: t.navBodyGames, badge: t.navBodyGamesBadge },
    {
      id: 'exams',
      label: t.navExams,
      badge: ongoingTestType === 'exam' ? t.navOngoingBadge : t.navExamsBadge,
    },
    {
      id: 'homework',
      label: t.navHomework,
      badge: ongoingTestType === 'homework' ? t.navOngoingBadge : t.navHomeworkBadge,
    },
    { id: 'ai_duel', label: t.navAiDuel, badge: 'AI' },
    { id: 'labs', label: t.navLabs, badge: t.navLabsBadge },
    { id: 'sharing_box', label: t.navSharingBox, badge: t.navSharingBoxBadge },
  ];

  // GV Bộ Môn Toán (Cô Diễm Quỳnh)
  const subjectTeacherNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'classroom', label: t.navClassroom, badge: t.navClassroomBadge },
    { id: 'gradebook', label: t.navGradebook, badge: t.navGradebookBadge },
    { id: 'lesson_plans', label: t.navLessonPlans, badge: t.navLessonPlansBadge },
    { id: 'slide_studio', label: t.navSlideStudio, badge: t.navSlideStudioBadge },
    { id: 'class_life', label: t.navClassLife, badge: t.navClassLifeBadge },
    { id: 'ai_exam_studio', label: t.navAiExamStudio, badge: t.navAiExamStudioBadge },
    { id: 'custom_game', label: t.navCustomGame, badge: t.navCustomGameBadge },
    { id: 'anti_cheat_monitor', label: t.navAntiCheat, badge: t.navAntiCheatBadge },
    { id: 'homework_tracker', label: t.navHomeworkTracker, badge: t.navHomeworkTrackerBadge },
    { id: 'teacher_exams', label: t.navTeacherExams },
    { id: 'questions', label: t.navQuestions },
    { id: 'reports', label: t.navReports },
  ];

  // GV Chủ Nhiệm (Sơ Đồ Lớp & VnEdu)
  const homeroomTeacherNavItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'seating_chart', label: t.navSeatingChart, badge: t.navSeatingChartBadge },
    { id: 'gradebook', label: t.navGradebook, badge: t.navGradebookBadge },
    { id: 'lesson_plans', label: t.navLessonPlans, badge: t.navLessonPlansBadge },
    { id: 'slide_studio', label: t.navSlideStudio, badge: t.navSlideStudioBadge },
    { id: 'class_life', label: t.navClassLife, badge: t.navClassLifeBadge },
    { id: 'vnedu_gradebook', label: t.navVnEdu, badge: t.navVnEduBadge },
    { id: 'reports', label: t.navHomeroomReports },
  ];

  const teacherNavItems =
    teacherRole === 'subject_teacher' ? subjectTeacherNavItems : homeroomTeacherNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print shadow-xs transition-colors">
      {/* Offline Alert Strip if no internet */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 text-center">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.offlineNotice}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Brand & Role Portal */}
        <div className="flex items-center justify-between gap-4 h-16 border-b border-slate-100 dark:border-slate-800">
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
                {t.appTitle}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase block">
                {t.teacherSubtitle}
              </span>
            </div>
          </button>

          {/* Authorized Portal Role Pill (RBAC) */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {currentUser.role === 'student' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-700 shadow-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{t.portalStudent}</span>
              </div>
            )}

            {currentUser.role === 'parent' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-100" />
                <span>{t.portalParent}</span>
              </div>
            )}

            {currentUser.role === 'teacher' && (
              <div className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-700 text-white shadow-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-200" />
                <span>{t.portalTeacher}</span>
              </div>
            )}
          </div>

          {/* Zone 3: Utilities, User Role, Theme, Bilingual & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser.role === 'teacher' && isTeacherUnlocked && onOpenPinSettings && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenPinSettings();
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title={t.pinSettings}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.pinSettings}</span>
              </button>
            )}

            {currentUser.role === 'student' ? (
              <div
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700/70"
                title={`${t.studentLoggedInAs}: ${currentUser.name} (${currentUser.className || roleDisplayName} · ${currentUser.phone})`}
              >
                <div className="relative w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  <span>{studentInitial}</span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                  />
                </div>
                <div className="text-left leading-tight max-w-[140px] sm:max-w-[190px]">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                    {currentUser.className || roleDisplayName}
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                <span className="text-indigo-700">{roleDisplayName}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-600">{currentUser.phone}</span>
              </div>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title={t.logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleTheme();
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${theme === 'dark'
                ? 'bg-indigo-600 border-indigo-500 text-amber-300 hover:bg-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bilingual Switcher (VI / EN) */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleLanguage();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${language === 'en'
                ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              title={`${t.language}: ${language === 'vi' ? t.vietnamese : t.english}`}
            >
              <Globe className={`w-3.5 h-3.5 ${language === 'en' ? 'text-cyan-200' : 'text-indigo-600'}`} />
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${isSoundEnabled
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

        {/* Mobile Role & Identity Indicator */}
        <div className="md:hidden flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 min-w-0">
            {currentUser.role === 'student' && <GraduationCap className="w-4 h-4 shrink-0" />}
            {currentUser.role === 'parent' && <Users className="w-4 h-4 text-emerald-600 shrink-0" />}
            {currentUser.role === 'teacher' && <UserCheck className="w-4 h-4 shrink-0" />}
            <span className="truncate">
              {currentUser.role === 'student' ? currentUser.name : roleDisplayName}
            </span>
          </div>
          <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
            {currentUser.role === 'student' && currentUser.className ? currentUser.className : currentUser.phone}
          </span>
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
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
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${teacherRole === 'subject_teacher'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span>{t.subjectTeacherBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onTeacherRoleChange?.('homeroom_teacher');
                  onTabChange('seating_chart');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${teacherRole === 'homeroom_teacher'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span>{t.homeroomTeacherBtn}</span>
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
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                      >
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
