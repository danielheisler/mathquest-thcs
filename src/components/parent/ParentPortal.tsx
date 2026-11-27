import React, { useState } from 'react';
import { Student, Classroom, HomeworkSubmission, PeriodicReport } from '../../types/math';
import { CertificateModal } from '../certificate/CertificateModal';
import { MathGradebookBoard } from '../common/MathGradebookBoard';
import { calculateStudentAverage, createEmptyScoreRecord, StudentScoreRecord } from '../../utils/gradebook';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import { ParentExtrasPanels, ParentExtraTab } from './ParentExtrasPanels';
import { 
  Search, Phone, MessageSquare, Award, AlertTriangle, CheckCircle2, Clock, 
  BookOpen, Star, Sparkles, User, Calendar, ExternalLink, Send, ShieldCheck, 
  HelpCircle, ChevronRight, Share2, Copy, Check, HeartHandshake, Lock, FileSpreadsheet, Heart
} from 'lucide-react';

interface ParentPortalProps {
  students: Student[];
  classrooms: Classroom[];
  submissions: HomeworkSubmission[];
  gradebook: Record<string, StudentScoreRecord>;
  initialPhone?: string;
  onLockPortal?: () => void;
  language?: Language;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  students,
  classrooms,
  submissions,
  gradebook,
  initialPhone,
  onLockPortal,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const TEACHER_NAME = 'Cô Diễm Quỳnh';
  const TEACHER_PHONE = '0911 200 202';
  const CLASS_CODE = '20112002';

  const [searchPhone, setSearchPhone] = useState<string>(() => {
    return initialPhone || students[0]?.parentPhone || '0907382642';
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (initialPhone) {
      const cleanInit = initialPhone.replace(/[\s\.\-]/g, '');
      const matched = students.find(s => s.parentPhone?.replace(/[\s\.\-]/g, '') === cleanInit);
      if (matched) return matched.id;
    }
    return students[0]?.id || 's1';
  });
  const [activeTab, setActiveTab] = useState<'gradebook' | 'homework' | 'exams' | 'certificates' | 'contact' | ParentExtraTab>('gradebook');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [parentNote, setParentNote] = useState<string>('');
  const [noteSent, setNoteSent] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Match student either by selected ID or by phone lookup
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const currentClass = classrooms.find(c => c.id === currentStudent?.classId) || classrooms[0];

  // Filter submissions for this specific student
  const studentSubmissions = submissions.filter(
    sub => sub.studentId === currentStudent?.id || sub.studentName === currentStudent?.name
  );

  // Compute pending vs completed homework
  const isHomeworkDone = studentSubmissions.length > 0;

  // Search by phone handler
  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const clean = searchPhone.trim().replace(/\s+/g, '');
    const found = students.find(s => s.parentPhone.replace(/\s+/g, '') === clean);
    if (found) {
      setSelectedStudentId(found.id);
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleCopyHomeworkLink = () => {
    soundManager.playClick();
    const url = `${window.location.origin}${window.location.pathname}?code=${CLASS_CODE}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleSendNoteToTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentNote.trim()) return;
    soundManager.playCorrect();
    setNoteSent(true);
    setTimeout(() => {
      setParentNote('');
      setNoteSent(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Warm Header For Parents */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-emerald-200" />
            <span>{isEn ? 'Dedicated Parent Portal' : 'Góc Dành Riêng Cho Phụ Huynh Học Sinh'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isEn ? 'Mathematics Learning & Gradebook Tracker' : 'Sổ Theo Dõi Tình Hình Học Tập Môn Toán'}
          </h2>
          <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
            {isEn
              ? `Welcome Parents! Track your child's homework progress, detailed gradebook (Regular, Midterm, Final), mock exam scores, and teacher feedback from ${TEACHER_NAME}.`
              : `Kính chào Quý Phụ huynh! Đây là cổng thông tin trực tuyến do ${TEACHER_NAME} thiết lập giúp Phụ huynh nắm bắt kịp thời tiến độ làm bài tập về nhà, bảng điểm, bài thi thử và nhận xét định kỳ của con em mình.`}
          </p>
        </div>

        {onLockPortal && (
          <div className="relative z-10 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                onLockPortal();
              }}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-98 backdrop-blur-md rounded-2xl text-xs font-bold flex items-center gap-2 transition-all text-white border border-white/20 shadow-sm cursor-pointer"
              title={isEn ? 'Sign out of Parent Portal' : 'Đăng xuất khỏi Góc Phụ Huynh'}
            >
              <Lock className="w-4 h-4 text-emerald-200" />
              <span>{isEn ? 'Log out' : 'Đăng xuất'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Student Lookup & Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Phone search */}
        <form onSubmit={handleSearchPhone} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Nhập SĐT Phụ huynh tra cứu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-xs"
          >
            Tra Cứu
          </button>
        </form>

        {/* Quick select child */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 shrink-0">Chọn con em:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              soundManager.playClick();
              setSelectedStudentId(e.target.value);
            }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[260px]"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.parentName || 'Phụ huynh'} - {s.parentPhone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Child Profile Card */}
      {currentStudent && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                {currentStudent.name.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{currentStudent.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {currentClass?.name || 'Lớp 6A1'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phụ huynh đại diện: <b>{currentStudent.parentName || 'Bố mẹ'}</b> · SĐT: <b className="font-mono text-emerald-700">{currentStudent.parentPhone}</b>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Giáo viên phụ trách:</span>
              <span className="font-bold text-indigo-700">{TEACHER_NAME}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Mã lớp BTVN:</span>
              <span className="font-mono font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {CLASS_CODE}
              </span>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Tổng Điểm Trung Bình</span>
              <span className="text-2xl font-mono font-black text-indigo-600 mt-1 block">
                {(() => {
                  const avg = calculateStudentAverage(
                    gradebook[currentStudent.id] || createEmptyScoreRecord(currentStudent.id)
                  ).average;
                  return avg !== null ? `${avg.toFixed(2)}/10` : `${currentStudent.overallScore.toFixed(1)}/10`;
                })()}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Thứ Hạng Trong Lớp</span>
              <span className="text-2xl font-mono font-black text-amber-500 mt-1 block">
                #1 / {students.length}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Độ Chính Xác</span>
              <span className="text-2xl font-mono font-black text-emerald-600 mt-1 block">
                {currentStudent.accuracyRate}%
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Giấy Khen Danh Dự</span>
              <span className="text-2xl font-mono font-black text-purple-600 mt-1 block">
                {studentSubmissions.filter(s => s.certificateAwarded).length + 1}
              </span>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('gradebook');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'gradebook'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isEn ? 'Gradebook (Reg, Mid, Final)' : 'Bảng Điểm (TX, GK, CK)'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('homework');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'homework'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEn ? 'Homework Progress' : 'Theo Dõi Bài Tập Về Nhà'}</span>
              {!isHomeworkDone && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('exams');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'exams'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Mock Exams & Evaluation' : 'Điểm Thi Thử & Đánh Giá'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('certificates');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'certificates'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isEn ? 'Honor Certificates' : 'Kho Giấy Khen Danh Dự'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('contact');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'contact'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{isEn ? 'Contact Ms. Diễm Quỳnh' : 'Liên Hệ Cô Diễm Quỳnh'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('schedule_feedback');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'schedule_feedback'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isEn ? 'Weekly Schedule & Feedback' : 'Lịch Trình Tuần & Góp Ý'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('family_fun');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'family_fun'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{isEn ? 'Parent & Teen Games' : 'Hiểu Con & Thử Thách Tuần'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('wellbeing_survey');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'wellbeing_survey'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isEn ? 'Wellbeing Survey' : 'Góc Thấu Hiểu Con Trẻ'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('parent_library');
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'parent_library'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEn ? 'Parenting & Career Library' : 'Cẩm Nang & Hướng Nghiệp'}</span>
            </button>
          </div>

          {/* TAB 0: GRADEBOOK (5 TX, 1 GK, 1 CK, AVERAGE) */}
          {activeTab === 'gradebook' && (
            <MathGradebookBoard
              mode="parent"
              students={students}
              classrooms={classrooms}
              gradebook={gradebook}
              focusStudentId={currentStudent.id}
              language={language}
            />
          )}

          {/* TAB 1: HOMEWORK SUBMISSIONS & MISSING HOMEWORK ALERT */}
          {activeTab === 'homework' && (
            <div className="space-y-6">
              {/* Alert if homework is missing / not submitted yet */}
              {!isHomeworkDone ? (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>CẢNH BÁO: EM {currentStudent.name.toUpperCase()} CHƯA HOÀN THÀNH BÀI TẬP VỀ NHÀ!</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Theo ghi nhận của <b>{TEACHER_NAME}</b>, em hiện chưa tham gia nộp bài tập về nhà định kỳ tuần này. Kính đề nghị Phụ huynh nhắc nhở con em truy cập làm bài để không bị trừ điểm chuyên cần.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span>Mã vào lớp làm bài của cô:</span>
                      <span className="font-mono font-black text-rose-600 text-sm bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                        {CLASS_CODE}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyHomeworkLink}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Đã Sao Chép Link' : 'Sao Chép Link Bài Tập Gửi Cho Con'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        Em {currentStudent.name} đã hoàn thành bài tập về nhà!
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Bài làm được giám sát qua camera trực tuyến và được {TEACHER_NAME} chấm điểm tự động.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-bold">
                    Đã Nộp Bài
                  </span>
                </div>
              )}

              {/* List of completed submissions */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Lịch Sử Các Lần Nộp Bài Tập Về Nhà Của Con
                </h4>

                {studentSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {studentSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              Bài Tập Phân Môn: {sub.branch === 'algebra' ? 'Số Học & Đại Số' : sub.branch === 'geometry' ? 'Hình Học' : 'Thống Kê'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">· {sub.submittedAt}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Thời gian hoàn thành: <b>{Math.floor(sub.timeSpentSec / 60)} phút {sub.timeSpentSec % 60} giây</b>. Mã bài nộp: <span className="font-mono">{sub.id}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Điểm Số</span>
                            <span className="text-xl font-mono font-black text-indigo-600">
                              {sub.score.toFixed(1)}/10
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Độ Đúng</span>
                            <span className="text-lg font-mono font-bold text-emerald-600">
                              {sub.accuracy}%
                            </span>
                          </div>

                          {sub.certificateAwarded && (
                            <button
                              onClick={() => setShowCertificate(true)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Xem Giấy Khen</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                    Chưa có lượt nộp bài nào được ghi nhận cho em trong hệ thống.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EXAMS & MASTERY */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              {/* Teacher Assessment */}
              <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span>Lời Nhận Xét & Đánh Giá Từ {TEACHER_NAME}</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  "{currentStudent.teacherNotes || `Em ${currentStudent.name} có tư duy toán học rất tốt, tiếp thu bài nhanh và luôn chủ động trong các giờ học. Em cần rèn luyện thêm kỹ năng trình bày các bài toán hình học và cẩn thận hơn ở các bước tính toán phân số để đạt điểm tối đa trong các kỳ thi sắp tới.`}"
                </p>
              </div>

              {/* Topic Mastery Bars */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">
                  Đánh Giá Năng Lực Theo Từng Phân Môn Toán THCS
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Số Học & Số Nguyên', val: currentStudent.topicsMastery.arithmetic },
                    { label: 'Phân Số & Số Hữu Tỉ', val: currentStudent.topicsMastery.rational },
                    { label: 'Đại Số & Đa Thức', val: currentStudent.topicsMastery.algebra },
                    { label: 'Phương Trình & Hệ Phương Trình', val: currentStudent.topicsMastery.equation },
                    { label: 'Hình Học & Đo Lường', val: currentStudent.topicsMastery.geometry },
                    { label: 'Thống Kê & Xác Suất', val: currentStudent.topicsMastery.statistics },
                  ].map(topic => (
                    <div key={topic.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{topic.label}</span>
                        <span className="font-mono font-bold text-indigo-600">{topic.val}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            topic.val >= 80 ? 'bg-emerald-500' : topic.val >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${topic.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES SHOWCASE */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Bảng Vàng Giấy Khen Danh Dự Của Con</h4>
                  <p className="text-xs text-slate-500">Được {TEACHER_NAME} trao tặng khi đạt kết quả bài kiểm tra và bài tập trên 80%.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] uppercase">
                      Học Kính - Toán THCS
                    </span>
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="text-base font-black text-amber-950">Giấy Khen Thành Tích Xuất Sắc</h5>
                    <p className="text-xs text-amber-800 mt-1">
                      Trao cho học sinh: <b>{currentStudent.name}</b>
                    </p>
                    <p className="text-[11px] text-amber-700">Đạt độ chính xác 100% trong bài kiểm tra BTVN.</p>
                  </div>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Xem & In Bản Đẹp (A4 / PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT CONTACT WITH TEACHER */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Contact Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                    Giáo Viên Bộ Môn Toán THCS
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-0.5">{TEACHER_NAME}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Trường THCS · Khối 6, 7, 8, 9 · Mã phòng thi: <b>{CLASS_CODE}</b>
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Số Điện Thoại Trực Tiếp:</span>
                    <span className="text-base font-mono font-black text-indigo-700">{TEACHER_PHONE}</span>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                    Đang Trực Tuyến
                  </span>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${TEACHER_PHONE.replace(/\s+/g, '')}`}
                    className="py-3 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors shadow-xs text-center"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Điện</span>
                  </a>
                  <a
                    href={`sms:${TEACHER_PHONE.replace(/\s+/g, '')}?body=Kính gửi ${TEACHER_NAME}, tôi là phụ huynh của em ${currentStudent.name} (${currentClass?.name}).`}
                    className="py-3 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors shadow-xs text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Nhắn SMS</span>
                  </a>
                  <a
                    href={`https://zalo.me/${TEACHER_PHONE.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors shadow-xs text-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Chat Zalo</span>
                  </a>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Gửi Tin Nhắn Nhanh Cho {TEACHER_NAME}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Phụ huynh có thể trao đổi về tình hình học tập hoặc nguyện vọng bồi dưỡng của con.
                  </p>
                </div>

                <form onSubmit={handleSendNoteToTeacher} className="space-y-3">
                  <textarea
                    rows={4}
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    placeholder={`Kính gửi ${TEACHER_NAME}, tôi là phụ huynh em ${currentStudent.name}...`}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  {noteSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tin nhắn đã được gửi thành công tới {TEACHER_NAME}!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi Tin Nhắn Cho Giáo Viên
                  </button>
                </form>
              </div>
            </div>
          )}

          {(activeTab === 'schedule_feedback' ||
            activeTab === 'family_fun' ||
            activeTab === 'wellbeing_survey' ||
            activeTab === 'parent_library') && (
            <ParentExtrasPanels
              activeTab={activeTab}
              studentName={currentStudent.name}
              className={currentClass?.name || 'Lớp 6A1'}
              language={language}
            />
          )}
        </div>
      )}

      {/* Honor Certificate Modal Viewer */}
      {showCertificate && currentStudent && (
        <CertificateModal
          studentName={currentStudent.name}
          className={currentClass?.name || 'Khối 6'}
          score={currentStudent.overallScore}
          totalQuestions={10}
          accuracy={currentStudent.accuracyRate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
