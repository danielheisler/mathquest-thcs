import { Language, translations } from '../i18n/translations';
import { Classroom, MainPortal, Student } from '../types/math';

export type UserRole = MainPortal; // 'student' | 'parent' | 'teacher'

export interface AuthUser {
  id: string;
  role: UserRole;
  phone: string;
  name: string;
  roleLabel: string;
  studentId?: string;
  className?: string;
}

interface AccountRecord extends AuthUser {
  password: string;
}

const FIXED_STAFF_ACCOUNTS: AccountRecord[] = [
  {
    id: 'acc-parent-1',
    role: 'parent',
    phone: '012345678',
    password: 'PH201102',
    name: 'Phụ huynh học sinh',
    roleLabel: 'Phụ huynh',
  },
  {
    id: 'acc-teacher-1',
    role: 'teacher',
    phone: '0961644242',
    password: 'GV201102',
    name: 'Cô Diễm Quỳnh',
    roleLabel: 'Giáo viên',
  },
];

const FALLBACK_STUDENT_ACCOUNT: AccountRecord = {
  id: 'acc-s1',
  role: 'student',
  phone: '0987654321',
  password: 'HS201102',
  name: 'Nguyễn Minh Quân',
  roleLabel: 'Học sinh',
  studentId: 's1',
  className: 'Lớp 6A1',
};

export const AUTH_STORAGE_KEY = 'mathquest_auth_user';
export const DEFAULT_STUDENT_PASSWORD = 'HS201102';

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s.\-]/g, '');
}

export function getStudentCredentials(
  student: Student,
  fallbackIndex = 0
): { phone: string; code: string; password: string } {
  const numericMatch = /^s(\d+)$/i.exec(student.id);
  const seq = numericMatch ? Number(numericMatch[1]) : fallbackIndex + 1;

  const defaultPhone =
    seq >= 1 && seq <= 79
      ? `09876543${String(20 + seq).padStart(2, '0')}`
      : `098765${String(1000 + seq).slice(-4)}`;
  const defaultCode = `HS${String(seq).padStart(2, '0')}`;

  return {
    phone: student.accountPhone?.trim() || defaultPhone,
    code: student.accountCode?.trim() || defaultCode,
    password: student.accountPassword?.trim() || DEFAULT_STUDENT_PASSWORD,
  };
}

export interface StudentAccountSummary {
  studentId: string;
  name: string;
  className: string;
  phone: string;
  code: string;
  password: string;
}

export function getStudentAccountsList(
  students: Student[],
  classrooms: Classroom[]
): StudentAccountSummary[] {
  return students.map((student, index) => {
    const creds = getStudentCredentials(student, index);
    const cls = classrooms.find((c) => c.id === student.classId)?.name || 'Lớp 6A1';
    return {
      studentId: student.id,
      name: student.name,
      className: cls,
      phone: creds.phone,
      code: creds.code,
      password: creds.password,
    };
  });
}

export function createRegisteredStudent(params: {
  name: string;
  classId: string;
  accountPhone: string;
  password: string;
  existingStudentsCount: number;
}): Student {
  const cleanName = params.name.trim();
  const cleanPhone = normalizePhone(params.accountPhone);
  const seq = params.existingStudentsCount + 1;
  return {
    id: `s-${Date.now()}`,
    name: cleanName,
    classId: params.classId,
    gender: 'male',
    avatarSeed: cleanName,
    overallScore: 8.0,
    gamesPlayed: 0,
    accuracyRate: 0,
    averageTimeSec: 0,
    badge: 'Thành Viên Mới',
    topicsMastery: {
      arithmetic: 80,
      rational: 80,
      algebra: 80,
      equation: 80,
      geometry: 80,
      statistics: 80,
    },
    recentHistory: [],
    attendance: 'present',
    parentPhone: cleanPhone,
    accountPhone: cleanPhone,
    accountCode: `HS${String(seq).padStart(2, '0')}`,
    accountPassword: params.password.trim(),
  };
}

export function authenticateWithPhone(
  phoneInput: string,
  passwordInput: string,
  expectedRole?: UserRole,
  language: Language = 'vi',
  students: Student[] = [],
  classrooms: Classroom[] = []
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const t = translations[language];
  const cleanInput = normalizePhone(phoneInput);
  const cleanInputLower = cleanInput.toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanInput) {
    return { ok: false, error: t.errPhoneRequired };
  }
  if (!cleanPassword) {
    return { ok: false, error: t.errPassRequired };
  }

  // 1. Check Teacher & Parent accounts
  const staffMatch = FIXED_STAFF_ACCOUNTS.find((acc) => acc.phone === cleanInput);
  if (staffMatch) {
    if (staffMatch.password !== cleanPassword) {
      return { ok: false, error: t.errInvalidCredentials };
    }
    if (expectedRole && staffMatch.role !== expectedRole) {
      const roleLabel =
        staffMatch.role === 'teacher' ? t.roleTeacher : t.roleParent;
      return {
        ok: false,
        error:
          language === 'en'
            ? `This account belongs to ${roleLabel}. Please select the ${roleLabel} tab to sign in.`
            : `Tài khoản này thuộc phần ${roleLabel}. Vui lòng chọn đúng mục ${roleLabel} để đăng nhập.`,
      };
    }
    const { password: _password, ...user } = staffMatch;
    return { ok: true, user };
  }

  // 2. Check individual Student accounts (by phone or Student Code e.g. HS01)
  const studentAccounts = getStudentAccountsList(students, classrooms);
  const matchedStudent = studentAccounts.find(
    (acc) =>
      normalizePhone(acc.phone).toLowerCase() === cleanInputLower ||
      acc.code.toLowerCase() === cleanInputLower
  );

  if (matchedStudent) {
    if (matchedStudent.password !== cleanPassword) {
      return { ok: false, error: t.errInvalidCredentials };
    }
    if (expectedRole && expectedRole !== 'student') {
      return {
        ok: false,
        error:
          language === 'en'
            ? `This account belongs to ${t.roleStudent}. Please select the ${t.roleStudent} tab to sign in.`
            : `Tài khoản này thuộc phần ${t.roleStudent}. Vui lòng chọn đúng mục ${t.roleStudent} để đăng nhập.`,
      };
    }
    return {
      ok: true,
      user: {
        id: `acc-${matchedStudent.studentId}`,
        role: 'student',
        phone: matchedStudent.phone,
        name: matchedStudent.name,
        roleLabel: 'Học sinh',
        studentId: matchedStudent.studentId,
        className: matchedStudent.className,
      },
    };
  }

  // 3. Fallback default student account if roster wasn't supplied
  if (students.length === 0 && cleanInput === FALLBACK_STUDENT_ACCOUNT.phone) {
    if (FALLBACK_STUDENT_ACCOUNT.password !== cleanPassword) {
      return { ok: false, error: t.errInvalidCredentials };
    }
    if (expectedRole && expectedRole !== 'student') {
      return {
        ok: false,
        error:
          language === 'en'
            ? `This account belongs to ${t.roleStudent}. Please select the ${t.roleStudent} tab to sign in.`
            : `Tài khoản này thuộc phần ${t.roleStudent}. Vui lòng chọn đúng mục ${t.roleStudent} để đăng nhập.`,
      };
    }
    const { password: _password, ...user } = FALLBACK_STUDENT_ACCOUNT;
    return { ok: true, user };
  }

  return {
    ok: false,
    error: t.errInvalidCredentials,
  };
}

export function getSavedAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (
      parsed &&
      (parsed.role === 'student' || parsed.role === 'parent' || parsed.role === 'teacher') &&
      typeof parsed.phone === 'string'
    ) {
      return parsed;
    }
  } catch {
    // Ignore malformed storage
  }
  return null;
}

export function saveAuthUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getDefaultTabForRole(role: UserRole): 'solo' | 'parent_portal' | 'classroom' {
  switch (role) {
    case 'teacher':
      return 'classroom';
    case 'parent':
      return 'parent_portal';
    case 'student':
    default:
      return 'solo';
  }
}

const STUDENT_TABS = new Set([
  'solo',
  'body_games',
  'exams',
  'homework',
  'ai_duel',
  'labs',
]);

const TEACHER_TABS = new Set([
  'classroom',
  'gradebook',
  'lesson_plans',
  'slide_studio',
  'ai_exam_studio',
  'custom_game',
  'anti_cheat_monitor',
  'homework_tracker',
  'teacher_exams',
  'questions',
  'reports',
  'seating_chart',
  'vnedu_gradebook',
]);

export function getInitialFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'H';
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

export function isTabAllowedForRole(tab: string, role: UserRole): boolean {
  if (role === 'parent') return tab === 'parent_portal';
  if (role === 'teacher') return TEACHER_TABS.has(tab);
  return STUDENT_TABS.has(tab);
}
