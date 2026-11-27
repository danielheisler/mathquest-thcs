import { GradeLevel } from '../types/math';

export type LessonPlanStatus = 'draft' | 'approved' | 'taught';

export interface LessonActivityStep {
  id: string;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string; // VD: Hoạt động 1: Khởi động
  durationMinutes: number;
  objective: string;
  content: string;
  expectedProduct: string;
  implementationSteps: {
    assignTask: string; // Bước 1: Chuyển giao nhiệm vụ
    studentWork: string; // Bước 2: Thực hiện nhiệm vụ
    reportDiscuss: string; // Bước 3: Báo cáo, thảo luận
    teacherConclusion: string; // Bước 4: Kết luận, nhận định
  };
  boardNotes?: string; // Ghi bảng trọng tâm
}

export interface LessonPlan {
  id: string;
  grade: GradeLevel;
  semester: 'HK1' | 'HK2';
  weekNumber: number; // Tuần theo PPCT (1..35)
  periodRange: string; // VD: "Tiết 12 - 13"
  durationMinutes: number; // 45 hoặc 90
  chapterName: string;
  title: string;
  textbookSeries: string;
  teacherName: string;
  status: LessonPlanStatus;
  updatedAt: string;
  objectives: {
    knowledge: string[];
    competencies: string[];
    qualities: string[];
  };
  teachingAids: {
    teacher: string[];
    student: string[];
  };
  activities: LessonActivityStep[];
  homeworkAssignment: string;
  reflectionNotes: string;
}

export const LESSON_PLANS_STORAGE_KEY = 'mathquest_lesson_plans_v2_gdpt2018';

export const initialLessonPlans: LessonPlan[] = [
  // =========================================================================
  // TOÁN 6 - CT GDPT 2018 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'lp-g6-w4-prime',
    grade: 6,
    semester: 'HK1',
    weekNumber: 4,
    periodRange: 'Tiết 10 - 11',
    durationMinutes: 90,
    chapterName: 'Chương II. Tính chia hết trong tập hợp các số tự nhiên',
    title: 'Bài 10: Số nguyên tố. Hợp số. Phân tích một số ra thừa số nguyên tố',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'taught',
    updatedAt: '24/10/2026',
    objectives: {
      knowledge: [
        'Nhận biết được khái niệm số nguyên tố và hợp số dựa trên số lượng ước của một số tự nhiên lớn hơn 1.',
        'Hiểu được số 0 và số 1 không là số nguyên tố và cũng không là hợp số.',
        'Biết cách phân tích một số tự nhiên lớn hơn 1 ra thừa số nguyên tố (theo sơ đồ cây và sơ đồ cột dọc).',
      ],
      competencies: [
        'Tư duy và lập luận toán học: giải thích được vì sao một số là số nguyên tố hay hợp số.',
        'Giải quyết vấn đề toán học: vận dụng dấu hiệu chia hết cho 2, 3, 5, 9 để phân tích số ra thừa số nguyên tố nhanh và chính xác.',
        'Hợp tác nhóm trong trò chơi tiếp sức phân tích số và thi đấu trên MathQuest.',
      ],
      qualities: [
        'Chăm chỉ, cẩn thận khi kiểm tra ước và trình bày phép chia theo cột dọc.',
        'Trung thực khi tự chấm và báo cáo kết quả làm việc nhóm.',
      ],
    },
    teachingAids: {
      teacher: [
        'Máy chiếu, bảng phụ sàng Eratosthenes (các số từ 2 đến 50).',
        'Phiếu học tập số 1 (tìm ước), Phiếu học tập số 2 (phân tích số 60, 84, 120).',
        'Trò chơi khởi động trên MathQuest THCS (Chế độ Đố Vui Vận Động / Tốc độ).',
      ],
      student: [
        'SGK Toán 6 Tập 1 (GDPT 2018), vở ghi, bảng con, bút dạ.',
        'Ôn lại các dấu hiệu chia hết cho 2, 3, 5, 9 đã học ở tiết trước.',
      ],
    },
    activities: [
      {
        id: 'lp6-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Tìm ước & phân nhóm số)',
        durationMinutes: 8,
        objective: 'Tạo tâm thế hứng thú, ôn lại cách tìm ước và phát hiện sự khác biệt về số lượng ước.',
        content: 'Học sinh thi đua tìm tất cả các ước của các số: 2, 3, 4, 5, 6, 7, 8, 9 trên bảng con.',
        expectedProduct: 'Bảng liệt kê tập hợp ước: Ư(2)={1;2}, Ư(4)={1;2;4}, Ư(7)={1;7}, Ư(9)={1;3;9}...',
        implementationSteps: {
          assignTask: 'GV chia lớp làm 4 tổ, phát bảng phụ yêu cầu trong 3 phút liệt kê tất cả các ước của các số từ 2 đến 9.',
          studentWork: 'HS thảo luận theo bàn, sử dụng phép chia thử để tìm đầy đủ ước của từng số.',
          reportDiscuss: 'Đại diện 2 tổ gắn bảng lên bảng chính; các tổ khác đối chiếu, nhận xét xem có thiếu ước nào không.',
          teacherConclusion: 'GV dẫn dắt: Có những số chỉ có đúng 2 ước (1 và chính nó), có những số có nhiều hơn 2 ước. Đó chính là Số nguyên tố và Hợp số.',
        },
        boardNotes: 'Nhóm A (chỉ có 2 ước): 2, 3, 5, 7\nNhóm B (nhiều hơn 2 ước): 4, 6, 8, 9',
      },
      {
        id: 'lp6-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Hình thành kiến thức mới',
        durationMinutes: 35,
        objective: 'Hình thành định nghĩa số nguyên tố, hợp số và quy trình phân tích một số ra thừa số nguyên tố.',
        content: '1. Khái niệm số nguyên tố và hợp số (lưu ý đặc biệt số 0 và số 1).\n2. Thực hành sàng Eratosthenes tìm các số nguyên tố < 50.\n3. Phân tích số 24 và 60 ra thừa số nguyên tố bằng sơ đồ cây và cột dọc.',
        expectedProduct: 'Phát biểu chuẩn xác khái niệm; danh sách các số nguyên tố nhỏ hơn 20 (2, 3, 5, 7, 11, 13, 17, 19); kết quả 24 = 2³·3, 60 = 2²·3·5.',
        implementationSteps: {
          assignTask: 'GV giao Phiếu học tập số 1 (Sàng Eratosthenes) và hướng dẫn mẫu cách chia theo cột dọc cho số 24.',
          studentWork: 'HS gạch bỏ bội của 2, 3, 5, 7 trên lưới số từ 2 đến 50; thực hành phân tích 60 theo 2 cách (cây & cột dọc).',
          reportDiscuss: '2 HS lên bảng trình bày hai sơ đồ khác nhau cho số 60; cả lớp so sánh kết quả cuối cùng.',
          teacherConclusion: 'GV chốt kiến thức: Dù phân tích bằng cách nào, kết quả cuối cùng đều duy nhất (viết gọn bằng lũy thừa theo thứ tự thừa số tăng dần).',
        },
        boardNotes: '• Số nguyên tố: > 1, chỉ có 2 ước (1 và chính nó).\n• Hợp số: > 1, có nhiều hơn 2 ước.\n• Số 0 và 1: không là SNT, không là hợp số.\n• 60 = 2² · 3 · 5',
      },
      {
        id: 'lp6-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập tại lớp',
        durationMinutes: 32,
        objective: 'Rèn kỹ năng nhận diện số nguyên tố và phân tích thành thạo các số có 2–3 chữ số.',
        content: 'Bài 1: Khẳng định Đúng/Sai (2 là SNT chẵn duy nhất; mọi số lẻ đều là SNT? -> Sai với 9, 15...).\nBài 2: Phân tích ra TSNT các số: 45, 78, 120, 270.',
        expectedProduct: '45 = 3²·5; 78 = 2·3·13; 120 = 2³·3·5; 270 = 2·3³·5.',
        implementationSteps: {
          assignTask: 'GV chiếu câu hỏi Đúng/Sai kết hợp game Nghiêng Người trên MathQuest, sau đó giao 4 câu phân tích số làm cá nhân vào vở.',
          studentWork: 'HS tham gia phản xạ nhanh câu Đúng/Sai, rồi tự giải 4 bài phân tích trong 10 phút.',
          reportDiscuss: 'GV gọi 4 HS trung bình/khá lên bảng trình bày; kiểm tra vở 5 HS ngồi đầu bàn.',
          teacherConclusion: 'GV sửa lỗi sai hay gặp: học sinh hay dừng lại ở thừa số là hợp số (ví dụ viết 45 = 9·5 mà quên tách 9 = 3²).',
        },
        boardNotes: 'Lưu ý: Chỉ dừng chia cột dọc khi thương bằng 1; mọi thừa số phải là số nguyên tố.',
      },
      {
        id: 'lp6-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng & Dặn dò',
        durationMinutes: 15,
        objective: 'Vận dụng phân tích thừa số nguyên tố vào bài toán thực tế chia nhóm đều nhau.',
        content: 'Bài toán thực tế: Lớp 6A1 có 36 học sinh, cô muốn xếp thành các hàng đều nhau (mỗi hàng > 2 bạn và < 15 bạn). Có những cách xếp nào?',
        expectedProduct: 'Tìm các ước của 36 (từ 36 = 2²·3²) thỏa mãn điều kiện: 3, 4, 6, 9, 12 hàng.',
        implementationSteps: {
          assignTask: 'GV nêu tình huống thực tế của chính lớp 6A1, gợi ý dùng dạng phân tích 36 = 2²·3² để liệt kê đủ ước.',
          studentWork: 'HS làm việc theo cặp đôi trong 5 phút, tìm tất cả các phương án xếp hàng.',
          reportDiscuss: 'Đại diện 1 cặp trình bày, các nhóm khác bổ sung nếu thiếu phương án.',
          teacherConclusion: 'GV tổng kết tiết học, giao BTVN trên MathQuest (Mã lớp 20112002) và dặn xem trước bài Ước chung lớn nhất.',
        },
      },
    ],
    homeworkAssignment: 'Làm 6 câu trắc nghiệm BTVN phần Số học trên MathQuest (Mã 20112002) + Bài tập SGK Toán 6: 2.18, 2.20, 2.22.',
    reflectionNotes: '85% HS phân tích đúng bằng cột dọc sau khi nhắc kỹ chỉ chia cho các số nguyên tố 2, 3, 5, 7, 11. Một số em còn nhầm số 1 là số nguyên tố -> cần ôn lại đầu tiết 12.',
  },
  {
    id: 'lp-g6-w14-quad-area',
    grade: 6,
    semester: 'HK1',
    weekNumber: 14,
    periodRange: 'Tiết 27 - 28',
    durationMinutes: 90,
    chapterName: 'Chương IV. Một số hình phẳng trong thực tiễn',
    title: 'Bài 20: Chu vi và diện tích của một số tứ giác đã học',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '27/10/2026',
    objectives: {
      knowledge: [
        'Nhận biết và viết đúng công thức tính chu vi, diện tích hình vuông, hình chữ nhật, hình thang cân, hình bình hành, hình thoi.',
        'Giải quyết được các bài toán thực tiễn về lát gạch, rào vườn, đo diện tích mảnh đất bằng cách chia ghép hình.',
      ],
      competencies: [
        'Mô hình hóa toán học: chuyển đổi sơ đồ sân trường, thửa ruộng về các hình phẳng quen thuộc.',
        'Sử dụng công cụ tương tác trực quan trên MathQuest để kiểm chứng sự phụ thuộc diện tích vào đáy và chiều cao.',
      ],
      qualities: [
        'Cẩn thận khi đổi đơn vị đo độ dài và diện tích (cm, m, m²).',
      ],
    },
    teachingAids: {
      teacher: ['Mô phỏng Hình học trực quan Lớp 6 trên MathQuest THCS, giấy kẻ ô vuông.'],
      student: ['SGK Toán 6 Tập 1 (GDPT 2018), thước kẻ, ê-ke, kéo cắt hình ghép.'],
    },
    activities: [
      {
        id: 'lp6q-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Ôn nhanh công thức Tiểu học)',
        durationMinutes: 8,
        objective: 'Ôn lại chu vi và diện tích hình vuông, hình chữ nhật, hình thang.',
        content: 'Trò chơi nối nhanh hình phẳng với công thức tương ứng trên màn chiếu.',
        expectedProduct: 'HS nhớ lại S = a², S = a·b, S = ½(a + b)·h.',
        implementationSteps: {
          assignTask: 'GV chiếu 4 hình vẽ trên bảng, mời 4 nhóm giơ thẻ công thức tương ứng.',
          studentWork: 'HS thảo luận 2 phút và giơ thẻ.',
          reportDiscuss: 'Lớp kiểm tra đáp án và nhắc lại điều kiện cùng đơn vị đo.',
          teacherConclusion: 'GV dẫn vào 2 công thức mới ở lớp 6: diện tích hình bình hành và hình thoi.',
        },
      },
      {
        id: 'lp6q-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Hình thành công thức diện tích Hình bình hành & Hình thoi',
        durationMinutes: 35,
        objective: 'HS tự cắt ghép hình bình hành thành hình chữ nhật và hình thoi thành 2 tam giác/hình chữ nhật.',
        content: '1. Cắt ghép hình bình hành đáy a, chiều cao h -> S = a · h.\n2. Cắt ghép hình thoi hai đường chéo d₁, d₂ -> S = ½ · d₁ · d₂.',
        expectedProduct: 'Hệ thống 5 công thức chuẩn chu vi và diện tích tứ giác lớp 6.',
        implementationSteps: {
          assignTask: 'GV phát giấy kẻ ô cho các nhóm cắt tam giác vuông bên trái của hình bình hành ghép sang bên phải.',
          studentWork: 'HS thao tác cắt ghép và dùng mô phỏng Lớp 6 trên MathQuest thay đổi a, h, d₁, d₂.',
          reportDiscuss: 'Đại diện nhóm nêu nhận xét về diện tích trước và sau khi cắt ghép.',
          teacherConclusion: 'GV chốt công thức đóng khung trên bảng.',
        },
        boardNotes: '• Hình bình hành: C = 2(a + b); S = a · h\n• Hình thoi: C = 4a; S = ½ · d₁ · d₂\n• Hình thang cân: S = ½(a + b) · h',
      },
      {
        id: 'lp6q-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập tính diện tích hình ghép thực tiễn',
        durationMinutes: 32,
        objective: 'Thành thạo tính diện tích khu vườn hình chữ L hoặc lối đi hình bình hành.',
        content: 'Tính diện tích mảnh sân hình chữ nhật 12m × 8m có bồn hoa hình thoi ở giữa với hai đường chéo 4m và 3m.',
        expectedProduct: 'S_sân = 96 m², S_bồn_hoa = 6 m², phần lát gạch = 90 m².',
        implementationSteps: {
          assignTask: 'GV chiếu sơ đồ mảnh sân và giao bài làm cá nhân.',
          studentWork: 'HS trình bày đầy đủ lời giải có đơn vị.',
          reportDiscuss: '2 HS chữa bài trên bảng theo 2 cách chia hình khác nhau.',
          teacherConclusion: 'GV lưu ý viết rõ đơn vị cm² hoặc m² ở đáp số.',
        },
      },
      {
        id: 'lp6q-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng & Giao nhiệm vụ về nhà',
        durationMinutes: 15,
        objective: 'Tính số viên gạch lát nền phòng học thực tế.',
        content: 'Tính chi phí lát gạch vuông cạnh 40 cm cho phần sân 90 m².',
        expectedProduct: 'Đổi 40 cm = 0,4 m -> diện tích 1 viên = 0,16 m² -> cần 563 viên.',
        implementationSteps: {
          assignTask: 'GV hướng dẫn đổi đơn vị từ cm sang m trước khi chia.',
          studentWork: 'HS tính nhanh theo cặp đôi.',
          reportDiscuss: 'Cả lớp chốt đáp án và ý nghĩa thực tiễn.',
          teacherConclusion: 'GV giao BTVN trên MathQuest (Mã 20112002).',
        },
      },
    ],
    homeworkAssignment: 'Làm bài tập 4.16 – 4.22 SGK Toán 6 Tập 1 (KNTT 2018) + Thực hành mô phỏng Hình phẳng Lớp 6 trên MathQuest.',
    reflectionNotes: 'HS rất hứng thú khi tự kéo thanh trượt đáy và chiều cao để thấy diện tích hình bình hành và hình thoi thay đổi.',
  },

  // =========================================================================
  // TOÁN 7 - CT GDPT 2018 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'lp-g7-w12-triangle',
    grade: 7,
    semester: 'HK1',
    weekNumber: 12,
    periodRange: 'Tiết 23 - 24',
    durationMinutes: 90,
    chapterName: 'Chương IV. Tam giác bằng nhau',
    title: 'Bài 13: Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất (c.c.c)',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '26/10/2026',
    objectives: {
      knowledge: [
        'Nhận biết được định nghĩa hai tam giác bằng nhau (các cạnh tương ứng bằng nhau, các góc tương ứng bằng nhau) và viết đúng ký hiệu đỉnh tương ứng.',
        'Phát biểu và vẽ hình minh họa được định lí trường hợp bằng nhau cạnh - cạnh - cạnh (c.c.c).',
        'Biết vận dụng trường hợp c.c.c để chứng minh hai tam giác bằng nhau và suy ra các góc tương ứng bằng nhau.',
      ],
      competencies: [
        'Năng lực mô hình hóa & sử dụng công cụ toán học: sử dụng thành thạo thước thẳng và compa để dựng tam giác biết độ dài 3 cạnh.',
        'Năng lực tư duy lập luận: trình bày bài chứng minh hình học mạch lạc theo cấu trúc (Xét tam giác..., có 3 yếu tố cạnh -> kết luận c.c.c).',
      ],
      qualities: [
        'Cẩn thận, chính xác khi đo vẽ hình học bằng thước và compa.',
        'Tích cực hợp tác khi kiểm chứng chồng khít hai tam giác cắt giấy.',
      ],
    },
    teachingAids: {
      teacher: [
        'Compa gỗ lớn, thước thẳng, ê-ke, giấy bìa màu cắt sẵn 2 tam giác bằng nhau.',
        'Slide minh họa viết đúng thứ tự đỉnh tương ứng khi ký hiệu △ABC = △DEF.',
      ],
      student: [
        'SGK Toán 7 Tập 1 (GDPT 2018), compa, thước thẳng có chia vạch mm, kéo thủ công.',
      ],
    },
    activities: [
      {
        id: 'lp7-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Trải nghiệm cắt giấy)',
        durationMinutes: 8,
        objective: 'HS trực quan nhận biết hai hình tam giác chồng khít lên nhau.',
        content: 'HS gấp đôi tờ giấy, cắt một hình tam giác bất kỳ để thu được 2 tam giác chồng khít hoàn toàn.',
        expectedProduct: '2 tam giác bằng giấy có các cạnh và góc chồng khít lên nhau.',
        implementationSteps: {
          assignTask: 'GV hướng dẫn HS gấp đôi tờ giấy màu và cắt một tam giác tùy ý, đặt tên đỉnh lần lượt A, B, C và A\', B\', C\'.',
          studentWork: 'HS thực hành cắt và đặt thử chồng lên nhau, đo lại các cạnh và góc tương ứng.',
          reportDiscuss: 'HS nhận xét về độ dài các cặp cạnh và số đo các cặp góc khi đặt chồng khít.',
          teacherConclusion: 'GV giới thiệu: Khi hai tam giác có 3 cặp cạnh bằng nhau và 3 cặp góc bằng nhau như vậy, ta gọi đó là hai tam giác bằng nhau.',
        },
      },
      {
        id: 'lp7-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Định nghĩa & Trường hợp bằng nhau c.c.c',
        durationMinutes: 37,
        objective: 'Nắm chắc quy tắc viết đúng thứ tự đỉnh tương ứng và sử dụng compa dựng tam giác kiểm chứng c.c.c.',
        content: '1. Định nghĩa và ký hiệu △ABC = △A\'B\'C\'.\n2. Thực hành dùng thước & compa vẽ △ABC và △A\'B\'C\' đều có cạnh 4cm, 5cm, 6cm rồi đo góc kiểm tra.',
        expectedProduct: 'Bản vẽ hình chính xác trong vở và phát biểu định lí c.c.c.',
        implementationSteps: {
          assignTask: 'GV làm mẫu bước dựng tam giác có 3 cạnh 4cm, 5cm, 6cm bằng compa trên bảng; yêu cầu HS vẽ vào vở và dùng thước đo góc kiểm chứng.',
          studentWork: 'HS tự vẽ 2 tam giác bằng thước và compa, đo các góc tương ứng và đối chiếu với bạn bên cạnh.',
          reportDiscuss: '2 HS đọc kết quả đo góc; cả lớp nhận thấy hai tam giác tự động có các góc tương ứng bằng nhau.',
          teacherConclusion: 'GV chốt Định lí (c.c.c): Nếu 3 cạnh của tam giác này bằng 3 cạnh của tam giác kia thì hai tam giác đó bằng nhau.',
        },
        boardNotes: '△ABC = △DEF ⇔ AB=DE, BC=EF, AC=DF và ∠A=∠D, ∠B=∠E, ∠C=∠F\n(Chú ý viết đúng thứ tự đỉnh tương ứng!)',
      },
      {
        id: 'lp7-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập chứng minh hình học',
        durationMinutes: 35,
        objective: 'Hình thành mẫu trình bày chứng minh hai tam giác bằng nhau theo 3 dòng chuẩn.',
        content: 'Bài 1: Cho tứ giác ABCD có AB = CD, AD = BC. Chứng minh △ABC = △CDA.\nBài 2: Chứng minh tia phân giác (AB = AC, MB = MC => △ABM = △ACM).',
        expectedProduct: 'Bài chứng minh đầy đủ 3 điều kiện (cạnh chung + 2 cặp cạnh bằng nhau theo giả thiết).',
        implementationSteps: {
          assignTask: 'GV hướng dẫn cách nhìn hình tìm "cạnh chung", viết mẫu bài 1 rồi yêu cầu HS tự trình bày bài 2.',
          studentWork: 'HS vẽ hình bài 2 vào vở, đánh dấu các đoạn thẳng bằng nhau bằng ký hiệu giống nhau rồi chứng minh.',
          reportDiscuss: '1 HS lên bảng trình bày bài 2; lớp nhận xét thứ tự đỉnh trong ký hiệu △ABM = △ACM.',
          teacherConclusion: 'GV nhấn mạnh mẹo không viết sai đỉnh: Ghép cặp đỉnh đối diện với các cặp cạnh bằng nhau.',
        },
      },
      {
        id: 'lp7-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng thực tế & Giao bài về nhà',
        durationMinutes: 10,
        objective: 'Giải thích vì sao giàn mái nhà, cầu sắt, giá đỡ thường ghép thành hình tam giác.',
        content: 'Liên hệ tính cứng vững của tam giác (do 3 cạnh cố định xác định duy nhất một tam giác theo c.c.c).',
        expectedProduct: 'HS giải thích được ứng dụng kết cấu tam giác trong xây dựng.',
        implementationSteps: {
          assignTask: 'GV chiếu ảnh cầu thép/khung xe đạp và đặt câu hỏi: Vì sao người ta không ghép khung hình chữ nhật mà hay chia thành các tam giác?',
          studentWork: 'HS suy nghĩ nhanh và trả lời theo cặp.',
          reportDiscuss: '2 HS phát biểu ý kiến liên hệ định lí c.c.c.',
          teacherConclusion: 'GV khen ngợi, dặn BTVN vẽ hình và chứng minh 2 bài SGK.',
        },
      },
    ],
    homeworkAssignment: 'Bài tập SGK Toán 7 Tập 1: 4.4, 4.5, 4.6 trang 67 + Chuẩn bị thước đo góc cho bài Trường hợp c.g.c.',
    reflectionNotes: 'Cần nhắc lại thao tác mở khẩu độ compa đầu giờ vì một số em quên cách quay cung tròn cắt nhau.',
  },
  {
    id: 'lp-g7-w26-triangle-ineq',
    grade: 7,
    semester: 'HK2',
    weekNumber: 26,
    periodRange: 'Tiết 51 - 52',
    durationMinutes: 90,
    chapterName: 'Chương IX. Quan hệ giữa các yếu tố trong một tam giác',
    title: 'Bài 33: Quan hệ giữa ba cạnh của một tam giác (Bất đẳng thức tam giác)',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '27/10/2026',
    objectives: {
      knowledge: [
        'Phát biểu được định lí về bất đẳng thức tam giác: trong một tam giác, độ dài của một cạnh luôn nhỏ hơn tổng và lớn hơn hiệu độ dài hai cạnh còn lại.',
        'Nhận biết nhanh 3 đoạn thẳng có lập thành một tam giác hay không mà không cần vẽ hình.',
      ],
      competencies: [
        'Thực nghiệm trực quan trên mô phỏng Tam giác Lớp 7 của MathQuest để rút ra điều kiện |b - c| < a < b + c.',
        'Vận dụng tìm khoảng giá trị độ dài cạnh thứ ba khi biết 2 cạnh của tam giác.',
      ],
      qualities: [
        'Kiên trì kiểm tra điều kiện logic trước khi kết luận.',
      ],
    },
    teachingAids: {
      teacher: ['Mô phỏng Bất đẳng thức & Tổng góc tam giác Lớp 7 trên MathQuest THCS, que tính các độ dài 3cm, 4cm, 5cm, 8cm.'],
      student: ['SGK Toán 7 Tập 2 (GDPT 2018), thước kẻ, compa.'],
    },
    activities: [
      {
        id: 'lp7i-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Thử ghép 3 que tính)',
        durationMinutes: 8,
        objective: 'Gợi mở tình huống: không phải 3 đoạn thẳng bất kỳ nào cũng ghép được thành tam giác.',
        content: 'Thử ghép tam giác từ 2 bộ que: Bộ 1 (3cm, 4cm, 5cm) và Bộ 2 (2cm, 3cm, 6cm).',
        expectedProduct: 'HS phát hiện Bộ 2 không thể khép kín vì 2 + 3 < 6.',
        implementationSteps: {
          assignTask: 'GV giao 2 bộ que tính cho các nhóm ghép thử trên mặt bàn.',
          studentWork: 'HS thử ghép và ghi nhận kết quả.',
          reportDiscuss: 'Đại diện nhóm giải thích lý do bộ (2, 3, 6) không tạo thành tam giác.',
          teacherConclusion: 'GV dẫn dắt vào Định lí Bất đẳng thức tam giác (Toán 7 – CT GDPT 2018).',
        },
      },
      {
        id: 'lp7i-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Định lí bất đẳng thức tam giác',
        durationMinutes: 35,
        objective: 'Hình thành định lí và hệ quả |b - c| < a < b + c.',
        content: 'Trong một tam giác, tổng độ dài hai cạnh bất kỳ bao giờ cũng lớn hơn độ dài cạnh còn lại.\nMẹo kiểm tra nhanh: Chỉ cần so sánh tổng hai cạnh nhỏ hơn với cạnh lớn nhất.',
        expectedProduct: 'HS phát biểu chuẩn định lí và áp dụng kiểm tra nhanh 3 độ dài.',
        implementationSteps: {
          assignTask: 'GV kéo thanh trượt a, b, c trên Bài giảng trực quan Toán 7 MathQuest để HS quan sát sự đóng/mở của tam giác.',
          studentWork: 'HS ghi nhận bộ số tạo được tam giác và bộ số không tạo được.',
          reportDiscuss: 'Cả lớp rút ra công thức kép |b - c| < a < b + c.',
          teacherConclusion: 'GV chốt định lí và lưu ý Toán 7 CT 2018 học BĐT tam giác & đường đồng quy (Định lí Pythagore học ở Toán 8).',
        },
        boardNotes: 'Trong △ABC với 3 cạnh a, b, c:\n• a + b > c;  b + c > a;  c + a > b\n• |b - c| < a < b + c',
      },
      {
        id: 'lp7i-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập nhận diện & tìm cạnh thứ ba',
        durationMinutes: 32,
        objective: 'Giải thành thạo bài toán tìm chu vi tam giác cân khi biết 2 cạnh.',
        content: 'Bài 1: Kiểm tra bộ (5; 7; 11) và (4; 5; 9).\nBài 2: Tìm chu vi tam giác cân biết độ dài hai cạnh là 3 cm và 7 cm.',
        expectedProduct: 'Cạnh thứ ba không thể là 3 cm (vì 3 + 3 < 7), bắt buộc là 7 cm -> Chu vi = 17 cm.',
        implementationSteps: {
          assignTask: 'GV giao bài tập 2 gây tranh luận (3; 3; 7 hay 7; 7; 3).',
          studentWork: 'HS tự kiểm tra cả 2 trường hợp bằng BĐT tam giác.',
          reportDiscuss: '1 HS lên bảng giải thích vì sao loại trường hợp 3 cm.',
          teacherConclusion: 'GV nhấn mạnh đây là câu hỏi rất hay xuất hiện trong đề kiểm tra giữa/cuối HK2 Toán 7.',
        },
      },
      {
        id: 'lp7i-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng thực tế (Đường đi ngắn nhất)',
        durationMinutes: 15,
        objective: 'Giải thích vì sao đi thẳng giữa 2 địa điểm luôn ngắn hơn đi vòng qua điểm trung gian.',
        content: 'Bài toán tìm vị trí đặt trạm nước bên bờ sông để tổng quãng đường đi từ hai ngôi làng là ngắn nhất.',
        expectedProduct: 'Liên hệ AB < AC + CB vào thực tế.',
        implementationSteps: {
          assignTask: 'GV chiếu sơ đồ hai điểm A, B và một điểm trung gian C.',
          studentWork: 'HS nhận xét độ dài quãng đường.',
          reportDiscuss: 'Cả lớp rút ra ý nghĩa thực tiễn của bất đẳng thức tam giác.',
          teacherConclusion: 'GV giao BTVN SGK Toán 7 Tập 2.',
        },
      },
    ],
    homeworkAssignment: 'Làm bài tập 9.13 – 9.18 SGK Toán 7 Tập 2 (KNTT 2018) + Thực hành mô phỏng Tam giác Lớp 7 trên MathQuest.',
    reflectionNotes: 'Nội dung bám sát CT GDPT 2018, phân biệt rõ Bất đẳng thức tam giác (Toán 7) và Định lí Pythagore (Toán 8).',
  },

  // =========================================================================
  // TOÁN 8 - CT GDPT 2018 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'lp-g8-w6-identities',
    grade: 8,
    semester: 'HK1',
    weekNumber: 6,
    periodRange: 'Tiết 16 - 17',
    durationMinutes: 90,
    chapterName: 'Chương II. Hằng đẳng thức đáng nhớ và ứng dụng',
    title: 'Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'taught',
    updatedAt: '25/10/2026',
    objectives: {
      knowledge: [
        'Mô tả và viết chính xác 3 hằng đẳng thức đầu tiên: A² - B² = (A - B)(A + B), (A + B)² = A² + 2AB + B², (A - B)² = A² - 2AB + B².',
        'Vận dụng theo cả hai chiều (khai triển và viết gọn thành bình phương/tích) để tính nhanh và rút gọn biểu thức.',
      ],
      competencies: [
        'Phát hiện quy luật đại số thông qua diện tích hình vuông cạnh (a + b) trên Phòng Thực Hành Trực Quan.',
        'Tính nhẩm nhanh các phép tính như 99², 101², 48·52 không cần máy tính.',
      ],
      qualities: [
        'Kiên trì, cẩn thận trong dấu "+", "-" và hệ số 2AB khi khai triển.',
      ],
    },
    teachingAids: {
      teacher: [
        'Mô hình ghép diện tích hình vuông cạnh (a + b) chia thành 4 mảnh a², ab, ab, b².',
        'Bộ thẻ câu hỏi nhanh trên Đấu Trường Toán Học MathQuest.',
      ],
      student: [
        'SGK Toán 8 Tập 1 (GDPT 2018), vở bài tập, bảng nhóm.',
      ],
    },
    activities: [
      {
        id: 'lp8-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Thử thách tính nhẩm 52 × 48)',
        durationMinutes: 6,
        objective: 'Gây tò mò về phương pháp tính nhẩm siêu tốc 52 × 48 = 50² - 2² = 2496.',
        content: 'GV thi tính nhẩm với HS: GV đọc đáp án ngay trong 2 giây cho phép tính 102 × 98 và 52 × 48.',
        expectedProduct: 'HS tò mò muốn biết quy luật biến tích hai số thành hiệu hai bình phương.',
        implementationSteps: {
          assignTask: 'GV đưa 2 phép tính 52×48 và 103×97 lên màn hình, cho HS bấm giờ tính tay trong 15 giây.',
          studentWork: 'HS đặt tính nhân cột dọc, thấy mất thời gian.',
          reportDiscuss: 'GV viết ngay 52×48 = (50+2)(50-2) = 2500 - 4 = 2496 và hỏi HS nhận ra điều gì.',
          teacherConclusion: 'GV giới thiệu bài học 3 hằng đẳng thức đầu tiên.',
        },
      },
      {
        id: 'lp8-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Hình thành 3 hằng đẳng thức đầu',
        durationMinutes: 36,
        objective: 'HS tự chứng minh được 3 công thức bằng phép nhân đa thức và minh họa hình học.',
        content: '1. Tính (a - b)(a + b) -> HĐT 3: A² - B².\n2. Tính diện tích hình vuông cạnh (a + b) -> HĐT 1: (A + B)².\n3. Thay B bởi (-B) -> HĐT 2: (A - B)².',
        expectedProduct: 'Bảng ghi 3 HĐT chuẩn xác và các ví dụ áp dụng nhận diện A, B khi A, B là đơn thức (VD: 2x, 3y).',
        implementationSteps: {
          assignTask: 'GV chia 3 nhóm thực hiện 3 phép nhân đa thức và đối chiếu với mô hình ghép diện tích.',
          studentWork: 'Các nhóm thực hiện nhân đa thức, rút gọn các hạng tử đồng dạng.',
          reportDiscuss: 'Đại diện 3 nhóm đọc kết quả tổng quát với hai biểu thức A, B tùy ý.',
          teacherConclusion: 'GV nhấn mạnh lỗi sai kinh điển: (A + B)² ≠ A² + B² (luôn phải có 2AB ở giữa!).',
        },
        boardNotes: '1) (A + B)² = A² + 2AB + B²\n2) (A - B)² = A² - 2AB + B²\n3) A² - B² = (A - B)(A + B)',
      },
      {
        id: 'lp8-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập hai chiều (Khai triển & Viết gọn)',
        durationMinutes: 35,
        objective: 'Thành thạo khai triển (2x - 3y)² và thu gọn x² + 6x + 9, 4x² - 25.',
        content: 'Luyện 2 dạng: Dạng 1 (Khai triển xuôi), Dạng 2 (Viết ngược thành bình phương/tích), Dạng 3 (Tính nhanh 99², 101²).',
        expectedProduct: '(2x - 3y)² = 4x² - 12xy + 9y²; x² + 6x + 9 = (x + 3)²; 4x² - 25 = (2x - 5)(2x + 5).',
        implementationSteps: {
          assignTask: 'GV giao phiếu bài tập gồm 6 ý phân mức Nhận biết -> Thông hiểu -> Vận dụng.',
          studentWork: 'HS làm cá nhân, chú ý xác định rõ đâu là A, đâu là B trước khi viết công thức.',
          reportDiscuss: '3 HS lên bảng chữa 3 dạng; bạn dưới lớp chấm chéo.',
          teacherConclusion: 'GV chữa lỗi quên bình phương hệ số: viết (2x)² = 2x² thay vì 4x².',
        },
      },
      {
        id: 'lp8-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng & Củng cố',
        durationMinutes: 13,
        objective: 'Vận dụng vào bài toán chứng minh biểu thức luôn dương / tìm giá trị nhỏ nhất.',
        content: 'Chứng minh x² - 4x + 5 > 0 với mọi x.',
        expectedProduct: 'x² - 4x + 5 = (x - 2)² + 1 ≥ 1 > 0 với mọi x.',
        implementationSteps: {
          assignTask: 'GV gợi ý tách số 5 = 4 + 1 để xuất hiện HĐT số 2.',
          studentWork: 'HS thảo luận nhóm đôi để biến đổi.',
          reportDiscuss: '1 HS khá lên trình bày lời giải mẫu.',
          teacherConclusion: 'GV tổng kết, giao bài luyện trên Đề 15 phút Lớp 8 trong MathQuest.',
        },
      },
    ],
    homeworkAssignment: 'Làm bài 2.1 – 2.5 SGK Toán 8 Tập 1 (KNTT 2018) + Hoàn thành đề kiểm tra nhanh 15 phút Hằng đẳng thức trên MathQuest.',
    reflectionNotes: 'Lớp 8B tiếp thu tốt phần khai triển xuôi; cần tăng thêm bài tập chiều ngược (viết đa thức thành bình phương) cho nhóm HS trung bình.',
  },
  {
    id: 'lp-g8-w23-linear-func',
    grade: 8,
    semester: 'HK2',
    weekNumber: 23,
    periodRange: 'Tiết 45 - 46',
    durationMinutes: 90,
    chapterName: 'Chương VII. Phương trình bậc nhất và hàm số bậc nhất',
    title: 'Bài 28 - 29: Hàm số bậc nhất y = ax + b (a ≠ 0) và Hệ số góc của đường thẳng',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '27/10/2026',
    objectives: {
      knowledge: [
        'Nhận biết khái niệm hàm số bậc nhất y = ax + b (a ≠ 0), mặt phẳng tọa độ Oxy và cách vẽ đồ thị đường thẳng qua 2 điểm đặc biệt.',
        'Hiểu ý nghĩa hệ số góc a của đường thẳng y = ax + b (a ≠ 0) và nhận biết hai đường thẳng song song (a = a\', b ≠ b\'), cắt nhau (a ≠ a\'), trùng nhau (a = a\', b = b\').',
      ],
      competencies: [
        'Sử dụng Phòng thí nghiệm Hàm số bậc nhất y = ax + b (Toán 8) trên MathQuest để kéo tham số a, b và quan sát độ dốc đường thẳng.',
        'Mô hình hóa bài toán cước taxi, tiền điện bậc thang bằng hàm số bậc nhất.',
      ],
      qualities: [
        'Vẽ hệ trục tọa độ Oxy chính xác, chia đơn vị đều và trình bày khoa học.',
      ],
    },
    teachingAids: {
      teacher: ['Phòng thí nghiệm Hàm số bậc nhất y = ax + b trên MathQuest THCS, bảng kẻ ô vuông Oxy.'],
      student: ['SGK Toán 8 Tập 2 (GDPT 2018), thước thẳng, bút chì, giấy kẻ ô.'],
    },
    activities: [
      {
        id: 'lp8f-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Bài toán tính tiền cước taxi)',
        durationMinutes: 8,
        objective: 'Thiết lập công thức hàm số bậc nhất từ tình huống đời sống quen thuộc.',
        content: 'Một hãng taxi có giá mở cửa 12 000 đồng và mỗi km tiếp theo giá 15 000 đồng. Viết công thức tính số tiền y (nghìn đồng) theo quãng đường x (km).',
        expectedProduct: 'y = 15x + 12 (hàm số bậc nhất với a = 15, b = 12).',
        implementationSteps: {
          assignTask: 'GV chiếu bảng giá cước taxi và yêu cầu HS lập công thức tính tiền khi đi x km.',
          studentWork: 'HS tính với x = 1, 2, 5 km rồi khái quát thành y = 15x + 12.',
          reportDiscuss: '2 HS trình bày công thức và nêu vai trò của số 15 và số 12.',
          teacherConclusion: 'GV giới thiệu chuyên đề Hàm số bậc nhất y = ax + b (a ≠ 0) trong CT Toán 8 GDPT 2018.',
        },
      },
      {
        id: 'lp8f-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Đồ thị, Hệ số góc & Vị trí tương đối',
        durationMinutes: 37,
        objective: 'Thành thạo vẽ đồ thị đường thẳng và xác định điều kiện song song, cắt nhau.',
        content: '1. Vẽ đồ thị y = ax + b qua giao điểm với Oy là (0; b) và Ox là (-b/a; 0).\n2. Hệ số góc a: a > 0 góc tạo với Ox là góc nhọn; a < 0 góc tạo với Ox là góc tù.\n3. Hai đường thẳng y = ax + b và y = a\'x + b\': song song ⇔ a = a\', b ≠ b\'; cắt nhau ⇔ a ≠ a\'.',
        expectedProduct: 'Bảng tóm tắt đầy đủ cách vẽ đồ thị và 3 vị trí tương đối.',
        implementationSteps: {
          assignTask: 'GV chiếu Lab Hàm số bậc nhất MathQuest, bật đường d₁ và d₂, thay đổi thanh trượt a₁, a₂, b₁, b₂.',
          studentWork: 'HS quan sát góc α đổi từ nhọn sang tù khi a đổi dấu, và kiểm chứng điều kiện song song/cắt nhau.',
          reportDiscuss: 'HS nêu quy tắc nhận diện nhanh hai đường thẳng song song chỉ qua hệ số a và b.',
          teacherConclusion: 'GV chốt kiến thức đóng khung trên bảng.',
        },
        boardNotes: '• y = ax + b (a ≠ 0): cắt Oy tại (0; b), cắt Ox tại (-b/a; 0)\n• a > 0: góc nhọn với Ox;  a < 0: góc tù với Ox\n• d // d\' ⇔ a = a\' và b ≠ b\' ;  d cắt d\' ⇔ a ≠ a\'',
      },
      {
        id: 'lp8f-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập vẽ đồ thị & tìm m',
        durationMinutes: 30,
        objective: 'Vẽ chính xác hai đường thẳng và tìm tham số m để hai đường thẳng song song.',
        content: 'Bài 1: Vẽ đồ thị y = 2x - 4 trên mặt phẳng Oxy.\nBài 2: Tìm m để đường thẳng y = (m - 1)x + 3 song song với y = 2x - 5.',
        expectedProduct: 'Bài 2: m - 1 = 2 và 3 ≠ -5 => m = 3.',
        implementationSteps: {
          assignTask: 'GV giao 2 bài tập cơ bản làm vào vở kẻ ô.',
          studentWork: 'HS lập bảng 2 điểm (x = 0 và y = 0) rồi vẽ và giải tìm m.',
          reportDiscuss: '2 HS chữa bài trên bảng, kiểm tra lại điều kiện a ≠ 0 và b ≠ b\'.',
          teacherConclusion: 'GV nhắc HS luôn kiểm tra điều kiện b ≠ b\' khi xét song song để tránh nhầm với trùng nhau.',
        },
      },
      {
        id: 'lp8f-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng & Củng cố',
        durationMinutes: 15,
        objective: 'Ứng dụng công thức chuyển đổi nhiệt độ F = 1,8C + 32.',
        content: 'Tính nhiệt độ theo độ F khi trời 25°C và tìm nhiệt độ °C ứng với 68°F.',
        expectedProduct: '25°C -> 77°F; 68°F -> 20°C.',
        implementationSteps: {
          assignTask: 'GV giới thiệu công thức đổi độ C sang độ F.',
          studentWork: 'HS thay số và giải phương trình bậc nhất.',
          reportDiscuss: 'Cả lớp chốt đáp án.',
          teacherConclusion: 'GV giao BTVN SGK Toán 8 Tập 2.',
        },
      },
    ],
    homeworkAssignment: 'Làm bài tập 7.21 – 7.29 SGK Toán 8 Tập 2 (KNTT 2018) + Thực hành Lab Hàm số bậc nhất Toán 8 trên MathQuest.',
    reflectionNotes: 'Theo CT GDPT 2018, Hàm số bậc nhất & Mặt phẳng tọa độ Oxy đã được đưa vào Toán 8; HS tiếp thu trực quan rất tốt qua Lab kéo thả hệ số.',
  },
  {
    id: 'lp-g8-w29-pythagore',
    grade: 8,
    semester: 'HK2',
    weekNumber: 29,
    periodRange: 'Tiết 57 - 58',
    durationMinutes: 90,
    chapterName: 'Chương IX. Tam giác đồng dạng',
    title: 'Bài 35: Định lí Pythagore và ứng dụng',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '28/10/2026',
    objectives: {
      knowledge: [
        'Giải thích và phát biểu chuẩn xác Định lí Pythagore (thuận) và Định lí Pythagore đảo theo CT GDPT 2018 Toán 8.',
        'Tính được độ dài một cạnh trong tam giác vuông khi biết hai cạnh còn lại; nhận biết tam giác vuông qua độ dài 3 cạnh.',
      ],
      competencies: [
        'Sử dụng Phòng thí nghiệm Định lí Pythagore 2D/3D trên MathQuest để kiểm chứng diện tích hình vuông a² + b² = c².',
        'Vận dụng giải các bài toán thực tế: tính chiều dài thang, đường chéo màn hình TV (inch), chiều cao cây bị gãy.',
      ],
      qualities: [
        'Yêu thích tìm hiểu lịch sử toán học và cẩn thận khi lấy căn bậc hai.',
      ],
    },
    teachingAids: {
      teacher: ['Phòng thí nghiệm Định lí Pythagore & Phim 3D HD (Toán 8) trên MathQuest THCS, 4 tam giác vuông bằng giấy ghép hình vuông.'],
      student: ['SGK Toán 8 Tập 2 (GDPT 2018), thước kẻ, ê-ke, máy tính cầm tay.'],
    },
    activities: [
      {
        id: 'lp8p-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Bài toán đo kích thước TV 50 inch)',
        durationMinutes: 8,
        objective: 'Tạo hứng thú qua câu hỏi thực tế về đường chéo màn hình ti vi.',
        content: 'Một màn hình hình chữ nhật có chiều rộng 60 cm, chiều dài 80 cm. Đường chéo màn hình dài bao nhiêu cm?',
        expectedProduct: 'HS nhận ra cần tính cạnh huyền của tam giác vuông có hai cạnh góc vuông 60 cm và 80 cm.',
        implementationSteps: {
          assignTask: 'GV chiếu hình chiếc TV ghi kích thước hai cạnh góc vuông 60 cm, 80 cm.',
          studentWork: 'HS dự đoán độ dài đường chéo và thử kiểm tra bằng mô phỏng Pythagore.',
          reportDiscuss: '2 HS nêu dự đoán.',
          teacherConclusion: 'GV giới thiệu Bài 35: Định lí Pythagore và ứng dụng (Toán 8 – CT GDPT 2018).',
        },
      },
      {
        id: 'lp8p-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Định lí Pythagore thuận và đảo',
        durationMinutes: 35,
        objective: 'HS chứng minh trực quan a² + b² = c² và nắm vững định lí đảo.',
        content: '1. Định lí Pythagore: Trong một tam giác vuông, bình phương cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông (BC² = AB² + AC²).\n2. Định lí Pythagore đảo: Nếu một tam giác có bình phương một cạnh bằng tổng bình phương hai cạnh kia thì tam giác đó là tam giác vuông.',
        expectedProduct: 'Phát biểu chính xác cả hai định lí và nhớ các bộ ba Pythagore đẹp: (3; 4; 5), (6; 8; 10), (5; 12; 13).',
        implementationSteps: {
          assignTask: 'GV bật mô phỏng Pythagore Lab & Phim 3D HD trên MathQuest để HS kéo kích thước a, b và kiểm chứng a² + b² = c².',
          studentWork: 'HS kiểm tra bộ (3, 4, 5), (5, 12, 13) và ghi công thức vào vở.',
          reportDiscuss: '2 HS phát biểu lại định lí thuận và định lí đảo bằng lời.',
          teacherConclusion: 'GV lưu ý lỗi hay nhầm: luôn đặt bình phương CẠNH HUYỀN (cạnh đối diện góc vuông) đứng một mình ở một vế.',
        },
        boardNotes: '• △ABC vuông tại A ⇒ BC² = AB² + AC²\n• Nếu BC² = AB² + AC² ⇒ △ABC vuông tại A (Pythagore đảo)\n• Bộ ba Pythagore: (3; 4; 5), (6; 8; 10), (5; 12; 13)',
      },
      {
        id: 'lp8p-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập tính cạnh & kiểm tra góc vuông',
        durationMinutes: 32,
        objective: 'Tính thành thạo cả cạnh huyền lẫn cạnh góc vuông và vận dụng định lí đảo.',
        content: 'Bài 1: Tính cạnh huyền khi a = 6 cm, b = 8 cm; tính cạnh góc vuông b khi c = 13 cm, a = 5 cm.\nBài 2: Kiểm tra tam giác có 3 cạnh 7 cm, 24 cm, 25 cm có phải tam giác vuông không?',
        expectedProduct: 'Bài 1: c = 10 cm, b = 12 cm. Bài 2: 7² + 24² = 49 + 576 = 625 = 25² => tam giác vuông.',
        implementationSteps: {
          assignTask: 'GV giao 2 bài tập kết hợp Thử thách nhanh ngay trong Pythagore Lab.',
          studentWork: 'HS tự tính toán và kiểm chứng kết quả.',
          reportDiscuss: '2 HS lên bảng trình bày đầy đủ câu lập luận.',
          teacherConclusion: 'GV chốt quy trình trình bày định lí Pythagore đảo (tính riêng bình phương cạnh lớn nhất rồi so sánh với tổng bình phương hai cạnh kia).',
        },
      },
      {
        id: 'lp8p-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng thực tế (Chiếc thang tựa tường)',
        durationMinutes: 15,
        objective: 'Giải bài toán thực tiễn bằng định lí Pythagore.',
        content: 'Một chiếc thang dài 5 m tựa vào tường, chân thang cách chân tường 3 m. Đầu thang chạm tường ở độ cao bao nhiêu mét?',
        expectedProduct: 'h = √(5² - 3²) = √16 = 4 m.',
        implementationSteps: {
          assignTask: 'GV vẽ nhanh sơ đồ thang – tường – mặt đất.',
          studentWork: 'HS làm việc nhóm đôi trong 5 phút.',
          reportDiscuss: '1 nhóm trình bày và trả lời luôn bài toán đường chéo TV khởi động (100 cm).',
          teacherConclusion: 'GV tổng kết, giao BTVN SGK Toán 8 Tập 2.',
        },
      },
    ],
    homeworkAssignment: 'Làm bài tập 9.23 – 9.30 SGK Toán 8 Tập 2 (KNTT 2018) + Hoàn thành Ải 3 Mê Cung Pythagore trên MathQuest.',
    reflectionNotes: 'Định lí Pythagore trong CT GDPT 2018 đặt ở Toán 8 (Chương IX), gắn liền với bài toán thực tế và tam giác đồng dạng.',
  },

  // =========================================================================
  // TOÁN 9 - CT GDPT 2018 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  // =========================================================================
  {
    id: 'lp-g9-w11-trig',
    grade: 9,
    semester: 'HK1',
    weekNumber: 11,
    periodRange: 'Tiết 21 - 22',
    durationMinutes: 90,
    chapterName: 'Chương IV. Hệ thức lượng trong tam giác vuông',
    title: 'Bài 11 - 12: Tỉ số lượng giác của góc nhọn & Hệ thức giữa cạnh, góc trong tam giác vuông',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'approved',
    updatedAt: '28/10/2026',
    objectives: {
      knowledge: [
        'Nhận biết định nghĩa 4 tỉ số lượng giác của góc nhọn α (sin α, cos α, tan α, cot α) và giá trị lượng giác các góc đặc biệt 30°, 45°, 60°.',
        'Nắm vững hệ thức giữa cạnh và góc trong tam giác vuông: b = a·sin B = a·cos C; b = c·tan B = c·cot C (chuẩn CT GDPT 2018 Toán 9).',
      ],
      competencies: [
        'Giải tam giác vuông (tìm các cạnh và góc chưa biết) và tính chiều cao tháp, cây, khoảng cách qua sông trong thực tiễn.',
        'Sử dụng thành thạo máy tính cầm tay tìm tỉ số lượng giác và góc nhọn.',
      ],
      qualities: [
        'Cẩn thận xác định đúng cạnh đối, cạnh kề, cạnh huyền tương ứng với góc đang xét.',
      ],
    },
    teachingAids: {
      teacher: ['Slide minh họa tam giác vuông đổi góc α, bảng giá trị lượng giác 30°–45°–60°, bài toán đo chiều cao cột cờ.'],
      student: ['SGK Toán 9 Tập 1 (GDPT 2018), máy tính cầm tay, thước đo góc.'],
    },
    activities: [
      {
        id: 'lp9t-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Đo chiều cao cột cờ không cần trèo)',
        durationMinutes: 8,
        objective: 'Đặt vấn đề thực tế dẫn tới nhu cầu dùng tỉ số lượng giác góc nhọn.',
        content: 'Đứng cách chân cột cờ 12 m, đo được góc nâng nhìn lên đỉnh cột cờ là 35°. Làm sao tính chiều cao cột cờ?',
        expectedProduct: 'HS nhận ra cần liên hệ giữa cạnh đối, cạnh kề và góc nhọn 35°.',
        implementationSteps: {
          assignTask: 'GV chiếu hình ảnh học sinh dùng giác kế ngắm đỉnh cột cờ.',
          studentWork: 'HS nhận diện tam giác vuông tạo bởi tia ngắm, mặt đất và cột cờ.',
          reportDiscuss: 'HS nêu thắc mắc về công thức liên hệ giữa góc 35° và độ dài cạnh.',
          teacherConclusion: 'GV dẫn vào Bài 11–12: Tỉ số lượng giác & Hệ thức cạnh – góc trong tam giác vuông.',
        },
      },
      {
        id: 'lp9t-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Tỉ số lượng giác & Hệ thức giữa cạnh và góc',
        durationMinutes: 37,
        objective: 'Ghi nhớ nhanh 4 tỉ số lượng giác và 2 hệ thức cạnh – góc chuẩn CT 2018.',
        content: '1. sin α = đối/huyền; cos α = kề/huyền; tan α = đối/kề; cot α = kề/đối.\n2. Hai góc phụ nhau: sin α = cos(90° - α); tan α = cot(90° - α).\n3. Hệ thức cạnh – góc: Cạnh góc vuông = Cạnh huyền × sin(góc đối) = Cạnh huyền × cos(góc kề) = Cạnh góc vuông kia × tan(góc đối).',
        expectedProduct: 'Bảng công thức chuẩn CT 2018 (lưu ý: không dùng hệ thức đường cao cũ h² = b\'c\').',
        implementationSteps: {
          assignTask: 'GV hướng dẫn câu thơ ghi nhớ "Sin đi học – Cos không hư – Tan đoàn kết – Cot kết đoàn" và cách suy ra hệ thức cạnh – góc.',
          studentWork: 'HS lập bảng giá trị lượng giác của 30°, 45°, 60° từ tam giác vuông cân và nửa tam giác đều.',
          reportDiscuss: '2 HS kiểm tra chéo công thức cho góc B và góc C trong △ABC vuông tại A.',
          teacherConclusion: 'GV chốt công thức đóng khung chuẩn SGK Toán 9 GDPT 2018.',
        },
        boardNotes: '• sin α = đối/huyền ;  cos α = kề/huyền ;  tan α = đối/kề ;  cot α = kề/đối\n• b = a·sin B = a·cos C ;  b = c·tan B = c·cot C',
      },
      {
        id: 'lp9t-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập giải tam giác vuông',
        durationMinutes: 30,
        objective: 'Thành thạo tìm cạnh và góc nhọn trong tam giác vuông.',
        content: 'Bài 1: Cho △ABC vuông tại A có BC = 10 cm, ∠B = 30°. Tính AC và AB.\nBài 2: Cho △ABC vuông tại A có AB = 6 cm, BC = 10 cm. Tính AC, sin B, cos B và số đo góc B (làm tròn đến độ).',
        expectedProduct: 'Bài 1: AC = 5 cm, AB = 5√3 cm. Bài 2: AC = 8 cm, sin B = 4/5 = 0,8 => ∠B ≈ 53°.',
        implementationSteps: {
          assignTask: 'GV giao 2 bài tập chuẩn cấu trúc đề 15 phút & giữa kỳ 1 Toán 9.',
          studentWork: 'HS làm cá nhân kết hợp bấm máy tính tìm góc.',
          reportDiscuss: '2 HS lên bảng trình bày chi tiết.',
          teacherConclusion: 'GV sửa lỗi bấm máy tính quên chuyển chế độ DEG (độ).',
        },
      },
      {
        id: 'lp9t-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Vận dụng thực tế & Tổng kết',
        durationMinutes: 15,
        objective: 'Giải trọn vẹn bài toán đo chiều cao cột cờ đầu giờ.',
        content: 'Chiều cao cột cờ: h = 12 · tan 35° + 1,5 (chiều cao mắt ngắm) ≈ 9,9 m.',
        expectedProduct: 'HS tự tin áp dụng tan α vào đo chiều cao gián tiếp.',
        implementationSteps: {
          assignTask: 'GV yêu cầu HS áp dụng hệ thức cạnh góc vuông để tính chiều cao cột cờ.',
          studentWork: 'HS tính nhanh và cộng thêm chiều cao người đo.',
          reportDiscuss: 'Lớp kiểm tra kết quả làm tròn 1 chữ số thập phân.',
          teacherConclusion: 'GV giao Đề kiểm tra 15 phút Toán 9 trên MathQuest.',
        },
      },
    ],
    homeworkAssignment: 'Làm bài tập 4.1 – 4.12 SGK Toán 9 Tập 1 (KNTT 2018) + Làm Đề 15 phút Toán 9 trên MathQuest.',
    reflectionNotes: 'Bám sát 100% CT GDPT 2018: tập trung tỉ số lượng giác và hệ thức cạnh – góc, không kiểm tra hệ thức đường cao h² = b\'c\' của chương trình cũ.',
  },
  {
    id: 'lp-g9-w24-viete-circle',
    grade: 9,
    semester: 'HK2',
    weekNumber: 24,
    periodRange: 'Tiết 47 - 48',
    durationMinutes: 90,
    chapterName: 'Chương VI & IX. Phương trình bậc hai, Định lí Viète & Tứ giác nội tiếp',
    title: 'Chuyên đề ôn thi vào 10: Định lí Viète & Tứ giác nội tiếp (Chuẩn GDPT 2018)',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'draft',
    updatedAt: '28/10/2026',
    objectives: {
      knowledge: [
        'Áp dụng thành thạo công thức nghiệm, biệt thức Δ = b² - 4ac và Định lí Viète (x₁ + x₂ = -b/a, x₁·x₂ = c/a) cho phương trình bậc hai một ẩn.',
        'Hiểu định nghĩa tứ giác nội tiếp (4 đỉnh nằm trên một đường tròn), tính chất tổng hai góc đối bằng 180°, và nhận diện các tứ giác nội tiếp đặc biệt (hình chữ nhật, hình vuông, hình thang cân, hai tam giác vuông chung cạnh huyền).',
      ],
      competencies: [
        'Vận dụng Định lí Viète tính biểu thức đối xứng giữa hai nghiệm và tìm tham số m.',
        'Trình bày mạch lạc bài chứng minh 4 điểm cùng thuộc một đường tròn / tứ giác nội tiếp theo chuẩn đề thi vào 10 CT GDPT 2018.',
      ],
      qualities: [
        'Tác phong làm bài thi nghiêm túc, luôn kiểm tra điều kiện Δ ≥ 0 trước khi áp dụng Định lí Viète và vẽ hình rõ nét.',
      ],
    },
    teachingAids: {
      teacher: [
        'Slide tổng hợp công thức Định lí Viète, Đồ thị Parabol y = ax² và hình động tứ giác nội tiếp.',
        'Bộ đề thi thử vào 10 chuẩn CT 2018 trong Ngân hàng đề MathQuest.',
      ],
      student: [
        'SGK Toán 9 Tập 2 (GDPT 2018), compa, thước kẻ, vở chuyên đề ôn thi vào 10.',
      ],
    },
    activities: [
      {
        id: 'lp9-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Ôn nhanh Định lí Viète & Tứ giác nội tiếp)',
        durationMinutes: 10,
        objective: 'Hệ thống hóa 2 trụ cột trọng tâm trong đề tuyển sinh lớp 10 theo CT GDPT 2018.',
        content: 'Nhắc lại điều kiện có nghiệm Δ ≥ 0, hệ thức Viète x₁ + x₂ = -b/a, x₁x₂ = c/a và định nghĩa tứ giác nội tiếp đường tròn.',
        expectedProduct: 'Bảng tóm tắt công thức chuẩn ở góc bảng để tra cứu suốt tiết học.',
        implementationSteps: {
          assignTask: 'GV chiếu 2 sơ đồ nhanh: Định lí Viète và Tứ giác nội tiếp (chỉ rõ tâm đường tròn ngoại tiếp khi có 2 góc vuông cùng nhìn cạnh huyền).',
          studentWork: 'HS trả lời nhanh cá nhân.',
          reportDiscuss: 'Lớp lưu ý các điểm mới của CT 2018: trình bày chứng minh 4 điểm cùng thuộc đường tròn đường kính BC/AH rõ ràng, chặt chẽ.',
          teacherConclusion: 'GV ghi bảng tóm tắt góc trái bảng để HS áp dụng vào bài luyện đề.',
        },
      },
      {
        id: 'lp9-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Khai thác 2 bài toán kinh điển (Viète & 3 đường cao)',
        durationMinutes: 40,
        objective: 'HS giải chắc bài toán Viète và chứng minh tứ giác nội tiếp qua đường tròn đường kính chung.',
        content: 'Bài 1 (Đại số): Cho phương trình x² - 5x + 6 = 0. Không giải phương trình, tính A = x₁² + x₂².\nBài 2 (Hình học): Cho △ABC nhọn nội tiếp (O), ba đường cao AD, BE, CF cắt nhau tại H. Chứng minh 4 điểm A, E, H, F cùng thuộc một đường tròn và 4 điểm B, F, E, C cùng thuộc một đường tròn.',
        expectedProduct: 'Bài 1: Δ = 1 > 0; A = (x₁+x₂)² - 2x₁x₂ = 25 - 12 = 13.\nBài 2: Chỉ rõ tâm đường tròn là trung điểm AH (cho AEHF) và trung điểm BC (cho BFEC).',
        implementationSteps: {
          assignTask: 'GV giao Bài 1 làm trong 10 phút, Bài 2 vẽ hình và chứng minh theo nhóm đôi trong 20 phút.',
          studentWork: 'HS chứng minh △AEH, △AFH vuông cùng cạnh huyền AH => 4 điểm cách đều trung điểm I của AH; tương tự cho BFEC với trung điểm M của BC.',
          reportDiscuss: '2 HS lên trình bày 2 bài; GV phân tích ưu điểm cách chỉ rõ tâm và bán kính đường tròn ngoại tiếp theo chuẩn SGK 2018.',
          teacherConclusion: 'GV chốt kỹ thuật bắc cầu góc nội tiếp cùng chắn một cung sau khi đã chỉ ra tứ giác nội tiếp.',
        },
        boardNotes: '• Viète (Δ ≥ 0): S = x₁ + x₂ = -b/a ;  P = x₁x₂ = c/a ;  x₁² + x₂² = S² - 2P\n• AEHF nội tiếp đường tròn đường kính AH (tâm là trung điểm AH)\n• BFEC nội tiếp đường tròn đường kính BC (tâm là trung điểm BC)',
      },
      {
        id: 'lp9-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện đề phân hóa theo nhóm trình độ',
        durationMinutes: 30,
        objective: 'Phân hóa HS đại trà (làm chắc câu a, b) và HS mục tiêu điểm 9+ (câu c chứng minh tiếp tuyến / phân giác).',
        content: 'Giao đề luyện tập tương tự (chứng minh DH là tia phân giác góc FDE và tính chất tổng hai góc đối bằng 180°).',
        expectedProduct: '100% HS làm được câu Viète và câu a hình, 75% làm được câu b.',
        implementationSteps: {
          assignTask: 'GV giao đề trên phiếu, phân tầng yêu cầu rõ ràng cho từng nhóm.',
          studentWork: 'HS làm bài độc lập trong 20 phút.',
          reportDiscuss: 'GV đi từng bàn hướng dẫn HS yếu cách gọi trung điểm cạnh huyền, sau đó chữa chung ý nâng cao trên bảng.',
          teacherConclusion: 'GV chấm nhanh 3 bài tiêu biểu và nhắc không quên kiểm tra Δ ≥ 0.',
        },
      },
      {
        id: 'lp9-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Tổng kết & Giao đề tự luyện',
        durationMinutes: 10,
        objective: 'Củng cố quy trình trình bày bài thi vào 10 chuẩn CT GDPT 2018.',
        content: 'Nhắc lại checklist kiểm tra trước khi nộp bài thi.',
        expectedProduct: 'HS ghi nhớ các bước rà soát điều kiện Δ ≥ 0, ký hiệu và lý do trong chứng minh.',
        implementationSteps: {
          assignTask: 'GV dặn HS làm 1 đề thi thử Toán 9 trên MathQuest và mô phỏng Parabol y = ax².',
          studentWork: 'HS ghi chú bài tập và cấu trúc cần ôn.',
          reportDiscuss: 'Giải đáp thắc mắc nhanh của HS.',
          teacherConclusion: 'Kết thúc tiết học, khen ngợi các nhóm tích cực.',
        },
      },
    ],
    homeworkAssignment: 'Làm Đề thi thử Toán 9 (CT GDPT 2018) trên MathQuest + Hoàn thành câu c bài toán 3 đường cao vào vở.',
    reflectionNotes: 'Lưu ý chuẩn trình bày mới của CT GDPT 2018: khi chứng minh tứ giác nội tiếp, học sinh cần chỉ rõ 4 điểm cùng cách đều tâm (trung điểm cạnh huyền) hoặc áp dụng định nghĩa/tính chất được học trong SGK 2018.',
  },
];
