import React, { useState } from 'react';
import {
  generateWordEssayDocx,
  WordEssayConfig,
  EssayScreenshotItem,
} from '../../utils/wordEssayExporter';
import { soundManager } from '../../utils/sound';
import {
  FileText,
  Download,
  CheckCircle2,
  Upload,
  Trash2,
  ExternalLink,
  Youtube,
  BookOpen,
  FileCheck2,
  Loader2,
  Image as ImageIcon,
  Printer,
} from 'lucide-react';

const DEFAULT_SCREENSHOTS: EssayScreenshotItem[] = [
  {
    stepKey: 'step1',
    caption: 'Hình 1. Giao diện trang chủ MathQuest THCS với 3 không gian Học sinh – Phụ huynh – Giáo viên.',
    dataUrl: null,
  },
  {
    stepKey: 'step2',
    caption: 'Hình 2. Giao diện Tạo Đề AI không cần kho tài liệu theo đúng cấu trúc đề 15p / Giữa kỳ / Cuối kỳ.',
    dataUrl: null,
  },
  {
    stepKey: 'step3',
    caption: 'Hình 3. Mục Giải Chi Tiết từng bước, biểu điểm tự luận và phân tích sư phạm 4 bước bằng AI.',
    dataUrl: null,
  },
  {
    stepKey: 'step4',
    caption: 'Hình 4. Giao diện học sinh làm bài thi trực tuyến, trò chơi Toán học và vận động Camera.',
    dataUrl: null,
  },
  {
    stepKey: 'step5',
    caption: 'Hình 5. Góc Giáo Viên: Thống kê báo cáo tuần, cột giờ vào – giờ ra và Radar cảnh báo chuyển tab.',
    dataUrl: null,
  },
  {
    stepKey: 'step6',
    caption: 'Hình 6. Góc Phụ Huynh bảo mật bằng mã riêng, Sơ đồ chỗ ngồi lớp học và Sổ điểm VnEdu.',
    dataUrl: null,
  },
];

export const WordEssayStudio: React.FC = () => {
  const [studentFullName, setStudentFullName] = useState<string>('TRẦN THỊ DIỄM QUỲNH');
  const [fileName, setFileName] = useState<string>('Quynh.TranThiDiem.TOAN');
  const [softwareName, setSoftwareName] = useState<string>('MATHQUEST THCS');
  const [chapterAndSubject, setChapterAndSubject] = useState<string>('MÔN TOÁN CẤP TRUNG HỌC CƠ SỞ (KHỐI 6 - 9)');
  const [targetCompetency, setTargetCompetency] = useState<string>('TOÁN HỌC VÀ NĂNG LỰC SỐ CHO HỌC SINH');
  const [advisorName, setAdvisorName] = useState<string>('PGS.TS LÊ THANH HUY');
  const [locationAndDate, setLocationAndDate] = useState<string>('ĐÀ NẴNG, 11/2026');
  const [onlineAppUrl, setOnlineAppUrl] = useState<string>(
    'https://ais-pre-o5qlpvdy237xpaottrimr2-289569888306.asia-northeast1.run.app'
  );
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [screenshots, setScreenshots] = useState<EssayScreenshotItem[]>(DEFAULT_SCREENSHOTS);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const handleUploadScreenshot = (stepKey: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        setScreenshots(prev =>
          prev.map(item =>
            item.stepKey === stepKey
              ? { ...item, dataUrl, width: img.naturalWidth, height: img.naturalHeight }
              : item
          )
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = (stepKey: string) => {
    soundManager.playClick();
    setScreenshots(prev =>
      prev.map(item =>
        item.stepKey === stepKey ? { ...item, dataUrl: null, width: undefined, height: undefined } : item
      )
    );
  };

  const handleDownloadWord = async () => {
    soundManager.playClick();
    setIsExporting(true);
    setExportSuccessMsg(null);

    try {
      const config: WordEssayConfig = {
        studentFullName,
        fileName,
        softwareName,
        chapterAndSubject,
        targetCompetency,
        advisorName,
        locationAndDate,
        onlineAppUrl,
        youtubeUrl,
        screenshots,
      };

      const blob = await generateWordEssayDocx(config);
      const cleanName = (fileName.trim() || 'Quynh.TranThiDiem.TOAN').replace(/\.docx$/i, '');
      const fullFileName = `${cleanName}.docx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      soundManager.playCorrect();
      setExportSuccessMsg(
        `Đã tải xuống thành công file Word "${fullFileName}" (chuẩn Times New Roman 12pt, giãn dòng 1, lề trái 3cm, các lề còn lại 2cm, in đen trắng 2 mặt).`
      );
    } catch (err) {
      console.error('Export Word error:', err);
      soundManager.playWrong();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-extrabold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-sky-300" />
              <span>Xuất Mẫu Word (.docx) Chuẩn Trường ĐH Sư Phạm – ĐH Đà Nẵng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tạo &amp; Tải File Tiểu Luận Word (.docx) Hoàn Chỉnh
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Tự động định dạng sẵn chuẩn 100% yêu cầu nộp bài thi hết học phần của{' '}
              <b>PGS.TS Lê Thanh Huy</b>: khổ <b>A4</b>, font <b>Times New Roman</b> cỡ <b>12pt</b>, giãn dòng{' '}
              <b>1.0</b>, lề trái <b>3 cm</b>, lề trên/dưới/phải <b>2 cm</b>, đen trắng chuẩn in 2 mặt không bìa gương.
            </p>
          </div>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadWord}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-60 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2.5 shrink-0 transition-all cursor-pointer active:scale-95"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang tạo file Word...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Tải Ngay File Word (.docx)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {exportSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div>{exportSuccessMsg}</div>
            <div className="text-xs font-medium text-emerald-700 mt-1">
              Mở file bằng Microsoft Word để kiểm tra lần cuối, sau đó nộp qua link Google Form:{' '}
              <a
                href="https://forms.gle/fbZQB3gyVaJfF2ku6"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold"
              >
                https://forms.gle/fbZQB3gyVaJfF2ku6
              </a>{' '}
              (Hạn chót: 30/11/2026).
            </div>
          </div>
        </div>
      )}

      {/* Checklist & Format Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-black text-indigo-700 uppercase flex items-center gap-1.5">
            <Printer className="w-4 h-4" />
            <span>Định Dạng Tự Động Trong File</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
            <li>Font: <b>Times New Roman</b>, cỡ chữ <b>12 pt</b></li>
            <li>Giãn dòng: <b>Single (1.0)</b></li>
            <li>Căn lề: <b>Trái 3 cm</b>, Trên/Dưới/Phải <b>2 cm</b></li>
            <li>Thiết kế đen trắng chuẩn in 2 mặt, không đóng bìa gương</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Đủ 100% Cấu Trúc 5 Ảnh Mẫu</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
            <li>Trang bìa ĐH Đà Nẵng – ĐH Sư Phạm</li>
            <li>Trang Mục lục có đánh số đề mục</li>
            <li>Nội dung đủ 5 mục + Sơ đồ chức năng + Quy trình 6 bước</li>
            <li>Tài liệu tham khảo chia 3 mục: Tiếng Việt, Tiếng Anh, Link web</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs space-y-1.5">
          <div className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            <span>Lưu Ý Nộp Bài (Hạn 30/11/2026)</span>
          </div>
          <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4">
            <li>Quy tắc tên file: <b>Ten.hovachulot.TOAN.docx</b></li>
            <li>
              Link nộp online:{' '}
              <a
                href="https://forms.gle/fbZQB3gyVaJfF2ku6"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-indigo-700 inline-flex items-center gap-0.5"
              >
                forms.gle/fbZQB3gyVaJfF2ku6 <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>In 2 mặt đen trắng nộp lớp trưởng chuyên ngành &amp; ký 2 danh sách thi GK, CK</li>
          </ul>
        </div>
      </div>

      {/* Editable Metadata Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">
            1. Chỉnh Sửa Thông Tin Trang Bìa &amp; Tên File Xuất
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kiểm tra lại Họ và tên học viên, tên file theo mẫu <code>Ten.hovachulot.TOAN</code> và dán link YouTube (nếu đã quay xong).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Họ và tên học viên (in trên Trang bìa)
            </label>
            <input
              type="text"
              value={studentFullName}
              onChange={e => setStudentFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên file xuất (Mẫu: Ten.hovachulot.TOAN)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 focus:bg-white text-sm font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="px-3 py-2.5 rounded-r-xl border border-slate-200 bg-slate-100 text-sm font-mono font-bold text-slate-600">
                .docx
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên phần mềm / Website
            </label>
            <input
              type="text"
              value={softwareName}
              onChange={e => setSoftwareName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trong dạy học chương / phần / môn
            </label>
            <input
              type="text"
              value={chapterAndSubject}
              onChange={e => setChapterAndSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nhằm phát triển năng lực
            </label>
            <input
              type="text"
              value={targetCompetency}
              onChange={e => setTargetCompetency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hướng dẫn khoa học
              </label>
              <input
                type="text"
                value={advisorName}
                onChange={e => setAdvisorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Địa điểm, Thời gian
              </label>
              <input
                type="text"
                value={locationAndDate}
                onChange={e => setLocationAndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Link liên kết tới học liệu số online (Mục 4.1)
            </label>
            <input
              type="url"
              value={onlineAppUrl}
              onChange={e => setOnlineAppUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Youtube className="w-4 h-4 text-rose-600" />
              <span>Link video YouTube hướng dẫn chi tiết (Cuối Mục 5)</span>
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtu.be/... (có thể để trống và dán sau trong Word)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Optional Screenshot Uploader for Section 5.2 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <span>2. Chèn Sẵn Ảnh Chụp Màn Hình Các Bước Sử Dụng (Tùy Chọn)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bạn có thể tải ảnh chụp màn hình từng bước ngay tại đây để tự động nhúng vào Mục 5.2 của file Word, hoặc bỏ trống để file Word tự tạo khung chờ sẵn cho bạn dán ảnh sau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {screenshots.map((shot, idx) => (
            <div
              key={shot.stepKey}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-black text-indigo-700">Ảnh minh họa Bước {idx + 1}</div>
                <div className="text-[11px] text-slate-600 leading-snug">{shot.caption}</div>
              </div>

              {shot.dataUrl ? (
                <div className="space-y-2">
                  <img
                    src={shot.dataUrl}
                    alt={shot.caption}
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveScreenshot(shot.stepKey)}
                    className="w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ảnh này</span>
                  </button>
                </div>
              ) : (
                <label className="w-full py-3 px-3 rounded-xl border border-dashed border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Chọn ảnh chụp màn hình</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={e => handleUploadScreenshot(shot.stepKey, e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Download Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            File tải về có định dạng chuẩn <b>Microsoft Word (.docx)</b>, mở và chỉnh sửa dễ dàng trên Word 2013–2024 / Google Docs.
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadWord}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang xuất file Word...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Tải Xuống {fileName.trim() || 'Quynh.TranThiDiem.TOAN'}.docx</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
