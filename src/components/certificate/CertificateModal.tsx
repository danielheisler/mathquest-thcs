import React, { useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Award, Printer, X, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../../i18n/translations';

interface CertificateModalProps {
  studentName: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  classCode?: string;
  className?: string;
  language?: Language;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  score,
  totalQuestions,
  accuracy,
  classCode = '20112002',
  className,
  language = 'vi',
  onClose
}) => {
  const t = translations[language] || translations['vi'];

  useEffect(() => {
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 }
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-300 relative my-8 print:p-0 print:border-none print:shadow-none">
        {/* Close Button (No print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-4 border-double border-amber-600/80 p-6 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative overflow-hidden">
          {/* Top Banner */}
          <div className="text-xs uppercase tracking-widest text-slate-600 font-serif mb-1">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-[11px] font-serif text-slate-500 mb-4 pb-2 border-b border-amber-200 inline-block px-8">
            Độc lập - Tự do - Hạnh phúc
          </div>

          {/* Golden Seal Emblem */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-white">
            <Award className="w-9 h-9 text-amber-950" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-amber-900 tracking-wider font-serif uppercase mb-1">
            {t.certificateTitle}
          </h2>
          <p className="text-xs text-amber-800 font-medium tracking-wide uppercase mb-5">
            {t.certificateSubtitle}
          </p>

          <div className="text-xs text-slate-600 font-serif mb-1">Cô Diễm Quỳnh Trân Trọng Khen Tặng Em:</div>
          <div className="text-2xl md:text-3xl font-extrabold text-indigo-900 font-serif py-1 my-1 border-y border-dashed border-amber-300/80 inline-block px-8">
            {studentName}
          </div>

          <div className="text-xs text-slate-700 max-w-lg mx-auto mt-3 font-serif leading-relaxed">
            Đã hoàn thành xuất sắc bài tập về nhà môn Toán THCS (Mã lớp: <span className="font-mono font-bold text-indigo-700">{classCode}</span>) với kết quả ấn tượng:
          </div>

          {/* Result Highlights */}
          <div className="flex justify-center gap-6 my-4 font-serif">
            <div className="px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Điểm Đạt Được</span>
              <span className="text-xl font-mono font-black text-amber-600">{score.toFixed(1)}/10</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Độ Chính Xác</span>
              <span className="text-xl font-mono font-black text-emerald-600">{accuracy}%</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block">Số Câu Đúng</span>
              <span className="text-xl font-mono font-black text-indigo-600">{Math.round((accuracy * totalQuestions) / 100)}/{totalQuestions}</span>
            </div>
          </div>

          {/* Date & Signature */}
          <div className="grid grid-cols-2 gap-4 text-xs font-serif mt-6 pt-4 border-t border-amber-200/60">
            <div className="text-left pl-4">
              <span className="text-slate-500 block">Mã Chứng Nhận:</span>
              <span className="font-mono font-bold text-slate-700">CERT-{classCode}-{Date.now().toString().slice(-4)}</span>
            </div>
            <div className="text-right pr-4">
              <span className="text-slate-600 italic block">Ngày 24 tháng 10 năm 2026</span>
              <span className="font-bold text-slate-900 block mt-0.5">GIÁO VIÊN BỘ MÔN TOÁN</span>
              <div className="h-10 flex items-center justify-end font-cursive text-indigo-700 italic text-base font-bold">
                Cô Diễm Quỳnh
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (No print) */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {t.close}
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCertificate}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
