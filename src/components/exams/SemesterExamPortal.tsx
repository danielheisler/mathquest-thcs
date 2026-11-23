import React, { useState, useEffect } from 'react';
import { SemesterExam, ExamQuestion, ExamResult, Student, GradeLevel, TrueFalseSubItem } from '../../types/math';
import { sampleSemesterExams } from '../../data/semesterExamsData';
import { MathView } from '../common/MathView';
import { CertificateModal } from '../certificate/CertificateModal';
import { soundManager } from '../../utils/sound';
import { ExamCodeScannerModal } from '../common/ExamCodeScannerModal';
import { 
  FileText, Timer, Award, CheckCircle2, XCircle, ArrowRight, ArrowLeft, 
  RotateCcw, Printer, Sparkles, Filter, ChevronRight, Bookmark, AlertCircle, 
  Share2, Scan, QrCode, Zap, Check, HelpCircle, Edit3, Sliders, BookOpen
} from 'lucide-react';

interface SemesterExamPortalProps {
  students: Student[];
  onSaveExamResult?: (result: ExamResult) => void;
  activeStudentName?: string;
  customExams?: SemesterExam[];
  preselectedExamId?: string | null;
  onOpenAIGenerator?: () => void;
}

export const SemesterExamPortal: React.FC<SemesterExamPortalProps> = ({
  students,
  onSaveExamResult,
  activeStudentName = 'Nguyễn Minh Quân',
  customExams = [],
  preselectedExamId = null,
  onOpenAIGenerator
}) => {
  // Check for ongoing saved exam session
  const getSavedExamSession = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('mathquest_ongoing_exam_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isExamActive) {
          return parsed;
        }
      }
    } catch {}
    return null;
  };

  const savedSession = getSavedExamSession();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(() => {
    return savedSession?.grade || 6;
  });
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'quiz_15m' | 'midterm' | 'final'>('all');
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const exams: SemesterExam[] = [...customExams, ...sampleSemesterExams];
  const [selectedExamId, setSelectedExamId] = useState<string>(() => {
    return preselectedExamId || savedSession?.examId || exams[0]?.id || 'exam-g6-15m';
  });
  const [selectedStudent, setSelectedStudent] = useState<string>(() => {
    return savedSession?.studentName || activeStudentName;
  });

  // Exam in-progress state - restored automatically if ongoing session exists
  const [isExamActive, setIsExamActive] = useState<boolean>(() => {
    return Boolean(savedSession?.isExamActive);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    return savedSession?.currentQuestionIndex || 0;
  });
  
  // Student answer stores for all 4 types
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>(() => {
    return savedSession?.mcAnswers || {};
  });
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<'a' | 'b' | 'c' | 'd', boolean>>>(() => {
    return savedSession?.tfAnswers || {};
  });
  const [saAnswers, setSaAnswers] = useState<Record<string, string>>(() => {
    return savedSession?.saAnswers || {};
  });
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>(() => {
    return savedSession?.essayAnswers || {};
  });
  const [essayScores, setEssayScores] = useState<Record<string, number>>(() => {
    return savedSession?.essayScores || {};
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>(() => {
    return savedSession?.flaggedQuestions || {};
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (savedSession?.timeLeft !== undefined) {
      return savedSession.timeLeft > 0 ? savedSession.timeLeft : 10 * 60;
    }
    return 15 * 60;
  });
  const [timeSpentSec, setTimeSpentSec] = useState<number>(() => {
    return savedSession?.timeSpentSec || 0;
  });

  // Submission result
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Filter exams by grade & type
  const gradeExams = exams.filter(e => {
    if (e.grade !== selectedGrade) return false;
    if (selectedTypeFilter !== 'all' && e.examType !== selectedTypeFilter) return false;
    return true;
  });

  const activeExam = exams.find(e => e.id === selectedExamId) || gradeExams[0] || exams[0];

  // Sync when navigated here from AI Exam Generator with a specific exam
  useEffect(() => {
    if (preselectedExamId && !isExamActive) {
      const target = exams.find(e => e.id === preselectedExamId);
      if (target) {
        setSelectedGrade(target.grade);
        setSelectedTypeFilter('all');
        setSelectedExamId(target.id);
      }
    }
  }, [preselectedExamId, customExams.length]);

  // Update selected exam when grade or filter changes only if NOT taking exam
  useEffect(() => {
    if (!isExamActive) {
      const stillExistsInGrade = gradeExams.some(e => e.id === selectedExamId);
      if (!stillExistsInGrade && gradeExams[0]) {
        setSelectedExamId(gradeExams[0].id);
      }
    }
  }, [selectedGrade, selectedTypeFilter, isExamActive]);

  // Persist ongoing exam session to localStorage
  useEffect(() => {
    if (isExamActive && !isExamFinished && activeExam) {
      const session = {
        examId: activeExam.id,
        examTitle: activeExam.title,
        grade: activeExam.grade,
        studentName: selectedStudent,
        isExamActive: true,
        currentQuestionIndex,
        mcAnswers,
        tfAnswers,
        saAnswers,
        essayAnswers,
        essayScores,
        flaggedQuestions,
        timeLeft,
        timeSpentSec,
        totalQuestions: activeExam.questions.length,
        answeredCount: Object.keys(mcAnswers).length + Object.keys(tfAnswers).length + Object.keys(saAnswers).length + Object.keys(essayAnswers).length,
        lastUpdated: Date.now()
      };
      localStorage.setItem('mathquest_ongoing_exam_session', JSON.stringify(session));
    } else if (isExamFinished) {
      localStorage.removeItem('mathquest_ongoing_exam_session');
    }
  }, [isExamActive, isExamFinished, activeExam, selectedStudent, currentQuestionIndex, mcAnswers, tfAnswers, saAnswers, essayAnswers, essayScores, flaggedQuestions, timeLeft, timeSpentSec]);

  // Exam Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamActive && !isExamFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          if (prev <= 10) soundManager.playTick();
          return prev - 1;
        });
        setTimeSpentSec(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, isExamFinished, timeLeft]);

  const handleStartExam = () => {
    soundManager.playClick();
    if (!activeExam) return;
    setMcAnswers({});
    setTfAnswers({});
    setSaAnswers({});
    setEssayAnswers({});
    setEssayScores({});
    setFlaggedQuestions({});
    setTimeLeft(activeExam.durationMinutes * 60);
    setTimeSpentSec(0);
    setCurrentQuestionIndex(0);
    setIsExamFinished(false);
    setExamResult(null);
    setIsExamActive(true);
  };

  const handleCancelExam = () => {
    soundManager.playClick();
    if (window.confirm('Bạn có chắc chắn muốn hủy bài thi đang làm dở? Toàn bộ câu trả lời chưa nộp sẽ bị xóa.')) {
      localStorage.removeItem('mathquest_ongoing_exam_session');
      setIsExamActive(false);
      setMcAnswers({});
      setTfAnswers({});
      setSaAnswers({});
      setEssayAnswers({});
      setEssayScores({});
      setFlaggedQuestions({});
      setCurrentQuestionIndex(0);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    soundManager.playClick();
    setMcAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSelectTrueFalse = (questionId: string, label: 'a' | 'b' | 'c' | 'd', value: boolean) => {
    soundManager.playClick();
    setTfAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [label]: value
      }
    }));
  };

  const handleShortAnswerChange = (questionId: string, value: string) => {
    setSaAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleEssayChange = (questionId: string, value: string) => {
    setEssayAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleInsertMathSymbol = (questionId: string, symbol: string) => {
    soundManager.playClick();
    setEssayAnswers(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || '') + symbol
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    soundManager.playClick();
    setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const calculateScores = () => {
    if (!activeExam) return { totalScore: 0, part1Score: 0, part2Score: 0, part3Score: 0, part4Score: 0, correctCount: 0 };

    // Part I: Multiple choice
    const mcQuestions = activeExam.questions.filter(q => q.questionType === 'multiple_choice' || !q.questionType);
    let part1Score = 0;
    let correctCount = 0;
    mcQuestions.forEach(q => {
      if (mcAnswers[q.id] === q.correctAnswerIndex) {
        part1Score += q.points;
        correctCount += 1;
      }
    });

    // Part II: True / False (1 câu 4 ý a,b,c,d)
    const tfQuestions = activeExam.questions.filter(q => q.questionType === 'true_false');
    let part2Score = 0;
    tfQuestions.forEach(q => {
      if (q.subQuestions && q.subQuestions.length > 0) {
        const userSubs = tfAnswers[q.id] || {};
        let subCorrect = 0;
        q.subQuestions.forEach(sub => {
          if (userSubs[sub.label] === sub.isCorrect) {
            subCorrect += 1;
          }
        });
        if (subCorrect === 1) part2Score += 0.1;
        else if (subCorrect === 2) part2Score += 0.25;
        else if (subCorrect === 3) part2Score += 0.5;
        else if (subCorrect === 4) {
          part2Score += 1.0;
          correctCount += 1;
        }
      }
    });

    // Part III: Short answer (2 câu)
    const saQuestions = activeExam.questions.filter(q => q.questionType === 'short_answer');
    let part3Score = 0;
    saQuestions.forEach(q => {
      const userText = (saAnswers[q.id] || '').trim().toLowerCase().replace(/\s+/g, '');
      const target = (q.correctShortAnswer || '').trim().toLowerCase().replace(/\s+/g, '');
      const accepted = (q.acceptedAnswers || []).map(a => a.trim().toLowerCase().replace(/\s+/g, ''));
      if (userText && (userText === target || accepted.includes(userText))) {
        part3Score += q.points;
        correctCount += 1;
      }
    });

    // Part IV: Essay (5 câu hoặc 2 câu)
    const essayQuestions = activeExam.questions.filter(q => q.questionType === 'essay');
    let part4Score = 0;
    essayQuestions.forEach(q => {
      const userText = (essayAnswers[q.id] || '').trim();
      // If teacher/student explicitly graded, use it; otherwise auto-award full points if answered in full, or 0
      const score = essayScores[q.id] !== undefined 
        ? essayScores[q.id] 
        : (userText.length >= 10 ? q.points : 0);
      part4Score += score;
      if (score >= q.points * 0.7) {
        correctCount += 1;
      }
    });

    const total = Math.min(10, Math.round((part1Score + part2Score + part3Score + part4Score) * 100) / 100);

    return {
      totalScore: total,
      part1Score: Math.round(part1Score * 100) / 100,
      part2Score: Math.round(part2Score * 100) / 100,
      part3Score: Math.round(part3Score * 100) / 100,
      part4Score: Math.round(part4Score * 100) / 100,
      correctCount
    };
  };

  const handleFinishExam = () => {
    soundManager.playLevelUp();
    if (!activeExam) return;

    const scores = calculateScores();
    const certificateAwarded = scores.totalScore >= 8.0;

    const result: ExamResult = {
      id: `res-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      grade: activeExam.grade,
      studentName: selectedStudent,
      score: scores.totalScore,
      correctCount: scores.correctCount,
      totalQuestions: activeExam.questions.length,
      timeSpentSec,
      date: new Date().toLocaleDateString('vi-VN'),
      answers: {
        multipleChoice: mcAnswers,
        trueFalse: tfAnswers,
        shortAnswer: saAnswers,
        essay: essayAnswers,
        essayScores
      },
      partScores: {
        part1Score: scores.part1Score,
        part2Score: scores.part2Score,
        part3Score: scores.part3Score,
        part4Score: scores.part4Score
      },
      certificateAwarded
    };

    setExamResult(result);
    setIsExamActive(false);
    setIsExamFinished(true);

    if (onSaveExamResult) {
      onSaveExamResult(result);
    }

    if (certificateAwarded) {
      setShowCertificate(true);
    }
  };

  const handleUpdateEssayScore = (qId: string, newScore: number) => {
    setEssayScores(prev => {
      const next = { ...prev, [qId]: newScore };
      // Recalculate result score dynamically
      if (examResult && activeExam) {
        const scores = calculateScores();
        setExamResult({
          ...examResult,
          score: scores.totalScore,
          partScores: {
            part1Score: scores.part1Score,
            part2Score: scores.part2Score,
            part3Score: scores.part3Score,
            part4Score: scores.part4Score
          }
        });
      }
      return next;
    });
  };

  const handleScanSuccess = (code: string) => {
    setShowScannerModal(false);
    const matched = exams.find(e => 
      e.code?.toUpperCase() === code.toUpperCase() || 
      e.id.toUpperCase() === code.toUpperCase()
    );
    if (matched) {
      setSelectedGrade(matched.grade);
      setSelectedExamId(matched.id);
      soundManager.playCorrect();
      setMcAnswers({});
      setTfAnswers({});
      setSaAnswers({});
      setEssayAnswers({});
      setEssayScores({});
      setFlaggedQuestions({});
      setTimeLeft(matched.durationMinutes * 60);
      setTimeSpentSec(0);
      setCurrentQuestionIndex(0);
      setIsExamFinished(false);
      setExamResult(null);
      setIsExamActive(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = activeExam?.questions[currentQuestionIndex] || activeExam?.questions[0];

  // Helper: check if a question is answered
  const isQuestionAnswered = (q: ExamQuestion) => {
    if (q.questionType === 'multiple_choice' || !q.questionType) {
      return mcAnswers[q.id] !== undefined;
    }
    if (q.questionType === 'true_false') {
      const subs = tfAnswers[q.id] || {};
      return Object.keys(subs).length === 4;
    }
    if (q.questionType === 'short_answer') {
      return Boolean((saAnswers[q.id] || '').trim());
    }
    if (q.questionType === 'essay') {
      return Boolean((essayAnswers[q.id] || '').trim());
    }
    return false;
  };

  const answeredCount = activeExam ? activeExam.questions.filter(isQuestionAnswered).length : 0;

  return (
    <div className="space-y-6">
      {/* Step 1: Pre-Exam Selector and Overview */}
      {!isExamActive && !isExamFinished && (
        <div className="space-y-6">
          {/* Resume Banner if there is a saved ongoing session */}
          {savedSession && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                  📝
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>BẠN ĐANG CÓ BÀI THI DỞ DANG TRONG HỆ THỐNG</span>
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">
                    {savedSession.examTitle || 'Đề thi học kỳ'} · Thí sinh: <b>{savedSession.studentName}</b>
                  </div>
                  <div className="text-xs text-amber-100 mt-0.5">
                    Đã làm: <b>{savedSession.answeredCount}/{savedSession.totalQuestions}</b> câu · Thời gian còn lại: <b>{formatTimer(savedSession.timeLeft)}</b>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    soundManager.playCorrect();
                    setIsExamActive(true);
                  }}
                  className="px-5 py-2.5 bg-white text-orange-700 hover:bg-amber-50 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Tiếp Tục Làm Bài Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelExam}
                  className="px-3.5 py-2.5 bg-black/20 hover:bg-black/30 text-white font-semibold text-xs rounded-2xl border border-white/20 transition-all cursor-pointer"
                >
                  Hủy Bài Này
                </button>
              </div>
            </div>
          )}

          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md inline-block mb-3">
                Chuẩn Cấu Trúc Đề Thi GDPT 2018 · Cô Diễm Quỳnh
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Ngân Hàng Đề Thi Giữa Kỳ, Cuối Kỳ & Kiểm Tra 15 Phút
              </h2>
              <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
                Đề Giữa kỳ / Cuối kỳ chuẩn: <b>12 câu trắc nghiệm ABCD (3đ) + 1 câu Đúng/Sai 4 ý (1đ) + 2 câu trả lời ngắn (1đ) + 5 câu tự luận (5đ)</b>. 
                Đề kiểm tra 15 phút: <b>4 câu trắc nghiệm (4đ) + 2 câu tự luận (6đ)</b>.
              </p>
            </div>

            {/* Quick Actions: AI Exam Generator + QR Scanner */}
            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-2.5">
              {onOpenAIGenerator && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenAIGenerator();
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-indigo-800 shrink-0" />
                  <div className="text-left">
                    <span className="block text-[10px] text-indigo-900 uppercase font-extrabold">Không Cần Kho Tài Liệu</span>
                    <span className="block text-sm">Tạo Đề AI &amp; Giải Chi Tiết</span>
                  </div>
                </button>
              )}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowScannerModal(true);
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white font-bold rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Scan className="w-5 h-5 text-cyan-300 animate-pulse" />
                <div className="text-left">
                  <span className="block text-[10px] text-cyan-200 uppercase font-bold">Mắt Đọc Camera</span>
                  <span className="block text-sm">Quét Mã Đề QR Thi Ngay</span>
                </div>
              </button>
            </div>
          </div>

          {/* Format Guide Alert Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-1 text-indigo-950">
              <div className="font-extrabold text-sm text-indigo-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Mẫu Đề Thi Giữa Kỳ & Cuối Kỳ (90 Phút - 10,0 Điểm)
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-indigo-900">
                <li><b>Phần I:</b> 12 câu trắc nghiệm 4 đáp án ABCD (3,0 điểm - 0,25đ/câu)</li>
                <li><b>Phần II:</b> 1 câu hỏi Đúng / Sai gồm 4 ý a, b, c, d (1,0 điểm)</li>
                <li><b>Phần III:</b> 2 câu hỏi trắc nghiệm trả lời ngắn (1,0 điểm - 0,5đ/câu)</li>
                <li><b>Phần IV:</b> 5 câu tự luận trình bày lời giải chi tiết (5,0 điểm - 1,0đ/câu)</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1 text-amber-950">
              <div className="font-extrabold text-sm text-amber-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Mẫu Đề Kiểm Tra 15 Phút (15 Phút - 10,0 Điểm)
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-900">
                <li><b>Phần I:</b> 4 câu trắc nghiệm 4 đáp án ABCD (4,0 điểm - 1,0đ/câu)</li>
                <li><b>Phần II:</b> 2 câu bài tập tự luận (6,0 điểm - 3,0đ/câu)</li>
                <li>Có đồng hồ đếm ngược 15 phút, tự động nộp bài khi hết giờ.</li>
                <li>Hỗ trợ xem đáp án và in toàn bộ đề giấy chuẩn A4 cho lớp học.</li>
              </ul>
            </div>
          </div>

          {/* Filter Bar: Grade Level & Exam Type (15p, Giữa kỳ, Cuối kỳ) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            {/* Grade Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {([6, 7, 8, 9] as GradeLevel[]).map(grade => (
                <button
                  key={`grade-${grade}`}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGrade(grade);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedGrade === grade
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>Khối {grade}</span>
                  {grade === 9 && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-extrabold">
                      Vào 10
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Exam Type Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'quiz_15m', label: '⚡ Đề 15 Phút (4 TN + 2 TL)', badge: '15p' },
                { id: 'midterm', label: 'Đề Giữa Kỳ (12 TN + 1 ĐS + 2 TN + 5 TL)', badge: '90p' },
                { id: 'final', label: 'Đề Cuối Kỳ (Chuẩn Bộ GD)', badge: '90p' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTypeFilter(type.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    selectedTypeFilter === type.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exam List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradeExams.map(exam => {
              const isSelected = activeExam?.id === exam.id;
              const is15m = exam.examType === 'quiz_15m';

              return (
                <div
                  key={exam.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedExamId(exam.id);
                  }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        is15m
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : exam.examType === 'midterm'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {is15m ? '⚡ Kiểm Tra 15 Phút' : exam.examType === 'midterm' ? 'Đề Thi Giữa Kỳ' : 'Đề Thi Cuối Kỳ'} · Khối {exam.grade}
                      </span>
                      {exam.isAIGenerated && (
                        <span className="text-[10px] font-black bg-violet-100 text-violet-800 border border-violet-200 px-1.5 py-0.5 rounded">
                          ✨ AI Tạo
                        </span>
                      )}
                      {exam.code && (
                        <span className="font-mono font-bold text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Mã: {exam.code}
                        </span>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                      is15m ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      <Timer className="w-3.5 h-3.5" />
                      {exam.durationMinutes} phút
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{exam.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{exam.description}</p>

                  {/* Section Breakdown Pills */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-semibold text-slate-600 flex flex-wrap items-center justify-between gap-2 mb-4">
                    {is15m ? (
                      <>
                        <span className="text-indigo-700">Phần I: 4 câu TN (4,0đ)</span>
                        <span>•</span>
                        <span className="text-emerald-700">Phần II: 2 câu Tự luận (6,0đ)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-indigo-700">I: 12 câu TN (3đ)</span>
                        <span>•</span>
                        <span className="text-blue-700">II: 1 câu Đ/S 4 ý (1đ)</span>
                        <span>•</span>
                        <span className="text-amber-700">III: 2 câu ngắn (1đ)</span>
                        <span>•</span>
                        <span className="text-emerald-700">IV: 5 câu Tự luận (5đ)</span>
                      </>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Tổng số: <b className="text-slate-800">{exam.questions.length} câu hỏi (10,0 điểm)</b>
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Chọn đề này <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exam Setup Bar */}
          {activeExam && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Chọn tên thí sinh làm bài:
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.parentName || 'Phụ huynh'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-2xs"
                >
                  <Printer className="w-4 h-4" /> In Đề Giấy (A4 Chuẩn)
                </button>
                <button
                  onClick={handleStartExam}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
                >
                  <Timer className="w-4 h-4" /> Bắt Đầu Làm Bài ({activeExam.durationMinutes} Phút)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Exam In-Progress Mode */}
      {isExamActive && activeExam && currentQ && (
        <div className="space-y-4">
          {/* Active Exam Status Header */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                📝
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {activeExam.title} · Khối {activeExam.grade}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>Thí sinh: <b className="text-slate-800">{selectedStudent}</b></span>
                  <span>•</span>
                  <span>Tiến độ: <b className="text-indigo-600 font-mono">{answeredCount}/{activeExam.questions.length}</b> câu</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Tiến trình tự động lưu</span>
              </div>

              <button
                type="button"
                onClick={handleCancelExam}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                title="Hủy bài thi này để chọn đề thi khác"
              >
                Hủy bài thi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Question Workspace (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Top Bar of current question */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Câu {currentQuestionIndex + 1} / {activeExam.questions.length}
                </span>
                {currentQ.section && (
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Phần {currentQ.section}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentQ.points} điểm
                </span>
              </div>

              <button
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${flaggedQuestions[currentQ.id] ? 'fill-amber-600' : ''}`} />
                <span>{flaggedQuestions[currentQ.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</span>
              </button>
            </div>

            {/* Section Title banner if present */}
            {currentQ.sectionTitle && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700">
                {currentQ.sectionTitle}
              </div>
            )}

            {/* Question Text & MathType Formula */}
            <div className="space-y-4">
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                <MathView math={currentQ.questionText} />
              </div>

              {currentQ.formula && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-serif text-lg text-indigo-900 py-3 shadow-inner">
                  <MathView math={currentQ.formula} displayMode={true} />
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* TYPE 1: MULTIPLE CHOICE (Phần I - 12 câu hoặc 4 câu) */}
            {/* ============================================================== */}
            {(currentQ.questionType === 'multiple_choice' || !currentQ.questionType) && currentQ.options && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Chọn một đáp án đúng nhất (A, B, C hoặc D):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((optionText, optIdx) => {
                    const isSelected = mcAnswers[currentQ.id] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={`opt-${optIdx}`}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {letter}
                        </span>
                        <div className="pt-0.5 leading-snug">
                          <MathView math={optionText} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TYPE 2: TRUE / FALSE (Phần II - 1 câu 4 ý a, b, c, d) */}
            {/* ============================================================== */}
            {currentQ.questionType === 'true_false' && currentQ.subQuestions && (
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <b>Hướng dẫn:</b> Thí sinh chọn <b>Đúng</b> hoặc <b>Sai</b> cho từng ý a, b, c, d. (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ).
                </div>

                <div className="space-y-3">
                  {currentQ.subQuestions.map((sub) => {
                    const currentChoice = tfAnswers[currentQ.id]?.[sub.label];
                    return (
                      <div
                        key={sub.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-indigo-700 text-sm mr-2">
                            {sub.label})
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            <MathView math={sub.text} />
                          </span>
                          {sub.formula && (
                            <div className="text-xs font-serif text-indigo-900 pl-4">
                              <MathView math={sub.formula} />
                            </div>
                          )}
                        </div>

                        {/* True / False Toggle Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleSelectTrueFalse(currentQ.id, sub.label, true)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              currentChoice === true
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> Đúng
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectTrueFalse(currentQ.id, sub.label, false)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              currentChoice === false
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Sai
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TYPE 3: SHORT ANSWER (Phần III - 2 câu điền số ngắn) */}
            {/* ============================================================== */}
            {currentQ.questionType === 'short_answer' && (
              <div className="space-y-4 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Nhập kết quả hoặc đáp số của em vào ô bên dưới:
                </label>
                <div className="max-w-md">
                  <input
                    type="text"
                    value={saAnswers[currentQ.id] || ''}
                    onChange={(e) => handleShortAnswerChange(currentQ.id, e.target.value)}
                    placeholder="VD: 1846, 240, 2/3, 5..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Điền kết quả dạng số nguyên, số thập phân hoặc phân số tối giản.
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TYPE 4: ESSAY (Phần IV - 5 câu tự luận / hoặc 2 câu) */}
            {/* ============================================================== */}
            {currentQ.questionType === 'essay' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Khung Trình Bày Bài Giải Tự Luận:
                  </label>
                  <span className="text-[11px] text-indigo-600 font-bold">
                    Thang điểm: {currentQ.points} điểm
                  </span>
                </div>

                {/* Quick math symbol toolbar */}
                <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
                  <span className="text-[10px] text-slate-400 font-sans uppercase font-bold mr-1">Chèn nhanh:</span>
                  {['+', '-', '×', ':', '√', '^2', '±', '°', '≤', '≥', '≠', 'π', '∈', '∥', '⊥', '⇒', '⇔'].map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertMathSymbol(currentQ.id, sym + ' ')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 rounded border border-slate-300 shadow-2xs text-xs"
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={6}
                  value={essayAnswers[currentQ.id] || ''}
                  onChange={(e) => handleEssayChange(currentQ.id, e.target.value)}
                  placeholder="Học sinh trình bày các bước giải toán tại đây... (Ví dụ: Ta có..., Áp dụng định lý..., Suy ra...)"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-xs sm:text-sm font-sans text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                />

                {currentQ.rubric && currentQ.rubric.length > 0 && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">Tiêu chí chấm điểm từng bước của Cô Diễm Quỳnh:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                      {currentQ.rubric.map((r, rIdx) => (
                        <li key={rIdx}>{r.step} <b>(+{r.points}đ)</b></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav: Prev / Next */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                }}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Câu Trước
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1));
                }}
                disabled={currentQuestionIndex === activeExam.questions.length - 1}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                Câu Sau <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sidebar (4 cols): Timer & Question Grid */}
          <div className="lg:col-span-4 space-y-4">
            {/* Timer Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Thời Gian Làm Bài Còn Lại
              </span>
              <div className={`text-3xl font-mono font-black ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`}>
                {formatTimer(timeLeft)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Thí sinh: <b>{selectedStudent}</b>
              </span>
            </div>

            {/* Question Quick Palette */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Bảng Câu Hỏi</span>
                <span className="text-slate-500">
                  Đã làm: <b className="text-indigo-600">{answeredCount}/{activeExam.questions.length}</b>
                </span>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-4 gap-2">
                {activeExam.questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = isQuestionAnswered(q);
                  const isFlagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`relative py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : isAnswered
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {q.section && (
                        <span className="text-[9px] block opacity-70 font-sans">
                          {q.section}
                        </span>
                      )}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleFinishExam}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Nộp Bài Thi & Chấm Điểm
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Step 3: Exam Results & Detailed Explanations */}
      {isExamFinished && examResult && activeExam && (
        <div className="space-y-6">
          {/* Result Score Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">
                Kết Quả Bài Kiểm Tra · {activeExam.title}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Thí sinh: {examResult.studentName}
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 py-2">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">Tổng Điểm Đạt Được</span>
                <span className="text-4xl font-mono font-black text-indigo-600">
                  {examResult.score.toFixed(1)}/10
                </span>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">Số Câu Trả Lời Đạt</span>
                <span className="text-2xl font-mono font-black text-emerald-600">
                  {examResult.correctCount}/{examResult.totalQuestions}
                </span>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">Thời Gian Làm</span>
                <span className="text-2xl font-mono font-black text-slate-700">
                  {Math.floor(examResult.timeSpentSec / 60)}p {examResult.timeSpentSec % 60}s
                </span>
              </div>
            </div>

            {/* Breakdown by sections */}
            {examResult.partScores && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-xs">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="text-indigo-600 block font-bold">Phần I (Trắc nghiệm)</span>
                  <span className="text-lg font-mono font-black text-indigo-900">
                    {examResult.partScores.part1Score.toFixed(1)} đ
                  </span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-blue-600 block font-bold">Phần II (Đúng / Sai)</span>
                  <span className="text-lg font-mono font-black text-blue-900">
                    {examResult.partScores.part2Score.toFixed(1)} đ
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-600 block font-bold">Phần III (Trả lời ngắn)</span>
                  <span className="text-lg font-mono font-black text-amber-900">
                    {examResult.partScores.part3Score.toFixed(1)} đ
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-600 block font-bold">Phần IV (Tự luận)</span>
                  <span className="text-lg font-mono font-black text-emerald-900">
                    {examResult.partScores.part4Score.toFixed(1)} đ
                  </span>
                </div>
              </div>
            )}

            {/* Honor Certificate Badge */}
            {examResult.certificateAwarded && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">Đạt Chuẩn Giấy Khen Danh Dự!</h5>
                    <p className="text-[11px] text-amber-700">Điểm số đạt từ 8.0 trở lên (≥ 80%).</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  Xem Giấy Khen
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleStartExam}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Thi Lại Đề Này
              </button>
              <button
                onClick={() => {
                  setIsExamFinished(false);
                  setIsExamActive(false);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/30"
              >
                <FileText className="w-4 h-4" /> Chọn Đề Thi Khác
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/30"
              >
                <Printer className="w-4 h-4" /> In Toàn Bộ Lời Giải Chi Tiết
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Step Explanations */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Xem Lại Toàn Bộ Đáp Án & Hướng Dẫn Giải Chi Tiết Của Cô Diễm Quỳnh
            </h4>

            <div className="space-y-4">
              {activeExam.questions.map((q, idx) => {
                // Render review depending on questionType
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center bg-indigo-100 text-indigo-800">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Câu {idx + 1} {q.section ? `(Phần ${q.section})` : ''}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          {q.points} điểm
                        </span>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      <MathView math={q.questionText} />
                    </div>

                    {q.formula && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-serif text-base text-indigo-900">
                        <MathView math={q.formula} displayMode={true} />
                      </div>
                    )}

                    {/* Review Type 1: Multiple choice */}
                    {(q.questionType === 'multiple_choice' || !q.questionType) && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrectOpt = oIdx === q.correctAnswerIndex;
                          const isUserOpt = mcAnswers[q.id] === oIdx;
                          const letter = String.fromCharCode(65 + oIdx);

                          return (
                            <div
                              key={`rev-opt-${oIdx}`}
                              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                                isCorrectOpt
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                  : isUserOpt
                                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="font-mono font-bold">{letter}.</span>
                              <MathView math={opt} />
                              {isCorrectOpt && (
                                <span className="ml-auto text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                  Đáp án đúng
                                </span>
                              )}
                              {isUserOpt && !isCorrectOpt && (
                                <span className="ml-auto text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                                  Em chọn
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Review Type 2: True / False */}
                    {q.questionType === 'true_false' && q.subQuestions && (
                      <div className="space-y-2 my-2">
                        {q.subQuestions.map(sub => {
                          const userChoice = tfAnswers[q.id]?.[sub.label];
                          const isSubCorrect = userChoice === sub.isCorrect;
                          return (
                            <div
                              key={sub.id}
                              className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                isSubCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                              }`}
                            >
                              <div>
                                <span className="font-mono font-bold text-indigo-700 mr-2">{sub.label})</span>
                                <span className="font-semibold text-slate-800"><MathView math={sub.text} /></span>
                                {sub.explanation && (
                                  <p className="text-[11px] text-slate-500 mt-0.5">{sub.explanation}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] shrink-0 font-bold">
                                <span>Đáp án: <b className="text-emerald-700">{sub.isCorrect ? 'ĐÚNG' : 'SAI'}</b></span>
                                <span>•</span>
                                <span>Em chọn: <b className={isSubCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userChoice === undefined ? 'Chưa chọn' : userChoice ? 'ĐÚNG' : 'SAI'}</b></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Review Type 3: Short answer */}
                    {q.questionType === 'short_answer' && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Đáp án của em: <b className="font-mono text-indigo-700">{saAnswers[q.id] || '(Chưa nhập)'}</b></span>
                          <span className="text-emerald-700 font-bold">Đáp án chuẩn: <b className="font-mono">{q.correctShortAnswer}</b></span>
                        </div>
                      </div>
                    )}

                    {/* Review Type 4: Essay */}
                    {q.questionType === 'essay' && (
                      <div className="space-y-3 my-2">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <span className="font-bold text-slate-700 block">Bài giải học sinh đã trình bày:</span>
                          <p className="font-sans whitespace-pre-wrap text-slate-800">
                            {essayAnswers[q.id] || '(Học sinh chưa nhập bài giải cho câu này)'}
                          </p>
                        </div>

                        {q.sampleSolution && (
                          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
                            <span className="font-bold text-emerald-800 block">Đáp án giải mẫu của Cô Diễm Quỳnh:</span>
                            <div className="whitespace-pre-wrap font-sans text-emerald-900 leading-relaxed">
                              <MathView math={q.sampleSolution} />
                            </div>
                          </div>
                        )}

                        {/* Adjust score slider / buttons */}
                        <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                            Chấm điểm câu tự luận này:
                          </span>
                          <div className="flex items-center gap-2">
                            {[0, Math.round(q.points * 0.5 * 10) / 10, q.points].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleUpdateEssayScore(q.id, val)}
                                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                                  (essayScores[q.id] !== undefined ? essayScores[q.id] : (essayAnswers[q.id]?.length >= 10 ? q.points : 0)) === val
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-700'
                                }`}
                              >
                                {val}đ
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 mt-2 space-y-1">
                        <span className="font-bold text-indigo-700 block">Lời giải chi tiết:</span>
                        <MathView math={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Honor Certificate Modal */}
      {showCertificate && examResult && (
        <CertificateModal
          studentName={examResult.studentName}
          className={`Khối ${examResult.grade}`}
          score={examResult.score}
          totalQuestions={examResult.totalQuestions}
          accuracy={Math.round((examResult.score / 10) * 100)}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* QR & Barcode Scanner Modal for timed exam access */}
      {showScannerModal && (
        <ExamCodeScannerModal
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScannerModal(false)}
        />
      )}

      {/* ============================================================== */}
      {/* PRINT-ONLY FORMAL A4 EXAM PAPER LAYOUT FOR TEACHER AND SCHOOL */}
      {/* ============================================================== */}
      <div className="hidden print:block font-serif text-slate-900 p-8 space-y-6">
        {/* Header Table */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
          <div className="text-center w-1/2">
            <p className="text-xs uppercase font-bold tracking-wider">PHÒNG GD&ĐT HUYỆN / QUẬN</p>
            <p className="text-xs font-bold uppercase">TRƯỜNG THCS TOÁN HỌC</p>
            <p className="text-xs italic">Giáo viên ra đề: Cô Diễm Quỳnh</p>
          </div>
          <div className="text-center w-1/2">
            <h2 className="text-sm font-black uppercase">{activeExam?.title}</h2>
            <p className="text-xs">Năm học: 2025 - 2026 · Môn: TOÁN</p>
            <p className="text-xs italic font-semibold">Thời gian làm bài: {activeExam?.durationMinutes} phút (Không kể thời gian phát đề)</p>
            {activeExam?.code && <p className="text-xs font-mono font-bold mt-0.5">MÃ ĐỀ THI: {activeExam.code}</p>}
          </div>
        </div>

        {/* Student info and Grade Table */}
        <div className="grid grid-cols-12 gap-3 border border-slate-900 p-3 text-xs mb-4">
          <div className="col-span-8 space-y-2">
            <p>Họ và tên thí sinh: ............................................................................ Lớp: .....................</p>
            <p>Số báo danh: ........................................... Phòng thi số: ......................................</p>
          </div>
          <div className="col-span-4 border-l border-slate-900 pl-3 text-center">
            <p className="font-bold uppercase text-[11px]">ĐIỂM TOÀN BÀI THI</p>
            <div className="h-12 border border-slate-400 my-1 flex items-center justify-center font-mono font-black text-lg">
              {examResult ? examResult.score.toFixed(1) : ''}
            </div>
            <p className="text-[10px] italic">Lời phê của Cô Diễm Quỳnh</p>
          </div>
        </div>

        {/* Exam Questions Print Stream */}
        <div className="space-y-4 text-xs leading-relaxed">
          {activeExam?.questions.map((q, idx) => (
            <div key={q.id} className="space-y-1.5 page-break-inside-avoid">
              <div className="font-bold flex items-start gap-1">
                <span>Câu {idx + 1} ({q.points}đ):</span>
                <span><MathView math={q.questionText} /></span>
              </div>

              {q.formula && (
                <div className="my-1 pl-6 font-serif">
                  <MathView math={q.formula} displayMode={true} />
                </div>
              )}

              {/* Multiple Choice Print */}
              {q.options && (
                <div className="grid grid-cols-4 gap-2 pl-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-1">
                      <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                      <MathView math={opt} />
                    </div>
                  ))}
                </div>
              )}

              {/* True / False Print */}
              {q.subQuestions && (
                <div className="space-y-1 pl-4">
                  {q.subQuestions.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center pr-8">
                      <span><b>{sub.label})</b> <MathView math={sub.text} /></span>
                      <span className="font-mono text-[10px]">[ Đ / S ]</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Short Answer Print */}
              {q.questionType === 'short_answer' && (
                <div className="pl-4 italic">
                  Đáp số: ................................................................................................
                </div>
              )}

              {/* Essay Print */}
              {q.questionType === 'essay' && (
                <div className="pl-4 h-24 border-b border-dashed border-slate-300">
                  <span className="text-[10px] text-slate-400 italic">Bài làm:</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
