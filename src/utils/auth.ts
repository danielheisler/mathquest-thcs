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
  phone: '0792246341',
  password: 'HS201102',
  name: 'Võ Phương Nhi',
  roleLabel: 'Học sinh',
  studentId: 's1',
  className: 'Lớp 6A1',
};

export const AUTH_STORAGE_KEY = 'mathquest_auth_user';
export const DEFAULT_STUDENT_PASSWORD = 'HS201102';
export const DEFAULT_PARENT_PASSWORD = 'PH201102';

const PASS_UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const PASS_LOWER = 'abcdefghjkmnpqrstuvwxyz';
const PASS_DIGITS = '23456789';
const PASS_ALL = PASS_UPPER + PASS_LOWER + PASS_DIGITS;

export function generateRandomPassword(length = 8): string {
  const chars = [
    PASS_UPPER[Math.floor(Math.random() * PASS_UPPER.length)],
    PASS_LOWER[Math.floor(Math.random() * PASS_LOWER.length)],
    PASS_DIGITS[Math.floor(Math.random() * PASS_DIGITS.length)],
  ];
  while (chars.length < Math.max(6, length)) {
    chars.push(PASS_ALL[Math.floor(Math.random() * PASS_ALL.length)]);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

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

export function getParentCredentials(
  student: Student
): { phone: string; name: string; password: string } {
  return {
    phone: student.parentPhone?.trim() || '',
    name: student.parentName?.trim() || `Phụ huynh em ${student.name}`,
    password: student.parentPassword?.trim() || DEFAULT_PARENT_PASSWORD,
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

  // 2. Helper to check individual Parent accounts (student.parentPhone + parentPassword)
  const checkIndividualParent = (): { ok: true; user: AuthUser } | { ok: false; error: string } | null => {
    const matchedParentStudent = students.find(
      (s) => s.parentPhone && normalizePhone(s.parentPhone).toLowerCase() === cleanInputLower
    );
    if (!matchedParentStudent) return null;

    const parentCreds = getParentCredentials(matchedParentStudent);
    if (parentCreds.password !== cleanPassword) {
      return { ok: false, error: t.errInvalidCredentials };
    }
    if (expectedRole && expectedRole !== 'parent') {
      return {
        ok: false,
        error:
          language === 'en'
            ? `This account belongs to ${t.roleParent}. Please select the ${t.roleParent} tab to sign in.`
            : `Tài khoản này thuộc phần ${t.roleParent}. Vui lòng chọn đúng mục ${t.roleParent} để đăng nhập.`,
      };
    }
    const clsName =
      classrooms.find((c) => c.id === matchedParentStudent.classId)?.name || 'Lớp 6A1';
    return {
      ok: true,
      user: {
        id: `acc-parent-${matchedParentStudent.id}`,
        role: 'parent',
        phone: parentCreds.phone,
        name: parentCreds.name,
        roleLabel: 'Phụ huynh',
        studentId: matchedParentStudent.id,
        className: clsName,
      },
    };
  };

  if (expectedRole === 'parent') {
    const parentResult = checkIndividualParent();
    if (parentResult) return parentResult;
  }

  // 3. Check individual Student accounts (by phone or Student Code e.g. HS01)
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

  if (expectedRole !== 'parent') {
    const parentResult = checkIndividualParent();
    if (parentResult) return parentResult;
  }

  // 4. Fallback default student account if roster wasn't supplied
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
  'class_life',
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
