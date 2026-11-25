import React, { useState, useEffect, useRef } from 'react';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import { CertificateModal } from '../certificate/CertificateModal';
import { useCameraStream } from '../../hooks/useCameraStream';
import { CameraPermissionGuideModal } from '../common/CameraPermissionGuideModal';
import { Language } from '../../i18n/translations';
import { 
  Camera, CameraOff, Video, Sparkles, Award, RotateCcw, Clock, 
  Zap, Heart, Target, RefreshCw, Lock
} from 'lucide-react';

interface Bubble {
  id: number;
  x: number; // percentage 10% to 80%
  y: number; // percentage 15% to 75%
  value: string;
  isCorrect: boolean;
  color: string;
}

interface CatchMathQuestion {
  question: string;
  questionEn: string;
  targetAnswer: string;
  wrongAnswers: string[];
}

const catchQuestions: CatchMathQuestion[] = [
  { question: '7 × 8 = ?', questionEn: '7 × 8 = ?', targetAnswer: '56', wrongAnswers: ['54', '64'] },
  { question: '(-15) + 23 = ?', questionEn: '(-15) + 23 = ?', targetAnswer: '8', wrongAnswers: ['-8', '38'] },
  { question: '√144 = ?', questionEn: '√144 = ?', targetAnswer: '12', wrongAnswers: ['14', '24'] },
  { question: '2³ × 3 = ?', questionEn: '2³ × 3 = ?', targetAnswer: '24', wrongAnswers: ['18', '36'] },
  { question: '(-5)² = ?', questionEn: '(-5)² = ?', targetAnswer: '25', wrongAnswers: ['-25', '10'] },
  { question: 'ƯCLN(18; 24) = ?', questionEn: 'GCD(18, 24) = ?', targetAnswer: '6', wrongAnswers: ['3', '12'] },
  { question: 'x + 15 = 40 ⇒ x = ?', questionEn: 'x + 15 = 40 ⇒ x = ?', targetAnswer: '25', wrongAnswers: ['35', '55'] },
  { question: '3² + 4² = ?', questionEn: '3² + 4² = ?', targetAnswer: '25', wrongAnswers: ['14', '49'] },
  { question: 'BCNN(4; 6) = ?', questionEn: 'LCM(4, 6) = ?', targetAnswer: '12', wrongAnswers: ['24', '8'] },
  { question: 'cos(60°) = ?', questionEn: 'cos(60°) = ?', targetAnswer: '0.5', wrongAnswers: ['1', '0.8'] }
];

const bubbleColors = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600'
];

interface CameraCatchMathGameProps {
  activeStudentName?: string;
  activeClassName?: string;
  onExit?: () => void;
  language?: Language;
}

export const CameraCatchMathGame: React.FC<CameraCatchMathGameProps> = ({
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1',
  onExit,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [qIndex, setQIndex] = useState<number>(0);
  const currentQ = catchQuestions[qIndex];

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isPopping, setIsPopping] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Camera
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [showPermissionGuide, setShowPermissionGuide] = useState<boolean>(false);
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
    height: 480,
    facingMode: 'user',
    onStarted: () => {
      lastFrameDataRef.current = null;
    },
  });

  // Spawn bubbles when question changes
  useEffect(() => {
    if (!currentQ || isGameOver) return;
    const allAnswers = [
      { val: currentQ.targetAnswer, isCorrect: true },
      ...currentQ.wrongAnswers.map(w => ({ val: w, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    const positions = [
      { x: 18, y: 30 },
      { x: 50, y: 22 },
      { x: 82, y: 35 }
    ].sort(() => Math.random() - 0.5);

    const newBubbles: Bubble[] = allAnswers.map((ans, i) => ({
      id: Date.now() + i,
      x: positions[i]?.x || 20 + i * 30,
      y: positions[i]?.y || 30,
      value: ans.val,
      isCorrect: ans.isCorrect,
      color: bubbleColors[i % bubbleColors.length]
    }));

    setBubbles(newBubbles);
  }, [qIndex, isGameOver]);

  // Motion Detection for Bubble Touch
  useEffect(() => {
    if (!cameraActive || isGameOver || bubbles.length === 0) {
      lastFrameDataRef.current = null;
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

      ctx.drawImage(video, 0, 0, w, h);
      const currentFrame = ctx.getImageData(0, 0, w, h).data;
      const prevFrame = lastFrameDataRef.current;

      if (!prevFrame) {
        lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);
        return;
      }

      // Check motion at each bubble's relative position
      bubbles.forEach(b => {
        // x in mirror mode
        const targetX = isMirror ? (100 - b.x) : b.x;
        const normX = Math.floor((targetX / 100) * w);
        const normY = Math.floor((b.y / 100) * h);
        const radius = 12;

        let motionCount = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const px = normX + dx;
            const py = normY + dy;
            if (px >= 0 && px < w && py >= 0 && py < h) {
              const idx = (py * w + px) * 4;
              const diff = Math.abs(currentFrame[idx] - prevFrame[idx]) +
                           Math.abs(currentFrame[idx + 1] - prevFrame[idx + 1]) +
                           Math.abs(currentFrame[idx + 2] - prevFrame[idx + 2]);
              if (diff > 55) motionCount++;
            }
          }
        }

        // Hit registered by hand or head wave!
        if (motionCount > 25) {
          handlePopBubble(b);
        }
      });

      lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);
    }, 80);

    return () => clearInterval(interval);
  }, [cameraActive, isGameOver, bubbles, isMirror]);

  // Game timer (60s total)
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundManager.playVictory();
      if (score >= 50) setShowCertificate(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, score]);

  const handlePopBubble = (bubble: Bubble) => {
    if (isPopping !== null) return;
    setIsPopping(bubble.id);

    if (bubble.isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 15);
      setStreak(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setTimeout(() => {
      setIsPopping(null);
      if (qIndex + 1 < catchQuestions.length) {
        setQIndex(prev => prev + 1);
      } else {
        setIsGameOver(true);
        soundManager.playVictory();
        if (score >= 50) setShowCertificate(true);
      }
    }, 400);
  };

  return (
    <div 
      ref={containerRef}
      className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[640px]"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {isEn ? 'Catch Math Bubbles (Hand & Head)' : 'Hứng Bóng Toán Học Bằng Tay & Đầu'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEn ? 'Wave your hand or touch the bubble with the right answer on screen!' : 'Vẫy tay hoặc chạm đầu vào quả bóng mang đáp số đúng trên màn hình!'}
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
            title={cameraActive ? (isEn ? 'Turn Off Camera' : 'Tắt Camera') : (isEn ? 'Turn On Camera' : 'Bật Camera')}
          >
            {cameraActive ? <Video className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{cameraActive ? (isEn ? 'Camera On' : 'Camera Bật') : (isEn ? 'Start Camera' : 'Bật Camera')}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMirror(prev => !prev)}
            className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
            title={isEn ? 'Flip mirror' : 'Lật gương camera'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-1 rounded-xl bg-slate-700 font-mono text-sm font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
            {score} {isEn ? 'Pts' : 'Điểm'}
          </div>
        </div>
      </div>

      {!isGameOver && currentQ ? (
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-4">
          
          {/* Top Target Question Bar */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center shadow-lg max-w-xl mx-auto w-full">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              {isEn ? `Question ${qIndex + 1} / ${catchQuestions.length} · Tap the answer:` : `Câu ${qIndex + 1} / ${catchQuestions.length} · Chạm vào đáp án:`}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              <MathView math={isEn ? currentQ.questionEn : currentQ.question} />
            </div>
          </div>

          {/* Full Camera Screen with Floating Bubbles */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black aspect-video max-h-[460px] mx-auto w-full flex items-center justify-center">
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

            {!cameraActive && (
              <div className="absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center p-6 text-center z-10 space-y-2.5">
                <CameraOff className="w-10 h-10 text-slate-400" />
                <p className="text-xs text-slate-200 max-w-sm leading-relaxed">
                  {isCameraLoading
                    ? (isEn ? 'Connecting Camera...' : 'Đang kết nối Camera...')
                    : cameraError || (isEn ? 'Enable your Camera to wave at bubbles, or click the bubbles directly!' : 'Bạn có thể bật Camera để vẫy tay chạm bóng hoặc bấm trực tiếp vào các quả bóng.')}
                </p>
                {!isCameraLoading && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Start Camera' : 'Bật Camera'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPermissionGuide(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? 'Guide' : 'Hướng dẫn'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Floating Answer Bubbles on Camera */}
            {bubbles.map((b) => {
              const isBeingPopped = isPopping === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handlePopBubble(b)}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${b.color} text-white font-black text-xl sm:text-2xl font-mono shadow-2xl border-4 border-white flex flex-col items-center justify-center transition-all cursor-pointer animate-pulse hover:scale-110 active:scale-95 ${
                    isBeingPopped ? 'scale-150 opacity-0 duration-300' : ''
                  }`}
                >
                  <span className="drop-shadow-md">{b.value}</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-tight text-white/80">
                    {isEn ? 'Tap me!' : 'Chạm tôi!'}
                  </span>
                </button>
              );
            })}

            {/* Live Indicator */}
            <div className="absolute bottom-3 left-3 z-20 px-2 py-1 rounded-md bg-black/50 text-[10px] text-emerald-300 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isEn ? 'Interactive Bubble Camera' : 'Camera Bong Bóng Tương Tác'}</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            {isEn ? 'Tip: Step back ~1.5m so the camera captures both hands clearly!' : 'Mẹo: Đứng lùi lại khoảng 1.5m để camera bắt trọn chuyển động của hai tay và đầu!'}
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <Award className="w-16 h-16 text-amber-400" />
          <h3 className="text-2xl font-bold text-white">{isEn ? 'Game Complete!' : 'Hoàn Thành Trò Chơi!'}</h3>
          <p className="text-slate-300 text-sm">{isEn ? 'Score:' : 'Điểm số:'} <strong className="text-amber-400 font-mono text-lg">{score}</strong></p>
          <button
            onClick={() => {
              setQIndex(0);
              setScore(0);
              setTimeLeft(60);
              setIsGameOver(false);
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
          >
            {isEn ? 'Play Again' : 'Chơi Lại'}
          </button>
        </div>
      )}

      {showCertificate && (
        <CertificateModal
          studentName={activeStudentName}
          className={activeClassName}
          classCode="20112002"
          score={score}
          totalQuestions={catchQuestions.length}
          accuracy={100}
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
