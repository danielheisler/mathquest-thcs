import React, { useState } from 'react';
import { Student, Classroom, PeriodicReport } from '../../types/math';
import { initialReports } from '../../data/defaultData';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { Printer, Copy, Check, Award, Edit3, Sparkles, Send, GraduationCap } from 'lucide-react';

interface ReportCardGeneratorProps {
  students: Student[];
  classrooms: Classroom[];
  selectedStudent?: Student | null;
  language?: Language;
}

export const ReportCardGenerator: React.FC<ReportCardGeneratorProps> = ({
  students,
  classrooms,
  selectedStudent: externalSelected,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    externalSelected?.id || students[0]?.id || ''
  );
  const [periodType, setPeriodType] = useState<'week' | 'month' | 'midterm'>('month');
  const [copiedZalo, setCopiedZalo] = useState<boolean>(false);

  // Active student
  const student = students.find(s => s.id === selectedStudentId) || externalSelected || students[0];
  const classroom = classrooms.find(c => c.id === student?.classId) || classrooms[0];

  // Report details state for in-place editing
  const existingReport = student ? initialReports[student.id] : null;

  const [teacherComment, setTeacherComment] = useState<string>(
    existingReport?.teacherComment ||
    `Em ${student?.name || 'học sinh'} có thái độ học tập nghiêm túc, tích cực tham gia các hoạt động trò chơi ôn tập đầu giờ. Em nắm vững kiến thức trọng tâm và có tiến bộ vượt bậc.`
  );

  const [parentAdvice, setParentAdvice] = useState<string>(
    existingReport?.parentAdvice ||
    `Kính đề nghị phụ huynh tiếp tục khích lệ tinh thần tự giác của em, dành 20 phút mỗi tối để em luyện tập thêm các câu hỏi trong ngân hàng đề thi trực tuyến.`
  );

  const mathScore = student?.overallScore || 9.0;
  const rankCategory = mathScore >= 9.0 ? 'Xuất Sắc' : mathScore >= 8.0 ? 'Giỏi' : mathScore >= 6.5 ? 'Khá' : 'Đạt';

  const periodLabel = periodType === 'week' 
    ? 'Báo Cáo Tiến Độ Tuần 8' 
    : periodType === 'month' 
    ? 'Báo Cáo Định Kỳ Tháng 10/2026' 
    : 'Báo Cáo Giữa Học Kỳ I';

  const handleCopyZalo = () => {
    soundManager.playCorrect();
    const cleanPhone = student?.parentPhone?.replace(/\s+/g, '') || '';
    const message = `[THÔNG BÁO TÌNH HÌNH HỌC TẬP MÔN TOÁN - CÔ DIỄM QUỲNH]\nKính gửi ${student?.parentName || 'Quý Phụ huynh'} em ${student?.name} (${classroom?.name}):\n- Điểm đánh giá: ${mathScore}/10 (${rankCategory})\n- Độ chính xác khi làm bài: ${student?.accuracyRate}%\n- Tốc độ giải: ${student?.averageTimeSec}s/câu\n- Nhận xét của Cô Diễm Quỳnh: ${teacherComment}\n- Lời dặn dò gia đình: ${parentAdvice}\nCô Diễm Quỳnh (GV Toán THCS) trân trọng cảm ơn gia đình!`;
    navigator.clipboard.writeText(message);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 3000);
  };

  const parentSmsMessage = `[BÁO CÁO HỌC TẬP TOÁN THCS - CÔ DIỄM QUỲNH]\nKính gửi ${student?.parentName || 'Phụ huynh'} em ${student?.name} (${classroom?.name}): Điểm TB: ${mathScore}/10 (${rankCategory}), Độ chính xác: ${student?.accuracyRate}%. Nhận xét: ${teacherComment}. Cô Diễm Quỳnh trân trọng cảm ơn!`;

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (hidden in print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                {isEn ? 'Periodic Parent Report Card' : 'Sổ Báo Cáo Định Kỳ Phụ Huynh'}
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-xs font-bold text-indigo-700">
                {isEn ? 'Teacher: Ms. Diem Quynh' : 'Giáo viên: Cô Diễm Quỳnh'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {isEn ? 'Print Report Cards & Message Parents' : 'Xuất Phiếu Báo Cáo & Nhắn Tin Phụ Huynh'}
            </h3>
            <p className="text-sm text-slate-600">
              {isEn
                ? <>Pedagogical A4/PDF report template with SMS/Zalo dispatch to parent phone: <b className="font-mono text-indigo-700">{student?.parentPhone}</b>.</>
                : <>Mẫu phiếu thiết kế chuẩn sư phạm in A4/PDF và tính năng gửi SMS / Zalo trực tiếp đến SĐT phụ huynh: <b className="font-mono text-indigo-700">{student?.parentPhone}</b>.</>}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://zalo.me/${(student?.parentPhone || '').replace(/\s+/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Mở Zalo Phụ Huynh
            </a>

            <a
              href={`sms:${(student?.parentPhone || '').replace(/\s+/g, '')}?body=${encodeURIComponent(parentSmsMessage)}`}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Gửi SMS Cho Phụ Huynh
            </a>

            <button
              onClick={handleCopyZalo}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              {copiedZalo ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedZalo ? 'Đã Sao Chép!' : 'Copy Tin Nhắn'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" /> In Phiếu (A4 / PDF)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="text-slate-500 font-medium block mb-1">Chọn học sinh:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find(item => item.id === e.target.value);
                if (s) {
                  setTeacherComment(
                    `Em ${s.name} có thái độ học tập nghiêm túc, tích cực tham gia các hoạt động trò chơi ôn tập đầu giờ. Em nắm vững kiến thức trọng tâm và có tiến bộ vượt bậc.`
                  );
                }
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {classrooms.find(c => c.id === s.classId)?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Kỳ báo cáo:</label>
            <div className="flex gap-1">
              <button
                onClick={() => setPeriodType('week')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  periodType === 'week' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Hàng Tuần
              </button>
              <button
                onClick={() => setPeriodType('month')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  periodType === 'month' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Hàng Tháng
              </button>
              <button
                onClick={() => setPeriodType('midterm')}
                className={`px-3 py-1.5 rounded-lg border font-semibold ${
                  periodType === 'midterm' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                Giữa Học Kỳ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Printable Report Card Document (A4 Style) */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print-break-inside-avoid">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-serif">
            <span>PHÒNG GD&ĐT QUẬN / HUYỆN</span>
            <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-4 font-serif">
            <span>TRƯỜNG TRUNG HỌC CƠ SỞ THỰC NGHIỆM</span>
            <span>Độc lập - Tự do - Hạnh phúc</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-wide uppercase font-serif">
            PHIẾU ĐÁNH GIÁ NĂNG LỰC & TIẾN ĐỘ HỌC TẬP MÔN TOÁN
          </h2>
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest mt-1 block">
            {periodLabel}
          </span>
        </div>

        {/* Student & Class Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-3 font-serif">
          <div>
            <span className="text-slate-500 block">Họ và tên học sinh:</span>
            <span className="font-bold text-slate-900 text-sm">{student?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Lớp & Khối:</span>
            <span className="font-bold text-slate-900 text-sm">{classroom?.name} · Khối {classroom?.grade}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Giáo viên bộ môn:</span>
            <span className="font-bold text-slate-900 text-sm">{classroom?.homeroomTeacher || 'Cô Diễm Quỳnh'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Ngày đánh giá:</span>
            <span className="font-bold text-slate-900 text-sm font-mono">24/10/2026</span>
          </div>
        </div>

        {/* Parent Contact Strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs mb-6 font-serif">
          <div>
            <span className="text-slate-500 mr-2">Người nhận thông báo:</span>
            <b className="text-slate-900">{student?.parentName || 'Phụ huynh'}</b>
          </div>
          <div>
            <span className="text-slate-500 mr-2">Số điện thoại liên hệ:</span>
            <b className="font-mono text-indigo-700">{student?.parentPhone || 'Chưa cập nhật'}</b>
          </div>
        </div>

        {/* Comprehensive Score & Achievement Cards */}
        <div className="grid grid-cols-4 gap-3 text-center mb-6">
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <span className="text-[11px] text-indigo-800 font-semibold block">Điểm Tổng Kết Toán</span>
            <span className="text-2xl font-black text-indigo-700 font-mono">{mathScore}/10</span>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-[11px] text-emerald-800 font-semibold block">Xếp Loại Học Lực</span>
            <span className="text-lg font-black text-emerald-700 uppercase">{rankCategory}</span>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-[11px] text-blue-800 font-semibold block">Độ Chính Xác Làm Bài</span>
            <span className="text-2xl font-black text-blue-700 font-mono">{student?.accuracyRate}%</span>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <span className="text-[11px] text-amber-800 font-semibold block">Danh Hiệu Đạt Được</span>
            <span className="text-xs font-bold text-amber-900 line-clamp-2 mt-1">{student?.badge}</span>
          </div>
        </div>

        {/* Detailed Topic Mastery Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-serif">
            I. KẾT QUẢ ĐÁNH GIÁ THEO CHUYÊN ĐỀ GDPT MÔN TOÁN:
          </h4>
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Chuyên Đề</th>
                  <th className="py-2.5 px-3 text-center">Mức Độ Nắm Vững</th>
                  <th className="py-2.5 px-3">Đánh Giá & Nhận Xét Chuyên Môn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">1. Số học & Số nguyên / Số hữu tỉ</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-indigo-600">
                    {student?.topicsMastery.arithmetic}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Nắm vững quy tắc cộng trừ nhân chia, tính toán nhanh và chính xác.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">2. Đại số & Hằng đẳng thức / Phân thức</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-indigo-600">
                    {student?.topicsMastery.algebra}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Vận dụng tốt các hằng đẳng thức đáng nhớ vào phân tích đa thức.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">3. Phương trình & Giải bài toán bằng cách lập PT</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-indigo-600">
                    {student?.topicsMastery.equation}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Thành thạo phương pháp chuyển vế đổi dấu và giải hệ phương trình.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">4. Hình học phẳng & Định lý Pythagoras</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-indigo-600">
                    {student?.topicsMastery.geometry}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Khả năng tư duy hình học không gian và chứng minh tam giác bằng nhau tốt.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Comments Section (Editable) */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-serif flex items-center justify-between">
              <span>II. NHẬN XÉT CỦA GIÁO VIÊN BỘ MÔN:</span>
              <span className="text-[10px] text-slate-400 font-normal no-print flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Thầy/Cô có thể chỉnh sửa trực tiếp nội dung bên dưới
              </span>
            </h4>
            <textarea
              rows={3}
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed font-serif focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-serif">
              III. LỜI KHUYÊN DÀNH CHO GIA ĐÌNH VÀ HỌC SINH:
            </h4>
            <textarea
              rows={2}
              value={parentAdvice}
              onChange={(e) => setParentAdvice(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed font-serif focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs font-serif pt-6 border-t border-slate-200">
          <div>
            <span className="font-bold text-slate-800 uppercase block">Ý KIẾN & CHỮ KÝ PHỤ HUYNH</span>
            <span className="text-slate-400 italic block mt-1">(Ký và ghi rõ họ tên)</span>
            <div className="h-16"></div>
          </div>
          <div>
            <span className="text-slate-600 italic block">Ngày 24 tháng 10 năm 2026</span>
            <span className="font-bold text-slate-900 uppercase block mt-1">GIÁO VIÊN BỘ MÔN TOÁN</span>
            <div className="h-12 flex items-center justify-center font-cursive text-indigo-700 italic font-semibold">
              {classroom?.homeroomTeacher}
            </div>
            <span className="font-bold text-slate-900">{classroom?.homeroomTeacher}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
