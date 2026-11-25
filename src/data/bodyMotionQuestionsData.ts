import { BodyMotionQuestion } from '../types/math';

export const initialBodyMotionQuestions: BodyMotionQuestion[] = [
  // Question 1: Exactly as shown in the user's classroom picture!
  {
    id: 'bm-photo-1',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số Tự Nhiên & Cấu Tạo Số',
    topicNameEn: 'Natural Numbers & Place Value',
    questionText: 'Dùng mỗi chữ số 2, 0, 7, 5, 1, 9, 4, 3, 6 đúng một lần, số lớn nhất có thể lập được là:',
    questionTextEn: 'Using each digit 2, 0, 7, 5, 1, 9, 4, 3, 6 exactly once, what is the largest number you can form?',
    options: [
      {
        text: '976 543 210',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '976 543 201',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '967 543 210',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Để số lập được là lớn nhất, ta sắp xếp các chữ số theo thứ tự giảm dần từ hàng cao nhất đến hàng thấp nhất: 9, 7, 6, 5, 4, 3, 2, 1, 0 => được số 976 543 210.',
    explanationEn: 'To form the largest number, arrange the digits in descending order from left to right: 9, 7, 6, 5, 4, 3, 2, 1, 0 -> 976 543 210.',
    hint: 'Sắp xếp các chữ số giảm dần từ trái sang phải!',
    hintEn: 'Arrange the digits from largest to smallest from left to right!'
  },
  {
    id: 'bm-g6-2',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Số Nguyên & Phép Tính',
    topicNameEn: 'Integers & Operations',
    questionText: 'Kết quả của phép tính sau là bao nhiêu?',
    questionTextEn: 'What is the result of the following expression?',
    formula: '(-15) + (-25) - (-10)',
    options: [
      {
        text: '-30',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '-50',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '20',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '(-15) + (-25) - (-10) = -40 + 10 = -30.',
    explanationEn: '(-15) + (-25) - (-10) = -40 + 10 = -30.',
    hint: 'Trừ cho số âm tương đương với cộng số đối của nó!',
    hintEn: 'Subtracting a negative number is the same as adding its opposite!'
  },
  {
    id: 'bm-g6-3',
    grade: 6,
    topic: 'arithmetic',
    topicName: 'Dấu Hiệu Chia Hết',
    topicNameEn: 'Divisibility Rules',
    questionText: 'Số nào sau đây chia hết cho cả 2, 3 và 5?',
    questionTextEn: 'Which of the following numbers is divisible by 2, 3, and 5?',
    options: [
      {
        text: '1 245',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      },
      {
        text: '2 340',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '3 512',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      }
    ],
    correctIndex: 1,
    explanation: 'Số chia hết cho cả 2 và 5 có chữ số tận cùng là 0. Số 2 340 có tận cùng là 0 và tổng các chữ số 2+3+4+0 = 9 chia hết cho 3.',
    explanationEn: 'A number divisible by both 2 and 5 ends in 0. 2 340 ends in 0 and the sum of its digits 2+3+4+0 = 9 is divisible by 3.',
    hint: 'Tận cùng là 0 và tổng các chữ số chia hết cho 3.',
    hintEn: 'Last digit must be 0 and the digit sum must be divisible by 3.'
  },
  {
    id: 'bm-g6-4',
    grade: 6,
    topic: 'geometry',
    topicName: 'Hình Học Trực Quan',
    topicNameEn: 'Visual Geometry',
    questionText: 'Một hình thoi có độ dài hai đường chéo là 8 cm và 10 cm. Diện tích hình thoi đó là:',
    questionTextEn: 'A rhombus has diagonals of length 8 cm and 10 cm. What is its area?',
    options: [
      {
        text: '80 cm²',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '40 cm²',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '36 cm²',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 1,
    explanation: 'Diện tích hình thoi = (d₁ × d₂) : 2 = (8 × 10) : 2 = 40 cm².',
    explanationEn: 'Area of a rhombus = (d1 × d2) / 2 = (8 × 10) / 2 = 40 cm².',
    hint: 'Lấy tích hai đường chéo chia cho 2.',
    hintEn: 'Multiply the two diagonals and divide by 2.'
  },
  {
    id: 'bm-g7-1',
    grade: 7,
    topic: 'rational',
    topicName: 'Số Hữu Tỉ & Lũy Thừa',
    topicNameEn: 'Rational Numbers & Exponents',
    questionText: 'Giá trị của biểu thức lũy thừa sau là:',
    questionTextEn: 'What is the value of this power expression?',
    formula: '\\left(-\\frac{2}{3}\\right)^3',
    options: [
      {
        text: '-\\frac{8}{27}',
        formula: '-\\frac{8}{27}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '\\frac{8}{27}',
        formula: '\\frac{8}{27}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '-\\frac{6}{9}',
        formula: '-\\frac{6}{9}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '(-2/3)³ = (-2)³ / 3³ = -8 / 27 (số âm với số mũ lẻ vẫn mang dấu âm).',
    explanationEn: '(-2/3)^3 = (-2)^3 / 3^3 = -8 / 27 (a negative base to an odd power stays negative).',
    hint: 'Số mũ 3 là số lẻ nên kết quả mang dấu âm.',
    hintEn: 'Exponent 3 is odd, so the result stays negative.'
  },
  {
    id: 'bm-g7-2',
    grade: 7,
    topic: 'geometry',
    topicName: 'Tam Giác & Góc',
    topicNameEn: 'Triangles & Angles',
    questionText: 'Trong tam giác ABC vuông tại A có góc B = 35°. Số đo của góc C là:',
    questionTextEn: 'In right triangle ABC (right angle at A), angle B = 35°. What is the measure of angle C?',
    options: [
      {
        text: '65°',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      },
      {
        text: '55°',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '45°',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      }
    ],
    correctIndex: 1,
    explanation: 'Trong tam giác vuông, hai góc nhọn phụ nhau: góc C = 90° - góc B = 90° - 35° = 55°.',
    explanationEn: 'In a right triangle, the two acute angles sum to 90°: angle C = 90° - 35° = 55°.',
    hint: 'Tổng hai góc nhọn trong tam giác vuông bằng 90°.',
    hintEn: 'The two acute angles in a right triangle add up to 90°.'
  },
  {
    id: 'bm-g7-3',
    grade: 7,
    topic: 'statistics',
    topicName: 'Xác Suất Thực Nghiệm',
    topicNameEn: 'Probability',
    questionText: 'Gieo một con xúc xắc cân đối 6 mặt một lần. Xác suất để xuất hiện mặt có số chấm chẵn là:',
    questionTextEn: 'Roll a fair 6-sided die once. What is the probability of getting an even number?',
    options: [
      {
        text: '\\frac{1}{2}',
        formula: '\\frac{1}{2}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '\\frac{1}{3}',
        formula: '\\frac{1}{3}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '\\frac{1}{6}',
        formula: '\\frac{1}{6}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Có 3 mặt chẵn {2, 4, 6} trên tổng 6 mặt, nên P = 3/6 = 1/2.',
    explanationEn: 'There are 3 even faces {2, 4, 6} out of 6 total faces, so P = 3/6 = 1/2.',
    hint: 'Đếm các số chẵn từ 1 đến 6.',
    hintEn: 'Count the even numbers from 1 to 6.'
  },
  {
    id: 'bm-g8-1',
    grade: 8,
    topic: 'algebra',
    topicName: 'Hằng Đẳng Thức Đáng Nhớ',
    topicNameEn: 'Algebraic Identities',
    questionText: 'Khai triển hằng đẳng thức hiệu hai bình phương đúng là:',
    questionTextEn: 'Which is the correct expansion of the difference of two squares?',
    formula: 'A^2 - B^2 = ?',
    options: [
      {
        text: '(A - B)(A + B)',
        formula: '(A - B)(A + B)',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '(A - B)^2',
        formula: '(A - B)^2',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: 'A^2 - 2AB + B^2',
        formula: 'A^2 - 2AB + B^2',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Hằng đẳng thức số 3: Hiệu hai bình phương A² - B² = (A - B)(A + B).',
    explanationEn: 'Difference of squares identity: A² - B² = (A - B)(A + B).',
    hint: 'Tích của tổng và hiệu hai biểu thức.',
    hintEn: 'The product of the sum and difference of two terms.'
  },
  {
    id: 'bm-g8-2',
    grade: 8,
    topic: 'geometry',
    topicName: 'Định Lý Pythagoras',
    topicNameEn: 'Pythagorean Theorem',
    questionText: 'Tam giác vuông có hai cạnh góc vuông là 6 cm và 8 cm. Độ dài cạnh huyền là:',
    questionTextEn: 'A right triangle has legs of 6 cm and 8 cm. What is the length of its hypotenuse?',
    options: [
      {
        text: '12 cm',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '10 cm',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '14 cm',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 1,
    explanation: 'Theo định lý Pythagoras: c² = 6² + 8² = 36 + 64 = 100 => c = 10 cm (Bộ 3 số Pitago 3-4-5 nhân đôi).',
    explanationEn: 'By the Pythagorean theorem: c² = 6² + 8² = 36 + 64 = 100 -> c = 10 cm.',
    hint: 'Căn bậc hai của (36 + 64).',
    hintEn: 'Take the square root of (36 + 64).'
  },
  {
    id: 'bm-g8-3',
    grade: 8,
    topic: 'equation',
    topicName: 'Phương Trình Bậc Nhất',
    topicNameEn: 'Linear Equations',
    questionText: 'Nghiệm của phương trình bậc nhất sau là:',
    questionTextEn: 'What is the solution to the following linear equation?',
    formula: '3x - 7 = 11',
    options: [
      {
        text: 'x = 6',
        formula: 'x = 6',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: 'x = 4',
        formula: 'x = 4',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: 'x = 18',
        formula: 'x = 18',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '3x = 11 + 7 = 18 => x = 18 : 3 = 6.',
    explanationEn: '3x = 11 + 7 = 18 -> x = 18 / 3 = 6.',
    hint: 'Chuyển -7 sang vế phải thành +7 rồi chia cho 3.',
    hintEn: 'Add 7 to both sides, then divide by 3.'
  },
  {
    id: 'bm-g9-1',
    grade: 9,
    topic: 'algebra',
    topicName: 'Căn Thức Bậc Hai',
    topicNameEn: 'Square Root Expressions',
    questionText: 'Rút gọn biểu thức chứa căn bậc hai sau:',
    questionTextEn: 'Simplify the following radical expression:',
    formula: '\\sqrt{48} - \\sqrt{27} + \\sqrt{75}',
    options: [
      {
        text: '6\\sqrt{3}',
        formula: '6\\sqrt{3}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '4\\sqrt{3}',
        formula: '4\\sqrt{3}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '8\\sqrt{3}',
        formula: '8\\sqrt{3}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: '√48 = 4√3, √27 = 3√3, √75 = 5√3. Do đó: 4√3 - 3√3 + 5√3 = 6√3.',
    explanationEn: '√48 = 4√3, √27 = 3√3, √75 = 5√3. Therefore 4√3 - 3√3 + 5√3 = 6√3.',
    hint: 'Đưa thừa số ra ngoài dấu căn: 48 = 16×3, 27 = 9×3, 75 = 25×3.',
    hintEn: 'Factor out perfect squares: 48 = 16×3, 27 = 9×3, 75 = 25×3.'
  },
  {
    id: 'bm-g9-2',
    grade: 9,
    topic: 'equation',
    topicName: 'Hệ Phương Trình Bậc Nhất',
    topicNameEn: 'Systems of Linear Equations',
    questionText: 'Nghiệm (x; y) của hệ phương trình sau là:',
    questionTextEn: 'What is the solution (x, y) to this system of equations?',
    formula: '\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}',
    options: [
      {
        text: '(x = 3; y = 1)',
        formula: '(3; 1)',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '(x = 4; y = -1)',
        formula: '(4; -1)',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '(x = 2; y = 3)',
        formula: '(2; 3)',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 0,
    explanation: 'Cộng hai phương trình vế theo vế: 3x = 9 => x = 3. Thay vào pt (2): 3 - y = 2 => y = 1.',
    explanationEn: 'Add both equations: 3x = 9 -> x = 3. Substitute into (2): 3 - y = 2 -> y = 1.',
    hint: 'Cộng hai phương trình để triệt tiêu biến y!',
    hintEn: 'Add the two equations together to eliminate y!'
  },
  {
    id: 'bm-g9-3',
    grade: 9,
    topic: 'geometry',
    topicName: 'Tỉ Số Lượng Giác',
    topicNameEn: 'Trigonometric Ratios',
    questionText: 'Giá trị lượng giác sin(30°) bằng bao nhiêu?',
    questionTextEn: 'What is the exact value of sin(30°)?',
    options: [
      {
        text: '\\frac{\\sqrt{3}}{2}',
        formula: '\\frac{\\sqrt{3}}{2}',
        pose: 'right_hand_up',
        poseLabel: 'Giơ tay phải lên cao',
        poseLabelEn: 'Raise right hand high',
        color: 'red'
      },
      {
        text: '\\frac{1}{2}',
        formula: '\\frac{1}{2}',
        pose: 'both_hands_up',
        poseLabel: 'Hai tay giơ cao qua đầu',
        poseLabelEn: 'Raise both hands high',
        color: 'blue'
      },
      {
        text: '\\frac{\\sqrt{2}}{2}',
        formula: '\\frac{\\sqrt{2}}{2}',
        pose: 'left_hand_up',
        poseLabel: 'Giơ tay trái lên cao',
        poseLabelEn: 'Raise left hand high',
        color: 'green'
      }
    ],
    correctIndex: 1,
    explanation: 'Giá trị lượng giác đặc biệt: sin(30°) = cos(60°) = 1/2.',
    explanationEn: 'Special trigonometric value: sin(30°) = cos(60°) = 1/2.',
    hint: 'Trong tam giác vuông có góc 30°, cạnh đối diện góc 30° bằng nửa cạnh huyền.',
    hintEn: 'In a 30-60-90 triangle, the leg opposite 30° is half the hypotenuse.'
  }
];
