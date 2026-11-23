import { BodyMotionQuestion } from '../types/math';

export const initialBodyMotionQuestions: BodyMotionQuestion[] = [
  // Question 1: Exactly as shown in the user's classroom picture!
  {
    id: 'bm-photo-1',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số Tự Nhiên & Cấu Tạo Số',
    questionText: 'Dùng mỗi chữ số 2, 0, 7, 5, 1, 9, 4, 3, 6 đúng một lần, số lớn nhất có thể lập được là:',
    options: [
      {
        text: '976 543 210',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '976 543 201',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '967 543 210',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Để số lập được là lớn nhất, ta sắp xếp các chữ số theo thứ tự giảm dần từ hàng cao nhất đến hàng thấp nhất: 9, 7, 6, 5, 4, 3, 2, 1, 0 => được số 976 543 210.',
    hint: 'Sắp xếp các chữ số giảm dần từ trái sang phải!'
  },
  {
    id: 'bm-g6-2',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số Nguyên & Phép Tính',
    questionText: 'Kết quả của phép tính sau là bao nhiêu?',
    formula: '(-15) + (-25) - (-10)',
    options: [
      {
        text: '-30',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '-50',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '20',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '(-15) + (-25) - (-10) = -40 + 10 = -30.',
    hint: 'Trừ cho số âm tương đương với cộng số đối của nó!'
  },
  {
    id: 'bm-g6-3',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Dấu Hiệu Chia Hết',
    questionText: 'Số nào sau đây chia hết cho cả 2, 3 và 5?',
    options: [
      {
        text: '1 245',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      },
      {
        text: '2 340',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '3 512',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      }
    ],
    correctIndex: 1,
    explanation: 'Số chia hết cho cả 2 và 5 có chữ số tận cùng là 0. Số 2 340 có tận cùng là 0 và tổng các chữ số 2+3+4+0 = 9 chia hết cho 3.',
    hint: 'Tận cùng là 0 và tổng các chữ số chia hết cho 3.'
  },
  {
    id: 'bm-g7-1',
    grade: 7,
    topic: 'rational',
    topicName: 'Số Hữu Tỉ & Lũy Thừa',
    questionText: 'Giá trị của biểu thức lũy thừa sau là:',
    formula: '\\left(-\\frac{2}{3}\\right)^3',
    options: [
      {
        text: '-\\frac{8}{27}',
        formula: '-\\frac{8}{27}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '\\frac{8}{27}',
        formula: '\\frac{8}{27}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '-\\frac{6}{9}',
        formula: '-\\frac{6}{9}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '(-2/3)³ = (-2)³ / 3³ = -8 / 27 (số âm với số mũ lẻ vẫn mang dấu âm).',
    hint: 'Số mũ 3 là số lẻ nên kết quả mang dấu âm.'
  },
  {
    id: 'bm-g7-2',
    grade: 7,
    topic: 'geometry',
    topicName: 'Tam Giác & Góc',
    questionText: 'Trong tam giác ABC vuông tại A có góc B = 35°. Số đo của góc C là:',
    options: [
      {
        text: '65°',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      },
      {
        text: '55°',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '45°',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      }
    ],
    correctIndex: 1,
    explanation: 'Trong tam giác vuông, hai góc nhọn phụ nhau: góc C = 90° - góc B = 90° - 35° = 55°.',
    hint: 'Tổng hai góc nhọn trong tam giác vuông bằng 90°.'
  },
  {
    id: 'bm-g8-1',
    grade: 8,
    topic: 'algebra',
    topicName: 'Hằng Đẳng Thức Đáng Nhớ',
    questionText: 'Khai triển hằng đẳng thức hiệu hai bình phương đúng là:',
    formula: 'A^2 - B^2 = ?',
    options: [
      {
        text: '(A - B)(A + B)',
        formula: '(A - B)(A + B)',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '(A - B)^2',
        formula: '(A - B)^2',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: 'A^2 - 2AB + B^2',
        formula: 'A^2 - 2AB + B^2',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Hằng đẳng thức số 3: Hiệu hai bình phương A² - B² = (A - B)(A + B).',
    hint: 'Tích của tổng và hiệu hai biểu thức.'
  },
  {
    id: 'bm-g8-2',
    grade: 8,
    topic: 'geometry',
    topicName: 'Định Lý Pythagoras',
    questionText: 'Tam giác vuông có hai cạnh góc vuông là 6 cm và 8 cm. Độ dài cạnh huyền là:',
    options: [
      {
        text: '12 cm',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '10 cm',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '14 cm',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 1,
    explanation: 'Theo định lý Pythagoras: c² = 6² + 8² = 36 + 64 = 100 => c = 10 cm (Bộ 3 số Pitago 3-4-5 nhân đôi).',
    hint: 'Căn bậc hai của (36 + 64).'
  },
  {
    id: 'bm-g9-1',
    grade: 9,
    topic: 'algebra',
    topicName: 'Căn Thức Bậc Hai',
    questionText: 'Rút gọn biểu thức chứa căn bậc hai sau:',
    formula: '\\sqrt{48} - \\sqrt{27} + \\sqrt{75}',
    options: [
      {
        text: '6\\sqrt{3}',
        formula: '6\\sqrt{3}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '4\\sqrt{3}',
        formula: '4\\sqrt{3}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '8\\sqrt{3}',
        formula: '8\\sqrt{3}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '√48 = 4√3, √27 = 3√3, √75 = 5√3. Do đó: 4√3 - 3√3 + 5√3 = 6√3.',
    hint: 'Đưa thừa số ra ngoài dấu căn: 48 = 16×3, 27 = 9×3, 75 = 25×3.'
  },
  {
    id: 'bm-g9-2',
    grade: 9,
    topic: 'equation',
    topicName: 'Hệ Phương Trình Bậc Nhất',
    questionText: 'Nghiệm (x; y) của hệ phương trình sau là:',
    formula: '\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}',
    options: [
      {
        text: '(x = 3; y = 1)',
        formula: '(3; 1)',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        color: 'blue'
      },
      {
        text: '(x = 4; y = -1)',
        formula: '(4; -1)',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        color: 'red'
      },
      {
        text: '(x = 2; y = 3)',
        formula: '(2; 3)',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Cộng hai phương trình vế theo vế: 3x = 9 => x = 3. Thay vào pt (2): 3 - y = 2 => y = 1.',
    hint: 'Cộng hai phương trình để triệt tiêu biến y!'
  }
];
