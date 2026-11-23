import React, { useState } from 'react';
import { VnEduStudentAcademicRecord, SubjectCode, Classroom } from '../../types/math';
import { initialVnEduRecords, vneduSubjectsMeta } from '../../data/vneduData';
import { soundManager } from '../../utils/sound';
import { 
  FileSpreadsheet, Search, Filter, Printer, Send, MessageSquare, 
  Check, Award, TrendingUp, AlertCircle, Phone, Download, BookOpen, 
  ExternalLink, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';

interface VnEduGradebookProps {
  classroom: Classroom;
}

export const VnEduGradebook: React.FC<VnEduGradebookProps> = ({ classroom }) => {
  const [records, setRecords] = useState<VnEduStudentAcademicRecord[]>(initialVnEduRecords);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCode | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [semester, setSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [selectedStudentRecord, setSelectedStudentRecord] = useState<VnEduStudentAcademicRecord | null>(null);

  // SMS Modal State
  const [smsModalStudent, setSmsModalStudent] = useState<VnEduStudentAcademicRecord | null>(null);
  const [smsSentSuccess, setSmsSentSuccess] = useState<boolean>(false);

  // Filter students
  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.parentPhone.includes(searchTerm)
  );

  // Summary KPI
  const avgClassScore = (records.reduce((acc, r) => acc + r.averageScore, 0) / (records.length || 1)).toFixed(1);
  const goodCount = records.filter(r => r.academicRanking === 'Tốt').length;
  const prettyCount = records.filter(r => r.academicRanking === 'Khá').length;
  const passCount = records.filter(r => r.academicRanking === 'Đạt').length;

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleSendVnEduSms = (student: VnEduStudentAcademicRecord) => {
    soundManager.playCorrect();
    setSmsSentSuccess(true);
    setTimeout(() => {
      setSmsSentSuccess(false);
      setSmsModalStudent(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* VnEdu Official Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hệ Thống Quản Lý Giáo Dục Điện Tử VnEdu · THCS Chuẩn Quốc Gia</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sổ Điểm Điện Tử & Theo Dõi Các Môn Học Lớp {classroom.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed">
              Theo dõi kết quả học tập 10 môn học, điểm thường xuyên (TX), điểm giữa kỳ (GK), cuối kỳ (CK), 
              điểm trung bình môn (TBM) và xếp loại rèn luyện theo Thông tư 22/2021/TT-BGDĐT.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 pt-1">
              <span>GVCN: <strong className="text-white">{classroom.homeroomTeacher}</strong></span>
              <span>·</span>
              <span>GV Bộ Môn Toán: <strong className="text-amber-300">Cô Diễm Quỳnh</strong></span>
              <span>·</span>
              <span>Năm học: <strong className="text-white">{classroom.schoolYear}</strong></span>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">ĐTB Chung Cả Lớp</span>
              <span className="text-2xl font-black text-amber-300 font-mono">{avgClassScore}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Học Lực Tốt (Giỏi)</span>
              <span className="text-2xl font-black text-emerald-300 font-mono">{goodCount} / {records.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Subject Filter & Semester Toggle */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh, SĐT phụ huynh..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject('all');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất Cả Các Môn
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject('math');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'math' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Môn Toán (Cô Diễm Quỳnh)
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject('literature');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'literature' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ngữ Văn
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject('english');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'english' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tiếng Anh
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject('science');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'science' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              KHTN
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>In Sổ Điểm VnEdu</span>
          </button>
        </div>
      </div>

      {/* VnEdu Grade Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {selectedSubject === 'all' ? (
            /* ========================================================
               1. BẢNG TỔNG HỢP TẤT CẢ CÁC MÔN CHUẨN VNEDU
               ======================================================== */
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-3 border-r border-blue-800 text-center w-12">STT</th>
                  <th className="p-3 border-r border-blue-800 min-w-[160px]">Họ Và Tên Học Sinh</th>
                  <th className="p-3 border-r border-blue-800 text-center">Toán</th>
                  <th className="p-3 border-r border-blue-800 text-center">Văn</th>
                  <th className="p-3 border-r border-blue-800 text-center">Anh</th>
                  <th className="p-3 border-r border-blue-800 text-center">KHTN</th>
                  <th className="p-3 border-r border-blue-800 text-center">Sử Địa</th>
                  <th className="p-3 border-r border-blue-800 text-center">Tin</th>
                  <th className="p-3 border-r border-blue-800 text-center">GDCD</th>
                  <th className="p-3 border-r border-blue-800 text-center">CN</th>
                  <th className="p-3 border-r border-blue-800 text-center bg-blue-950 font-black">ĐTB HK</th>
                  <th className="p-3 border-r border-blue-800 text-center">Học Lực</th>
                  <th className="p-3 border-r border-blue-800 text-center">Hạnh Kiểm</th>
                  <th className="p-3 text-center min-w-[120px]">VnEdu Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredRecords.map((r, idx) => (
                  <tr key={r.studentId} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <div className="font-extrabold text-slate-900">{r.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {r.gender === 'male' ? 'Nam' : 'Nữ'} · Tổ {r.groupNumber} {r.roleInClass && r.roleInClass !== 'Học sinh' ? `· ${r.roleInClass}` : ''}
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-blue-700 bg-blue-50/30 border-r border-slate-100">
                      {r.subjects.math.tbm}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800 border-r border-slate-100">
                      {r.subjects.literature.tbm}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800 border-r border-slate-100">
                      {r.subjects.english.tbm}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800 border-r border-slate-100">
                      {r.subjects.science.tbm}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                      {r.subjects.history_geo.tbm}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                      {r.subjects.informatics.tbm}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                      {r.subjects.civics.tbm}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                      {r.subjects.technology.tbm}
                    </td>
                    <td className="p-3 text-center font-mono font-black text-blue-900 bg-amber-50/60 text-sm border-r border-slate-100">
                      {r.averageScore}
                    </td>
                    <td className="p-3 text-center border-r border-slate-100">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        r.academicRanking === 'Tốt' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : r.academicRanking === 'Khá'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {r.academicRanking}
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-700 border-r border-slate-100">
                      {r.conductRanking}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setSmsModalStudent(r);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-colors border border-indigo-200"
                      >
                        <Send className="w-3 h-3" />
                        <span>Gửi PH</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* ========================================================
               2. BẢNG CHI TIẾT TỪNG MÔN HỌC (TX1, TX2, GK, CK, TBM)
               ======================================================== */
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-indigo-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-3 border-r border-indigo-800 text-center w-12">STT</th>
                  <th className="p-3 border-r border-indigo-800 min-w-[180px]">Họ Và Tên Học Sinh</th>
                  <th className="p-3 border-r border-indigo-800 text-center">ĐĐGtx 1 (Miệng)</th>
                  <th className="p-3 border-r border-indigo-800 text-center">ĐĐGtx 2 (15p)</th>
                  <th className="p-3 border-r border-indigo-800 text-center">ĐĐGtx 3</th>
                  <th className="p-3 border-r border-indigo-800 text-center bg-indigo-950">ĐĐGgk (Hệ số 2)</th>
                  <th className="p-3 border-r border-indigo-800 text-center bg-indigo-950">ĐĐGck (Hệ số 3)</th>
                  <th className="p-3 border-r border-indigo-800 text-center bg-amber-600 text-white font-black text-sm">
                    Điểm TBM
                  </th>
                  <th className="p-3 border-r border-indigo-800 text-center">Giáo Viên Phụ Trách</th>
                  <th className="p-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredRecords.map((r, idx) => {
                  const subjectGrade = r.subjects[selectedSubject];
                  return (
                    <tr key={r.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-mono font-bold text-slate-500 border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-extrabold text-slate-900">
                        {r.studentName}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                        {subjectGrade.tx1 ?? '-'}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                        {subjectGrade.tx2 ?? '-'}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-100">
                        {subjectGrade.tx3 ?? '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/50 border-r border-slate-100">
                        {subjectGrade.gk ?? '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/50 border-r border-slate-100">
                        {subjectGrade.ck ?? '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-amber-800 bg-amber-50 text-sm border-r border-slate-100">
                        {subjectGrade.tbm}
                      </td>
                      <td className="p-3 text-center font-medium text-slate-600 border-r border-slate-100">
                        {subjectGrade.teacherName}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            setSmsModalStudent(r);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[10px] inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Gửi PH</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* VnEdu Connect SMS Dispatch Modal */}
      {smsModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                  📱
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Sổ Liên Lạc Điện Tử VnEdu Connect
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gửi tin nhắn tổng hợp kết quả học tập cho phụ huynh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSmsModalStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Học sinh: {smsModalStudent.studentName}</span>
                  <span className="font-mono text-blue-700 font-bold">{smsModalStudent.parentPhone}</span>
                </div>
                <p className="text-slate-500 text-[11px]">Người nhận: {smsModalStudent.parentName}</p>
              </div>

              {/* Message Preview */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung tin nhắn VnEdu:</label>
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {`[VnEdu THCS] Thông báo kết quả học tập:\n`}
                  {`Học sinh: ${smsModalStudent.studentName} - Lớp ${classroom.name}\n`}
                  {`- Điểm Toán (Cô Diễm Quỳnh): ${smsModalStudent.subjects.math.tbm}\n`}
                  {`- Điểm Ngữ văn: ${smsModalStudent.subjects.literature.tbm}\n`}
                  {`- Điểm Tiếng Anh: ${smsModalStudent.subjects.english.tbm}\n`}
                  {`- Điểm TB Học kỳ: ${smsModalStudent.averageScore} (Học lực: ${smsModalStudent.academicRanking})\n`}
                  {`- Hạnh kiểm: ${smsModalStudent.conductRanking}\n`}
                  {`- Nhận xét GVCN: ${smsModalStudent.homeroomTeacherNotes}`}
                </div>
              </div>

              {smsSentSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Đã gửi tin nhắn thông báo VnEdu Connect thành công!</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <a
                  href={`sms:${smsModalStudent.parentPhone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                    `[VnEdu THCS] Thông báo kết quả học tập học sinh ${smsModalStudent.studentName} - Lớp ${classroom.name}: Điểm TB ${smsModalStudent.averageScore}, Học lực ${smsModalStudent.academicRanking}.`
                  )}`}
                  onClick={() => handleSendVnEduSms(smsModalStudent)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi SMS Trực Tiếp</span>
                </a>

                <button
                  onClick={() => setSmsModalStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
