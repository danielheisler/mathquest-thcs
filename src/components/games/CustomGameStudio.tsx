import React, { useState, useEffect } from 'react';
import { Question, GradeLevel, CustomGameType, CustomGameItem } from '../../types/math';
import { MathView } from '../common/MathView';
import { CertificateModal } from '../certificate/CertificateModal';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { 
  Sparkles, Plus, Play, Trash2, Edit3, CheckCircle2, Clock, 
  Award, RotateCcw, ArrowRight, Zap, Target, KeyRound, Camera, Download
} from 'lucide-react';

const defaultCustomGames: CustomGameItem[] = [
  {
    id: 'cg-1',
    title: 'Đại Chiến Thừa Số & Số Nguyên Tố',
    type: 'speed_math',
    grade: 6,
    description: 'Trò chơi tìm nhanh thừa số nguyên tố và dấu hiệu chia hết trong 60 giây',
    createdAt: '25/10/2026',
    authorName: 'Cô Diễm Quỳnh',
    questionsCount: 4,
    timeLimitSec: 20,
    questions: [
      {
        id: 'cg-q1',
        grade: 6,
        topic: 'arithmetic',
        topicName: 'Số nguyên tố',
        difficulty: 'easy',
        questionText: 'Số nguyên tố nhỏ nhất là số nào?',
        options: ['0', '1', '2', '3'],
        correctAnswerIndex: 2,
        explanation: 'Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất.'
      },
      {
        id: 'cg-q2',
        grade: 6,
        topic: 'arithmetic',
        topicName: 'Dấu hiệu chia hết',
        difficulty: 'medium',
        questionText: 'Tổng nào sau đây chia hết cho 9?',
        formula: '126 + 360 + 81',
        options: ['126 + 360 + 81', '125 + 360', '120 + 99', '200 + 18'],
        correctAnswerIndex: 0,
        explanation: '126 (tổng các chữ số = 9), 360 (= 9), 81 (= 9) đều chia hết cho 9 nên tổng chia hết cho 9.'
      },
      {
        id: 'cg-q3',
        grade: 6,
        topic: 'arithmetic',
        topicName: 'Ước và bội',
        difficulty: 'easy',
        questionText: 'ƯCLN(12, 18) bằng bao nhiêu?',
        options: ['3', '6', '12', '36'],
        correctAnswerIndex: 1,
        explanation: 'Ư(12) = {1,2,3,4,6,12}, Ư(18) = {1,2,3,6,9,18} => ƯCLN là 6.'
      },
      {
        id: 'cg-q4',
        grade: 6,
        topic: 'arithmetic',
        topicName: 'Số nguyên',
        difficulty: 'medium',
        questionText: 'Kết quả của phép tính (-8) × (-5) là:',
        options: ['-40', '40', '-13', '13'],
        correctAnswerIndex: 1,
        explanation: 'Tích hai số nguyên cùng dấu luôn là một số nguyên dương: (-8) × (-5) = 40.'
      }
    ]
  },
  {
    id: 'cg-2',
    title: 'Giải Mã 7 Hằng Đẳng Thức Đại Số',
    type: 'escape_room',
    grade: 8,
    description: 'Thử thách chọn công thức khai triển hằng đẳng thức đáng nhớ chính xác',
    createdAt: '25/10/2026',
    authorName: 'Cô Diễm Quỳnh',
    questionsCount: 3,
    timeLimitSec: 25,
    questions: [
      {
        id: 'cg-hdt-1',
        grade: 8,
        topic: 'algebra',
        topicName: 'Hằng đẳng thức',
        difficulty: 'easy',
        questionText: 'Khai triển của (x + 3)² là:',
        options: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', 'x² - 6x + 9'],
        correctAnswerIndex: 1,
        explanation: '(x + 3)² = x² + 2×x×3 + 3² = x² + 6x + 9.'
      },
      {
        id: 'cg-hdt-2',
        grade: 8,
        topic: 'algebra',
        topicName: 'Hằng đẳng thức',
        difficulty: 'medium',
        questionText: 'Biểu thức 4x² - 25 viết dưới dạng tích là:',
        options: ['(2x - 5)(2x + 5)', '(4x - 5)(4x + 5)', '(2x - 5)²', '(2x + 5)²'],
        correctAnswerIndex: 0,
        explanation: '4x² - 25 = (2x)² - 5² = (2x - 5)(2x + 5).'
      },
      {
        id: 'cg-hdt-3',
        grade: 8,
        topic: 'algebra',
        topicName: 'Hằng đẳng thức',
        difficulty: 'hard',
        questionText: 'Khai triển của (a - b)³ là:',
        options: [
          'a³ - 3a²b + 3ab² - b³',
          'a³ - b³',
          'a³ + 3a²b + 3ab² + b³',
          'a³ - 3a²b - 3ab² - b³'
        ],
        correctAnswerIndex: 0,
        explanation: '(a - b)³ = a³ - 3a²b + 3ab² - b³.'
      }
    ]
  }
];

interface CustomGameStudioProps {
  activeStudentName?: string;
  activeClassName?: string;
  language?: Language;
}

export const CustomGameStudio: React.FC<CustomGameStudioProps> = ({
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1',
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [customGames, setCustomGames] = useState<CustomGameItem[]>(() => {
    const saved = localStorage.getItem('mathquest_custom_games');
    return saved ? JSON.parse(saved) : defaultCustomGames;
  });

  const [isCreatingModal, setIsCreatingModal] = useState<boolean>(false);
  const [playingGame, setPlayingGame] = useState<CustomGameItem | null>(null);

  // Playing state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // New Game Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<CustomGameType>('speed_math');
  const [newGrade, setNewGrade] = useState<GradeLevel>(6);
  const [newDesc, setNewDesc] = useState<string>('');
  const [newTimeLimit, setNewTimeLimit] = useState<number>(25);

  // Questions in builder
  const [formQuestions, setFormQuestions] = useState<{
    text: string;
    formula?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[]>([
    {
      text: 'Tính giá trị của biểu thức sau:',
      formula: '15 + 25 \\times 2',
      options: ['80', '65', '50', '55'],
      correctIndex: 1,
      explanation: 'Thực hiện nhân trước: 25 × 2 = 50, sau đó 15 + 50 = 65.'
    }
  ]);

  const saveGamesToStorage = (games: CustomGameItem[]) => {
    setCustomGames(games);
    localStorage.setItem('mathquest_custom_games', JSON.stringify(games));
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const game: CustomGameItem = {
      id: `cg-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      grade: newGrade,
      description: newDesc.trim() || 'Trò chơi toán học theo yêu cầu',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      authorName: 'Cô Diễm Quỳnh',
      questionsCount: formQuestions.length,
      timeLimitSec: newTimeLimit,
      questions: formQuestions.map((q, i) => ({
        id: `q-${Date.now()}-${i}`,
        grade: newGrade,
        topic: 'arithmetic',
        topicName: 'Tự biên soạn',
        difficulty: 'medium',
        questionText: q.text,
        formula: q.formula || undefined,
        options: q.options,
        correctAnswerIndex: q.correctIndex,
        explanation: q.explanation || 'Đáp án đúng.'
      }))
    };

    const nextGames = [game, ...customGames];
    saveGamesToStorage(nextGames);
    soundManager.playCorrect();
    setIsCreatingModal(false);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteGame = (gameId: string) => {
    soundManager.playClick();
    const nextGames = customGames.filter(g => g.id !== gameId);
    saveGamesToStorage(nextGames);
  };

  // Launch Game
  const handleStartGame = (game: CustomGameItem) => {
    soundManager.playClick();
    setPlayingGame(game);
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(game.timeLimitSec);
    setIsGameOver(false);
    setShowCertificate(false);
  };

  // Playing timer
  useEffect(() => {
    if (!playingGame || isAnswered || isGameOver) return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isAnswered, isGameOver, playingGame]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isGameOver || !playingGame) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const curQ = playingGame.questions[currentQIndex];
    if (idx === curQ.correctAnswerIndex) {
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
    setSelectedAnswer(-1);
    soundManager.playWrong();
    setStreak(0);
  };

  const handleNextQ = () => {
    soundManager.playClick();
    if (!playingGame) return;
    if (currentQIndex + 1 < playingGame.questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(playingGame.timeLimitSec);
    } else {
      setIsGameOver(true);
      soundManager.playVictory();
      const pct = Math.round((score / (playingGame.questions.length * 10)) * 100);
      if (pct >= 80) setShowCertificate(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isEn ? 'Custom Math Game Studio' : 'Studio Sáng Tạo Trò Chơi Toán Học Theo Yêu Cầu'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isEn ? 'Design & Play Custom Math Games' : 'Tự Thiết Kế & Chơi Trò Chơi Toán Học Theo Ý Muốn'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              {isEn
                ? 'Teachers and students can author custom questions with MathType KaTeX formulas, pick timers and game modes, and play live!'
                : 'Giáo viên và học sinh có thể tự đặt câu hỏi, chèn công thức MathType KaTeX, quy định thời gian, chọn thể loại trò chơi (Camera vận động, Đua tốc độ, Mật mã vượt ngục) và lưu chơi trực tiếp!'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsCreatingModal(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'Create New Game Now' : 'Tạo Trò Chơi Mới Ngay'}</span>
          </button>
        </div>
      </div>

      {/* Play Active Game Screen if playing */}
      {playingGame && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                  {playingGame.title}
                </span>
                <span className="text-xs text-slate-400">Lớp {playingGame.grade}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Câu {currentQIndex + 1} / {playingGame.questions.length}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-xl bg-slate-800 font-mono text-sm font-bold flex items-center gap-1.5 border border-slate-700">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{timeLeft}s</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
                {score} Điểm
              </div>
              <button
                onClick={() => setPlayingGame(null)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                Thoát
              </button>
            </div>
          </div>

          {!isGameOver ? (
            <div className="space-y-6">
              {/* Question Text */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center">
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {playingGame.questions[currentQIndex]?.questionText}
                </h4>
                {playingGame.questions[currentQIndex]?.formula && (
                  <div className="text-2xl text-amber-300 font-mono my-3">
                    <MathView math={playingGame.questions[currentQIndex].formula!} displayMode={true} />
                  </div>
                )}
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {playingGame.questions[currentQIndex]?.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === playingGame.questions[currentQIndex].correctAnswerIndex;

                  let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
                  if (isAnswered) {
                    if (isCorrect) btnStyle = 'bg-emerald-600 text-white border-emerald-500 ring-4 ring-emerald-300';
                    else if (isSelected) btnStyle = 'bg-rose-600 text-white border-rose-500';
                    else btnStyle = 'bg-slate-800/50 text-slate-500 border-slate-800';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all font-bold text-base flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and next button */}
              {isAnswered && (
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    <strong className="text-white block mb-0.5">
                      {selectedAnswer === playingGame.questions[currentQIndex].correctAnswerIndex ? '🎉 Chính xác!' : '💡 Lời giải thích:'}
                    </strong>
                    {playingGame.questions[currentQIndex].explanation}
                  </div>
                  <button
                    onClick={handleNextQ}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md"
                  >
                    <span>{currentQIndex + 1 < playingGame.questions.length ? 'Câu Tiếp Theo' : 'Tổng Kết'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Award className="w-16 h-16 text-amber-400 mx-auto" />
              <h4 className="text-2xl font-extrabold text-white">Hoàn Thành Trò Chơi!</h4>
              <p className="text-slate-300 text-sm">Điểm số đạt được: <strong className="text-amber-400 font-mono">{score}</strong></p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleStartGame(playingGame)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs"
                >
                  Chơi Lại
                </button>
                <button
                  onClick={() => setPlayingGame(null)}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List of Custom Games Created */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                  Lớp {game.grade} · {game.questionsCount} câu hỏi
                </span>
                <button
                  onClick={() => handleDeleteGame(game.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                  title="Xóa trò chơi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
                {game.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {game.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {game.timeLimitSec}s / câu · {game.authorName}
              </span>
              <button
                onClick={() => handleStartGame(game)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Chơi Ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Game */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Tạo Trò Chơi Toán Học Mới Theo Yêu Cầu
                </h3>
                <p className="text-xs text-slate-500">
                  Soạn câu hỏi, công thức và cấu hình luật chơi riêng cho lớp học
                </p>
              </div>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Trò Chơi:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Đua Tính Nhẩm Lũy Thừa 6A1..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thể Loại:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CustomGameType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="speed_math">Đua Tốc Độ (Speed Math)</option>
                    <option value="escape_room">Mật Mã Vượt Ngục</option>
                    <option value="camera_motion">Vận Động Cơ Thể Camera</option>
                    <option value="quiz_show">Đấu Trường Đố Vui</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian/Câu:</label>
                  <select
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value={15}>15 Giây</option>
                    <option value={20}>20 Giây</option>
                    <option value={30}>30 Giây</option>
                    <option value={45}>45 Giây</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Trò Chơi:</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="VD: Rèn luyện tính nhẩm nhanh và hằng đẳng thức..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Questions Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Danh Sách Câu Hỏi ({formQuestions.length}):</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormQuestions(prev => [
                        ...prev,
                        {
                          text: 'Câu hỏi mới:',
                          formula: '',
                          options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
                          correctIndex: 0,
                          explanation: 'Giải thích đáp án.'
                        }
                      ]);
                    }}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-[11px] flex items-center gap-1 border border-indigo-200"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm Câu Hỏi</span>
                  </button>
                </div>

                {formQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700">Câu #{qIdx + 1}</span>
                      {formQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormQuestions(prev => prev.filter((_, i) => i !== qIdx))}
                          className="text-rose-500 hover:text-rose-700 font-bold text-[10px]"
                        >
                          Xóa câu này
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      value={q.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormQuestions(prev => prev.map((item, i) => i === qIdx ? { ...item, text: val } : item));
                      }}
                      placeholder="Nội dung câu hỏi..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />

                    <input
                      type="text"
                      value={q.formula || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormQuestions(prev => prev.map((item, i) => i === qIdx ? { ...item, formula: val } : item));
                      }}
                      placeholder="Công thức KaTeX (VD: x^2 - 4 = 0)..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />

                    {/* 4 Options */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                              setFormQuestions(prev => prev.map((item, i) => i === qIdx ? { ...item, correctIndex: optIdx } : item));
                            }}
                          />
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormQuestions(prev => prev.map((item, i) => {
                                if (i !== qIdx) return item;
                                const newOpts = [...item.options];
                                newOpts[optIdx] = val;
                                return { ...item, options: newOpts };
                              }));
                            }}
                            className="w-full bg-transparent text-xs font-medium focus:outline-none"
                            placeholder={`Phương án ${String.fromCharCode(65 + optIdx)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700"
                >
                  Lưu Trò Chơi Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCertificate && playingGame && (
        <CertificateModal
          studentName={activeStudentName}
          className={activeClassName}
          classCode="20112002"
          score={score}
          totalQuestions={playingGame.questions.length}
          accuracy={Math.round((score / (playingGame.questions.length * 10)) * 100)}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
