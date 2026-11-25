import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  GraduationCap,
  Users,
  UserCheck,
  Sparkles,
  Globe,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { authenticateWithPhone, AuthUser, UserRole } from '../../utils/auth';
import { soundManager } from '../../utils/sound';
import { Language, translations } from '../../i18n/translations';
import { Classroom, Student } from '../../types/math';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  students?: Student[];
  classrooms?: Classroom[];
  language?: Language;
  onToggleLanguage?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const ROLE_STYLES: Record<
  UserRole,
  {
    icon: React.ComponentType<{ className?: string }>;
    activeTabClass: string;
    buttonClass: string;
    ringClass: string;
    logoClass: string;
    haloClass: string;
    orbTopClass: string;
    orbBottomClass: string;
    borderGlowClass: string;
    titleGradientClass: string;
  }
> = {
  student: {
    icon: GraduationCap,
    activeTabClass:
      'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25',
    buttonClass:
      'from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 shadow-indigo-500/35',
    ringClass: 'focus:ring-indigo-500/30 focus:border-indigo-500',
    logoClass: 'from-indigo-600 via-blue-500 to-cyan-400 shadow-indigo-500/40',
    haloClass: 'from-indigo-500 to-cyan-400',
    orbTopClass: 'bg-indigo-500/35',
    orbBottomClass: 'bg-cyan-400/30',
    borderGlowClass: 'from-indigo-300/60 via-white/50 to-cyan-300/60',
    titleGradientClass: 'from-slate-900 via-indigo-900 to-blue-700 dark:from-white dark:via-indigo-200 dark:to-cyan-300',
  },
  parent: {
    icon: Users,
    activeTabClass:
      'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25',
    buttonClass:
      'from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-400 shadow-emerald-500/35',
    ringClass: 'focus:ring-emerald-500/30 focus:border-emerald-500',
    logoClass: 'from-emerald-600 via-teal-500 to-cyan-400 shadow-emerald-500/40',
    haloClass: 'from-emerald-500 to-cyan-400',
    orbTopClass: 'bg-emerald-500/35',
    orbBottomClass: 'bg-teal-400/30',
    borderGlowClass: 'from-emerald-300/60 via-white/50 to-teal-300/60',
    titleGradientClass: 'from-slate-900 via-emerald-900 to-teal-700 dark:from-white dark:via-emerald-200 dark:to-teal-300',
  },
  teacher: {
    icon: UserCheck,
    activeTabClass:
      'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25',
    buttonClass:
      'from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 shadow-violet-500/35',
    ringClass: 'focus:ring-violet-500/30 focus:border-violet-500',
    logoClass: 'from-violet-600 via-purple-600 to-indigo-500 shadow-violet-500/40',
    haloClass: 'from-violet-500 to-fuchsia-400',
    orbTopClass: 'bg-violet-500/35',
    orbBottomClass: 'bg-fuchsia-500/25',
    borderGlowClass: 'from-violet-300/60 via-white/50 to-fuchsia-300/55',
    titleGradientClass: 'from-slate-900 via-violet-900 to-indigo-700 dark:from-white dark:via-violet-200 dark:to-indigo-300',
  },
};

const FLOATING_CARDS = [
  { formula: 'a² + b² = c²', pos: 'top-[12%] left-[6%] -rotate-6' },
  { formula: 'y = ax + b', pos: 'top-[15%] right-[6%] rotate-6' },
  { formula: 'Δ = b² - 4ac', pos: 'bottom-[14%] left-[7%] rotate-3' },
  { formula: 'S = πR²', pos: 'bottom-[15%] right-[7%] -rotate-6' },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  students = [],
  classrooms = [],
  language = 'vi',
  onToggleLanguage,
  theme = 'light',
  onToggleTheme,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'custom');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];
  const activeRoleStyle = ROLE_STYLES[selectedRole];

  const roleList: { id: UserRole; label: string; desc: string }[] = [
    { id: 'student', label: t.roleStudent, desc: t.roleStudentDesc },
    { id: 'parent', label: t.roleParent, desc: t.roleParentDesc },
    { id: 'teacher', label: t.roleTeacher, desc: t.roleTeacherDesc },
  ];

  const activeRoleText = roleList.find((r) => r.id === selectedRole) || roleList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authenticateWithPhone(phone, password, selectedRole, language);

    if (!result.ok) {
      soundManager.playWrong();
      setError(result.error);
      return;
    }

    let finalUser = result.user;
    if (finalUser.role === 'student') {
      if (selectedStudentId === 'custom') {
        const trimmed = customStudentName.trim();
        if (trimmed) {
          finalUser = {
            ...finalUser,
            name: trimmed,
            studentId: undefined,
            className: classrooms[0]?.name || finalUser.className,
          };
        }
      } else {
        const matchedStudent = students.find((s) => s.id === selectedStudentId);
        if (matchedStudent) {
          const matchedClass = classrooms.find((c) => c.id === matchedStudent.classId)?.name;
          finalUser = {
            ...finalUser,
            name: matchedStudent.name,
            studentId: matchedStudent.id,
            className: matchedClass || finalUser.className,
          };
        }
      }
    }

    soundManager.playCorrect();
    setError(null);
    onLoginSuccess(finalUser);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 font-sans">
      {/* Top-right Language & Theme Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {onToggleLanguage && (
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onToggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
            title={t.language}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>
        )}
        {onToggleTheme && (
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onToggleTheme();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-colors cursor-pointer"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-200" />
            )}
          </button>
        )}
      </div>

      {/* Multi-stop Aurora Mesh Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(79,70,229,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.28),_transparent_55%),radial-gradient(circle_at_center,_rgba(30,27,75,0.9),_rgba(2,6,23,1))]"
      />

      {/* Fine Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.16) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* Concentric Geometric Rings & Sine Wave SVG */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <circle cx="720" cy="450" r="260" stroke="url(#mathRing)" strokeWidth="1.2" strokeDasharray="6 8" />
        <circle cx="720" cy="450" r="390" stroke="url(#mathRing)" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="720" cy="450" r="530" stroke="url(#mathRing)" strokeWidth="0.8" />
        <path
          d="M0 640 Q 240 520, 480 640 T 960 640 T 1440 640"
          stroke="url(#waveGrad)"
          strokeWidth="2"
        />
        <path
          d="M0 260 Q 360 360, 720 240 T 1440 260"
          stroke="url(#waveGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <defs>
          <linearGradient id="mathRing" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Role-Adaptive Glowing Aurora Orbs */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl transition-colors duration-700 ${activeRoleStyle.orbTopClass}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-28 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl transition-colors duration-700 ${activeRoleStyle.orbBottomClass}`}
      />

      {/* Subtle Floating Frosted Math Formula Pills */}
      {FLOATING_CARDS.map((item) => (
        <div
          key={item.formula}
          aria-hidden="true"
          className={`pointer-events-none select-none hidden lg:flex items-center gap-2 absolute px-4 py-2 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/15 text-white/60 font-mono text-sm font-bold shadow-lg animate-float-slow ${item.pos}`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
          <span>{item.formula}</span>
        </div>
      ))}

      {/* Gradient Glow Frame Around Centered Card */}
      <div
        className={`relative z-10 w-full max-w-md p-[1.5px] rounded-[2rem] bg-gradient-to-br ${activeRoleStyle.borderGlowClass} shadow-[0_25px_75px_-15px_rgba(0,0,0,0.65)] transition-all duration-500`}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[calc(2rem-1.5px)] p-7 sm:p-9 space-y-6">
          {/* Brand Logo: Capital M with Ambient Halo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <div
                aria-hidden="true"
                className={`absolute -inset-2 rounded-3xl bg-gradient-to-tr ${activeRoleStyle.haloClass} opacity-35 blur-lg transition-all duration-500`}
              />
              <div
                className={`relative w-18 h-18 rounded-2xl bg-gradient-to-tr ${activeRoleStyle.logoClass} text-white flex items-center justify-center shadow-xl select-none transition-all duration-500 ring-2 ring-white/80 dark:ring-slate-800`}
              >
                <div className="absolute inset-x-1 top-1 h-1/3 rounded-xl bg-white/20 pointer-events-none" />
                <span className="text-[2.6rem] font-black tracking-tight leading-none drop-shadow-sm">
                  M
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.loginPlatformBadge}</span>
              </div>
              <h1
                className={`text-2xl sm:text-[1.7rem] font-black tracking-tight bg-gradient-to-r ${activeRoleStyle.titleGradientClass} bg-clip-text text-transparent`}
              >
                {t.appTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1">{t.loginSubtitle}</p>
            </div>
          </div>

          {/* Segmented Pill Role Selector */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
              {roleList.map((role) => {
                const style = ROLE_STYLES[role.id];
                const Icon = style.icon;
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedRole(role.id);
                      if (error) setError(null);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? style.activeTabClass
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-center text-slate-500 font-medium">
              {activeRoleText.desc}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedRole === 'student' && (
              <div className="space-y-2 p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/70 border border-indigo-100 dark:border-slate-700">
                <label
                  htmlFor="login-student-identity"
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.studentIdentityLabel}</span>
                </label>
                {students.length > 0 && (
                  <select
                    id="login-student-identity"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    {students.map((s) => {
                      const cls = classrooms.find((c) => c.id === s.classId)?.name;
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name}{cls ? ` (${cls})` : ''}
                        </option>
                      );
                    })}
                    <option value="custom">{t.studentIdentityCustomOption}</option>
                  </select>
                )}
                {(selectedStudentId === 'custom' || students.length === 0) && (
                  <input
                    type="text"
                    value={customStudentName}
                    onChange={(e) => setCustomStudentName(e.target.value)}
                    placeholder={t.studentIdentityPlaceholder}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                )}
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                  {t.studentIdentityHint}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="login-phone"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                {t.phoneLabelPrefix} ({activeRoleText.label})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="login-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError(null);
                  }}
                  autoFocus
                  autoComplete="tel"
                  placeholder={t.phonePlaceholder}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${activeRoleStyle.ringClass}`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  autoComplete="current-password"
                  placeholder={t.passwordPlaceholder}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50/90 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all ${activeRoleStyle.ringClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 bg-gradient-to-r ${activeRoleStyle.buttonClass} text-white rounded-2xl text-sm font-extrabold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {t.signInRolePrefix} {activeRoleText.label}
              </span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
            {t.loginFooterNote}
          </div>
        </div>
      </div>
    </div>
  );
};
