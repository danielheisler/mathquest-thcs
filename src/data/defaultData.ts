import { Classroom, Student, Question, LeaderboardEntry, PeriodicReport } from '../types/math';
import { extraBilingualQuestions } from './extraQuestionsData';

export const initialClassrooms: Classroom[] = [
  {
    id: 'class-6a1',
    name: 'Lớp 6A1',
    grade: 6,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
    subjectTeacher: 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
    duties: 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS',
    roomNumber: 'Phòng 201',
    studentIds: ['s1', 's2', 's3', 's4']
  },
  {
    id: 'class-7a2',
    name: 'Lớp 7A2',
    grade: 7,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
    subjectTeacher: 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
    duties: 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS',
    roomNumber: 'Phòng 302',
    studentIds: ['s5', 's6', 's7', 's8']
  },
  {
    id: 'class-8b',
    name: 'Lớp 8B',
    grade: 8,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
    subjectTeacher: 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
    duties: 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS',
    roomNumber: 'Phòng 401',
    studentIds: ['s9', 's10', 's11', 's12']
  },
  {
    id: 'class-9c',
    name: 'Lớp 9C',
    grade: 9,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Diễm Quỳnh (GV Chủ Nhiệm)',
    subjectTeacher: 'Cô Diễm Quỳnh (GV Bộ Môn Toán)',
    duties: 'Chủ nhiệm lớp & Giảng dạy bộ môn Toán THCS',
    roomNumber: 'Phòng 503',
    studentIds: ['s13', 's14', 's15', 's16']
  }
];

export const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Nguyễn Minh Quân',
    classId: 'class-6a1',
    gender: 'male',
    avatarSeed: 'Felix',
    overallScore: 9.4,
    gamesPlayed: 28,
    accuracyRate: 92,
    averageTimeSec: 8.2,
    badge: 'Vua Tốc Độ Số Học',
    topicsMastery: {
      arithmetic: 95,
      rational: 90,
      algebra: 85,
      equation: 88,
      geometry: 82,
      statistics: 90
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Thử thách Tốc độ', score: 950, timeSec: 42, totalQuestions: 10 },
      { date: '22/10/2026', gameTitle: 'Đấu trường Đội nhóm', score: 880, timeSec: 55, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0912345678',
    parentName: 'Bác Nguyễn Minh Đức (Bố)',
    teacherNotes: 'Tư duy tính nhẩm cực nhanh, luôn dẫn đầu vòng khởi động.'
  },
  {
    id: 's2',
    name: 'Lê Hoàng Bảo Ngọc',
    classId: 'class-6a1',
    gender: 'female',
    avatarSeed: 'Aneka',
    overallScore: 9.0,
    gamesPlayed: 24,
    accuracyRate: 94,
    averageTimeSec: 10.5,
    badge: 'Bậc Thầy Cẩn Thận',
    topicsMastery: {
      arithmetic: 92,
      rational: 96,
      algebra: 88,
      equation: 85,
      geometry: 92,
      statistics: 88
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Mật Mã Số Học', score: 920, timeSec: 58, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0983456789',
    parentName: 'Cô Hoàng Thu Thảo (Mẹ)',
    teacherNotes: 'Làm bài chắc chắn, tỉ mỉ, trình bày lời giải rõ ràng.'
  },
  {
    id: 's3',
    name: 'Trần Gia Huy',
    classId: 'class-6a1',
    gender: 'male',
    avatarSeed: 'Jack',
    overallScore: 7.8,
    gamesPlayed: 19,
    accuracyRate: 78,
    averageTimeSec: 14.1,
    badge: 'Chiến Binh Nỗ Lực',
    topicsMastery: {
      arithmetic: 80,
      rational: 74,
      algebra: 70,
      equation: 76,
      geometry: 85,
      statistics: 78
    },
    recentHistory: [
      { date: '23/10/2026', gameTitle: 'Phá Bom Số Học', score: 720, timeSec: 68, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0978123456',
    parentName: 'Bác Trần Văn Cường (Bố)',
    teacherNotes: 'Tiến bộ rõ rệt ở phần Phân số và Hình học trực quan.'
  },
  {
    id: 's4',
    name: 'Phạm Quỳnh Anh',
    classId: 'class-6a1',
    gender: 'female',
    avatarSeed: 'Molly',
    overallScore: 8.6,
    gamesPlayed: 22,
    accuracyRate: 88,
    averageTimeSec: 11.0,
    badge: 'Ngôi Sao Tri Thức',
    topicsMastery: {
      arithmetic: 88,
      rational: 85,
      algebra: 82,
      equation: 84,
      geometry: 90,
      statistics: 86
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Lật Thẻ Ghép Đôi', score: 850, timeSec: 50, totalQuestions: 8 }
    ],
    attendance: 'present',
    parentPhone: '0903987654',
    parentName: 'Cô Phạm Thị Mai (Mẹ)',
    teacherNotes: 'Tích cực tham gia trò chơi tương tác, làm việc nhóm tốt.'
  },
  {
    id: 's5',
    name: 'Vũ Đức Trọng',
    classId: 'class-7a2',
    gender: 'male',
    avatarSeed: 'Leo',
    overallScore: 9.6,
    gamesPlayed: 32,
    accuracyRate: 96,
    averageTimeSec: 7.8,
    badge: 'Thần Đồng Số Hữu Tỉ',
    topicsMastery: {
      arithmetic: 98,
      rational: 96,
      algebra: 94,
      equation: 92,
      geometry: 90,
      statistics: 95
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Thử thách Tốc độ', score: 980, timeSec: 38, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0918765432',
    parentName: 'Bác Vũ Văn Hùng (Bố)',
    teacherNotes: 'Đạt điểm tuyệt đối trong đợt khảo sát số hữu tỉ vừa qua.'
  },
  {
    id: 's6',
    name: 'Đỗ Thảo Linh',
    classId: 'class-7a2',
    gender: 'female',
    avatarSeed: 'Zoe',
    overallScore: 8.9,
    gamesPlayed: 25,
    accuracyRate: 90,
    averageTimeSec: 9.5,
    badge: 'Phù Thủy Hình Học',
    topicsMastery: {
      arithmetic: 85,
      rational: 88,
      algebra: 86,
      equation: 88,
      geometry: 96,
      statistics: 87
    },
    recentHistory: [
      { date: '23/10/2026', gameTitle: 'Khám Phá Góc & Tam Giác', score: 900, timeSec: 45, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0979876543',
    parentName: 'Cô Nguyễn Thị Hoa (Mẹ)',
    teacherNotes: 'Rất xuất sắc trong việc chứng minh hai tam giác bằng nhau.'
  },
  {
    id: 's7',
    name: 'Bùi Tuấn Kiệt',
    classId: 'class-7a2',
    gender: 'male',
    avatarSeed: 'Oliver',
    overallScore: 7.5,
    gamesPlayed: 18,
    accuracyRate: 74,
    averageTimeSec: 15.2,
    badge: 'Tay Đua Bền Bỉ',
    topicsMastery: {
      arithmetic: 78,
      rational: 70,
      algebra: 72,
      equation: 75,
      geometry: 76,
      statistics: 80
    },
    recentHistory: [
      { date: '22/10/2026', gameTitle: 'Phá Bom Số Học', score: 710, timeSec: 72, totalQuestions: 10 }
    ],
    attendance: 'late',
    parentPhone: '0966543210',
    parentName: 'Bác Bùi Văn Thắng (Bố)',
    teacherNotes: 'Cần củng cố thêm các phép toán quy đồng mẫu số hữu tỉ.'
  },
  {
    id: 's8',
    name: 'Dương Khánh Linh',
    classId: 'class-7a2',
    gender: 'female',
    avatarSeed: 'Sophie',
    overallScore: 9.2,
    gamesPlayed: 27,
    accuracyRate: 92,
    averageTimeSec: 9.0,
    badge: 'Chiến Tướng Toàn Năng',
    topicsMastery: {
      arithmetic: 92,
      rational: 90,
      algebra: 91,
      equation: 93,
      geometry: 90,
      statistics: 94
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Đấu trường Đội nhóm', score: 920, timeSec: 48, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0915678901',
    parentName: 'Cô Dương Thị Bích (Mẹ)',
    teacherNotes: 'Đội trưởng mẫu mực, dẫn dắt đội Rồng Xanh rất xuất sắc.'
  },
  {
    id: 's9',
    name: 'Hoàng Quốc Bảo',
    classId: 'class-8b',
    gender: 'male',
    avatarSeed: 'Mason',
    overallScore: 9.5,
    gamesPlayed: 35,
    accuracyRate: 95,
    averageTimeSec: 8.5,
    badge: 'Đại Sư Hằng Đẳng Thức',
    topicsMastery: {
      arithmetic: 94,
      rational: 92,
      algebra: 98,
      equation: 95,
      geometry: 92,
      statistics: 90
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Mật Mã Số Học', score: 960, timeSec: 40, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0988776655',
    parentName: 'Bác Hoàng Minh Tuấn (Bố)',
    teacherNotes: 'Vận dụng 7 hằng đẳng thức đáng nhớ thành thạo và sáng tạo.'
  },
  {
    id: 's10',
    name: 'Ngô Thanh Hằng',
    classId: 'class-8b',
    gender: 'female',
    avatarSeed: 'Chloe',
    overallScore: 8.8,
    gamesPlayed: 26,
    accuracyRate: 89,
    averageTimeSec: 10.8,
    badge: 'Bậc Thầy Pythagore',
    topicsMastery: {
      arithmetic: 88,
      rational: 86,
      algebra: 87,
      equation: 85,
      geometry: 95,
      statistics: 89
    },
    recentHistory: [
      { date: '23/10/2026', gameTitle: 'Thử thách Tốc độ', score: 870, timeSec: 52, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0908112233',
    parentName: 'Cô Ngô Kim Chi (Mẹ)',
    teacherNotes: 'Hiểu sâu bản chất hình học, vẽ hình nhanh và chính xác.'
  },
  {
    id: 's11',
    name: 'Phan Tấn Đạt',
    classId: 'class-8b',
    gender: 'male',
    avatarSeed: 'Lucas',
    overallScore: 7.9,
    gamesPlayed: 21,
    accuracyRate: 80,
    averageTimeSec: 13.5,
    badge: 'Chiến Binh Vượt Khó',
    topicsMastery: {
      arithmetic: 82,
      rational: 79,
      algebra: 76,
      equation: 80,
      geometry: 82,
      statistics: 84
    },
    recentHistory: [
      { date: '21/10/2026', gameTitle: 'Cân Thăng Bằng Phương Trình', score: 800, timeSec: 62, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0977445566',
    parentName: 'Bác Phan Văn An (Bố)',
    teacherNotes: 'Có tiến bộ vượt bậc sau khi thực hành qua mô phỏng cân đĩa.'
  },
  {
    id: 's12',
    name: 'Trịnh Phương Uyên',
    classId: 'class-8b',
    gender: 'female',
    avatarSeed: 'Mia',
    overallScore: 9.1,
    gamesPlayed: 29,
    accuracyRate: 91,
    averageTimeSec: 9.3,
    badge: 'Ngọn Hải Đăng Toán Học',
    topicsMastery: {
      arithmetic: 90,
      rational: 90,
      algebra: 93,
      equation: 91,
      geometry: 89,
      statistics: 92
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Đấu trường Đội nhóm', score: 910, timeSec: 46, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0933221100',
    parentName: 'Cô Lê Thị Mỹ Hạnh (Mẹ)',
    teacherNotes: 'Chăm chỉ, học tập chủ động và giúp đỡ bạn bè cùng tiến.'
  },
  {
    id: 's13',
    name: 'Nguyễn Đăng Khoa',
    classId: 'class-9c',
    gender: 'male',
    avatarSeed: 'Alexander',
    overallScore: 9.8,
    gamesPlayed: 40,
    accuracyRate: 98,
    averageTimeSec: 6.9,
    badge: 'Huyền Thoại Toán 9',
    topicsMastery: {
      arithmetic: 99,
      rational: 98,
      algebra: 98,
      equation: 99,
      geometry: 97,
      statistics: 96
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Thử thách Tốc độ', score: 1000, timeSec: 32, totalQuestions: 10 },
      { date: '23/10/2026', gameTitle: 'Đấu trường Đội nhóm', score: 980, timeSec: 35, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0919998877',
    parentName: 'Bác Nguyễn Đăng Quang (Bố)',
    teacherNotes: 'Năng lực tư duy đỉnh cao, giải hệ phương trình và căn thức cực nhanh.'
  },
  {
    id: 's14',
    name: 'Trần Thị Mỹ Duyên',
    classId: 'class-9c',
    gender: 'female',
    avatarSeed: 'Emma',
    overallScore: 9.3,
    gamesPlayed: 31,
    accuracyRate: 93,
    averageTimeSec: 8.9,
    badge: 'Nữ Vương Hàm Số',
    topicsMastery: {
      arithmetic: 92,
      rational: 91,
      algebra: 95,
      equation: 94,
      geometry: 93,
      statistics: 94
    },
    recentHistory: [
      { date: '24/10/2026', gameTitle: 'Mô phỏng Đồ Thị Hàm Số', score: 940, timeSec: 44, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0981223344',
    parentName: 'Cô Trần Ánh Tuyết (Mẹ)',
    teacherNotes: 'Hiểu sâu về đồ thị hàm số y = ax², phương trình bậc hai và định lí Viète.'
  },
  {
    id: 's15',
    name: 'Võ Minh Triết',
    classId: 'class-9c',
    gender: 'male',
    avatarSeed: 'Ethan',
    overallScore: 8.4,
    gamesPlayed: 24,
    accuracyRate: 85,
    averageTimeSec: 11.4,
    badge: 'Dũng Sĩ Hình Tròn',
    topicsMastery: {
      arithmetic: 85,
      rational: 84,
      algebra: 83,
      equation: 85,
      geometry: 92,
      statistics: 86
    },
    recentHistory: [
      { date: '22/10/2026', gameTitle: 'Mật Mã Số Học', score: 840, timeSec: 56, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0965332211',
    parentName: 'Bác Võ Hoài Nam (Bố)',
    teacherNotes: 'Chứng minh tứ giác nội tiếp tiến bộ rõ rệt.'
  },
  {
    id: 's16',
    name: 'Lê Cẩm Tú',
    classId: 'class-9c',
    gender: 'female',
    avatarSeed: 'Avery',
    overallScore: 8.7,
    gamesPlayed: 27,
    accuracyRate: 88,
    averageTimeSec: 10.2,
    badge: 'Chiến Thần Hệ Phương Trình',
    topicsMastery: {
      arithmetic: 88,
      rational: 87,
      algebra: 89,
      equation: 90,
      geometry: 84,
      statistics: 90
    },
    recentHistory: [
      { date: '23/10/2026', gameTitle: 'Thử thách Tốc độ', score: 880, timeSec: 49, totalQuestions: 10 }
    ],
    attendance: 'present',
    parentPhone: '0944556677',
    parentName: 'Cô Lê Hoàng Yến (Mẹ)',
    teacherNotes: 'Giải hệ phương trình bằng phương pháp thế và cộng đại số rất vững.'
  }
];

export const initialQuestions: Question[] = [
  // --- KHỐI 6 ---
  {
    id: 'q6-1',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số học & Số nguyên',
    topicNameEn: 'Arithmetic & Integers',
    difficulty: 'easy',
    questionText: 'Tính giá trị của biểu thức: $(-15) + 27 = ?$',
    questionTextEn: 'Calculate the value of: $(-15) + 27 = ?$',
    formula: '(-15) + 27 = 12',
    options: ['12', '-12', '42', '-42'],
    correctAnswerIndex: 0,
    explanation: 'Cộng hai số nguyên khác dấu: lấy số có giá trị tuyệt đối lớn hơn trừ số có giá trị tuyệt đối nhỏ hơn: $27 - 15 = 12$.',
    explanationEn: 'Adding integers with opposite signs: subtract the smaller absolute value from the larger one: $27 - 15 = 12$.',
    hint: 'Lấy phần số dương lớn hơn trừ đi phần số âm.',
    hintEn: 'Subtract 15 from 27.'
  },
  {
    id: 'q6-2',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số học & Ước số',
    topicNameEn: 'Arithmetic & Divisors',
    difficulty: 'medium',
    questionText: 'Ước chung lớn nhất của $24$ và $36$ là bao nhiêu?',
    questionTextEn: 'What is the Greatest Common Divisor (GCD) of $24$ and $36$?',
    formula: '\\text{ƯCLN}(24, 36) = 12',
    options: ['6', '8', '12', '18'],
    correctAnswerIndex: 2,
    explanation: 'Phân tích ra thừa số nguyên tố: $24 = 2^3 \\cdot 3$; $36 = 2^2 \\cdot 3^2$. Do đó $\\text{ƯCLN}(24, 36) = 2^2 \\cdot 3 = 12$.',
    explanationEn: 'Prime factorization: $24 = 2^3 \\cdot 3$; $36 = 2^2 \\cdot 3^2$. Thus $\\text{GCD}(24, 36) = 2^2 \\cdot 3 = 12$.',
    hint: 'Chọn các thừa số nguyên tố chung với số mũ nhỏ nhất.',
    hintEn: 'Take common prime factors with the lowest exponents.'
  },
  {
    id: 'q6-3',
    grade: 6,
    topic: 'rational',
    topicName: 'Phân số',
    topicNameEn: 'Fractions',
    difficulty: 'easy',
    questionText: 'Rút gọn phân số $\\frac{18}{24}$ về phân số tối giản:',
    questionTextEn: 'Simplify the fraction $\\frac{18}{24}$ to its lowest terms:',
    formula: '\\frac{18}{24} = \\frac{18 : 6}{24 : 6} = \\frac{3}{4}',
    options: ['\\frac{3}{4}', '\\frac{9}{12}', '\\frac{2}{3}', '\\frac{6}{8}'],
    correctAnswerIndex: 0,
    explanation: 'Chia cả tử và mẫu cho $\\text{ƯCLN}$ là $6$: $\\frac{18 : 6}{24 : 6} = \\frac{3}{4}$.',
    explanationEn: 'Divide both numerator and denominator by $\\text{GCD} = 6$: $\\frac{18 \\div 6}{24 \\div 6} = \\frac{3}{4}$.',
    hint: 'Chia cả tử và mẫu cho 6.',
    hintEn: 'Divide numerator and denominator by 6.'
  },
  {
    id: 'q6-4',
    grade: 6,
    topic: 'geometry',
    topicName: 'Hình học phẳng',
    topicNameEn: 'Plane Geometry',
    difficulty: 'medium',
    questionText: 'Cho tia $Ot$ là tia phân giác của góc $\\widehat{xOy} = 80^\\circ$. Số đo góc $\\widehat{xOt}$ bằng bao nhiêu?',
    questionTextEn: 'Ray $Ot$ is the angle bisector of $\\widehat{xOy} = 80^\\circ$. What is the measure of $\\widehat{xOt}$?',
    formula: '\\widehat{xOt} = \\frac{\\widehat{xOy}}{2} = \\frac{80^\\circ}{2} = 40^\\circ',
    options: ['40^\\circ', '80^\\circ', '160^\\circ', '45^\\circ'],
    correctAnswerIndex: 0,
    explanation: 'Tia phân giác chia góc thành hai góc bằng nhau: $\\widehat{xOt} = \\frac{80^\\circ}{2} = 40^\\circ$.',
    explanationEn: 'An angle bisector divides the angle into two equal parts: $\\widehat{xOt} = \\frac{80^\\circ}{2} = 40^\\circ$.'
  },

  // --- KHỐI 7 ---
  {
    id: 'q7-1',
    grade: 7,
    topic: 'rational',
    topicName: 'Số hữu tỉ',
    topicNameEn: 'Rational Numbers',
    difficulty: 'easy',
    questionText: 'Kết quả của phép tính $\\left(-\\frac{2}{3}\\right) \\times \\left(\\frac{9}{4}\\right)$ là:',
    questionTextEn: 'What is the result of $\\left(-\\frac{2}{3}\\right) \\times \\left(\\frac{9}{4}\\right)$?',
    formula: '\\left(-\\frac{2}{3}\\right) \\times \\left(\\frac{9}{4}\\right) = -\\frac{18}{12} = -\\frac{3}{2}',
    options: ['-\\frac{3}{2}', '\\frac{3}{2}', '-\\frac{1}{2}', '-\\frac{6}{12}'],
    correctAnswerIndex: 0,
    explanation: 'Tử nhân tử, mẫu nhân mẫu: $\\frac{-2 \\times 9}{3 \\times 4} = -\\frac{18}{12} = -\\frac{3}{2}$.',
    explanationEn: 'Multiply numerators and denominators: $\\frac{-2 \\times 9}{3 \\times 4} = -\\frac{18}{12} = -\\frac{3}{2}$.',
    hint: 'Rút gọn chéo 2 với 4 và 9 với 3 trước khi nhân.',
    hintEn: 'Cross-simplify 2 with 4 and 9 with 3 before multiplying.'
  },
  {
    id: 'q7-2',
    grade: 7,
    topic: 'equation',
    topicName: 'Tìm x - Tỉ lệ thức',
    topicNameEn: 'Proportions',
    difficulty: 'medium',
    questionText: 'Tìm $x$ biết tỉ lệ thức: $\\frac{x}{6} = \\frac{5}{2}$',
    questionTextEn: 'Find $x$ from the proportion: $\\frac{x}{6} = \\frac{5}{2}$',
    formula: '\\frac{x}{6} = \\frac{5}{2} \\implies 2x = 30 \\implies x = 15',
    options: ['x = 15', 'x = 10', 'x = 12', 'x = 30'],
    correctAnswerIndex: 0,
    explanation: 'Áp dụng tính chất tỉ lệ thức $\\frac{a}{b} = \\frac{c}{d} \\implies a \\cdot d = b \\cdot c$: $2 \\cdot x = 6 \\cdot 5 \\implies 2x = 30 \\implies x = 15$.',
    explanationEn: 'Cross-multiply: $2 \\cdot x = 6 \\cdot 5 \\implies 2x = 30 \\implies x = 15$.',
    hint: 'Nhân chéo: 2 nhân x bằng 6 nhân 5.',
    hintEn: 'Cross-multiply: $2x = 6 \\times 5$.'
  },
  {
    id: 'q7-3',
    grade: 7,
    topic: 'geometry',
    topicName: 'Tam giác & Góc',
    topicNameEn: 'Triangles & Angles',
    difficulty: 'medium',
    questionText: 'Trong tam giác vuông $\\triangle ABC$ tại $A$, biết góc $\\widehat{B} = 35^\\circ$. Số đo góc $\\widehat{C}$ là:',
    questionTextEn: 'In right triangle $\\triangle ABC$ at $A$, given $\\widehat{B} = 35^\\circ$, find $\\widehat{C}$.',
    formula: '\\widehat{C} = 90^\\circ - 35^\\circ = 55^\\circ',
    options: ['55^\\circ', '65^\\circ', '145^\\circ', '45^\\circ'],
    correctAnswerIndex: 0,
    explanation: 'Trong tam giác vuông, hai góc nhọn phụ nhau: $\\widehat{C} = 90^\\circ - \\widehat{B} = 90^\\circ - 35^\\circ = 55^\\circ$.',
    explanationEn: 'In a right triangle, the two acute angles are complementary: $\\widehat{C} = 90^\\circ - 35^\\circ = 55^\\circ$.'
  },
  {
    id: 'q7-4',
    grade: 7,
    topic: 'statistics',
    topicName: 'Thống kê & Xác suất',
    topicNameEn: 'Statistics & Probability',
    difficulty: 'easy',
    questionText: 'Gieo một con xúc xắc cân đối 6 mặt. Xác suất để xuất hiện mặt có số chấm là số chẵn là:',
    questionTextEn: 'Roll a fair 6-sided die. What is the probability of rolling an even number?',
    formula: 'P = \\frac{3}{6} = \\frac{1}{2}',
    options: ['\\frac{1}{2}', '\\frac{1}{3}', '\\frac{1}{6}', '\\frac{2}{3}'],
    correctAnswerIndex: 0,
    explanation: 'Tập kết quả thuận lợi $\\{2; 4; 6\\}$ (3 kết quả) trên tổng số 6 kết quả: $P = \\frac{3}{6} = \\frac{1}{2}$.',
    explanationEn: 'Favorable outcomes are $\\{2, 4, 6\\}$ (3 out of 6): $P = \\frac{3}{6} = \\frac{1}{2}$.'
  },

  // --- KHỐI 8 ---
  {
    id: 'q8-1',
    grade: 8,
    topic: 'algebra',
    topicName: 'Hằng đẳng thức đáng nhớ',
    topicNameEn: 'Algebraic Identities',
    difficulty: 'easy',
    questionText: 'Khai triển hằng đẳng thức $(x - 3)^2$ ta được kết quả là:',
    questionTextEn: 'Expand the identity $(x - 3)^2$:',
    formula: '(x - 3)^2 = x^2 - 2 \\cdot x \\cdot 3 + 3^2 = x^2 - 6x + 9',
    options: ['x^2 - 6x + 9', 'x^2 - 9', 'x^2 + 6x + 9', 'x^2 - 3x + 9'],
    correctAnswerIndex: 0,
    explanation: 'Áp dụng hằng đẳng thức $(A - B)^2 = A^2 - 2AB + B^2$: $(x - 3)^2 = x^2 - 6x + 9$.',
    explanationEn: 'Apply $(A - B)^2 = A^2 - 2AB + B^2$: $(x - 3)^2 = x^2 - 6x + 9$.'
  },
  {
    id: 'q8-2',
    grade: 8,
    topic: 'geometry',
    topicName: 'Định lí Pythagore',
    topicNameEn: 'Pythagorean Theorem',
    difficulty: 'medium',
    questionText: 'Tam giác vuông có hai cạnh góc vuông $a = 6\\text{ cm}$ và $b = 8\\text{ cm}$. Độ dài cạnh huyền $c$ là:',
    questionTextEn: 'A right triangle has legs $a = 6\\text{ cm}$ and $b = 8\\text{ cm}$. What is the hypotenuse $c$?',
    formula: 'c = \\sqrt{a^2 + b^2} = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10\\text{ cm}',
    options: ['10\\text{ cm}', '14\\text{ cm}', '12\\text{ cm}', '100\\text{ cm}'],
    correctAnswerIndex: 0,
    explanation: 'Theo định lí Pythagore (Toán 8): $c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100 \\implies c = 10\\text{ cm}$.',
    explanationEn: 'By the Pythagorean theorem (Grade 8): $c^2 = 6^2 + 8^2 = 36 + 64 = 100 \\implies c = 10\\text{ cm}$.'
  },
  {
    id: 'q8-3',
    grade: 8,
    topic: 'algebra',
    topicName: 'Phân tích đa thức thành nhân tử',
    topicNameEn: 'Factoring Polynomials',
    difficulty: 'medium',
    questionText: 'Phân tích đa thức $x^2 - 16$ thành nhân tử:',
    questionTextEn: 'Factor the polynomial $x^2 - 16$:',
    formula: 'x^2 - 16 = x^2 - 4^2 = (x - 4)(x + 4)',
    options: ['(x - 4)(x + 4)', '(x - 4)^2', '(x + 4)^2', 'x(x - 16)'],
    correctAnswerIndex: 0,
    explanation: 'Áp dụng hiệu hai bình phương: $A^2 - B^2 = (A - B)(A + B) \\implies x^2 - 4^2 = (x - 4)(x + 4)$.',
    explanationEn: 'Difference of squares: $A^2 - B^2 = (A - B)(A + B) \\implies x^2 - 4^2 = (x - 4)(x + 4)$.'
  },
  {
    id: 'q8-4',
    grade: 8,
    topic: 'equation',
    topicName: 'Phương trình bậc nhất một ẩn',
    topicNameEn: 'Linear Equations',
    difficulty: 'easy',
    questionText: 'Nghiệm của phương trình $3x - 12 = 0$ là:',
    questionTextEn: 'What is the solution of $3x - 12 = 0$?',
    formula: '3x - 12 = 0 \\iff 3x = 12 \\iff x = 4',
    options: ['x = 4', 'x = -4', 'x = 36', 'x = 3'],
    correctAnswerIndex: 0,
    explanation: 'Chuyển vế đổi dấu: $3x = 12 \\implies x = \\frac{12}{3} = 4$.',
    explanationEn: 'Add 12 to both sides: $3x = 12 \\implies x = 4$.'
  },

  // --- KHỐI 9 ---
  {
    id: 'q9-1',
    grade: 9,
    topic: 'algebra',
    topicName: 'Căn bậc hai',
    topicNameEn: 'Square Roots',
    difficulty: 'easy',
    questionText: 'Căn bậc hai số học của số $81$ là:',
    questionTextEn: 'What is the principal square root of $81$?',
    formula: '\\sqrt{81} = 9',
    options: ['9', '-9', '\\pm 9', '81'],
    correctAnswerIndex: 0,
    explanation: 'Căn bậc hai số học của số dương $a$ là số không âm $x$ sao cho $x^2 = a$. Vì $9^2 = 81$ và $9 \\ge 0$ nên $\\sqrt{81} = 9$.',
    explanationEn: 'The principal square root is the non-negative value $x$ with $x^2 = 81$, which is $9$.'
  },
  {
    id: 'q9-2',
    grade: 9,
    topic: 'geometry',
    topicName: 'Hệ thức cạnh & góc trong tam giác vuông',
    topicNameEn: 'Side-Angle Relations in Right Triangles',
    difficulty: 'medium',
    questionText: 'Cho tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 10\\text{ cm}$ và $\\widehat{B} = 30^\\circ$. Độ dài cạnh $AC$ bằng:',
    questionTextEn: 'In right triangle $ABC$ ($\\angle A = 90^\\circ$) with hypotenuse $BC = 10\\text{ cm}$ and $\\widehat{B} = 30^\\circ$, find side $AC$:',
    formula: 'AC = BC \\cdot \\sin 30^\\circ = 10 \\cdot \\frac{1}{2} = 5\\text{ cm}',
    options: ['5\\text{ cm}', '5\\sqrt{3}\\text{ cm}', '10\\text{ cm}', '20\\text{ cm}'],
    correctAnswerIndex: 0,
    explanation: 'Theo hệ thức giữa cạnh và góc trong tam giác vuông (Toán 9 – CT GDPT 2018): $AC = BC \\cdot \\sin B = 10 \\cdot \\sin 30^\\circ = 10 \\cdot \\frac{1}{2} = 5\\text{ cm}$.',
    explanationEn: 'By right-triangle trigonometry (Grade 9): $AC = BC \\cdot \\sin 30^\\circ = 10 \\cdot \\frac{1}{2} = 5\\text{ cm}$.'
  },
  {
    id: 'q9-3',
    grade: 9,
    topic: 'equation',
    topicName: 'Hệ phương trình bậc nhất hai ẩn',
    topicNameEn: 'Systems of Linear Equations',
    difficulty: 'hard',
    questionText: 'Tìm nghiệm $(x; y)$ của hệ phương trình sau:',
    questionTextEn: 'Solve for $(x, y)$ in the system of equations:',
    formula: '\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}',
    options: ['(3; 1)', '(1; 3)', '(4; 2)', '(2; 3)'],
    correctAnswerIndex: 0,
    explanation: 'Cộng từng vế hai phương trình: $3x = 9 \\implies x = 3$. Thay vào phương trình thứ hai: $3 - y = 2 \\implies y = 1$. Nghiệm là $(3; 1)$.',
    explanationEn: 'Add the two equations: $3x = 9 \\implies x = 3$. Then $3 - y = 2 \\implies y = 1$, giving $(3, 1)$.'
  },
  {
    id: 'q9-4',
    grade: 9,
    topic: 'geometry',
    topicName: 'Đường tròn & Góc nội tiếp',
    topicNameEn: 'Circles & Inscribed Angles',
    difficulty: 'medium',
    questionText: 'Góc nội tiếp chắn nửa đường tròn luôn có số đo bằng bao nhiêu?',
    questionTextEn: 'What is the measure of an inscribed angle subtending a semicircle?',
    formula: '\\widehat{AMB} = \\frac{1}{2} \\cdot 180^\\circ = 90^\\circ',
    options: ['90^\\circ \\text{ (Góc vuông)}', '45^\\circ \\text{ (Góc nhọn)}', '180^\\circ \\text{ (Góc bẹt)}', '60^\\circ'],
    optionsEn: ['90^\\circ \\text{ (Right angle)}', '45^\\circ \\text{ (Acute angle)}', '180^\\circ \\text{ (Straight angle)}', '60^\\circ'],
    correctAnswerIndex: 0,
    explanation: 'Định lí góc nội tiếp (Toán 9): Góc nội tiếp chắn nửa đường tròn có số đo bằng nửa góc ở tâm chắn nửa đường tròn: $\\frac{180^\\circ}{2} = 90^\\circ$ (góc vuông).',
    explanationEn: 'By Thales theorem, an inscribed angle subtending a diameter is half of $180^\\circ$, which is $90^\\circ$ (right angle).'
  },
  ...extraBilingualQuestions
];

export const initialLeaderboard: LeaderboardEntry[] = [
  { id: 'lb-1', studentName: 'Nguyễn Đăng Khoa', className: 'Lớp 9C', score: 1000, timeSec: 32.4, accuracy: 100, gameMode: 'Thử thách Tốc độ', date: '24/10/2026', rank: 1 },
  { id: 'lb-2', studentName: 'Vũ Đức Trọng', className: 'Lớp 7A2', score: 980, timeSec: 38.1, accuracy: 100, gameMode: 'Thử thách Tốc độ', date: '24/10/2026', rank: 2 },
  { id: 'lb-3', studentName: 'Hoàng Quốc Bảo', className: 'Lớp 8B', score: 960, timeSec: 40.5, accuracy: 100, gameMode: 'Mật Mã Số Học', date: '24/10/2026', rank: 3 },
  { id: 'lb-4', studentName: 'Nguyễn Minh Quân', className: 'Lớp 6A1', score: 950, timeSec: 42.0, accuracy: 100, gameMode: 'Thử thách Tốc độ', date: '24/10/2026', rank: 4 },
  { id: 'lb-5', studentName: 'Trần Thị Mỹ Duyên', className: 'Lớp 9C', score: 940, timeSec: 44.2, accuracy: 95, gameMode: 'Mô phỏng Đồ Thị', date: '24/10/2026', rank: 5 },
  { id: 'lb-6', studentName: 'Lê Hoàng Bảo Ngọc', className: 'Lớp 6A1', score: 920, timeSec: 45.8, accuracy: 95, gameMode: 'Mật Mã Số Học', date: '23/10/2026', rank: 6 },
  { id: 'lb-7', studentName: 'Dương Khánh Linh', className: 'Lớp 7A2', score: 920, timeSec: 48.3, accuracy: 90, gameMode: 'Đấu trường Đội nhóm', date: '24/10/2026', rank: 7 },
  { id: 'lb-8', studentName: 'Trịnh Phương Uyên', className: 'Lớp 8B', score: 910, timeSec: 46.7, accuracy: 90, gameMode: 'Đấu trường Đội nhóm', date: '24/10/2026', rank: 8 }
];

export const initialReports: Record<string, PeriodicReport> = {
  's1': {
    studentId: 's1',
    classId: 'class-6a1',
    period: 'month',
    periodLabel: 'Báo Cáo Học Tập Định Kỳ Tháng 10/2026',
    evaluationDate: '24/10/2026',
    mathScore: 9.4,
    rankInClass: 1,
    totalStudentsInClass: 38,
    attendanceRate: 100,
    participationScore: 9.8,
    strengths: [
      'Tính nhẩm và xử lý phép tính số nguyên cực nhanh.',
      'Rất hăng hái tham gia trò chơi khởi động và thi đấu đội nhóm.',
      'Khả năng tư duy logic và suy luận vấn đề tốt.'
    ],
    areasToImprove: [
      'Cần đọc kỹ lại đề bài ở các câu hỏi hình học đo góc để tránh nhầm lẫn đơn vị.',
      'Rèn thêm kỹ năng viết lời giải tự luận chi tiết theo từng bước.'
    ],
    teacherComment: 'Em Quân là một học sinh rất có năng khiếu Toán học. Em luôn chủ động và dẫn đầu trong các thử thách học tập. Khen ngợi tinh thần học tập gương mẫu của em!',
    parentAdvice: 'Gia đình tiếp tục động viên em duy trì phong độ, khuyến khích em đọc thêm sách toán nâng cao và thử sức với các bài toán hình học thực tế.',
    teacherSignature: 'Cô Diễm Quỳnh (Giáo viên bộ môn Toán)'
  },
  's5': {
    studentId: 's5',
    classId: 'class-7a2',
    period: 'month',
    periodLabel: 'Báo Cáo Học Tập Định Kỳ Tháng 10/2026',
    evaluationDate: '24/10/2026',
    mathScore: 9.6,
    rankInClass: 1,
    totalStudentsInClass: 40,
    attendanceRate: 100,
    participationScore: 10,
    strengths: [
      'Nắm vững toàn bộ kiến thức Số hữu tỉ và Tỉ lệ thức.',
      'Tốc độ giải bài nhanh nhất khối 7, độ chính xác đạt 96%.',
      'Có khả năng giải thích và hướng dẫn bài cho các bạn trong nhóm.'
    ],
    areasToImprove: [
      'Cần cẩn thận hơn khi vẽ hình minh họa cho các bài toán tam giác bằng nhau.'
    ],
    teacherComment: 'Em Trọng đạt kết quả xuất sắc toàn diện trong tháng qua. Em xứng đáng là đầu tàu học tập của lớp 7A2!',
    parentAdvice: 'Kính mong phụ huynh biểu dương thành tích của em, tạo điều kiện để em bồi dưỡng đội tuyển học sinh giỏi Toán.',
    teacherSignature: 'Cô Diễm Quỳnh (Giáo viên bộ môn Toán)'
  }
};
