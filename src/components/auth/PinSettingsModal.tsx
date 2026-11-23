import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import { 
  KeyRound, ShieldCheck, Lock, Copy, Check, RotateCcw, 
  X, Eye, EyeOff, Save, Users, GraduationCap, Share2
} from 'lucide-react';

interface PinSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherPin: string;
  parentPin: string;
  onSavePins: (newTeacherPin: string, newParentPin: string) => void;
}

export const PinSettingsModal: React.FC<PinSettingsModalProps> = ({
  isOpen,
  onClose,
  teacherPin,
  parentPin,
  onSavePins
}) => {
  const [currentTeacherPin, setCurrentTeacherPin] = useState<string>(teacherPin);
  const [currentParentPin, setCurrentParentPin] = useState<string>(parentPin);
  const [showTeacherPin, setShowTeacherPin] = useState<boolean>(false);
  const [showParentPin, setShowParentPin] = useState<boolean>(false);
  const [copiedParentPin, setCopiedParentPin] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentTeacherPin(teacherPin);
      setCurrentParentPin(parentPin);
      setShowTeacherPin(false);
      setShowParentPin(false);
      setCopiedParentPin(false);
      setCopiedMessage(false);
      setSavedSuccess(false);
    }
  }, [isOpen, teacherPin, parentPin]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacherPin.trim() || !currentParentPin.trim()) return;

    soundManager.playCorrect();
    onSavePins(currentTeacherPin.trim(), currentParentPin.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    soundManager.playClick();
    setCurrentTeacherPin('20112002');
    setCurrentParentPin('PH20112002');
  };

  const handleCopyParentPin = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(currentParentPin).then(() => {
      setCopiedParentPin(true);
      setTimeout(() => setCopiedParentPin(false), 2000);
    });
  };

  const handleCopyZaloMessage = () => {
    soundManager.playClick();
    const parentUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?portal=parent`
      : '';
    const message = `[GỬI RIÊNG TỪ CÔ DIỄM QUỲNH - GV BỘ MÔN TOÁN THCS]\nKính gửi Quý Phụ huynh,\nĐể theo dõi tiến độ làm bài tập về nhà, kết quả thi và nhận xét định kỳ của con, kính mời Quý Phụ huynh truy cập Góc Phụ Huynh:\n🔗 Đường dẫn: ${parentUrl}\n🔑 Mật mã riêng Góc Phụ Huynh: ${currentParentPin}\n(Lưu ý: Mật mã này được bảo mật và chỉ gửi riêng cho Quý Phụ huynh, không hiển thị công khai cho học sinh). Trân trọng cảm ơn Quý Phụ huynh!`;
    navigator.clipboard.writeText(message).then(() => {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Quản Lý & Gửi Riêng Mật Mã Bảo Mật
              </h4>
              <p className="text-xs text-slate-500">
                Mật mã GV & PH luôn được <b>ẩn bảo mật</b>, không hiển thị công khai.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Privacy Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Cả hai mật mã đều bị <b>ẩn hoàn toàn</b> trên màn hình đăng nhập, thanh tiêu đề và sổ lớp. Chỉ Cô Diễm Quỳnh mới có thể xem, đổi mật mã hoặc gửi riêng cho phụ huynh.
            </span>
          </div>

          {/* Section 1: Teacher PIN */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>1. Mật Mã Bảo Mật Góc Giáo Viên:</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
                Chỉ mình GV biết
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Dùng để mở khóa sổ điểm, ngân hàng đề thi học kỳ, radar chống gian lận và quản lý lớp.
            </p>
            <div className="relative">
              <input
                type={showTeacherPin ? 'text' : 'password'}
                required
                value={currentTeacherPin}
                onChange={(e) => setCurrentTeacherPin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowTeacherPin(!showTeacherPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showTeacherPin ? 'Ẩn mật mã GV' : 'Hiện mật mã GV'}
              >
                {showTeacherPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Section 2: Parent PIN */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>2. Mật Mã Góc Phụ Huynh (GV Gửi Riêng):</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyParentPin}
                  className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Sao chép mã Phụ huynh (vẫn giữ ẩn trên màn hình)"
                >
                  {copiedParentPin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedParentPin ? 'Đã sao chép' : 'Sao chép mã'}</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Mật mã này không hiển thị trên hệ thống. Khi cần, Cô Diễm Quỳnh bấm nút bên dưới để sao chép và gửi riêng qua Zalo/SMS cho phụ huynh (hoặc gửi riêng từng phụ huynh trong Sổ Lớp).
            </p>
            <div className="relative">
              <input
                type={showParentPin ? 'text' : 'password'}
                required
                value={currentParentPin}
                onChange={(e) => setCurrentParentPin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowParentPin(!showParentPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showParentPin ? 'Ẩn mật mã PH' : 'Hiện mật mã PH'}
              >
                {showParentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Share to Zalo / SMS */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopyZaloMessage}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-100" />
                <span>{copiedMessage ? 'Đã sao chép tin nhắn gửi riêng!' : 'Sao Chép Tin Nhắn Gửi Riêng Mật Mã Cho Phụ Huynh (Zalo/SMS)'}</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu cài đặt mã bảo mật thành công!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
