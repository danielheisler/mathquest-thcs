import React from 'react';
import { Camera, Lock, RefreshCw, ExternalLink, CheckCircle2, ShieldCheck, X, Video, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface CameraPermissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryCamera?: () => void;
  onUseSimulatedMode?: () => void;
}

export const CameraPermissionGuideModal: React.FC<CameraPermissionGuideModalProps> = ({
  isOpen,
  onClose,
  onRetryCamera,
  onUseSimulatedMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-5 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              Hướng Dẫn Cấp Quyền Sử Dụng Camera
            </h3>
            <p className="text-xs text-slate-500">
              Khắc phục lỗi không cấp được quyền hoặc không tìm thấy webcam
            </p>
          </div>
        </div>

        {/* 3 Clear Steps to Fix */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                Bấm vào biểu tượng 🔒 hoặc 🎥 trên thanh địa chỉ
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Trên thanh địa chỉ trình duyệt (ở góc trên bên trái, cạnh tên miền trang web), nhấp vào biểu tượng <b>Ổ khóa (🔒)</b> hoặc <b>Máy quay (🎥)</b>.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                Chuyển Camera sang "Cho phép" (Allow)
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Tìm mục <b>Máy ảnh / Camera</b> và gạt công tắc hoặc chọn mục <b>Cho phép (Allow)</b> thay vì <i>Chặn (Block)</i>.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                Nhấn F5 hoặc Tải lại trang web
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Sau khi cấp quyền, nhấn <b>Tải lại trang (F5)</b> để trình duyệt kích hoạt camera trực tiếp.
              </p>
            </div>
          </div>
        </div>

        {/* Iframe Notice & Tab opener */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Đang chạy trong môi trường xem trước (IFrame)?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800/90">
            Nếu đang mở trong trình xem trước của AI Studio hoặc ứng dụng nhúng, trình duyệt có thể hạn chế quyền Camera. Bạn có thể mở ứng dụng trong một Tab mới riêng biệt:
          </p>
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs mt-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở Trang Sang Tab Mới Độc Lập</span>
          </a>
        </div>

        {/* Alternative: Retry or Play Without Camera Mode */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
          {onRetryCamera && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
                onRetryCamera();
              }}
              className="w-full sm:flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Video className="w-4 h-4" />
              <span>Thử Bật Camera Ngay</span>
            </button>
          )}

          {onUseSimulatedMode && (
            <button
              type="button"
              onClick={() => {
                soundManager.playCorrect();
                onUseSimulatedMode();
                onClose();
              }}
              className="w-full sm:flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Chơi Không Cần Camera</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
