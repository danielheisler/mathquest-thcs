import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../common/MathView';
import { BodyPoseIllustration } from './BodyPoseIllustrations';
import { CertificateModal } from '../certificate/CertificateModal';
import { soundManager } from '../../utils/sound';
import { useCameraStream } from '../../hooks/useCameraStream';
import { drawVideoFrame } from '../../utils/camera';
import { CameraPermissionGuideModal } from '../common/CameraPermissionGuideModal';
import { 
  Camera, CameraOff, Video, ArrowLeft, ArrowRight, CheckCircle2, 
  XCircle, Award, RotateCcw, Clock, Zap, Maximize2, Minimize2, Sparkles, RefreshCw, Lock
} from 'lucide-react';

interface TrueFalseQuestion {
  id: string;
  grade: number;
  statement: string;
  formula?: string;
  isTrue: boolean;
  explanation: string;
}

const trueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: 'tf-1',
    grade: 6,
    statement: 'Số 0 là số nguyên dương.',
    isTrue: false,
    explanation: 'Số 0 là số nguyên nhưng không phải là số nguyên dương và cũng không phải là số nguyên âm!'
  },
  {
    id: 'tf-2',
    grade: 7,
    statement: 'Giá trị của phép tính sau bằng 16:',
    formula: '(-4)^2 = 16',
    isTrue: true,
    explanation: '(-4)² = (-4) × (-4) = 16 (bình phương của số âm là số dương).'
  },
  {
    id: 'tf-3',
    grade: 7,
    statement: 'Hai góc đối đỉnh thì luôn có số đo bằng nhau.',
    isTrue: true,
    explanation: 'Đây là định lý cơ bản hình học lớp 7: Hai góc đối đỉnh thì bằng nhau.'
  },
  {
    id: 'tf-4',
    grade: 8,
    statement: 'Đẳng thức sau là ĐÚNG với mọi A và B:',
    formula: '(A - B)^2 = A^2 - B^2',
    isTrue: false,
    explanation: '(A - B)² = A² - 2AB + B², không bằng A² - B²!'
  },
  {
    id: 'tf-5',
    grade: 8,
    statement: 'Tam giác có ba cạnh là 3cm, 4cm, 5cm là tam giác vuông.',
    isTrue: true,
    explanation: 'Theo định lý Pythagoras đảo: 3² + 4² = 9 + 16 = 25 = 5².'
  },
  {
    id: 'tf-6',
    grade: 9,
    statement: 'Biểu thức sau có nghĩa khi x ≥ 3:',
    formula: '\\sqrt{x - 3}',
    isTrue: true,
    explanation: 'Căn thức bậc hai √(x - 3) xác định khi và chỉ khi x - 3 ≥ 0 <=> x ≥ 3.'
  },
  {
    id: 'tf-7',
    grade: 9,
    statement: 'Đường kính là dây cung dài nhất của đường tròn.',
    isTrue: true,
    explanation: 'Định lý đường kính và dây: Trong các dây của một đường tròn, đường kính là dây có độ dài lớn nhất.'
  }
];

interface BodyTiltTrueFalseGameProps {
  activeStudentName?: string;
  activeClassName?: string;
  onExit?: () => void;
}

export const BodyTiltTrueFalseGame: React.FC<BodyTiltTrueFalseGameProps> = ({
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1',
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentQ = trueFalseQuestions[currentIndex];

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(15);

  // Camera & Body Tilt Detection
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [showPermissionGuide, setShowPermissionGuide] = useState<boolean>(false);

  const [activeTilt, setActiveTilt] = useState<'left' | 'right' | null>(null);
  const [tiltProgress, setTiltProgress] = useState<number>(0);
  const tiltStartTimeRef = useRef<number>(0);
  const lastTiltRef = useRef<'left' | 'right' | null>(null);
  const lastFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  const {
    videoRef,
    videoElementRef,
    cameraActive,
    cameraError,
    isLoading: isCameraLoading,
    startCamera,
    stopCamera,
  } = useCameraStream({
    autoStart: true,
    width: 640,
    height: 360,
    facingMode: 'user',
    onStarted: () => {
      lastFrameDataRef.current = null;
    },
  });

  // Motion Detection for Left vs Right tilt
  useEffect(() => {
    lastFrameDataRef.current = null;
    if (!cameraActive || isAnswered || isGameOver) {
      setActiveTilt(null);
      setTiltProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const video = videoElementRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || video.readyState < 2 || video.videoWidth === 0) return;

      const w = 120;
      const h = 90;
      canvas.width = w;
      canvas.height = h;

      drawVideoFrame(ctx, video, w, h, isMirror);
      const currentFrame = ctx.getImageData(0, 0, w, h).data;
      const prevFrame = lastFrameDataRef.current;

      if (!prevFrame) {
        lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);
        return;
      }

      // Check motion energy in Left Half vs Right Half
      let leftEnergy = 0;
      let rightEnergy = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const diff = Math.abs(currentFrame[idx] - prevFrame[idx]) +
                       Math.abs(currentFrame[idx + 1] - prevFrame[idx + 1]) +
                       Math.abs(currentFrame[idx + 2] - prevFrame[idx + 2]);
          if (diff > 50) {
            if (x < w * 0.45) {
              leftEnergy++;
            } else if (x > w * 0.55) {
              rightEnergy++;
            }
          }
        }
      }

      lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);

      const threshold = 35;
      let detected: 'left' | 'right' | null = null;
      if (leftEnergy > threshold && leftEnergy > rightEnergy * 1.4) {
        // In mirror mode: user tilts to their left -> appears on left of screen
        detected = 'left';
      } else if (rightEnergy > threshold && rightEnergy > leftEnergy * 1.4) {
        detected = 'right';
      }

      const now = Date.now();
      if (detected !== null) {
        if (lastTiltRef.current === detected) {
          const elapsed = now - tiltStartTimeRef.current;
          const target = 1100;
          const pct = Math.min(100, Math.floor((elapsed / target) * 100));
          setTiltProgress(pct);

          if (pct >= 100) {
            // Left = ĐÚNG (true), Right = SAI (false)
            handleSelect(detected === 'left');
            lastTiltRef.current = null;
            setActiveTilt(null);
            setTiltProgress(0);
          }
        } else {
          lastTiltRef.current = detected;
          tiltStartTimeRef.current = now;
          setActiveTilt(detected);
          setTiltProgress(15);
        }
      } else {
        lastTiltRef.current = null;
        setActiveTilt(null);
        setTiltProgress(0);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [cameraActive, isMirror, isAnswered, isGameOver]);

  // Countdown timer
  useEffect(() => {
    if (isAnswered || isGameOver) return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isAnswered, isGameOver]);

  // Keyboard controls: Arrow Left (Đúng) / Arrow Right (Sai)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAnswered || isGameOver) return;
      if (e.key === 'ArrowLeft') handleSelect(true);
      if (e.key === 'ArrowRight') handleSelect(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAnswered, isGameOver]);

  const handleSelect = (userChoice: boolean) => {
    if (isAnswered || isGameOver || !currentQ) return;
    setSelectedAnswer(userChoice);
    setIsAnswered(true);

    const isCorrect = userChoice === currentQ.isTrue;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const handleTimeOut = () => {
    if (isAnswered || isGameOver) return;
    setIsAnswered(true);
    setSelectedAnswer(null);
    soundManager.playWrong();
    setStreak(0);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < trueFalseQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setActiveTilt(null);
      setTiltProgress(0);
    } else {
      setIsGameOver(true);
      soundManager.playVictory();
      const pct = Math.round((score / (trueFalseQuestions.length * 10)) * 100);
      if (pct >= 80) setShowCertificate(true);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[640px]">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              Nghiêng Người Chọn Đúng / Sai
            </h2>
            <p className="text-xs text-slate-400">
              Nghiêng sang <span className="text-emerald-400 font-bold">TRÁI = ĐÚNG</span>, nghiêng sang <span className="text-rose-400 font-bold">PHẢI = SAI</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              if (cameraActive) {
                stopCamera();
              } else {
                startCamera();
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              cameraActive
                ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/40'
                : 'bg-rose-600/30 border-rose-500/50 text-rose-300 hover:bg-rose-600/40'
            }`}
            title={cameraActive ? 'Tắt Camera' : 'Bật Camera'}
          >
            {cameraActive ? <Video className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{cameraActive ? 'Camera Bật' : 'Bật Camera'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMirror(prev => !prev)}
            className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
            title="Lật gương camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-1 rounded-xl bg-slate-700 font-mono text-sm font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
            {score} Điểm
          </div>
        </div>
      </div>

      {!isGameOver && currentQ ? (
        <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
          
          {/* Question Banner */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center shadow-lg">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/20 mb-3 inline-block">
              Câu {currentIndex + 1} / {trueFalseQuestions.length} · Lớp {currentQ.grade}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {currentQ.statement}
            </h3>
            {currentQ.formula && (
              <div className="text-2xl text-amber-300 font-mono my-3">
                <MathView math={currentQ.formula} displayMode={true} />
              </div>
            )}
          </div>

          {/* Non-Camera Mode Helper Banner */}
          {!cameraActive && (
            <div className="bg-indigo-950/80 border border-indigo-700/80 rounded-2xl p-3 text-xs text-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="space-y-0.5">
                <span className="flex items-center justify-center sm:justify-start gap-2 font-bold text-white">
                  💡 {isCameraLoading ? 'Đang kết nối Camera...' : 'Đang ở chế độ Bấm Chọn (Hoặc bấm Bật Camera)'}
                </span>
                <p className="text-[11px] text-indigo-200/90">
                  {cameraError || 'Bấm trực tiếp vào ô [ĐÚNG] hoặc [SAI], hoặc dùng phím mũi tên [←] [→] để trả lời!'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={isCameraLoading}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isCameraLoading ? 'Đang bật...' : 'Bật Camera'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionGuide(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hướng dẫn</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Split Camera Arena */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black aspect-video max-h-[380px] mx-auto w-full flex items-stretch">
            {/* Live Camera Background */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={(e) => {
                e.currentTarget.play().catch(() => {});
              }}
              className={`absolute inset-0 w-full h-full object-cover ${isMirror ? 'scale-x-[-1]' : ''}`}
            />

            {/* Left Zone: ĐÚNG (Tilt Left) */}
            <button
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(true)}
              className={`relative z-10 flex-1 border-r-2 border-dashed border-white/30 flex flex-col items-center justify-center p-4 transition-all ${
                activeTilt === 'left' && !isAnswered
                  ? 'bg-emerald-600/40 shadow-inner'
                  : 'bg-emerald-950/20 hover:bg-emerald-900/30'
              }`}
            >
              {activeTilt === 'left' && !isAnswered && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 transition-all duration-75"
                  style={{ height: `${tiltProgress}%` }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <BodyPoseIllustration pose="tilt_left" size={60} highlighted={activeTilt === 'left'} />
                <div className="px-5 py-2 rounded-2xl bg-emerald-600 text-white font-black text-xl tracking-wider shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>ĐÚNG</span>
                </div>
                <span className="text-xs text-emerald-200 font-medium">Nghiêng Người Trái [←]</span>
              </div>
            </button>

            {/* Right Zone: SAI (Tilt Right) */}
            <button
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(false)}
              className={`relative z-10 flex-1 flex flex-col items-center justify-center p-4 transition-all ${
                activeTilt === 'right' && !isAnswered
                  ? 'bg-rose-600/40 shadow-inner'
                  : 'bg-rose-950/20 hover:bg-rose-900/30'
              }`}
            >
              {activeTilt === 'right' && !isAnswered && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-rose-500/40 transition-all duration-75"
                  style={{ height: `${tiltProgress}%` }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <BodyPoseIllustration pose="tilt_right" size={60} highlighted={activeTilt === 'right'} />
                <div className="px-5 py-2 rounded-2xl bg-rose-600 text-white font-black text-xl tracking-wider shadow-lg flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  <span>SAI</span>
                </div>
                <span className="text-xs text-rose-200 font-medium">Nghiêng Người Phải [→]</span>
              </div>
            </button>

            {/* Center Dividing Laser Line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-yellow-400 shadow-[0_0_10px_#facc15] z-20 pointer-events-none" />
          </div>

          {/* Feedback & Next */}
          {isAnswered && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedAnswer === currentQ.isTrue ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedAnswer === currentQ.isTrue ? 'Chính xác!' : 'Sai rồi!'}
                  </h4>
                  <p className="text-xs text-slate-300">{currentQ.explanation}</p>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shrink-0"
              >
                Tiếp Theo
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over */
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <Award className="w-16 h-16 text-amber-400" />
          <h3 className="text-2xl font-bold text-white">Hoàn Thành Thử Thách!</h3>
          <p className="text-slate-300 text-sm">Điểm số: <strong className="text-amber-400">{score}</strong></p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsGameOver(false);
              setIsAnswered(false);
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
          >
            Chơi Lại
          </button>
        </div>
      )}

      {showCertificate && (
        <CertificateModal
          studentName={activeStudentName}
          className={activeClassName}
          classCode="20112002"
          score={score}
          totalQuestions={trueFalseQuestions.length}
          accuracy={Math.round((score / (trueFalseQuestions.length * 10)) * 100)}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <CameraPermissionGuideModal
        isOpen={showPermissionGuide}
        onClose={() => setShowPermissionGuide(false)}
        onRetryCamera={() => startCamera()}
      />
    </div>
  );
};
