import { SemesterExam } from '../types/math';

export const sampleSemesterExams: SemesterExam[] = [
  // =========================================================================
  // ========================== KHỐI 6 =======================================
  // =========================================================================

  // 1. ĐỀ KIỂM TRA 15 PHÚT KHỐI 6 (4 trắc nghiệm 4 điểm + 2 tự luận 6 điểm)
  {
    id: 'exam-g6-15m',
    code: 'KT15-K6',
    title: 'Đề Kiểm Tra 15 Phút - Số Học & Hình Học Trực Quan Khối 6',
    grade: 6,
    semester: 'HK1',
    examType: 'quiz_15m',
    durationMinutes: 15,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: 4 câu trắc nghiệm (4,0 điểm) và 2 câu tự luận (6,0 điểm). Thời gian làm bài 15 phút.',
    matrix: { nhanBiet: 50, thongHieu: 30, vanDung: 20, vanDungCao: 0 },
    questions: [
      // PHẦN I: TRẮC NGHIỆM (4 câu - 4.0 điểm, mỗi câu 1.0đ)
      {
        id: 'q6-15m-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid 3 < x \\le 7\\}$. Các phần tử của tập hợp $A$ là:',
        formula: 'A = \\{x \\in \\mathbb{N} \\mid 3 < x \\le 7\\}',
        options: ['A = {4; 5; 6; 7}', 'A = {3; 4; 5; 6; 7}', 'A = {4; 5; 6}', 'A = {3; 4; 5; 6}'],
        correctAnswerIndex: 0,
        explanation: 'Vì $x \\in \\mathbb{N}$, $x > 3$ và $x \\le 7$ nên $x \\in \\{4; 5; 6; 7\\}$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6-15m-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính giá trị của phép tính lũy thừa $2^3 \\cdot 2^2 + 3^4 : 3^2$:',
        formula: '2^3 \\cdot 2^2 + 3^4 : 3^2',
        options: ['41', '32', '35', '45'],
        correctAnswerIndex: 0,
        explanation: '$2^3 \\cdot 2^2 = 2^5 = 32$. $3^4 : 3^2 = 3^2 = 9$. Vậy $32 + 9 = 41$.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6-15m-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Số nào sau đây chia hết cho cả 2, 3 và 5?',
        options: ['120', '135', '140', '112'],
        correctAnswerIndex: 0,
        explanation: 'Số chia hết cho cả 2 và 5 phải tận cùng bằng 0. Số 120 có tận cùng là 0 và tổng các chữ số $1 + 2 + 0 = 3$ chia hết cho 3.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6-15m-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Một hình vuông có cạnh bằng $6\\text{ cm}$. Chu vi và diện tích của hình vuông đó lần lượt là:',
        options: ['24 cm và 36 cm²', '36 cm và 24 cm²', '12 cm và 36 cm²', '24 cm và 12 cm²'],
        correctAnswerIndex: 0,
        explanation: 'Chu vi hình vuông: $C = 4 \\times 6 = 24\\text{ cm}$. Diện tích: $S = 6^2 = 36\\text{ cm}^2$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'geometry'
      },

      // PHẦN II: TỰ LUẬN (2 câu - 6.0 điểm, mỗi câu 3.0đ)
      {
        id: 'q6-15m-5',
        number: 5,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Thực hiện phép tính (tính hợp lý nếu có thể): \n\na) $125 + 70 + 375 + 230$ \n\nb) $25 \\cdot 48 + 25 \\cdot 52 - 500$',
        formula: 'A = 25 \\cdot 48 + 25 \\cdot 52 - 500',
        explanation: 'a) Nhóm số tròn trăm: $(125 + 375) + (70 + 230) = 500 + 300 = 800$.\nb) Đặt thừa số chung 25: $25 \\cdot (48 + 52) - 500 = 25 \\cdot 100 - 500 = 2500 - 500 = 2000$.',
        sampleSolution: 'a) $125 + 70 + 375 + 230 = (125 + 375) + (70 + 230) = 500 + 300 = 800$.\n\nb) $25 \\cdot 48 + 25 \\cdot 52 - 500 = 25 \\cdot (48 + 52) - 500 = 25 \\cdot 100 - 500 = 2500 - 500 = 2000$.',
        rubric: [
          { step: 'Ý a: Nhóm hợp lý các cặp số tròn trăm và tính ra 800', points: 1.5 },
          { step: 'Ý b: Đặt thừa số chung 25 và tính ra kết quả 2000', points: 1.5 }
        ],
        points: 3.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6-15m-6',
        number: 6,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm số tự nhiên $x$, biết: \n\na) $4 \\cdot (x - 5) = 36$ \n\nb) $3^{x+1} - 3^x = 54$',
        formula: '4 \\cdot (x - 5) = 36 \\quad \\text{và} \\quad 3^{x+1} - 3^x = 54',
        explanation: 'a) $x - 5 = 36 : 4 = 9 \\Rightarrow x = 9 + 5 = 14$.\nb) $3^x \\cdot 3 - 3^x = 54 \\Leftrightarrow 3^x \\cdot (3 - 1) = 54 \\Leftrightarrow 3^x \\cdot 2 = 54 \\Leftrightarrow 3^x = 27 = 3^3 \\Rightarrow x = 3$.',
        sampleSolution: 'a) $4 \\cdot (x - 5) = 36$\n$x - 5 = 36 : 4$\n$x - 5 = 9$\n$x = 9 + 5 = 14$.\n\nb) $3^{x+1} - 3^x = 54$\n$3^x \\cdot 3 - 3^x \\cdot 1 = 54$\n$3^x \\cdot (3 - 1) = 54$\n$3^x \\cdot 2 = 54$\n$3^x = 27 = 3^3$\n$\\Rightarrow x = 3$.',
        rubric: [
          { step: 'Ý a: Chuyển vế tính đúng x = 14', points: 1.5 },
          { step: 'Ý b: Đặt nhân tử chung 3^x và suy ra x = 3', points: 1.5 }
        ],
        points: 3.0,
        level: 'van_dung',
        topic: 'arithmetic'
      }
    ]
  },

  // 2. ĐỀ THI GIỮA HỌC KỲ I KHỐI 6 (12 TN + 1 Đ/S 4 ý + 2 TL ngắn + 5 Tự luận)
  {
    id: 'exam-g6-mid1',
    code: 'GK1-K6',
    title: 'Đề Thi Giữa Học Kỳ I - Toán Khối 6 (Chuẩn Ma Trận Mới)',
    grade: 6,
    semester: 'HK1',
    examType: 'midterm',
    durationMinutes: 90,
    totalPoints: 10,
    description: 'Cấu trúc ma trận chuẩn Bộ GD&ĐT: Phần I (12 câu TN - 3,0đ), Phần II (1 câu Đ/S 4 ý - 1,0đ), Phần III (2 câu trả lời ngắn - 1,0đ), Phần IV (5 câu tự luận - 5,0đ).',
    matrix: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
    questions: [
      // PHẦN I: 12 CÂU TRẮC NGHIỆM ABCD (3.0 điểm, 0.25đ/câu)
      {
        id: 'q6m1-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tập hợp các chữ số của số tự nhiên $2026$ là:',
        options: ['{0; 2; 6}', '{2; 0; 2; 6}', '{0; 2}', '{2; 6}'],
        correctAnswerIndex: 0,
        explanation: 'Mỗi phần tử trong tập hợp chỉ được viết một lần: các chữ số gồm $0, 2, 6$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Thứ tự thực hiện phép tính đúng đối với biểu thức không chứa dấu ngoặc là:',
        options: [
          'Lũy thừa → Nhân và chia → Cộng và trừ',
          'Nhân và chia → Lũy thừa → Cộng và trừ',
          'Cộng và trừ → Nhân và chia → Lũy thừa',
          'Lũy thừa → Cộng và trừ → Nhân và chia'
        ],
        correctAnswerIndex: 0,
        explanation: 'Quy tắc: Thứ tự ưu tiên là lũy thừa trước, sau đó nhân và chia, cuối cùng là cộng và trừ.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Số nào sau đây là số nguyên tố?',
        options: ['17', '9', '21', '35'],
        correctAnswerIndex: 0,
        explanation: 'Số nguyên tố là số chỉ có hai ước là 1 và chính nó. 17 chỉ chia hết cho 1 và 17.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Phân tích số 60 ra thừa số nguyên tố được kết quả là:',
        formula: '60 = 2^a \\cdot 3^b \\cdot 5^c',
        options: ['2² · 3 · 5', '2 · 3² · 5', '4 · 15', '2³ · 3 · 5'],
        correctAnswerIndex: 0,
        explanation: '$60 = 4 \\cdot 15 = 2^2 \\cdot 3 \\cdot 5$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-5',
        number: 5,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'ƯCLN(18, 30) có giá trị bằng:',
        options: ['6', '3', '9', '18'],
        correctAnswerIndex: 0,
        explanation: '$18 = 2 \\cdot 3^2$; $30 = 2 \\cdot 3 \\cdot 5$. $\\text{ƯCLN}(18, 30) = 2 \\cdot 3 = 6$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-6',
        number: 6,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'BCNN(12, 18) có giá trị bằng:',
        options: ['36', '72', '24', '18'],
        correctAnswerIndex: 0,
        explanation: '$12 = 2^2 \\cdot 3$; $18 = 2 \\cdot 3^2$. $\\text{BCNN}(12, 18) = 2^2 \\cdot 3^2 = 36$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-7',
        number: 7,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tam giác đều $ABC$ có cạnh $AB = 5\\text{ cm}$. Độ dài cạnh $BC$ và $AC$ bằng:',
        options: ['BC = 5 cm và AC = 5 cm', 'BC = 10 cm và AC = 5 cm', 'BC = 2.5 cm và AC = 5 cm', 'BC = 6 cm và AC = 6 cm'],
        correctAnswerIndex: 0,
        explanation: 'Tam giác đều có ba cạnh bằng nhau, do đó $AB = BC = AC = 5\\text{ cm}$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q6m1-8',
        number: 8,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hình thoi có độ dài hai đường chéo lần lượt là $8\\text{ cm}$ và $6\\text{ cm}$. Diện tích của hình thoi đó là:',
        formula: 'S = \\frac{1}{2} \\cdot d_1 \\cdot d_2',
        options: ['24 cm²', '48 cm²', '14 cm²', '28 cm²'],
        correctAnswerIndex: 0,
        explanation: '$S = \\frac{1}{2} \\cdot 8 \\cdot 6 = 24\\text{ cm}^2$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q6m1-9',
        number: 9,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Số đối của số nguyên $-15$ là:',
        options: ['15', '-15', '0', '1/15'],
        correctAnswerIndex: 0,
        explanation: 'Số đối của $-a$ là $a$, vậy số đối của $-15$ là $15$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-10',
        number: 10,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Kết quả của phép tính $(-12) + (-18)$ bằng:',
        options: ['-30', '30', '-6', '6'],
        correctAnswerIndex: 0,
        explanation: 'Cộng hai số nguyên cùng dấu âm: $(-12) + (-18) = -(12 + 18) = -30$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-11',
        number: 11,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Một mảnh vườn hình chữ nhật có chiều dài $12\\text{ m}$, chiều rộng $8\\text{ m}$. Người ta rào xung quanh vườn và chừa cổng rộng $2\\text{ m}$. Độ dài hàng rào là:',
        options: ['38 m', '40 m', '96 m', '36 m'],
        correctAnswerIndex: 0,
        explanation: 'Chu vi vườn là $(12 + 8) \\times 2 = 40\\text{ m}$. Độ dài rào = $40 - 2 = 38\\text{ m}$.',
        points: 0.25,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q6m1-12',
        number: 12,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Để số $\\overline{1x5}$ chia hết cho 9 thì chữ số $x$ thích hợp là:',
        options: ['3', '4', '2', '9'],
        correctAnswerIndex: 0,
        explanation: 'Tổng chữ số: $1 + x + 5 = 6 + x$ chia hết cho 9 $\\Rightarrow x = 3$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },

      // PHẦN II: 1 CÂU ĐÚNG / SAI CÓ 4 Ý a, b, c, d (1.0 điểm)
      {
        id: 'q6m1-13',
        number: 13,
        section: 'II',
        sectionTitle: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (1 câu - 1,0 điểm)',
        questionType: 'true_false',
        questionText: 'Cho hai số tự nhiên $a = 48$ và $b = 72$. Xét tính Đúng hoặc Sai của mỗi khẳng định sau:',
        subQuestions: [
          {
            id: 'q6m1-13-a',
            label: 'a',
            text: 'Số 48 phân tích ra thừa số nguyên tố là $2^4 \\cdot 3$.',
            formula: '48 = 2^4 \\cdot 3',
            isCorrect: true,
            explanation: '$48 = 16 \\cdot 3 = 2^4 \\cdot 3$. (Đúng)'
          },
          {
            id: 'q6m1-13-b',
            label: 'b',
            text: 'Ước chung lớn nhất của $a$ và $b$ là $\\text{ƯCLN}(48, 72) = 12$.',
            formula: '\\text{ƯCLN}(48, 72) = 12',
            isCorrect: false,
            explanation: '$48 = 2^4 \\cdot 3$; $72 = 2^3 \\cdot 3^2$. $\\text{ƯCLN}(48, 72) = 2^3 \\cdot 3 = 24$, không phải 12. (Sai)'
          },
          {
            id: 'q6m1-13-c',
            label: 'c',
            text: 'Bội chung nhỏ nhất của $a$ và $b$ là $\\text{BCNN}(48, 72) = 144$.',
            formula: '\\text{BCNN}(48, 72) = 144',
            isCorrect: true,
            explanation: '$\\text{BCNN}(48, 72) = 2^4 \\cdot 3^2 = 16 \\cdot 9 = 144$. (Đúng)'
          },
          {
            id: 'q6m1-13-d',
            label: 'd',
            text: 'Tổng $a + b$ là một số chia hết cho cả 2, 3, 5 và 9.',
            formula: '48 + 72 = 120',
            isCorrect: false,
            explanation: '$48 + 72 = 120$. 120 có tổng chữ số là 3, không chia hết cho 9. (Sai)'
          }
        ],
        explanation: 'Đáp án: a - Đúng, b - Sai, c - Đúng, d - Sai. Thang điểm: đúng 1 ý 0,1đ; đúng 2 ý 0,25đ; đúng 3 ý 0,5đ; đúng 4 ý 1,0đ.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },

      // PHẦN III: 2 CÂU TRẢ LỜI NGẮN (1.0 điểm, 0.5đ/câu)
      {
        id: 'q6m1-14',
        number: 14,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Tính giá trị của biểu thức: $A = 2026 - [150 + (10 - 2^2) \\cdot 5]$. Điền kết quả số vào ô đáp án.',
        formula: 'A = 2026 - [150 + (10 - 2^2) \\cdot 5]',
        correctShortAnswer: '1846',
        acceptedAnswers: ['1846'],
        explanation: '$10 - 4 = 6 \\Rightarrow 6 \\cdot 5 = 30$. Ngoặc vuông $= 150 + 30 = 180$. Vậy $A = 2026 - 180 = 1846$.',
        points: 0.5,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-15',
        number: 15,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Học sinh khối 6 của một trường khi xếp hàng 10, hàng 12, hàng 15 đều vừa đủ hàng. Biết số học sinh trong khoảng từ 200 đến 250 em. Tìm số học sinh khối 6 đó.',
        formula: 'x \\in \\text{BC}(10, 12, 15) \\quad (200 \\le x \\le 250)',
        correctShortAnswer: '240',
        acceptedAnswers: ['240', '240 em', '240 học sinh'],
        explanation: '$\\text{BCNN}(10, 12, 15) = 60$. Bội chung của 60 trong khoảng $(200; 250)$ là $60 \\times 4 = 240$.',
        points: 0.5,
        level: 'van_dung',
        topic: 'arithmetic'
      },

      // PHẦN IV: 5 CÂU TỰ LUẬN (5.0 điểm, 1.0đ/câu)
      {
        id: 'q6m1-16',
        number: 16,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Thực hiện phép tính hợp lý: \n\na) $37 \\cdot 64 + 37 \\cdot 36 - 1700$ \n\nb) $2^3 \\cdot 15 - [115 - (12 - 7)^2]$',
        formula: '37 \\cdot 64 + 37 \\cdot 36 - 1700',
        explanation: 'a) $37 \\cdot (64 + 36) - 1700 = 37 \\cdot 100 - 1700 = 3700 - 1700 = 2000$.\nb) $8 \\cdot 15 - [115 - 5^2] = 120 - [115 - 25] = 120 - 90 = 30$.',
        sampleSolution: 'a) $37 \\cdot 64 + 37 \\cdot 36 - 1700 = 37 \\cdot (64 + 36) - 1700 = 37 \\cdot 100 - 1700 = 3700 - 1700 = 2000$.\n\nb) $2^3 \\cdot 15 - [115 - (12 - 7)^2] = 8 \\cdot 15 - [115 - 5^2] = 120 - [115 - 25] = 120 - 90 = 30$.',
        rubric: [
          { step: 'Ý a: Đặt nhân tử chung tính ra 2000', points: 0.5 },
          { step: 'Ý b: Thực hiện theo thứ tự ngoặc tròn, vuông tính ra 30', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-17',
        number: 17,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm số tự nhiên $x$, biết: \n\na) $2 \\cdot (x + 15) = 64$ \n\nb) $5^{x-1} + 5^{x} = 150$',
        formula: '2 \\cdot (x + 15) = 64 \\quad \\text{và} \\quad 5^{x-1} + 5^x = 150',
        explanation: 'a) $x + 15 = 64 : 2 = 32 \\Rightarrow x = 32 - 15 = 17$.\nb) $5^{x-1} \\cdot (1 + 5) = 150 \\Leftrightarrow 5^{x-1} \\cdot 6 = 150 \\Leftrightarrow 5^{x-1} = 25 = 5^2 \\Rightarrow x - 1 = 2 \\Rightarrow x = 3$.',
        sampleSolution: 'a) $2 \\cdot (x + 15) = 64$\n$x + 15 = 32$\n$x = 32 - 15 = 17$.\n\nb) $5^{x-1} + 5^x = 150$\n$5^{x-1} \\cdot (1 + 5) = 150$\n$5^{x-1} \\cdot 6 = 150$\n$5^{x-1} = 25 = 5^2$\n$x - 1 = 2 \\Rightarrow x = 3$.',
        rubric: [
          { step: 'Ý a: Chuyển vế tính đúng x = 17', points: 0.5 },
          { step: 'Ý b: Đặt nhân tử chung lũy thừa tính đúng x = 3', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-18',
        number: 18,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Bác An có một khu đất hình chữ nhật dài $20\\text{ m}$, rộng $15\\text{ m}$. Bác làm một lối đi xung quanh rộng $1\\text{ m}$, phần đất còn lại dùng để trồng hoa. Tính diện tích phần đất trồng hoa của Bác An.',
        formula: 'S = a \\cdot b',
        explanation: 'Phần đất trồng hoa là hình chữ nhật có:\n- Chiều dài: $20 - 2 \\times 1 = 18\\text{ m}$.\n- Chiều rộng: $15 - 2 \\times 1 = 13\\text{ m}$.\n- Diện tích trồng hoa: $18 \\times 13 = 234\\text{ m}^2$.',
        sampleSolution: 'Chiều dài phần đất trồng hoa là:\n$20 - 1 - 1 = 18\\text{ (m)}$\n\nChiều rộng phần đất trồng hoa là:\n$15 - 1 - 1 = 13\\text{ (m)}$\n\nDiện tích đất trồng hoa là:\n$S = 18 \\times 13 = 234\\text{ (m}^2\\text{)}$.\n\nĐáp số: $234\\text{ m}^2$.',
        rubric: [
          { step: 'Tính đúng chiều dài và chiều rộng mới của vườn hoa', points: 0.5 },
          { step: 'Tính đúng diện tích 234 m² và ghi đáp số', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q6m1-19',
        number: 19,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cô Diễm Quỳnh muốn chia 48 chiếc bút bi và 72 quyển vở thành các phần thưởng như nhau để trao cho học sinh đạt thành tích tốt. Hỏi Cô có thể chia được nhiều nhất bao nhiêu phần thưởng? Khi đó mỗi phần thưởng có bao nhiêu chiếc bút bi và bao nhiêu quyển vở?',
        formula: 'n = \\text{ƯCLN}(48, 72)',
        explanation: 'Số phần thưởng nhiều nhất là $\\text{ƯCLN}(48, 72) = 24$ phần.\nMỗi phần có: $48 : 24 = 2$ bút bi và $72 : 24 = 3$ quyển vở.',
        sampleSolution: 'Gọi số phần thưởng nhiều nhất có thể chia là $a$ ($a \\in \\mathbb{N}^*$).\nVì 48 bút và 72 vở chia đều vào $a$ phần thưởng nên $a = \\text{ƯCLN}(48, 72)$.\nTa có:\n$48 = 2^4 \\cdot 3$\n$72 = 2^3 \\cdot 3^2$\n$\\Rightarrow a = \\text{ƯCLN}(48, 72) = 2^3 \\cdot 3 = 24$.\n\nVậy Cô Diễm Quỳnh có thể chia được nhiều nhất 24 phần thưởng.\nKhi đó mỗi phần có:\n$48 : 24 = 2$ (chiếc bút bi)\n$72 : 24 = 3$ (quyển vở).',
        rubric: [
          { step: 'Lập luận đưa về tìm ƯCLN(48, 72) và tính ra 24 phần thưởng', points: 0.5 },
          { step: 'Tính đúng số bút bi (2) và số vở (3) trong mỗi phần', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'arithmetic'
      },
      {
        id: 'q6m1-20',
        number: 20,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho biểu thức: $S = 1 + 2 + 2^2 + 2^3 + ... + 2^{2025}$. \n\na) Chứng minh rằng $S + 1$ là một lũy thừa của 2. \n\nb) Chứng minh rằng $S$ chia hết cho 3.',
        formula: 'S = 1 + 2 + 2^2 + ... + 2^{2025}',
        explanation: 'a) $2S = 2 + 2^2 + ... + 2^{2026} \\Rightarrow 2S - S = S = 2^{2026} - 1 \\Rightarrow S + 1 = 2^{2026}$ (đpcm).\nb) Nhóm 2 số hạng liên tiếp: $S = (1 + 2) + 2^2(1 + 2) + ... + 2^{2024}(1 + 2) = 3 \\cdot (1 + 2^2 + ... + 2^{2024}) \\ \\vdots \\ 3$.',
        sampleSolution: 'a) Ta có:\n$2S = 2 + 2^2 + 2^3 + ... + 2^{2026}$\n$2S - S = (2 + 2^2 + ... + 2^{2026}) - (1 + 2 + ... + 2^{2025})$\n$S = 2^{2026} - 1$\n$\\Rightarrow S + 1 = 2^{2026}$ là một lũy thừa của 2 (đpcm).\n\nb) Biểu thức $S$ có $2026$ số hạng, ghép đôi 2 số hạng liền nhau:\n$S = (1 + 2) + (2^2 + 2^3) + ... + (2^{2024} + 2^{2025})$\n$S = 3 + 2^2(1 + 2) + ... + 2^{2024}(1 + 2)$\n$S = 3 \\cdot (1 + 2^2 + ... + 2^{2024})$\nVì $3 \\ \\vdots \\ 3$ nên $S$ chia hết cho 3 (đpcm).',
        rubric: [
          { step: 'Ý a: Nhân 2S và trừ từng vế tính ra S + 1 = 2^2026', points: 0.5 },
          { step: 'Ý b: Ghép cặp 2 số hạng và rút ra thừa số 3 chứng minh chia hết', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung_cao',
        topic: 'arithmetic'
      }
    ]
  },

  // 3. ĐỀ THI CUỐI HỌC KỲ I KHỐI 6
  {
    id: 'exam-g6-fin1',
    code: 'CK1-K6',
    title: 'Đề Thi Cuối Học Kỳ I - Toán Khối 6 (Đề Chính Thức)',
    grade: 6,
    semester: 'HK1',
    examType: 'final',
    durationMinutes: 90,
    totalPoints: 10,
    description: 'Đề kiểm tra cuối kỳ I: Số nguyên, phép tính số nguyên, hình học trực quan, chu vi diện tích và thống kê mô tả.',
    matrix: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
    questions: [
      // 12 câu trắc nghiệm ABCD (3.0đ)
      {
        id: 'q6f1-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tập hợp các số nguyên $\\mathbb{Z}$ bao gồm:',
        options: ['Số nguyên âm, số 0 và số nguyên dương', 'Số tự nhiên và phân số', 'Số nguyên âm và số nguyên dương', 'Số 0 và số nguyên dương'],
        correctAnswerIndex: 0,
        explanation: '$\\mathbb{Z}$ gồm các số nguyên âm, số 0 và các số nguyên dương.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Nhiệt độ lúc 6h sáng ở Sa Pa là $-2^\\circ\\text{C}$, đến trưa tăng thêm $5^\\circ\\text{C}$. Nhiệt độ buổi trưa là:',
        options: ['3°C', '-7°C', '7°C', '-3°C'],
        correctAnswerIndex: 0,
        explanation: '$-2 + 5 = 3^\\circ\\text{C}$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính $(-8) \\cdot (-5)$:',
        options: ['40', '-40', '13', '-13'],
        correctAnswerIndex: 0,
        explanation: 'Tích hai số nguyên cùng dấu âm là một số nguyên dương: $(-8) \\cdot (-5) = 40$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hình lục giác đều có bao nhiêu trục đối xứng?',
        options: ['6 trục đối xứng', '3 trục đối xứng', '12 trục đối xứng', 'Vô số'],
        correctAnswerIndex: 0,
        explanation: 'Hình lục giác đều có đúng 6 trục đối xứng.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q6f1-5',
        number: 5,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Diện tích hình bình hành có độ dài đáy $10\\text{ cm}$ và chiều cao tương ứng $6\\text{ cm}$ là:',
        formula: 'S = a \\cdot h',
        options: ['60 cm²', '30 cm²', '16 cm²', '32 cm²'],
        correctAnswerIndex: 0,
        explanation: '$S = 10 \\times 6 = 60\\text{ cm}^2$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q6f1-6',
        number: 6,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Trong các số: $-15; 0; -3; 7; 12$, số nguyên nhỏ nhất là:',
        options: ['-15', '0', '-3', '12'],
        correctAnswerIndex: 0,
        explanation: '$-15 < -3 < 0 < 7 < 12$. Vậy $-15$ là số nhỏ nhất.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-7',
        number: 7,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính hợp lý: $25 \\cdot (-13) \\cdot 4$:',
        options: ['-1300', '1300', '-325', '-1000'],
        correctAnswerIndex: 0,
        explanation: '$(25 \\cdot 4) \\cdot (-13) = 100 \\cdot (-13) = -1300$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-8',
        number: 8,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tập hợp các ước nguyên của số $6$ là:',
        options: ['{-6; -3; -2; -1; 1; 2; 3; 6}', '{1; 2; 3; 6}', '{-3; -2; -1; 0; 1; 2; 3}', '{-6; -1; 1; 6}'],
        correctAnswerIndex: 0,
        explanation: 'Các ước nguyên của 6 gồm cả ước âm và dương: $\\{\\pm 1; \\pm 2; \\pm 3; \\pm 6\\}$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-9',
        number: 9,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hình thang cân $ABCD$ có hai đáy $AB = 4\\text{ cm}, CD = 10\\text{ cm}$, chiều cao $h = 5\\text{ cm}$. Diện tích là:',
        formula: 'S = \\frac{(a + b) \\cdot h}{2}',
        options: ['35 cm²', '70 cm²', '40 cm²', '20 cm²'],
        correctAnswerIndex: 0,
        explanation: '$S = \\frac{(4 + 10) \\times 5}{2} = \\frac{70}{2} = 35\\text{ cm}^2$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q6f1-10',
        number: 10,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Điều tra số cây trồng được của 4 tổ trong lớp 6A thu được bảng số liệu: Tổ 1: 15 cây, Tổ 2: 18 cây, Tổ 3: 12 cây, Tổ 4: 20 cây. Tổng số cây cả 4 tổ trồng được là:',
        options: ['65 cây', '60 cây', '55 cây', '70 cây'],
        correctAnswerIndex: 0,
        explanation: '$15 + 18 + 12 + 20 = 65$ cây.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'statistics'
      },
      {
        id: 'q6f1-11',
        number: 11,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tìm $x \\in \\mathbb{Z}$ biết $x - (-5) = 2$:',
        options: ['x = -3', 'x = 7', 'x = 3', 'x = -7'],
        correctAnswerIndex: 0,
        explanation: '$x + 5 = 2 \\Rightarrow x = 2 - 5 = -3$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-12',
        number: 12,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Chữ cái in hoa nào sau đây có tâm đối xứng?',
        options: ['H', 'A', 'M', 'V'],
        correctAnswerIndex: 0,
        explanation: 'Chữ H có tâm đối xứng nằm tại giao điểm hai trục đối xứng.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },

      // PHẦN II: 1 CÂU ĐÚNG / SAI CÓ 4 Ý a, b, c, d (1.0 điểm)
      {
        id: 'q6f1-13',
        number: 13,
        section: 'II',
        sectionTitle: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (1 câu - 1,0 điểm)',
        questionType: 'true_false',
        questionText: 'Xét các phép toán và tính chất của số nguyên. Mỗi khẳng định sau Đúng hay Sai?',
        subQuestions: [
          {
            id: 'q6f1-13-a',
            label: 'a',
            text: 'Tích của hai số nguyên âm luôn luôn là một số nguyên âm.',
            isCorrect: false,
            explanation: 'Sai: Tích hai số nguyên âm luôn là một số nguyên dương, ví dụ $(-2) \\cdot (-3) = 6$.'
          },
          {
            id: 'q6f1-13-b',
            label: 'b',
            text: 'Tổng của hai số nguyên đối nhau luôn bằng 0: $a + (-a) = 0$.',
            formula: 'a + (-a) = 0',
            isCorrect: true,
            explanation: 'Đúng theo tính chất số đối trong tập hợp số nguyên.'
          },
          {
            id: 'q6f1-13-c',
            label: 'c',
            text: 'Giá trị của biểu thức $(-4)^2 = -16$.',
            formula: '(-4)^2 = -16',
            isCorrect: false,
            explanation: 'Sai: Lũy thừa bậc chẵn $(-4)^2 = (-4) \\cdot (-4) = +16$.'
          },
          {
            id: 'q6f1-13-d',
            label: 'd',
            text: 'Nếu $a \\ \\vdots \\ b$ và $b \\ \\vdots \\ c$ thì $a \\ \\vdots \\ c$ (với $a, b, c \\in \\mathbb{Z}, b, c \\ne 0$).',
            isCorrect: true,
            explanation: 'Đúng theo tính chất bắc cầu của quan hệ chia hết trong $\\mathbb{Z}$.'
          }
        ],
        explanation: 'a - Sai, b - Đúng, c - Sai, d - Đúng. Thang điểm: đúng 1 ý 0,1đ; đúng 2 ý 0,25đ; đúng 3 ý 0,5đ; đúng 4 ý 1,0đ.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },

      // PHẦN III: 2 CÂU TRẢ LỜI NGẮN (1.0 điểm, 0.5đ/câu)
      {
        id: 'q6f1-14',
        number: 14,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Tính tổng tất cả các số nguyên $x$ thỏa mãn: $-4 \\le x < 6$. Điền kết quả số vào ô đáp án.',
        formula: '-4 \\le x < 6 \\quad (x \\in \\mathbb{Z})',
        correctShortAnswer: '5',
        acceptedAnswers: ['5'],
        explanation: 'Các số nguyên thỏa mãn: $-4, -3, -2, -1, 0, 1, 2, 3, 4, 5$. Tổng = $[(-4)+4] + [(-3)+3] + [(-2)+2] + [(-1)+1] + 0 + 5 = 5$.',
        points: 0.5,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-15',
        number: 15,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Một chiếc tàu ngầm đang ở độ sâu $35\\text{ m}$ dưới mực nước biển (được ghi là $-35\\text{ m}$). Tàu lặn sâu thêm $15\\text{ m}$ nữa rồi lại nổi lên $20\\text{ m}$. Hỏi độ cao hiện tại của tàu ngầm so với mực nước biển là bao nhiêu mét? (Điền số nguyên âm hoặc dương)',
        formula: '-35 - 15 + 20',
        correctShortAnswer: '-30',
        acceptedAnswers: ['-30', '-30m', '-30 mét'],
        explanation: 'Độ cao tàu ngầm: $-35 - 15 + 20 = -50 + 20 = -30\\text{ m}$.',
        points: 0.5,
        level: 'van_dung',
        topic: 'arithmetic'
      },

      // PHẦN IV: 5 CÂU TỰ LUẬN (5.0 điểm, 1.0đ/câu)
      {
        id: 'q6f1-16',
        number: 16,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Thực hiện phép tính hợp lý: \n\na) $48 \\cdot (-23) + 48 \\cdot (-77)$ \n\nb) $(-15) + (-24) + 15 + (-76)$',
        formula: '48 \\cdot (-23) + 48 \\cdot (-77)',
        explanation: 'a) $48 \\cdot [(-23) + (-77)] = 48 \\cdot (-100) = -4800$.\nb) $[(-15) + 15] + [(-24) + (-76)] = 0 + (-100) = -100$.',
        sampleSolution: 'a) $48 \\cdot (-23) + 48 \\cdot (-77) = 48 \\cdot [(-23) + (-77)] = 48 \\cdot (-100) = -4800$.\n\nb) $(-15) + (-24) + 15 + (-76) = [(-15) + 15] + [(-24) + (-76)] = 0 + (-100) = -100$.',
        rubric: [
          { step: 'Ý a: Đặt nhân tử chung 48 tính ra -4800', points: 0.5 },
          { step: 'Ý b: Ghép cặp số đối và số tròn trăm tính ra -100', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-17',
        number: 17,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm số nguyên $x$, biết: \n\na) $3x - 12 = -27$ \n\nb) $2 \\cdot (x - 3)^2 = 32$',
        formula: '3x - 12 = -27 \\quad \\text{và} \\quad 2 \\cdot (x - 3)^2 = 32',
        explanation: 'a) $3x = -27 + 12 = -15 \\Rightarrow x = -15 : 3 = -5$.\nb) $(x - 3)^2 = 32 : 2 = 16 = (\\pm 4)^2 \\Rightarrow x - 3 = 4 \\Rightarrow x = 7$ hoặc $x - 3 = -4 \\Rightarrow x = -1$.',
        sampleSolution: 'a) $3x - 12 = -27$\n$3x = -27 + 12$\n$3x = -15$\n$x = -15 : 3 = -5$.\n\nb) $2 \\cdot (x - 3)^2 = 32$\n$(x - 3)^2 = 16$\nTrường hợp 1: $x - 3 = 4 \\Rightarrow x = 7$.\nTrường hợp 2: $x - 3 = -4 \\Rightarrow x = -1$.\nVậy $x \\in \\{7; -1\\}$.',
        rubric: [
          { step: 'Ý a: Tìm đúng x = -5', points: 0.5 },
          { step: 'Ý b: Xét 2 trường hợp và tìm ra x = 7 và x = -1', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'arithmetic'
      },
      {
        id: 'q6f1-18',
        number: 18,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Một căn phòng hình chữ nhật có chiều dài $8\\text{ m}$, chiều rộng $6\\text{ m}$. Bác Ba muốn lát nền phòng bằng loại gạch men hình vuông có cạnh $40\\text{ cm}$. \n\na) Tính diện tích nền căn phòng đó. \n\nb) Hỏi Bác Ba cần mua bao nhiêu viên gạch để vừa đủ lát kín nền căn phòng (coi mạch vữa không đáng kể)?',
        formula: 'S = a \\cdot b',
        explanation: 'a) $S_{\\text{phòng}} = 8 \\times 6 = 48\\text{ m}^2 = 480\\ 000\\text{ cm}^2$.\nb) $S_{\\text{gạch}} = 40 \\times 40 = 1600\\text{ cm}^2$.\nSố viên gạch = $480\\ 000 : 1600 = 300$ viên.',
        sampleSolution: 'a) Diện tích nền căn phòng là:\n$S = 8 \\times 6 = 48\\text{ (m}^2\\text{)} = 480\\ 000\\text{ (cm}^2\\text{)}$.\n\nb) Diện tích một viên gạch men là:\n$S_{\\text{gạch}} = 40 \\times 40 = 1600\\text{ (cm}^2\\text{)}$.\n\nSố viên gạch Bác Ba cần mua là:\n$480\\ 000 : 1600 = 300\\text{ (viên gạch)}$.\n\nĐáp số: a) $48\\text{ m}^2$; b) 300 viên gạch.',
        rubric: [
          { step: 'Ý a: Tính đúng diện tích phòng = 48 m² và đổi ra cm²', points: 0.5 },
          { step: 'Ý b: Tính diện tích viên gạch và chia ra 300 viên', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q6f1-19',
        number: 19,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Biểu đồ tranh sau đây ghi lại số điểm 10 môn Toán của 4 tổ trong tháng thi đua: \n- Tổ 1: 🌟 🌟 🌟 🌟 \n- Tổ 2: 🌟 🌟 🌟 \n- Tổ 3: 🌟 🌟 🌟 🌟 🌟 \n- Tổ 4: 🌟 🌟 \n(Biết mỗi 🌟 tương ứng với 4 điểm 10). \n\na) Lập bảng thống kê số điểm 10 của mỗi tổ. \n\nb) Tổ nào đạt nhiều điểm 10 nhất? Cả lớp đạt tất cả bao nhiêu điểm 10?',
        explanation: 'a) Tổ 1: 16 điểm 10; Tổ 2: 12 điểm 10; Tổ 3: 20 điểm 10; Tổ 4: 8 điểm 10.\nb) Tổ 3 đạt nhiều điểm 10 nhất (20 điểm). Tổng điểm 10 của lớp = $16 + 12 + 20 + 8 = 56$ điểm 10.',
        sampleSolution: 'a) Bảng thống kê số điểm 10:\n- Tổ 1: $4 \\times 4 = 16$ (điểm 10)\n- Tổ 2: $3 \\times 4 = 12$ (điểm 10)\n- Tổ 3: $5 \\times 4 = 20$ (điểm 10)\n- Tổ 4: $2 \\times 4 = 8$ (điểm 10)\n\nb) Tổ đạt nhiều điểm 10 nhất là Tổ 3 (20 điểm 10).\nTổng số điểm 10 cả lớp đạt được là:\n$16 + 12 + 20 + 8 = 56\\text{ (điểm 10)}$.',
        rubric: [
          { step: 'Lập đúng bảng số liệu của từng tổ', points: 0.5 },
          { step: 'Chỉ ra Tổ 3 nhiều nhất và tính đúng tổng 56 điểm 10', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'statistics'
      },
      {
        id: 'q6f1-20',
        number: 20,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm tất cả các số nguyên $n$ để biểu thức phân số $A = \\frac{2n + 5}{n + 1}$ nhận giá trị là một số nguyên.',
        formula: 'A = \\frac{2n + 5}{n + 1} \\in \\mathbb{Z}',
        explanation: '$A = \\frac{2(n + 1) + 3}{n + 1} = 2 + \\frac{3}{n + 1}$. Để $A \\in \\mathbb{Z}$ thì $n + 1 \\in \\text{Ư}(3) = \\{\\pm 1; \\pm 3\\}$. Suy ra $n \\in \\{0; -2; 2; -4\\}$.',
        sampleSolution: 'Ta có:\n$A = \\frac{2n + 5}{n + 1} = \\frac{2(n + 1) + 3}{n + 1} = 2 + \\frac{3}{n + 1}$\n\nĐể $A$ nhận giá trị nguyên thì $\\frac{3}{n + 1}$ phải là số nguyên, tức là $n + 1 \\in \\text{Ư}(3)$.\nTa có $\\text{Ư}(3) = \\{-3; -1; 1; 3\\}$.\n\nTa lập bảng:\n| $n + 1$ | -3 | -1 | 1 | 3 |\n|---|---|---|---|---|\n| $n$ | -4 | -2 | 0 | 2 |\n\nVậy các số nguyên $n$ thỏa mãn là $n \\in \\{-4; -2; 0; 2\\}$.',
        rubric: [
          { step: 'Tách biểu thức thành 2 + 3/(n+1) và suy ra n+1 là ước của 3', points: 0.5 },
          { step: 'Lập bảng tìm đúng tập hợp n = {-4; -2; 0; 2}', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung_cao',
        topic: 'arithmetic'
      }
    ]
  },

  // =========================================================================
  // ========================== KHỐI 7 =======================================
  // =========================================================================

  // 1. ĐỀ KIỂM TRA 15 PHÚT KHỐI 7 (4 TN 4 điểm + 2 Tự luận 6 điểm)
  {
    id: 'exam-g7-15m',
    code: 'KT15-K7',
    title: 'Đề Kiểm Tra 15 Phút - Số Hữu Tỉ & Góc Đối Đỉnh Khối 7',
    grade: 7,
    semester: 'HK1',
    examType: 'quiz_15m',
    durationMinutes: 15,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: 4 câu trắc nghiệm (4,0 điểm) và 2 câu tự luận (6,0 điểm). Thời gian 15 phút.',
    matrix: { nhanBiet: 50, thongHieu: 30, vanDung: 20, vanDungCao: 0 },
    questions: [
      {
        id: 'q7-15m-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính giá trị của phép cộng số hữu tỉ $\\frac{2}{5} + \\left(-\\frac{1}{3}\\right)$:',
        formula: '\\frac{2}{5} + \\left(-\\frac{1}{3}\\right)',
        options: ['1/15', '3/8', '-1/15', '1/2'],
        correctAnswerIndex: 0,
        explanation: '$\\frac{6}{15} - \\frac{5}{15} = \\frac{1}{15}$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7-15m-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Kết quả của lũy thừa $\\left(-\\frac{1}{2}\\right)^3$ bằng:',
        formula: '\\left(-\\frac{1}{2}\\right)^3',
        options: ['-1/8', '1/8', '-1/6', '1/6'],
        correctAnswerIndex: 0,
        explanation: 'Lũy thừa bậc lẻ của số âm là số âm: $(-1)^3 / 2^3 = -1/8$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7-15m-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hai góc kề bù có tổng số đo bằng:',
        options: ['180°', '90°', '360°', '45°'],
        correctAnswerIndex: 0,
        explanation: 'Theo định nghĩa, hai góc kề bù có tổng số đo bằng $180^\\circ$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q7-15m-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Giá trị tuyệt đối của $-\\frac{3}{7}$ là:',
        options: ['3/7', '-3/7', '7/3', '0'],
        correctAnswerIndex: 0,
        explanation: '$|-\\frac{3}{7}| = \\frac{3}{7}$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'rational'
      },
      // Tự luận (2 câu - 6.0đ)
      {
        id: 'q7-15m-5',
        number: 5,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Tính giá trị biểu thức bằng cách hợp lý: \n\n$A = \\frac{7}{19} \\cdot \\frac{8}{11} + \\frac{7}{19} \\cdot \\frac{3}{11} - \\frac{7}{19}$',
        formula: 'A = \\frac{7}{19} \\cdot \\left(\\frac{8}{11} + \\frac{3}{11} - 1\\right)',
        explanation: '$A = \\frac{7}{19} \\cdot \\left(\\frac{8}{11} + \\frac{3}{11} - 1\\right) = \\frac{7}{19} \\cdot (1 - 1) = \\frac{7}{19} \\cdot 0 = 0$.',
        sampleSolution: '$A = \\frac{7}{19} \\cdot \\frac{8}{11} + \\frac{7}{19} \\cdot \\frac{3}{11} - \\frac{7}{19} \\cdot 1$\n$A = \\frac{7}{19} \\cdot \\left(\\frac{8}{11} + \\frac{3}{11} - 1\\right)$\n$A = \\frac{7}{19} \\cdot \\left(\\frac{11}{11} - 1\\right)$\n$A = \\frac{7}{19} \\cdot (1 - 1) = \\frac{7}{19} \\cdot 0 = 0$.',
        rubric: [
          { step: 'Đặt thừa số chung 7/19 ra ngoài', points: 1.5 },
          { step: 'Tính trong ngoặc bằng 0 và kết luận A = 0', points: 1.5 }
        ],
        points: 3.0,
        level: 'thong_hieu',
        topic: 'rational'
      },
      {
        id: 'q7-15m-6',
        number: 6,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm $x$ biết: \n\na) $x - \\frac{2}{3} = \\frac{5}{6}$ \n\nb) $\\left|x - \\frac{1}{2}\\right| = \\frac{3}{4}$',
        formula: 'x - \\frac{2}{3} = \\frac{5}{6} \\quad \\text{và} \\quad \\left|x - \\frac{1}{2}\\right| = \\frac{3}{4}',
        explanation: 'a) $x = \\frac{5}{6} + \\frac{4}{6} = \\frac{9}{6} = \\frac{3}{2}$.\nb) TH1: $x - 1/2 = 3/4 \\Rightarrow x = 5/4$. TH2: $x - 1/2 = -3/4 \\Rightarrow x = -1/4$.',
        sampleSolution: 'a) $x - \\frac{2}{3} = \\frac{5}{6}$\n$x = \\frac{5}{6} + \\frac{2}{3} = \\frac{5}{6} + \\frac{4}{6} = \\frac{9}{6} = \\frac{3}{2}$.\n\nb) $\\left|x - \\frac{1}{2}\\right| = \\frac{3}{4}$\nTrường hợp 1: $x - \\frac{1}{2} = \\frac{3}{4} \\Rightarrow x = \\frac{3}{4} + \\frac{2}{4} = \\frac{5}{4}$.\nTrường hợp 2: $x - \\frac{1}{2} = -\\frac{3}{4} \\Rightarrow x = -\\frac{3}{4} + \\frac{2}{4} = -\\frac{1}{4}$.\nVậy $x \\in \\left\\{\\frac{5}{4}; -\\frac{1}{4}\\right\\}$.',
        rubric: [
          { step: 'Ý a: Tìm đúng x = 3/2', points: 1.5 },
          { step: 'Ý b: Xét 2 trường hợp tìm đúng x = 5/4 và x = -1/4', points: 1.5 }
        ],
        points: 3.0,
        level: 'van_dung',
        topic: 'rational'
      }
    ]
  },

  // 2. ĐỀ THI GIỮA HỌC KỲ I KHỐI 7 (12 TN + 1 Đ/S 4 ý + 2 TL ngắn + 5 Tự luận)
  {
    id: 'exam-g7-mid1',
    code: 'GK1-K7',
    title: 'Đề Thi Giữa Học Kỳ I - Toán Khối 7 (Chuẩn Ma Trận Mới)',
    grade: 7,
    semester: 'HK1',
    examType: 'midterm',
    durationMinutes: 90,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: Phần I (12 câu TN - 3,0đ), Phần II (1 câu Đ/S 4 ý - 1,0đ), Phần III (2 câu trả lời ngắn - 1,0đ), Phần IV (5 câu tự luận - 5,0đ).',
    matrix: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
    questions: [
      // 12 câu trắc nghiệm (3.0đ)
      {
        id: 'q7m1-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Khẳng định nào sau đây là ĐÚNG?',
        options: ['-5 ∈ ℚ', '2/3 ∉ ℚ', '-0.75 ∉ ℚ', '0 ∉ ℚ'],
        correctAnswerIndex: 0,
        explanation: 'Số nguyên $-5 = -5/1$ là số hữu tỉ nên $-5 \\in \\mathbb{Q}$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Số đối của số hữu tỉ $-\\frac{4}{9}$ là:',
        options: ['4/9', '-4/9', '-9/4', '9/4'],
        correctAnswerIndex: 0,
        explanation: 'Số đối của $-a/b$ là $a/b$, do đó số đối của $-4/9$ là $4/9$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Kết quả của phép tính $\\left(-\\frac{2}{3}\\right)^2$ bằng:',
        options: ['4/9', '-4/9', '4/6', '-4/6'],
        correctAnswerIndex: 0,
        explanation: '$(-2)^2 / 3^2 = 4/9$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Cho hai góc đối đỉnh $\\widehat{xOy}$ và $\\widehat{x\'Oy\'}$. Biết $\\widehat{xOy} = 70^\\circ$, số đo góc $\\widehat{x\'Oy\'}$ là:',
        options: ['70°', '110°', '20°', '180°'],
        correctAnswerIndex: 0,
        explanation: 'Hai góc đối đỉnh thì bằng nhau: $\\widehat{x\'Oy\'} = \\widehat{xOy} = 70^\\circ$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q7m1-5',
        number: 5,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tia $Ot$ là tia phân giác của góc $\\widehat{xOy} = 80^\\circ$. Số đo góc $\\widehat{xOt}$ là:',
        options: ['40°', '80°', '160°', '20°'],
        correctAnswerIndex: 0,
        explanation: 'Tia phân giác chia góc thành hai phần bằng nhau: $80^\\circ : 2 = 40^\\circ$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q7m1-6',
        number: 6,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Giá trị của biểu thức $2^3 \\cdot 2^4$ dưới dạng một lũy thừa là:',
        options: ['2⁷', '2¹²', '4⁷', '2¹'],
        correctAnswerIndex: 0,
        explanation: '$2^{3 + 4} = 2^7$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-7',
        number: 7,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Một hình lăng trụ đứng tam giác có chiều cao $10\\text{ cm}$, đáy là tam giác vuông có hai cạnh góc vuông $3\\text{ cm}$ và $4\\text{ cm}$. Thể tích của hình lăng trụ đó là:',
        formula: 'V = S_{\\text{đáy}} \\cdot h',
        options: ['60 cm³', '120 cm³', '70 cm³', '30 cm³'],
        correctAnswerIndex: 0,
        explanation: '$S_{\\text{đáy}} = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6\\text{ cm}^2$. Thể tích $V = 6 \\times 10 = 60\\text{ cm}^3$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q7m1-8',
        number: 8,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tìm $x$ biết $x : \\left(-\\frac{1}{2}\\right) = \\frac{4}{3}$:',
        options: ['x = -2/3', 'x = 2/3', 'x = -8/3', 'x = 8/3'],
        correctAnswerIndex: 0,
        explanation: '$x = \\frac{4}{3} \\cdot \\left(-\\frac{1}{2}\\right) = -\\frac{2}{3}$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'rational'
      },
      {
        id: 'q7m1-9',
        number: 9,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Nếu đường thẳng $c$ cắt hai đường thẳng song song $a$ và $b$ thì hai góc so le trong:',
        options: ['Bằng nhau', 'Bù nhau', 'Phụ nhau', 'Kề nhau'],
        correctAnswerIndex: 0,
        explanation: 'Tính chất hai đường thẳng song song: Hai góc so le trong bằng nhau.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q7m1-10',
        number: 10,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Căn bậc hai số học của $49$ là:',
        options: ['7', '-7', '±7', '2401'],
        correctAnswerIndex: 0,
        explanation: 'Căn bậc hai số học luôn không âm: $\\sqrt{49} = 7$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-11',
        number: 11,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Làm tròn số $3.14159$ đến hàng phần trăm (chữ số thập phân thứ hai):',
        options: ['3.14', '3.15', '3.1', '3.142'],
        correctAnswerIndex: 0,
        explanation: 'Chữ số ngay sau hàng phần trăm là 1 (< 5), nên giữ nguyên: $3.14$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'rational'
      },
      {
        id: 'q7m1-12',
        number: 12,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Một chiếc hộp sữa tươi có dạng hình hộp chữ nhật kích thước $4\\text{ cm} \\times 5\\text{ cm} \\times 10\\text{ cm}$. Thể tích hộp sữa là:',
        options: ['200 cm³', '100 cm³', '40 cm³', '19 cm³'],
        correctAnswerIndex: 0,
        explanation: '$V = 4 \\times 5 \\times 10 = 200\\text{ cm}^3$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },

      // PHẦN II: 1 CÂU ĐÚNG / SAI 4 Ý (1.0 điểm)
      {
        id: 'q7m1-13',
        number: 13,
        section: 'II',
        sectionTitle: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (1 câu - 1,0 điểm)',
        questionType: 'true_false',
        questionText: 'Cho hai đường thẳng $a$ và $b$ cùng song song với đường thẳng $c$ trong mặt phẳng. Xét các khẳng định sau:',
        subQuestions: [
          {
            id: 'q7m1-13-a',
            label: 'a',
            text: 'Hai đường thẳng $a$ và $b$ song song với nhau.',
            isCorrect: true,
            explanation: 'Đúng: Hai đường thẳng phân biệt cùng song song với đường thẳng thứ ba thì song song với nhau.'
          },
          {
            id: 'q7m1-13-b',
            label: 'b',
            text: 'Nếu đường thẳng $d$ vuông góc với $a$ thì $d$ cũng vuông góc với $b$.',
            isCorrect: true,
            explanation: 'Đúng theo tính chất từ vuông góc đến song song.'
          },
          {
            id: 'q7m1-13-c',
            label: 'c',
            text: 'Qua một điểm $M$ nằm ngoài đường thẳng $a$, có thể kẻ được hai đường thẳng phân biệt cùng song song với $a$.',
            isCorrect: false,
            explanation: 'Sai theo Tiên đề Euclid: Qua một điểm nằm ngoài một đường thẳng, chỉ có duy nhất một đường thẳng song song với đường thẳng đó.'
          },
          {
            id: 'q7m1-13-d',
            label: 'd',
            text: 'Nếu hai góc trong cùng phía tạo bởi đường thẳng cắt $a$ và $b$ có tổng bằng $180^\\circ$ thì $a \\parallel b$.',
            isCorrect: true,
            explanation: 'Đúng theo dấu hiệu nhận biết hai đường thẳng song song.'
          }
        ],
        explanation: 'a - Đúng, b - Đúng, c - Sai, d - Đúng. Điểm: đúng 1 ý 0.1đ; 2 ý 0.25đ; 3 ý 0.5đ; 4 ý 1.0đ.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'geometry'
      },

      // PHẦN III: 2 CÂU TRẢ LỜI NGẮN (1.0 điểm, 0.5đ/câu)
      {
        id: 'q7m1-14',
        number: 14,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Tính giá trị biểu thức: $B = \\left(\\frac{1}{3}\\right)^2 \\cdot 9 + \\sqrt{0.36} - \\left|-\\frac{3}{5}\\right|$. Điền kết quả dưới dạng số nguyên hoặc số thập phân.',
        formula: 'B = \\left(\\frac{1}{3}\\right)^2 \\cdot 9 + \\sqrt{0.36} - \\left|-\\frac{3}{5}\\right|',
        correctShortAnswer: '1',
        acceptedAnswers: ['1', '1.0'],
        explanation: '$\\frac{1}{9} \\cdot 9 + 0.6 - 0.6 = 1 + 0 = 1$.',
        points: 0.5,
        level: 'thong_hieu',
        topic: 'rational'
      },
      {
        id: 'q7m1-15',
        number: 15,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Một bể bơi mini dạng hình hộp chữ nhật có chiều dài $5\\text{ m}$, chiều rộng $3\\text{ m}$ và mực nước sâu $1.2\\text{ m}$. Tính thể tích nước đang có trong bể bơi theo đơn vị mét khối (m³). (Chỉ điền số)',
        formula: 'V = a \\cdot b \\cdot h',
        correctShortAnswer: '18',
        acceptedAnswers: ['18', '18m3', '18 m3'],
        explanation: '$V = 5 \\times 3 \\times 1.2 = 18\\text{ m}^3$.',
        points: 0.5,
        level: 'van_dung',
        topic: 'geometry'
      },

      // PHẦN IV: 5 CÂU TỰ LUẬN (5.0 điểm, 1.0đ/câu)
      {
        id: 'q7m1-16',
        number: 16,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Thực hiện phép tính (tính hợp lý nếu có thể): \n\na) $\\frac{4}{7} \\cdot \\left(-\\frac{2}{5}\\right) + \\frac{4}{7} \\cdot \\left(-\\frac{3}{5}\\right)$ \n\nb) $\\left(-\\frac{1}{3}\\right)^2 : \\frac{2}{9} + \\sqrt{25} - |-\\frac{7}{2}|$',
        formula: '\\frac{4}{7} \\cdot \\left(-\\frac{2}{5}\\right) + \\frac{4}{7} \\cdot \\left(-\\frac{3}{5}\\right)',
        explanation: 'a) $\\frac{4}{7} \\cdot \\left(-\\frac{2}{5} - \\frac{3}{5}\\right) = \\frac{4}{7} \\cdot (-1) = -\\frac{4}{7}$.\nb) $\\frac{1}{9} \\cdot \\frac{9}{2} + 5 - \\frac{7}{2} = \\frac{1}{2} + 5 - \\frac{7}{2} = -3 + 5 = 2$.',
        sampleSolution: 'a) $\\frac{4}{7} \\cdot \\left(-\\frac{2}{5}\\right) + \\frac{4}{7} \\cdot \\left(-\\frac{3}{5}\\right) = \\frac{4}{7} \\cdot \\left(-\\frac{2}{5} - \\frac{3}{5}\\right) = \\frac{4}{7} \\cdot (-1) = -\\frac{4}{7}$.\n\nb) $\\left(-\\frac{1}{3}\\right)^2 : \\frac{2}{9} + \\sqrt{25} - |-\\frac{7}{2}| = \\frac{1}{9} \\cdot \\frac{9}{2} + 5 - \\frac{7}{2} = \\frac{1}{2} - \\frac{7}{2} + 5 = -3 + 5 = 2$.',
        rubric: [
          { step: 'Ý a: Đặt nhân tử chung tính ra -4/7', points: 0.5 },
          { step: 'Ý b: Khai căn và tính ra kết quả 2', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'rational'
      },
      {
        id: 'q7m1-17',
        number: 17,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm $x$ biết: \n\na) $\\frac{3}{4} + \\frac{1}{4} : x = \\frac{2}{5}$ \n\nb) $\\left(x - \\frac{1}{3}\\right)^2 = \\frac{4}{9}$',
        formula: '\\frac{3}{4} + \\frac{1}{4} : x = \\frac{2}{5}',
        explanation: 'a) $1/4 : x = 2/5 - 3/4 = -7/20 \\Rightarrow x = 1/4 : (-7/20) = -5/7$.\nb) $x - 1/3 = \\pm 2/3 \\Rightarrow x = 1$ hoặc $x = -1/3$.',
        sampleSolution: 'a) $\\frac{1}{4} : x = \\frac{2}{5} - \\frac{3}{4} = -\\frac{7}{20}$\n$x = \\frac{1}{4} : \\left(-\\frac{7}{20}\\right) = \\frac{1}{4} \\cdot \\left(-\\frac{20}{7}\\right) = -\\frac{5}{7}$.\n\nb) $\\left(x - \\frac{1}{3}\\right)^2 = \\left(\\frac{2}{3}\\right)^2$\nTH1: $x - \\frac{1}{3} = \\frac{2}{3} \\Rightarrow x = 1$.\nTH2: $x - \\frac{1}{3} = -\\frac{2}{3} \\Rightarrow x = -\\frac{1}{3}$.\nVậy $x \\in \\{1; -\\frac{1}{3}\\}$.',
        rubric: [
          { step: 'Ý a: Chuyển vế và tìm đúng x = -5/7', points: 0.5 },
          { step: 'Ý b: Xét 2 trường hợp tìm đúng x = 1 và x = -1/3', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'rational'
      },
      {
        id: 'q7m1-18',
        number: 18,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Ba lớp 7A, 7B, 7C tham gia phong trào quyên góp sách cũ ủng hộ thư viện trường. Số sách quyên góp được của ba lớp lần lượt tỉ lệ với các số $7; 8; 9$. Biết rằng tổng số sách quyên góp của lớp 7A và 7B nhiều hơn lớp 7C là 36 quyển. Hỏi mỗi lớp quyên góp được bao nhiêu quyển sách?',
        formula: '\\frac{a}{7} = \\frac{b}{8} = \\frac{c}{9} \\quad \\text{và} \\quad a + b - c = 36',
        explanation: 'Áp dụng tính chất dãy tỉ số bằng nhau: $\\frac{a}{7} = \\frac{b}{8} = \\frac{c}{9} = \\frac{a + b - c}{7 + 8 - 9} = \\frac{36}{6} = 6$. Suy ra $a = 42, b = 48, c = 54$.',
        sampleSolution: 'Gọi số sách quyên góp được của ba lớp 7A, 7B, 7C lần lượt là $x, y, z$ (quyển, $x, y, z \\in \\mathbb{N}^*$).\nTheo đề bài ta có:\n$\\frac{x}{7} = \\frac{y}{8} = \\frac{z}{9}$ và $x + y - z = 36$.\n\nÁp dụng tính chất của dãy tỉ số bằng nhau:\n$\\frac{x}{7} = \\frac{y}{8} = \\frac{z}{9} = \\frac{x + y - z}{7 + 8 - 9} = \\frac{36}{6} = 6$.\n\nTừ đó suy ra:\n$x = 6 \\times 7 = 42$ (quyển)\n$y = 6 \\times 8 = 48$ (quyển)\n$z = 6 \\times 9 = 54$ (quyển).\n\nĐáp số: 7A: 42 quyển; 7B: 48 quyển; 7C: 54 quyển.',
        rubric: [
          { step: 'Lập đúng dãy tỉ số bằng nhau và tính hệ số k = 6', points: 0.5 },
          { step: 'Tính ra đúng số sách 3 lớp: 42, 48, 54', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'rational'
      },
      {
        id: 'q7m1-19',
        number: 19,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho hình vẽ: Hai đường thẳng $Ax$ và $By$ song song với nhau. Điểm $C$ nằm giữa hai đường thẳng sao cho $\\widehat{CAx} = 40^\\circ$ và $\\widehat{CBy} = 30^\\circ$ (hai góc cùng hướng về phía điểm C). Tính số đo góc $\\widehat{ACB}$.',
        formula: 'Ax \\parallel By, \\quad \\widehat{CAx} = 40^\\circ, \\quad \\widehat{CBy} = 30^\\circ',
        explanation: 'Kẻ đường thẳng $Cz \\parallel Ax \\parallel By$. Góc $\\widehat{ACz} = \\widehat{CAx} = 40^\\circ$ (so le trong), góc $\\widehat{BCz} = \\widehat{CBy} = 30^\\circ$ (so le trong). Vậy $\\widehat{ACB} = 40^\\circ + 30^\\circ = 70^\\circ$.',
        sampleSolution: 'Qua điểm $C$ kẻ đường thẳng $Cz$ song song với $Ax$.\nVì $Ax \\parallel By$ nên $Cz \\parallel By$.\n\nDo $Cz \\parallel Ax$ nên:\n$\\widehat{ACz} = \\widehat{CAx} = 40^\\circ$ (hai góc so le trong).\n\nDo $Cz \\parallel By$ nên:\n$\\widehat{BCz} = \\widehat{CBy} = 30^\\circ$ (hai góc so le trong).\n\nVì tia $Cz$ nằm giữa hai tia $CA$ và $CB$ nên:\n$\\widehat{ACB} = \\widehat{ACz} + \\widehat{BCz} = 40^\\circ + 30^\\circ = 70^\\circ$.\n\nVậy $\\widehat{ACB} = 70^\\circ$.',
        rubric: [
          { step: 'Kẻ đường phụ Cz song song và chỉ ra hai cặp góc so le trong', points: 0.5 },
          { step: 'Cộng góc và kết luận số đo góc ACB = 70°', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q7m1-20',
        number: 20,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'So sánh hai lũy thừa sau không dùng máy tính: $A = 2^{300}$ và $B = 3^{200}$.',
        formula: '2^{300} \\quad \\text{và} \\quad 3^{200}',
        explanation: '$A = 2^{300} = (2^3)^{100} = 8^{100}$. $B = 3^{200} = (3^2)^{100} = 9^{100}$. Vì $8 < 9$ nên $8^{100} < 9^{100}$, suy ra $2^{300} < 3^{200}$.',
        sampleSolution: 'Ta có:\n$A = 2^{300} = (2^3)^{100} = 8^{100}$\n$B = 3^{200} = (3^2)^{100} = 9^{100}$\n\nVì $8 < 9$ nên $8^{100} < 9^{100}$.\nVậy $2^{300} < 3^{200}$.',
        rubric: [
          { step: 'Đưa hai lũy thừa về cùng số mũ 100', points: 0.5 },
          { step: 'So sánh cơ số 8 < 9 và kết luận đúng 2^300 < 3^200', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung_cao',
        topic: 'rational'
      }
    ]
  },

  // =========================================================================
  // ========================== KHỐI 8 =======================================
  // =========================================================================

  // 1. ĐỀ KIỂM TRA 15 PHÚT KHỐI 8 (4 TN 4 điểm + 2 Tự luận 6 điểm)
  {
    id: 'exam-g8-15m',
    code: 'KT15-K8',
    title: 'Đề Kiểm Tra 15 Phút - Hằng Đẳng Thức & Phân Thức Khối 8',
    grade: 8,
    semester: 'HK1',
    examType: 'quiz_15m',
    durationMinutes: 15,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: 4 câu trắc nghiệm (4,0 điểm) và 2 câu tự luận (6,0 điểm). Thời gian 15 phút.',
    matrix: { nhanBiet: 50, thongHieu: 30, vanDung: 20, vanDungCao: 0 },
    questions: [
      {
        id: 'q8-15m-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Khai triển hằng đẳng thức $(x - 3)^2$ bằng:',
        formula: '(x - 3)^2',
        options: ['x² - 6x + 9', 'x² - 3x + 9', 'x² - 9', 'x² + 6x + 9'],
        correctAnswerIndex: 0,
        explanation: '$(a - b)^2 = a^2 - 2ab + b^2 = x^2 - 6x + 9$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q8-15m-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính nhanh giá trị của $75^2 - 25^2$:',
        formula: '75^2 - 25^2 = (75 - 25)(75 + 25)',
        options: ['5000', '2500', '1000', '500'],
        correctAnswerIndex: 0,
        explanation: '$(75 - 25)(75 + 25) = 50 \\times 100 = 5000$.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8-15m-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tứ giác có 4 cạnh bằng nhau là:',
        options: ['Hình thoi', 'Hình chữ nhật', 'Hình thang cân', 'Hình bình hành'],
        correctAnswerIndex: 0,
        explanation: 'Định nghĩa hình thoi là tứ giác có 4 cạnh bằng nhau.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q8-15m-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Điều kiện xác định của phân thức đại số $\\frac{x + 2}{x - 3}$ là:',
        formula: '\\frac{x + 2}{x - 3}',
        options: ['x ≠ 3', 'x ≠ -2', 'x ≠ 0', 'x > 3'],
        correctAnswerIndex: 0,
        explanation: 'Mẫu thức khác 0: $x - 3 \\ne 0 \\Leftrightarrow x \\ne 3$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      // Tự luận (2 câu - 6.0đ)
      {
        id: 'q8-15m-5',
        number: 5,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Phân tích các đa thức sau thành nhân tử: \n\na) $3x^2 - 6x$ \n\nb) $x^2 - 4y^2 + x - 2y$',
        formula: 'x^2 - 4y^2 + x - 2y',
        explanation: 'a) $3x(x - 2)$.\nb) $(x - 2y)(x + 2y) + (x - 2y) = (x - 2y)(x + 2y + 1)$.',
        sampleSolution: 'a) $3x^2 - 6x = 3x \\cdot (x - 2)$.\n\nb) $x^2 - 4y^2 + x - 2y = (x^2 - (2y)^2) + (x - 2y)$\n$= (x - 2y)(x + 2y) + (x - 2y)$\n$= (x - 2y)(x + 2y + 1)$.',
        rubric: [
          { step: 'Ý a: Đặt nhân tử chung 3x(x - 2)', points: 1.5 },
          { step: 'Ý b: Dùng hằng đẳng thức và nhóm thành (x - 2y)(x + 2y + 1)', points: 1.5 }
        ],
        points: 3.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8-15m-6',
        number: 6,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Rút gọn phân thức đại số sau: \n\n$P = \\frac{x^2 - 4}{x^2 + 4x + 4}$ với $x \\ne -2$. Tính giá trị của $P$ khi $x = 8$.',
        formula: 'P = \\frac{x^2 - 4}{(x + 2)^2}',
        explanation: '$P = \\frac{(x - 2)(x + 2)}{(x + 2)^2} = \\frac{x - 2}{x + 2}$. Khi $x = 8$: $P = \\frac{8 - 2}{8 + 2} = \\frac{6}{10} = \\frac{3}{5}$.',
        sampleSolution: 'Ta có:\n$P = \\frac{x^2 - 4}{x^2 + 4x + 4} = \\frac{(x - 2)(x + 2)}{(x + 2)^2} = \\frac{x - 2}{x + 2}$.\n\nThay $x = 8$ (thỏa mãn điều kiện $x \\ne -2$) vào biểu thức rút gọn:\n$P = \\frac{8 - 2}{8 + 2} = \\frac{6}{10} = \\frac{3}{5}$.\n\nVậy khi $x = 8$ thì $P = \\frac{3}{5}$.',
        rubric: [
          { step: 'Rút gọn đúng P = (x - 2)/(x + 2)', points: 1.5 },
          { step: 'Thay x = 8 tính đúng P = 3/5', points: 1.5 }
        ],
        points: 3.0,
        level: 'van_dung',
        topic: 'algebra'
      }
    ]
  },

  // 2. ĐỀ THI GIỮA HỌC KỲ I KHỐI 8 (12 TN + 1 Đ/S 4 ý + 2 TL ngắn + 5 Tự luận)
  {
    id: 'exam-g8-mid1',
    code: 'GK1-K8',
    title: 'Đề Thi Giữa Học Kỳ I - Toán Khối 8 (Chuẩn Ma Trận Mới)',
    grade: 8,
    semester: 'HK1',
    examType: 'midterm',
    durationMinutes: 90,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: Phần I (12 câu TN - 3,0đ), Phần II (1 câu Đ/S 4 ý - 1,0đ), Phần III (2 câu trả lời ngắn - 1,0đ), Phần IV (5 câu tự luận - 5,0đ).',
    matrix: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
    questions: [
      // 12 câu trắc nghiệm (3.0đ)
      {
        id: 'q8m1-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Đơn thức nào sau đây đồng dạng với đơn thức $-3x^2y$?',
        options: ['5x²y', '3xy²', '-3x²y²', '2x³y'],
        correctAnswerIndex: 0,
        explanation: 'Đơn thức đồng dạng có cùng phần biến $x^2y$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q8m1-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Bậc của đa thức $P = 4x^3y^2 - 2x^4y + 5x^2 - 1$ là:',
        options: ['5', '4', '6', '3'],
        correctAnswerIndex: 0,
        explanation: 'Hạng tử có bậc cao nhất là $4x^3y^2$ và $-2x^4y$ đều có bậc $3 + 2 = 4 + 1 = 5$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q8m1-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Khai triển hằng đẳng thức $(2x - y)^2$ bằng:',
        options: ['4x² - 4xy + y²', '4x² - 2xy + y²', '2x² - 4xy + y²', '4x² - y²'],
        correctAnswerIndex: 0,
        explanation: '$(2x)^2 - 2(2x)(y) + y^2 = 4x^2 - 4xy + y^2$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q8m1-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hiệu hai bình phương $a^2 - b^2$ phân tích thành:',
        options: ['(a - b)(a + b)', '(a - b)²', '(a + b)²', 'a² - 2ab + b²'],
        correctAnswerIndex: 0,
        explanation: 'Hằng đẳng thức số 3: $a^2 - b^2 = (a - b)(a + b)$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q8m1-5',
        number: 5,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tổng số đo bốn góc trong một tứ giác lồi bằng:',
        options: ['360°', '180°', '270°', '540°'],
        correctAnswerIndex: 0,
        explanation: 'Định lý tứ giác: Tổng các góc của một tứ giác lồi luôn bằng $360^\\circ$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q8m1-6',
        number: 6,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hình chữ nhật có hai đường chéo vuông góc với nhau là:',
        options: ['Hình vuông', 'Hình thoi', 'Hình thang cân', 'Hình bình hành'],
        correctAnswerIndex: 0,
        explanation: 'Dấu hiệu nhận biết hình vuông: Hình chữ nhật có hai đường chéo vuông góc là hình vuông.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q8m1-7',
        number: 7,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Phân tích đa thức $x^3 - 8$ thành nhân tử:',
        options: ['(x - 2)(x² + 2x + 4)', '(x - 2)(x² - 2x + 4)', '(x - 2)³', '(x + 2)(x² - 2x + 4)'],
        correctAnswerIndex: 0,
        explanation: '$x^3 - 2^3 = (x - 2)(x^2 + 2x + 4)$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8m1-8',
        number: 8,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Cho hình bình hành $ABCD$ có $\\widehat{A} = 110^\\circ$. Số đo góc $\\widehat{B}$ là:',
        options: ['70°', '110°', '90°', '80°'],
        correctAnswerIndex: 0,
        explanation: 'Hai góc kề một cạnh của hình bình hành bù nhau: $\\widehat{B} = 180^\\circ - 110^\\circ = 70^\\circ$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q8m1-9',
        number: 9,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Rút gọn phân thức $\\frac{2x - 4}{x^2 - 4}$ với $x \\ne \\pm 2$:',
        formula: '\\frac{2(x - 2)}{(x - 2)(x + 2)}',
        options: ['2/(x + 2)', '2/(x - 2)', '1/(x + 2)', '2'],
        correctAnswerIndex: 0,
        explanation: '$\\frac{2(x - 2)}{(x - 2)(x + 2)} = \\frac{2}{x + 2}$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8m1-10',
        number: 10,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Hình chóp tam giác đều có mặt đáy là:',
        options: ['Tam giác đều', 'Tam giác vuông', 'Tam giác cân', 'Tam giác bất kỳ'],
        correctAnswerIndex: 0,
        explanation: 'Hình chóp tam giác đều có đáy là tam giác đều.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q8m1-11',
        number: 11,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính giá trị của đa thức $A = x^2 - 2xy + y^2$ tại $x = 105$ và $y = 5$:',
        formula: '(x - y)^2',
        options: ['10000', '1000', '100', '12100'],
        correctAnswerIndex: 0,
        explanation: '$A = (x - y)^2 = (105 - 5)^2 = 100^2 = 10000$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8m1-12',
        number: 12,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tìm $x$ biết $x^2 - 16 = 0$:',
        options: ['x = ±4', 'x = 4', 'x = -4', 'x = 16'],
        correctAnswerIndex: 0,
        explanation: '$(x - 4)(x + 4) = 0 \\Leftrightarrow x = \\pm 4$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },

      // PHẦN II: 1 CÂU ĐÚNG / SAI 4 Ý (1.0 điểm)
      {
        id: 'q8m1-13',
        number: 13,
        section: 'II',
        sectionTitle: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (1 câu - 1,0 điểm)',
        questionType: 'true_false',
        questionText: 'Cho biểu thức đa thức $P(x) = (x + 2)^2 - (x - 2)^2$. Mỗi khẳng định sau Đúng hay Sai?',
        subQuestions: [
          {
            id: 'q8m1-13-a',
            label: 'a',
            text: 'Sau khi khai triển và rút gọn, ta được $P(x) = 8x$.',
            formula: 'P(x) = 8x',
            isCorrect: true,
            explanation: '$P(x) = [(x+2) - (x-2)][(x+2) + (x-2)] = 4 \\cdot 2x = 8x$. (Đúng)'
          },
          {
            id: 'q8m1-13-b',
            label: 'b',
            text: 'Bậc của đa thức $P(x)$ bằng 2.',
            isCorrect: false,
            explanation: 'Sai: $P(x) = 8x$ là đa thức bậc 1.'
          },
          {
            id: 'q8m1-13-c',
            label: 'c',
            text: 'Tại $x = -5$, giá trị của biểu thức $P(-5) = -40$.',
            formula: 'P(-5) = 8 \\cdot (-5) = -40',
            isCorrect: true,
            explanation: '$8 \\times (-5) = -40$. (Đúng)'
          },
          {
            id: 'q8m1-13-d',
            label: 'd',
            text: 'Phương trình $P(x) = 0$ có vô số nghiệm.',
            isCorrect: false,
            explanation: 'Sai: $8x = 0 \\Leftrightarrow x = 0$, chỉ có 1 nghiệm duy nhất.'
          }
        ],
        explanation: 'a - Đúng, b - Sai, c - Đúng, d - Sai. Thang điểm: đúng 1 ý 0.1đ; 2 ý 0.25đ; 3 ý 0.5đ; 4 ý 1.0đ.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },

      // PHẦN III: 2 CÂU TRẢ LỜI NGẮN (1.0 điểm, 0.5đ/câu)
      {
        id: 'q8m1-14',
        number: 14,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Tính nhanh giá trị của biểu thức $M = x^3 - 3x^2 + 3x - 1$ tại $x = 101$. Điền kết quả số vào ô đáp án.',
        formula: 'M = (x - 1)^3',
        correctShortAnswer: '1000000',
        acceptedAnswers: ['1000000', '1.000.000', '10^6'],
        explanation: '$M = (x - 1)^3 = (101 - 1)^3 = 100^3 = 1\\ 000\\ 000$.',
        points: 0.5,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8m1-15',
        number: 15,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Một hình chóp tứ giác đều có cạnh đáy bằng $6\\text{ cm}$ và chiều cao bằng $8\\text{ cm}$. Tính thể tích của hình chóp đó theo đơn vị cm³. (Chỉ điền số)',
        formula: 'V = \\frac{1}{3} \\cdot S_{\\text{đáy}} \\cdot h',
        correctShortAnswer: '96',
        acceptedAnswers: ['96', '96cm3'],
        explanation: '$S_{\\text{đáy}} = 6^2 = 36\\text{ cm}^2$. Thể tích $V = \\frac{1}{3} \\times 36 \\times 8 = 96\\text{ cm}^3$.',
        points: 0.5,
        level: 'van_dung',
        topic: 'geometry'
      },

      // PHẦN IV: 5 CÂU TỰ LUẬN (5.0 điểm, 1.0đ/câu)
      {
        id: 'q8m1-16',
        number: 16,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Thực hiện phép tính rút gọn đa thức: \n\na) $A = 2x(x - 3) - x(2x - 5)$ \n\nb) $B = (x + 3)(x - 3) - (x - 2)^2$',
        formula: '(x + 3)(x - 3) - (x - 2)^2',
        explanation: 'a) $2x^2 - 6x - 2x^2 + 5x = -x$.\nb) $x^2 - 9 - (x^2 - 4x + 4) = x^2 - 9 - x^2 + 4x - 4 = 4x - 13$.',
        sampleSolution: 'a) $A = 2x(x - 3) - x(2x - 5) = 2x^2 - 6x - 2x^2 + 5x = -x$.\n\nb) $B = (x + 3)(x - 3) - (x - 2)^2 = (x^2 - 9) - (x^2 - 4x + 4) = x^2 - 9 - x^2 + 4x - 4 = 4x - 13$.',
        rubric: [
          { step: 'Ý a: Khai triển và thu gọn đúng A = -x', points: 0.5 },
          { step: 'Ý b: Áp dụng hằng đẳng thức rút gọn đúng B = 4x - 13', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q8m1-17',
        number: 17,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Phân tích các đa thức sau thành nhân tử: \n\na) $x^3 - 4x$ \n\nb) $x^2 - 2xy + y^2 - 16$',
        formula: 'x^2 - 2xy + y^2 - 16',
        explanation: 'a) $x(x^2 - 4) = x(x - 2)(x + 2)$.\nb) $(x - y)^2 - 4^2 = (x - y - 4)(x - y + 4)$.',
        sampleSolution: 'a) $x^3 - 4x = x(x^2 - 4) = x(x - 2)(x + 2)$.\n\nb) $x^2 - 2xy + y^2 - 16 = (x - y)^2 - 4^2 = (x - y - 4)(x - y + 4)$.',
        rubric: [
          { step: 'Ý a: Đặt nhân tử chung x và dùng HĐT ra x(x - 2)(x + 2)', points: 0.5 },
          { step: 'Ý b: Nhóm hằng đẳng thức (x - y)^2 - 4^2 ra (x - y - 4)(x - y + 4)', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'algebra'
      },
      {
        id: 'q8m1-18',
        number: 18,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho biểu thức phân thức: $A = \\left(\\frac{1}{x - 2} - \\frac{1}{x + 2}\\right) : \\frac{2}{x^2 - 4}$ với $x \\ne \\pm 2$. \n\na) Rút gọn biểu thức $A$. \n\nb) Tìm giá trị của $x$ để $A = 2$.',
        formula: 'A = \\left(\\frac{1}{x - 2} - \\frac{1}{x + 2}\\right) : \\frac{2}{x^2 - 4}',
        explanation: 'a) Quy đồng: $\\frac{(x + 2) - (x - 2)}{x^2 - 4} : \\frac{2}{x^2 - 4} = \\frac{4}{x^2 - 4} \\cdot \\frac{x^2 - 4}{2} = 2$.\nb) Vì $A = 2$ với mọi $x \\ne \\pm 2$ nên phương trình $A = 2$ thỏa mãn với mọi $x \\ne \\pm 2$.',
        sampleSolution: 'a) Với $x \\ne \\pm 2$, ta có:\n$A = \\left(\\frac{x + 2}{(x - 2)(x + 2)} - \\frac{x - 2}{(x - 2)(x + 2)}\\right) : \\frac{2}{x^2 - 4}$\n$A = \\frac{x + 2 - x + 2}{x^2 - 4} \\cdot \\frac{x^2 - 4}{2}$\n$A = \\frac{4}{x^2 - 4} \\cdot \\frac{x^2 - 4}{2} = 2$.\n\nb) Do $A = 2$ không phụ thuộc vào $x$, nên $A = 2$ thỏa mãn với mọi $x \\in \\mathbb{R}$ thỏa mãn điều kiện $x \\ne \\pm 2$.',
        rubric: [
          { step: 'Ý a: Quy đồng và rút gọn đúng A = 2', points: 0.5 },
          { step: 'Ý b: Kết luận đúng nghiệm với điều kiện xác định', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'algebra'
      },
      {
        id: 'q8m1-19',
        number: 19,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho tam giác $ABC$ vuông tại $A$ ($AB < AC$), đường trung tuyến $AM$. Gọi $D$ là điểm đối xứng với $A$ qua $M$. \n\na) Chứng minh tứ giác $ABDC$ là hình chữ nhật. \n\nb) Lấy điểm $E$ đối xứng với $A$ qua $BC$. Chứng minh $BC \\parallel ED$.',
        explanation: 'a) Tứ giác $ABDC$ có hai đường chéo $AD$ và $BC$ cắt nhau tại trung điểm $M$ của mỗi đường nên là hình bình hành. Lại có $\\widehat{A} = 90^\\circ$ nên $ABDC$ là hình chữ nhật.\nb) Vì $E$ đối xứng $A$ qua $BC$ nên $BC$ là trung trực của $AE$, suy ra $AE \\perp BC$. Mà $CD \\perp AC, BD \\perp AB...$ suy ra $BC \\parallel ED$.',
        sampleSolution: 'a) Tứ giác $ABDC$ có:\n$M$ là trung điểm của cạnh huyền $BC$ (gt).\n$M$ là trung điểm của $AD$ (do $D$ đối xứng với $A$ qua $M$).\n$\\Rightarrow ABDC$ có hai đường chéo cắt nhau tại trung điểm của mỗi đường nên $ABDC$ là hình bình hành.\nMặt khác tam giác $ABC$ vuông tại $A$ nên $\\widehat{BAC} = 90^\\circ$.\nHình bình hành $ABDC$ có một góc vuông nên là hình chữ nhật (đpcm).\n\nb) Do $ABDC$ là hình chữ nhật nên $AD = BC$ và tam giác $ABC = \\Delta DCB$.\nKết hợp điểm $E$ đối xứng với $A$ qua $BC$, chứng minh được tứ giác $BCDE$ là hình thang cân, suy ra $BC \\parallel ED$ (đpcm).',
        rubric: [
          { step: 'Ý a: Chứng minh hình bình hành có 1 góc vuông là hình chữ nhật', points: 0.5 },
          { step: 'Ý b: Sử dụng tính chất đối xứng suy ra BC song song ED', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q8m1-20',
        number: 20,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Tìm giá trị nhỏ nhất của biểu thức: $A = x^2 - 4x + y^2 - 6y + 2026$.',
        formula: 'A = (x - 2)^2 + (y - 3)^2 + 2013',
        explanation: '$A = (x^2 - 4x + 4) + (y^2 - 6y + 9) + 2013 = (x - 2)^2 + (y - 3)^2 + 2013 \\ge 2013$. Đẳng thức xảy ra khi $x = 2, y = 3$.',
        sampleSolution: 'Ta biến đổi biểu thức $A$:\n$A = (x^2 - 4x + 4) + (y^2 - 6y + 9) + 2026 - 4 - 9$\n$A = (x - 2)^2 + (y - 3)^2 + 2013$.\n\nVì $(x - 2)^2 \\ge 0$ với mọi $x$, và $(y - 3)^2 \\ge 0$ với mọi $y$, nên:\n$A \\ge 0 + 0 + 2013 = 2013$.\n\nDấu "=" xảy ra khi và chỉ khi:\n$\\begin{cases} x - 2 = 0 \\\\ y - 3 = 0 \\end{cases} \\Leftrightarrow \\begin{cases} x = 2 \\\\ y = 3 \\end{cases}$.\n\nVậy giá trị nhỏ nhất của biểu thức $A$ là $2013$ khi $x = 2$ và $y = 3$.',
        rubric: [
          { step: 'Tách biểu thức về tổng hai bình phương (x-2)^2 + (y-3)^2 + 2013', points: 0.5 },
          { step: 'Đánh giá bất đẳng thức và chỉ ra dấu bằng x=2, y=3', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung_cao',
        topic: 'algebra'
      }
    ]
  },

  // =========================================================================
  // ========================== KHỐI 9 =======================================
  // =========================================================================

  // 1. ĐỀ KIỂM TRA 15 PHÚT KHỐI 9 (4 TN 4 điểm + 2 Tự luận 6 điểm)
  {
    id: 'exam-g9-15m',
    code: 'KT15-K9',
    title: 'Đề Kiểm Tra 15 Phút - Căn Thức Bậc Hai & Hệ Thức Lượng Khối 9',
    grade: 9,
    semester: 'HK1',
    examType: 'quiz_15m',
    durationMinutes: 15,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn: 4 câu trắc nghiệm (4,0 điểm) và 2 câu tự luận (6,0 điểm). Thời gian 15 phút.',
    matrix: { nhanBiet: 50, thongHieu: 30, vanDung: 20, vanDungCao: 0 },
    questions: [
      {
        id: 'q9-15m-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Điều kiện xác định của biểu thức căn bậc hai $\\sqrt{2x - 6}$ là:',
        formula: '\\sqrt{2x - 6}',
        options: ['x ≥ 3', 'x > 3', 'x ≤ 3', 'x ≥ 6'],
        correctAnswerIndex: 0,
        explanation: '$2x - 6 \\ge 0 \\Leftrightarrow 2x \\ge 6 \\Leftrightarrow x \\ge 3$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q9-15m-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính giá trị của biểu thức $\\sqrt{(\\sqrt{3} - 2)^2}$:',
        formula: '\\sqrt{(\\sqrt{3} - 2)^2} = |\\sqrt{3} - 2|',
        options: ['2 - √3', '√3 - 2', '2 + √3', '-2 - √3'],
        correctAnswerIndex: 0,
        explanation: 'Vì $\\sqrt{3} < 2$ nên $|\\sqrt{3} - 2| = 2 - \\sqrt{3}$.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9-15m-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Trong tam giác vuông có một góc nhọn bằng $30^\\circ$, giá trị của $\\sin 30^\\circ$ là:',
        options: ['1/2', '√3/2', '√2/2', '1'],
        correctAnswerIndex: 0,
        explanation: 'Theo tỉ số lượng giác góc nhọn: $\\sin 30^\\circ = \\frac{1}{2}$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q9-15m-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. TRẮC NGHIỆM (4 câu - 4,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Rút gọn biểu thức $3\\sqrt{8} - \\sqrt{18}$ được kết quả:',
        options: ['3√2', '√2', '4√2', '2√2'],
        correctAnswerIndex: 0,
        explanation: '$3\\sqrt{8} - \\sqrt{18} = 3(2\\sqrt{2}) - 3\\sqrt{2} = 6\\sqrt{2} - 3\\sqrt{2} = 3\\sqrt{2}$.',
        points: 1.0,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      // Tự luận (2 câu - 6.0đ)
      {
        id: 'q9-15m-5',
        number: 5,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Rút gọn biểu thức căn bậc hai: \n\n$A = \\sqrt{75} - 2\\sqrt{12} + \\sqrt{(2 - \\sqrt{3})^2}$',
        formula: 'A = \\sqrt{75} - 2\\sqrt{12} + |2 - \\sqrt{3}|',
        explanation: '$\\sqrt{75} = 5\\sqrt{3}$; $2\\sqrt{12} = 4\\sqrt{3}$; $|2 - \\sqrt{3}| = 2 - \\sqrt{3}$. Do đó $A = 5\\sqrt{3} - 4\\sqrt{3} + 2 - \\sqrt{3} = 2$.',
        sampleSolution: 'Ta có:\n$A = \\sqrt{75} - 2\\sqrt{12} + \\sqrt{(2 - \\sqrt{3})^2}$\n$A = \\sqrt{25 \\cdot 3} - 2\\sqrt{4 \\cdot 3} + |2 - \\sqrt{3}|$\n$A = 5\\sqrt{3} - 2 \\cdot 2\\sqrt{3} + (2 - \\sqrt{3})$  (vì $2 > \\sqrt{3}$ nên $|2 - \\sqrt{3}| = 2 - \\sqrt{3}$)\n$A = 5\\sqrt{3} - 4\\sqrt{3} + 2 - \\sqrt{3}$\n$A = (5\\sqrt{3} - 4\\sqrt{3} - \\sqrt{3}) + 2 = 0 + 2 = 2$.\n\nVậy $A = 2$.',
        rubric: [
          { step: 'Khai căn các biểu thức 5√3 và 4√3', points: 1.5 },
          { step: 'Phá dấu trị tuyệt đối và tính đúng kết quả A = 2', points: 1.5 }
        ],
        points: 3.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9-15m-6',
        number: 6,
        section: 'II',
        sectionTitle: 'PHẦN II. TỰ LUẬN (2 câu - 6,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Biết $AB = 6\\text{ cm}$ và $BC = 10\\text{ cm}$. \n\na) Tính độ dài cạnh $AC$. \n\nb) Tính độ dài đường cao $AH$ và hình chiếu $BH$.',
        formula: 'AC = \\sqrt{BC^2 - AB^2}, \\quad AH \\cdot BC = AB \\cdot AC',
        explanation: 'a) $AC = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$.\nb) $AH = \\frac{AB \\cdot AC}{BC} = \\frac{6 \\cdot 8}{10} = 4.8\\text{ cm}$. $BH = \\frac{AB^2}{BC} = \\frac{36}{10} = 3.6\\text{ cm}$.',
        sampleSolution: 'a) Áp dụng định lý Pythagore trong tam giác $ABC$ vuông tại $A$:\n$BC^2 = AB^2 + AC^2 \\Rightarrow AC^2 = BC^2 - AB^2 = 10^2 - 6^2 = 64$.\n$\\Rightarrow AC = \\sqrt{64} = 8\\text{ (cm)}$.\n\nb) Áp dụng hệ thức lượng trong tam giác vuông $ABC$ với đường cao $AH$:\n- $AB \\cdot AC = AH \\cdot BC \\Rightarrow AH = \\frac{AB \\cdot AC}{BC} = \\frac{6 \\cdot 8}{10} = 4.8\\text{ (cm)}$.\n- $AB^2 = BH \\cdot BC \\Rightarrow BH = \\frac{AB^2}{BC} = \\frac{6^2}{10} = 3.6\\text{ (cm)}$.\n\nĐáp số: $AC = 8\\text{ cm}$; $AH = 4.8\\text{ cm}$; $BH = 3.6\\text{ cm}$.',
        rubric: [
          { step: 'Ý a: Dùng Pythagore tính đúng AC = 8 cm', points: 1.5 },
          { step: 'Ý b: Dùng hệ thức lượng tính đúng AH = 4.8 cm và BH = 3.6 cm', points: 1.5 }
        ],
        points: 3.0,
        level: 'van_dung',
        topic: 'geometry'
      }
    ]
  },

  // 2. ĐỀ THI GIỮA HỌC KỲ I KHỐI 9 (12 TN + 1 Đ/S 4 ý + 2 TL ngắn + 5 Tự luận)
  {
    id: 'exam-g9-mid1',
    code: 'GK1-K9',
    title: 'Đề Thi Giữa Học Kỳ I - Toán Khối 9 (Ôn Thi Vào 10 Chuyên Sâu)',
    grade: 9,
    semester: 'HK1',
    examType: 'midterm',
    durationMinutes: 90,
    totalPoints: 10,
    description: 'Cấu trúc chuẩn Bộ GD&ĐT: Phần I (12 câu TN - 3,0đ), Phần II (1 câu Đ/S 4 ý - 1,0đ), Phần III (2 câu trả lời ngắn - 1,0đ), Phần IV (5 câu tự luận - 5,0đ).',
    matrix: { nhanBiet: 40, thongHieu: 30, vanDung: 20, vanDungCao: 10 },
    questions: [
      // 12 câu trắc nghiệm ABCD (3.0đ)
      {
        id: 'q9m1-1',
        number: 1,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Biểu thức $\\sqrt{\\frac{2}{x - 1}}$ có nghĩa khi và chỉ khi:',
        options: ['x > 1', 'x ≥ 1', 'x < 1', 'x ≠ 1'],
        correctAnswerIndex: 0,
        explanation: 'Vì tử số $2 > 0$ nên để phân thức không âm và mẫu khác 0 thì $x - 1 > 0 \\Leftrightarrow x > 1$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q9m1-2',
        number: 2,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tính giá trị của biểu thức $\\sqrt{49 \\cdot 0.16}$:',
        options: ['2.8', '28', '0.28', '1.4'],
        correctAnswerIndex: 0,
        explanation: '$\\sqrt{49} \\cdot \\sqrt{0.16} = 7 \\cdot 0.4 = 2.8$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q9m1-3',
        number: 3,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Trục căn thức ở mẫu của $\\frac{6}{\\sqrt{3}}$ ta được:',
        options: ['2√3', '3√3', '√3', '6√3'],
        correctAnswerIndex: 0,
        explanation: '$\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q9m1-4',
        number: 4,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tam giác $ABC$ vuông tại $A$, có $\\widehat{B} = \\alpha$. Khẳng định nào sau đây là ĐÚNG?',
        options: ['sin α = AC/BC', 'sin α = AB/BC', 'cos α = AC/BC', 'tan α = AB/AC'],
        correctAnswerIndex: 0,
        explanation: 'Sin đi học: cạnh đối chia cạnh huyền = $AC/BC$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q9m1-5',
        number: 5,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Cho tam giác vuông có hai cạnh góc vuông là $3\\text{ cm}$ và $4\\text{ cm}$. Chiều cao ứng với cạnh huyền là:',
        formula: 'h = \\frac{a \\cdot b}{c}',
        options: ['2.4 cm', '4.8 cm', '5 cm', '1.2 cm'],
        correctAnswerIndex: 0,
        explanation: 'Cạnh huyền = $5\\text{ cm}$. $h = \\frac{3 \\cdot 4}{5} = 2.4\\text{ cm}$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q9m1-6',
        number: 6,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Rút gọn biểu thức $\\sqrt{x^2 - 6x + 9}$ với $x < 3$:',
        formula: '\\sqrt{(x - 3)^2} = |x - 3|',
        options: ['3 - x', 'x - 3', 'x + 3', '-x - 3'],
        correctAnswerIndex: 0,
        explanation: 'Vì $x < 3$ nên $x - 3 < 0 \\Rightarrow |x - 3| = 3 - x$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9m1-7',
        number: 7,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Đường tròn tâm $O$ bán kính $R = 5\\text{ cm}$. Dây cung $AB = 8\\text{ cm}$. Khoảng cách từ tâm $O$ đến dây $AB$ bằng:',
        formula: 'd = \\sqrt{R^2 - (AB/2)^2}',
        options: ['3 cm', '4 cm', '6 cm', '2.5 cm'],
        correctAnswerIndex: 0,
        explanation: '$d = \\sqrt{5^2 - 4^2} = \\sqrt{25 - 16} = 3\\text{ cm}$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q9m1-8',
        number: 8,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Giá trị của biểu thức $\\tan 45^\\circ + \\cot 45^\\circ$ là:',
        options: ['2', '1', '0', '√2'],
        correctAnswerIndex: 0,
        explanation: '$\\tan 45^\\circ = 1$ và $\\cot 45^\\circ = 1 \\Rightarrow 1 + 1 = 2$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'geometry'
      },
      {
        id: 'q9m1-9',
        number: 9,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Tìm $x$ biết $\\sqrt{x} = 6$:',
        options: ['x = 36', 'x = √6', 'x = ±36', 'x = 12'],
        correctAnswerIndex: 0,
        explanation: '$x = 6^2 = 36$.',
        points: 0.25,
        level: 'nhan_biet',
        topic: 'algebra'
      },
      {
        id: 'q9m1-10',
        number: 10,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Cho hai đường tròn $(O; 3\\text{ cm})$ và $(O\'; 4\\text{ cm})$ có đoạn nối tâm $OO\' = 7\\text{ cm}$. Vị trí tương đối của hai đường tròn là:',
        options: ['Tiếp xúc ngoài', 'Tiếp xúc trong', 'Cắt nhau', 'Ở ngoài nhau'],
        correctAnswerIndex: 0,
        explanation: 'Vì $OO\' = R + R\' = 3 + 4 = 7\\text{ cm}$ nên hai đường tròn tiếp xúc ngoài.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'geometry'
      },
      {
        id: 'q9m1-11',
        number: 11,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Rút gọn biểu thức $\\frac{x - 9}{\\sqrt{x} + 3}$ với $x \\ge 0$:',
        options: ['√x - 3', '√x + 3', 'x - 3', '1'],
        correctAnswerIndex: 0,
        explanation: '$\\frac{(\\sqrt{x} - 3)(\\sqrt{x} + 3)}{\\sqrt{x} + 3} = \\sqrt{x} - 3$.',
        points: 0.25,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9m1-12',
        number: 12,
        section: 'I',
        sectionTitle: 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu - 3,0 điểm)',
        questionType: 'multiple_choice',
        questionText: 'Một cột đèn cao $7\\text{ m}$ có bóng trên mặt đất dài $4\\text{ m}$. Góc tạo bởi tia sáng mặt trời với mặt đất (làm tròn đến độ) xấp xỉ bằng:',
        formula: '\\tan \\alpha = \\frac{7}{4}',
        options: ['60°', '30°', '45°', '75°'],
        correctAnswerIndex: 0,
        explanation: '$\\tan \\alpha = 7/4 = 1.75 \\Rightarrow \\alpha \\approx 60^\\circ$.',
        points: 0.25,
        level: 'van_dung',
        topic: 'geometry'
      },

      // PHẦN II: 1 CÂU ĐÚNG / SAI 4 Ý (1.0 điểm)
      {
        id: 'q9m1-13',
        number: 13,
        section: 'II',
        sectionTitle: 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI (1 câu - 1,0 điểm)',
        questionType: 'true_false',
        questionText: 'Cho biểu thức chứa căn bậc hai $A = \\frac{\\sqrt{x} + 1}{\\sqrt{x} - 2}$ với $x \\ge 0, x \\ne 4$. Xét các khẳng định sau:',
        subQuestions: [
          {
            id: 'q9m1-13-a',
            label: 'a',
            text: 'Tại $x = 9$, giá trị của biểu thức $A = 4$.',
            formula: 'A = \\frac{3 + 1}{3 - 2} = 4',
            isCorrect: true,
            explanation: 'Thay $x = 9$: $A = \\frac{3 + 1}{3 - 2} = 4$. (Đúng)'
          },
          {
            id: 'q9m1-13-b',
            label: 'b',
            text: 'Biểu thức $A$ có thể viết lại dưới dạng $A = 1 + \\frac{3}{\\sqrt{x} - 2}$.',
            formula: 'A = 1 + \\frac{3}{\\sqrt{x} - 2}',
            isCorrect: true,
            explanation: '$\\frac{\\sqrt{x} - 2 + 3}{\\sqrt{x} - 2} = 1 + \\frac{3}{\\sqrt{x} - 2}$. (Đúng)'
          },
          {
            id: 'q9m1-13-c',
            label: 'c',
            text: 'Để biểu thức $A$ nhận giá trị nguyên thì chỉ có duy nhất 1 giá trị của $x$.',
            isCorrect: false,
            explanation: 'Sai: Để $A \\in \\mathbb{Z}$ thì $\\sqrt{x} - 2 \\in \\text{Ư}(3) = \\{\\pm 1; \\pm 3\\}$, tìm được nhiều hơn 1 giá trị của $x$ ($x = 1, 9, 25$).'
          },
          {
            id: 'q9m1-13-d',
            label: 'd',
            text: 'Phương trình $A = 0$ vô nghiệm.',
            isCorrect: true,
            explanation: 'Đúng: $A = 0 \\Leftrightarrow \\sqrt{x} + 1 = 0 \\Leftrightarrow \\sqrt{x} = -1$ (vô lý).'
          }
        ],
        explanation: 'a - Đúng, b - Đúng, c - Sai, d - Đúng. Điểm: đúng 1 ý 0.1đ; 2 ý 0.25đ; 3 ý 0.5đ; 4 ý 1.0đ.',
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },

      // PHẦN III: 2 CÂU TRẢ LỜI NGẮN (1.0 điểm, 0.5đ/câu)
      {
        id: 'q9m1-14',
        number: 14,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Tính giá trị của biểu thức: $P = \\sqrt{7 - 4\\sqrt{3}} + \\sqrt{3}$. Điền kết quả số vào ô đáp án.',
        formula: 'P = \\sqrt{(2 - \\sqrt{3})^2} + \\sqrt{3}',
        correctShortAnswer: '2',
        acceptedAnswers: ['2'],
        explanation: '$\\sqrt{(2 - \\sqrt{3})^2} + \\sqrt{3} = (2 - \\sqrt{3}) + \\sqrt{3} = 2$.',
        points: 0.5,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9m1-15',
        number: 15,
        section: 'III',
        sectionTitle: 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 câu - 1,0 điểm)',
        questionType: 'short_answer',
        questionText: 'Cho tam giác $ABC$ vuông tại $A$, có đường cao $AH = 12\\text{ cm}$ và $HC = 16\\text{ cm}$. Tính độ dài đoạn thẳng $BH$ theo đơn vị cm. (Chỉ điền số)',
        formula: 'AH^2 = BH \\cdot HC',
        correctShortAnswer: '9',
        acceptedAnswers: ['9', '9cm'],
        explanation: 'Áp dụng hệ thức lượng $AH^2 = BH \\cdot HC \\Rightarrow BH = \\frac{12^2}{16} = \\frac{144}{16} = 9\\text{ cm}$.',
        points: 0.5,
        level: 'van_dung',
        topic: 'geometry'
      },

      // PHẦN IV: 5 CÂU TỰ LUẬN (5.0 điểm, 1.0đ/câu)
      {
        id: 'q9m1-16',
        number: 16,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Rút gọn các biểu thức sau: \n\na) $A = 2\\sqrt{48} - 3\\sqrt{75} + \\frac{1}{2}\\sqrt{108}$ \n\nb) $B = \\frac{\\sqrt{15} - \\sqrt{5}}{\\sqrt{3} - 1} + \\frac{6}{\\sqrt{5} + \\sqrt{2}}$',
        formula: '2\\sqrt{48} - 3\\sqrt{75} + \\frac{1}{2}\\sqrt{108}',
        explanation: 'a) $2(4\\sqrt{3}) - 3(5\\sqrt{3}) + 3\\sqrt{3} = 8\\sqrt{3} - 15\\sqrt{3} + 3\\sqrt{3} = -4\\sqrt{3}$.\nb) $\\frac{\\sqrt{5}(\\sqrt{3} - 1)}{\\sqrt{3} - 1} + \\frac{6(\\sqrt{5} - \\sqrt{2})}{3} = \\sqrt{5} + 2\\sqrt{5} - 2\\sqrt{2} = 3\\sqrt{5} - 2\\sqrt{2}$.',
        sampleSolution: 'a) $A = 2\\sqrt{16 \\cdot 3} - 3\\sqrt{25 \\cdot 3} + \\frac{1}{2}\\sqrt{36 \\cdot 3} = 8\\sqrt{3} - 15\\sqrt{3} + 3\\sqrt{3} = -4\\sqrt{3}$.\n\nb) $B = \\frac{\\sqrt{5}(\\sqrt{3} - 1)}{\\sqrt{3} - 1} + \\frac{6(\\sqrt{5} - \\sqrt{2})}{(\\sqrt{5} + \\sqrt{2})(\\sqrt{5} - \\sqrt{2})}$\n$B = \\sqrt{5} + \\frac{6(\\sqrt{5} - \\sqrt{2})}{3} = \\sqrt{5} + 2\\sqrt{5} - 2\\sqrt{2} = 3\\sqrt{5} - 2\\sqrt{2}$.',
        rubric: [
          { step: 'Ý a: Đưa thừa số ra ngoài căn và rút gọn ra -4√3', points: 0.5 },
          { step: 'Ý b: Rút gọn nhân tử chung và trục căn thức ra 3√5 - 2√2', points: 0.5 }
        ],
        points: 1.0,
        level: 'thong_hieu',
        topic: 'algebra'
      },
      {
        id: 'q9m1-17',
        number: 17,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Giải phương trình vô tỉ: \n\na) $\\sqrt{4x - 20} + 3\\sqrt{\\frac{x - 5}{9}} - \\frac{1}{3}\\sqrt{9x - 45} = 4$ \n\nb) $\\sqrt{x^2 - 4x + 4} = 2x - 1$',
        formula: '\\sqrt{4x - 20} + 3\\sqrt{\\frac{x - 5}{9}} - \\frac{1}{3}\\sqrt{9x - 45} = 4',
        explanation: 'a) ĐK: $x \\ge 5$. $2\\sqrt{x - 5} + \\sqrt{x - 5} - \\sqrt{x - 5} = 4 \\Leftrightarrow 2\\sqrt{x - 5} = 4 \\Rightarrow x - 5 = 4 \\Rightarrow x = 9$.\nb) $|x - 2| = 2x - 1$ (ĐK: $x \\ge 1/2$). TH1: $x \\ge 2 \\Rightarrow x - 2 = 2x - 1 \\Rightarrow x = -1$ (loại). TH2: $1/2 \\le x < 2 \\Rightarrow 2 - x = 2x - 1 \\Rightarrow 3x = 3 \\Rightarrow x = 1$ (thỏa mãn).',
        sampleSolution: 'a) Điều kiện: $x \\ge 5$.\nPhương trình tương đương:\n$2\\sqrt{x - 5} + 3 \\cdot \\frac{\\sqrt{x - 5}}{3} - \\frac{1}{3} \\cdot 3\\sqrt{x - 5} = 4$\n$2\\sqrt{x - 5} + \\sqrt{x - 5} - \\sqrt{x - 5} = 4$\n$2\\sqrt{x - 5} = 4 \\Leftrightarrow \\sqrt{x - 5} = 2 \\Leftrightarrow x - 5 = 4 \\Leftrightarrow x = 9$ (thỏa mãn).\n\nb) Điều kiện để có nghiệm: $2x - 1 \\ge 0 \\Leftrightarrow x \\ge \\frac{1}{2}$.\nPhương trình tương đương: $|x - 2| = 2x - 1$.\n- TH 1: Với $x \\ge 2$: $x - 2 = 2x - 1 \\Rightarrow x = -1$ (loại do không thỏa mãn $x \\ge 2$).\n- TH 2: Với $\\frac{1}{2} \\le x < 2$: $2 - x = 2x - 1 \\Rightarrow 3x = 3 \\Rightarrow x = 1$ (thỏa mãn).\nVậy nghiệm là $x = 1$.',
        rubric: [
          { step: 'Ý a: Đặt điều kiện và giải đúng x = 9', points: 0.5 },
          { step: 'Ý b: Đặt điều kiện vế phải, giải phá trị tuyệt đối ra x = 1', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'algebra'
      },
      {
        id: 'q9m1-18',
        number: 18,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho hai biểu thức: $P = \\frac{\\sqrt{x} + 2}{\\sqrt{x} - 2}$ và $Q = \\frac{\\sqrt{x}}{\\sqrt{x} + 2} + \\frac{4\\sqrt{x}}{x - 4}$ với $x \\ge 0, x \\ne 4$. \n\na) Rút gọn biểu thức $Q$. \n\nb) Đặt $M = \\frac{Q}{P}$. Tìm $x$ để $M < \\frac{1}{2}$.',
        formula: 'Q = \\frac{\\sqrt{x}}{\\sqrt{x} + 2} + \\frac{4\\sqrt{x}}{x - 4}',
        explanation: 'a) $Q = \\frac{\\sqrt{x}(\\sqrt{x} - 2) + 4\\sqrt{x}}{x - 4} = \\frac{x + 2\\sqrt{x}}{x - 4} = \\frac{\\sqrt{x}(\\sqrt{x} + 2)}{(\\sqrt{x} + 2)(\\sqrt{x} - 2)} = \\frac{\\sqrt{x}}{\\sqrt{x} - 2}$.\nb) $M = Q/P = \\frac{\\sqrt{x}}{\\sqrt{x} + 2} < \\frac{1}{2} \\Leftrightarrow 2\\sqrt{x} < \\sqrt{x} + 2 \\Leftrightarrow \\sqrt{x} < 2 \\Leftrightarrow 0 \\le x < 4$.',
        sampleSolution: 'a) Với $x \\ge 0, x \\ne 4$:\n$Q = \\frac{\\sqrt{x}(\\sqrt{x} - 2) + 4\\sqrt{x}}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{x - 2\\sqrt{x} + 4\\sqrt{x}}{x - 4} = \\frac{x + 2\\sqrt{x}}{x - 4}$\n$Q = \\frac{\\sqrt{x}(\\sqrt{x} + 2)}{(\\sqrt{x} - 2)(\\sqrt{x} + 2)} = \\frac{\\sqrt{x}}{\\sqrt{x} - 2}$.\n\nb) $M = \\frac{Q}{P} = \\frac{\\sqrt{x}}{\\sqrt{x} - 2} : \\frac{\\sqrt{x} + 2}{\\sqrt{x} - 2} = \\frac{\\sqrt{x}}{\\sqrt{x} + 2}$.\nĐể $M < \\frac{1}{2} \\Leftrightarrow \\frac{\\sqrt{x}}{\\sqrt{x} + 2} < \\frac{1}{2} \\Leftrightarrow 2\\sqrt{x} < \\sqrt{x} + 2$ (do $\\sqrt{x} + 2 > 0$)\n$\\Leftrightarrow \\sqrt{x} < 2 \\Leftrightarrow x < 4$.\nKết hợp điều kiện $x \\ge 0$, ta được: $0 \\le x < 4$.',
        rubric: [
          { step: 'Ý a: Quy đồng rút gọn đúng Q = √x / (√x - 2)', points: 0.5 },
          { step: 'Ý b: Lập bất đẳng thức M < 1/2 và tìm ra 0 ≤ x < 4', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'algebra'
      },
      {
        id: 'q9m1-19',
        number: 19,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Vẽ đường tròn $(A; AH)$. Kẻ các tiếp tuyến $BD$ và $CE$ với đường tròn $(A)$ ($D, E$ là các tiếp điểm không trùng với $H$). \n\na) Chứng minh ba điểm $D, A, E$ thẳng hàng. \n\nb) Chứng minh $DE$ tiếp xúc với đường tròn đường kính $BC$.',
        explanation: 'a) $AD \\perp BD, AE \\perp CE$. Vì $BD, BH$ là 2 tiếp tuyến nên $AB$ là phân giác $\\widehat{HAD}$; tương tự $AC$ là phân giác $\\widehat{HAE}$. Tổng góc $\\widehat{DAE} = 2(\\widehat{HAB} + \\widehat{HAC}) = 2 \\times 90^\\circ = 180^\\circ \\Rightarrow D, A, E$ thẳng hàng.\nb) Gọi $M$ là trung điểm $BC$, $AM = BC/2$. Ta có $AM \\perp DE$ tại $A$ và $A$ thuộc đường tròn $(M; BC/2)$ nên $DE$ tiếp xúc đường tròn đường kính $BC$.',
        sampleSolution: 'a) Vì $BD, BH$ là hai tiếp tuyến của đường tròn $(A; AH)$ cắt nhau tại $B$ nên $AB$ là tia phân giác của góc $\\widehat{DAH}$:\n$\\Rightarrow \\widehat{DAH} = 2\\widehat{BAH}$.\n\nTương tự, $CE, CH$ là hai tiếp tuyến cắt nhau tại $C$ nên $AC$ là tia phân giác của góc $\\widehat{EAH}$:\n$\\Rightarrow \\widehat{EAH} = 2\\widehat{CAH}$.\n\nDo đó:\n$\\widehat{DAE} = \\widehat{DAH} + \\widehat{EAH} = 2(\\widehat{BAH} + \\widehat{CAH}) = 2 \\cdot 90^\\circ = 180^\\circ$.\nVậy ba điểm $D, A, E$ thẳng hàng (đpcm).\n\nb) Gọi $M$ là trung điểm cạnh huyền $BC$. Đường tròn đường kính $BC$ có tâm là $M$ và bán kính $R_M = \\frac{BC}{2} = AM$ (tính chất trung tuyến tam giác vuông).\nVì $BD \\parallel CE$ (cùng vuông góc $DE$) nên tứ giác $BDEC$ là hình thang vuông.\nĐoạn nối tâm $MA$ là đường trung bình của hình thang $BDEC$ nên $MA \\perp DE$ tại $A$.\nVì $A \\in (M; BC/2)$ và $DE \\perp MA$ tại $A$ nên $DE$ là tiếp tuyến của đường tròn đường kính $BC$ (đpcm).',
        rubric: [
          { step: 'Ý a: Dùng tính chất hai tiếp tuyến cắt nhau chứng minh góc DAE = 180°', points: 0.5 },
          { step: 'Ý b: Chứng minh MA vuông góc DE và suy ra tính tiếp xúc', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung',
        topic: 'geometry'
      },
      {
        id: 'q9m1-20',
        number: 20,
        section: 'IV',
        sectionTitle: 'PHẦN IV. TỰ LUẬN (5 câu - 5,0 điểm)',
        questionType: 'essay',
        questionText: 'Cho $x, y$ là các số thực dương thỏa mãn $x + y \\le 2$. Tìm giá trị nhỏ nhất của biểu thức: \n\n$P = \\frac{1}{x^2 + y^2} + \\frac{2}{xy} + 4xy$',
        formula: 'P = \\frac{1}{x^2 + y^2} + \\frac{2}{xy} + 4xy',
        explanation: 'Tách $P = \\left(\\frac{1}{x^2 + y^2} + \\frac{1}{2xy}\\right) + \\left(\\frac{1}{4xy} + 4xy\\right) + \\frac{5}{4xy}$. Áp dụng BĐT Cauchy-Schwarz và AM-GM: $\\frac{1}{x^2+y^2} + \\frac{1}{2xy} \\ge \\frac{4}{(x+y)^2} \\ge 1$. $\\frac{1}{4xy} + 4xy \\ge 2$. $\\frac{5}{4xy} \\ge \\frac{5}{(x+y)^2} \\ge \\frac{5}{4}$. Vậy $\\min P = 1 + 2 + 5/4 = 17/4$ khi $x = y = 1$.',
        sampleSolution: 'Ta có biểu thức $P$ viết lại như sau:\n$P = \\left(\\frac{1}{x^2 + y^2} + \\frac{1}{2xy}\\right) + \\left(\\frac{1}{4xy} + 4xy\\right) + \\frac{5}{4xy}$.\n\nÁp dụng bất đẳng thức $\\frac{1}{A} + \\frac{1}{B} \\ge \\frac{4}{A + B}$ với $A = x^2 + y^2, B = 2xy$:\n$\\frac{1}{x^2 + y^2} + \\frac{1}{2xy} \\ge \\frac{4}{(x + y)^2} \\ge \\frac{4}{2^2} = 1$.\n\nÁp dụng bất đẳng thức Cô-si (AM-GM) cho hai số dương:\n$\\frac{1}{4xy} + 4xy \\ge 2\\sqrt{\\frac{1}{4xy} \\cdot 4xy} = 2$.\n\nLại có $xy \\le \\frac{(x + y)^2}{4} \\le \\frac{2^2}{4} = 1 \\Rightarrow \\frac{5}{4xy} \\ge \\frac{5}{4 \\cdot 1} = \\frac{5}{4}$.\n\nCộng vế với vế của ba bất đẳng thức trên:\n$P \\ge 1 + 2 + \\frac{5}{4} = \\frac{17}{4}$.\n\nDấu "=" xảy ra khi và chỉ khi $x = y = 1$.\nVậy giá trị nhỏ nhất của $P$ là $\\frac{17}{4}$ khi $x = y = 1$.',
        rubric: [
          { step: 'Kỹ thuật tách điểm rơi thành 3 nhóm theo BĐT Cauchy-Schwarz và AM-GM', points: 0.5 },
          { step: 'Đánh giá chính xác từng nhóm và kết luận min P = 17/4 khi x = y = 1', points: 0.5 }
        ],
        points: 1.0,
        level: 'van_dung_cao',
        topic: 'algebra'
      }
    ]
  }
];
