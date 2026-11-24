import React, { useState } from 'react';
import { Classroom, Student } from '../../types/math';
import { Language } from '../../i18n/translations';
import {
  calculateStudentAverage,
  createEmptyScoreRecord,
  normalizeScoreInput,
  StudentScoreRecord,
} from '../../utils/gradebook';
import { soundManager } from '../../utils/sound';
import {
  Calculator,
  FileSpreadsheet,
  Search,
  Printer,
  CheckCircle2,
  Info,
  RotateCcw,
} from 'lucide-react';

interface MathGradebookBoardProps {
  mode: 'teacher' | 'parent';
  students: Student[];
  classrooms: Classroom[];
  gradebook: Record<string, StudentScoreRecord>;
  onUpdateStudentScores?: (studentId: string, updated: StudentScoreRecord) => void;
  focusStudentId?: string;
  language?: Language;
}

function getAverageBadgeClass(avg: number | null): string {
  if (avg === null) return 'bg-slate-100 text-slate-500 border-slate-200';
  if (avg >= 8.0) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (avg >= 6.5) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (avg >= 5.0) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

export const MathGradebookBoard: React.FC<MathGradebookBoardProps> = ({
  mode,
  students,
  classrooms,
  gradebook,
  onUpdateStudentScores,
  focusStudentId,
  language = 'vi',
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  const isTeacher = mode === 'teacher';
  const isEn = language === 'en';

  const visibleStudents = isTeacher
    ? students.filter((s) => {
        const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
        const matchSearch =
          !searchTerm.trim() ||
          s.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
        return matchClass && matchSearch;
      })
    : students.filter((s) => s.id === (focusStudentId || students[0]?.id));

  const getRecord = (studentId: string): StudentScoreRecord => {
    return gradebook[studentId] || createEmptyScoreRecord(studentId);
  };

  const handleScoreChange = (
    studentId: string,
    field: 'regular' | 'midterm' | 'final',
    rawValue: string,
    regularIndex?: number
  ) => {
    if (!isTeacher || !onUpdateStudentScores) return;
    const current = getRecord(studentId);
    const parsed = normalizeScoreInput(rawValue);

    const updated: StudentScoreRecord = {
      ...current,
      regularScores: [...current.regularScores],
      updatedAt: new Date().toLocaleTimeString('vi-VN'),
    };

    if (field === 'regular' && typeof regularIndex === 'number') {
      updated.regularScores[regularIndex] = parsed;
    } else if (field === 'midterm') {
      updated.midtermScore = parsed;
    } else if (field === 'final') {
      updated.finalScore = parsed;
    }

    onUpdateStudentScores(studentId, updated);
    setSavedNoticeId(studentId);
    setTimeout(() => {
      setSavedNoticeId((prev) => (prev === studentId ? null : prev));
    }, 1200);
  };

  const handleClearStudentScores = (studentId: string) => {
    if (!isTeacher || !onUpdateStudentScores) return;
    soundManager.playClick();
    onUpdateStudentScores(studentId, createEmptyScoreRecord(studentId));
  };

  // Class summary KPIs (Teacher mode)
  const computedAverages = visibleStudents
    .map((s) => calculateStudentAverage(getRecord(s.id)).average)
    .filter((a): a is number => a !== null);

  const classMean =
    computedAverages.length > 0
      ? (computedAverages.reduce((a, b) => a + b, 0) / computedAverages.length).toFixed(2)
      : '—';
  const goodCount = computedAverages.filter((a) => a >= 8.0).length;

  return (
    <div className="space-y-5">
      {/* Header & Formula Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isTeacher
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {isTeacher
                  ? isEn
                    ? 'Math Gradebook (Input & GPA Calculator)'
                    : 'Bảng Điểm Môn Toán (Nhập & Tính ĐTB)'
                  : isEn
                    ? "Student's Detailed Gradebook"
                    : 'Bảng Điểm Chi Tiết Của Con'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTeacher
                  ? isEn
                    ? 'Enter Regular assessments (up to 5), Midterm (1), and Final (1). GPA updates automatically and syncs to the Parent Portal.'
                    : 'Nhập điểm Kiểm tra thường xuyên (tối đa 5 lần), Giữa kì (1 lần) và Cuối kì (1 lần). Điểm trung bình tự động cập nhật và đồng bộ sang Góc Phụ Huynh.'
                  : isEn
                    ? 'View 5 Regular test scores, 1 Midterm score, 1 Final score, and Total GPA updated by Ms. Diễm Quỳnh.'
                    : 'Theo dõi đầy đủ 5 cột Kiểm tra thường xuyên, 1 cột Giữa kì, 1 cột Cuối kì và Tổng điểm trung bình do Cô Diễm Quỳnh cập nhật.'}
              </p>
            </div>
          </div>

          {isTeacher && (
            <div className="flex items-center gap-2 shrink-0 no-print">
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
                {isEn ? 'Class GPA:' : 'ĐTB Lớp:'} <span className="font-mono">{classMean}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                ≥ 8.0: <span className="font-mono">{goodCount}/{visibleStudents.length}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  window.print();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isEn ? 'Print Gradebook' : 'In bảng điểm'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Formula Explanation Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
          <Calculator className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div>
              <span className="font-bold text-slate-900">
                {isEn ? 'GPA Formula: ' : 'Công thức tính Tổng điểm trung bình: '}
              </span>
              <span className="font-mono text-indigo-700 font-bold">
                {isEn
                  ? '(Sum of Regular + Midterm × 2 + Final × 3) / (Regular Count + 5)'
                  : '(Tổng điểm thường xuyên + Giữa kì × 2 + Cuối kì × 3) / (Số cột điểm thường xuyên có + 5)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {isEn
                ? 'Example: 4 regular scores (6, 8, 9, 1), Midterm 7, Final 8 → '
                : 'Ví dụ: 4 lần thường xuyên (6, 8, 9, 1), Giữa kì 7, Cuối kì 8 → '}
              <span className="font-mono text-slate-700 font-semibold">
                (6 + 8 + 9 + 1 + 7×2 + 8×3) / (4 + 5) = 62 / 9 = 6.89
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Filters */}
        {isTeacher && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 no-print">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setSelectedClassId('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedClassId === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isEn ? `All (${students.length})` : `Tất cả (${students.length})`}
              </button>
              {classrooms.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedClassId(cls.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedClassId === cls.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isEn ? 'Search student name...' : 'Tìm tên học sinh...'}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main 4-Column Gradebook Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                {isTeacher && (
                  <th className="py-3.5 px-4 w-52">{isEn ? 'Student' : 'Học sinh'}</th>
                )}
                <th className="py-3.5 px-4 text-center border-l border-slate-200/80">
                  <div>{isEn ? '1. Regular Tests (5 slots)' : '1. Kiểm tra thường xuyên (5 lần)'}</div>
                  <div className="text-[10px] font-semibold text-slate-500 normal-case mt-0.5">
                    {isEn ? 'Weight 1 · Up to 5 scores' : 'Hệ số 1 · Nhập tối đa 5 cột điểm'}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center border-l border-slate-200/80 w-36">
                  <div>{isEn ? '2. Midterm Exam' : '2. Kiểm tra giữa kì'}</div>
                  <div className="text-[10px] font-semibold text-indigo-600 normal-case mt-0.5">
                    {isEn ? '1 slot · Weight 2' : '1 lần · Hệ số 2'}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center border-l border-slate-200/80 w-36">
                  <div>{isEn ? '3. Final Exam' : '3. Kiểm tra cuối kì'}</div>
                  <div className="text-[10px] font-semibold text-rose-600 normal-case mt-0.5">
                    {isEn ? '1 slot · Weight 3' : '1 lần · Hệ số 3'}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center border-l border-slate-200/80 w-44">
                  <div>{isEn ? '4. Total Average (GPA)' : '4. Tổng điểm trung bình'}</div>
                  <div className="text-[10px] font-semibold text-emerald-700 normal-case mt-0.5">
                    {isEn ? '(Reg + Mid×2 + Fin×3) / (N + 5)' : '(Tổng TX + GK×2 + CK×3) / (Số TX + 5)'}
                  </div>
                </th>
                {isTeacher && (
                  <th className="py-3.5 px-3 text-center border-l border-slate-200/80 w-16 no-print">
                    {isEn ? 'Clear' : 'Xóa'}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {visibleStudents.map((student) => {
                const record = getRecord(student.id);
                const stats = calculateStudentAverage(record);
                const clsName =
                  classrooms.find((c) => c.id === student.classId)?.name || 'Lớp 6A1';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {isTeacher && (
                      <td className="py-3 px-4 align-middle">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{clsName}</span>
                          {savedNoticeId === student.id && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              Đã lưu
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Column 1: 5 Regular Tests */}
                    <td className="py-3 px-3 border-l border-slate-100 align-middle">
                      <div className="grid grid-cols-5 gap-1.5">
                        {[0, 1, 2, 3, 4].map((slotIdx) => {
                          const val = record.regularScores[slotIdx];
                          return (
                            <div key={slotIdx} className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-semibold text-slate-400">
                                {isEn ? `#${slotIdx + 1}` : `Lần ${slotIdx + 1}`}
                              </span>
                              {isTeacher ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  step={0.25}
                                  value={val ?? ''}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      student.id,
                                      'regular',
                                      e.target.value,
                                      slotIdx
                                    )
                                  }
                                  placeholder="—"
                                  className="w-12 py-1.5 px-1 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              ) : (
                                <div className="w-12 py-1.5 px-1 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                                  {val !== null ? val : '—'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Column 2: 1 Midterm Test */}
                    <td className="py-3 px-3 border-l border-slate-100 text-center align-middle">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-semibold text-indigo-500">
                          {isEn ? 'Midterm (×2)' : 'Giữa kì (×2)'}
                        </span>
                        {isTeacher ? (
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.25}
                            value={record.midtermScore ?? ''}
                            onChange={(e) =>
                              handleScoreChange(student.id, 'midterm', e.target.value)
                            }
                            placeholder="—"
                            className="w-16 py-1.5 px-2 text-center font-mono font-bold text-xs bg-indigo-50/50 border border-indigo-200 rounded-lg text-indigo-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="w-16 py-1.5 px-2 text-center font-mono font-bold text-xs bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900">
                            {record.midtermScore !== null ? record.midtermScore : '—'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 3: 1 Final Test */}
                    <td className="py-3 px-3 border-l border-slate-100 text-center align-middle">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-semibold text-rose-500">
                          {isEn ? 'Final (×3)' : 'Cuối kì (×3)'}
                        </span>
                        {isTeacher ? (
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.25}
                            value={record.finalScore ?? ''}
                            onChange={(e) =>
                              handleScoreChange(student.id, 'final', e.target.value)
                            }
                            placeholder="—"
                            className="w-16 py-1.5 px-2 text-center font-mono font-bold text-xs bg-rose-50/50 border border-rose-200 rounded-lg text-rose-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        ) : (
                          <div className="w-16 py-1.5 px-2 text-center font-mono font-bold text-xs bg-rose-50/70 border border-rose-200 rounded-lg text-rose-900">
                            {record.finalScore !== null ? record.finalScore : '—'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 4: Total Average */}
                    <td className="py-3 px-4 border-l border-slate-100 text-center align-middle">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-flex items-center justify-center min-w-[4.5rem] px-3 py-1.5 rounded-xl border font-mono font-black text-sm ${getAverageBadgeClass(
                            stats.average
                          )}`}
                          title={stats.formulaText}
                        >
                          {stats.average !== null ? stats.average.toFixed(2) : '—'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {isEn
                            ? `${stats.regularCount} Reg · ${stats.isComplete ? 'Complete' : 'Provisional'}`
                            : `${stats.regularCount} TX${stats.isComplete ? ' · Đủ GK/CK' : ' · Tạm tính'}`}
                        </span>
                      </div>
                    </td>

                    {isTeacher && (
                      <td className="py-3 px-3 border-l border-slate-100 text-center align-middle no-print">
                        <button
                          type="button"
                          onClick={() => handleClearStudentScores(student.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa điểm học sinh này để nhập lại"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

              {visibleStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={isTeacher ? 6 : 4}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Detailed Breakdown Card */}
      {!isTeacher && visibleStudents[0] && (() => {
        const st = visibleStudents[0];
        const stats = calculateStudentAverage(getRecord(st.id));
        return (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">
                {isEn
                  ? `GPA Calculation Breakdown for ${st.name}:`
                  : `Chi tiết cách tính Tổng điểm trung bình của em ${st.name}:`}
              </div>
              <div className="font-mono text-emerald-800 font-semibold">
                {stats.formulaText}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
