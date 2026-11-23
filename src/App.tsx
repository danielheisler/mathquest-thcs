/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Classroom, Student, Question, LeaderboardEntry, HomeworkSubmission, MainPortal, ExamResult, TeacherRole, SemesterExam } from './types/math';
import { initialClassrooms, initialStudents, initialQuestions, initialLeaderboard } from './data/defaultData';
import { Navbar, NavTab } from './components/Navbar';
import { SoloGamesHub } from './components/solo/SoloGamesHub';
import { TeamArenaHub } from './components/team/TeamArenaHub';
import { InteractiveLabsHub } from './components/labs/InteractiveLabsHub';
import { ClassroomManager } from './components/classroom/ClassroomManager';
import { ClassroomSeatingChart } from './components/classroom/ClassroomSeatingChart';
import { VnEduGradebook } from './components/classroom/VnEduGradebook';
import { CustomGameStudio } from './components/games/CustomGameStudio';
import { initialVnEduRecords } from './data/vneduData';
import { QuestionBank } from './components/questions/QuestionBank';
import { StudentProgress } from './components/analytics/StudentProgress';
import { ReportCardGenerator } from './components/reports/ReportCardGenerator';
import { HomeworkPortal } from './components/homework/HomeworkPortal';
import { AntiCheatMonitorPanel } from './components/classroom/AntiCheatMonitorPanel';
import { AIMathDuel } from './components/ai/AIMathDuel';
import { SemesterExamPortal } from './components/exams/SemesterExamPortal';
import { AIExamGenerator } from './components/exams/AIExamGenerator';
import { BodyCameraGamesHub } from './components/camera_games/BodyCameraGamesHub';
import { ParentPortal } from './components/parent/ParentPortal';
import { PortalPasscodeGate } from './components/auth/PortalPasscodeGate';
import { PinSettingsModal } from './components/auth/PinSettingsModal';
import { soundManager } from './utils/sound';
import { Language, translations } from './i18n/translations';

const initialHomeworkSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    studentId: 's1',
    studentName: 'Nguyễn Minh Quân',
    classCode: '20112002',
    submittedAt: '24/10/2026 19:45:19',
    entryTime: '19:42:15',
    exitTime: '19:45:19',
    score: 9,
    totalQuestions: 10,
    accuracy: 90,
    timeSpentSec: 184,
    certificateAwarded: true,
    branch: 'algebra',
    parentPhone: '0912345678',
    parentName: 'Bác Nguyễn Minh Đức (Bố)',
    tabSwitchesCount: 0,
    totalAwayTimeSec: 0,
    integrityStatus: 'honest'
  },
  {
    id: 'sub-2',
    studentId: 's5',
    studentName: 'Vũ Đức Trọng',
    classCode: '20112002',
    submittedAt: '24/10/2026 20:10:32',
    entryTime: '20:07:40',
    exitTime: '20:10:32',
    score: 10,
    totalQuestions: 10,
    accuracy: 100,
    timeSpentSec: 172,
    certificateAwarded: true,
    branch: 'algebra',
    parentPhone: '0918765432',
    parentName: 'Bác Vũ Văn Hùng (Bố)',
    tabSwitchesCount: 1,
    totalAwayTimeSec: 15,
    integrityStatus: 'suspicious',
    incidentLogs: [
      {
        id: 'inc-seed-1',
        studentId: 's5',
        studentName: 'Vũ Đức Trọng',
        classCode: '20112002',
        timestamp: '20:09:15',
        type: 'tab_switch',
        durationSec: 15,
        questionNumber: 4,
        details: 'Học sinh chuyển sang tab Google Tìm Kiếm tại Câu số 4 · Rời màn hình 15 giây',
        severity: 'medium'
      }
    ]
  },
  {
    id: 'sub-3',
    studentId: 's2',
    studentName: 'Lê Hoàng Bảo Ngọc',
    classCode: '20112002',
    submittedAt: '24/10/2026 20:30:10',
    entryTime: '20:26:40',
    exitTime: '20:30:10',
    score: 8,
    totalQuestions: 10,
    accuracy: 80,
    timeSpentSec: 210,
    certificateAwarded: true,
    branch: 'geometry',
    parentPhone: '0983456789',
    parentName: 'Cô Hoàng Thu Thảo (Mẹ)',
    tabSwitchesCount: 0,
    totalAwayTimeSec: 0,
    integrityStatus: 'honest'
  },
  {
    id: 'sub-4',
    studentId: 's6',
    studentName: 'Dương Khánh Linh',
    classCode: '20112002',
    submittedAt: '24/10/2026 21:05:45',
    entryTime: '21:01:23',
    exitTime: '21:05:45',
    score: 7,
    totalQuestions: 10,
    accuracy: 70,
    timeSpentSec: 262,
    certificateAwarded: false,
    branch: 'statistics',
    parentPhone: '0915678901',
    parentName: 'Cô Dương Thị Bích (Mẹ)',
    tabSwitchesCount: 3,
    totalAwayTimeSec: 42,
    integrityStatus: 'cheated',
    incidentLogs: [
      {
        id: 'inc-seed-2',
        studentId: 's6',
        studentName: 'Dương Khánh Linh',
        classCode: '20112002',
        timestamp: '21:03:12',
        type: 'tab_switch',
        durationSec: 22,
        questionNumber: 6,
        details: 'Học sinh chuyển tab tra cứu kết quả tại Câu số 6 (Lần 3) · Rời màn hình 22 giây',
        severity: 'high'
      }
    ]
  },
  {
    id: 'sub-5',
    studentId: 's3',
    studentName: 'Trần Gia Hưng',
    classCode: '20112002',
    submittedAt: '25/10/2026 19:15:30',
    entryTime: '19:12:00',
    exitTime: '19:15:30',
    score: 9.5,
    totalQuestions: 10,
    accuracy: 95,
    timeSpentSec: 210,
    certificateAwarded: true,
    branch: 'algebra',
    parentPhone: '0912345679',
    parentName: 'Bác Trần Văn An',
    tabSwitchesCount: 0,
    totalAwayTimeSec: 0,
    integrityStatus: 'honest'
  },
  {
    id: 'sub-6',
    studentId: 's4',
    studentName: 'Phạm Quỳnh Anh',
    classCode: '20112002',
    submittedAt: '25/10/2026 19:35:10',
    entryTime: '19:31:50',
    exitTime: '19:35:10',
    score: 9.0,
    totalQuestions: 10,
    accuracy: 90,
    timeSpentSec: 200,
    certificateAwarded: true,
    branch: 'algebra',
    parentPhone: '0912345680',
    parentName: 'Cô Phạm Thị Mai',
    tabSwitchesCount: 0,
    totalAwayTimeSec: 0,
    integrityStatus: 'honest'
  }
];

export default function App() {
  const [mainPortal, setMainPortal] = useState<MainPortal>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'parent') return 'parent';
      if (params.get('portal') === 'teacher') return 'teacher';
      
      // If there is an active exam or homework session, ensure student portal is focused
      try {
        const examSession = localStorage.getItem('mathquest_ongoing_exam_session');
        if (examSession && JSON.parse(examSession)?.isExamActive) return 'student';
        const hwSession = localStorage.getItem('mathquest_ongoing_homework_session');
        if (hwSession && JSON.parse(hwSession)?.isSessionActive) return 'student';
      } catch {}

      const saved = localStorage.getItem('mathquest_active_portal');
      if (saved === 'student' || saved === 'parent' || saved === 'teacher') return saved;
    }
    return 'student';
  });

  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('code')) return 'homework';
      if (params.get('portal') === 'parent') return 'parent_portal';

      // If there is an active exam in progress, auto-focus onto exams tab
      try {
        const examSession = localStorage.getItem('mathquest_ongoing_exam_session');
        if (examSession) {
          const parsed = JSON.parse(examSession);
          if (parsed?.isExamActive) return 'exams';
        }
      } catch {}

      // If there is an active homework in progress, auto-focus onto homework tab
      try {
        const hwSession = localStorage.getItem('mathquest_ongoing_homework_session');
        if (hwSession) {
          const parsed = JSON.parse(hwSession);
          if (parsed?.isSessionActive) return 'homework';
        }
      } catch {}

      const saved = localStorage.getItem('mathquest_active_tab') as NavTab;
      if (saved) return saved;
    }
    return 'solo';
  });

  const [ongoingExamInfo, setOngoingExamInfo] = useState<{
    type: 'exam' | 'homework';
    title: string;
    studentName: string;
    timeLeft: number;
    answeredCount: number;
    totalQuestions: number;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const examSaved = localStorage.getItem('mathquest_ongoing_exam_session');
      if (examSaved) {
        const parsed = JSON.parse(examSaved);
        if (parsed?.isExamActive) {
          return {
            type: 'exam',
            title: parsed.examTitle || 'Đề thi học kỳ',
            studentName: parsed.studentName,
            timeLeft: Math.max(0, parsed.timeLeft ?? 0),
            answeredCount: parsed.answeredCount || 0,
            totalQuestions: parsed.totalQuestions || 20
          };
        }
      }
      const hwSaved = localStorage.getItem('mathquest_ongoing_homework_session');
      if (hwSaved) {
        const parsed = JSON.parse(hwSaved);
        if (parsed?.isSessionActive) {
          return {
            type: 'homework',
            title: `Bài tập về nhà (${parsed.branch === 'geometry' ? 'Hình học' : parsed.branch === 'statistics' ? 'Thống kê' : 'Đại số'})`,
            studentName: parsed.studentName,
            timeLeft: Math.max(0, parsed.timeLeft ?? 0),
            answeredCount: parsed.answeredCount || 0,
            totalQuestions: parsed.totalQuestions || 6
          };
        }
      }
    } catch {}
    return null;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mathquest_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [teacherRole, setTeacherRole] = useState<TeacherRole>('subject_teacher');

  // Passcodes for Parent and Teacher Portals
  const [teacherPin, setTeacherPin] = useState<string>(() => {
    return localStorage.getItem('mathquest_teacher_pin') || '20112002';
  });

  const [parentPin, setParentPin] = useState<string>(() => {
    return localStorage.getItem('mathquest_parent_pin') || 'PH20112002';
  });

  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mathquest_teacher_auth') === 'true';
    }
    return false;
  });

  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mathquest_parent_auth') === 'true';
    }
    return false;
  });

  const [authenticatedParentPhone, setAuthenticatedParentPhone] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mathquest_parent_phone') || undefined;
    }
    return undefined;
  });

  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState<boolean>(false);

  // Online / Offline Status
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persistent or initial state
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('mathquest_classrooms');
    if (saved) {
      try {
        const parsed: Classroom[] = JSON.parse(saved);
        const updated = parsed.map((c: any) => ({
          ...c,
          homeroomTeacher: 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
          subjectTeacher: 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
          duties: c.duties || 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS'
        }));
        localStorage.setItem('mathquest_classrooms', JSON.stringify(updated));
        return updated;
      } catch {}
    }
    return initialClassrooms;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('mathquest_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('mathquest_questions');
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('mathquest_leaderboard');
    return saved ? JSON.parse(saved) : initialLeaderboard;
  });

  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(() => {
    const saved = localStorage.getItem('mathquest_homework_submissions');
    return saved ? JSON.parse(saved) : initialHomeworkSubmissions;
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('mathquest_exam_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiExams, setAiExams] = useState<SemesterExam[]>(() => {
    try {
      const saved = localStorage.getItem('mathquest_ai_exams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [preselectedExamId, setPreselectedExamId] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mathquest_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mathquest_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('mathquest_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mathquest_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('mathquest_leaderboard', JSON.stringify(leaderboardEntries));
  }, [leaderboardEntries]);

  useEffect(() => {
    localStorage.setItem('mathquest_homework_submissions', JSON.stringify(homeworkSubmissions));
  }, [homeworkSubmissions]);

  useEffect(() => {
    localStorage.setItem('mathquest_exam_results', JSON.stringify(examResults));
  }, [examResults]);

  useEffect(() => {
    localStorage.setItem('mathquest_ai_exams', JSON.stringify(aiExams));
  }, [aiExams]);

  useEffect(() => {
    localStorage.setItem('mathquest_teacher_pin', teacherPin);
  }, [teacherPin]);

  useEffect(() => {
    localStorage.setItem('mathquest_parent_pin', parentPin);
  }, [parentPin]);

  useEffect(() => {
    localStorage.setItem('mathquest_active_portal', mainPortal);
  }, [mainPortal]);

  useEffect(() => {
    localStorage.setItem('mathquest_active_tab', activeTab);
  }, [activeTab]);

  // Periodic check for ongoing exam/homework session
  useEffect(() => {
    const checkSessions = () => {
      try {
        const examSaved = localStorage.getItem('mathquest_ongoing_exam_session');
        if (examSaved) {
          const parsed = JSON.parse(examSaved);
          if (parsed?.isExamActive) {
            setOngoingExamInfo({
              type: 'exam',
              title: parsed.examTitle || 'Đề thi học kỳ',
              studentName: parsed.studentName,
              timeLeft: Math.max(0, parsed.timeLeft ?? 0),
              answeredCount: parsed.answeredCount || 0,
              totalQuestions: parsed.totalQuestions || 20
            });
            return;
          }
        }
        const hwSaved = localStorage.getItem('mathquest_ongoing_homework_session');
        if (hwSaved) {
          const parsed = JSON.parse(hwSaved);
          if (parsed?.isSessionActive) {
            setOngoingExamInfo({
              type: 'homework',
              title: `Bài tập về nhà (${parsed.branch === 'geometry' ? 'Hình học' : parsed.branch === 'statistics' ? 'Thống kê' : 'Đại số'})`,
              studentName: parsed.studentName,
              timeLeft: Math.max(0, parsed.timeLeft ?? 0),
              answeredCount: parsed.answeredCount || 0,
              totalQuestions: parsed.totalQuestions || 6
            });
            return;
          }
        }
        setOngoingExamInfo(null);
      } catch {}
    };

    checkSessions();
    const interval = setInterval(checkSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auth Handlers
  const handleTeacherSuccess = () => {
    setIsTeacherUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mathquest_teacher_auth', 'true');
    }
  };

  const handleLockTeacher = () => {
    setIsTeacherUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mathquest_teacher_auth');
    }
    soundManager.playClick();
  };

  const handleParentSuccess = (matchedPhone?: string) => {
    setIsParentUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mathquest_parent_auth', 'true');
      if (matchedPhone) {
        setAuthenticatedParentPhone(matchedPhone);
        sessionStorage.setItem('mathquest_parent_phone', matchedPhone);
      }
    }
  };

  const handleLockParent = () => {
    setIsParentUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mathquest_parent_auth');
      sessionStorage.removeItem('mathquest_parent_phone');
    }
    setAuthenticatedParentPhone(undefined);
    soundManager.playClick();
  };

  const handleBackToStudent = () => {
    setMainPortal('student');
    setActiveTab('solo');
  };

  const handleSavePins = (newTeacherPin: string, newParentPin: string) => {
    setTeacherPin(newTeacherPin);
    setParentPin(newParentPin);
    localStorage.setItem('mathquest_teacher_pin', newTeacherPin);
    localStorage.setItem('mathquest_parent_pin', newParentPin);
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playClick();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // State mutation callbacks
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setClassrooms(prev => prev.map(c => {
      if (c.id === newStudent.classId) {
        return { ...c, studentIds: [...c.studentIds, newStudent.id] };
      }
      return c;
    }));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleUpdateClassroom = (updatedClassroom: Classroom) => {
    setClassrooms(prev => prev.map(c => c.id === updatedClassroom.id ? updatedClassroom : c));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleAddQuestion = (newQ: Question) => {
    setQuestions(prev => [newQ, ...prev]);
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQ.id ? updatedQ : q));
  };

  const handleDeleteQuestion = (qId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const handleSaveLeaderboardEntry = (entry: Omit<LeaderboardEntry, 'id' | 'rank'>) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `lb-${Date.now()}`
    };
    setLeaderboardEntries(prev => [newEntry, ...prev]);
  };

  const handleAddHomeworkSubmission = (newSub: HomeworkSubmission) => {
    setHomeworkSubmissions(prev => [newSub, ...prev]);
  };

  const handleSaveExamResult = (result: ExamResult) => {
    setExamResults(prev => [result, ...prev]);
  };

  const handleSaveAIExam = (exam: SemesterExam) => {
    setAiExams(prev => [exam, ...prev.filter(e => e.id !== exam.id)]);
  };

  const handleDeleteAIExam = (examId: string) => {
    setAiExams(prev => prev.filter(e => e.id !== examId));
  };

  const handleTakeAIExam = (exam: SemesterExam) => {
    setPreselectedExamId(exam.id);
    setActiveTab(mainPortal === 'teacher' ? 'teacher_exams' : 'exams');
  };

  const handleNavigateToReport = (student: Student) => {
    setSelectedStudentForReport(student);
    setMainPortal('teacher');
    setActiveTab('reports');
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar with 3 Main Portals */}
      <Navbar
        mainPortal={mainPortal}
        onPortalChange={setMainPortal}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        teacherRole={teacherRole}
        onTeacherRoleChange={setTeacherRole}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isOnline={isOnline}
        isTeacherUnlocked={isTeacherUnlocked}
        isParentUnlocked={isParentUnlocked}
        onLockTeacher={handleLockTeacher}
        onLockParent={handleLockParent}
        onOpenPinSettings={() => setIsPinSettingsOpen(true)}
        ongoingTestType={ongoingExamInfo ? ongoingExamInfo.type : null}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Persistent In-Progress Exam / Homework Notification Banner */}
        {ongoingExamInfo && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                📝
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>PHÁT HIỆN BÀI THI / BÀI TẬP ĐANG LÀM DỞ DANG</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {ongoingExamInfo.title} · Thí sinh: <span className="underline decoration-amber-200">{ongoingExamInfo.studentName}</span>
                </div>
                <div className="text-xs text-amber-100 mt-0.5">
                  Đã trả lời {ongoingExamInfo.answeredCount}/{ongoingExamInfo.totalQuestions} câu hỏi · Thời gian còn lại: <b>{Math.floor(ongoingExamInfo.timeLeft / 60)} phút {('0' + (ongoingExamInfo.timeLeft % 60)).slice(-2)} giây</b>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  soundManager.playCorrect();
                  setMainPortal('student');
                  setActiveTab(ongoingExamInfo.type === 'exam' ? 'exams' : 'homework');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-orange-700 hover:bg-amber-50 font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>👉 Nhấn Vào Đây Để Quay Lại Bài Đang Làm</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            1. GÓC PHỤ HUYNH (DEDICATED INDEPENDENT PARENT PORTAL)
            ======================================================== */}
        {mainPortal === 'parent' && (
          !isParentUnlocked ? (
            <PortalPasscodeGate
              portalType="parent"
              teacherPin={teacherPin}
              parentPin={parentPin}
              students={students}
              onSuccess={handleParentSuccess}
              onBackToStudent={handleBackToStudent}
            />
          ) : (
            <ParentPortal
              students={students}
              classrooms={classrooms}
              submissions={homeworkSubmissions}
              initialPhone={authenticatedParentPhone}
              onLockPortal={handleLockParent}
            />
          )
        )}

        {/* ========================================================
            2. GÓC HỌC SINH (STUDENT SPACE)
            ======================================================== */}
        {mainPortal === 'student' && (
          <div className="space-y-6">
            {/* Tab: Trò chơi Toán học (Speed, Oxy Battleship, Prime Defense, Escape, Memory) */}
            {activeTab === 'solo' && (
              <SoloGamesHub
                questions={questions}
                onSaveScore={handleSaveLeaderboardEntry}
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                activeClassName={classrooms[0]?.name || 'Lớp 6A1'}
              />
            )}

            {/* Tab: Vận Động Cơ Thể Qua Camera (Chuẩn Lớp Học) */}
            {activeTab === 'body_games' && (
              <BodyCameraGamesHub
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                activeClassName={classrooms[0]?.name || 'Lớp 6A1'}
              />
            )}

            {/* Tab: Tự Tạo Trò Chơi Theo Yêu Cầu (Game Studio) */}
            {activeTab === 'custom_game' && (
              <CustomGameStudio
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                activeClassName={classrooms[0]?.name || 'Lớp 6A1'}
              />
            )}

            {/* Tab: Luyện Đề Thi Giữa Kỳ & Cuối Kỳ (Khối 6-9) */}
            {activeTab === 'exams' && (
              <SemesterExamPortal
                students={students}
                onSaveExamResult={handleSaveExamResult}
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                customExams={aiExams}
                preselectedExamId={preselectedExamId}
                onOpenAIGenerator={() => setActiveTab('ai_exam_studio')}
              />
            )}

            {/* Tab: Tạo Đề Thi AI Không Cần Kho Tài Liệu & Giải Chi Tiết */}
            {activeTab === 'ai_exam_studio' && (
              <AIExamGenerator
                aiExams={aiExams}
                onSaveAIExam={handleSaveAIExam}
                onDeleteAIExam={handleDeleteAIExam}
                onTakeExam={handleTakeAIExam}
              />
            )}

            {/* Tab: Làm Bài Tập Về Nhà (Camera tròn ở giữa, PIN 20112002) */}
            {activeTab === 'homework' && (
              <HomeworkPortal
                questions={questions}
                students={students}
                classrooms={classrooms}
                submissions={homeworkSubmissions}
                onAddSubmission={handleAddHomeworkSubmission}
                language={language}
              />
            )}

            {/* Tab: Đấu Trí AI MathBot */}
            {activeTab === 'ai_duel' && (
              <AIMathDuel
                questions={questions}
                language={language}
              />
            )}

            {/* Tab: Phòng Thực Hành Trực Quan */}
            {activeTab === 'labs' && (
              <InteractiveLabsHub />
            )}
          </div>
        )}

        {/* ========================================================
            3. GÓC GIÁO VIÊN (TEACHER SPACE - CÔ DIỄM QUỲNH)
            ======================================================== */}
        {mainPortal === 'teacher' && (
          !isTeacherUnlocked ? (
            <PortalPasscodeGate
              portalType="teacher"
              teacherPin={teacherPin}
              parentPin={parentPin}
              students={students}
              onSuccess={handleTeacherSuccess}
              onBackToStudent={handleBackToStudent}
            />
          ) : (
            <div className="space-y-6">
              {/* Teacher security status strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white px-5 py-3 rounded-2xl shadow-md border border-indigo-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm">
                    🔐
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">
                      Không Gian Quản Trị: Cô Diễm Quỳnh
                    </span>
                    <span className="text-[11px] text-indigo-200">
                      Đã xác thực quyền giáo viên · Mật mã GV: <b className="text-white font-mono tracking-widest">••••••••</b> · Mật mã PH: <b className="text-emerald-300 font-mono tracking-widest">••••••••</b> <span className="text-indigo-300">(Đang ẩn bảo mật)</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPinSettingsOpen(true)}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
                  >
                    <span>🔐 Quản Lý & Gửi Riêng Mã PH</span>
                  </button>
                  <button
                    onClick={handleLockTeacher}
                    className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🔒 Khóa Góc GV</span>
                  </button>
                </div>
              </div>

              {/* Tab: Quản lý lớp học, học sinh & SĐT Phụ huynh */}
            {activeTab === 'classroom' && (
              <ClassroomManager
                classrooms={classrooms}
                students={students}
                submissions={homeworkSubmissions}
                parentPin={parentPin}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onSelectStudentForReport={handleNavigateToReport}
                onUpdateClassroom={handleUpdateClassroom}
              />
            )}

            {/* Tab: Radar Giám Sát Chống Chuyển Tab (Live Anti-Cheat) */}
            {activeTab === 'anti_cheat_monitor' && (
              <AntiCheatMonitorPanel
                students={students}
                classroom={classrooms[0] || initialClassrooms[0]}
                submissions={homeworkSubmissions}
              />
            )}

            {/* Tab: Giám sát BTVN (Đã nộp vs CHƯA NỘP, Nhắn tin SMS) */}
            {activeTab === 'homework_tracker' && (
              <HomeworkPortal
                questions={questions}
                students={students}
                classrooms={classrooms}
                submissions={homeworkSubmissions}
                onAddSubmission={handleAddHomeworkSubmission}
                language={language}
                initialTab="teacher"
              />
            )}

            {/* Tab: Tạo Đề Thi AI Không Cần Kho Tài Liệu & Giải Chi Tiết (Góc GV) */}
            {activeTab === 'ai_exam_studio' && (
              <AIExamGenerator
                aiExams={aiExams}
                onSaveAIExam={handleSaveAIExam}
                onDeleteAIExam={handleDeleteAIExam}
                onTakeExam={handleTakeAIExam}
              />
            )}

            {/* Tab: Ngân hàng Đề thi thử Giữa/Cuối kỳ & In đề thi A4 */}
            {activeTab === 'teacher_exams' && (
              <SemesterExamPortal
                students={students}
                onSaveExamResult={handleSaveExamResult}
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                customExams={aiExams}
                preselectedExamId={preselectedExamId}
                onOpenAIGenerator={() => setActiveTab('ai_exam_studio')}
              />
            )}

            {/* Tab: Ngân hàng câu hỏi MathType */}
            {activeTab === 'questions' && (
              <QuestionBank
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
              />
            )}

            {/* Tab: Báo cáo định kỳ & Xuất PDF */}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                <StudentProgress
                  students={students}
                  classrooms={classrooms}
                  submissions={homeworkSubmissions}
                  onSelectStudentForReport={handleNavigateToReport}
                />
                <ReportCardGenerator
                  students={students}
                  classrooms={classrooms}
                  selectedStudent={selectedStudentForReport}
                />
              </div>
            )}

            {/* Tab: Sơ Đồ Chỗ Ngồi Lớp Học (4 Dãy / 4 Tổ - GV Chủ Nhiệm) */}
            {activeTab === 'seating_chart' && (
              <ClassroomSeatingChart
                classroom={classrooms[0] || initialClassrooms[0]}
                students={students}
                academicRecords={initialVnEduRecords}
              />
            )}

            {/* Tab: Sổ Điểm Điện Tử VnEdu (Các Môn - GV Chủ Nhiệm) */}
            {activeTab === 'vnedu_gradebook' && (
              <VnEduGradebook
                classroom={classrooms[0] || initialClassrooms[0]}
              />
            )}
          </div>
        )
      )}
      </main>

      {/* Educational Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">MathQuest THCS</span>
            <span>·</span>
            <span>Cô Diễm Quỳnh (Giáo viên bộ môn Toán)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sẵn sàng Ngoại tuyến (Offline 100%)
            </span>
            <span>Tối ưu mượt mà iOS & Android</span>
          </div>
        </div>
      </footer>

      {/* Pin Settings Modal */}
      <PinSettingsModal
        isOpen={isPinSettingsOpen}
        onClose={() => setIsPinSettingsOpen(false)}
        teacherPin={teacherPin}
        parentPin={parentPin}
        onSavePins={handleSavePins}
      />
    </div>
  );
}
