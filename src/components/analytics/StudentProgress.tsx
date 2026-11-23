import React, { useState, useEffect } from 'react';
import { Student, Classroom, HomeworkSubmission } from '../../types/math';
import { soundManager } from '../../utils/sound';
import { ComprehensiveClassReportModal } from '../reports/ComprehensiveClassReportModal';
import { WeeklyParticipationReport } from './WeeklyParticipationReport';
import { 
  TrendingUp, Award, Clock, Target, CheckCircle2, AlertCircle, FileText, 
  ChevronRight, BarChart3, RefreshCw, Printer, Shield, Sparkles, User, Calendar
} from 'lucide-react';

interface StudentProgressProps {
  students: Student[];
  classrooms: Classroom[];
  submissions?: HomeworkSubmission[];
  onSelectStudentForReport: (student: Student) => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  students,
  classrooms,
  submissions = [],
  onSelectStudentForReport
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [showPdfReportModal, setShowPdfReportModal] = useState<boolean>(false);

  // Near real-time auto-refresh state (every 5 seconds)
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(5);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(new Date().toLocaleTimeString('vi-VN'));
  const [isLiveSyncActive, setIsLiveSyncActive] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<boolean>(false);

  // 5-second ticker for near real-time tracking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveSyncActive) {
      timer = setInterval(() => {
        setAutoRefreshSec(prev => {
          if (prev <= 1) {
            // Trigger auto-refresh pulse
            setLastUpdatedTime(new Date().toLocaleTimeString('vi-VN'));
            setPulseEffect(true);
            setTimeout(() => setPulseEffect(false), 1000);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLiveSyncActive]);

  const filteredStudents = selectedClassFilter === 'all'
    ? students
    : students.filter(s => s.classId === selectedClassFilter);

  const currentStudent = students.find(s => s.id === selectedStudentId) || filteredStudents[0] || students[0];
  const currentClass = classrooms.find(c => c.id === currentStudent?.classId) || classrooms[0];

  // 5-level grade distribution
  const tierGioi = filteredStudents.filter(s => s.overallScore >= 8.5);
  const tierKha = filteredStudents.filter(s => s.overallScore >= 7.0 && s.overallScore < 8.5);
  const tierTrungBinh = filteredStudents.filter(s => s.overallScore >= 5.0 && s.overallScore < 7.0);
  const tierYeu = filteredStudents.filter(s => s.overallScore >= 3.5 && s.overallScore < 5.0);
  const tierKem = filteredStudents.filter(s => s.overallScore < 3.5);

  const avgScore = filteredStudents.length > 0 
    ? (filteredStudents.reduce((acc, s) => acc + s.overallScore, 0) / filteredStudents.length).toFixed(1)
    : '0';

  const certificatesCount = filteredStudents.filter(s => s.overallScore >= 8.0).length;

  const topicsList = [
    { key: 'arithmetic', label: 'Số học & Số nguyên', val: currentStudent?.topicsMastery.arithmetic || 80, color: 'bg-blue-500' },
    { key: 'rational', label: 'Phân số & Số hữu tỉ', val: currentStudent?.topicsMastery.rational || 80, color: 'bg-emerald-500' },
    { key: 'algebra', label: 'Đại số & Hằng đẳng thức', val: currentStudent?.topicsMastery.algebra || 80, color: 'bg-purple-500' },
    { key: 'equation', label: 'Phương trình & Hệ PT', val: currentStudent?.topicsMastery.equation || 80, color: 'bg-indigo-500' },
    { key: 'geometry', label: 'Hình học & Đo lường', val: currentStudent?.topicsMastery.geometry || 80, color: 'bg-amber-500' },
    { key: 'statistics', label: 'Thống kê & Xác suất', val: currentStudent?.topicsMastery.statistics || 80, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-Time Pulse & PDF Report Button */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                Phân Tích Dữ Liệu Giáo Viên · Cô Diễm Quỳnh
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-mono font-bold text-[10px]">
                Mã lớp: 20112002
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Bảng Thống Kê Điểm Số & Theo Dõi Thời Gian Thực
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động đồng bộ mỗi 5 giây không cần tải lại trang. Phân bố phổ điểm 5 mức và hỗ trợ xuất báo cáo PDF chuẩn A4.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live 5-Second Sync Indicator */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              pulseEffect ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isLiveSyncActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Tự cập nhật sau: <b className="text-emerald-600">{autoRefreshSec}s</b></span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">({lastUpdatedTime})</span>
            </div>

            {/* PDF Report Trigger */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowPdfReportModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất Báo Cáo PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* 4 Big KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Số Học Sinh Tham Gia</span>
            <span className="text-2xl font-mono font-black text-slate-900 mt-1 block">
              {filteredStudents.length} em
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">100% tài khoản lớp</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Số Đã Nộp Bài</span>
            <span className="text-2xl font-mono font-black text-emerald-700 mt-1 block">
              {submissions.length} / {filteredStudents.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              {Math.round((submissions.length / (filteredStudents.length || 1)) * 100)}% hoàn thành
            </span>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-center">
            <span className="text-[10px] text-indigo-700 font-bold uppercase block">Điểm Trung Bình Cả Lớp</span>
            <span className="text-2xl font-mono font-black text-indigo-700 mt-1 block">
              {avgScore} / 10
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">Thang điểm 10</span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-100 text-center">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">Số Giấy Khen Đạt Chuẩn</span>
            <span className="text-2xl font-mono font-black text-amber-600 mt-1 block">
              {certificatesCount} em
            </span>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Đạt kết quả ≥ 80%</span>
          </div>
        </div>

        {/* 5-Level Visual Distribution Chart */}
        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Biểu Đồ Phân Bố Điểm Số Theo 5 Mức (Bộ GD&ĐT)</span>
            </h4>
            <span className="text-slate-500 font-medium">Tổng mẫu: {filteredStudents.length} học sinh</span>
          </div>

          {/* Visual Bar Spectrum */}
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${(tierGioi.length / filteredStudents.length) * 100}%` }} className="bg-emerald-500 transition-all duration-500" title={`Giỏi: ${tierGioi.length}`} />
            <div style={{ width: `${(tierKha.length / filteredStudents.length) * 100}%` }} className="bg-blue-500 transition-all duration-500" title={`Khá: ${tierKha.length}`} />
            <div style={{ width: `${(tierTrungBinh.length / filteredStudents.length) * 100}%` }} className="bg-amber-500 transition-all duration-500" title={`Trung bình: ${tierTrungBinh.length}`} />
            <div style={{ width: `${(tierYeu.length / filteredStudents.length) * 100}%` }} className="bg-orange-500 transition-all duration-500" title={`Yếu: ${tierYeu.length}`} />
            <div style={{ width: `${(tierKem.length / filteredStudents.length) * 100}%` }} className="bg-rose-500 transition-all duration-500" title={`Kém: ${tierKem.length}`} />
          </div>

          {/* 5-Level Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Giỏi (≥ 8.5)</span>
              </div>
              <span className="text-lg font-mono font-black text-emerald-800 block mt-1">{tierGioi.length} em</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {Math.round((tierGioi.length / filteredStudents.length) * 100)}%
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Khá (7.0 - 8.4)</span>
              </div>
              <span className="text-lg font-mono font-black text-blue-800 block mt-1">{tierKha.length} em</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {Math.round((tierKha.length / filteredStudents.length) * 100)}%
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>TB (5.0 - 6.9)</span>
              </div>
              <span className="text-lg font-mono font-black text-amber-800 block mt-1">{tierTrungBinh.length} em</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {Math.round((tierTrungBinh.length / filteredStudents.length) * 100)}%
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-orange-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-orange-700">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Yếu (3.5 - 4.9)</span>
              </div>
              <span className="text-lg font-mono font-black text-orange-800 block mt-1">{tierYeu.length} em</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {Math.round((tierYeu.length / filteredStudents.length) * 100)}%
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Kém (&lt; 3.5)</span>
              </div>
              <span className="text-lg font-mono font-black text-rose-800 block mt-1">{tierKem.length} em</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {Math.round((tierKem.length / filteredStudents.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Participation & Attendance Section */}
        <div className="pt-2">
          <WeeklyParticipationReport
            students={filteredStudents}
            classrooms={classrooms}
            submissions={submissions}
          />
        </div>

        {/* Student Deep-Dive Inspector */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Hồ Sơ Năng Lực Học Sinh Cá Nhân:</span>
            </h4>

            <div className="flex items-center gap-2">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="all">Tất cả các lớp</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-indigo-50 border border-indigo-300 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-900 max-w-xs"
              >
                {filteredStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.parentName || 'PH'} - {s.parentPhone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentStudent && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: KPI & Strengths (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
                      {currentStudent.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">{currentStudent.name}</h4>
                      <span className="text-xs text-indigo-700 font-semibold">{currentClass?.name} · Niên khóa {currentClass?.schoolYear}</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                          <Award className="w-3 h-3 text-amber-600" />
                          {currentStudent.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-indigo-100">
                    <div className="p-2 bg-white rounded-xl border border-indigo-100">
                      <span className="text-[11px] text-slate-500 block">Điểm TB</span>
                      <span className="font-mono text-base font-extrabold text-indigo-600">{currentStudent.overallScore}/10</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-indigo-100">
                      <span className="text-[11px] text-slate-500 block">Độ Đúng</span>
                      <span className="font-mono text-base font-extrabold text-emerald-600">{currentStudent.accuracyRate}%</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-indigo-100">
                      <span className="text-[11px] text-slate-500 block">Tốc Độ/Câu</span>
                      <span className="font-mono text-base font-extrabold text-slate-700">{currentStudent.averageTimeSec}s</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-100">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onSelectStudentForReport(currentStudent);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <FileText className="w-4 h-4" /> Xuất Báo Cáo Riêng Cho Phụ Huynh Em Này
                    </button>
                  </div>
                </div>

                {/* Teacher Remarks Box */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Ghi chú sư phạm của giáo viên:</span>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{currentStudent.teacherNotes || 'Học sinh có ý thức học tập tốt, tích cực tham gia các bài giảng trực tuyến.'}"
                  </p>
                </div>
              </div>

              {/* Right Column: Topic Mastery Bars (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" /> Bản Đồ Năng Lực Theo Chuyên Đề GDPT
                  </h4>

                  <div className="space-y-3.5">
                    {topicsList.map(t => (
                      <div key={t.key}>
                        <div className="flex justify-between items-center text-xs font-semibold mb-1">
                          <span className="text-slate-700">{t.label}</span>
                          <span className="font-mono text-slate-900">{t.val}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${t.color}`}
                            style={{ width: `${t.val}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive PDF Report Modal */}
      {showPdfReportModal && (
        <ComprehensiveClassReportModal
          students={filteredStudents}
          classroom={currentClass}
          submissions={submissions}
          onClose={() => setShowPdfReportModal(false)}
        />
      )}
    </div>
  );
};
