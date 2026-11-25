import React, { useState, useEffect } from 'react';
import { Classroom, Student, HomeworkSubmission } from '../../types/math';
import { Language } from '../../i18n/translations';
import { getStudentCredentials } from '../../utils/auth';
import { soundManager } from '../../utils/sound';
import { ComprehensiveClassReportModal } from '../reports/ComprehensiveClassReportModal';
import { WeeklyParticipationReport } from '../analytics/WeeklyParticipationReport';
import {
  Users, UserPlus, GraduationCap, CheckCircle, Clock, XCircle, Award,
  Trash2, FileText, Search, Phone, MessageSquare, Send, Copy, Check,
  FileSpreadsheet, Edit3, Sparkles, ExternalLink, X, AlertCircle, Printer, RefreshCw,
  Settings, Calendar, BarChart3, ShieldCheck, CheckCircle2, Upload, Download
} from 'lucide-react';

interface ClassroomManagerProps {
  classrooms: Classroom[];
  students: Student[];
  submissions?: HomeworkSubmission[];
  parentPin?: string;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForReport: (student: Student) => void;
  onUpdateClassroom?: (updatedClassroom: Classroom) => void;
  language?: Language;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({
  classrooms,
  students,
  submissions = [],
  parentPin = 'PH20112002',
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForReport,
  onUpdateClassroom,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [classroomTab, setClassroomTab] = useState<'roster' | 'weekly_report'>('roster');

  // Real-time 5s auto-update ticker
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(5);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString('vi-VN'));
  const [pulseActive, setPulseActive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshSec(prev => {
        if (prev <= 1) {
          setLastRefreshedAt(new Date().toLocaleTimeString('vi-VN'));
          setPulseActive(true);
          setTimeout(() => setPulseActive(false), 800);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [showPdfReportModal, setShowPdfReportModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [smsStudent, setSmsStudent] = useState<Student | null>(null);

  // Classroom & Duties Quick-Edit State (Chỉnh sửa trực tiếp nhiệm vụ & GV)
  const [showEditClassModal, setShowEditClassModal] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [editClassName, setEditClassName] = useState<string>('');
  const [editHomeroomTeacher, setEditHomeroomTeacher] = useState<string>('Cô Diễm Quỳnh (GV Chủ Nhiệm)');
  const [editSubjectTeacher, setEditSubjectTeacher] = useState<string>('Cô Diễm Quỳnh (GV Bộ Môn Toán)');
  const [editDuties, setEditDuties] = useState<string>('Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS');
  const [editRoomNumber, setEditRoomNumber] = useState<string>('Phòng 201');
  const [editSchoolYear, setEditSchoolYear] = useState<string>('2025 - 2026');

  // New student form state
  const [newName, setNewName] = useState<string>('');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newBadge, setNewBadge] = useState<string>('Chiến Binh Toán Học');
  const [newParentPhone, setNewParentPhone] = useState<string>('');
  const [newParentName, setNewParentName] = useState<string>('');
  const [newTeacherNotes, setNewTeacherNotes] = useState<string>('');

  // Batch import text state & Excel upload state
  const [batchText, setBatchText] = useState<string>('');
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchImportMode, setBatchImportMode] = useState<'upload' | 'paste'>('paste');
  const [batchTargetClassId, setBatchTargetClassId] = useState<string>(selectedClassId || classrooms[0]?.id || '');
  const [importedSuccessCount, setImportedSuccessCount] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  useEffect(() => {
    if (selectedClassId) setBatchTargetClassId(selectedClassId);
  }, [selectedClassId]);

  // SMS Modal State
  const [smsTemplate, setSmsTemplate] = useState<'report' | 'homework_reminder' | 'praise' | 'parent_pin' | 'custom'>('report');
  const [customSmsContent, setCustomSmsContent] = useState<string>('');
  const [copiedSms, setCopiedSms] = useState<boolean>(false);
  const [showPinInPreview, setShowPinInPreview] = useState<boolean>(false);

  const currentClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];
  const classStudents = students.filter(s => s.classId === currentClass?.id);

  const filteredStudents = classStudents
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.parentPhone && s.parentPhone.includes(searchTerm)) ||
      (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.overallScore - a.overallScore);

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    soundManager.playCorrect();
    const newStud: Student = {
      id: `s-${Date.now()}`,
      name: newName.trim(),
      classId: currentClass.id,
      gender: newGender,
      avatarSeed: newName.trim().slice(0, 4),
      overallScore: 8.5,
      gamesPlayed: 0,
      accuracyRate: 85,
      averageTimeSec: 10,
      badge: newBadge,
      topicsMastery: {
        arithmetic: 85,
        rational: 85,
        algebra: 85,
        equation: 85,
        geometry: 85,
        statistics: 85
      },
      recentHistory: [],
      attendance: 'present',
      parentPhone: newParentPhone.trim() || '0900000000',
      parentName: newParentName.trim() || `Phụ huynh em ${newName.trim()}`,
      teacherNotes: newTeacherNotes || 'Học sinh mới gia nhập lớp do Cô Diễm Quỳnh quản lý.'
    };

    onAddStudent(newStud);
    setNewName('');
    setNewParentPhone('');
    setNewParentName('');
    setNewTeacherNotes('');
    setShowAddModal(false);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim()) return;

    soundManager.playCorrect();
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  const handleToggleAttendance = (student: Student) => {
    soundManager.playClick();
    const cycle: Record<Student['attendance'], Student['attendance']> = {
      present: 'late',
      late: 'absent',
      absent: 'present'
    };
    onUpdateStudent({
      ...student,
      attendance: cycle[student.attendance]
    });
  };

  // Parse rows from text (CSV, TSV / Excel copy-paste)
  const parseBatchRows = (text: string) => {
    if (!text.trim()) return [];
    const lines = text.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed: { name: string; gender: 'male' | 'female'; phone: string; parent: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip header lines
      const lowerLine = line.toLowerCase();
      if (
        i === 0 &&
        (lowerLine.includes('họ và tên') || lowerLine.includes('ho va ten') || lowerLine.includes('họ tên') || lowerLine.includes('stt'))
      ) {
        continue;
      }

      // Split by tab, comma, semicolon, or pipe
      let parts = line.split(/[\t,;|]/).map(p => p.trim());
      if (parts.length === 0 || !parts[0]) continue;

      // If first part is just STT number (e.g. "1", "01"), shift it
      if (/^\d+$/.test(parts[0]) && parts.length > 1) {
        parts = parts.slice(1);
      }

      let rawName = parts[0] || '';
      // Strip leading numbering like "1. ", "01 - "
      rawName = rawName.replace(/^[\d\.\-\/\)\s]+/, '').trim();
      if (!rawName) continue;

      const genderRaw = (parts[1] || '').toLowerCase();
      const gender: 'male' | 'female' =
        genderRaw.includes('nữ') || genderRaw.includes('nu') || genderRaw.includes('g') || genderRaw.includes('female')
          ? 'female'
          : 'male';

      const phone = parts[2] || '0912345678';
      const parent = parts[3] || `Phụ huynh em ${rawName}`;

      parsed.push({
        name: rawName,
        gender,
        phone,
        parent
      });
    }
    return parsed;
  };

  const parsedBatchList = parseBatchRows(batchText);

  // File Upload handler (Excel/CSV/TSV/TXT)
  const handleFileUpload = (file: File) => {
    setBatchError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setBatchText(text);
        setBatchImportMode('paste');
      }
    };
    reader.onerror = () => {
      setBatchError('Không thể đọc file. Vui lòng kiểm tra lại định dạng file hoặc dán trực tiếp.');
    };
    reader.readAsText(file, 'utf-8');
  };

  // Download Sample Excel/CSV template
  const handleDownloadExcelSample = () => {
    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel Vietnamese support
      'STT,Họ và tên,Giới tính,Số điện thoại PH,Tên phụ huynh,Ghi chú\n' +
      '1,Lê Nhật Anh,Nam,0912111222,Bác Lê Văn Hưng (Bố),Học sinh chăm chỉ\n' +
      '2,Nguyễn Hoàng Lan,Nữ,0983333444,Cô Nguyễn Thu Trang (Mẹ),Tích cực làm bài tập\n' +
      '3,Trần Minh Trí,Nam,0978555666,Bác Trần Đình Trọng (Bố),Có năng khiếu Toán\n' +
      '4,Đặng Mỹ Tâm,Nữ,0903777888,Cô Đặng Phương Nga (Mẹ),Cẩn thận và tỉ mỉ\n' +
      '5,Vũ Quang Huy,Nam,0915999000,Bác Vũ Văn Hải (Bố),Nhiệt tình tham gia nhóm\n' +
      '6,Phạm Thanh Trúc,Nữ,0934555777,Cô Phạm Mỹ Linh (Mẹ),Hoàn thành đủ bài tập\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mau_Danh_Sach_Lop_Toan_Co_Diem_Quynh.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Batch import parser
  const handleBatchImport = () => {
    const items = parseBatchRows(batchText);
    if (items.length === 0) {
      setBatchError('Không tìm thấy dữ liệu hợp lệ. Vui lòng kiểm tra lại danh sách hoặc tải file mẫu.');
      return;
    }

    const targetClass = classrooms.find(c => c.id === batchTargetClassId) || currentClass;

    let count = 0;
    items.forEach((item, idx) => {
      const newStud: Student = {
        id: `s-batch-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        name: item.name,
        classId: targetClass.id,
        gender: item.gender,
        avatarSeed: item.name.slice(0, 4),
        overallScore: 8.5,
        gamesPlayed: 0,
        accuracyRate: 85,
        averageTimeSec: 10,
        badge: 'Chiến Binh Mới',
        topicsMastery: {
          arithmetic: 85,
          rational: 85,
          algebra: 85,
          equation: 85,
          geometry: 85,
          statistics: 85
        },
        recentHistory: [],
        attendance: 'present',
        parentPhone: item.phone,
        parentName: item.parent,
        teacherNotes: `Được nhập vào ${targetClass.name} - Quản lý bởi Cô Diễm Quỳnh.`
      };
      onAddStudent(newStud);
      count++;
    });

    soundManager.playVictory();
    setImportedSuccessCount(count);
    setTimeout(() => {
      setShowBatchModal(false);
      setBatchText('');
      setBatchError(null);
      setImportedSuccessCount(null);
    }, 1400);
  };

  const handleFillSampleBatch = () => {
    const sample = `STT\tHọ và tên\tGiới tính\tSố điện thoại PH\tTên phụ huynh
1\tLê Nhật Anh\tNam\t0912111222\tBác Lê Văn Hưng (Bố)
2\tNguyễn Hoàng Lan\tNữ\t0983333444\tCô Nguyễn Thu Trang (Mẹ)
3\tTrần Minh Trí\tNam\t0978555666\tBác Trần Đình Trọng (Bố)
4\tĐặng Mỹ Tâm\tNữ\t0903777888\tCô Đặng Phương Nga (Mẹ)
5\tVũ Quang Huy\tNam\t0915999000\tBác Vũ Văn Hải (Bố)
6\tPhạm Thanh Trúc\tNữ\t0934555777\tCô Phạm Mỹ Linh (Mẹ)`;
    setBatchText(sample);
    setBatchImportMode('paste');
    setBatchError(null);
  };

  // Compose SMS text for parent (keeps parentPin private unless teacher explicitly uses the 'parent_pin' template)
  const generateSmsMessage = (student: Student, maskPin: boolean = false) => {
    const parentUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?portal=parent`
      : '';
    if (smsTemplate === 'parent_pin') {
      const displayPin = maskPin ? '••••••••' : parentPin;
      return `[GỬI RIÊNG TỪ CÔ DIỄM QUỲNH - GV TOÁN THCS]\nKính gửi ${student.parentName || 'Quý Phụ huynh'} em ${student.name} (${currentClass.name}),\nCô Diễm Quỳnh xin gửi riêng thông tin đăng nhập Góc Phụ Huynh để Quý Phụ huynh theo dõi kết quả học tập, bài tập về nhà và nhận xét của con:\n🔗 Đường dẫn: ${parentUrl}\n🔑 Mật mã riêng Góc Phụ Huynh: ${displayPin}\n(Lưu ý: Mật mã này được bảo mật và chỉ gửi riêng cho Quý Phụ huynh, không hiển thị công khai trên hệ thống). Trân trọng cảm ơn!`;
    }
    if (smsTemplate === 'homework_reminder') {
      return `[THÔNG BÁO TỪ CÔ DIỄM QUỲNH - GV TOÁN THCS]\nKính gửi ${student.parentName || 'Phụ huynh'} em ${student.name},\nCô Diễm Quỳnh nhắc em hoàn thành bài tập về nhà trực tuyến hôm nay qua cổng học tập môn Toán.\nQuý Phụ huynh có thể vào "Góc Phụ Huynh" bằng mật mã riêng Cô đã gửi để theo dõi trực tiếp. Kính mong Quý phụ huynh đôn đốc em tham gia!`;
    }
    if (smsTemplate === 'praise') {
      return `[KHEN THƯỞNG MÔN TOÁN - CÔ DIỄM QUỲNH]\nKính gửi ${student.parentName || 'Phụ huynh'} em ${student.name},\nCô Diễm Quỳnh rất vui mừng thông báo: Em ${student.name} có thành tích học tập xuất sắc (Điểm TB: ${student.overallScore}/10, Tỷ lệ đúng: ${student.accuracyRate}%), đạt danh hiệu "${student.badge}".\nQuý Phụ huynh có thể vào "Góc Phụ Huynh" bằng mật mã riêng Cô đã gửi để xem bảng vinh danh của con!`;
    }
    if (smsTemplate === 'custom') {
      return customSmsContent || `Kính gửi ${student.parentName || 'Phụ huynh'} em ${student.name}, Cô Diễm Quỳnh (GV Toán THCS) xin gửi thông tin trao đổi...`;
    }
    // Default report template
    return `[KẾT QUẢ ĐÁNH GIÁ MÔN TOÁN - CÔ DIỄM QUỲNH]\nKính gửi ${student.parentName || 'Phụ huynh'} em ${student.name} (${currentClass.name}):\n- Điểm đánh giá: ${student.overallScore.toFixed(1)}/10\n- Tỷ lệ làm đúng: ${student.accuracyRate}%\n- Tốc độ trung bình: ${student.averageTimeSec}s/câu\n- Điểm danh: ${student.attendance === 'present' ? 'Có mặt' : student.attendance === 'late' ? 'Đi muộn' : 'Vắng mặt'}\n- Nhận xét của Cô Diễm Quỳnh: ${student.teacherNotes || 'Chăm ngoan, tích cực tham gia các bài tập ôn luyện.'}\n👉 Quý Phụ huynh có thể tra cứu chi tiết tại "Góc Phụ Huynh" bằng mật mã riêng Cô đã gửi. Trân trọng!`;
  };

  const handleCopySms = (msg: string) => {
    soundManager.playCorrect();
    navigator.clipboard.writeText(msg);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 3000);
  };

  // Direct Class & Duties Editing Handlers
  const handleOpenEditClassModal = (cls: Classroom) => {
    soundManager.playClick();
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditHomeroomTeacher(cls.homeroomTeacher || 'Cô Diễm Quỳnh (GV Chủ Nhiệm)');
    setEditSubjectTeacher(cls.subjectTeacher || 'Cô Diễm Quỳnh (GV Bộ Môn Toán)');
    setEditDuties(cls.duties || 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS');
    setEditRoomNumber(cls.roomNumber || 'Phòng 201');
    setEditSchoolYear(cls.schoolYear || '2025 - 2026');
    setShowEditClassModal(true);
  };

  const handleSaveClassEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !onUpdateClassroom) return;
    soundManager.playCorrect();
    const updated: Classroom = {
      ...editingClass,
      name: editClassName.trim() || editingClass.name,
      homeroomTeacher: editHomeroomTeacher.trim() || 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
      subjectTeacher: editSubjectTeacher.trim() || 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
      duties: editDuties.trim() || 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS',
      roomNumber: editRoomNumber.trim() || editingClass.roomNumber,
      schoolYear: editSchoolYear.trim() || editingClass.schoolYear
    };
    onUpdateClassroom(updated);
    setShowEditClassModal(false);
  };

  const handleResetToDiemQuynh = () => {
    soundManager.playClick();
    setEditHomeroomTeacher('Cô Diễm Quỳnh (GV Chủ Nhiệm)');
    setEditSubjectTeacher('Cô Diễm Quỳnh (GV Bộ Môn Toán)');
    setEditDuties('Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Class Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                {isEn ? 'Classroom Roster & Ranking' : 'Sổ Quản Lý & Xếp Hạng Học Sinh'}
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-md text-xs font-bold text-indigo-700">
                {isEn ? '🔐 Teacher & Parent PIN: Protected' : '🔐 Mật mã GV & PH: Đã Ẩn Bảo Mật'}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-slate-700">
                {isEn ? 'Teacher: Ms. Diem Quynh' : 'GV: Cô Diễm Quỳnh'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {isEn ? 'Student Ranking & Parent Communication' : 'Xếp Thứ Hạng & Quản Lý Liên Lạc Phụ Huynh THCS'}
            </h3>
            <p className="text-sm text-slate-600">
              {isEn
                ? 'Manage class roster with parent phone numbers, send SMS/Zalo updates, and track class rankings.'
                : 'Quản lý danh sách học sinh kèm SĐT phụ huynh, gửi tin nhắn SMS/Zalo đánh giá kết quả và xếp thứ hạng thi đua.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Live 5-Second Real-Time Update Indicator */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${pulseActive ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isEn ? 'Sync in:' : 'Cập nhật sau:'} <b className="text-emerald-600">{autoRefreshSec}s</b></span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowPdfReportModal(true);
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-indigo-200 shadow-2xs"
              title={isEn ? 'Export PDF summary report' : 'Xuất bảng báo cáo tổng hợp danh sách điểm và xếp hạng in PDF'}
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>{isEn ? 'Export PDF Report' : 'Xuất Báo Cáo PDF'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowBatchModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200 shadow-2xs"
              title={isEn ? 'Import student list from Excel/CSV' : 'Chèn danh sách học sinh từ file hoặc danh sách văn bản'}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Import (Excel)' : 'Chèn DS (Excel)'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" /> {isEn ? 'Add Student' : 'Thêm HS Mới'}
            </button>
          </div>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {classrooms.map((c) => {
            const count = students.filter(s => s.classId === c.id).length;
            const isSelected = selectedClassId === c.id;
            const homeroomDisplay = c.homeroomTeacher || 'Cô Diễm Quỳnh (GV Chủ Nhiệm)';
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedClassId(c.id);
                }}
                className={`px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer relative group ${isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{c.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {count} học sinh
                  </span>
                </div>
                <div className={`text-[11px] mt-0.5 truncate max-w-[200px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {homeroomDisplay} · {c.roomNumber}
                </div>
              </button>
            );
          })}
        </div>

        {/* Class Metrics Quick Strip - Match Image 1 & Allow Direct Editing */}
        {currentClass && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Khối & Niên khóa</span>
                <span className="font-bold text-slate-900 text-sm">Khối {currentClass.grade} · {currentClass.schoolYear}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Sĩ số lớp</span>
                <span className="font-bold text-indigo-600 text-sm font-mono">{classStudents.length} Học sinh</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Điểm trung bình môn</span>
                <span className="font-bold text-emerald-600 text-sm font-mono">
                  {classStudents.length > 0
                    ? (classStudents.reduce((acc, s) => acc + s.overallScore, 0) / classStudents.length).toFixed(1)
                    : '0.0'}/10
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Phụ trách bộ môn</span>
                <span className="font-bold text-indigo-700 text-sm">
                  {currentClass.subjectTeacher || 'Cô Diễm Quỳnh'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Giáo viên chủ nhiệm</span>
                <span className="font-bold text-indigo-900 text-sm">
                  {currentClass.homeroomTeacher || 'Cô Diễm Quỳnh'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Phòng học</span>
                <span className="font-bold text-slate-700 text-sm font-mono">
                  {currentClass.roomNumber}
                </span>
              </div>
            </div>

            {/* Duties and Direct Edit Button */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase">
                  Nhiệm vụ phân công:
                </span>
                <span className="font-semibold text-slate-800 text-xs">
                  {currentClass.duties || 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS (Khối 6-9)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEditClassModal(currentClass)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                title="Bấm để chỉnh sửa trực tiếp GV chủ nhiệm, GV bộ môn, nhiệm vụ phân công, phòng học"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa Trực Tiếp Nhiệm Vụ & Lớp</span>
              </button>
            </div>
          </div>
        )}

        {/* View Switcher: Sổ Điểm Thứ Hạng vs Thống Kê Tham Gia Tuần & Giờ Vào/Ra */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setClassroomTab('roster');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${classroomTab === 'roster'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Sổ Quản Lý & Thứ Hạng Lớp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setClassroomTab('weekly_report');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${classroomTab === 'weekly_report'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống Kê Tham Gia Theo Tuần & Rà Soát Giờ Vào - Ra</span>
            <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] font-black rounded-full">
              Mới 📊
            </span>
          </button>
        </div>

        {/* Tab 2: Weekly Participation Report */}
        {classroomTab === 'weekly_report' && (
          <WeeklyParticipationReport
            students={classStudents}
            classrooms={classrooms}
            submissions={submissions}
          />
        )}

        {/* Tab 1: Student Roster & Rankings */}
        {classroomTab === 'roster' && (
          <div>
            {/* Student Table Search & Tools */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên học sinh, SĐT hoặc tên phụ huynh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-80 text-slate-800"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Bấm nút <span className="text-indigo-600 font-bold">📱 Nhắn Tin</span> để gửi SMS/Zalo thông báo kết quả cho phụ huynh từng em.
              </span>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-3 px-3 text-center w-16">Thứ Hạng</th>
                    <th className="py-3 px-4">Họ và Tên</th>
                    <th className="py-3 px-3 text-center bg-emerald-50/60 text-emerald-900 border-x border-emerald-100 min-w-[130px]">
                      🕒 Giờ Vào - Ra
                    </th>
                    <th className="py-3 px-3 text-center">Giới Tính</th>
                    <th className="py-3 px-3 text-center">Điểm Danh</th>
                    <th className="py-3 px-3 text-right">Điểm TB</th>
                    <th className="py-3 px-3 text-right">Tỷ Lệ Đúng</th>
                    <th className="py-3 px-4">Phụ Huynh & SĐT</th>
                    <th className="py-3 px-4">Danh Hiệu</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStudents.map((s, index) => {
                    const rank = index + 1;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Rank column */}
                        <td className="py-3 px-3 text-center font-mono">
                          {rank === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-black text-xs shadow-2xs">
                              #1 👑
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 text-slate-800 border border-slate-300 rounded-md font-bold text-xs">
                              #2 🥈
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-bold text-xs">
                              #3 🥉
                            </span>
                          ) : (
                            <span className="text-slate-500 font-semibold text-xs">
                              #{rank}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                              {s.name.slice(0, 1)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{s.name}</span>
                              {(() => {
                                const creds = getStudentCredentials(s, index);
                                return (
                                  <span className="text-[11px] text-slate-400 font-mono block">
                                    TK: {creds.phone} · {creds.code} · MK: {creds.password}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </td>

                        {/* Entry & Exit Times Column */}
                        <td className="py-3 px-3 text-center font-mono bg-emerald-50/20 border-x border-emerald-100">
                          {(() => {
                            const sub = submissions.find(item => item.studentName === s.name || item.studentId === s.id);
                            const defaultEntries = ['19:42:15', '20:07:40', '20:26:40', '21:01:23', '19:12:00', '19:31:50'];
                            const defaultExits = ['19:45:19', '20:10:32', '20:30:10', '21:05:45', '19:15:30', '19:35:10'];
                            const entryTime = sub?.entryTime || defaultEntries[index % defaultEntries.length];
                            const exitTime = sub?.exitTime || defaultExits[index % defaultExits.length];
                            return (
                              <div className="inline-flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                                  🟢 Vào: {entryTime}
                                </span>
                                <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                                  🏁 Ra: {exitTime}
                                </span>
                              </div>
                            );
                          })()}
                        </td>

                        <td className="py-3 px-3 text-center text-slate-600">
                          {s.gender === 'male' ? 'Nam' : 'Nữ'}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleAttendance(s)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer ${s.attendance === 'present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.attendance === 'late'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            title="Click để đổi điểm danh"
                          >
                            {s.attendance === 'present' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {s.attendance === 'late' && <Clock className="w-3 h-3 text-amber-600" />}
                            {s.attendance === 'absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                            <span>
                              {s.attendance === 'present' ? 'Có mặt' : s.attendance === 'late' ? 'Đi muộn' : 'Vắng'}
                            </span>
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 text-sm">
                          {s.overallScore.toFixed(1)}
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                          {s.accuracyRate}%
                        </td>

                        {/* Parent Phone & Name Column */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">
                              {s.parentName || 'Phụ huynh'}
                            </span>
                            <a
                              href={`tel:${s.parentPhone}`}
                              className="text-indigo-600 hover:text-indigo-800 font-mono text-[11px] font-bold flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3 text-indigo-500" />
                              <span>{s.parentPhone || 'Chưa có SĐT'}</span>
                            </a>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold">
                            <Award className="w-3 h-3 text-amber-600" />
                            {s.badge}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Send SMS Button */}
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setSmsStudent(s);
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                              title="Nhắn tin thông báo kết quả cho phụ huynh"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Nhắn Tin</span>
                            </button>

                            {/* Edit Student Button */}
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setEditingStudent(s);
                              }}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Chỉnh sửa thông tin học sinh và phụ huynh"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Report Card Button */}
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                onSelectStudentForReport(s);
                              }}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Xuất phiếu báo cáo phụ huynh"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Student Button */}
                            <button
                              onClick={() => {
                                soundManager.playWrong();
                                onDeleteStudent(s.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                        Chưa có học sinh nào trong danh sách lớp này. Hãy bấm "Chèn DS Học Sinh" hoặc "Thêm Học Sinh Mới".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD SINGLE STUDENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 my-8">
            <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" /> Thêm Học Sinh Vào {currentClass.name}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Nhập thông tin học sinh và số điện thoại phụ huynh để liên lạc và thông báo kết quả.
            </p>

            <form onSubmit={handleSaveNewStudent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Họ và tên học sinh *:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Văn An"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Giới tính:</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Danh hiệu ban đầu:</label>
                  <select
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="Chiến Binh Toán Học">Chiến Binh Toán Học</option>
                    <option value="Ngôi Sao Tri Thức">Ngôi Sao Tri Thức</option>
                    <option value="Tay Đua Bền Bỉ">Tay Đua Bền Bỉ</option>
                    <option value="Thần Đồng Tính Nhẩm">Thần Đồng Tính Nhẩm</option>
                  </select>
                </div>
              </div>

              {/* Parent Phone & Name Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-indigo-700 block mb-1">
                    Số Điện Thoại Phụ Huynh *:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0912345678"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-300 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tên Phụ Huynh:
                  </label>
                  <input
                    type="text"
                    placeholder="Bác Đức / Mẹ Lan..."
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ghi chú của Cô Diễm Quỳnh:</label>
                <textarea
                  rows={2}
                  placeholder="Nhận xét sơ bộ về học sinh..."
                  value={newTeacherNotes}
                  onChange={(e) => setNewTeacherNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Lưu Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BATCH IMPORT STUDENTS FROM EXCEL / CSV */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Chèn Danh Sách Học Sinh Từ Excel / Bảng Tính
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý bởi <b>Cô Diễm Quỳnh</b> • Hỗ trợ tệp <code>.xlsx</code>, <code>.csv</code>, <code>.tsv</code> hoặc dán trực tiếp.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBatchModal(false);
                  setBatchError(null);
                  setImportedSuccessCount(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Target Class Selection & Template Download */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Lớp nhận:</span>
                  <select
                    value={batchTargetClassId}
                    onChange={(e) => setBatchTargetClassId(e.target.value)}
                    className="text-xs font-bold bg-white text-indigo-700 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  >
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.grade}) - {c.homeroomTeacher.replace(' (GV Chủ Nhiệm)', '')}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadExcelSample}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:border-emerald-400"
                  title="Tải tệp mẫu Excel có dấu Tiếng Việt chuẩn UTF-8"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" /> Tải File Mẫu Excel (.csv)
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBatchImportMode('upload')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${batchImportMode === 'upload'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Upload className="w-3.5 h-3.5" /> 📁 Tải Tệp Excel / CSV Lên
                </button>
                <button
                  type="button"
                  onClick={() => setBatchImportMode('paste')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${batchImportMode === 'paste'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> 📋 Dán Trực Tiếp (Copy/Paste)
                </button>
              </div>

              {/* Mode 1: File Upload Drag & Drop */}
              {batchImportMode === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${isDragOver
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  onClick={() => {
                    const input = document.getElementById('excel-file-input') as HTMLInputElement;
                    if (input) input.click();
                  }}
                >
                  <input
                    id="excel-file-input"
                    type="file"
                    accept=".csv, .tsv, .txt, .xlsx, .xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Kéo thả file danh sách Excel / CSV vào đây hoặc bấm để chọn tệp
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hỗ trợ file xuất từ Excel, Google Sheets, vnEdu hoặc SMAS (.csv, .tsv, .txt)
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    💡 Mẹo: Có thể xuất từ Excel với định dạng "CSV UTF-8" để giữ nguyên tiếng Việt có dấu.
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Paste Textarea */}
              {batchImportMode === 'paste' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Định dạng mỗi dòng: <code className="text-indigo-700 font-mono">Họ tên [Tab/Phẩy] Giới tính [Tab/Phẩy] SĐT PH [Tab/Phẩy] Tên PH</code>
                    </span>
                    <button
                      type="button"
                      onClick={handleFillSampleBatch}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-indigo-700 rounded text-[11px] font-bold transition-colors"
                    >
                      ✨ Dán Dữ Liệu Mẫu
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Dán (Ctrl + V) các cột được sao chép trực tiếp từ Excel hoặc Google Sheets..."
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed shadow-inner"
                  />
                </div>
              )}

              {/* Error Alert */}
              {batchError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{batchError}</span>
                </div>
              )}

              {/* Success Alert */}
              {importedSuccessCount !== null && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thành công! Đã chèn {importedSuccessCount} học sinh vào lớp. Đang cập nhật danh sách...</span>
                </div>
              )}

              {/* Live Preview Table */}
              {parsedBatchList.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle className="w-4 h-4" /> Đã nhận diện: {parsedBatchList.length} học sinh
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">Xem trước 5 dòng đầu</span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 text-[11px]">
                        <tr>
                          <th className="p-2 w-10">STT</th>
                          <th className="p-2">Họ và tên</th>
                          <th className="p-2 w-20">Giới tính</th>
                          <th className="p-2">SĐT Phụ Huynh</th>
                          <th className="p-2">Người đại diện PH</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {parsedBatchList.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-900">{row.name}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.gender === 'female' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                {row.gender === 'female' ? 'Nữ' : 'Nam'}
                              </span>
                            </td>
                            <td className="p-2 font-mono text-slate-600">{row.phone}</td>
                            <td className="p-2 text-slate-600">{row.parent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedBatchList.length > 5 && (
                      <div className="p-2 text-center text-[11px] text-slate-500 bg-slate-50 font-medium">
                        ... và còn {parsedBatchList.length - 5} học sinh khác nữa
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono">
                  Mã lớp học chung: <b className="text-indigo-600">20112002</b>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBatchModal(false);
                      setBatchError(null);
                      setImportedSuccessCount(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleBatchImport}
                    disabled={parsedBatchList.length === 0}
                    className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all ${parsedBatchList.length > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {parsedBatchList.length > 0
                      ? `Nhập ${parsedBatchList.length} Học Sinh Vào Lớp`
                      : 'Nhập Danh Sách Vào Lớp'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT STUDENT */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 my-8">
            <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" /> Chỉnh Sửa Học Sinh: {editingStudent.name}
            </h4>
            <p className="text-xs text-slate-500 mb-4">Cập nhật thông tin học tập và số điện thoại phụ huynh.</p>

            <form onSubmit={handleSaveEditStudent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Giới tính:</label>
                  <select
                    value={editingStudent.gender}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Danh hiệu:</label>
                  <select
                    value={editingStudent.badge}
                    onChange={(e) => setEditingStudent({ ...editingStudent, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="Vua Tốc Độ Số Học">Vua Tốc Độ Số Học</option>
                    <option value="Bậc Thầy Cẩn Thận">Bậc Thầy Cẩn Thận</option>
                    <option value="Ngôi Sao Tri Thức">Ngôi Sao Tri Thức</option>
                    <option value="Thần Đồng Số Hữu Tỉ">Thần Đồng Số Hữu Tỉ</option>
                    <option value="Phù Thủy Hình Học">Phù Thủy Hình Học</option>
                    <option value="Đại Sư Hằng Đẳng Thức">Đại Sư Hằng Đẳng Thức</option>
                    <option value="Huyền Thoại Toán 9">Huyền Thoại Toán 9</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-indigo-700 block mb-1">
                    SĐT Phụ Huynh:
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingStudent.parentPhone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tên Phụ Huynh:
                  </label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ghi chú của Cô Diễm Quỳnh:</label>
                <textarea
                  rows={2}
                  value={editingStudent.teacherNotes || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, teacherNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Cập Nhật Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SMS / ZALO NOTIFICATION DISPATCH */}
      {smsStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Nhắn Tin Cho Phụ Huynh Em {smsStudent.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Người nhận: <b>{smsStudent.parentName || 'Phụ huynh'}</b> · SĐT: <b className="font-mono text-indigo-700">{smsStudent.parentPhone}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSmsStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-3 mb-4">
              <label className="text-xs font-bold text-slate-700 block">Chọn mẫu tin nhắn:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'report', label: '📊 Báo Cáo Kết Quả' },
                  { id: 'homework_reminder', label: '⏰ Nhắc Bài Tập Về Nhà' },
                  { id: 'praise', label: '🌟 Khen Ngợi Điểm Cao' },
                  { id: 'parent_pin', label: '🔑 Gửi Riêng Mật Mã Góc PH' },
                  { id: 'custom', label: '✍️ Soạn Tin Tùy Ý' },
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSmsTemplate(tmpl.id as any);
                      setShowPinInPreview(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${smsTemplate === tmpl.id
                        ? tmpl.id === 'parent_pin'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : tmpl.id === 'parent_pin'
                          ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview / Editor */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 block">Nội dung tin nhắn gửi phụ huynh:</label>
                {smsTemplate === 'parent_pin' && (
                  <button
                    type="button"
                    onClick={() => setShowPinInPreview(prev => !prev)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  >
                    {showPinInPreview ? 'Ẩn mật mã trên màn hình' : 'Hiện mật mã để kiểm tra'}
                  </button>
                )}
              </div>
              {smsTemplate === 'custom' ? (
                <textarea
                  rows={6}
                  value={customSmsContent}
                  onChange={(e) => setCustomSmsContent(e.target.value)}
                  placeholder="Nhập nội dung nhắn tin gửi phụ huynh..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {generateSmsMessage(smsStudent, smsTemplate === 'parent_pin' && !showPinInPreview)}
                </div>
              )}
              {smsTemplate === 'parent_pin' && !showPinInPreview && (
                <p className="text-[11px] text-emerald-700">
                  🔒 Mật mã đang được che (••••••••) trên màn hình. Khi bấm <b>Sao Chép Tin Nhắn</b> hoặc <b>Gửi SMS Ngay</b>, mật mã thật sẽ được điền sẵn để gửi riêng cho phụ huynh.
                </p>
              )}
            </div>

            {/* Dispatch Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopySms(generateSmsMessage(smsStudent))}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedSms ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Đã Sao Chép!' : 'Sao Chép Tin Nhắn'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Zalo Link */}
                <a
                  href={`https://zalo.me/${smsStudent.parentPhone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Zalo</span>
                </a>

                {/* Direct SMS Link */}
                <a
                  href={`sms:${smsStudent.parentPhone.replace(/\s+/g, '')}?body=${encodeURIComponent(generateSmsMessage(smsStudent))}`}
                  onClick={() => soundManager.playCorrect()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi SMS Ngay</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive PDF Class Report Modal */}
      {showPdfReportModal && currentClass && (
        <ComprehensiveClassReportModal
          classroom={currentClass}
          students={filteredStudents}
          submissions={[]}
          onClose={() => setShowPdfReportModal(false)}
        />
      )}

      {/* MODAL 5: EDIT CLASSROOM & DUTIES DIRECTLY (Chỉnh sửa trực tiếp nhiệm vụ & GV) */}
      {showEditClassModal && editingClass && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 space-y-5 animate-scaleIn">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
                  Quản Trị Phân Công Chuyên Môn
                </span>
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <span>Chỉnh Sửa Thông Tin & Nhiệm Vụ: {editingClass.name}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chỉnh sửa trực tiếp Giáo viên chủ nhiệm, Giáo viên bộ môn Toán và phân công nhiệm vụ.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditClassModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClassEdit} className="space-y-4">
              {/* Reset to Cô Diễm Quỳnh Shortcut Strip */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Đặt Giáo viên bộ môn & Chủ nhiệm là Cô Diễm Quỳnh</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetToDiemQuynh}
                  className="px-2.5 py-1 bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-300 rounded-lg font-bold text-[11px] shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  ⚡ Đặt Mặc Định
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tên Lớp Học:
                  </label>
                  <input
                    type="text"
                    required
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Lớp 6A1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phòng Học:
                  </label>
                  <input
                    type="text"
                    required
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Phòng 201"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Giáo Viên Chủ Nhiệm:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editHomeroomTeacher}
                    onChange={(e) => setEditHomeroomTeacher(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Cô Diễm Quỳnh (GV Chủ Nhiệm)"
                  />
                  <button
                    type="button"
                    onClick={() => setEditHomeroomTeacher('Cô Diễm Quỳnh (GV Chủ Nhiệm)')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold shrink-0 transition-colors"
                  >
                    Cô Quỳnh
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phụ Trách Bộ Môn Toán:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editSubjectTeacher}
                    onChange={(e) => setEditSubjectTeacher(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Cô Diễm Quỳnh (GV Bộ Môn Toán)"
                  />
                  <button
                    type="button"
                    onClick={() => setEditSubjectTeacher('Cô Diễm Quỳnh (GV Bộ Môn Toán)')}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold shrink-0 transition-colors"
                  >
                    Cô Quỳnh
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phân Công Nhiệm Vụ Chuyên Môn:
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDuties}
                  onChange={(e) => setEditDuties(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  placeholder="Nhập nhiệm vụ phân công chi tiết..."
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setEditDuties('Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-700 transition-colors"
                  >
                    + Chủ nhiệm & Giảng dạy Toán
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDuties('Quản lý nề nếp, sổ điểm điện tử VnEdu & liên lạc phụ huynh')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-700 transition-colors"
                  >
                    + Sổ điểm VnEdu & Liên lạc PH
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Khối & Niên Khóa:
                </label>
                <input
                  type="text"
                  value={editSchoolYear}
                  onChange={(e) => setEditSchoolYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="2025 - 2026"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditClassModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Thay Đổi (Cập Nhật Ngay)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

