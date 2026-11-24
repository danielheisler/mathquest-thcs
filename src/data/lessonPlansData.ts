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

export const LESSON_PLANS_STORAGE_KEY = 'mathquest_lesson_plans_v1';

export const initialLessonPlans: LessonPlan[] = [
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
        'SGK Toán 6 Tập 1, vở ghi, bảng con, bút dạ.',
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
    homeworkAssignment: 'Làm 6 câu trắc nghiệm BTVN phần Số học trên MathQuest (Mã 20112002) + Bài tập SGK: 2.18, 2.20, 2.22.',
    reflectionNotes: '85% HS phân tích đúng bằng cột dọc sau khi nhắc kỹ chỉ chia cho các số nguyên tố 2, 3, 5, 7, 11. Một số em còn nhầm số 1 là số nguyên tố -> cần ôn lại đầu tiết 12.',
  },
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
        'Phát biểu và vẽ hình minh họa được trường hợp bằng nhau cạnh - cạnh - cạnh (c.c.c).',
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
        'Compa, thước thẳng có chia vạch mm, kéo thủ công, 1 tờ giấy màu A4.',
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
        expectedProduct: 'Bản vẽ hình chính xác trong vở và phát biểu định lý c.c.c.',
        implementationSteps: {
          assignTask: 'GV làm mẫu bước dựng tam giác có 3 cạnh 4cm, 5cm, 6cm bằng compa trên bảng; yêu cầu HS vẽ vào vở và dùng thước đo góc kiểm chứng.',
          studentWork: 'HS tự vẽ 2 tam giác bằng thước và compa, đo các góc tương ứng và đối chiếu với bạn bên cạnh.',
          reportDiscuss: '2 HS đọc kết quả đo góc; cả lớp nhận thấy hai tam giác tự động có các góc tương ứng bằng nhau.',
          teacherConclusion: 'GV chốt Định lý (c.c.c): Nếu 3 cạnh của tam giác này bằng 3 cạnh của tam giác kia thì hai tam giác đó bằng nhau.',
        },
        boardNotes: '△ABC = △DEF <=> AB=DE, BC=EF, AC=DF và ∠A=∠D, ∠B=∠E, ∠C=∠F\n(Chú ý viết đúng thứ tự đỉnh tương ứng!)',
      },
      {
        id: 'lp7-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện tập chứng minh hình học',
        durationMinutes: 35,
        objective: 'Hình thành mẫu trình bày chứng minh hai tam giác bằng nhau theo 3 dòng chuẩn.',
        content: 'Bài 1: Cho hình bình hành / tứ giác ABCD có AB = CD, AD = BC. Chứng minh △ABC = △CDA.\nBài 2: Chứng minh tia phân giác bằng tam giác cân/cánh diều (AB = AC, MB = MC => △ABM = △ACM).',
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
          reportDiscuss: '2 HS phát biểu ý kiến liên hệ định lý c.c.c.',
          teacherConclusion: 'GV khen ngợi, dặn BTVN vẽ hình và chứng minh 2 bài SGK.',
        },
      },
    ],
    homeworkAssignment: 'Bài tập SGK: 4.4, 4.5, 4.6 trang 67 + Chuẩn bị thước đo góc cho bài Trường hợp c.g.c.',
    reflectionNotes: 'Cần nhắc lại thao tác mở khẩu độ compa đầu giờ vì một số em quên cách quay cung tròn cắt nhau.',
  },
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
        'SGK Toán 8 Tập 1, vở bài tập, bảng nhóm.',
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
    homeworkAssignment: 'Làm bài 2.1 – 2.5 SGK Toán 8 + Hoàn thành đề kiểm tra nhanh 15 phút Hằng đẳng thức trên MathQuest.',
    reflectionNotes: 'Lớp 8B tiếp thu tốt phần khai triển xuôi; cần tăng thêm bài tập chiều ngược (viết đa thức thành bình phương) cho nhóm HS trung bình.',
  },
  {
    id: 'lp-g9-w10-circle',
    grade: 9,
    semester: 'HK2',
    weekNumber: 20,
    periodRange: 'Tiết 39 - 40',
    durationMinutes: 90,
    chapterName: 'Chương IX. Đường tròn ngoại tiếp và đường tròn nội tiếp',
    title: 'Chuyên đề ôn thi vào 10: Tứ giác nội tiếp và Chứng minh góc bằng nhau',
    textbookSeries: 'Kết nối tri thức với cuộc sống (GDPT 2018)',
    teacherName: 'Cô Diễm Quỳnh',
    status: 'draft',
    updatedAt: '28/10/2026',
    objectives: {
      knowledge: [
        'Hệ thống 4 dấu hiệu nhận biết tứ giác nội tiếp đường tròn (đặc biệt: tổng hai góc đối bằng 180°, hai đỉnh kề cùng nhìn một cạnh dưới hai góc bằng nhau).',
        'Vận dụng tính chất tứ giác nội tiếp để suy ra các cặp góc bằng nhau, chứng minh đường thẳng vuông góc, song song hoặc 3 điểm thẳng hàng.',
      ],
      competencies: [
        'Phân tích ngược từ kết luận để chọn đúng 4 điểm cùng nằm trên một đường tròn.',
        'Trình bày bài hình tổng hợp câu a, b theo chuẩn chấm thi tuyển sinh vào lớp 10.',
      ],
      qualities: [
        'Tác phong làm bài thi nghiêm túc, vẽ hình to, rõ, đúng tỉ lệ.',
      ],
    },
    teachingAids: {
      teacher: [
        'Giáo án điện tử có hình động mô phỏng các góc nội tiếp cùng chắn một cung.',
        'Bộ đề thi thử vào 10 trích từ Ngân hàng đề MathQuest.',
      ],
      student: [
        'Compa, thước kẻ, bút chì vẽ hình phụ, vở chuyên đề ôn thi vào 10.',
      ],
    },
    activities: [
      {
        id: 'lp9-a1',
        phaseNumber: 1,
        phaseName: 'Hoạt động 1: Khởi động (Ôn nhanh 4 dấu hiệu)',
        durationMinutes: 10,
        objective: 'Hệ thống hóa nhanh 4 dấu hiệu nhận biết tứ giác nội tiếp trong 5 phút đầu giờ.',
        content: 'Sơ đồ tư duy 4 dấu hiệu nhận biết tứ giác nội tiếp kèm hình vẽ nhận diện nhanh (tứ giác có hai góc vuông đối nhau hoặc cùng nhìn cạnh huyền).',
        expectedProduct: 'Bảng tóm tắt 4 dấu hiệu ở góc bảng để tra cứu suốt tiết học.',
        implementationSteps: {
          assignTask: 'GV chiếu 4 hình vẽ nhanh, yêu cầu HS nêu dấu hiệu phù hợp cho từng hình.',
          studentWork: 'HS trả lời nhanh cá nhân.',
          reportDiscuss: 'Lớp thống nhất 2 dấu hiệu hay gặp nhất trong đề thi vào 10.',
          teacherConclusion: 'GV ghi bảng tóm tắt góc trái bảng để HS áp dụng vào bài tổng hợp.',
        },
      },
      {
        id: 'lp9-a2',
        phaseNumber: 2,
        phaseName: 'Hoạt động 2: Khai thác bài toán hình học kinh điển (3 đường cao)',
        durationMinutes: 40,
        objective: 'HS chứng minh thành thạo 2 tứ giác nội tiếp kinh điển trong tam giác nhọn ABC có các đường cao AD, BE, CF cắt nhau tại H.',
        content: 'Cho △ABC nhọn nội tiếp (O), ba đường cao AD, BE, CF cắt nhau tại H.\na) Chứng minh BFEC và AEHF nội tiếp.\nb) Chứng minh DH là tia phân giác của góc FDE.',
        expectedProduct: 'Lời giải chuẩn mực 2 câu a, b theo thang điểm thi vào 10.',
        implementationSteps: {
          assignTask: 'GV hướng dẫn vẽ hình chuẩn xác (tránh trường hợp tam giác cân đặc biệt), giao câu a làm trong 10 phút, câu b thảo luận nhóm 15 phút.',
          studentWork: 'HS tìm các góc vuông tại D, E, F để chỉ ra tổng góc đối = 180° (AEHF) và hai góc 90° cùng nhìn BC (BFEC).',
          reportDiscuss: '2 HS lên trình bày câu a và câu b; GV phân tích cách bắc cầu góc qua 2 tứ giác nội tiếp ở câu b.',
          teacherConclusion: 'GV chốt kỹ thuật "nhảy góc" qua cung chắn chung của tứ giác nội tiếp.',
        },
        boardNotes: '• AEHF nội tiếp: ∠AEH + ∠AFH = 90° + 90° = 180°\n• BFEC nội tiếp: ∠BFC = ∠BEC = 90° (cùng nhìn BC)',
      },
      {
        id: 'lp9-a3',
        phaseNumber: 3,
        phaseName: 'Hoạt động 3: Luyện đề phân hóa theo nhóm trình độ',
        durationMinutes: 30,
        objective: 'Phân hóa HS đại trà (làm chắc câu a, b) và HS mục tiêu điểm 9+ (câu c chứng minh tiếp tuyến / thẳng hàng).',
        content: 'Giao đề luyện tập tương tự (tiếp tuyến tại A của đường tròn (O) và đường tròn đường kính AH).',
        expectedProduct: '100% HS làm được câu a, 75% làm được câu b, nhóm khá giỏi giải quyết xong câu c.',
        implementationSteps: {
          assignTask: 'GV giao đề trên phiếu, phân tầng yêu cầu rõ ràng cho từng nhóm.',
          studentWork: 'HS làm bài độc lập trong 20 phút.',
          reportDiscuss: 'GV đi từng bàn hướng dẫn HS yếu cách nhìn góc vuông, sau đó chữa chung ý c trên bảng.',
          teacherConclusion: 'GV chấm nhanh 3 bài tiêu biểu và chỉ ra lỗi thiếu lý do khi suy ra góc bằng nhau.',
        },
      },
      {
        id: 'lp9-a4',
        phaseNumber: 4,
        phaseName: 'Hoạt động 4: Tổng kết & Giao đề tự luyện',
        durationMinutes: 10,
        objective: 'Củng cố quy trình trình bày bài hình học thi vào 10.',
        content: 'Nhắc lại checklist kiểm tra trước khi nộp bài hình.',
        expectedProduct: 'HS ghi nhớ các bước rà soát ký hiệu và lý do trong chứng minh.',
        implementationSteps: {
          assignTask: 'GV dặn HS làm 1 đề thi thử Cuối kỳ Lớp 9 trên MathQuest.',
          studentWork: 'HS ghi chú bài tập và cấu trúc cần ôn.',
          reportDiscuss: 'Giải đáp thắc mắc nhanh của HS về cách vẽ hình phụ.',
          teacherConclusion: 'Kết thúc tiết học, khen ngợi các nhóm tích cực.',
        },
      },
    ],
    homeworkAssignment: 'Làm Đề thi thử Cuối kỳ Toán 9 trên MathQuest + Hoàn thành câu c bài toán 3 đường cao vào vở.',
    reflectionNotes: 'Cần dành thêm 1 tiết tăng cường cho học sinh luyện kỹ thuật vẽ hình và viết đúng thứ tự tên tứ giác theo vòng tròn.',
  },
];
