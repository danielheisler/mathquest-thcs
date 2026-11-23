import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import { CameraPermissionGuideModal } from '../common/CameraPermissionGuideModal';
import { useCameraStream } from '../../hooks/useCameraStream';

interface WebcamCircleProps {
  isExamActive: boolean;
}

export const WebcamCircle: React.FC<WebcamCircleProps> = ({ isExamActive }) => {
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const {
    videoRef,
    cameraActive,
    cameraError,
    startCamera,
    stopCamera,
  } = useCameraStream({
    autoStart: false,
    width: 320,
    height: 320,
    facingMode: 'user',
  });

  useEffect(() => {
    if (cameraEnabled) {
      startCamera().then((ok) => {
        setIsSimulated(!ok);
      });
    } else {
      stopCamera();
      setIsSimulated(false);
    }
  }, [cameraEnabled, startCamera, stopCamera]);

  const toggleCamera = () => {
    soundManager.playClick();
    setCameraEnabled((prev) => !prev);
  };

  const handleRetryCamera = () => {
    setIsSimulated(false);
    if (!cameraEnabled) {
      setCameraEnabled(true);
    } else {
      startCamera().then((ok) => {
        setIsSimulated(!ok);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center relative my-2">
      {/* Outer Glow Ring */}
      <div className="relative group">
        <div
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 shadow-xl overflow-hidden relative flex items-center justify-center transition-all ${
            cameraActive
              ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/10'
              : 'border-slate-300 ring-2 ring-slate-200'
          }`}
        >
          {cameraEnabled && !isSimulated && cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover rounded-full transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white text-center p-2 relative overflow-hidden select-none">
              {/* Scanline Animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/15 to-transparent animate-pulse pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-400 flex items-center justify-center mb-1 text-indigo-300">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">
                Camera AI
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Giám sát bài làm</span>
            </div>
          )}

          {/* Fixed center crosshair overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-3 h-3 border-t border-l border-white/60 absolute top-4 left-4" />
            <div className="w-3 h-3 border-t border-r border-white/60 absolute top-4 right-4" />
            <div className="w-3 h-3 border-b border-l border-white/60 absolute bottom-4 left-4" />
            <div className="w-3 h-3 border-b border-r border-white/60 absolute bottom-4 right-4" />
          </div>
        </div>

          {/* Camera Toggle Button */}
          <button
            type="button"
            onClick={toggleCamera}
            className="absolute -bottom-2 right-2 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-md border border-white transition-all text-xs cursor-pointer"
            title={cameraEnabled ? 'Tắt camera' : 'Bật camera'}
          >
            {cameraEnabled ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5 text-rose-400" />}
          </button>
        </div>

        {/* Proctoring Status Pill & Help Button */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-slate-200 rounded-full text-[11px] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">
              {cameraActive ? 'Đang Kết Nối Camera Giám Sát' : 'Chế Độ Giám Sát Học Tập AI (Không Cần Camera)'}
            </span>
          </div>

          {!cameraActive && (
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              title={cameraError || undefined}
            >
              <span>❓ Hướng Dẫn Cấp Quyền Camera</span>
            </button>
          )}
        </div>
        {cameraError && !cameraActive && (
          <p className="mt-1.5 text-[11px] text-amber-700 text-center max-w-xs">
            {cameraError}
          </p>
        )}
      </div>

      <CameraPermissionGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onRetryCamera={handleRetryCamera}
        onUseSimulatedMode={() => {
          setIsSimulated(true);
          setCameraEnabled(false);
        }}
      />
    </>
  );
};
