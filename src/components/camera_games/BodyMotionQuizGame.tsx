import React, { useState, useEffect, useRef } from 'react';
import { BodyMotionQuestion, GradeLevel } from '../../types/math';
import { initialBodyMotionQuestions } from '../../data/bodyMotionQuestionsData';
import { BodyPoseIllustration, getPoseLabel } from './BodyPoseIllustrations';
import { MathView } from '../common/MathView';
import { CertificateModal } from '../certificate/CertificateModal';
import { soundManager } from '../../utils/sound';
import { CameraPermissionGuideModal } from '../common/CameraPermissionGuideModal';
import { useCameraStream } from '../../hooks/useCameraStream';
import { drawVideoFrame } from '../../utils/camera';
import { Language } from '../../i18n/translations';
import { getLocalizedBodyMotionQuestion } from '../../utils/localize';
import { 
  Camera, CameraOff, Video, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, Sparkles, Award, CheckCircle2, XCircle, Clock, Zap, 
  ArrowRight, Shield, AlertCircle, ChevronRight, Eye, RefreshCw, Lock, HelpCircle
} from 'lucide-react';

interface BodyMotionQuizGameProps {
  customQuestions?: BodyMotionQuestion[];
  activeStudentName?: string;
  activeClassName?: string;
  onExit?: () => void;
  language?: Language;
}

export const BodyMotionQuizGame: React.FC<BodyMotionQuizGameProps> = ({
  customQuestions,
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1',
  onExit,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [questionsList, setQuestionsList] = useState<BodyMotionQuestion[]>(() => {
    return customQuestions && customQuestions.length > 0 ? customQuestions : initialBodyMotionQuestions;
  });

  const filteredQuestions = questionsList.filter(q => selectedGrade === 'all' || q.grade === selectedGrade);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const rawQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentQ = rawQ ? getLocalizedBodyMotionQuestion(rawQ, language) : undefined;

  // Game state
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Timer per question (seconds)
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Camera & Motion Detection
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [motionDetectionEnabled, setMotionDetectionEnabled] = useState<boolean>(true);

  // Pose detection active state & hold progress
  const [detectedZone, setDetectedZone] = useState<number | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0); // 0 to 100%
  const holdZoneRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const lastFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  // Fullscreen container ref
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [showPermissionGuide, setShowPermissionGuide] = useState<boolean>(false);
  const [isSimulatedCamera, setIsSimulatedCamera] = useState<boolean>(false);

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
      setIsSimulatedCamera(false);
      lastFrameDataRef.current = null;
      soundManager.playCorrect();
    },
  });

  // Motion Detection Loop (Samples frame differences in 3 sensor zones)
  useEffect(() => {
    lastFrameDataRef.current = null;
    if (!cameraActive || isSimulatedCamera || !motionDetectionEnabled || isAnswered || isGameOver) {
      setDetectedZone(null);
      setHoldProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const video = videoElementRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || video.readyState < 2 || video.videoWidth === 0) return;

      const w = 160;
      const h = 120;
      canvas.width = w;
      canvas.height = h;

      // Draw current video frame matching the displayed mirror orientation
      drawVideoFrame(ctx, video, w, h, isMirror);
      const currentFrame = ctx.getImageData(0, 0, w, h).data;
      const prevFrame = lastFrameDataRef.current;

      if (!prevFrame) {
        lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);
        return;
      }

      // Zone 0: Top-Center (Both hands raised high overhead / Blue)
      // w: [w*0.3 to w*0.7], h: [0 to h*0.35]
      let motionZone0 = 0;
      // Zone 1: Top-Right (Right hand raised / Red in mirror view)
      // w: [w*0.65 to w], h: [0 to h*0.45]
      let motionZone1 = 0;
      // Zone 2: Top-Left (Left hand raised / Green in mirror view)
      // w: [0 to w*0.35], h: [0 to h*0.45]
      let motionZone2 = 0;

      for (let y = 0; y < Math.floor(h * 0.45); y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          // Calculate brightness delta
          const diff = Math.abs(currentFrame[idx] - prevFrame[idx]) +
                       Math.abs(currentFrame[idx + 1] - prevFrame[idx + 1]) +
                       Math.abs(currentFrame[idx + 2] - prevFrame[idx + 2]);

          if (diff > 50) {
            if (x >= w * 0.3 && x <= w * 0.7 && y < h * 0.35) {
              motionZone0++;
            } else if (x > w * 0.65) {
              motionZone1++;
            } else if (x < w * 0.35) {
              motionZone2++;
            }
          }
        }
      }

      lastFrameDataRef.current = new Uint8ClampedArray(currentFrame);

      // Thresholds to register an active motion pose
      const thresholdZone = 40;
      let activeZone: number | null = null;

      if (motionZone0 > thresholdZone && motionZone0 > motionZone1 && motionZone0 > motionZone2) {
        activeZone = 0; // Both hands up
      } else if (motionZone1 > thresholdZone && motionZone1 > motionZone2) {
        activeZone = 1; // Right hand
      } else if (motionZone2 > thresholdZone) {
        activeZone = 2; // Left hand
      }

      const now = Date.now();
      if (activeZone !== null && activeZone < (currentQ?.options?.length || 3)) {
        if (holdZoneRef.current === activeZone) {
          const elapsed = now - holdStartTimeRef.current;
          const targetHoldDuration = 1200; // 1.2s sustained hold to confirm
          const pct = Math.min(100, Math.floor((elapsed / targetHoldDuration) * 100));
          setHoldProgress(pct);

          if (pct >= 100) {
            handleSelectAnswer(activeZone);
            holdZoneRef.current = null;
            setDetectedZone(null);
            setHoldProgress(0);
          }
        } else {
          holdZoneRef.current = activeZone;
          holdStartTimeRef.current = now;
          setDetectedZone(activeZone);
          setHoldProgress(10);
        }
      } else {
        holdZoneRef.current = null;
        setDetectedZone(null);
        setHoldProgress(0);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [cameraActive, isSimulatedCamera, isMirror, motionDetectionEnabled, isAnswered, isGameOver, currentQ]);

  // Question countdown timer
  useEffect(() => {
    if (isAnswered || isGameOver || isTimerPaused) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isGameOver, isTimerPaused]);

  // Keyboard shortcut support: 1, 2, 3 or A, B, C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered || isGameOver) return;
      if (e.key === '1') handleSelectAnswer(0);
      if (e.key === '2') handleSelectAnswer(1);
      if (e.key === '3') handleSelectAnswer(2);
      if (e.key === '4') handleSelectAnswer(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isGameOver, currentQ]);

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswered || isGameOver || !currentQ) return;

    setSelectedAnswerIndex(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      const bonus = streak >= 2 ? 15 : 10;
      setScore(prev => prev + bonus);
      setStreak(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const handleTimeOut = () => {
    if (isAnswered || isGameOver) return;
    setIsAnswered(true);
    setSelectedAnswerIndex(-1); // Timed out
    soundManager.playWrong();
    setStreak(0);
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setTimeLeft(25);
      setDetectedZone(null);
      setHoldProgress(0);
    } else {
      setIsGameOver(true);
      soundManager.playVictory();
      const finalAccuracy = Math.round((score / (filteredQuestions.length * 10)) * 100);
      if (finalAccuracy >= 80) {
        setShowCertificate(true);
      }
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setTimeLeft(25);
    setShowCertificate(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[720px]'
      }`}
    >
      {/* Hidden processing canvas for motion tracking */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Strip - Projector Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Camera className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                {isEn ? 'Body Motion Math Quiz' : 'Đố Vui Vận Động Cơ Thể'}
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold border border-indigo-400/30">
                  Camera AI 📸
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              {isEn ? 'Stand before the camera and hold the pose matching the correct answer to score!' : 'Đứng trước Camera và thực hiện động tác tương ứng với đáp án đúng để ghi điểm!'}
            </p>
          </div>
        </div>

        {/* Action Controls & Grade Filter */}
        <div className="flex items-center gap-2.5">
          {/* Grade selection */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs">
            {(['all', 6, 7, 8, 9] as const).map(g => (
              <button
                key={g}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedGrade(g);
                  setCurrentIndex(0);
                  setIsAnswered(false);
                  setSelectedAnswerIndex(null);
                  setTimeLeft(25);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedGrade === g 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'all' ? (isEn ? 'All' : 'Tất Cả') : (isEn ? `Gr ${g}` : `Lớp ${g}`)}
              </button>
            ))}
          </div>

          {/* Camera toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (cameraActive) {
                stopCamera();
              } else {
                startCamera();
              }
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              cameraActive 
                ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/40' 
                : 'bg-rose-600/30 border-rose-500/50 text-rose-300 hover:bg-rose-600/40'
            }`}
            title={cameraActive ? (isEn ? 'Turn Off Camera' : 'Tắt Camera') : (isEn ? 'Turn On Camera' : 'Bật Camera')}
          >
            {cameraActive ? <Video className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{cameraActive ? (isEn ? 'Camera On' : 'Camera Bật') : (isEn ? 'Start Camera' : 'Bật Camera')}</span>
          </button>

          {/* Fullscreen Projector button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-colors"
            title={isEn ? 'Classroom Projector Fullscreen' : 'Chế độ Trình chiếu Máy chiếu lớp học'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Screen */}
      {!isGameOver && currentQ ? (
        <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ========================================================
              LEFT COLUMN (60%): QUESTION & COLORED ANSWER ROWS
              Exactly matches the user's classroom picture!
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Question Header Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-400/20">
                    {isEn ? `Question ${currentIndex + 1} / ${filteredQuestions.length}` : `Câu ${currentIndex + 1} / ${filteredQuestions.length}`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-700/60 text-slate-300 text-xs font-semibold">
                    {isEn ? `Grade ${currentQ.grade}` : `Lớp ${currentQ.grade}`} · {currentQ.topicName}
                  </span>
                </div>

                {/* Question countdown timer badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-extrabold text-sm border ${
                  timeLeft <= 5 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
                    : 'bg-slate-700/50 border-slate-600 text-slate-200'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Main Question Text (Vietnamese) */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
                {currentQ.questionText}
              </h3>

              {/* Optional MathType formula */}
              {currentQ.formula && (
                <div className="mt-4 p-3 bg-slate-900/60 border border-slate-700/50 rounded-xl flex items-center justify-center text-xl text-amber-300">
                  <MathView math={currentQ.formula} displayMode={true} />
                </div>
              )}
            </div>

            {/* Answer Options Bars (Colored Rows: Blue, Red, Green like in photo) */}
            <div className="space-y-3.5 flex-1 flex flex-col justify-center">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const isDetectedByCamera = detectedZone === idx;

                // Color mappings matching the user's classroom picture
                let rowBg = '';
                if (isAnswered) {
                  if (isCorrect) {
                    rowBg = 'bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-xl';
                  } else if (isSelected) {
                    rowBg = 'bg-rose-600 text-white line-through opacity-80';
                  } else {
                    rowBg = 'bg-slate-800/60 text-slate-400 opacity-50';
                  }
                } else {
                  // Active interactive state based on option's designated color
                  if (option.color === 'blue') {
                    rowBg = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
                  } else if (option.color === 'red') {
                    rowBg = 'bg-rose-600 hover:bg-rose-700 text-white shadow-md';
                  } else if (option.color === 'green') {
                    rowBg = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md';
                  } else {
                    rowBg = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`relative w-full rounded-2xl p-4 sm:p-5 text-left transition-all duration-150 flex items-center justify-between gap-4 border-2 border-white/10 group cursor-pointer ${rowBg} ${
                      isDetectedByCamera && !isAnswered ? 'ring-4 ring-yellow-400 scale-[1.01]' : ''
                    }`}
                  >
                    {/* Sustained Hold Pose Progress Bar for this option */}
                    {isDetectedByCamera && !isAnswered && (
                      <div 
                        className="absolute inset-0 bg-yellow-400/30 rounded-2xl transition-all duration-75"
                        style={{ width: `${holdProgress}%` }}
                      />
                    )}

                    {/* Left: Chibi Student Pose Avatar */}
                    <div className="flex items-center gap-3.5 z-10 shrink-0">
                      <div className="bg-white/20 p-1.5 rounded-2xl backdrop-blur-xs border border-white/30 flex items-center justify-center">
                        <BodyPoseIllustration 
                          pose={option.pose} 
                          size={54} 
                          highlighted={isDetectedByCamera || isSelected} 
                        />
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-white/80 block">
                          {isEn ? `Pose #${idx + 1}` : `Động tác #${idx + 1}`}
                        </span>
                        <span className="text-xs font-bold text-white drop-shadow-xs">
                          {option.poseLabel}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Math Value / Answer Text */}
                    <div className="flex-1 text-center font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-wide font-mono z-10 drop-shadow-md">
                      {option.formula ? (
                        <MathView math={option.formula} />
                      ) : (
                        <span>{option.text}</span>
                      )}
                    </div>

                    {/* Right: Pose / Key Shortcut Badge */}
                    <div className="z-10 shrink-0 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-black/25 flex items-center justify-center font-mono font-bold text-xs text-white/90 border border-white/20">
                        [{idx + 1}]
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Feedback & Next Button */}
            {isAnswered && (
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  {selectedAnswerIndex === currentQ.correctIndex ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {selectedAnswerIndex === currentQ.correctIndex 
                        ? (isEn ? '🎉 Correct! Awesome Pose!' : '🎉 Chính xác! Động tác chuẩn tuyệt đối!') 
                        : (isEn ? '💡 Not quite right!' : '💡 Chưa chính xác rồi!')}
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
                >
                  <span>{currentIndex + 1 < filteredQuestions.length ? (isEn ? 'Next Question' : 'Câu Tiếp Theo') : (isEn ? 'View Results' : 'Xem Kết Quả')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN (40%): LIVE CAMERA WEBCAM & POSE DETECTOR
              Directly mirrors the webcam view in the user's photo!
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Live Camera Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl aspect-[4/3] flex items-center justify-center group">
              
              {/* WebRTC Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => {
                  e.currentTarget.play().catch(() => {});
                }}
                className={`w-full h-full object-cover transition-transform ${
                  isMirror ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* If Camera is not active / permissions denied */}
              {!cameraActive && !isSimulatedCamera && (
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3.5 z-20 overflow-y-auto">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-md">
                    <CameraOff className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {isCameraLoading
                        ? (isEn ? 'Connecting Camera...' : 'Đang Kết Nối Camera...')
                        : (isEn ? 'Classroom Camera Not Active' : 'Chưa Bật Được Camera Lớp Học')}
                    </h4>
                    <p className="text-xs text-slate-300 max-w-sm mt-1 leading-relaxed">
                      {cameraError || (isEn ? 'The browser needs webcam permission to detect students’ body gestures.' : 'Trình duyệt cần quyền truy cập Camera để nhận diện cử chỉ của học sinh đứng trước lớp.')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      onClick={() => startCamera()}
                      disabled={isCameraLoading}
                      className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>{isCameraLoading ? (isEn ? 'Starting...' : 'Đang bật...') : (isEn ? 'Allow & Start Camera' : 'Cấp Quyền & Bật Camera Ngay')}</span>
                    </button>

                    <button
                      onClick={() => setShowPermissionGuide(true)}
                      className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isEn ? 'Permission Guide' : 'Hướng Dẫn Mở Quyền'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playCorrect();
                      stopCamera();
                      setIsSimulatedCamera(true);
                    }}
                    className="text-[11px] text-indigo-300 hover:text-indigo-200 underline font-semibold transition-colors"
                  >
                    {isEn ? 'Use Simulated Camera Mode if no webcam available →' : 'Bật chế độ Camera Mô Phỏng nếu thiết bị không có webcam vật lý →'}
                  </button>
                </div>
              )}

              {/* Simulated Camera Overlay when playing without physical webcam */}
              {!cameraActive && isSimulatedCamera && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 flex items-center justify-center text-indigo-300 animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                      {isEn ? 'Simulated AI Camera' : 'Camera Mô Phỏng AI'}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-2">
                      {isEn ? 'Playing Without Physical Webcam' : 'Đang Chơi Không Cần Webcam Vật Lý'}
                    </h4>
                    <p className="text-xs text-slate-300 max-w-xs mt-1">
                      {isEn ? 'Click answer bars on the left, simulation buttons below, or press keys [1], [2], [3].' : 'Bấm trực tiếp vào các thanh đáp án bên trái, nút Mô phỏng bên dưới hoặc nhấn phím [1], [2], [3].'}
                    </p>
                  </div>
                  <button
                    onClick={() => startCamera()}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Try Real Camera' : 'Thử Bật Camera Thật'}</span>
                  </button>
                </div>
              )}

              {/* Dynamic Camera Overlays & Visual Sensors */}
              {cameraActive && (
                <>
                  {/* Top-Center Sensor: Both Hands Up Zone */}
                  <div className={`absolute top-2 left-1/4 right-1/4 h-24 border-2 rounded-xl transition-all flex flex-col items-center justify-start p-1.5 ${
                    detectedZone === 0 
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                      : 'border-blue-400/50 bg-blue-500/10'
                  }`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-blue-600/80 px-2 py-0.5 rounded text-white">
                      🙆‍♂️ {isEn ? 'Zone 1: Both Hands' : 'Vùng 1: Hai tay giơ cao'}
                    </span>
                    {detectedZone === 0 && (
                      <span className="text-xs font-bold text-yellow-300 mt-1 animate-bounce">
                        {isEn ? `Detecting: ${holdProgress}%` : `Đang nhận diện: ${holdProgress}%`}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Sensor: Right Hand Up Zone */}
                  <div className={`absolute top-2 right-2 w-1/4 h-28 border-2 rounded-xl transition-all flex flex-col items-center justify-start p-1 ${
                    detectedZone === 1 
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                      : 'border-rose-400/50 bg-rose-500/10'
                  }`}>
                    <span className="text-[9px] font-extrabold uppercase tracking-tight bg-rose-600/80 px-1.5 py-0.5 rounded text-white text-center">
                      🙋‍♀️ {isEn ? 'Zone 2: Right' : 'Vùng 2: Tay phải'}
                    </span>
                    {detectedZone === 1 && (
                      <span className="text-[11px] font-bold text-yellow-300 mt-1 animate-bounce">
                        {holdProgress}%
                      </span>
                    )}
                  </div>

                  {/* Top-Left Sensor: Left Hand Up Zone */}
                  <div className={`absolute top-2 left-2 w-1/4 h-28 border-2 rounded-xl transition-all flex flex-col items-center justify-start p-1 ${
                    detectedZone === 2 
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.5)]' 
                      : 'border-emerald-400/50 bg-emerald-500/10'
                  }`}>
                    <span className="text-[9px] font-extrabold uppercase tracking-tight bg-emerald-600/80 px-1.5 py-0.5 rounded text-white text-center">
                      🙋‍♂️ {isEn ? 'Zone 3: Left' : 'Vùng 3: Tay trái'}
                    </span>
                    {detectedZone === 2 && (
                      <span className="text-[11px] font-bold text-yellow-300 mt-1 animate-bounce">
                        {holdProgress}%
                      </span>
                    )}
                  </div>

                  {/* Live Status Tag */}
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live Cam ({isMirror ? (isEn ? 'Mirrored' : 'Gương soi') : (isEn ? 'Standard' : 'Chuẩn')})</span>
                  </div>

                  {/* Camera flip toggle */}
                  <button
                    onClick={() => setIsMirror(prev => !prev)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold flex items-center gap-1 border border-white/10"
                    title={isEn ? 'Flip camera mirror' : 'Lật gương camera'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Flip' : 'Lật'}</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Pose Trigger Buttons (For Classroom Testing or Remote Teacher Control) */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {isEn ? 'Simulate Pose (Click directly):' : 'Mô phỏng động tác (Click trực tiếp):'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isEn ? 'Keys [1], [2], [3]' : 'Phím [1], [2], [3]'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(i)}
                    className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-600 flex flex-col items-center justify-center gap-1 active:scale-95"
                  >
                    <BodyPoseIllustration pose={opt.pose} size={32} />
                    <span className="text-[10px] text-slate-300 truncate w-full text-center">
                      {isEn ? `Pose #${i + 1}` : `Động tác #${i + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Score & Streak Scoreboard */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {isEn ? 'Total Score' : 'Điểm Tích Lũy'}
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {score}
                </span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {isEn ? 'Win Streak' : 'Chuỗi Đúng Liên Tiếp'}
                </span>
                <div className="flex items-center justify-center gap-1">
                  <Zap className={`w-5 h-5 ${streak >= 2 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                  <span className="text-2xl font-black text-white font-mono">
                    {streak}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Game Over Summary Screen */
        <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              {isEn ? 'Body Motion Challenge Complete' : 'Hoàn Thành Phần Thi Vận Động'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {isEn ? `Awesome Job, ${activeStudentName}!` : `Xuất Sắc, ${activeStudentName}!`}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isEn ? 'Class' : 'Học sinh lớp'} <span className="text-indigo-400 font-bold">{activeClassName}</span> · {isEn ? 'Math Teacher: Ms. Diem Quynh' : 'Giáo viên bộ môn: Cô Diễm Quỳnh'}
            </p>
          </div>

          {/* Stats breakdown */}
          <div className="grid grid-cols-3 gap-3 w-full bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <div>
              <span className="text-xs text-slate-400 block">{isEn ? 'Score' : 'Tổng Điểm'}</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">{isEn ? 'Accuracy' : 'Độ Chính Xác'}</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {Math.round((score / (filteredQuestions.length * 10)) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">{isEn ? 'Questions' : 'Câu Hỏi'}</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{filteredQuestions.length}</span>
            </div>
          </div>

          {/* Certificate button if >= 80% */}
          {Math.round((score / (filteredQuestions.length * 10)) * 100) >= 80 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Award className="w-5 h-5" />
              <span>{isEn ? 'View & Print Honor Certificate' : 'Xem & In Giấy Khen Danh Dự Cô Diễm Quỳnh'}</span>
            </button>
          )}

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Play Again' : 'Chơi Lại Vòng Này'}</span>
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors border border-slate-700"
              >
                {isEn ? 'Back' : 'Trở Về'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          studentName={activeStudentName}
          className={activeClassName}
          classCode="20112002"
          score={score}
          totalQuestions={filteredQuestions.length}
          accuracy={Math.round((score / (filteredQuestions.length * 10)) * 100)}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Camera Permission Guide Modal */}
      <CameraPermissionGuideModal
        isOpen={showPermissionGuide}
        onClose={() => setShowPermissionGuide(false)}
        onRetryCamera={() => startCamera()}
        onUseSimulatedMode={() => {
          stopCamera();
          setIsSimulatedCamera(true);
        }}
      />
    </div>
  );
};
