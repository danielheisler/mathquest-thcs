import { Student } from '../types/math';

export interface StudentScoreRecord {
  studentId: string;
  regularScores: (number | null)[]; // 5 slots: Lần 1 .. Lần 5
  midtermScore: number | null; // 1 lần (hệ số 2)
  finalScore: number | null; // 1 lần (hệ số 3)
  updatedAt?: string;
}

export interface GradeAverageResult {
  average: number | null;
  regularSum: number;
  regularCount: number;
  validRegularScores: number[];
  isComplete: boolean; // true when both Giữa kì and Cuối kì are entered
  formulaText: string;
}

export const GRADEBOOK_STORAGE_KEY = 'mathquest_math_gradebook_v1';

export function normalizeScoreInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(',', '.'));
  if (Number.isNaN(parsed)) return null;
  const clamped = Math.max(0, Math.min(10, parsed));
  return Math.round(clamped * 100) / 100;
}

export function calculateStudentAverage(record: StudentScoreRecord): GradeAverageResult {
  const validRegularScores = record.regularScores
    .slice(0, 5)
    .filter((s): s is number => typeof s === 'number' && !Number.isNaN(s));

  const regularSum = validRegularScores.reduce((sum, s) => sum + s, 0);
  const regularCount = validRegularScores.length;
  const gk = record.midtermScore;
  const ck = record.finalScore;

  const hasGk = typeof gk === 'number' && !Number.isNaN(gk);
  const hasCk = typeof ck === 'number' && !Number.isNaN(ck);

  const denominator = regularCount + (hasGk ? 2 : 0) + (hasCk ? 3 : 0);
  if (denominator === 0) {
    return {
      average: null,
      regularSum: 0,
      regularCount: 0,
      validRegularScores: [],
      isComplete: false,
      formulaText: 'Chưa có điểm để tính trung bình.',
    };
  }

  const numerator =
    regularSum + (hasGk ? gk * 2 : 0) + (hasCk ? ck * 3 : 0);
  const average = numerator / denominator;

  const parts: string[] = validRegularScores.map((s) => String(s));
  if (hasGk) parts.push(`${gk}×2`);
  if (hasCk) parts.push(`${ck}×3`);

  const denomParts: string[] = [];
  if (regularCount > 0) denomParts.push(String(regularCount));
  if (hasGk && hasCk) {
    denomParts.push('5');
  } else {
    if (hasGk) denomParts.push('2');
    if (hasCk) denomParts.push('3');
  }

  const formulaText = `(${parts.join(' + ')}) / (${denomParts.join(' + ')}) = ${average.toFixed(2)}`;

  return {
    average,
    regularSum,
    regularCount,
    validRegularScores,
    isComplete: hasGk && hasCk,
    formulaText,
  };
}

export function createEmptyScoreRecord(studentId: string): StudentScoreRecord {
  return {
    studentId,
    regularScores: [null, null, null, null, null],
    midtermScore: null,
    finalScore: null,
  };
}

export function createInitialGradebook(students: Student[]): Record<string, StudentScoreRecord> {
  const initialMap: Record<string, StudentScoreRecord> = {};

  students.forEach((student, idx) => {
    if (idx === 0) {
      initialMap[student.id] = {
        studentId: student.id,
        regularScores: [8, 9, 9.5, 8.5, 9],
        midtermScore: 9,
        finalScore: 9.5,
      };
    } else if (idx === 1) {
      initialMap[student.id] = {
        studentId: student.id,
        regularScores: [6, 8, 9, 1, null],
        midtermScore: 7,
        finalScore: 8,
      };
    } else {
      const base = Math.max(5.5, Math.min(9.5, Math.round(student.overallScore * 2) / 2));
      initialMap[student.id] = {
        studentId: student.id,
        regularScores: [base, Math.min(10, base + 0.5), Math.max(0, base - 0.5), base, null],
        midtermScore: base,
        finalScore: Math.min(10, base + 0.5),
      };
    }
  });

  return initialMap;
}

export function loadSavedGradebook(students: Student[]): Record<string, StudentScoreRecord> {
  const fallback = createInitialGradebook(students);
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(GRADEBOOK_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Record<string, StudentScoreRecord>;
    const merged: Record<string, StudentScoreRecord> = { ...fallback, ...parsed };

    // Ensure every student has a valid 5-slot array
    students.forEach((s) => {
      const rec = merged[s.id];
      if (!rec) {
        merged[s.id] = createEmptyScoreRecord(s.id);
      } else {
        const padded = [...(rec.regularScores || []), null, null, null, null, null].slice(0, 5);
        merged[s.id] = {
          studentId: s.id,
          regularScores: padded,
          midtermScore: rec.midtermScore ?? null,
          finalScore: rec.finalScore ?? null,
          updatedAt: rec.updatedAt,
        };
      }
    });
    return merged;
  } catch {
    return fallback;
  }
}
