import React, { useMemo, useState } from 'react';
import { Classroom, Student } from '../../types/math';
import { Language } from '../../i18n/translations';
import {
  generateRandomPassword,
  getParentCredentials,
  getStudentCredentials,
} from '../../utils/auth';
import { soundManager } from '../../utils/sound';
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Copy,
  Check,
  Shuffle,
  Download,
  UserPlus,
  Phone,
  KeyRound,
  ShieldCheck,
  X,
  SlidersHorizontal,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface StudentParentDirectoryPanelProps {
  classrooms: Classroom[];
  students: Student[];
  initialClassId?: string;
  onUpdateStudent: (updatedStudent: Student) => void;
  onOpenAddModal?: () => void;
  language?: Language;
}

interface ColumnVisibility {
  studentBasic: boolean;
  studentAccount: boolean;
  parentInfo: boolean;
  academicNotes: boolean;
}

interface EditDraft {
  id: string;
  name: string;
  classId: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  address: string;
  attendance: 'present' | 'absent' | 'late';
  badge: string;
  accountPhone: string;
  accountCode: string;
  accountPassword: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentPassword: string;
  teacherNotes: string;
}

const BADGE_OPTIONS = [
  'Chiến Binh Toán Học',
  'Vua Tốc Độ Số Học',
  'Bậc Thầy Cẩn Thận',
  'Ngôi Sao Tri Thức',
  'Thần Đồng Số Hữu Tỉ',
  'Phù Thủy Hình Học',
  'Đại Sư Hằng Đẳng Thức',
  'Huyền Thoại Toán 9',
  'Thành Viên Mới',
];

const RELATION_OPTIONS = ['Bố', 'Mẹ', 'Ông', 'Bà', 'Anh / Chị', 'Người giám hộ'];

export const StudentParentDirectoryPanel: React.FC<StudentParentDirectoryPanelProps> = ({
  classrooms,
  students,
  initialClassId,
  onUpdateStudent,
  onOpenAddModal,
  language = 'vi',
}) => {
  const isEn = language === 'en';
  const [filterClassId, setFilterClassId] = useState<string>(initialClassId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnVisibility>({
    studentBasic: true,
    studentAccount: true,
    parentInfo: true,
    academicNotes: true,
  });

  // Full detail editor modal
  const [editingStudentOrig, setEditingStudentOrig] = useState<Student | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  const classMap = useMemo(() => {
    const map = new Map<string, Classroom>();
    classrooms.forEach((c) => map.set(c.id, c));
    return map;
  }, [classrooms]);

  const studentIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s, idx) => map.set(s.id, idx));
    return map;
  }, [students]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      if (filterClassId !== 'all' && s.classId !== filterClassId) return false;
      if (!q) return true;
      const idx = studentIndexMap.get(s.id) ?? 0;
      const sCreds = getStudentCredentials(s, idx);
      const pCreds = getParentCredentials(s);
      const clsName = classMap.get(s.classId)?.name || '';
      return (
        s.name.toLowerCase().includes(q) ||
        clsName.toLowerCase().includes(q) ||
        sCreds.phone.toLowerCase().includes(q) ||
        sCreds.code.toLowerCase().includes(q) ||
        pCreds.name.toLowerCase().includes(q) ||
        pCreds.phone.toLowerCase().includes(q) ||
        (s.address || '').toLowerCase().includes(q) ||
        (s.teacherNotes || '').toLowerCase().includes(q)
      );
    });
  }, [students, filterClassId, searchQuery, studentIndexMap, classMap]);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCopy = (key: string, text: string) => {
    soundManager.playClick();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const openFullEditor = (student: Student) => {
    soundManager.playClick();
    const idx = studentIndexMap.get(student.id) ?? 0;
    const sCreds = getStudentCredentials(student, idx);
    const pCreds = getParentCredentials(student);
    setEditingStudentOrig(student);
    setDraft({
      id: student.id,
      name: student.name,
      classId: student.classId,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth || '',
      address: student.address || '',
      attendance: student.attendance,
      badge: student.badge || 'Chiến Binh Toán Học',
      accountPhone: sCreds.phone,
      accountCode: sCreds.code,
      accountPassword: sCreds.password,
      parentName: pCreds.name,
      parentRelation: student.parentRelation || 'Phụ huynh',
      parentPhone: pCreds.phone,
      parentPassword: pCreds.password,
      teacherNotes: student.teacherNotes || '',
    });
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentOrig || !draft || !draft.name.trim()) return;
    soundManager.playCorrect();
    const updated: Student = {
      ...editingStudentOrig,
      name: draft.name.trim(),
      classId: draft.classId,
      gender: draft.gender,
      dateOfBirth: draft.dateOfBirth.trim() || undefined,
      address: draft.address.trim() || undefined,
      attendance: draft.attendance,
      badge: draft.badge.trim() || editingStudentOrig.badge,
      accountPhone: draft.accountPhone.trim(),
      accountCode: draft.accountCode.trim().toUpperCase(),
      accountPassword: draft.accountPassword.trim(),
      parentName: draft.parentName.trim(),
      parentRelation: draft.parentRelation.trim() || undefined,
      parentPhone: draft.parentPhone.trim(),
      parentPassword: draft.parentPassword.trim(),
      teacherNotes: draft.teacherNotes.trim(),
    };
    onUpdateStudent(updated);
    setEditingStudentOrig(null);
    setDraft(null);
    showToast(
      isEn
        ? `Updated full Student & Parent profile for ${updated.name}.`
        : `Đã cập nhật đầy đủ hồ sơ & tài khoản HS – PH của em ${updated.name}.`
    );
  };

  const handleBatchRandomizePasswords = () => {
    if (filteredList.length === 0) return;
    const ok = window.confirm(
      isEn
        ? `Generate new random 8-character passwords for ${filteredList.length} students AND their parents?`
        : `Bạn có chắc muốn tạo mật khẩu ngẫu nhiên 8 ký tự mới cho toàn bộ ${filteredList.length} học sinh VÀ phụ huynh đang hiển thị không?`
    );
    if (!ok) return;
    soundManager.playCorrect();
    filteredList.forEach((student) => {
      const idx = studentIndexMap.get(student.id) ?? 0;
      const sCreds = getStudentCredentials(student, idx);
      const pCreds = getParentCredentials(student);
      onUpdateStudent({
        ...student,
        accountPhone: sCreds.phone,
        accountCode: sCreds.code,
        accountPassword: generateRandomPassword(8),
        parentPhone: pCreds.phone,
        parentPassword: generateRandomPassword(8),
      });
    });
    showToast(
      isEn
        ? `Randomized Student & Parent passwords for ${filteredList.length} records.`
        : `Đã tạo mật khẩu ngẫu nhiên mới cho ${filteredList.length} cặp tài khoản Học sinh – Phụ huynh!`
    );
  };

  const handleExportExcelCsv = () => {
    soundManager.playClick();
    const headers = [
      'STT',
      'Lớp',
      'Họ và tên Học sinh',
      'Giới tính',
      'Ngày sinh',
      'Địa chỉ',
      'Tài khoản HS (SĐT)',
      'Mã HS',
      'Mật khẩu HS',
      'Họ tên Phụ huynh',
      'Quan hệ',
      'Tài khoản PH (SĐT)',
      'Mật khẩu PH',
      'Điểm TB',
      'Tỷ lệ đúng (%)',
      'Ghi chú GV',
    ];
    const escapeCell = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
    const escapePhone = (phone: string) => `="${phone.replace(/"/g, '')}"`;

    const rows = filteredList.map((s, i) => {
      const idx = studentIndexMap.get(s.id) ?? i;
      const sCreds = getStudentCredentials(s, idx);
      const pCreds = getParentCredentials(s);
      const clsName = classMap.get(s.classId)?.name || 'Lớp 6A1';
      return [
        i + 1,
        escapeCell(clsName),
        escapeCell(s.name),
        escapeCell(s.gender === 'female' ? 'Nữ' : 'Nam'),
        escapeCell(s.dateOfBirth || ''),
        escapeCell(s.address || ''),
        escapePhone(sCreds.phone),
        escapeCell(sCreds.code),
        escapeCell(sCreds.password),
        escapeCell(pCreds.name),
        escapeCell(s.parentRelation || 'Phụ huynh'),
        escapePhone(pCreds.phone),
        escapeCell(pCreds.password),
        s.overallScore.toFixed(1),
        `${s.accuracyRate}%`,
        escapeCell(s.teacherNotes || ''),
      ].join(',');
    });

    const csv = '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const scopeName =
      filterClassId === 'all'
        ? 'Tat_Ca_Lop'
        : (classMap.get(filterClassId)?.name || 'Lop').replace(/\s+/g, '_');
    a.href = url;
    a.download = `Ho_So_Tai_Khoan_HS_PH_${scopeName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      isEn
        ? 'Exported full Student & Parent directory for Excel!'
        : 'Đã xuất file bảng tính Excel (.csv chuẩn UTF-8 giữ số 0 đầu SĐT)!'
    );
  };

  const toggleColumn = (key: keyof ColumnVisibility) => {
    soundManager.playClick();
    setColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.studentBasic && !next.studentAccount && !next.parentInfo && !next.academicNotes) {
        return prev; // Always keep at least 1 group visible
      }
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-emerald-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 rounded-2xl p-4 sm:p-5 border border-indigo-100 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold mb-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEn ? 'Full Student & Parent Directory' : 'Tùy Chọn Hồ Sơ & Tài Khoản HS – PH Đầy Đủ'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {isEn
              ? 'Complete Student & Parent Information & Login Credentials'
              : 'Quản Lý Đầy Đủ Thông Tin Học Sinh & Phụ Huynh Theo Lớp'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isEn
              ? 'View, customize columns, edit full personal details, student/parent phone accounts & passwords, or export to Excel.'
              : 'Xem toàn bộ thông tin cá nhân, SĐT tài khoản & mật khẩu của cả Học sinh và Phụ huynh. Mọi thay đổi được đồng bộ trực tiếp với cổng đăng nhập.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAddModal && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenAddModal();
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Add Student' : 'Thêm HS – PH'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleBatchRandomizePasswords}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Tạo mật khẩu ngẫu nhiên 8 ký tự cho tất cả HS & PH trong danh sách lọc"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{isEn ? 'Randomize Passwords' : 'Random MK Cả Danh Sách'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcelCsv}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isEn ? 'Export Excel' : 'Xuất File Excel'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter & Column Customization Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Class Filter + Search */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <select
              value={filterClassId}
              onChange={(e) => {
                soundManager.playClick();
                setFilterClassId(e.target.value);
              }}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">
                📚 {isEn ? `All Classes (${students.length})` : `Tất cả các lớp (${students.length} HS)`}
              </option>
              {classrooms.map((c) => {
                const count = students.filter((s) => s.classId === c.id).length;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count} HS)
                  </option>
                );
              })}
            </select>

            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search student, parent, phone, code, address...'
                    : 'Tìm tên HS, tên PH, SĐT tài khoản HS/PH, mã HS, địa chỉ...'
                }
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password Visibility Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShowPasswords((v) => !v);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${
              showPasswords
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700'
                : 'bg-white text-slate-600 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-600'
            }`}
          >
            {showPasswords ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>
              {showPasswords
                ? isEn
                  ? 'Passwords Visible'
                  : 'Đang hiện Mật khẩu'
                : isEn
                  ? 'Passwords Masked'
                  : 'Đang ẩn Mật khẩu'}
            </span>
          </button>
        </div>

        {/* Column Option Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            {isEn ? 'Display Options:' : 'Tùy chọn cột hiển thị:'}
          </span>
          {(
            [
              {
                key: 'studentBasic',
                labelVi: 'Hồ sơ Học sinh (Lớp, GT, Ngày sinh, Địa chỉ)',
                labelEn: 'Student Profile',
                color: 'indigo',
              },
              {
                key: 'studentAccount',
                labelVi: 'Tài khoản & MK Học sinh',
                labelEn: 'Student Account & Pass',
                color: 'blue',
              },
              {
                key: 'parentInfo',
                labelVi: 'Thông tin, SĐT & MK Phụ huynh',
                labelEn: 'Parent Info & Pass',
                color: 'emerald',
              },
              {
                key: 'academicNotes',
                labelVi: 'Học tập & Ghi chú GV',
                labelEn: 'Academic & Notes',
                color: 'amber',
              },
            ] as const
          ).map((opt) => {
            const active = columns[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleColumn(opt.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-indigo-600 dark:border-indigo-500 shadow-2xs'
                    : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-600'
                }`}
              >
                <span>{active ? '☑' : '☐'}</span>
                <span>{isEn ? opt.labelEn : opt.labelVi}</span>
              </button>
            );
          })}
          <span className="ml-auto text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {isEn ? `Showing ${filteredList.length} records` : `Đang hiển thị ${filteredList.length} hồ sơ HS – PH`}
          </span>
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-3 text-center w-12">STT</th>
              {columns.studentBasic && (
                <th className="py-3 px-3.5 min-w-[200px]">
                  <span className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                    <GraduationCap className="w-3.5 h-3.5" /> Thông Tin Học Sinh
                  </span>
                </th>
              )}
              {columns.studentAccount && (
                <th className="py-3 px-3.5 min-w-[200px] bg-blue-50/60 dark:bg-blue-950/30 border-x border-slate-200/70 dark:border-slate-700">
                  <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300">
                    <KeyRound className="w-3.5 h-3.5" /> Tài Khoản & MK Học Sinh
                  </span>
                </th>
              )}
              {columns.parentInfo && (
                <th className="py-3 px-3.5 min-w-[225px] bg-emerald-50/60 dark:bg-emerald-950/30 border-r border-slate-200/70 dark:border-slate-700">
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                    <HeartHandshake className="w-3.5 h-3.5" /> Thông Tin & TK Phụ Huynh
                  </span>
                </th>
              )}
              {columns.academicNotes && (
                <th className="py-3 px-3.5 min-w-[190px]">
                  <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
                    <FileText className="w-3.5 h-3.5" /> Học Tập & Ghi Chú
                  </span>
                </th>
              )}
              <th className="py-3 px-3 text-center w-28">Tùy Chỉnh</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  <Users className="w-7 h-7 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold">
                    {isEn ? 'No matching student/parent records found.' : 'Không tìm thấy hồ sơ học sinh / phụ huynh phù hợp.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredList.map((s, rowIdx) => {
                const origIdx = studentIndexMap.get(s.id) ?? rowIdx;
                const sCreds = getStudentCredentials(s, origIdx);
                const pCreds = getParentCredentials(s);
                const clsName = classMap.get(s.classId)?.name || 'Lớp 6A1';
                const hsCopyKey = `hs-${s.id}`;
                const phCopyKey = `ph-${s.id}`;

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors align-top"
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                      {rowIdx + 1}
                    </td>

                    {/* Column 1: Basic Student Info */}
                    {columns.studentBasic && (
                      <td className="py-3 px-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-extrabold text-xs shrink-0 uppercase">
                            {s.name.slice(0, 1)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {s.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                                {clsName}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  s.gender === 'female'
                                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                                    : 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                }`}
                              >
                                {s.gender === 'female' ? 'Nữ' : 'Nam'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>NS: {s.dateOfBirth || 'Chưa cập nhật'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[190px]" title={s.address || 'Chưa cập nhật'}>
                                  {s.address || 'Chưa cập nhật địa chỉ'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Column 2: Student Account & Password */}
                    {columns.studentAccount && (
                      <td className="py-3 px-3.5 bg-blue-50/25 dark:bg-blue-950/15 border-x border-slate-100 dark:border-slate-800">
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {sCreds.phone}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 text-[10px] font-bold">
                              {sCreds.code}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-blue-100 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-300">
                              MK:{' '}
                              <b className="text-slate-900 dark:text-white">
                                {showPasswords ? sCreds.password : '••••••••'}
                              </b>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  hsCopyKey,
                                  `Học sinh: ${s.name} (${clsName}) | TK: ${sCreds.phone} (${sCreds.code}) | MK: ${sCreds.password}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
                              title="Sao chép tài khoản & mật khẩu học sinh"
                            >
                              {copiedKey === hsCopyKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Column 3: Parent Full Info & Account */}
                    {columns.parentInfo && (
                      <td className="py-3 px-3.5 bg-emerald-50/25 dark:bg-emerald-950/15 border-r border-slate-100 dark:border-slate-800">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {pCreds.name}
                            </span>
                            {s.parentRelation && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                                {s.parentRelation}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold">
                            <Phone className="w-3 h-3" />
                            <span>{pCreds.phone || 'Chưa có SĐT'}</span>
                          </div>
                          <div className="font-mono text-[11px] flex items-center justify-between gap-2 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-emerald-100 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-300">
                              MK PH:{' '}
                              <b className="text-slate-900 dark:text-white">
                                {showPasswords ? pCreds.password : '••••••••'}
                              </b>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  phCopyKey,
                                  `Phụ huynh: ${pCreds.name} (PH em ${s.name} - ${clsName}) | TK: ${pCreds.phone} | MK: ${pCreds.password}`
                                )
                              }
                              className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 cursor-pointer"
                              title="Sao chép tài khoản & mật khẩu phụ huynh"
                            >
                              {copiedKey === phCopyKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Column 4: Academic & Teacher Notes */}
                    {columns.academicNotes && (
                      <td className="py-3 px-3.5">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                              ĐTB: {s.overallScore.toFixed(1)}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                              Đúng: {s.accuracyRate}%
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                s.attendance === 'present'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : s.attendance === 'late'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {s.attendance === 'present'
                                ? 'Có mặt'
                                : s.attendance === 'late'
                                  ? 'Đi muộn'
                                  : 'Vắng'}
                            </span>
                          </div>
                          <p
                            className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2"
                            title={s.teacherNotes || ''}
                          >
                            {s.teacherNotes || 'Chưa có ghi chú thêm từ giáo viên.'}
                          </p>
                        </div>
                      </td>
                    )}

                    {/* Action Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => openFullEditor(s)}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Tùy chỉnh</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FULL EDIT MODAL FOR STUDENT & PARENT PROFILE + CREDENTIALS */}
      {editingStudentOrig && draft && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 my-8">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Tùy Chọn Thông Tin Đầy Đủ HS – PH: {editingStudentOrig.name}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Chỉnh sửa trọn bộ hồ sơ cá nhân, số điện thoại đăng nhập và mật khẩu của cả Học sinh lẫn Phụ huynh.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingStudentOrig(null);
                  setDraft(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDraft} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LEFT PANEL: STUDENT INFO & ACCOUNT */}
                <div className="bg-indigo-50/40 dark:bg-indigo-950/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>1. Hồ Sơ & Tài Khoản Học Sinh</span>
                  </h5>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Họ và tên Học sinh *
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Lớp học
                      </label>
                      <select
                        value={draft.classId}
                        onChange={(e) => setDraft({ ...draft, classId: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {classrooms.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Giới tính
                      </label>
                      <select
                        value={draft.gender}
                        onChange={(e) =>
                          setDraft({ ...draft, gender: e.target.value as 'male' | 'female' })
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="text"
                        placeholder="VD: 15/08/2013"
                        value={draft.dateOfBirth}
                        onChange={(e) => setDraft({ ...draft, dateOfBirth: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Điểm danh
                      </label>
                      <select
                        value={draft.attendance}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            attendance: e.target.value as Student['attendance'],
                          })
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                      >
                        <option value="present">Có mặt</option>
                        <option value="late">Đi muộn</option>
                        <option value="absent">Vắng</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Địa chỉ liên hệ
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Quận Hải Châu, TP. Đà Nẵng"
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Danh hiệu thi đua
                    </label>
                    <select
                      value={BADGE_OPTIONS.includes(draft.badge) ? draft.badge : BADGE_OPTIONS[0]}
                      onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      {BADGE_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/50 space-y-2.5">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3">
                        <label className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block mb-1">
                          Tài khoản HS (SĐT) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={draft.accountPhone}
                          onChange={(e) => setDraft({ ...draft, accountPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block mb-1">
                          Mã HS
                        </label>
                        <input
                          type="text"
                          value={draft.accountCode}
                          onChange={(e) => setDraft({ ...draft, accountCode: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block mb-1">
                        Mật khẩu Học sinh *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={draft.accountPassword}
                          onChange={(e) => setDraft({ ...draft, accountPassword: e.target.value })}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setDraft({ ...draft, accountPassword: generateRandomPassword(8) });
                          }}
                          className="px-2.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                          <span>Random</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: PARENT INFO & ACCOUNT + NOTES */}
                <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50 space-y-3 flex flex-col">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4" />
                    <span>2. Thông Tin & Tài Khoản Phụ Huynh</span>
                  </h5>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Họ và tên Phụ huynh *
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.parentName}
                      onChange={(e) => setDraft({ ...draft, parentName: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Quan hệ với Học sinh
                    </label>
                    <select
                      value={
                        RELATION_OPTIONS.includes(draft.parentRelation)
                          ? draft.parentRelation
                          : 'Bố'
                      }
                      onChange={(e) => setDraft({ ...draft, parentRelation: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      {RELATION_OPTIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                      Tài khoản Phụ huynh (SĐT) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={draft.parentPhone}
                      onChange={(e) => setDraft({ ...draft, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                      Mật khẩu Phụ huynh *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={draft.parentPassword}
                        onChange={(e) => setDraft({ ...draft, parentPassword: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setDraft({ ...draft, parentPassword: generateRandomPassword(8) });
                        }}
                        className="px-2.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Random</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                      Phụ huynh đăng nhập trực tiếp tại tab <b>Phụ huynh</b> bằng SĐT & mật khẩu này để xem đúng hồ sơ con em mình.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/50 flex-1 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Ghi chú của Giáo viên (Cô Diễm Quỳnh)
                    </label>
                    <textarea
                      rows={4}
                      value={draft.teacherNotes}
                      onChange={(e) => setDraft({ ...draft, teacherNotes: e.target.value })}
                      placeholder="Nhập nhận xét chuyên môn, tình hình rèn luyện, trao đổi với phụ huynh..."
                      className="w-full flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudentOrig(null);
                    setDraft(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Lưu Đầy Đủ Thông Tin HS – PH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
