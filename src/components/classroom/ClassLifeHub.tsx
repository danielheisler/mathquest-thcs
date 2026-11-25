import React, { useState, useEffect } from 'react';
import { Student } from '../../types/math';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import {
  Award,
  Heart,
  MessageSquareLock,
  Brain,
  CalendarCheck,
  Trophy,
  Send,
  Plus,
  Sparkles,
  CheckCircle2,
  XCircle,
  Timer,
  RotateCcw,
  Sprout,
  Bell,
} from 'lucide-react';

type ClassLifeTab = 'wall' | 'psych_quiz' | 'habit_21' | 'trivia';

interface PraisePost {
  id: string;
  studentName: string;
  author: string;
  message: string;
  category: 'academic' | 'kindness' | 'progress';
  likes: number;
  date: string;
}

interface SecretNote {
  id: string;
  topic: string;
  content: string;
  date: string;
  status: 'unread' | 'replied';
  teacherReply?: string;
}

const WALL_STORAGE_KEY = 'mathquest_wall_of_fame_v1';
const SECRETS_STORAGE_KEY = 'mathquest_secret_box_v1';
const HABITS_STORAGE_KEY = 'mathquest_habits_21_v1';

const INITIAL_PRAISE: PraisePost[] = [
  {
    id: 'pf-1',
    studentName: 'Nguyễn Minh Quân (6A1)',
    author: 'Cô Diễm Quỳnh',
    message: 'Khen ngợi em Quân đã chủ động hướng dẫn 2 bạn cùng bàn giải bài tập Thừa số nguyên tố trong tiết Luyện tập!',
    category: 'kindness',
    likes: 14,
    date: 'Tuần 12',
  },
  {
    id: 'pf-2',
    studentName: 'Trần Gia Huy (6A1)',
    author: 'Tổ 2 · Lớp 6A1',
    message: 'Chúc mừng Gia Huy đã tiến bộ vượt bậc, hoàn thành 100% BTVN cả tuần và tăng 1.5 điểm kiểm tra thường xuyên!',
    category: 'progress',
    likes: 19,
    date: 'Tuần 12',
  },
  {
    id: 'pf-3',
    studentName: 'Lê Hoàng Bảo Ngọc (6A1)',
    author: 'Cô Diễm Quỳnh',
    message: 'Gương sáng giữ vở sạch chữ đẹp và trình bày chứng minh hình học cực kỳ khoa học.',
    category: 'academic',
    likes: 11,
    date: 'Tuần 12',
  },
];

const INITIAL_SECRETS: SecretNote[] = [
  {
    id: 'sec-1',
    topic: 'Áp lực học tập',
    content: 'Cô ơi, dạo này em hơi lo trước kỳ thi giữa kỳ Toán phần hình học vì hay nhầm điều kiện tam giác bằng nhau ạ.',
    date: '24/11/2026',
    status: 'replied',
    teacherReply: 'Cô đã ghi nhận! Tiết sinh hoạt tới cô sẽ ôn lại sơ đồ tư duy 3 trường hợp bằng nhau của tam giác cho cả lớp nhé.',
  },
  {
    id: 'sec-2',
    topic: 'Góp ý hoạt động lớp',
    content: 'Em mong lớp mình cuối tuần có thêm vòng Rung chuông vàng theo tổ để các bạn nhút nhát cũng được tham gia ạ.',
    date: '25/11/2026',
    status: 'unread',
  },
];

interface PsychQuizItem {
  id: string;
  titleVi: string;
  titleEn: string;
  questions: {
    qVi: string;
    qEn: string;
    opts: { labelVi: string; labelEn: string; trait: 'visual' | 'auditory' | 'kinesthetic' }[];
  }[];
  results: Record<
    'visual' | 'auditory' | 'kinesthetic',
    { nameVi: string; nameEn: string; adviceVi: string; adviceEn: string }
  >;
}

const PSYCH_QUIZZES: PsychQuizItem[] = [
  {
    id: 'learning_style',
    titleVi: 'Bạn thuộc phong cách học tập nào?',
    titleEn: 'What Is Your Learning Style?',
    questions: [
      {
        qVi: 'Khi ôn công thức Toán mới, em nhớ nhanh nhất bằng cách nào?',
        qEn: 'When reviewing a new math formula, how do you remember best?',
        opts: [
          { labelVi: 'Vẽ sơ đồ tư duy, tô màu nổi bật công thức', labelEn: 'Draw mind maps and highlight formulas', trait: 'visual' },
          { labelVi: 'Đọc thành tiếng hoặc nghe cô/bạn giảng lại', labelEn: 'Read aloud or listen to explanations', trait: 'auditory' },
          { labelVi: 'Tự tay làm ngay 3–5 ví dụ thực hành hoặc game', labelEn: 'Practice 3–5 examples or hands-on games', trait: 'kinesthetic' },
        ],
      },
      {
        qVi: 'Trong giờ học hình học, điều gì giúp em hiểu bài ngay?',
        qEn: 'In geometry class, what helps you understand right away?',
        opts: [
          { labelVi: 'Quan sát mô hình 3D hoặc hình vẽ màu sắc', labelEn: 'Viewing 3D models or color diagrams', trait: 'visual' },
          { labelVi: 'Thảo luận nhóm đôi giải thích bằng lời', labelEn: 'Discussing verbally with a partner', trait: 'auditory' },
          { labelVi: 'Tự kéo thanh trượt / cắt ghép hình thực tế', labelEn: 'Dragging sliders or cutting shapes hands-on', trait: 'kinesthetic' },
        ],
      },
      {
        qVi: 'Khi giải một bài toán khó bị kẹt bước biến đổi, em thường làm gì?',
        qEn: 'When stuck on a hard problem, what do you usually do?',
        opts: [
          { labelVi: 'Vẽ lại hình hoặc gạch chân dữ kiện quan trọng', labelEn: 'Redraw the figure or underline key givens', trait: 'visual' },
          { labelVi: 'Tự hỏi thầm hoặc trao đổi nhanh với bạn', labelEn: 'Talk through steps or ask a friend', trait: 'auditory' },
          { labelVi: 'Thử thay vài con số cụ thể để đoán quy luật', labelEn: 'Plug in sample numbers to spot the pattern', trait: 'kinesthetic' },
        ],
      },
    ],
    results: {
      visual: {
        nameVi: 'Người học Thị Giác (Visual Learner)',
        nameEn: 'Visual Learner',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Em hãy tận dụng mục Bài Giảng Trực Quan 3D, Slide màu và vẽ sơ đồ tóm tắt mỗi chương bằng 2–3 màu bút khác nhau!',
        adviceEn: 'Ms. Quỳnh’s Tip: Use our 3D Visual Labs, color-coded slides, and draw chapter summary mind maps!',
      },
      auditory: {
        nameVi: 'Người học Thính Giác & Giao Tiếp (Auditory Learner)',
        nameEn: 'Auditory Learner',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Em rất hợp với phương pháp giảng lại bài cho bạn cùng bàn và đọc nhẩm quy tắc giải trước khi bấm máy tính.',
        adviceEn: 'Ms. Quỳnh’s Tip: Explain theorems aloud to a classmate and verbalize steps before computing!',
      },
      kinesthetic: {
        nameVi: 'Người học Vận Động & Thực Hành (Kinesthetic Learner)',
        nameEn: 'Kinesthetic Learner',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Em tiếp thu cực nhanh qua Trò chơi Vận động Camera, Cân phương trình và làm bài tập ngắn chia nhỏ mỗi 15 phút!',
        adviceEn: 'Ms. Quỳnh’s Tip: Learn through Body Camera Games, Balance Scale labs, and short 15-minute practice sprints!',
      },
    },
  },
  {
    id: 'time_management',
    titleVi: 'Cách quản lý thời gian hiệu quả cho sĩ tử',
    titleEn: 'Effective Time Management for Students',
    questions: [
      {
        qVi: 'Buổi tối về nhà, em thường bắt đầu làm bài tập lúc nào?',
        qEn: 'When do you usually start homework in the evening?',
        opts: [
          { labelVi: 'Lập thời gian biểu cố định (VD: 19h30 ngồi vào bàn)', labelEn: 'Fixed schedule (e.g. 7:30 PM at desk)', trait: 'visual' },
          { labelVi: 'Nhờ bố mẹ hoặc đặt báo thức nhắc giờ học', labelEn: 'Use an alarm or parent reminder', trait: 'auditory' },
          { labelVi: 'Làm ngay sau khi ăn nghỉ 30 phút bằng Pomodoro 25p', labelEn: 'Start after dinner using 25-min Pomodoro sprints', trait: 'kinesthetic' },
        ],
      },
      {
        qVi: 'Khi có 3 bài tập lớn cùng tuần, em xử lý thế nào?',
        qEn: 'With 3 major assignments in one week, how do you tackle them?',
        opts: [
          { labelVi: 'Viết checklist ra giấy dán góc bàn, xong đâu gạch đó', labelEn: 'Write a checklist on my desk and cross items off', trait: 'visual' },
          { labelVi: 'Hỏi bạn hoặc cô thứ tự phần nào nên ôn trước', labelEn: 'Ask teacher/friends what to prioritize first', trait: 'auditory' },
          { labelVi: 'Giải quyết phần khó nhất ngay lúc đầu óc còn tỉnh táo', labelEn: 'Finish the hardest task while fresh', trait: 'kinesthetic' },
        ],
      },
    ],
    results: {
      visual: {
        nameVi: 'Chiến Lược Gia Bảng Biểu (Planner Pro)',
        nameEn: 'Visual Planner Pro',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Hãy duy trì bảng Checklist 21 ngày rèn thói quen và tô màu lịch kiểm tra tuần để không bao giờ bị nước đến chân mới nhảy!',
        adviceEn: 'Ms. Quỳnh’s Tip: Keep using the 21-day habit checklist and color-coded weekly exam calendar!',
      },
      auditory: {
        nameVi: 'Người Học Kỷ Luật Nhờ Nhắc Nhở (Accountability Buddy)',
        nameEn: 'Accountability Buddy',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Hãy lập nhóm đôi "Bạn cùng tiến" nhắc nhau nộp BTVN trước 20h mỗi tối.',
        adviceEn: 'Ms. Quỳnh’s Tip: Pair up with a study buddy to remind each other before 8 PM!',
      },
      kinesthetic: {
        nameVi: 'Bậc Thầy Nhịp Tập Trung Pomodoro (Sprint Master)',
        nameEn: 'Pomodoro Sprint Master',
        adviceVi: 'Lời khuyên của Cô Quỳnh: Chia giờ ôn thi thành các chặng 25 phút tập trung tuyệt đối + 5 phút đứng dậy vận động cực kỳ hiệu quả cho em!',
        adviceEn: 'Ms. Quỳnh’s Tip: Break study time into focused 25-min sprints + 5-min active breaks!',
      },
    },
  },
];

const HABIT_ITEMS = [
  { id: 'h1', labelVi: 'Đi học đúng giờ', labelEn: 'Arrive on time' },
  { id: 'h2', labelVi: 'Đủ dụng cụ học tập (thước, compa)', labelEn: 'Bring all math tools' },
  { id: 'h3', labelVi: 'Đọc sách / ôn công thức 15p/ngày', labelEn: 'Read / review 15 mins daily' },
  { id: 'h4', labelVi: 'Hoàn thành BTVN đầy đủ', labelEn: 'Complete daily homework' },
];

interface TriviaQ {
  id: string;
  categoryVi: string;
  categoryEn: string;
  qVi: string;
  qEn: string;
  optionsVi: string[];
  optionsEn: string[];
  correctIdx: number;
}

const TRIVIA_BANK: TriviaQ[] = [
  {
    id: 'tr-1',
    categoryVi: 'Lịch sử – Địa lý Đà Nẵng',
    categoryEn: 'Da Nang Local History',
    qVi: 'Cây cầu nào ở Đà Nẵng có khả năng quay nhịp giữa 90 độ cho tàu thuyền qua lại trên sông Hàn?',
    qEn: 'Which bridge in Da Nang rotates its central span 90 degrees for river traffic?',
    optionsVi: ['Cầu Rồng', 'Cầu Sông Hàn', 'Cầu Thuận Phước', 'Cầu Trần Thị Lý'],
    optionsEn: ['Dragon Bridge', 'Han River Bridge', 'Thuan Phuoc Bridge', 'Tran Thi Ly Bridge'],
    correctIdx: 1,
  },
  {
    id: 'tr-2',
    categoryVi: 'An toàn không gian mạng',
    categoryEn: 'Cyber Safety',
    qVi: 'Khi nhận tin nhắn lạ kèm đường link "Nhận quà trúng thưởng" yêu cầu nhập mật khẩu, em nên làm gì?',
    qEn: 'If a stranger sends a "Win a Prize" link asking for your password, what should you do?',
    optionsVi: [
      'Bấm thử xem có quà thật không',
      'Gửi cho bạn bè cùng bấm',
      'Tuyệt đối không bấm, xóa/chặn và báo cho bố mẹ hoặc thầy cô',
      'Nhập thử một mật khẩu phụ',
    ],
    optionsEn: [
      'Click it to check if it is real',
      'Forward it to friends',
      'Do not click, block/delete it, and tell parents or teachers',
      'Enter a secondary password',
    ],
    correctIdx: 2,
  },
  {
    id: 'tr-3',
    categoryVi: 'An toàn giao thông',
    categoryEn: 'Traffic Safety',
    qVi: 'Khi đi xe đạp điện tới cổng trường gặp đèn vàng nhấp nháy tại ngã tư, em cần xử lý thế nào?',
    qEn: 'When approaching a flashing yellow traffic light on an electric bike, what must you do?',
    optionsVi: [
      'Tăng ga vượt nhanh qua giao lộ',
      'Giảm tốc độ, quan sát kỹ và nhường đường cho người đi bộ',
      'Bấm còi liên tục để xin đường',
      'Đi sát vào làn xe ô tô',
    ],
    optionsEn: [
      'Speed up through the intersection',
      'Slow down, observe carefully, and yield to pedestrians',
      'Honk continuously',
      'Ride inside the car lane',
    ],
    correctIdx: 1,
  },
  {
    id: 'tr-4',
    categoryVi: 'Kỹ năng sống học đường',
    categoryEn: 'School Life Skills',
    qVi: 'Nếu thấy bạn cùng lớp bị trêu chọc, cô lập trên nhóm chat của lớp, cách ứng xử văn minh nhất là:',
    qEn: 'If a classmate is being bullied in a class group chat, what is the best response?',
    optionsVi: [
      'Im lặng bỏ qua vì không liên quan đến mình',
      'Hùa theo để khỏi bị trêu',
      'Động viên bạn, phản đối hành vi bắt nạt và báo ngay cho GV Chủ nhiệm',
      'Chụp ảnh đăng công khai lên mạng xã hội',
    ],
    optionsEn: [
      'Stay silent since it does not involve you',
      'Join in to avoid being targeted',
      'Support the classmate, speak against bullying, and notify the homeroom teacher',
      'Post screenshots publicly online',
    ],
    correctIdx: 2,
  },
];

interface ClassLifeHubProps {
  students: Student[];
  language?: Language;
}

export const ClassLifeHub: React.FC<ClassLifeHubProps> = ({
  students,
  language = 'vi',
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<ClassLifeTab>('wall');

  // 1. Wall of Fame & Anonymous Sharing Box
  const [praises, setPraises] = useState<PraisePost[]>(() => {
    try {
      const raw = localStorage.getItem(WALL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRAISE;
  });
  const [newPraiseStudent, setNewPraiseStudent] = useState<string>(students[0]?.name || 'Nguyễn Minh Quân');
  const [newPraiseMsg, setNewPraiseMsg] = useState<string>('');
  const [newPraiseCat, setNewPraiseCat] = useState<'academic' | 'kindness' | 'progress'>('progress');

  const [secrets, setSecrets] = useState<SecretNote[]>(() => {
    try {
      const raw = localStorage.getItem(SECRETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SECRETS;
  });
  const [secretTopic, setSecretTopic] = useState<string>('Tâm tư học tập');
  const [secretText, setSecretText] = useState<string>('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem(WALL_STORAGE_KEY, JSON.stringify(praises));
  }, [praises]);

  useEffect(() => {
    localStorage.setItem(SECRETS_STORAGE_KEY, JSON.stringify(secrets));
  }, [secrets]);

  // 2. Psych Quick Quiz
  const [selectedQuizId, setSelectedQuizId] = useState<string>(PSYCH_QUIZZES[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, 'visual' | 'auditory' | 'kinesthetic'>>({});

  // 3. 21-Day Habit Tracker (keyed by targetId -> habitId -> dayNumbers[])
  const [habitTarget, setHabitTarget] = useState<string>('Tổ 1');
  const [habitData, setHabitData] = useState<Record<string, Record<string, number[]>>>(() => {
    try {
      const raw = localStorage.getItem(HABITS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      'Tổ 1': {
        h1: [1, 2, 3, 4, 5, 6, 7],
        h2: [1, 2, 3, 4, 5],
        h3: [1, 2, 3, 4],
        h4: [1, 2, 3, 4, 5, 6],
      },
    };
  });

  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitData));
  }, [habitData]);

  // 4. Mini Trivia / Rung Chuông Vàng
  const [triviaIdx, setTriviaIdx] = useState<number>(0);
  const [triviaTimeLeft, setTriviaTimeLeft] = useState<number>(15);
  const [triviaRunning, setTriviaRunning] = useState<boolean>(false);
  const [triviaPicked, setTriviaPicked] = useState<number | null>(null);
  const [triviaTeamScores, setTriviaTeamScores] = useState<{ name: string; score: number }[]>([
    { name: 'Tổ 1 · Rồng Xanh', score: 200 },
    { name: 'Tổ 2 · Hổ Đỏ', score: 150 },
    { name: 'Tổ 3 · Đại Bàng', score: 180 },
    { name: 'Tổ 4 · Phượng Hoàng', score: 160 },
  ]);
  const [activeTriviaTeam, setActiveTriviaTeam] = useState<number>(0);

  useEffect(() => {
    if (!triviaRunning || triviaPicked !== null) return;
    if (triviaTimeLeft <= 0) {
      setTriviaRunning(false);
      return;
    }
    const timer = setInterval(() => setTriviaTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [triviaRunning, triviaTimeLeft, triviaPicked]);

  const handleAddPraise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPraiseMsg.trim()) return;
    soundManager.playCorrect();
    setPraises((prev) => [
      {
        id: `pf-${Date.now()}`,
        studentName: newPraiseStudent,
        author: 'Cô Diễm Quỳnh',
        message: newPraiseMsg.trim(),
        category: newPraiseCat,
        likes: 1,
        date: isEn ? 'This week' : 'Tuần này',
      },
      ...prev,
    ]);
    setNewPraiseMsg('');
  };

  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretText.trim()) return;
    soundManager.playCorrect();
    setSecrets((prev) => [
      {
        id: `sec-${Date.now()}`,
        topic: secretTopic,
        content: secretText.trim(),
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'unread',
      },
      ...prev,
    ]);
    setSecretText('');
  };

  const handleReplySecret = (id: string) => {
    const reply = (replyDrafts[id] || '').trim();
    if (!reply) return;
    soundManager.playCorrect();
    setSecrets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'replied', teacherReply: reply } : s))
    );
    setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
  };

  const toggleHabitDay = (habitId: string, day: number) => {
    soundManager.playClick();
    setHabitData((prev) => {
      const targetMap = prev[habitTarget] || {};
      const days = targetMap[habitId] || [];
      const nextDays = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      return {
        ...prev,
        [habitTarget]: {
          ...targetMap,
          [habitId]: nextDays,
        },
      };
    });
  };

  const currentHabitMap = habitData[habitTarget] || {};
  const totalChecks = HABIT_ITEMS.reduce((acc, h) => acc + (currentHabitMap[h.id]?.length || 0), 0);
  const maxChecks = HABIT_ITEMS.length * 21;
  const habitPct = Math.round((totalChecks / maxChecks) * 100);
  const plantStage =
    habitPct >= 80
      ? { icon: '🌸', labelVi: 'Cây ra hoa rực rỡ (Xuất sắc!)', labelEn: 'Blooming Tree (Excellent!)' }
      : habitPct >= 55
        ? { icon: '🌳', labelVi: 'Cây trưởng thành vững chãi', labelEn: 'Strong Grown Tree' }
        : habitPct >= 30
          ? { icon: '🪴', labelVi: 'Cây non đang vươn lá', labelEn: 'Growing Sapling' }
          : habitPct >= 10
            ? { icon: '🌿', labelVi: 'Mầm xanh mới nhú', labelEn: 'Fresh Sprout' }
            : { icon: '🌱', labelVi: 'Hạt giống khởi đầu', labelEn: 'Starter Seed' };

  const activePsychQuiz = PSYCH_QUIZZES.find((q) => q.id === selectedQuizId) || PSYCH_QUIZZES[0];
  const quizCompleted = Object.keys(quizAnswers).length === activePsychQuiz.questions.length;
  const dominantTrait: 'visual' | 'auditory' | 'kinesthetic' = (() => {
    const counts = { visual: 0, auditory: 0, kinesthetic: 0 };
    Object.values(quizAnswers).forEach((t) => {
      counts[t] += 1;
    });
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'visual') as
      | 'visual'
      | 'auditory'
      | 'kinesthetic';
  })();

  const currentTrivia = TRIVIA_BANK[triviaIdx % TRIVIA_BANK.length];

  const handleTriviaPick = (oIdx: number) => {
    if (triviaPicked !== null) return;
    setTriviaPicked(oIdx);
    setTriviaRunning(false);
    if (oIdx === currentTrivia.correctIdx) {
      soundManager.playCorrect();
      const bonus = 100 + triviaTimeLeft * 5;
      setTriviaTeamScores((prev) =>
        prev.map((tm, idx) =>
          idx === activeTriviaTeam ? { ...tm, score: tm.score + bonus } : tm
        )
      );
      try {
        confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundManager.playWrong();
    }
  };

  const tabs: { id: ClassLifeTab; labelVi: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'wall', labelVi: 'Gương Sáng & Góc Sẻ Chia', labelEn: 'Wall of Fame & Sharing Box', icon: Award },
    { id: 'psych_quiz', labelVi: 'Trắc Nghiệm Tâm Lý & Hướng Nghiệp', labelEn: 'Psychology & Career Quiz', icon: Brain },
    { id: 'habit_21', labelVi: '21 Ngày Rèn Thói Quen Tốt', labelEn: '21-Day Habit Tracker', icon: CalendarCheck },
    { id: 'trivia', labelVi: 'Rung Chuông Vàng Sinh Hoạt', labelEn: 'Class Mini Trivia Arena', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isEn ? 'Homeroom & Classroom Culture Hub' : 'Không Gian Sinh Hoạt Lớp & Kết Nối Học Trò'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {isEn ? 'Class Life, Counseling & Habit Arena' : 'Sinh Hoạt Lớp Hạnh Phúc · Gương Sáng & Rung Chuông Vàng'}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 max-w-3xl">
          {isEn
            ? 'Manage weekly praise walls, anonymous student sharing letters, quick learning-style quizzes, 21-day habit streaks, and live classroom trivia.'
            : 'Công cụ hỗ trợ Cô Diễm Quỳnh tuyên dương gương sáng tuần qua, lắng nghe hộp thư ẩn danh Góc sẻ chia, khảo sát tâm lý nhanh, theo dõi 21 ngày rèn thói quen và tổ chức Rung chuông vàng cuối tuần.'}
        </p>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tb.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isEn ? tb.labelEn : tb.labelVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: WALL OF FAME & ANONYMOUS SHARING BOX */}
      {activeTab === 'wall' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Wall of Fame & Gratitude */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isEn ? 'Weekly Wall of Fame & Gratitude' : 'Góc Gương Sáng Tuần Qua & Vạn Lời Tri Ân'}</span>
            </h3>

            {/* Add praise form */}
            <form onSubmit={handleAddPraise} className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200/80 dark:border-slate-700 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={newPraiseStudent}
                  onChange={(e) => setNewPraiseStudent(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Tập thể Lớp 6A1">Tập thể Lớp 6A1</option>
                </select>
                <select
                  value={newPraiseCat}
                  onChange={(e) => setNewPraiseCat(e.target.value as 'academic' | 'kindness' | 'progress')}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                >
                  <option value="progress">{isEn ? 'Great Progress' : 'Tiến bộ vượt bậc'}</option>
                  <option value="kindness">{isEn ? 'Kindness & Gratitude' : 'Việc tốt & Tri ân'}</option>
                  <option value="academic">{isEn ? 'Academic Star' : 'Gương sáng học tập'}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPraiseMsg}
                  onChange={(e) => setNewPraiseMsg(e.target.value)}
                  placeholder={isEn ? 'Write a commendation or thank-you note...' : 'Nhập lời tuyên dương hoặc lời tri ân...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Post' : 'Đăng Lên Tường'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {praises.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                      🌟 {p.studentName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                      {p.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{p.message}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{p.author}</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setPraises((prev) =>
                          prev.map((item) =>
                            item.id === p.id ? { ...item, likes: item.likes + 1 } : item
                          )
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{p.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Anonymous Sharing Box ("Góc sẻ chia") */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareLock className="w-5 h-5 text-indigo-600" />
              <span>{isEn ? 'Anonymous "Sharing Box"' : 'Hộp Thư Ẩn Danh "Góc Sẻ Chia"'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Private channel for students to share thoughts or worries safely with their homeroom teacher.'
                : 'Kênh bảo mật tiếp nhận tâm tư, áp lực học tập hoặc góp ý thầm kín từ học sinh gửi cô giáo chủ nhiệm.'}
            </p>

            <form onSubmit={handleAddSecret} className="space-y-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800/70 border border-indigo-100 dark:border-slate-700">
              <select
                value={secretTopic}
                onChange={(e) => setSecretTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="Tâm tư học tập">{isEn ? 'Study Stress' : 'Tâm tư / Áp lực học tập'}</option>
                <option value="Quan hệ bạn bè">{isEn ? 'Peer Relationships' : 'Chuyện bạn bè trong lớp'}</option>
                <option value="Góp ý hoạt động lớp">{isEn ? 'Class Activity Ideas' : 'Góp ý hoạt động sinh hoạt lớp'}</option>
              </select>
              <textarea
                rows={2}
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder={isEn ? 'Write an anonymous note to test...' : 'Nhập tâm sự ẩn danh mẫu để lưu vào hộp thư...'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? 'Send Anonymous Note' : 'Gửi Thư Ẩn Danh'}</span>
              </button>
            </form>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {secrets.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">🔒 {sec.topic}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        sec.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sec.status === 'replied'
                        ? isEn ? 'Replied' : 'Đã phản hồi'
                        : isEn ? 'New' : 'Chưa trả lời'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200">{sec.content}</p>
                  {sec.teacherReply ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200">
                      <b>Cô Diễm Quỳnh:</b> {sec.teacherReply}
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={replyDrafts[sec.id] || ''}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({ ...prev, [sec.id]: e.target.value }))
                        }
                        placeholder={isEn ? 'Teacher reply...' : 'Cô giáo ghi chú phản hồi...'}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleReplySecret(sec.id)}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        {isEn ? 'Reply' : 'Gửi'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PSYCHOLOGY & CAREER QUICK QUIZ */}
      {activeTab === 'psych_quiz' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>{isEn ? 'Psychology & Career Quick Quiz' : 'Trắc Nghiệm Tâm Lý & Hướng Nghiệp Nhanh'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Run directly with your class to analyze learning styles & time-management habits.'
                  : 'Chiếu cho học sinh tự trắc nghiệm nhanh trên lớp và nhận phân tích lời khuyên từ cô chủ nhiệm.'}
              </p>
            </div>
            <div className="flex gap-2">
              {PSYCH_QUIZZES.map((qz) => (
                <button
                  key={qz.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedQuizId(qz.id);
                    setQuizAnswers({});
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    selectedQuizId === qz.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isEn ? qz.titleEn : qz.titleVi}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {activePsychQuiz.questions.map((item, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {qIdx + 1}. {isEn ? item.qEn : item.qVi}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {item.opts.map((opt, oIdx) => {
                    const isPicked = quizAnswers[qIdx] === opt.trait;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setQuizAnswers((prev) => ({ ...prev, [qIdx]: opt.trait }));
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        {isEn ? opt.labelEn : opt.labelVi}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {quizCompleted && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-700 space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                ✨ {isEn ? 'Automatic Personality Result' : 'Kết Quả Phân Tích Tự Động'}
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {isEn
                  ? activePsychQuiz.results[dominantTrait].nameEn
                  : activePsychQuiz.results[dominantTrait].nameVi}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {isEn
                  ? activePsychQuiz.results[dominantTrait].adviceEn
                  : activePsychQuiz.results[dominantTrait].adviceVi}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 21-DAY HABIT TRACKER GAME */}
      {activeTab === 'habit_21' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>{isEn ? '21-Day Good Habit Challenge' : 'Thử Thách "21 Ngày Rèn Thói Quen Tốt"'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Tick daily completed habits by team or student to grow the virtual class plant!'
                  : 'Tích vào từng ngày hoàn thành nhiệm vụ để thanh tiến độ tăng và cây trồng ảo lớn dần qua 5 giai đoạn.'}
              </p>
            </div>

            <select
              value={habitTarget}
              onChange={(e) => setHabitTarget(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="Tổ 1">Tổ 1 · Rồng Xanh</option>
              <option value="Tổ 2">Tổ 2 · Hổ Đỏ</option>
              <option value="Tổ 3">Tổ 3 · Đại Bàng</option>
              <option value="Tổ 4">Tổ 4 · Phượng Hoàng</option>
              {students.slice(0, 6).map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Virtual Plant & Progress Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center text-3xl shadow-xs">
                {plantStage.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {habitTarget} · {totalChecks}/{maxChecks} {isEn ? 'checks' : 'lượt hoàn thành'}
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {isEn ? plantStage.labelEn : plantStage.labelVi}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-64 space-y-1">
              <div className="flex justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                <span>{isEn ? '21-Day Progress' : 'Tiến độ 21 ngày'}</span>
                <span>{habitPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-emerald-200/70 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${habitPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 21-day check matrix */}
          <div className="space-y-3">
            {HABIT_ITEMS.map((habit) => {
              const checkedDays = currentHabitMap[habit.id] || [];
              return (
                <div
                  key={habit.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                    <span>✅ {isEn ? habit.labelEn : habit.labelVi}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      {checkedDays.length}/21 {isEn ? 'days' : 'ngày'}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 sm:grid-cols-21 gap-1.5">
                    {Array.from({ length: 21 }, (_, idx) => idx + 1).map((day) => {
                      const done = checkedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleHabitDay(habit.id, day)}
                          className={`h-7 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            done
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CLASS MINI TRIVIA / RUNG CHUÔNG VÀNG */}
      {activeTab === 'trivia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  {isEn ? currentTrivia.categoryEn : currentTrivia.categoryVi}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? 'Golden Bell Mini Trivia' : 'Sân Chơi Rung Chuông Vàng Sinh Hoạt Lớp'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-mono font-black text-sm flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
                  <Timer className="w-4 h-4" />
                  <span>{triviaTimeLeft}s</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTriviaTimeLeft(15);
                    setTriviaPicked(null);
                    setTriviaRunning(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Start 15s' : 'Bắt đầu 15s'}
                </button>
              </div>
            </div>

            {/* Active Answering Team Selector */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {isEn ? 'Answering Team:' : 'Đội giành quyền trả lời:'}
              </span>
              {triviaTeamScores.map((tm, idx) => (
                <button
                  key={tm.name}
                  type="button"
                  onClick={() => setActiveTriviaTeam(idx)}
                  className={`px-3 py-1 rounded-lg font-bold border cursor-pointer ${
                    activeTriviaTeam === idx
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tm.name}
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-4">
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {isEn ? `Question ${triviaIdx + 1}: ` : `Câu ${triviaIdx + 1}: `}
                {isEn ? currentTrivia.qEn : currentTrivia.qVi}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(isEn ? currentTrivia.optionsEn : currentTrivia.optionsVi).map((opt, oIdx) => {
                  const isCorrect = oIdx === currentTrivia.correctIdx;
                  const isPicked = triviaPicked === oIdx;
                  let cls =
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100';
                  if (triviaPicked !== null) {
                    if (isCorrect) {
                      cls = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isPicked) {
                      cls = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else {
                      cls = 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60';
                    }
                  }
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleTriviaPick(oIdx)}
                      disabled={triviaPicked !== null}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 cursor-pointer ${cls}`}
                    >
                      <span>
                        <b>{String.fromCharCode(65 + oIdx)}.</b> {opt}
                      </span>
                      {triviaPicked !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {triviaPicked !== null && isPicked && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setTriviaIdx((i) => (i + 1) % TRIVIA_BANK.length);
                  setTriviaPicked(null);
                  setTriviaTimeLeft(15);
                  setTriviaRunning(false);
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Next Question' : 'Sang Câu Tiếp Theo'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Trivia Leaderboard */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{isEn ? 'Live Team Ranking' : 'Bảng Xếp Hạng Thời Gian Thực'}</span>
            </h4>
            <div className="space-y-2">
              {[...triviaTeamScores]
                .sort((a, b) => b.score - a.score)
                .map((tm, rank) => (
                  <div
                    key={tm.name}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold"
                  >
                    <span className="text-slate-800 dark:text-slate-100">
                      #{rank + 1} {tm.name}
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-amber-300">{tm.score} đ</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
