import { MainPortal } from '../types/math';

export type UserRole = MainPortal; // 'student' | 'parent' | 'teacher'

export interface AuthUser {
  id: string;
  role: UserRole;
  phone: string;
  name: string;
  roleLabel: string;
}

interface AccountRecord extends AuthUser {
  password: string;
}

const ACCOUNTS: AccountRecord[] = [
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
  {
    id: 'acc-student-1',
    role: 'student',
    phone: '0987654321',
    password: 'HS201102',
    name: 'Nguyễn Minh Quân',
    roleLabel: 'Học sinh',
  },
];

export const AUTH_STORAGE_KEY = 'mathquest_auth_user';

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s.\-]/g, '');
}

export function authenticateWithPhone(
  phoneInput: string,
  passwordInput: string,
  expectedRole?: UserRole
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const cleanPhone = normalizePhone(phoneInput);
  const cleanPassword = passwordInput.trim();

  if (!cleanPhone) {
    return { ok: false, error: 'Vui lòng nhập số điện thoại đăng nhập.' };
  }
  if (!cleanPassword) {
    return { ok: false, error: 'Vui lòng nhập mật khẩu.' };
  }

  const matched = ACCOUNTS.find((acc) => acc.phone === cleanPhone);
  if (!matched || matched.password !== cleanPassword) {
    return {
      ok: false,
      error: 'Số điện thoại hoặc mật khẩu không chính xác.',
    };
  }

  if (expectedRole && matched.role !== expectedRole) {
    return {
      ok: false,
      error: `Tài khoản này thuộc phần ${matched.roleLabel}. Vui lòng chọn đúng mục ${matched.roleLabel} để đăng nhập.`,
    };
  }

  const { password: _password, ...user } = matched;
  return { ok: true, user };
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

export function isTabAllowedForRole(tab: string, role: UserRole): boolean {
  if (role === 'parent') return tab === 'parent_portal';
  if (role === 'teacher') return TEACHER_TABS.has(tab);
  return STUDENT_TABS.has(tab);
}
