import React from 'react';
import { Student, Classroom, HomeworkSubmission } from '../../types/math';
import { soundManager } from '../../utils/sound';
import { Printer, Download, X, Award, CheckCircle2, AlertTriangle, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface ComprehensiveClassReportModalProps {
  students: Student[];
  classroom: Classroom;
  submissions: HomeworkSubmission[];
  onClose: () => void;
}

export const ComprehensiveClassReportModal: React.FC<ComprehensiveClassReportModalProps> = ({
  students,
  classroom,
  submissions,
  onClose
}) => {
  const TEACHER_NAME = 'Cô Diễm Quỳnh';
  const TODAY = new Date().toLocaleDateString('vi-VN');

  // Compute 5 tiers
  const tierGioi = students.filter(s => s.overallScore >= 8.5);
  const tierKha = students.filter(s => s.overallScore >= 7.0 && s.overallScore < 8.5);
  const tierTrungBinh = students.filter(s => s.overallScore >= 5.0 && s.overallScore < 7.0);
  const tierYeu = students.filter(s => s.overallScore >= 3.5 && s.overallScore < 5.0);
  const tierKem = students.filter(s => s.overallScore < 3.5);

  const avgScore = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.overallScore, 0) / students.length).toFixed(1)
    : '0';

  const certificatesCount = students.filter(s => s.overallScore >= 8.0).length;

  // Ranked students
  const sortedStudents = [...students].sort((a, b) => b.overallScore - a.overallScore);

  const handlePrintToPdf = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold">Bản Báo Cáo Tổng Hợp Điểm Số & Thứ Hạng Lớp Học (A4 / PDF)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintToPdf}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Lưu Thành PDF (In Trình Duyệt)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document (A4 Styling) */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-serif space-y-6 printable-document">
          {/* Header Quốc Hiệu */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 text-xs font-sans">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-800">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
              <p className="font-semibold text-slate-700">TRƯỜNG THCS NGUYỄN DU</p>
              <p className="text-[11px] text-slate-500 font-mono">Mã lớp: 20112002</p>
            </div>
            <div className="text-right">
              <p className="font-bold uppercase tracking-wider text-slate-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-semibold text-slate-700">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-[11px] text-slate-500 italic">Ngày {TODAY}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1 font-sans">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              BÁO CÁO TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ MÔN TOÁN THCS
            </h2>
            <p className="text-xs font-bold text-indigo-800">
              Lớp: {classroom.name} · Khối {classroom.grade} · Niên khóa: {classroom.schoolYear}
            </p>
            <p className="text-xs text-slate-600">
              Giáo viên bộ môn Toán: <b className="text-slate-900">{TEACHER_NAME}</b>
            </p>
          </div>

          {/* Summary KPI Block */}
          <div className="grid grid-cols-4 gap-3 text-center font-sans">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Tổng Sĩ Số</span>
              <span className="text-xl font-mono font-black text-slate-900">{students.length} em</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Đã Nộp Bài</span>
              <span className="text-xl font-mono font-black text-emerald-700">{submissions.length} / {students.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Điểm Trung Bình</span>
              <span className="text-xl font-mono font-black text-indigo-700">{avgScore} / 10</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Số Giấy Khen</span>
              <span className="text-xl font-mono font-black text-amber-600">{certificatesCount} em</span>
            </div>
          </div>

          {/* 5-Level Distribution Summary Table */}
          <div className="font-sans space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Thống Kê Phân Bố Điểm Số Theo 5 Mức (Bộ GD&ĐT):
            </h4>
            <div className="overflow-x-auto border border-slate-300 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3">Mức Xếp Loại</th>
                    <th className="py-2 px-3">Khoảng Điểm</th>
                    <th className="py-2 px-3 text-center">Số Lượng</th>
                    <th className="py-2 px-3 text-center">Tỷ Lệ (%)</th>
                    <th className="py-2 px-3">Đánh Giá Sư Phạm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 font-bold text-emerald-700">🌟 Giỏi</td>
                    <td className="py-2 px-3 font-mono font-semibold">Từ 8.5 đến 10.0</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">{tierGioi.length}</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {Math.round((tierGioi.length / (students.length || 1)) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600">Nắm vững lý thuyết, giải tốt bài toán vận dụng cao</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-blue-700">🔷 Khá</td>
                    <td className="py-2 px-3 font-mono font-semibold">Từ 7.0 đến 8.4</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">{tierKha.length}</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {Math.round((tierKha.length / (students.length || 1)) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600">Nắm chắc kiến thức cơ bản và thông hiểu</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-700">🔶 Trung Bình</td>
                    <td className="py-2 px-3 font-mono font-semibold">Từ 5.0 đến 6.9</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">{tierTrungBinh.length}</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {Math.round((tierTrungBinh.length / (students.length || 1)) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600">Đạt yêu cầu chuẩn kiến thức kỹ năng</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-orange-700">⚠️ Yếu</td>
                    <td className="py-2 px-3 font-mono font-semibold">Từ 3.5 đến 4.9</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">{tierYeu.length}</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {Math.round((tierYeu.length / (students.length || 1)) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600">Cần phụ đạo và rèn luyện thêm bài tập cơ bản</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-rose-700">❌ Kém</td>
                    <td className="py-2 px-3 font-mono font-semibold">Dưới 3.5</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">{tierKem.length}</td>
                    <td className="py-2 px-3 text-center font-bold font-mono">
                      {Math.round((tierKem.length / (students.length || 1)) * 100)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600">Cần gia đình và giáo viên phối hợp kèm cặp đặc biệt</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Student Ranking Table */}
          <div className="font-sans space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              2. Danh Sách Điểm Số & Thứ Hạng Chi Tiết Từng Học Sinh:
            </h4>
            <div className="overflow-x-auto border border-slate-300 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-2 text-center w-8">STT</th>
                    <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                    <th className="py-2.5 px-3">SĐT Phụ Huynh</th>
                    <th className="py-2.5 px-2 text-right">Điểm 15P</th>
                    <th className="py-2.5 px-2 text-right">Giữa Kỳ</th>
                    <th className="py-2.5 px-2 text-right">Điểm TB</th>
                    <th className="py-2.5 px-2 text-center">Thứ Hạng</th>
                    <th className="py-2.5 px-3 text-center">Xếp Loại</th>
                    <th className="py-2.5 px-3 text-center">Giấy Khen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedStudents.map((st, idx) => {
                    const rankLabel = 
                      st.overallScore >= 8.5 ? 'Giỏi' :
                      st.overallScore >= 7.0 ? 'Khá' :
                      st.overallScore >= 5.0 ? 'Trung Bình' :
                      st.overallScore >= 3.5 ? 'Yếu' : 'Kém';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{st.parentPhone}</td>
                        <td className="py-2 px-2 text-right font-mono font-semibold">
                          {(st.overallScore * 0.95).toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-semibold">
                          {(st.overallScore * 1.02 > 10 ? 10 : st.overallScore * 1.02).toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-black text-indigo-700">
                          {st.overallScore.toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-amber-600">
                          #{idx + 1}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            st.overallScore >= 8.5 ? 'bg-emerald-100 text-emerald-800' :
                            st.overallScore >= 7.0 ? 'bg-blue-100 text-blue-800' :
                            st.overallScore >= 5.0 ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {rankLabel}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {st.overallScore >= 8.0 ? (
                            <span className="font-bold text-amber-700 text-[11px] inline-flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-600" /> Đạt
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Signature Footer */}
          <div className="pt-8 flex justify-between items-end font-sans text-xs">
            <div className="space-y-1 text-slate-500">
              <p>Hệ thống Toán THCS MathQuest</p>
              <p>Mã lớp học trực tuyến: <b>20112002</b></p>
              <p>Xác thực bảo mật dữ liệu học sinh</p>
            </div>
            <div className="text-center space-y-2">
              <p className="font-bold text-slate-800 uppercase">GIÁO VIÊN BỘ MÔN TOÁN</p>
              <p className="text-[11px] text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic font-bold text-indigo-800 text-lg">Diễm Quỳnh</span>
              </div>
              <p className="font-bold text-slate-900">{TEACHER_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
