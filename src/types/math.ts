export type GradeLevel = 6 | 7 | 8 | 9;

export type MathTopic = 
  | 'arithmetic' // Số học & Số nguyên
  | 'rational'   // Phân số & Số hữu tỉ
  | 'algebra'    // Đại số & Đa thức
  | 'equation'   // Phương trình & Hệ phương trình
  | 'geometry'   // Hình học & Đo lường
  | 'statistics';// Thống kê & Xác suất

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  grade: GradeLevel;
  topic: MathTopic;
  topicName: string;
  topicNameEn?: string;
  difficulty: DifficultyLevel;
  questionText: string;
  questionTextEn?: string;
  formula?: string;
  options: string[];
  optionsEn?: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationEn?: string;
  hint?: string;
  hintEn?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  gender: 'male' | 'female';
  avatarSeed: string;
  overallScore: number; // 0 - 10
  gamesPlayed: number;
  accuracyRate: number; // %
  averageTimeSec: number; // seconds per question
  badge: string;
  topicsMastery: {
    arithmetic: number; // 0 - 100%
    rational: number;
    algebra: number;
    equation: number;
    geometry: number;
    statistics: number;
  };
  recentHistory: {
    date: string;
    gameTitle: string;
    score: number;
    timeSec: number;
    totalQuestions: number;
  }[];
  attendance: 'present' | 'absent' | 'late';
  parentPhone: string;
  parentName?: string;
  teacherNotes?: string;
}

export interface Classroom {
  id: string;
  name: string; // e.g. "6A1", "7A2", "8B", "9C"
  grade: GradeLevel;
  schoolYear: string;
  homeroomTeacher: string;
  subjectTeacher?: string; // Cô Diễm Quỳnh
  duties?: string; // Nhiệm vụ phân công
  roomNumber: string;
  studentIds: string[];
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  className: string;
  score: number;
  timeSec: number;
  accuracy: number;
  gameMode: string;
  date: string;
  rank?: number;
}

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  score: number;
  correctAnswers: number;
  streak: number;
  boatPosition: number; // 0 - 100%
  members: string[];
}

export interface PeriodicReport {
  studentId: string;
  classId: string;
  period: 'week' | 'month' | 'midterm' | 'term_end';
  periodLabel: string;
  evaluationDate: string;
  mathScore: number;
  rankInClass: number;
  totalStudentsInClass: number;
  attendanceRate: number; // %
  participationScore: number; // 0 - 10
  strengths: string[];
  areasToImprove: string[];
  teacherComment: string;
  parentAdvice: string;
  teacherSignature: string;
}

export type SubjectBranch = 'algebra' | 'geometry' | 'statistics';

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  classCode: string;
  submittedAt: string;
  entryTime?: string; // Giờ vào làm bài (vd: 19:42:15)
  exitTime?: string;  // Giờ ra / nộp bài (vd: 19:45:19)
  startedAt?: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSec: number;
  certificateAwarded: boolean;
  branch: SubjectBranch;
  parentPhone?: string;
  parentName?: string;
  parentNotified?: boolean;
  parentNotifiedAt?: string;
  teacherFeedback?: string;
  // Anti-cheat proctoring fields
  tabSwitchesCount?: number;
  totalAwayTimeSec?: number;
  integrityStatus?: 'honest' | 'suspicious' | 'cheated';
  incidentLogs?: AntiCheatIncident[];
}

export interface AntiCheatIncident {
  id: string;
  studentId: string;
  studentName: string;
  classCode: string;
  timestamp: string;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'copy_paste';
  durationSec: number;
  questionNumber: number;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export type MainPortal = 'student' | 'parent' | 'teacher';

export type ExamCognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export type ExamQuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface TrueFalseSubItem {
  id: string;
  label: 'a' | 'b' | 'c' | 'd';
  text: string;
  formula?: string;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation?: string;
}

export interface EssayRubricStep {
  step: string;
  points: number;
}

export interface ExamQuestion {
  id: string;
  number: number;
  section?: 'I' | 'II' | 'III' | 'IV';
  sectionTitle?: string;
  questionType?: ExamQuestionType; // default 'multiple_choice'
  questionText: string;
  formula?: string;
  
  // For multiple_choice (Part I: 12 câu hoặc 4 câu)
  options?: string[];
  correctAnswerIndex?: number;

  // For true_false (Part II: 1 câu 4 ý a, b, c, d)
  subQuestions?: TrueFalseSubItem[];

  // For short_answer (Part III: 2 câu trả lời ngắn)
  correctShortAnswer?: string;
  acceptedAnswers?: string[];

  // For essay (Part IV: Tự luận)
  sampleSolution?: string;
  rubric?: EssayRubricStep[];

  explanation: string;
  points: number;
  level: ExamCognitiveLevel;
  topic: MathTopic;
}

export interface SemesterExam {
  id: string;
  code?: string;
  title: string;
  grade: GradeLevel;
  semester: 'HK1' | 'HK2';
  examType: 'quiz_15m' | 'midterm' | 'final';
  durationMinutes: number;
  totalPoints: number;
  description: string;
  matrix: {
    nhanBiet: number; // %
    thongHieu: number;
    vanDung: number;
    vanDungCao: number;
  };
  questions: ExamQuestion[];
  createdAt?: string;
  isAIGenerated?: boolean;
}

export interface ExamStudentAnswers {
  multipleChoice?: Record<string, number>; // questionId -> optionIndex
  trueFalse?: Record<string, Record<'a' | 'b' | 'c' | 'd', boolean>>; // questionId -> { a: true, b: false, ... }
  shortAnswer?: Record<string, string>; // questionId -> text
  essay?: Record<string, string>; // questionId -> essay solution
  essaySelfScores?: Record<string, number>; // questionId -> score
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  grade: GradeLevel;
  studentName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSec: number;
  date: string;
  answers: Record<string, any>;
  partScores?: {
    part1Score: number;
    part2Score: number;
    part3Score: number;
    part4Score: number;
  };
  certificateAwarded: boolean;
}

export type BodyPoseType = 
  | 'both_hands_up'   // 🙆‍♂️ Hai tay giơ cao qua đầu
  | 'left_hand_up'    // 🙋‍♂️ Giơ tay trái lên cao
  | 'right_hand_up'   // 🙋‍♀️ Giơ tay phải lên cao
  | 'cross_arms'      // 🙅‍♂️ Bắt chéo 2 tay trước ngực
  | 'tilt_left'       // 🤸‍♂️ Nghiêng người sang trái
  | 'tilt_right'      // 🤸‍♀️ Nghiêng người sang phải
  | 'hands_on_hips';  // 🧍‍♂️ Hai tay chống hông

export interface BodyMotionQuestionOption {
  text: string;
  textEn?: string;
  formula?: string;
  pose: BodyPoseType;
  poseLabel: string;
  poseLabelEn?: string;
  color: 'blue' | 'red' | 'green' | 'amber' | 'purple';
}

export interface BodyMotionQuestion {
  id: string;
  grade: GradeLevel;
  topic: MathTopic;
  topicName: string;
  topicNameEn?: string;
  questionText: string;
  questionTextEn?: string;
  formula?: string;
  options: BodyMotionQuestionOption[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
  hint?: string;
  hintEn?: string;
}

export type TeacherRole = 'subject_teacher' | 'homeroom_teacher';

export type SubjectCode = 
  | 'math' | 'literature' | 'english' | 'science' 
  | 'history_geo' | 'informatics' | 'civics' | 'technology' | 'pe' | 'art';

export interface VnEduSubjectGrade {
  subjectCode: SubjectCode;
  subjectName: string;
  teacherName: string;
  tx1?: number; // ĐĐGtx 1 (miệng)
  tx2?: number; // ĐĐGtx 2 (15p)
  tx3?: number; // ĐĐGtx 3
  tx4?: number; // ĐĐGtx 4
  gk?: number;  // ĐĐGgk (giữa kỳ - hệ số 2)
  ck?: number;  // ĐĐGck (cuối kỳ - hệ số 3)
  tbm: number;  // Điểm trung bình môn học kỳ
}

export interface ClassroomSeatingDesk {
  deskNumber: number; // 1 to 16
  row: number; // 1 to 4
  column: number; // 1 to 4 (Dãy 1, 2, 3, 4)
  groupNumber: 1 | 2 | 3 | 4; // Tổ 1, 2, 3, 4
  leftStudentId?: string;
  rightStudentId?: string;
}

export interface VnEduStudentAcademicRecord {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  rollNumber: number;
  dob: string;
  gender: 'male' | 'female';
  parentPhone: string;
  parentName: string;
  roleInClass?: 'Lớp trưởng' | 'Lớp phó học tập' | 'Lớp phó lao động' | 'Tổ trưởng' | 'Học sinh';
  groupNumber: 1 | 2 | 3 | 4; // Tổ 1, 2, 3, 4
  deskNumber: number; // Bàn số 1-16
  seatSide: 'left' | 'right';
  subjects: Record<SubjectCode, VnEduSubjectGrade>;
  averageScore: number; // ĐTBhk
  academicRanking: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt'; // Thông tư 22
  conductRanking: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';
  attendanceStats: {
    excusedAbsence: number; // Nghỉ có phép (P)
    unexcusedAbsence: number; // Nghỉ không phép (KP)
    tardiness: number; // Bỏ tiết / Đi muộn
  };
  homeroomTeacherNotes?: string;
}

export type CustomGameType = 'camera_motion' | 'speed_math' | 'escape_room' | 'quiz_show';

export interface CustomGameItem {
  id: string;
  title: string;
  type: CustomGameType;
  grade: GradeLevel;
  description: string;
  createdAt: string;
  authorName: string;
  questionsCount: number;
  questions: Question[];
  timeLimitSec: number;
}


