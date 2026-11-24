import React, { useState, useEffect } from 'react';
import { Question, Student, Classroom, HomeworkSubmission, SubjectBranch, AntiCheatIncident } from '../../types/math';
import { WebcamCircle } from './WebcamCircle';
import { CertificateModal } from '../certificate/CertificateModal';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import { Language, translations } from '../../i18n/translations';
import { antiCheatProctor, ANTI_CHEAT_REMOTE_WARNING_KEY, ANTI_CHEAT_CHANNEL_NAME } from '../../utils/antiCheatProctor';
import { AntiCheatMonitorPanel } from '../classroom/AntiCheatMonitorPanel';
import { 
  KeyRound, ShieldCheck, Timer, CheckCircle2, XCircle, Award, 
  Users, Share2, Copy, Check, ArrowRight, BookOpen, Clock, RotateCcw, 
  AlertTriangle, Phone, MessageSquare, Send, ExternalLink, X, Sparkles,
  ShieldAlert, Radio, AlertOctagon, Eye, Volume2
} from 'lucide-react';

interface HomeworkPortalProps {
  questions: Question[];
  students: Student[];
  classrooms: Classroom[];
  submissions: HomeworkSubmission[];
  onAddSubmission: (submission: HomeworkSubmission) => void;
  language: Language;
  initialTab?: 'student' | 'teacher';
  userRole?: 'student' | 'parent' | 'teacher';
}

export const HomeworkPortal: React.FC<HomeworkPortalProps> = ({
  questions,
  students,
  classrooms,
  submissions,
  onAddSubmission,
  language,
  initialTab,
  userRole = 'student'
}) => {
  const t = translations[language];
  const CORRECT_PIN = '20112002';

  // Check for ongoing saved homework session
  const getSavedHomeworkSession = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('mathquest_ongoing_homework_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isSessionActive && parsed.timeLeft > 0 && parsed.activeQuestions?.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return null;
  };

  const savedHwSession = getSavedHomeworkSession();

  // Check URL parameters for ?code=20112002 or saved auth
  const [enteredCode, setEnteredCode] = useState<string>(() => {
    if (savedHwSession) return CORRECT_PIN;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('code') || localStorage.getItem('mathquest_homework_code') || '';
    }
    return '';
  });

  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>(initialTab || 'student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (savedHwSession) return true;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mathquest_homework_auth') === 'true';
    }
    return false;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Student Session - restored automatically if session was active
  const [selectedStudentName, setSelectedStudentName] = useState<string>(() => {
    return savedHwSession?.studentName || students[0]?.name || 'Nguyễn Minh Quân';
  });
  const [selectedBranch, setSelectedBranch] = useState<SubjectBranch>(() => {
    return savedHwSession?.branch || 'algebra';
  });
  const [isSessionActive, setIsSessionActive] = useState<boolean>(() => {
    return Boolean(savedHwSession?.isSessionActive);
  });
  
  // Fixed timer: 10 minutes (600 seconds)
  const FIXED_DURATION = 600;
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return savedHwSession?.timeLeft !== undefined ? savedHwSession.timeLeft : FIXED_DURATION;
  });
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => {
    return savedHwSession?.activeQuestions || [];
  });
  const [currentQIndex, setCurrentQIndex] = useState<number>(() => {
    return savedHwSession?.currentQIndex || 0;
  });
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>(() => {
    return savedHwSession?.userAnswers || {};
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [resultScore, setResultScore] = useState<number>(0);
  const [resultAccuracy, setResultAccuracy] = useState<number>(0);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [submittedTimeSpent, setSubmittedTimeSpent] = useState<number>(0);
  const [sessionEntryTime, setSessionEntryTime] = useState<string>(() => {
    return savedHwSession?.sessionEntryTime || '';
  });

  // Anti-Cheat Proctor State for Student Exam
  const [antiCheatAlert, setAntiCheatAlert] = useState<{
    count: number;
    awaySec: number;
    incident: AntiCheatIncident;
  } | null>(null);
  const [remoteTeacherWarning, setRemoteTeacherWarning] = useState<string | null>(null);
  const [lastProctorStats, setLastProctorStats] = useState<{
    tabSwitchesCount: number;
    totalAwayTimeSec: number;
    integrityStatus: 'honest' | 'suspicious' | 'cheated';
    incidents: AntiCheatIncident[];
  } | null>(null);

  // SMS Modal State in Teacher View
  const [teacherSubTab, setTeacherSubTab] = useState<'submitted' | 'unsubmitted' | 'anticheat'>('submitted');
  const [smsSubmission, setSmsSubmission] = useState<HomeworkSubmission | null>(null);
  const [reminderStudent, setReminderStudent] = useState<Student | null>(null);
  const [copiedSms, setCopiedSms] = useState<boolean>(false);
  const [showBatchSmsModal, setShowBatchSmsModal] = useState<boolean>(false);
  const [showBatchReminderModal, setShowBatchReminderModal] = useState<boolean>(false);

  // Unsubmitted students calculation
  const submittedStudentNames = new Set(submissions.map(s => s.studentName));
  const unsubmittedStudents = students.filter(
    s => !submittedStudentNames.has(s.name) && !submissions.some(sub => sub.studentId === s.id)
  );

  // Auto-verify if code in URL matches and persist auth
  useEffect(() => {
    if (enteredCode === CORRECT_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('mathquest_homework_auth', 'true');
      localStorage.setItem('mathquest_homework_code', enteredCode);
    }
  }, [enteredCode]);

  // Persist ongoing homework session to localStorage
  useEffect(() => {
    if (isSessionActive && !isSubmitted && activeQuestions.length > 0) {
      const session = {
        studentName: selectedStudentName,
        branch: selectedBranch,
        isSessionActive: true,
        timeLeft,
        activeQuestions,
        currentQIndex,
        userAnswers,
        sessionEntryTime,
        totalQuestions: activeQuestions.length,
        answeredCount: Object.keys(userAnswers).length,
        lastUpdated: Date.now()
      };
      localStorage.setItem('mathquest_ongoing_homework_session', JSON.stringify(session));
    } else if (isSubmitted) {
      localStorage.removeItem('mathquest_ongoing_homework_session');
    }
  }, [isSessionActive, isSubmitted, selectedStudentName, selectedBranch, timeLeft, activeQuestions, currentQIndex, userAnswers, sessionEntryTime]);

  const handleCancelHomework = () => {
    soundManager.playClick();
    if (window.confirm('Bạn có muốn hủy bài làm bài tập về nhà đang dở dang không?')) {
      localStorage.removeItem('mathquest_ongoing_homework_session');
      setIsSessionActive(false);
      setUserAnswers({});
      setActiveQuestions([]);
      setCurrentQIndex(0);
      setTimeLeft(FIXED_DURATION);
      antiCheatProctor.stopMonitoring();
    }
  };

  // Listen for remote warnings sent by Cô Diễm Quỳnh
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(ANTI_CHEAT_CHANNEL_NAME);
        channel.onmessage = (event) => {
          const data = event.data;
          if (data && data.type === 'REMOTE_WARNING') {
            if (!data.studentName || data.studentName === selectedStudentName) {
              setRemoteTeacherWarning(data.message || 'Cô Diễm Quỳnh nhắc nhở: Hãy tập trung làm bài, không được rời màn hình hoặc tra cứu kết quả trên mạng!');
              soundManager.playWrong();
            }
          }
        };
      }
    } catch (e) {
      console.warn('Channel error:', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ANTI_CHEAT_REMOTE_WARNING_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (!data.studentName || data.studentName === selectedStudentName) {
            setRemoteTeacherWarning(data.teacherMessage || 'Cô Diễm Quỳnh nhắc nhở: Hãy tập trung làm bài!');
            soundManager.playWrong();
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [selectedStudentName]);

  // Fixed Countdown Timer for Homework
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSessionActive && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitHomework();
            return 0;
          }
          if (prev <= 10) soundManager.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, isSubmitted, timeLeft]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() === CORRECT_PIN) {
      soundManager.playCorrect();
      setIsAuthenticated(true);
      setErrorMessage(null);
    } else {
      soundManager.playWrong();
      setErrorMessage(t.invalidCode);
    }
  };

  const currentStudentObj = students.find(s => s.name === selectedStudentName);

  const handleStartHomework = () => {
    soundManager.playClick();
    // Filter questions based on branch
    const branchTopicsMap: Record<SubjectBranch, string[]> = {
      algebra: ['arithmetic', 'rational', 'algebra', 'equation'],
      geometry: ['geometry'],
      statistics: ['statistics']
    };
    const allowedTopics = branchTopicsMap[selectedBranch];
    const filtered = questions.filter(q => allowedTopics.includes(q.topic));
    
    // Pick 6 questions
    const picked = [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);
    if (picked.length === 0) {
      setActiveQuestions(questions.slice(0, 6));
    } else {
      setActiveQuestions(picked);
    }

    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(FIXED_DURATION);
    setIsSubmitted(false);
    setShowCertificate(false);
    setAntiCheatAlert(null);
    setRemoteTeacherWarning(null);
    setLastProctorStats(null);
    const entryNow = new Date().toLocaleTimeString('vi-VN');
    setSessionEntryTime(entryNow);
    setIsSessionActive(true);

    // Start Anti-Cheat Proctoring
    antiCheatProctor.startMonitoring(
      currentStudentObj?.id || `stud-${selectedStudentName}`,
      selectedStudentName,
      CORRECT_PIN,
      (incident, count) => {
        soundManager.playWrong();
        setAntiCheatAlert({
          count,
          awaySec: incident.durationSec || 0,
          incident
        });
      }
    );
  };

  const handleSelectAnswer = (optionIndex: number) => {
    soundManager.playClick();
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      antiCheatProctor.updateQuestionNumber(nextIdx + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      const prevIdx = currentQIndex - 1;
      setCurrentQIndex(prevIdx);
      antiCheatProctor.updateQuestionNumber(prevIdx + 1);
    }
  };

  const handleSubmitHomework = () => {
    soundManager.playVictory();

    // Stop Anti-Cheat Proctoring and obtain final statistics
    const proctorResult = antiCheatProctor.stopMonitoring();
    setLastProctorStats(proctorResult);

    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const total = activeQuestions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const calculatedScore = (accuracy / 100) * 10;
    const timeSpent = FIXED_DURATION - timeLeft;
    const isCertAwarded = accuracy >= 80;

    const exitNow = new Date().toLocaleTimeString('vi-VN');
    const entryFinal = sessionEntryTime || new Date(Date.now() - timeSpent * 1000).toLocaleTimeString('vi-VN');

    setResultScore(calculatedScore);
    setResultAccuracy(accuracy);
    setSubmittedTimeSpent(Math.max(1, timeSpent));
    setIsSubmitted(true);
    setIsSessionActive(false);

    // Save record for teacher live tracking with parent info & Anti-Cheat metrics
    const newSubmission: HomeworkSubmission = {
      id: `sub-${Date.now()}`,
      studentId: currentStudentObj?.id || `stud-${selectedStudentName}`,
      studentName: selectedStudentName,
      classCode: CORRECT_PIN,
      submittedAt: exitNow + ' ' + new Date().toLocaleDateString('vi-VN'),
      entryTime: entryFinal,
      exitTime: exitNow,
      startedAt: entryFinal,
      score: calculatedScore,
      totalQuestions: total,
      accuracy,
      timeSpentSec: Math.max(1, timeSpent),
      certificateAwarded: isCertAwarded,
      branch: selectedBranch,
      parentPhone: currentStudentObj?.parentPhone || '0912345678',
      parentName: currentStudentObj?.parentName || `Phụ huynh em ${selectedStudentName}`,
      tabSwitchesCount: proctorResult.tabSwitchesCount,
      totalAwayTimeSec: proctorResult.totalAwayTimeSec,
      integrityStatus: proctorResult.integrityStatus,
      incidentLogs: proctorResult.incidents
    };

    onAddSubmission(newSubmission);

    if (isCertAwarded) {
      setShowCertificate(true);
    } else {
      soundManager.playWrong();
    }
  };

  const handleCopyShareLink = () => {
    soundManager.playCorrect();
    const url = `${window.location.origin}${window.location.pathname}?code=${CORRECT_PIN}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Helper to compose personalized parent notification SMS
  const composeParentSms = (
    studentName: string, 
    parentName: string, 
    score: number, 
    accuracy: number, 
    timeSec: number, 
    branch: SubjectBranch,
    tabSwitches: number = 0,
    awaySec: number = 0
  ) => {
    const branchName = branch === 'algebra' ? 'Số Học & Đại Số' : branch === 'geometry' ? 'Hình Học & Đo Lường' : 'Thống Kê & Xác Suất';
    const cheatNote = tabSwitches > 0
      ? `\n- Giám sát chuyển tab: Phát hiện ${tabSwitches} lần rời màn hình (${awaySec}s tra cứu).`
      : `\n- Giám sát chuyển tab: 100% Trung thực (Không chuyển tab).`;
    return `[KẾT QUẢ BÀI TẬP TOÁN THCS - CÔ DIỄM QUỲNH]\nKính gửi ${parentName || 'Phụ huynh'} em ${studentName},\nCô Diễm Quỳnh (GV Toán THCS) xin thông báo: Em vừa hoàn thành bài tập về nhà phân môn ${branchName} (Mã lớp 20112002):\n- Điểm đánh giá: ${score.toFixed(1)}/10\n- Độ chính xác: ${accuracy}%\n- Thời gian làm bài: ${timeSec} giây${cheatNote}\n- Đánh giá của Cô Diễm Quỳnh: ${accuracy >= 80 ? '🌟 Em xuất sắc đạt Giấy Khen Danh Dự!' : 'Em cần rèn luyện thêm các bài toán vận dụng.'}\nKính mong Quý phụ huynh tiếp tục khích lệ và đồng hành cùng em!`;
  };

  const composeReminderSms = (studentName: string, parentName: string) => {
    return `[NHẮC NHỞ BÀI TẬP VỀ NHÀ MÔN TOÁN - CÔ DIỄM QUỲNH]\nKính gửi ${parentName || 'Phụ huynh'},\nCô Diễm Quỳnh (GV bộ môn Toán THCS) xin thông báo: Em ${studentName} hiện CHƯA HOÀN THÀNH bài tập về nhà môn Toán tuần này.\nKính nhờ Quý Phụ huynh nhắc nhở em truy cập ứng dụng và nhập Mã Vào Lớp: 20112002 để làm bài kiểm tra trước hạn chót.\nTrân trọng cảm ơn sự phối hợp của Quý Phụ huynh!`;
  };

  const handleCopyText = (text: string) => {
    soundManager.playCorrect();
    navigator.clipboard.writeText(text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 3000);
  };

  const currentQ = activeQuestions[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Top Navigation Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                {t.homeworkPortal}
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-md font-mono text-xs font-extrabold text-indigo-700">
                MÃ LỚP: {CORRECT_PIN}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-800">
                Giáo viên: Cô Diễm Quỳnh
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Cổng Bài Tập Về Nhà Có Camera & Nhắn Tin Phụ Huynh
            </h3>
            <p className="text-sm text-slate-600">
              Làm bài tập trực tuyến với camera giám sát ở giữa. Sau mỗi bài kiểm tra, hệ thống tự động soạn tin nhắn chi tiết gửi từng phụ huynh và cấp Giấy Khen khi đạt ≥ 80%!
            </p>
          </div>

          {/* Mode Switcher (Teacher only sees Tracking tab) */}
          {userRole === 'teacher' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Phần Học Sinh Làm Bài
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  activeTab === 'teacher'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Cô Diễm Quỳnh Theo Dõi ({submissions.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Link Strip for Teacher */}
        {userRole === 'teacher' && (
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-medium">
              <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Link bài tập về nhà gửi học sinh (đã tích hợp sẵn mã <b className="font-mono">{CORRECT_PIN}</b>):</span>
            </div>
            <button
              onClick={handleCopyShareLink}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã Sao Chép Link Kèm Mã!' : 'Sao Chép Link Gửi Lớp'}</span>
            </button>
          </div>
        )}
      </div>

      {/* TEACHER LIVE TRACKING VIEW */}
      {userRole === 'teacher' && activeTab === 'teacher' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Theo Dõi Thời Gian Thực · Cô Diễm Quỳnh
              </span>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">
                Giám Sát Nộp Bài & Nhắn Tin Phụ Huynh
              </h4>
              <p className="text-xs text-slate-500">
                Theo dõi học sinh đã tham gia nộp bài và học sinh CHƯA NỘP để kịp thời nhắc nhở phụ huynh.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {teacherSubTab === 'submitted' ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowBatchSmsModal(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Báo Cáo Điểm Tất Cả PH</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowBatchReminderModal(true);
                  }}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Gửi SMS Nhắc Tất Cả ({unsubmittedStudents.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation: Đã nộp vs Chưa nộp vs Radar Chống Chuyển Tab */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setTeacherSubTab('submitted');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                teacherSubTab === 'submitted'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã Tham Gia Nộp Bài ({submissions.length})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setTeacherSubTab('unsubmitted');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                teacherSubTab === 'unsubmitted'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>CHƯA THAM GIA NỘP BÀI ({unsubmittedStudents.length})</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setTeacherSubTab('anticheat');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                teacherSubTab === 'anticheat'
                  ? 'bg-rose-950 text-white shadow-sm border border-rose-700 ring-2 ring-rose-500'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Radar Chống Chuyển Tab (Live)</span>
            </button>
          </div>

          {/* Table 1: Submissions (Đã nộp) */}
          {teacherSubTab === 'submitted' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Học Sinh</th>
                    <th className="py-3 px-4">Phụ Huynh & SĐT</th>
                    <th className="py-3 px-3 text-center bg-emerald-50/60 text-emerald-900 border-x border-emerald-100 min-w-[100px]">
                      🕒 Giờ Vào Làm
                    </th>
                    <th className="py-3 px-3 text-center bg-blue-50/60 text-blue-900 border-r border-blue-100 min-w-[100px]">
                      🏁 Giờ Ra / Nộp
                    </th>
                    <th className="py-3 px-3 text-center min-w-[90px]">Thời Lượng</th>
                    <th className="py-3 px-3">Phân Môn</th>
                    <th className="py-3 px-3 text-right">Điểm Số</th>
                    <th className="py-3 px-3 text-right">Độ Đúng</th>
                    <th className="py-3 px-3 text-center">Giấy Khen</th>
                    <th className="py-3 px-3 text-center">Chống Chuyển Tab</th>
                    <th className="py-3 px-4 text-center">Báo Phụ Huynh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {submissions.map((sub) => {
                    const branchLabel = 
                      sub.branch === 'algebra' ? 'Số Học & Đại Số' :
                      sub.branch === 'geometry' ? 'Hình Học & Đo Lường' : 'Thống Kê & Xác Suất';
                    const phone = sub.parentPhone || students.find(s => s.name === sub.studentName)?.parentPhone || '0912345678';
                    const parent = sub.parentName || students.find(s => s.name === sub.studentName)?.parentName || `Phụ huynh em ${sub.studentName}`;
                    const switches = sub.tabSwitchesCount || 0;
                    const away = sub.totalAwayTimeSec || 0;
                    const entryDisplay = sub.entryTime || sub.submittedAt.split(' ')[0] || '19:42:15';
                    const exitDisplay = sub.exitTime || sub.submittedAt.split(' ')[0] || '19:45:19';
                    const mins = Math.floor((sub.timeSpentSec || 180) / 60);
                    const secs = ((sub.timeSpentSec || 180) % 60).toString().padStart(2, '0');

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                            {sub.studentName.slice(0, 1)}
                          </div>
                          <span>{sub.studentName}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{parent}</span>
                            <span className="font-mono text-indigo-600 text-[11px] font-bold">{phone}</span>
                          </div>
                        </td>

                        {/* ENTRY TIME */}
                        <td className="py-3 px-3 text-center font-mono bg-emerald-50/20 border-x border-emerald-100">
                          <span className="font-black text-xs text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs inline-block">
                            🟢 {entryDisplay}
                          </span>
                        </td>

                        {/* EXIT TIME */}
                        <td className="py-3 px-3 text-center font-mono bg-blue-50/20 border-r border-blue-100">
                          <span className="font-black text-xs text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs inline-block">
                            🏁 {exitDisplay}
                          </span>
                        </td>

                        {/* DURATION */}
                        <td className="py-3 px-3 text-center font-mono text-slate-600 font-semibold">
                          {mins}p {secs}s
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold text-[11px]">
                            {branchLabel}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 text-sm">
                          {sub.score.toFixed(1)}/10
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                          {sub.accuracy}%
                        </td>

                        <td className="py-3 px-3 text-center">
                          {sub.certificateAwarded ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-bold">
                              <Award className="w-3 h-3 text-amber-600" /> Giấy Khen
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">&lt; 80%</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {switches === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-bold">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Trung thực (0)
                            </span>
                          ) : switches < 3 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-bold">
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> {switches} lần ({away}s)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md text-[11px] font-black animate-pulse">
                              <ShieldAlert className="w-3 h-3 text-rose-600" /> Vi phạm ({switches} lần)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setSmsSubmission({
                                ...sub,
                                parentPhone: phone,
                                parentName: parent
                              });
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                            title="Gửi tin nhắn thông báo kết quả cho phụ huynh"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nhắn Tin</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                        Chưa có học sinh nào nộp bài. Gửi mã <b>20112002</b> cho các em để bắt đầu làm bài tập về nhà!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SubTab 3: Anti-Cheat Live Radar Panel */}
          {teacherSubTab === 'anticheat' && (
            <AntiCheatMonitorPanel
              students={students}
              classroom={classrooms[0] || {
                id: 'c1',
                name: 'Lớp 6A - Toán Học',
                grade: 'Lớp 6',
                studentCount: students.length,
                classCode: CORRECT_PIN,
                subjectTeacher: 'Cô Diễm Quỳnh',
                homeroomTeacher: 'Thầy Nguyễn Văn An'
              }}
              submissions={submissions}
            />
          )}

          {/* Table 2: Unsubmitted Students (Chưa nộp) */}
          {teacherSubTab === 'unsubmitted' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Hiện có <b>{unsubmittedStudents.length} học sinh</b> chưa nộp bài tập về nhà. Cô Diễm Quỳnh có thể gửi tin nhắn nhắc nhở trực tiếp tới phụ huynh từng em.
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Học Sinh Chưa Nộp</th>
                      <th className="py-3 px-4">Phụ Huynh & Số Điện Thoại</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-4 text-center">Nhắc Nhở Phụ Huynh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {unsubmittedStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs uppercase">
                            {st.name.slice(0, 1)}
                          </div>
                          <div>
                            <span className="block">{st.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">Mã HS: {st.id}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">
                              {st.parentName || 'Phụ huynh'}
                            </span>
                            <span className="font-mono text-indigo-600 text-[11px] font-bold">
                              {st.parentPhone}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold">
                            ⚠️ Chưa Làm Bài
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setReminderStudent(st);
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Phone className="w-3.5 h-3.5 text-rose-600" />
                            <span>Nhắn Nhắc Nhở</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {unsubmittedStudents.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-emerald-600 font-bold text-xs">
                          🎉 Tuyệt vời! 100% học sinh trong lớp đã hoàn thành bài tập về nhà!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STUDENT HOMEWORK VIEW */}
      {activeTab === 'student' && (
        <div>
          {/* Step 1: PIN Gate if not authenticated */}
          {!isAuthenticated ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 border border-indigo-100">
                <KeyRound className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">
                Nhập Mã Vào Lớp Của Cô Diễm Quỳnh
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                Nhập mã 8 số do Cô Diễm Quỳnh cung cấp để mở khóa đề bài tập về nhà.
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={8}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="20112002"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-xl font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errorMessage && (
                    <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {errorMessage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Xác Thực & Vào Làm Bài
                </button>
              </form>
            </div>
          ) : !isSessionActive && !isSubmitted ? (
            /* Step 2: Select Student & Branch Setup */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto space-y-6">
              {savedHwSession && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white rounded-2xl shadow-lg border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>BÀI TẬP VỀ NHÀ ĐANG LÀM DỞ DANG</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Thí sinh: {savedHwSession.studentName} · Đã làm {savedHwSession.answeredCount}/{savedHwSession.totalQuestions} câu · Còn lại {Math.floor(savedHwSession.timeLeft / 60)} phút
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playCorrect();
                        setIsSessionActive(true);
                      }}
                      className="px-4 py-2 bg-white text-orange-700 hover:bg-amber-50 font-black text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Tiếp Tục Làm
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelHomework}
                      className="px-3 py-2 bg-black/20 hover:bg-black/30 text-white font-semibold text-xs rounded-xl border border-white/20 cursor-pointer"
                    >
                      Hủy Bài Này
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                  Lớp Học Toán THCS · Cô Diễm Quỳnh
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Thiết Lập Bài Kiểm Tra Về Nhà
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mã lớp hợp lệ: <b className="font-mono text-indigo-700">{CORRECT_PIN}</b>. Thời gian cố định: <b>10 phút</b>.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chọn học sinh tham gia:
                  </label>
                  <select
                    value={selectedStudentName}
                    onChange={(e) => setSelectedStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.parentName || 'Phụ huynh'} - SĐT: {s.parentPhone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chọn phân môn kiểm tra:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBranch('algebra')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedBranch === 'algebra'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t.algebraBranch}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBranch('geometry')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedBranch === 'geometry'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t.geometryBranch}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBranch('statistics')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedBranch === 'statistics'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t.statisticsBranch}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <b>Mục tiêu Giấy Khen:</b> Đúng từ 5/6 câu (≥ 83%) trở lên để nhận Giấy Khen Danh Dự chính thức từ Cô Diễm Quỳnh.
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <b>Không có Camera hoặc chưa cấp quyền?</b> Bạn hoàn toàn yên tâm làm bài bình thường! Hệ thống tự động kích hoạt Chế độ Giám Sát AI & Radar Chống Chuyển Tab để ghi nhận kết quả và cấp Giấy Khen đầy đủ.
                  </span>
                </div>

                <button
                  onClick={handleStartHomework}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" /> Bắt Đầu Làm Bài Về Nhà Ngay
                </button>
              </div>
            </div>
          ) : isSessionActive && currentQ ? (
            /* Step 3: Homework In Progress with CENTER CIRCULAR WEBCAM & FIXED TIMER & ANTI-CHEAT */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto space-y-6 relative">
              {/* Remote Teacher Warning Banner (From Cô Diễm Quỳnh) */}
              {remoteTeacherWarning && (
                <div className="p-4 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white rounded-2xl shadow-lg border border-amber-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce text-amber-200" />
                    <div>
                      <span className="font-extrabold text-xs tracking-wider uppercase block text-amber-100">
                        📢 Lời Nhắc Trực Tiếp Từ Cô Diễm Quỳnh:
                      </span>
                      <p className="text-xs font-medium text-white">{remoteTeacherWarning}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRemoteTeacherWarning(null)}
                    className="px-3 py-1.5 bg-white text-slate-900 font-bold rounded-lg text-xs hover:bg-amber-50 shrink-0 transition-colors shadow-xs"
                  >
                    Đã Hiểu
                  </button>
                </div>
              )}

              {/* Student Anti-Cheat Violation Modal Overlay */}
              {antiCheatAlert && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 text-center space-y-4 animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <ShieldAlert className="w-9 h-9" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                        Cảnh Báo Rời Màn Hình (Lần {antiCheatAlert.count}/3)
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        Phát Hiện Học Sinh Rời Tab Bài Thi!
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Hệ thống ghi nhận em vừa chuyển tab trình duyệt hoặc Alt-Tab ra khỏi màn hình bài làm tại <b>Câu số {antiCheatAlert.incident.questionNumber}</b>.
                      </p>
                    </div>

                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs text-rose-900 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        Tín hiệu vi phạm đã tự động truyền về máy Cô Diễm Quỳnh
                      </div>
                      <p className="text-[11px] text-rose-700">
                        Thời điểm: <b>{antiCheatAlert.incident.timestamp}</b> · Quy chế: Nghiêm cấm mở tab tra cứu kết quả trên mạng.
                      </p>
                      {antiCheatAlert.count >= 3 ? (
                        <p className="text-[11px] font-black text-rose-900 bg-rose-200/80 p-2 rounded-lg mt-1 border border-rose-300">
                          🚨 EM ĐÃ VI PHẠM 3 LẦN: Toàn bộ lịch sử rời tab đã được lưu và gửi trực tiếp vào báo cáo của Cô Diễm Quỳnh gửi Phụ huynh!
                        </p>
                      ) : (
                        <p className="text-[11px] font-semibold text-rose-700">
                          ⚠️ Nhắc nhở: Chuyển tab thêm {3 - antiCheatAlert.count} lần nữa bài làm sẽ bị đánh dấu vi phạm quy chế nghiêm trọng.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setAntiCheatAlert(null);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      Em Cam Kết Tập Trung Làm Bài Trung Thực (Đã Hiểu)
                    </button>
                  </div>
                </div>
              )}

              {/* Top Bar with Fixed Timer & Anti-Cheat Radar Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-slate-500 block">Thí sinh làm bài:</span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {selectedStudentName}
                    <span className="font-mono text-indigo-600 font-normal">({CORRECT_PIN})</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Auto-save indicator */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span>Đã lưu tự động</span>
                  </div>

                  {/* Anti-cheat Live Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Giám sát tab: Bật</span>
                  </div>

                  {/* Fixed Timer Display */}
                  <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold ${
                    timeLeft <= 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-sans text-slate-500 font-normal">còn</span>
                  </div>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancelHomework}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                    title="Hủy bài làm dở dang này"
                  >
                    Hủy bài
                  </button>
                </div>
              </div>

              {/* CIRCULAR WEBCAM IN THE CENTER */}
              <div className="flex flex-col items-center justify-center py-2 bg-slate-50/60 rounded-2xl border border-slate-100">
                <WebcamCircle isExamActive={true} />
              </div>

              {/* Current Question Progress */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600">
                  Câu hỏi {currentQIndex + 1}/{activeQuestions.length} ({currentQ.grade} · {currentQ.topicName})
                </span>
                <span className="text-[11px] font-mono">
                  Đã trả lời: {Object.keys(userAnswers).length}/{activeQuestions.length}
                </span>
              </div>

              {/* Question Content */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 leading-relaxed">
                  <MathView math={currentQ.questionText} />
                </h3>
                {currentQ.formula && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-center text-lg font-bold text-indigo-700 my-3 shadow-xs">
                    <MathView math={currentQ.formula} displayMode={true} />
                  </div>
                )}

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQIndex] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200 shadow-xs'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>
                          <MathView math={opt} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation & Submit */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Câu Trước
                </button>

                {currentQIndex < activeQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Câu Tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitHomework}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.submitHomework}</span>
                  </button>
                )}
              </div>
            </div>
          ) : isSubmitted ? (
            /* Step 4: Submission Results, Certificate & PARENT NOTIFICATION */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto text-center space-y-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-inner ${
                resultAccuracy >= 80 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-700'
              }`}>
                {resultAccuracy >= 80 ? <Award className="w-9 h-9" /> : <BookOpen className="w-8 h-8" />}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Đã Hoàn Thành Bài Kiểm Tra Về Nhà
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Kết Quả Của {selectedStudentName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <span className="text-xs text-indigo-700 block font-medium">Điểm Đánh Giá</span>
                  <span className="text-3xl font-black text-indigo-700 font-mono">{resultScore.toFixed(1)}/10</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-xs text-emerald-700 block font-medium">Độ Chính Xác</span>
                  <span className="text-3xl font-black text-emerald-700 font-mono">{resultAccuracy}%</span>
                </div>
              </div>

              {/* INTEGRITY / ANTI-CHEAT RESULT BADGE */}
              <div className="p-4 rounded-2xl border text-left text-xs space-y-2 max-w-sm mx-auto shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Đánh Giá Tính Trung Thực:
                  </span>
                  {(lastProctorStats?.tabSwitchesCount || 0) === 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> 100% Trung Thực
                    </span>
                  ) : (lastProctorStats?.tabSwitchesCount || 0) < 3 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Cần Lưu Ý ({lastProctorStats?.tabSwitchesCount} lần)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[11px] flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Vi Phạm ({lastProctorStats?.tabSwitchesCount} lần)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {(lastProctorStats?.tabSwitchesCount || 0) === 0
                    ? 'Em hoàn thành bài tập với sự tập trung tuyệt đối, không có bất kỳ hành vi chuyển tab hay tra cứu ngoài nào.'
                    : `Hệ thống ghi nhận ${lastProctorStats?.tabSwitchesCount} lần rời màn hình (tổng thời gian: ${lastProctorStats?.totalAwayTimeSec || 0}s). Dữ liệu này đã được lưu vào báo cáo gửi Cô Diễm Quỳnh.`
                  }
                </p>
              </div>

              {resultAccuracy >= 80 ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 space-y-2">
                  <div className="font-extrabold text-sm text-amber-800 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    CHÚC MỪNG EM ĐẠT ĐƯỢC GIẤY KHEN DANH DỰ!
                  </div>
                  <p className="text-amber-700">
                    Thành tích của em đã vượt mốc 80% câu hỏi đúng. Cô Diễm Quỳnh đã cấp Giấy Khen chính thức có mã lớp <b>{CORRECT_PIN}</b>.
                  </p>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <Award className="w-4 h-4" /> Xem & In Giấy Khen
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
                  Em đạt {resultAccuracy}%, cố gắng thêm một chút (≥ 80%) ở lần làm sau để nhận Giấy Khen Danh Dự nhé!
                </div>
              )}

              {/* AUTOMATED PARENT SMS DISPATCH CARD */}
              <div className="p-5 bg-gradient-to-b from-emerald-50/70 to-slate-50 border border-emerald-200 rounded-2xl text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Thông Báo Kết Quả Đến Phụ Huynh
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    SĐT: {currentStudentObj?.parentPhone || '0912345678'}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {composeParentSms(
                    selectedStudentName,
                    currentStudentObj?.parentName || 'Phụ huynh',
                    resultScore,
                    resultAccuracy,
                    submittedTimeSpent,
                    selectedBranch,
                    lastProctorStats?.tabSwitchesCount || 0,
                    lastProctorStats?.totalAwayTimeSec || 0
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleCopyText(composeParentSms(
                      selectedStudentName,
                      currentStudentObj?.parentName || 'Phụ huynh',
                      resultScore,
                      resultAccuracy,
                      submittedTimeSpent,
                      selectedBranch,
                      lastProctorStats?.tabSwitchesCount || 0,
                      lastProctorStats?.totalAwayTimeSec || 0
                    ))}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSms ? 'Đã Sao Chép!' : 'Sao Chép Tin Nhắn'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://zalo.me/${(currentStudentObj?.parentPhone || '0912345678').replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Mở Zalo
                    </a>

                    <a
                      href={`sms:${(currentStudentObj?.parentPhone || '0912345678').replace(/\s+/g, '')}?body=${encodeURIComponent(
                        composeParentSms(
                          selectedStudentName,
                          currentStudentObj?.parentName || 'Phụ huynh',
                          resultScore,
                          resultAccuracy,
                          submittedTimeSpent,
                          selectedBranch,
                          lastProctorStats?.tabSwitchesCount || 0,
                          lastProctorStats?.totalAwayTimeSec || 0
                        )
                      )}`}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Gửi SMS Cho Phụ Huynh
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartHomework}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Làm Lại Bài Tập Khác
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          studentName={selectedStudentName}
          score={resultScore}
          totalQuestions={activeQuestions.length}
          accuracy={resultAccuracy}
          classCode={CORRECT_PIN}
          language={language}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* TEACHER SMS DISPATCH MODAL */}
      {smsSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Gửi Tin Nhắn Báo Cáo Cho Phụ Huynh
                </h4>
                <p className="text-xs text-slate-500">
                  Học sinh: <b>{smsSubmission.studentName}</b> · Phụ huynh: <b>{smsSubmission.parentName}</b> ({smsSubmission.parentPhone})
                </p>
              </div>
              <button
                onClick={() => setSmsSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-slate-700 block">Nội dung tin nhắn Cô Diễm Quỳnh gửi:</label>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {composeParentSms(
                  smsSubmission.studentName,
                  smsSubmission.parentName || 'Phụ huynh',
                  smsSubmission.score,
                  smsSubmission.accuracy,
                  smsSubmission.timeSpentSec,
                  smsSubmission.branch,
                  smsSubmission.tabSwitchesCount || 0,
                  smsSubmission.totalAwayTimeSec || 0
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyText(composeParentSms(
                  smsSubmission.studentName,
                  smsSubmission.parentName || 'Phụ huynh',
                  smsSubmission.score,
                  smsSubmission.accuracy,
                  smsSubmission.timeSpentSec,
                  smsSubmission.branch,
                  smsSubmission.tabSwitchesCount || 0,
                  smsSubmission.totalAwayTimeSec || 0
                ))}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {copiedSms ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Đã Sao Chép!' : 'Sao Chép'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://zalo.me/${(smsSubmission.parentPhone || '0912345678').replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở Zalo
                </a>

                <a
                  href={`sms:${(smsSubmission.parentPhone || '0912345678').replace(/\s+/g, '')}?body=${encodeURIComponent(
                    composeParentSms(
                      smsSubmission.studentName,
                      smsSubmission.parentName || 'Phụ huynh',
                      smsSubmission.score,
                      smsSubmission.accuracy,
                      smsSubmission.timeSpentSec,
                      smsSubmission.branch,
                      smsSubmission.tabSwitchesCount || 0,
                      smsSubmission.totalAwayTimeSec || 0
                    )
                  )}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi SMS Ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH SMS NOTICE MODAL FOR ALL SUBMITTED STUDENTS */}
      {showBatchSmsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Báo Cáo Tổng Hợp Gửi Phụ Huynh Đã Nộp Bài
                </h4>
                <p className="text-xs text-slate-500">
                  Tổng hợp {submissions.length} học sinh đã hoàn thành bài tập về nhà môn Toán (Kèm kiểm tra chuyển tab).
                </p>
              </div>
              <button
                onClick={() => setShowBatchSmsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                Cô Diễm Quỳnh có thể sao chép nhanh báo cáo danh sách điểm số này để gửi vào nhóm Zalo / SMS Phụ Huynh Lớp:
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
{`[BÁO CÁO BÀI TẬP VỀ NHÀ MÔN TOÁN THCS - CÔ DIỄM QUỲNH]
Mã vào lớp: 20112002 | Ngày: 24/10/2026
---------------------------------------------
${submissions.map((s, i) => {
  const cheatText = s.tabSwitchesCount && s.tabSwitchesCount > 0 ? `[⚠️ Rời tab ${s.tabSwitchesCount} lần - ${s.totalAwayTimeSec || 0}s]` : '[🟢 100% Trung thực]';
  return `${i + 1}. ${s.studentName} - Điểm: ${s.score.toFixed(1)}/10 (${s.accuracy}%) - ${cheatText} - ${s.certificateAwarded ? '🌟 Đạt Giấy khen' : 'Đã nộp bài'} (SĐT PH: ${s.parentPhone || '0912345678'})`;
}).join('\n')}
---------------------------------------------
Kính mong Quý Phụ huynh biểu dương các em đạt điểm cao, khuyến khích tính trung thực và nhắc nhở các em chưa nộp bài hoàn thành sớm!`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowBatchSmsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => handleCopyText(`[BÁO CÁO BÀI TẬP VỀ NHÀ MÔN TOÁN THCS - CÔ DIỄM QUỲNH]\nMã vào lớp: 20112002 | Ngày: 24/10/2026\n---------------------------------------------\n${submissions.map((s, i) => {
  const cheatText = s.tabSwitchesCount && s.tabSwitchesCount > 0 ? `[⚠️ Rời tab ${s.tabSwitchesCount} lần - ${s.totalAwayTimeSec || 0}s]` : '[🟢 100% Trung thực]';
  return `${i + 1}. ${s.studentName} - Điểm: ${s.score.toFixed(1)}/10 (${s.accuracy}%) - ${cheatText} - ${s.certificateAwarded ? '🌟 Đạt Giấy khen' : 'Đã nộp bài'} (SĐT PH: ${s.parentPhone || '0912345678'})`;
}).join('\n')}\n---------------------------------------------\nKính mong Quý Phụ huynh biểu dương các em đạt điểm cao, khuyến khích tính trung thực và nhắc nhở các em chưa nộp bài hoàn thành sớm!`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {copiedSms ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Đã Sao Chép Báo Cáo!' : 'Sao Chép Báo Cáo Gửi Phụ Huynh'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL REMINDER MODAL FOR UNFINISHED HOMEWORK */}
      {reminderStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  Gửi Tin Nhắn Nhắc Nhở Phụ Huynh
                </h4>
                <p className="text-xs text-slate-500">
                  Học sinh: <b>{reminderStudent.name}</b> · SĐT PH: <b>{reminderStudent.parentPhone}</b>
                </p>
              </div>
              <button
                onClick={() => setReminderStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-slate-700 block">Nội dung tin nhắn Cô Diễm Quỳnh soạn sẵn:</label>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                {composeReminderSms(reminderStudent.name, reminderStudent.parentName || 'Phụ huynh')}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyText(composeReminderSms(reminderStudent.name, reminderStudent.parentName || 'Phụ huynh'))}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {copiedSms ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Đã Sao Chép!' : 'Sao Chép'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://zalo.me/${reminderStudent.parentPhone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở Zalo
                </a>

                <a
                  href={`sms:${reminderStudent.parentPhone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                    composeReminderSms(reminderStudent.name, reminderStudent.parentName || 'Phụ huynh')
                  )}`}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi SMS Nhắc Ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH REMINDER NOTICE MODAL FOR ALL UNFINISHED STUDENTS */}
      {showBatchReminderModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Gửi Tin Nhắn Nhắc Nhở Tất Cả Học Sinh Chưa Nộp Bài
                </h4>
                <p className="text-xs text-slate-500">
                  Danh sách gồm {unsubmittedStudents.length} học sinh chưa nộp bài tập về nhà.
                </p>
              </div>
              <button
                onClick={() => setShowBatchReminderModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                Cô Diễm Quỳnh có thể sao chép thông báo này để dán vào nhóm Zalo chung của lớp hoặc gửi SMS thông báo:
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
{`[THÔNG BÁO NHẮC NHỞ BTVN TOÁN THCS - CÔ DIỄM QUỲNH]
Mã vào lớp: 20112002 | Hạn chót: Hôm nay
---------------------------------------------
Danh sách các em học sinh hiện CHƯA HOÀN THÀNH bài tập về nhà:
${unsubmittedStudents.map((s, i) => `${i + 1}. ${s.name} (SĐT PH: ${s.parentPhone})`).join('\n')}
---------------------------------------------
Kính nhờ Quý Phụ huynh nhắc các em truy cập và nhập mã lớp 20112002 để hoàn thành bài nộp có camera giám sát. Xin trân trọng cảm ơn!`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowBatchReminderModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => handleCopyText(`[THÔNG BÁO NHẮC NHỞ BTVN TOÁN THCS - CÔ DIỄM QUỲNH]\nMã vào lớp: 20112002 | Hạn chót: Hôm nay\n---------------------------------------------\nDanh sách các em học sinh hiện CHƯA HOÀN THÀNH bài tập về nhà:\n${unsubmittedStudents.map((s, i) => `${i + 1}. ${s.name} (SĐT PH: ${s.parentPhone})`).join('\n')}\n---------------------------------------------\nKính nhờ Quý Phụ huynh nhắc các em truy cập và nhập mã lớp 20112002 để hoàn thành bài nộp có camera giám sát. Xin trân trọng cảm ơn!`)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {copiedSms ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Đã Sao Chép Lời Nhắc!' : 'Sao Chép Lời Nhắc Gửi Nhóm Lớp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
