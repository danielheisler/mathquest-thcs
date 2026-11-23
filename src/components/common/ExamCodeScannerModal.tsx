import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { useCameraStream } from '../../hooks/useCameraStream';
import { CameraPermissionGuideModal } from './CameraPermissionGuideModal';
import { QrCode, X, CheckCircle2, Timer, Scan, ArrowRight, Video, Lock } from 'lucide-react';

interface ExamCodeScannerModalProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

export const ExamCodeScannerModal: React.FC<ExamCodeScannerModalProps> = ({
  onScanSuccess,
  onClose
}) => {
  const [manualCode, setManualCode] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState<boolean>(false);

  const {
    videoRef,
    cameraActive,
    cameraError,
    isLoading,
    startCamera,
  } = useCameraStream({
    autoStart: true,
    width: 640,
    height: 480,
    facingMode: 'environment',
  });

  const PRESET_CODES = [
    { code: 'KT15-K6', label: 'Đề 15p Khối 6 (Số học)', time: '15 phút' },
    { code: 'KT15-K7', label: 'Đề 15p Khối 7 (Hữu tỉ)', time: '15 phút' },
    { code: 'KT15-K8', label: 'Đề 15p Khối 8 (Hằng đẳng thức)', time: '15 phút' },
    { code: 'KT15-K9', label: 'Đề 15p Khối 9 (Căn thức)', time: '15 phút' },
    { code: '20112002', label: 'Mã Lớp BTVN Cô Diễm Quỳnh', time: '10 phút' },
  ];

  const handleTriggerCode = (code: string) => {
    soundManager.playCorrect();
    setDetectedCode(code);
    setScanStatus('success');
    setTimeout(() => {
      onScanSuccess(code);
    }, 1000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleTriggerCode(manualCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-3xl p-6 text-white shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Quét Mã Đề Thi & BTVN (Quy Định Thời Gian)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Quét mã QR đề 15 phút, Giữa kỳ hoặc nhập mã đề thi của Cô Diễm Quỳnh
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera / Scan Reticle View */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-inner flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            className={`w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          />

          {!cameraActive && (
            <div className="absolute inset-0 text-center p-4 flex flex-col items-center justify-center space-y-2.5 bg-slate-950/90 z-10">
              <QrCode className="w-10 h-10 text-indigo-400/70 mx-auto animate-pulse" />
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                {isLoading
                  ? 'Đang kết nối Camera quét mã QR...'
                  : cameraError || 'Camera chưa bật. Bạn có thể cấp quyền hoặc chọn mã đề thi bên dưới.'}
              </p>
              {!isLoading && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Bật Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPermissionGuide(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hướng dẫn</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Corner brackets */}
            <div className="w-48 h-36 border-2 border-indigo-400/80 rounded-2xl relative shadow-lg">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              {/* Laser Beam Animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-cyan-400 shadow-md animate-bounce mt-16" />
            </div>

            <span className="text-[11px] font-bold text-cyan-300 mt-2 bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/30">
              Đặt mã QR hoặc thẻ đề thi vào giữa khung
            </span>
          </div>

          {/* Success Overlay */}
          {scanStatus === 'success' && (
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <h4 className="text-sm font-black text-white">ĐÃ QUÉT THÀNH CÔNG MÃ ĐỀ:</h4>
              <span className="text-lg font-mono font-black text-amber-300 bg-emerald-900/60 px-4 py-1 rounded-xl border border-emerald-500/40">
                {detectedCode}
              </span>
              <p className="text-xs text-emerald-200">Đang kích hoạt đồng hồ đếm ngược vào làm bài...</p>
            </div>
          )}
        </div>

        {/* Preset Quick Scan Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
            <span>Mã đề thi nhanh chuẩn bị sẵn:</span>
            <span className="text-[11px] text-indigo-400 font-normal">Click để quét mô phỏng tức thì</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_CODES.map((item) => (
              <button
                key={item.code}
                onClick={() => handleTriggerCode(item.code)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-300 text-xs">{item.code}</span>
                  <span className="text-[10px] text-indigo-300 font-mono flex items-center gap-0.5">
                    <Timer className="w-3 h-3" /> {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-1 font-medium">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Code Input Form */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Hoặc nhập mã đề thi (VD: KT15-K6, 20112002)..."
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30 shrink-0"
            >
              <span>Vào Thi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      <CameraPermissionGuideModal
        isOpen={showPermissionGuide}
        onClose={() => setShowPermissionGuide(false)}
        onRetryCamera={() => startCamera()}
      />
    </div>
  );
};
