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
import { LessonPlanManager } from './components/classroom/LessonPlanManager';
import { SlideStudio } from './components/classroom/SlideStudio';
import { LessonPlan } from './data/lessonPlansData';
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
import { LoginPage } from './components/auth/LoginPage';
import { MathGradebookBoard } from './components/common/MathGradebookBoard';
import {
  GRADEBOOK_STORAGE_KEY,
  loadSavedGradebook,
  StudentScoreRecord,
} from './utils/gradebook';
import {
  AuthUser,
  getDefaultTabForRole,
  getSavedAuthUser,
  isTabAllowedForRole,
  saveAuthUser,
} from './utils/auth';
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
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getSavedAuthUser());

  const [mainPortal, setMainPortal] = useState<MainPortal>(() => {
    const savedUser = getSavedAuthUser();
    if (savedUser) return savedUser.role;
    return 'student';
  });

  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const savedUser = getSavedAuthUser();
    if (savedUser) {
      if (savedUser.role === 'student' && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('code')) return 'homework';
        try {
          const examSession = localStorage.getItem('mathquest_ongoing_exam_session');
          if (examSession && JSON.parse(examSession)?.isExamActive) return 'exams';
          const hwSession = localStorage.getItem('mathquest_ongoing_homework_session');
          if (hwSession && JSON.parse(hwSession)?.isSessionActive) return 'homework';
        } catch {}
      }
      const saved = typeof window !== 'undefined'
        ? (localStorage.getItem('mathquest_active_tab') as NavTab)
        : null;
      if (saved && isTabAllowedForRole(saved, savedUser.role)) {
        return saved;
      }
      return getDefaultTabForRole(savedUser.role);
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

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mathquest_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
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
    const savedUser = getSavedAuthUser();
    if (savedUser?.role === 'teacher') return true;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mathquest_teacher_auth') === 'true';
    }
    return false;
  });

  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(() => {
    const savedUser = getSavedAuthUser();
    if (savedUser?.role === 'parent') return true;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mathquest_parent_auth') === 'true';
    }
    return false;
  });

  const [authenticatedParentPhone, setAuthenticatedParentPhone] = useState<string | undefined>(() => {
    const savedUser = getSavedAuthUser();
    if (savedUser?.role === 'parent') return savedUser.phone;
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
    if (saved) {
      try {
        const parsed: Question[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultsById = new Map(initialQuestions.map((q) => [q.id, q]));
          const existingIds = new Set(parsed.map((q) => q.id));
          // Sync bilingual *En fields onto existing default questions while keeping teacher edits
          const synced = parsed.map((q) => {
            const def = defaultsById.get(q.id);
            if (!def) return q;
            return {
              ...q,
              topicNameEn: q.topicNameEn || def.topicNameEn,
              questionTextEn: q.questionTextEn || def.questionTextEn,
              optionsEn: q.optionsEn || def.optionsEn,
              explanationEn: q.explanationEn || def.explanationEn,
              hintEn: q.hintEn || def.hintEn,
            };
          });
          // Append any newly added default questions that aren't in localStorage yet
          const missing = initialQuestions.filter((q) => !existingIds.has(q.id));
          return [...synced, ...missing];
        }
      } catch {}
    }
    return initialQuestions;
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
  const [selectedLessonPlanForSlides, setSelectedLessonPlanForSlides] = useState<LessonPlan | null>(null);

  const [gradebook, setGradebook] = useState<Record<string, StudentScoreRecord>>(() => {
    return loadSavedGradebook(students);
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('mathquest_lang', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mathquest_theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

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
    localStorage.setItem(GRADEBOOK_STORAGE_KEY, JSON.stringify(gradebook));
  }, [gradebook]);

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
  const handleLoginSuccess = (user: AuthUser) => {
    saveAuthUser(user);
    setAuthUser(user);
    setMainPortal(user.role);
    setActiveTab(getDefaultTabForRole(user.role));

    if (user.role === 'teacher') {
      setIsTeacherUnlocked(true);
      setIsParentUnlocked(false);
      setAuthenticatedParentPhone(undefined);
      sessionStorage.setItem('mathquest_teacher_auth', 'true');
      sessionStorage.removeItem('mathquest_parent_auth');
      sessionStorage.removeItem('mathquest_parent_phone');
    } else if (user.role === 'parent') {
      setIsParentUnlocked(true);
      setIsTeacherUnlocked(false);
      setAuthenticatedParentPhone(user.phone);
      sessionStorage.setItem('mathquest_parent_auth', 'true');
      sessionStorage.setItem('mathquest_parent_phone', user.phone);
      sessionStorage.removeItem('mathquest_teacher_auth');
    } else {
      setIsTeacherUnlocked(false);
      setIsParentUnlocked(false);
      setAuthenticatedParentPhone(undefined);
      sessionStorage.removeItem('mathquest_teacher_auth');
      sessionStorage.removeItem('mathquest_parent_auth');
      sessionStorage.removeItem('mathquest_parent_phone');
    }
  };

  const handleLogout = () => {
    saveAuthUser(null);
    setAuthUser(null);
    setIsTeacherUnlocked(false);
    setIsParentUnlocked(false);
    setAuthenticatedParentPhone(undefined);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mathquest_teacher_auth');
      sessionStorage.removeItem('mathquest_parent_auth');
      sessionStorage.removeItem('mathquest_parent_phone');
    }
    soundManager.playClick();
  };

  const handleUpdateStudentIdentity = (identity: {
    name: string;
    studentId?: string;
    className?: string;
  }) => {
    setAuthUser((prev) => {
      if (!prev || prev.role !== 'student') return prev;
      const updated: AuthUser = {
        ...prev,
        name: identity.name.trim() || prev.name,
        studentId: identity.studentId,
        className: identity.className || prev.className,
      };
      saveAuthUser(updated);
      return updated;
    });
  };

  const handlePortalChange = (portal: MainPortal) => {
    if (authUser && portal !== authUser.role) return;
    setMainPortal(portal);
  };

  const handleTabChange = (tab: NavTab) => {
    if (authUser && !isTabAllowedForRole(tab, authUser.role)) return;
    setActiveTab(tab);
  };

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

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
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

  const handleUpdateStudentScores = (studentId: string, updated: StudentScoreRecord) => {
    setGradebook(prev => ({
      ...prev,
      [studentId]: updated,
    }));
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

  if (!authUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        students={students}
        classrooms={classrooms}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  const effectivePortal: MainPortal = authUser.role;
  const matchedStudentObj =
    authUser.role === 'student' && authUser.studentId
      ? students.find((s) => s.id === authUser.studentId)
      : undefined;
  const activeStudentName =
    authUser.role === 'student' && authUser.name?.trim()
      ? authUser.name.trim()
      : students[0]?.name || 'Nguyễn Minh Quân';
  const activeClassName =
    (authUser.role === 'student' &&
      (authUser.className ||
        (matchedStudentObj &&
          classrooms.find((c) => c.id === matchedStudentObj.classId)?.name))) ||
    classrooms[0]?.name ||
    'Lớp 6A1';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors">
      {/* Top Navbar with Role-Based Access */}
      <Navbar
        mainPortal={effectivePortal}
        onPortalChange={handlePortalChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        teacherRole={teacherRole}
        onTeacherRoleChange={setTeacherRole}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOnline={isOnline}
        currentUser={authUser}
        onLogout={handleLogout}
        isTeacherUnlocked={isTeacherUnlocked}
        isParentUnlocked={isParentUnlocked}
        onLockTeacher={handleLockTeacher}
        onLockParent={handleLockParent}
        onOpenPinSettings={() => setIsPinSettingsOpen(true)}
        ongoingTestType={ongoingExamInfo ? ongoingExamInfo.type : null}
        students={students}
        classrooms={classrooms}
        onUpdateStudentIdentity={handleUpdateStudentIdentity}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Persistent In-Progress Exam / Homework Notification Banner (Student only) */}
        {effectivePortal === 'student' && ongoingExamInfo && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                📝
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>{t.ongoingBannerTitle}</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {ongoingExamInfo.title} · {ongoingExamInfo.studentName}
                </div>
                <div className="text-xs text-amber-100 mt-0.5">
                  {ongoingExamInfo.answeredCount}/{ongoingExamInfo.totalQuestions} · {t.timeLeft}: <b>{Math.floor(ongoingExamInfo.timeLeft / 60)}:{('0' + (ongoingExamInfo.timeLeft % 60)).slice(-2)}</b>
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
                <span>{t.ongoingBannerResume}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            1. GÓC PHỤ HUYNH (DEDICATED INDEPENDENT PARENT PORTAL)
            ======================================================== */}
        {effectivePortal === 'parent' && (
          !isParentUnlocked ? (
            <PortalPasscodeGate
              portalType="parent"
              teacherPin={teacherPin}
              parentPin={parentPin}
              students={students}
              onSuccess={handleParentSuccess}
              onBackToStudent={handleLogout}
            />
          ) : (
            <ParentPortal
              students={students}
              classrooms={classrooms}
              submissions={homeworkSubmissions}
              gradebook={gradebook}
              initialPhone={authenticatedParentPhone}
              onLockPortal={handleLogout}
              language={language}
            />
          )
        )}

        {/* ========================================================
            2. GÓC HỌC SINH (STUDENT SPACE)
            ======================================================== */}
        {effectivePortal === 'student' && (
          <div className="space-y-6">
            {/* Tab: Trò chơi Toán học (Speed, Oxy Battleship, Prime Defense, Escape, Memory) */}
            {activeTab === 'solo' && (
              <SoloGamesHub
                questions={questions}
                onSaveScore={handleSaveLeaderboardEntry}
                activeStudentName={activeStudentName}
                activeClassName={activeClassName}
                language={language}
              />
            )}

            {/* Tab: Vận Động Cơ Thể Qua Camera (Chuẩn Lớp Học) */}
            {activeTab === 'body_games' && (
              <BodyCameraGamesHub
                activeStudentName={activeStudentName}
                activeClassName={activeClassName}
                userRole={authUser.role}
                language={language}
              />
            )}

            {/* Tab: Luyện Đề Thi Giữa Kỳ & Cuối Kỳ (Khối 6-9) */}
            {activeTab === 'exams' && (
              <SemesterExamPortal
                students={students}
                onSaveExamResult={handleSaveExamResult}
                activeStudentName={activeStudentName}
                customExams={aiExams}
                preselectedExamId={preselectedExamId}
                language={language}
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
                userRole={authUser.role}
                activeStudentName={activeStudentName}
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
              <InteractiveLabsHub language={language} />
            )}
          </div>
        )}

        {/* ========================================================
            3. GÓC GIÁO VIÊN (TEACHER SPACE - CÔ DIỄM QUỲNH)
            ======================================================== */}
        {effectivePortal === 'teacher' && (
          !isTeacherUnlocked ? (
            <PortalPasscodeGate
              portalType="teacher"
              teacherPin={teacherPin}
              parentPin={parentPin}
              students={students}
              onSuccess={handleTeacherSuccess}
              onBackToStudent={handleLogout}
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
                      {t.teacherWorkspaceTitle}
                    </span>
                    <span className="text-[11px] text-indigo-200">
                      {t.teacherVerifiedSub} · <b className="text-white font-mono">{authUser.phone}</b>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPinSettingsOpen(true)}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20 cursor-pointer"
                  >
                    <span>{t.manageSendParentPin}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🚪 {t.logout}</span>
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
                language={language}
              />
            )}

            {/* Tab: Bảng Điểm Môn Toán (5 TX, 1 GK, 1 CK & Tính ĐTB) */}
            {activeTab === 'gradebook' && (
              <MathGradebookBoard
                mode="teacher"
                students={students}
                classrooms={classrooms}
                gradebook={gradebook}
                onUpdateStudentScores={handleUpdateStudentScores}
                language={language}
              />
            )}

            {/* Tab: Giáo Án / Kế Hoạch Bài Dạy (Chuẩn 5512) */}
            {activeTab === 'lesson_plans' && (
              <LessonPlanManager
                language={language}
                onCreateSlidesFromPlan={(plan) => {
                  setSelectedLessonPlanForSlides(plan);
                  setActiveTab('slide_studio');
                }}
              />
            )}

            {/* Tab: Tạo Slide Trình Chiếu Bài Giảng */}
            {activeTab === 'slide_studio' && (
              <SlideStudio
                lessonPlan={selectedLessonPlanForSlides}
                questions={questions}
                language={language}
              />
            )}

            {/* Tab: Radar Giám Sát Chống Chuyển Tab (Live Anti-Cheat) */}
            {activeTab === 'anti_cheat_monitor' && (
              <AntiCheatMonitorPanel
                students={students}
                classroom={classrooms[0] || initialClassrooms[0]}
                submissions={homeworkSubmissions}
                language={language}
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
                userRole={authUser.role}
              />
            )}

            {/* Tab: Tạo Đề Thi AI Không Cần Kho Tài Liệu & Giải Chi Tiết (Góc GV) */}
            {activeTab === 'ai_exam_studio' && (
              <AIExamGenerator
                aiExams={aiExams}
                onSaveAIExam={handleSaveAIExam}
                onDeleteAIExam={handleDeleteAIExam}
                onTakeExam={handleTakeAIExam}
                language={language}
              />
            )}

            {/* Tab: Tự Tạo Trò Chơi Theo Yêu Cầu (Game Studio - Góc GV) */}
            {activeTab === 'custom_game' && (
              <CustomGameStudio
                activeStudentName={students[0]?.name || 'Nguyễn Minh Quân'}
                activeClassName={classrooms[0]?.name || 'Lớp 6A1'}
                language={language}
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
                language={language}
              />
            )}

            {/* Tab: Ngân hàng câu hỏi MathType */}
            {activeTab === 'questions' && (
              <QuestionBank
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                language={language}
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
                  language={language}
                />
                <ReportCardGenerator
                  students={students}
                  classrooms={classrooms}
                  selectedStudent={selectedStudentForReport}
                  language={language}
                />
              </div>
            )}

            {/* Tab: Sơ Đồ Chỗ Ngồi Lớp Học (4 Dãy / 4 Tổ - GV Chủ Nhiệm) */}
            {activeTab === 'seating_chart' && (
              <ClassroomSeatingChart
                classroom={classrooms[0] || initialClassrooms[0]}
                students={students}
                academicRecords={initialVnEduRecords}
                language={language}
              />
            )}

            {/* Tab: Sổ Điểm Điện Tử VnEdu (Các Môn - GV Chủ Nhiệm) */}
            {activeTab === 'vnedu_gradebook' && (
              <VnEduGradebook
                classroom={classrooms[0] || initialClassrooms[0]}
                language={language}
              />
            )}
          </div>
        )
      )}
      </main>

      {/* Educational Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{t.appTitle}</span>
            <span>·</span>
            <span>{t.footerTeacher}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.footerOfflineReady}
            </span>
            <span>{t.footerMobileReady}</span>
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
