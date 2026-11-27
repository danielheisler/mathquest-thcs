import { Student } from '../types/math';

// Đồng bộ trực tiếp 80 Học sinh & 80 Phụ huynh từ bộ file Excel danh_sach_tai_khoan_lop/
// Mật khẩu chung toàn hệ thống: Học sinh = HS201102 | Phụ huynh = PH201102
export const ROSTER_DATA_VERSION = 'v3_80_accounts_HS201102_PH201102';

export const CLASS_STUDENT_IDS: Record<string, string[]> = {
  "class-6a1": [
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "s6",
    "s7",
    "s8",
    "s9",
    "s10",
    "s11",
    "s12",
    "s13",
    "s14",
    "s15",
    "s16",
    "s17",
    "s18",
    "s19",
    "s20"
  ],
  "class-7a2": [
    "s21",
    "s22",
    "s23",
    "s24",
    "s25",
    "s26",
    "s27",
    "s28",
    "s29",
    "s30",
    "s31",
    "s32",
    "s33",
    "s34",
    "s35",
    "s36",
    "s37",
    "s38",
    "s39",
    "s40"
  ],
  "class-8b": [
    "s41",
    "s42",
    "s43",
    "s44",
    "s45",
    "s46",
    "s47",
    "s48",
    "s49",
    "s50",
    "s51",
    "s52",
    "s53",
    "s54",
    "s55",
    "s56",
    "s57",
    "s58",
    "s59",
    "s60"
  ],
  "class-9c": [
    "s61",
    "s62",
    "s63",
    "s64",
    "s65",
    "s66",
    "s67",
    "s68",
    "s69",
    "s70",
    "s71",
    "s72",
    "s73",
    "s74",
    "s75",
    "s76",
    "s77",
    "s78",
    "s79",
    "s80"
  ]
};

export const syncedRosterStudents: Student[] = [
  {
    "id": "s1",
    "name": "Võ Phương Nhi",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-1-6A1",
    "overallScore": 9.1,
    "gamesPlayed": 15,
    "accuracyRate": 90,
    "averageTimeSec": 9.7,
    "badge": "Vua Tốc Độ Số Học",
    "topicsMastery": {
      "arithmetic": 91,
      "rational": 88,
      "algebra": 89,
      "equation": 90,
      "geometry": 91,
      "statistics": 91
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 910,
        "timeSec": 48,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "08/04/2014",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0792246341",
    "accountCode": "HS01",
    "accountPassword": "HS201102",
    "parentPhone": "0907382642",
    "parentName": "Bác Võ Văn Phước (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tư duy số học nhanh, tích cực tham gia trò chơi khởi động."
  },
  {
    "id": "s2",
    "name": "Hoàng Thanh Hân",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-2-6A1",
    "overallScore": 8.4,
    "gamesPlayed": 16,
    "accuracyRate": 84,
    "averageTimeSec": 11.8,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 86,
      "rational": 81,
      "algebra": 84,
      "equation": 85,
      "geometry": 84,
      "statistics": 86
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 840,
        "timeSec": 59,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "15/07/2014",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0917291109",
    "accountCode": "HS02",
    "accountPassword": "HS201102",
    "parentPhone": "0983411509",
    "parentName": "Cô Đinh Mỹ Hoa (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Trình bày bài giải cẩn thận, nắm vững phân tích thừa số nguyên tố."
  },
  {
    "id": "s3",
    "name": "Trần Tuấn Dũng",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-3-6A1",
    "overallScore": 7.7,
    "gamesPlayed": 17,
    "accuracyRate": 78,
    "averageTimeSec": 13.9,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 81,
      "rational": 78,
      "algebra": 79,
      "equation": 77,
      "geometry": 77,
      "statistics": 77
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 770,
        "timeSec": 69,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "22/10/2014",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0704926641",
    "accountCode": "HS03",
    "accountPassword": "HS201102",
    "parentPhone": "0708746207",
    "parentName": "Bác Trần Xuân Phước (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tiến bộ rõ rệt phần Hình học trực quan và tính diện tích tứ giác."
  },
  {
    "id": "s4",
    "name": "Phạm Đức Tài",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-4-6A1",
    "overallScore": 9.4,
    "gamesPlayed": 18,
    "accuracyRate": 92,
    "averageTimeSec": 8.8,
    "badge": "Chiến Binh Toán Học",
    "topicsMastery": {
      "arithmetic": 92,
      "rational": 91,
      "algebra": 91,
      "equation": 92,
      "geometry": 90,
      "statistics": 92
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 940,
        "timeSec": 44,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "02/01/2014",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0359578845",
    "accountCode": "HS04",
    "accountPassword": "HS201102",
    "parentPhone": "0382545202",
    "parentName": "Cô Lê Phương Dung (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hăng hái phát biểu, làm việc nhóm hiệu quả trong giờ Toán 6."
  },
  {
    "id": "s5",
    "name": "Dương Gia Ngọc",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-5-6A1",
    "overallScore": 8.7,
    "gamesPlayed": 19,
    "accuracyRate": 86,
    "averageTimeSec": 10.9,
    "badge": "Vua Tốc Độ Số Học",
    "topicsMastery": {
      "arithmetic": 87,
      "rational": 84,
      "algebra": 86,
      "equation": 87,
      "geometry": 88,
      "statistics": 87
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 869,
        "timeSec": 54,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "09/04/2014",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0363365840",
    "accountCode": "HS05",
    "accountPassword": "HS201102",
    "parentPhone": "0936809769",
    "parentName": "Bác Dương Văn Cường (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tư duy số học nhanh, tích cực tham gia trò chơi khởi động."
  },
  {
    "id": "s6",
    "name": "Phan Minh Phúc",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-6-6A1",
    "overallScore": 8.0,
    "gamesPlayed": 20,
    "accuracyRate": 80,
    "averageTimeSec": 13.0,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 82,
      "rational": 77,
      "algebra": 81,
      "equation": 79,
      "geometry": 81,
      "statistics": 82
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 800,
        "timeSec": 65,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "16/07/2014",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0934369837",
    "accountCode": "HS06",
    "accountPassword": "HS201102",
    "parentPhone": "0987772904",
    "parentName": "Bác Phan Đức Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Trình bày bài giải cẩn thận, nắm vững phân tích thừa số nguyên tố."
  },
  {
    "id": "s7",
    "name": "Đặng Bảo Hằng",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-7-6A1",
    "overallScore": 9.7,
    "gamesPlayed": 21,
    "accuracyRate": 98,
    "averageTimeSec": 7.9,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 99,
      "rational": 97,
      "algebra": 96,
      "equation": 97,
      "geometry": 97,
      "statistics": 96
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 969,
        "timeSec": 39,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "23/10/2014",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0970147632",
    "accountCode": "HS07",
    "accountPassword": "HS201102",
    "parentPhone": "0913415022",
    "parentName": "Cô Huỳnh Thu Hạnh (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Tiến bộ rõ rệt phần Hình học trực quan và tính diện tích tứ giác."
  },
  {
    "id": "s8",
    "name": "Đặng Quỳnh Vy",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-8-6A1",
    "overallScore": 9.0,
    "gamesPlayed": 22,
    "accuracyRate": 88,
    "averageTimeSec": 10.0,
    "badge": "Chiến Binh Toán Học",
    "topicsMastery": {
      "arithmetic": 88,
      "rational": 87,
      "algebra": 88,
      "equation": 89,
      "geometry": 87,
      "statistics": 88
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 900,
        "timeSec": 50,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "03/01/2014",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0389596246",
    "accountCode": "HS08",
    "accountPassword": "HS201102",
    "parentPhone": "0350957591",
    "parentName": "Bác Đặng Ngọc Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hăng hái phát biểu, làm việc nhóm hiệu quả trong giờ Toán 6."
  },
  {
    "id": "s9",
    "name": "Trịnh Gia Huy",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-9-6A1",
    "overallScore": 8.3,
    "gamesPlayed": 23,
    "accuracyRate": 82,
    "averageTimeSec": 12.1,
    "badge": "Vua Tốc Độ Số Học",
    "topicsMastery": {
      "arithmetic": 83,
      "rational": 80,
      "algebra": 83,
      "equation": 81,
      "geometry": 80,
      "statistics": 83
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 830,
        "timeSec": 60,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "10/04/2014",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0918792629",
    "accountCode": "HS09",
    "accountPassword": "HS201102",
    "parentPhone": "0937677410",
    "parentName": "Bác Trịnh Quốc Hải (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tư duy số học nhanh, tích cực tham gia trò chơi khởi động."
  },
  {
    "id": "s10",
    "name": "Lý Đức Kiệt",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-10-6A1",
    "overallScore": 7.6,
    "gamesPlayed": 24,
    "accuracyRate": 76,
    "averageTimeSec": 14.2,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 78,
      "rational": 73,
      "algebra": 75,
      "equation": 76,
      "geometry": 78,
      "statistics": 78
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 760,
        "timeSec": 71,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "17/07/2014",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0908015281",
    "accountCode": "HS10",
    "accountPassword": "HS201102",
    "parentPhone": "0322207509",
    "parentName": "Cô Đỗ Thanh Hương (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Trình bày bài giải cẩn thận, nắm vững phân tích thừa số nguyên tố."
  },
  {
    "id": "s11",
    "name": "Ngô Gia Vy",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-11-6A1",
    "overallScore": 9.3,
    "gamesPlayed": 25,
    "accuracyRate": 94,
    "averageTimeSec": 9.1,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 97,
      "rational": 94,
      "algebra": 94,
      "equation": 95,
      "geometry": 95,
      "statistics": 93
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 930,
        "timeSec": 45,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "24/10/2014",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0353020406",
    "accountCode": "HS11",
    "accountPassword": "HS201102",
    "parentPhone": "0862314887",
    "parentName": "Bác Ngô Ngọc Bình (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tiến bộ rõ rệt phần Hình học trực quan và tính diện tích tứ giác."
  },
  {
    "id": "s12",
    "name": "Vũ Quỳnh Tâm",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-12-6A1",
    "overallScore": 8.6,
    "gamesPlayed": 26,
    "accuracyRate": 84,
    "averageTimeSec": 11.2,
    "badge": "Chiến Binh Toán Học",
    "topicsMastery": {
      "arithmetic": 84,
      "rational": 83,
      "algebra": 85,
      "equation": 83,
      "geometry": 84,
      "statistics": 84
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 860,
        "timeSec": 56,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "04/01/2014",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0709509507",
    "accountCode": "HS12",
    "accountPassword": "HS201102",
    "parentPhone": "0866245143",
    "parentName": "Cô Trần Thị Hương (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hăng hái phát biểu, làm việc nhóm hiệu quả trong giờ Toán 6."
  },
  {
    "id": "s13",
    "name": "Võ Bảo Quân",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-13-6A1",
    "overallScore": 7.9,
    "gamesPlayed": 27,
    "accuracyRate": 78,
    "averageTimeSec": 13.3,
    "badge": "Vua Tốc Độ Số Học",
    "topicsMastery": {
      "arithmetic": 79,
      "rational": 76,
      "algebra": 77,
      "equation": 78,
      "geometry": 77,
      "statistics": 79
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 790,
        "timeSec": 66,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "11/04/2014",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0709324200",
    "accountCode": "HS13",
    "accountPassword": "HS201102",
    "parentPhone": "0913787931",
    "parentName": "Bác Võ Đức An (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tư duy số học nhanh, tích cực tham gia trò chơi khởi động."
  },
  {
    "id": "s14",
    "name": "Trần Anh Khang",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-14-6A1",
    "overallScore": 9.6,
    "gamesPlayed": 28,
    "accuracyRate": 96,
    "averageTimeSec": 8.2,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 98,
      "rational": 93,
      "algebra": 96,
      "equation": 97,
      "geometry": 94,
      "statistics": 98
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 960,
        "timeSec": 41,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "18/07/2014",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0707440467",
    "accountCode": "HS14",
    "accountPassword": "HS201102",
    "parentPhone": "0350850541",
    "parentName": "Cô Trần Ngọc Dung (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Trình bày bài giải cẩn thận, nắm vững phân tích thừa số nguyên tố."
  },
  {
    "id": "s15",
    "name": "Trịnh Gia Long",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-15-6A1",
    "overallScore": 8.9,
    "gamesPlayed": 29,
    "accuracyRate": 90,
    "averageTimeSec": 10.3,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 93,
      "rational": 90,
      "algebra": 91,
      "equation": 89,
      "geometry": 92,
      "statistics": 89
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 890,
        "timeSec": 51,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "25/10/2014",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0942500956",
    "accountCode": "HS15",
    "accountPassword": "HS201102",
    "parentPhone": "0701754557",
    "parentName": "Bác Trịnh Ngọc Sơn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tiến bộ rõ rệt phần Hình học trực quan và tính diện tích tứ giác."
  },
  {
    "id": "s16",
    "name": "Trần Quốc Huy",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-16-6A1",
    "overallScore": 8.2,
    "gamesPlayed": 30,
    "accuracyRate": 80,
    "averageTimeSec": 12.4,
    "badge": "Chiến Binh Toán Học",
    "topicsMastery": {
      "arithmetic": 80,
      "rational": 79,
      "algebra": 79,
      "equation": 80,
      "geometry": 81,
      "statistics": 80
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 819,
        "timeSec": 62,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "05/01/2014",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0903143766",
    "accountCode": "HS16",
    "accountPassword": "HS201102",
    "parentPhone": "0912234342",
    "parentName": "Bác Trần Minh Sơn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hăng hái phát biểu, làm việc nhóm hiệu quả trong giờ Toán 6."
  },
  {
    "id": "s17",
    "name": "Ngô Bảo Duyên",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-17-6A1",
    "overallScore": 7.5,
    "gamesPlayed": 31,
    "accuracyRate": 74,
    "averageTimeSec": 14.5,
    "badge": "Vua Tốc Độ Số Học",
    "topicsMastery": {
      "arithmetic": 75,
      "rational": 72,
      "algebra": 74,
      "equation": 75,
      "geometry": 74,
      "statistics": 75
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 750,
        "timeSec": 72,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "12/04/2014",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0963888820",
    "accountCode": "HS17",
    "accountPassword": "HS201102",
    "parentPhone": "0977013910",
    "parentName": "Bác Ngô Minh Bình (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tư duy số học nhanh, tích cực tham gia trò chơi khởi động."
  },
  {
    "id": "s18",
    "name": "Đinh Thảo Châu",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-18-6A1",
    "overallScore": 9.2,
    "gamesPlayed": 32,
    "accuracyRate": 92,
    "averageTimeSec": 9.4,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 94,
      "rational": 89,
      "algebra": 93,
      "equation": 91,
      "geometry": 91,
      "statistics": 94
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 919,
        "timeSec": 47,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "19/07/2014",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0935052444",
    "accountCode": "HS18",
    "accountPassword": "HS201102",
    "parentPhone": "0347542764",
    "parentName": "Cô Đinh Hồng Chi (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Trình bày bài giải cẩn thận, nắm vững phân tích thừa số nguyên tố."
  },
  {
    "id": "s19",
    "name": "Hoàng Gia Nhi",
    "classId": "class-6a1",
    "gender": "female",
    "avatarSeed": "mq-19-6A1",
    "overallScore": 8.5,
    "gamesPlayed": 33,
    "accuracyRate": 86,
    "averageTimeSec": 11.5,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 89,
      "rational": 86,
      "algebra": 85,
      "equation": 86,
      "geometry": 84,
      "statistics": 85
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 850,
        "timeSec": 57,
        "totalQuestions": 10
      }
    ],
    "attendance": "late",
    "dateOfBirth": "26/10/2014",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0965668338",
    "accountCode": "HS19",
    "accountPassword": "HS201102",
    "parentPhone": "0918401983",
    "parentName": "Bác Hoàng Quốc Tuấn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Tiến bộ rõ rệt phần Hình học trực quan và tính diện tích tứ giác."
  },
  {
    "id": "s20",
    "name": "Ngô Đức Hùng",
    "classId": "class-6a1",
    "gender": "male",
    "avatarSeed": "mq-20-6A1",
    "overallScore": 7.8,
    "gamesPlayed": 14,
    "accuracyRate": 76,
    "averageTimeSec": 13.6,
    "badge": "Chiến Binh Toán Học",
    "topicsMastery": {
      "arithmetic": 76,
      "rational": 75,
      "algebra": 76,
      "equation": 77,
      "geometry": 78,
      "statistics": 76
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 780,
        "timeSec": 68,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "06/01/2014",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0366362116",
    "accountCode": "HS20",
    "accountPassword": "HS201102",
    "parentPhone": "0329882278",
    "parentName": "Bác Ngô Văn Bình (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hăng hái phát biểu, làm việc nhóm hiệu quả trong giờ Toán 6."
  },
  {
    "id": "s21",
    "name": "Trịnh Tuấn Dũng",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-21-7A2",
    "overallScore": 9.5,
    "gamesPlayed": 15,
    "accuracyRate": 94,
    "averageTimeSec": 8.5,
    "badge": "Thần Đồng Số Hữu Tỉ",
    "topicsMastery": {
      "arithmetic": 95,
      "rational": 92,
      "algebra": 95,
      "equation": 93,
      "geometry": 95,
      "statistics": 95
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 950,
        "timeSec": 42,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "13/04/2013",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0380901332",
    "accountCode": "HS21",
    "accountPassword": "HS201102",
    "parentPhone": "0326797088",
    "parentName": "Cô Trịnh Phương Thảo (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Nắm chắc phép tính số hữu tỉ và tỉ lệ thức, tốc độ làm bài tốt."
  },
  {
    "id": "s22",
    "name": "Đặng Ngọc Nhi",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-22-7A2",
    "overallScore": 8.8,
    "gamesPlayed": 16,
    "accuracyRate": 88,
    "averageTimeSec": 10.6,
    "badge": "Phù Thủy Hình Học",
    "topicsMastery": {
      "arithmetic": 90,
      "rational": 85,
      "algebra": 87,
      "equation": 88,
      "geometry": 88,
      "statistics": 90
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 880,
        "timeSec": 53,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "20/07/2013",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0708545014",
    "accountCode": "HS22",
    "accountPassword": "HS201102",
    "parentPhone": "0972063994",
    "parentName": "Bác Đặng Đức Đức (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh hai tam giác bằng nhau mạch lạc, vẽ hình chuẩn xác."
  },
  {
    "id": "s23",
    "name": "Đinh Mỹ Tâm",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-23-7A2",
    "overallScore": 8.1,
    "gamesPlayed": 17,
    "accuracyRate": 82,
    "averageTimeSec": 12.7,
    "badge": "Tay Đua Bền Bỉ",
    "topicsMastery": {
      "arithmetic": 85,
      "rational": 82,
      "algebra": 82,
      "equation": 83,
      "geometry": 81,
      "statistics": 81
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 810,
        "timeSec": 63,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "27/10/2013",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0791884786",
    "accountCode": "HS23",
    "accountPassword": "HS201102",
    "parentPhone": "0329707485",
    "parentName": "Cô Đinh Ngọc Chi (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng tốt bất đẳng thức tam giác và tổng ba góc trong tam giác."
  },
  {
    "id": "s24",
    "name": "Lý Khánh Duyên",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-24-7A2",
    "overallScore": 7.4,
    "gamesPlayed": 18,
    "accuracyRate": 72,
    "averageTimeSec": 14.8,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 72,
      "rational": 71,
      "algebra": 73,
      "equation": 71,
      "geometry": 70,
      "statistics": 72
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 740,
        "timeSec": 74,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "07/01/2013",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0868617989",
    "accountCode": "HS24",
    "accountPassword": "HS201102",
    "parentPhone": "0983492452",
    "parentName": "Cô Lý Thanh Nga (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chăm chỉ hoàn thành bài tập về nhà đúng hạn trên MathQuest."
  },
  {
    "id": "s25",
    "name": "Trần Đức Dũng",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-25-7A2",
    "overallScore": 9.1,
    "gamesPlayed": 19,
    "accuracyRate": 90,
    "averageTimeSec": 9.7,
    "badge": "Thần Đồng Số Hữu Tỉ",
    "topicsMastery": {
      "arithmetic": 91,
      "rational": 88,
      "algebra": 89,
      "equation": 90,
      "geometry": 92,
      "statistics": 91
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 910,
        "timeSec": 48,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "14/04/2013",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0385935758",
    "accountCode": "HS25",
    "accountPassword": "HS201102",
    "parentPhone": "0968944072",
    "parentName": "Bác Trần Minh Tuấn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Nắm chắc phép tính số hữu tỉ và tỉ lệ thức, tốc độ làm bài tốt."
  },
  {
    "id": "s26",
    "name": "Ngô Quang Long",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-26-7A2",
    "overallScore": 8.4,
    "gamesPlayed": 20,
    "accuracyRate": 84,
    "averageTimeSec": 11.8,
    "badge": "Phù Thủy Hình Học",
    "topicsMastery": {
      "arithmetic": 86,
      "rational": 81,
      "algebra": 84,
      "equation": 85,
      "geometry": 85,
      "statistics": 86
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 840,
        "timeSec": 59,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "21/07/2013",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0968659457",
    "accountCode": "HS26",
    "accountPassword": "HS201102",
    "parentPhone": "0355973819",
    "parentName": "Bác Ngô Minh Đức (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh hai tam giác bằng nhau mạch lạc, vẽ hình chuẩn xác."
  },
  {
    "id": "s27",
    "name": "Lê Đức Thịnh",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-27-7A2",
    "overallScore": 7.7,
    "gamesPlayed": 21,
    "accuracyRate": 78,
    "averageTimeSec": 13.9,
    "badge": "Tay Đua Bền Bỉ",
    "topicsMastery": {
      "arithmetic": 81,
      "rational": 78,
      "algebra": 79,
      "equation": 77,
      "geometry": 78,
      "statistics": 77
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 770,
        "timeSec": 69,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "01/10/2013",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0795094967",
    "accountCode": "HS27",
    "accountPassword": "HS201102",
    "parentPhone": "0961490956",
    "parentName": "Cô Lê Thu Lan (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng tốt bất đẳng thức tam giác và tổng ba góc trong tam giác."
  },
  {
    "id": "s28",
    "name": "Phan Thùy Tâm",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-28-7A2",
    "overallScore": 9.4,
    "gamesPlayed": 22,
    "accuracyRate": 92,
    "averageTimeSec": 8.8,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 92,
      "rational": 91,
      "algebra": 91,
      "equation": 92,
      "geometry": 91,
      "statistics": 92
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 940,
        "timeSec": 44,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "08/01/2013",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0707421209",
    "accountCode": "HS28",
    "accountPassword": "HS201102",
    "parentPhone": "0707246451",
    "parentName": "Bác Phan Thanh Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chăm chỉ hoàn thành bài tập về nhà đúng hạn trên MathQuest."
  },
  {
    "id": "s29",
    "name": "Vũ Ngọc Châu",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-29-7A2",
    "overallScore": 8.7,
    "gamesPlayed": 23,
    "accuracyRate": 86,
    "averageTimeSec": 10.9,
    "badge": "Thần Đồng Số Hữu Tỉ",
    "topicsMastery": {
      "arithmetic": 87,
      "rational": 84,
      "algebra": 86,
      "equation": 87,
      "geometry": 84,
      "statistics": 87
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 869,
        "timeSec": 54,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "15/04/2013",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0974256403",
    "accountCode": "HS29",
    "accountPassword": "HS201102",
    "parentPhone": "0798823086",
    "parentName": "Bác Vũ Ngọc Hải (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Nắm chắc phép tính số hữu tỉ và tỉ lệ thức, tốc độ làm bài tốt."
  },
  {
    "id": "s30",
    "name": "Dương Gia Ngọc",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-30-7A2",
    "overallScore": 8.0,
    "gamesPlayed": 24,
    "accuracyRate": 80,
    "averageTimeSec": 13.0,
    "badge": "Phù Thủy Hình Học",
    "topicsMastery": {
      "arithmetic": 82,
      "rational": 77,
      "algebra": 81,
      "equation": 79,
      "geometry": 82,
      "statistics": 82
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 800,
        "timeSec": 65,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "22/07/2013",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0384391157",
    "accountCode": "HS30",
    "accountPassword": "HS201102",
    "parentPhone": "0936664520",
    "parentName": "Cô Bùi Ngọc Hoa (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh hai tam giác bằng nhau mạch lạc, vẽ hình chuẩn xác."
  },
  {
    "id": "s31",
    "name": "Hồ Minh Châu",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-31-7A2",
    "overallScore": 9.7,
    "gamesPlayed": 25,
    "accuracyRate": 98,
    "averageTimeSec": 7.9,
    "badge": "Tay Đua Bền Bỉ",
    "topicsMastery": {
      "arithmetic": 99,
      "rational": 97,
      "algebra": 96,
      "equation": 97,
      "geometry": 98,
      "statistics": 96
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 969,
        "timeSec": 39,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "02/10/2013",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0907445921",
    "accountCode": "HS31",
    "accountPassword": "HS201102",
    "parentPhone": "0939718053",
    "parentName": "Cô Hồ Thị Hoa (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng tốt bất đẳng thức tam giác và tổng ba góc trong tam giác."
  },
  {
    "id": "s32",
    "name": "Hồ Gia Hân",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-32-7A2",
    "overallScore": 9.0,
    "gamesPlayed": 26,
    "accuracyRate": 88,
    "averageTimeSec": 10.0,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 88,
      "rational": 87,
      "algebra": 88,
      "equation": 89,
      "geometry": 88,
      "statistics": 88
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 900,
        "timeSec": 50,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "09/01/2013",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0340921323",
    "accountCode": "HS32",
    "accountPassword": "HS201102",
    "parentPhone": "0905749624",
    "parentName": "Bác Hồ Hữu Lâm (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chăm chỉ hoàn thành bài tập về nhà đúng hạn trên MathQuest."
  },
  {
    "id": "s33",
    "name": "Phan Thùy Nhi",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-33-7A2",
    "overallScore": 8.3,
    "gamesPlayed": 27,
    "accuracyRate": 82,
    "averageTimeSec": 12.1,
    "badge": "Thần Đồng Số Hữu Tỉ",
    "topicsMastery": {
      "arithmetic": 83,
      "rational": 80,
      "algebra": 83,
      "equation": 81,
      "geometry": 81,
      "statistics": 83
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 830,
        "timeSec": 60,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "16/04/2013",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0791069514",
    "accountCode": "HS33",
    "accountPassword": "HS201102",
    "parentPhone": "0792185194",
    "parentName": "Bác Phan Văn Thắng (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Nắm chắc phép tính số hữu tỉ và tỉ lệ thức, tốc độ làm bài tốt."
  },
  {
    "id": "s34",
    "name": "Bùi Thảo Tâm",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-34-7A2",
    "overallScore": 7.6,
    "gamesPlayed": 28,
    "accuracyRate": 76,
    "averageTimeSec": 14.2,
    "badge": "Phù Thủy Hình Học",
    "topicsMastery": {
      "arithmetic": 78,
      "rational": 73,
      "algebra": 75,
      "equation": 76,
      "geometry": 74,
      "statistics": 78
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 760,
        "timeSec": 71,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "23/07/2013",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0915734115",
    "accountCode": "HS34",
    "accountPassword": "HS201102",
    "parentPhone": "0900339928",
    "parentName": "Cô Bùi Thị Hà (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh hai tam giác bằng nhau mạch lạc, vẽ hình chuẩn xác."
  },
  {
    "id": "s35",
    "name": "Bùi Đức Dũng",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-35-7A2",
    "overallScore": 9.3,
    "gamesPlayed": 29,
    "accuracyRate": 94,
    "averageTimeSec": 9.1,
    "badge": "Tay Đua Bền Bỉ",
    "topicsMastery": {
      "arithmetic": 97,
      "rational": 94,
      "algebra": 94,
      "equation": 95,
      "geometry": 96,
      "statistics": 93
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 930,
        "timeSec": 45,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "03/10/2013",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0919093114",
    "accountCode": "HS35",
    "accountPassword": "HS201102",
    "parentPhone": "0322175530",
    "parentName": "Cô Hoàng Thanh Hương (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng tốt bất đẳng thức tam giác và tổng ba góc trong tam giác."
  },
  {
    "id": "s36",
    "name": "Trịnh Ngọc Hân",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-36-7A2",
    "overallScore": 8.6,
    "gamesPlayed": 30,
    "accuracyRate": 84,
    "averageTimeSec": 11.2,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 84,
      "rational": 83,
      "algebra": 85,
      "equation": 83,
      "geometry": 85,
      "statistics": 84
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 860,
        "timeSec": 56,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "10/01/2013",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0946015357",
    "accountCode": "HS36",
    "accountPassword": "HS201102",
    "parentPhone": "0945728620",
    "parentName": "Bác Trịnh Văn Hùng (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chăm chỉ hoàn thành bài tập về nhà đúng hạn trên MathQuest."
  },
  {
    "id": "s37",
    "name": "Phan Thành Long",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-37-7A2",
    "overallScore": 7.9,
    "gamesPlayed": 31,
    "accuracyRate": 78,
    "averageTimeSec": 13.3,
    "badge": "Thần Đồng Số Hữu Tỉ",
    "topicsMastery": {
      "arithmetic": 79,
      "rational": 76,
      "algebra": 77,
      "equation": 78,
      "geometry": 78,
      "statistics": 79
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 790,
        "timeSec": 66,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "17/04/2013",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0369923495",
    "accountCode": "HS37",
    "accountPassword": "HS201102",
    "parentPhone": "0917616897",
    "parentName": "Bác Phan Thanh Tuấn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Nắm chắc phép tính số hữu tỉ và tỉ lệ thức, tốc độ làm bài tốt."
  },
  {
    "id": "s38",
    "name": "Phan Thành Bảo",
    "classId": "class-7a2",
    "gender": "male",
    "avatarSeed": "mq-38-7A2",
    "overallScore": 9.6,
    "gamesPlayed": 32,
    "accuracyRate": 96,
    "averageTimeSec": 8.2,
    "badge": "Phù Thủy Hình Học",
    "topicsMastery": {
      "arithmetic": 98,
      "rational": 93,
      "algebra": 96,
      "equation": 97,
      "geometry": 95,
      "statistics": 98
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 960,
        "timeSec": 41,
        "totalQuestions": 10
      }
    ],
    "attendance": "late",
    "dateOfBirth": "24/07/2013",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0322755075",
    "accountCode": "HS38",
    "accountPassword": "HS201102",
    "parentPhone": "0941951578",
    "parentName": "Bác Phan Văn Tuấn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh hai tam giác bằng nhau mạch lạc, vẽ hình chuẩn xác."
  },
  {
    "id": "s39",
    "name": "Vũ Gia Hằng",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-39-7A2",
    "overallScore": 8.9,
    "gamesPlayed": 33,
    "accuracyRate": 90,
    "averageTimeSec": 10.3,
    "badge": "Tay Đua Bền Bỉ",
    "topicsMastery": {
      "arithmetic": 93,
      "rational": 90,
      "algebra": 91,
      "equation": 89,
      "geometry": 88,
      "statistics": 89
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 890,
        "timeSec": 51,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "04/10/2013",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0384828227",
    "accountCode": "HS39",
    "accountPassword": "HS201102",
    "parentPhone": "0323222185",
    "parentName": "Bác Vũ Minh Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng tốt bất đẳng thức tam giác và tổng ba góc trong tam giác."
  },
  {
    "id": "s40",
    "name": "Hoàng Hoàng Thư",
    "classId": "class-7a2",
    "gender": "female",
    "avatarSeed": "mq-40-7A2",
    "overallScore": 8.2,
    "gamesPlayed": 14,
    "accuracyRate": 80,
    "averageTimeSec": 12.4,
    "badge": "Ngôi Sao Tri Thức",
    "topicsMastery": {
      "arithmetic": 80,
      "rational": 79,
      "algebra": 79,
      "equation": 80,
      "geometry": 82,
      "statistics": 80
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 819,
        "timeSec": 62,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "11/01/2013",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0368792040",
    "accountCode": "HS40",
    "accountPassword": "HS201102",
    "parentPhone": "0366651920",
    "parentName": "Bác Hoàng Xuân Phước (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chăm chỉ hoàn thành bài tập về nhà đúng hạn trên MathQuest."
  },
  {
    "id": "s41",
    "name": "Đặng Tuấn Dũng",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-41-8B",
    "overallScore": 7.5,
    "gamesPlayed": 15,
    "accuracyRate": 74,
    "averageTimeSec": 14.5,
    "badge": "Đại Sư Hằng Đẳng Thức",
    "topicsMastery": {
      "arithmetic": 75,
      "rational": 72,
      "algebra": 74,
      "equation": 75,
      "geometry": 75,
      "statistics": 75
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 750,
        "timeSec": 72,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "18/04/2012",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0363486272",
    "accountCode": "HS41",
    "accountPassword": "HS201102",
    "parentPhone": "0328453730",
    "parentName": "Bác Đặng Xuân Thắng (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Thành thạo 7 hằng đẳng thức đáng nhớ và phân tích đa thức thành nhân tử."
  },
  {
    "id": "s42",
    "name": "Ngô Minh Phúc",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-42-8B",
    "overallScore": 9.2,
    "gamesPlayed": 16,
    "accuracyRate": 92,
    "averageTimeSec": 9.4,
    "badge": "Bậc Thầy Pythagore",
    "topicsMastery": {
      "arithmetic": 94,
      "rational": 89,
      "algebra": 93,
      "equation": 91,
      "geometry": 92,
      "statistics": 94
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 919,
        "timeSec": 47,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "25/07/2012",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0702592905",
    "accountCode": "HS42",
    "accountPassword": "HS201102",
    "parentPhone": "0386461782",
    "parentName": "Bác Ngô Minh Lâm (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng rất tốt Định lí Pythagore và Định lí Thalès vào bài toán thực tế."
  },
  {
    "id": "s43",
    "name": "Đinh Phương Uyên",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-43-8B",
    "overallScore": 8.5,
    "gamesPlayed": 17,
    "accuracyRate": 86,
    "averageTimeSec": 11.5,
    "badge": "Chiến Binh Đại Số",
    "topicsMastery": {
      "arithmetic": 89,
      "rational": 86,
      "algebra": 85,
      "equation": 86,
      "geometry": 85,
      "statistics": 85
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 850,
        "timeSec": 57,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "05/10/2012",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0949467093",
    "accountCode": "HS43",
    "accountPassword": "HS201102",
    "parentPhone": "0382983428",
    "parentName": "Cô Dương Thị Hạnh (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu rõ hệ số góc và cách vẽ đồ thị hàm số bậc nhất y = ax + b."
  },
  {
    "id": "s44",
    "name": "Lý Bảo Anh",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-44-8B",
    "overallScore": 7.8,
    "gamesPlayed": 18,
    "accuracyRate": 76,
    "averageTimeSec": 13.6,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 76,
      "rational": 75,
      "algebra": 76,
      "equation": 77,
      "geometry": 74,
      "statistics": 76
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 780,
        "timeSec": 68,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "12/01/2012",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0357860231",
    "accountCode": "HS44",
    "accountPassword": "HS201102",
    "parentPhone": "0362922691",
    "parentName": "Cô Lê Thanh Mai (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Có tư duy giải toán bằng cách lập phương trình bậc nhất rất tốt."
  },
  {
    "id": "s45",
    "name": "Huỳnh Quang Khang",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-45-8B",
    "overallScore": 9.5,
    "gamesPlayed": 19,
    "accuracyRate": 94,
    "averageTimeSec": 8.5,
    "badge": "Đại Sư Hằng Đẳng Thức",
    "topicsMastery": {
      "arithmetic": 95,
      "rational": 92,
      "algebra": 95,
      "equation": 93,
      "geometry": 96,
      "statistics": 95
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 950,
        "timeSec": 42,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "19/04/2012",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0972559878",
    "accountCode": "HS45",
    "accountPassword": "HS201102",
    "parentPhone": "0367586272",
    "parentName": "Bác Huỳnh Thanh Thắng (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Thành thạo 7 hằng đẳng thức đáng nhớ và phân tích đa thức thành nhân tử."
  },
  {
    "id": "s46",
    "name": "Trần Hoàng Thịnh",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-46-8B",
    "overallScore": 8.8,
    "gamesPlayed": 20,
    "accuracyRate": 88,
    "averageTimeSec": 10.6,
    "badge": "Bậc Thầy Pythagore",
    "topicsMastery": {
      "arithmetic": 90,
      "rational": 85,
      "algebra": 87,
      "equation": 88,
      "geometry": 89,
      "statistics": 90
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 880,
        "timeSec": 53,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "26/07/2012",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0988940717",
    "accountCode": "HS46",
    "accountPassword": "HS201102",
    "parentPhone": "0865641585",
    "parentName": "Cô Bùi Thu Hà (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng rất tốt Định lí Pythagore và Định lí Thalès vào bài toán thực tế."
  },
  {
    "id": "s47",
    "name": "Hồ Minh Vy",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-47-8B",
    "overallScore": 8.1,
    "gamesPlayed": 21,
    "accuracyRate": 82,
    "averageTimeSec": 12.7,
    "badge": "Chiến Binh Đại Số",
    "topicsMastery": {
      "arithmetic": 85,
      "rational": 82,
      "algebra": 82,
      "equation": 83,
      "geometry": 82,
      "statistics": 81
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 810,
        "timeSec": 63,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "06/10/2012",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0972199900",
    "accountCode": "HS47",
    "accountPassword": "HS201102",
    "parentPhone": "0930446701",
    "parentName": "Bác Hồ Đức Sơn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu rõ hệ số góc và cách vẽ đồ thị hàm số bậc nhất y = ax + b."
  },
  {
    "id": "s48",
    "name": "Trần Quang Quân",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-48-8B",
    "overallScore": 7.4,
    "gamesPlayed": 22,
    "accuracyRate": 72,
    "averageTimeSec": 14.8,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 72,
      "rational": 71,
      "algebra": 73,
      "equation": 71,
      "geometry": 71,
      "statistics": 72
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 740,
        "timeSec": 74,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "13/01/2012",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0960841441",
    "accountCode": "HS48",
    "accountPassword": "HS201102",
    "parentPhone": "0703295192",
    "parentName": "Cô Phạm Thị Bích (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Có tư duy giải toán bằng cách lập phương trình bậc nhất rất tốt."
  },
  {
    "id": "s49",
    "name": "Phạm Phương Nhi",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-49-8B",
    "overallScore": 9.1,
    "gamesPlayed": 23,
    "accuracyRate": 90,
    "averageTimeSec": 9.7,
    "badge": "Đại Sư Hằng Đẳng Thức",
    "topicsMastery": {
      "arithmetic": 91,
      "rational": 88,
      "algebra": 89,
      "equation": 90,
      "geometry": 88,
      "statistics": 91
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 910,
        "timeSec": 48,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "20/04/2012",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0353194322",
    "accountCode": "HS49",
    "accountPassword": "HS201102",
    "parentPhone": "0364564507",
    "parentName": "Cô Phạm Mỹ Bích (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Thành thạo 7 hằng đẳng thức đáng nhớ và phân tích đa thức thành nhân tử."
  },
  {
    "id": "s50",
    "name": "Hồ Thảo Hân",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-50-8B",
    "overallScore": 8.4,
    "gamesPlayed": 24,
    "accuracyRate": 84,
    "averageTimeSec": 11.8,
    "badge": "Bậc Thầy Pythagore",
    "topicsMastery": {
      "arithmetic": 86,
      "rational": 81,
      "algebra": 84,
      "equation": 85,
      "geometry": 86,
      "statistics": 86
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 840,
        "timeSec": 59,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "27/07/2012",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0949068590",
    "accountCode": "HS50",
    "accountPassword": "HS201102",
    "parentPhone": "0973272167",
    "parentName": "Bác Hồ Quốc Sơn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng rất tốt Định lí Pythagore và Định lí Thalès vào bài toán thực tế."
  },
  {
    "id": "s51",
    "name": "Trịnh Thanh Duyên",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-51-8B",
    "overallScore": 7.7,
    "gamesPlayed": 25,
    "accuracyRate": 78,
    "averageTimeSec": 13.9,
    "badge": "Chiến Binh Đại Số",
    "topicsMastery": {
      "arithmetic": 81,
      "rational": 78,
      "algebra": 79,
      "equation": 77,
      "geometry": 79,
      "statistics": 77
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 770,
        "timeSec": 69,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "07/10/2012",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0702418461",
    "accountCode": "HS51",
    "accountPassword": "HS201102",
    "parentPhone": "0347409063",
    "parentName": "Bác Trịnh Ngọc Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu rõ hệ số góc và cách vẽ đồ thị hàm số bậc nhất y = ax + b."
  },
  {
    "id": "s52",
    "name": "Ngô Gia Long",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-52-8B",
    "overallScore": 9.4,
    "gamesPlayed": 26,
    "accuracyRate": 92,
    "averageTimeSec": 8.8,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 92,
      "rational": 91,
      "algebra": 91,
      "equation": 92,
      "geometry": 92,
      "statistics": 92
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 940,
        "timeSec": 44,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "14/01/2012",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0949950297",
    "accountCode": "HS52",
    "accountPassword": "HS201102",
    "parentPhone": "0981464950",
    "parentName": "Bác Ngô Minh Lâm (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Có tư duy giải toán bằng cách lập phương trình bậc nhất rất tốt."
  },
  {
    "id": "s53",
    "name": "Hoàng Đức Thịnh",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-53-8B",
    "overallScore": 8.7,
    "gamesPlayed": 27,
    "accuracyRate": 86,
    "averageTimeSec": 10.9,
    "badge": "Đại Sư Hằng Đẳng Thức",
    "topicsMastery": {
      "arithmetic": 87,
      "rational": 84,
      "algebra": 86,
      "equation": 87,
      "geometry": 85,
      "statistics": 87
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 869,
        "timeSec": 54,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "21/04/2012",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0353024821",
    "accountCode": "HS53",
    "accountPassword": "HS201102",
    "parentPhone": "0385800393",
    "parentName": "Cô Hoàng Kim Nga (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Thành thạo 7 hằng đẳng thức đáng nhớ và phân tích đa thức thành nhân tử."
  },
  {
    "id": "s54",
    "name": "Ngô Gia Đạt",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-54-8B",
    "overallScore": 8.0,
    "gamesPlayed": 28,
    "accuracyRate": 80,
    "averageTimeSec": 13.0,
    "badge": "Bậc Thầy Pythagore",
    "topicsMastery": {
      "arithmetic": 82,
      "rational": 77,
      "algebra": 81,
      "equation": 79,
      "geometry": 78,
      "statistics": 82
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 800,
        "timeSec": 65,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "01/07/2012",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0932976194",
    "accountCode": "HS54",
    "accountPassword": "HS201102",
    "parentPhone": "0703398335",
    "parentName": "Cô Trần Thị Liên (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng rất tốt Định lí Pythagore và Định lí Thalès vào bài toán thực tế."
  },
  {
    "id": "s55",
    "name": "Huỳnh Minh Vy",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-55-8B",
    "overallScore": 9.7,
    "gamesPlayed": 29,
    "accuracyRate": 98,
    "averageTimeSec": 7.9,
    "badge": "Chiến Binh Đại Số",
    "topicsMastery": {
      "arithmetic": 99,
      "rational": 97,
      "algebra": 96,
      "equation": 97,
      "geometry": 99,
      "statistics": 96
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 969,
        "timeSec": 39,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "08/10/2012",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0961522905",
    "accountCode": "HS55",
    "accountPassword": "HS201102",
    "parentPhone": "0342378371",
    "parentName": "Cô Huỳnh Ngọc Hà (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu rõ hệ số góc và cách vẽ đồ thị hàm số bậc nhất y = ax + b."
  },
  {
    "id": "s56",
    "name": "Phạm Hữu Bảo",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-56-8B",
    "overallScore": 9.0,
    "gamesPlayed": 30,
    "accuracyRate": 88,
    "averageTimeSec": 10.0,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 88,
      "rational": 87,
      "algebra": 88,
      "equation": 89,
      "geometry": 89,
      "statistics": 88
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 900,
        "timeSec": 50,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "15/01/2012",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0973220032",
    "accountCode": "HS56",
    "accountPassword": "HS201102",
    "parentPhone": "0970048918",
    "parentName": "Cô Vũ Thanh Hà (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Có tư duy giải toán bằng cách lập phương trình bậc nhất rất tốt."
  },
  {
    "id": "s57",
    "name": "Phan Gia Vy",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-57-8B",
    "overallScore": 8.3,
    "gamesPlayed": 31,
    "accuracyRate": 82,
    "averageTimeSec": 12.1,
    "badge": "Đại Sư Hằng Đẳng Thức",
    "topicsMastery": {
      "arithmetic": 83,
      "rational": 80,
      "algebra": 83,
      "equation": 81,
      "geometry": 82,
      "statistics": 83
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 830,
        "timeSec": 60,
        "totalQuestions": 10
      }
    ],
    "attendance": "late",
    "dateOfBirth": "22/04/2012",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0353174690",
    "accountCode": "HS57",
    "accountPassword": "HS201102",
    "parentPhone": "0369888158",
    "parentName": "Bác Phan Văn Đức (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Thành thạo 7 hằng đẳng thức đáng nhớ và phân tích đa thức thành nhân tử."
  },
  {
    "id": "s58",
    "name": "Phan Khánh Duyên",
    "classId": "class-8b",
    "gender": "female",
    "avatarSeed": "mq-58-8B",
    "overallScore": 7.6,
    "gamesPlayed": 32,
    "accuracyRate": 76,
    "averageTimeSec": 14.2,
    "badge": "Bậc Thầy Pythagore",
    "topicsMastery": {
      "arithmetic": 78,
      "rational": 73,
      "algebra": 75,
      "equation": 76,
      "geometry": 75,
      "statistics": 78
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 760,
        "timeSec": 71,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "02/07/2012",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0968206307",
    "accountCode": "HS58",
    "accountPassword": "HS201102",
    "parentPhone": "0934005671",
    "parentName": "Bác Phan Quốc Đức (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng rất tốt Định lí Pythagore và Định lí Thalès vào bài toán thực tế."
  },
  {
    "id": "s59",
    "name": "Ngô Đức Bảo",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-59-8B",
    "overallScore": 9.3,
    "gamesPlayed": 33,
    "accuracyRate": 94,
    "averageTimeSec": 9.1,
    "badge": "Chiến Binh Đại Số",
    "topicsMastery": {
      "arithmetic": 97,
      "rational": 94,
      "algebra": 94,
      "equation": 95,
      "geometry": 92,
      "statistics": 93
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 930,
        "timeSec": 45,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "09/10/2012",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0351800616",
    "accountCode": "HS59",
    "accountPassword": "HS201102",
    "parentPhone": "0917073514",
    "parentName": "Bác Ngô Xuân An (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu rõ hệ số góc và cách vẽ đồ thị hàm số bậc nhất y = ax + b."
  },
  {
    "id": "s60",
    "name": "Hồ Quốc Trọng",
    "classId": "class-8b",
    "gender": "male",
    "avatarSeed": "mq-60-8B",
    "overallScore": 8.6,
    "gamesPlayed": 14,
    "accuracyRate": 84,
    "averageTimeSec": 11.2,
    "badge": "Bậc Thầy Cẩn Thận",
    "topicsMastery": {
      "arithmetic": 84,
      "rational": 83,
      "algebra": 85,
      "equation": 83,
      "geometry": 86,
      "statistics": 84
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 860,
        "timeSec": 56,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "16/01/2012",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0860655143",
    "accountCode": "HS60",
    "accountPassword": "HS201102",
    "parentPhone": "0354169582",
    "parentName": "Bác Hồ Đức Cường (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Có tư duy giải toán bằng cách lập phương trình bậc nhất rất tốt."
  },
  {
    "id": "s61",
    "name": "Phạm Tuấn Bảo",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-61-9C",
    "overallScore": 7.9,
    "gamesPlayed": 15,
    "accuracyRate": 78,
    "averageTimeSec": 13.3,
    "badge": "Huyền Thoại Toán 9",
    "topicsMastery": {
      "arithmetic": 79,
      "rational": 76,
      "algebra": 77,
      "equation": 78,
      "geometry": 79,
      "statistics": 79
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 790,
        "timeSec": 66,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "23/04/2011",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0946678111",
    "accountCode": "HS61",
    "accountPassword": "HS201102",
    "parentPhone": "0380540258",
    "parentName": "Bác Phạm Đức Bình (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Giải hệ phương trình và rút gọn căn thức bậc hai chính xác, trình bày sạch đẹp."
  },
  {
    "id": "s62",
    "name": "Đinh Anh Phúc",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-62-9C",
    "overallScore": 9.6,
    "gamesPlayed": 16,
    "accuracyRate": 96,
    "averageTimeSec": 8.2,
    "badge": "Chiến Thần Hệ Phương Trình",
    "topicsMastery": {
      "arithmetic": 98,
      "rational": 93,
      "algebra": 96,
      "equation": 97,
      "geometry": 96,
      "statistics": 98
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 960,
        "timeSec": 41,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "03/07/2011",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0972885006",
    "accountCode": "HS62",
    "accountPassword": "HS201102",
    "parentPhone": "0341944564",
    "parentName": "Bác Đinh Hữu Hải (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu sâu đồ thị hàm số y = ax², phương trình bậc hai và Định lí Viète."
  },
  {
    "id": "s63",
    "name": "Ngô Khánh Vy",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-63-9C",
    "overallScore": 8.9,
    "gamesPlayed": 17,
    "accuracyRate": 90,
    "averageTimeSec": 10.3,
    "badge": "Dũng Sĩ Đường Tròn",
    "topicsMastery": {
      "arithmetic": 93,
      "rational": 90,
      "algebra": 91,
      "equation": 89,
      "geometry": 89,
      "statistics": 89
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 890,
        "timeSec": 51,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "10/10/2011",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0988606007",
    "accountCode": "HS63",
    "accountPassword": "HS201102",
    "parentPhone": "0388986206",
    "parentName": "Bác Ngô Quốc Tuấn (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng linh hoạt tỉ số lượng giác góc nhọn và hệ thức cạnh – góc."
  },
  {
    "id": "s64",
    "name": "Lê Ngọc Uyên",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-64-9C",
    "overallScore": 8.2,
    "gamesPlayed": 18,
    "accuracyRate": 80,
    "averageTimeSec": 12.4,
    "badge": "Chuyên Gia Định Lí Viète",
    "topicsMastery": {
      "arithmetic": 80,
      "rational": 79,
      "algebra": 79,
      "equation": 80,
      "geometry": 78,
      "statistics": 80
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 819,
        "timeSec": 62,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "17/01/2011",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0866184163",
    "accountCode": "HS64",
    "accountPassword": "HS201102",
    "parentPhone": "0706563537",
    "parentName": "Bác Lê Minh Phước (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh tứ giác nội tiếp tiến bộ rõ rệt, đủ năng lực ôn thi vào 10."
  },
  {
    "id": "s65",
    "name": "Đặng Bảo Châu",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-65-9C",
    "overallScore": 7.5,
    "gamesPlayed": 19,
    "accuracyRate": 74,
    "averageTimeSec": 14.5,
    "badge": "Huyền Thoại Toán 9",
    "topicsMastery": {
      "arithmetic": 75,
      "rational": 72,
      "algebra": 74,
      "equation": 75,
      "geometry": 76,
      "statistics": 75
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 750,
        "timeSec": 72,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "24/04/2011",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0703674820",
    "accountCode": "HS65",
    "accountPassword": "HS201102",
    "parentPhone": "0703448836",
    "parentName": "Bác Đặng Hữu Bình (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Giải hệ phương trình và rút gọn căn thức bậc hai chính xác, trình bày sạch đẹp."
  },
  {
    "id": "s66",
    "name": "Đinh Bảo Tâm",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-66-9C",
    "overallScore": 9.2,
    "gamesPlayed": 20,
    "accuracyRate": 92,
    "averageTimeSec": 9.4,
    "badge": "Chiến Thần Hệ Phương Trình",
    "topicsMastery": {
      "arithmetic": 94,
      "rational": 89,
      "algebra": 93,
      "equation": 91,
      "geometry": 93,
      "statistics": 94
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 919,
        "timeSec": 47,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "04/07/2011",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0354611501",
    "accountCode": "HS66",
    "accountPassword": "HS201102",
    "parentPhone": "0701932162",
    "parentName": "Cô Hồ Phương Liên (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu sâu đồ thị hàm số y = ax², phương trình bậc hai và Định lí Viète."
  },
  {
    "id": "s67",
    "name": "Hoàng Anh Khoa",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-67-9C",
    "overallScore": 8.5,
    "gamesPlayed": 21,
    "accuracyRate": 86,
    "averageTimeSec": 11.5,
    "badge": "Dũng Sĩ Đường Tròn",
    "topicsMastery": {
      "arithmetic": 89,
      "rational": 86,
      "algebra": 85,
      "equation": 86,
      "geometry": 86,
      "statistics": 85
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 850,
        "timeSec": 57,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "11/10/2011",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0797826481",
    "accountCode": "HS67",
    "accountPassword": "HS201102",
    "parentPhone": "0981425512",
    "parentName": "Bác Hoàng Ngọc Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng linh hoạt tỉ số lượng giác góc nhọn và hệ thức cạnh – góc."
  },
  {
    "id": "s68",
    "name": "Trịnh Bảo Đạt",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-68-9C",
    "overallScore": 7.8,
    "gamesPlayed": 22,
    "accuracyRate": 76,
    "averageTimeSec": 13.6,
    "badge": "Chuyên Gia Định Lí Viète",
    "topicsMastery": {
      "arithmetic": 76,
      "rational": 75,
      "algebra": 76,
      "equation": 77,
      "geometry": 75,
      "statistics": 76
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 780,
        "timeSec": 68,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "18/01/2011",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0703985358",
    "accountCode": "HS68",
    "accountPassword": "HS201102",
    "parentPhone": "0947832693",
    "parentName": "Cô Hồ Phương Lan (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh tứ giác nội tiếp tiến bộ rõ rệt, đủ năng lực ôn thi vào 10."
  },
  {
    "id": "s69",
    "name": "Dương Anh Khoa",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-69-9C",
    "overallScore": 9.5,
    "gamesPlayed": 23,
    "accuracyRate": 94,
    "averageTimeSec": 8.5,
    "badge": "Huyền Thoại Toán 9",
    "topicsMastery": {
      "arithmetic": 95,
      "rational": 92,
      "algebra": 95,
      "equation": 93,
      "geometry": 92,
      "statistics": 95
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 950,
        "timeSec": 42,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "25/04/2011",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0869571177",
    "accountCode": "HS69",
    "accountPassword": "HS201102",
    "parentPhone": "0914707856",
    "parentName": "Bác Dương Quốc Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Giải hệ phương trình và rút gọn căn thức bậc hai chính xác, trình bày sạch đẹp."
  },
  {
    "id": "s70",
    "name": "Bùi Mỹ Uyên",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-70-9C",
    "overallScore": 8.8,
    "gamesPlayed": 24,
    "accuracyRate": 88,
    "averageTimeSec": 10.6,
    "badge": "Chiến Thần Hệ Phương Trình",
    "topicsMastery": {
      "arithmetic": 90,
      "rational": 85,
      "algebra": 87,
      "equation": 88,
      "geometry": 90,
      "statistics": 90
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 880,
        "timeSec": 53,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "05/07/2011",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0961533954",
    "accountCode": "HS70",
    "accountPassword": "HS201102",
    "parentPhone": "0974120209",
    "parentName": "Cô Ngô Thị Mai (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu sâu đồ thị hàm số y = ax², phương trình bậc hai và Định lí Viète."
  },
  {
    "id": "s71",
    "name": "Dương Quốc Hùng",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-71-9C",
    "overallScore": 8.1,
    "gamesPlayed": 25,
    "accuracyRate": 82,
    "averageTimeSec": 12.7,
    "badge": "Dũng Sĩ Đường Tròn",
    "topicsMastery": {
      "arithmetic": 85,
      "rational": 82,
      "algebra": 82,
      "equation": 83,
      "geometry": 83,
      "statistics": 81
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 810,
        "timeSec": 63,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "12/10/2011",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0943010466",
    "accountCode": "HS71",
    "accountPassword": "HS201102",
    "parentPhone": "0946879150",
    "parentName": "Bác Dương Hữu Hải (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng linh hoạt tỉ số lượng giác góc nhọn và hệ thức cạnh – góc."
  },
  {
    "id": "s72",
    "name": "Đỗ Thảo Ngọc",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-72-9C",
    "overallScore": 7.4,
    "gamesPlayed": 26,
    "accuracyRate": 72,
    "averageTimeSec": 14.8,
    "badge": "Chuyên Gia Định Lí Viète",
    "topicsMastery": {
      "arithmetic": 72,
      "rational": 71,
      "algebra": 73,
      "equation": 71,
      "geometry": 72,
      "statistics": 72
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 740,
        "timeSec": 74,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "19/01/2011",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0356534684",
    "accountCode": "HS72",
    "accountPassword": "HS201102",
    "parentPhone": "0388412588",
    "parentName": "Cô Đỗ Thu Hương (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh tứ giác nội tiếp tiến bộ rõ rệt, đủ năng lực ôn thi vào 10."
  },
  {
    "id": "s73",
    "name": "Trần Quốc Khoa",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-73-9C",
    "overallScore": 9.1,
    "gamesPlayed": 27,
    "accuracyRate": 90,
    "averageTimeSec": 9.7,
    "badge": "Huyền Thoại Toán 9",
    "topicsMastery": {
      "arithmetic": 91,
      "rational": 88,
      "algebra": 89,
      "equation": 90,
      "geometry": 89,
      "statistics": 91
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 910,
        "timeSec": 48,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "26/04/2011",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0342802547",
    "accountCode": "HS73",
    "accountPassword": "HS201102",
    "parentPhone": "0342836071",
    "parentName": "Bác Trần Đức Trung (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Giải hệ phương trình và rút gọn căn thức bậc hai chính xác, trình bày sạch đẹp."
  },
  {
    "id": "s74",
    "name": "Hồ Minh Khoa",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-74-9C",
    "overallScore": 8.4,
    "gamesPlayed": 28,
    "accuracyRate": 84,
    "averageTimeSec": 11.8,
    "badge": "Chiến Thần Hệ Phương Trình",
    "topicsMastery": {
      "arithmetic": 86,
      "rational": 81,
      "algebra": 84,
      "equation": 85,
      "geometry": 82,
      "statistics": 86
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 840,
        "timeSec": 59,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "06/07/2011",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0389716287",
    "accountCode": "HS74",
    "accountPassword": "HS201102",
    "parentPhone": "0340775325",
    "parentName": "Cô Hồ Thị Nga (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu sâu đồ thị hàm số y = ax², phương trình bậc hai và Định lí Viète."
  },
  {
    "id": "s75",
    "name": "Ngô Hoàng Kiệt",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-75-9C",
    "overallScore": 7.7,
    "gamesPlayed": 29,
    "accuracyRate": 78,
    "averageTimeSec": 13.9,
    "badge": "Dũng Sĩ Đường Tròn",
    "topicsMastery": {
      "arithmetic": 81,
      "rational": 78,
      "algebra": 79,
      "equation": 77,
      "geometry": 80,
      "statistics": 77
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 770,
        "timeSec": 69,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "13/10/2011",
    "address": "Quận Sơn Trà, TP. Đà Nẵng",
    "accountPhone": "0976600552",
    "accountCode": "HS75",
    "accountPassword": "HS201102",
    "parentPhone": "0797528573",
    "parentName": "Cô Hồ Thu Mai (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng linh hoạt tỉ số lượng giác góc nhọn và hệ thức cạnh – góc."
  },
  {
    "id": "s76",
    "name": "Vũ Phương Mai",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-76-9C",
    "overallScore": 9.4,
    "gamesPlayed": 30,
    "accuracyRate": 92,
    "averageTimeSec": 8.8,
    "badge": "Chuyên Gia Định Lí Viète",
    "topicsMastery": {
      "arithmetic": 92,
      "rational": 91,
      "algebra": 91,
      "equation": 92,
      "geometry": 93,
      "statistics": 92
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 940,
        "timeSec": 44,
        "totalQuestions": 10
      }
    ],
    "attendance": "late",
    "dateOfBirth": "20/01/2011",
    "address": "Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "accountPhone": "0900365325",
    "accountCode": "HS76",
    "accountPassword": "HS201102",
    "parentPhone": "0860792590",
    "parentName": "Bác Vũ Thanh Hải (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh tứ giác nội tiếp tiến bộ rõ rệt, đủ năng lực ôn thi vào 10."
  },
  {
    "id": "s77",
    "name": "Huỳnh Khánh Trang",
    "classId": "class-9c",
    "gender": "female",
    "avatarSeed": "mq-77-9C",
    "overallScore": 8.7,
    "gamesPlayed": 31,
    "accuracyRate": 86,
    "averageTimeSec": 10.9,
    "badge": "Huyền Thoại Toán 9",
    "topicsMastery": {
      "arithmetic": 87,
      "rational": 84,
      "algebra": 86,
      "equation": 87,
      "geometry": 86,
      "statistics": 87
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 869,
        "timeSec": 54,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "27/04/2011",
    "address": "Quận Cẩm Lệ, TP. Đà Nẵng",
    "accountPhone": "0368942782",
    "accountCode": "HS77",
    "accountPassword": "HS201102",
    "parentPhone": "0705727503",
    "parentName": "Cô Trịnh Hồng Chi (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Giải hệ phương trình và rút gọn căn thức bậc hai chính xác, trình bày sạch đẹp."
  },
  {
    "id": "s78",
    "name": "Đỗ Hoàng Bảo",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-78-9C",
    "overallScore": 8.0,
    "gamesPlayed": 32,
    "accuracyRate": 80,
    "averageTimeSec": 13.0,
    "badge": "Chiến Thần Hệ Phương Trình",
    "topicsMastery": {
      "arithmetic": 82,
      "rational": 77,
      "algebra": 81,
      "equation": 79,
      "geometry": 79,
      "statistics": 82
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 800,
        "timeSec": 65,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "07/07/2011",
    "address": "Quận Liên Chiểu, TP. Đà Nẵng",
    "accountPhone": "0361386616",
    "accountCode": "HS78",
    "accountPassword": "HS201102",
    "parentPhone": "0910678322",
    "parentName": "Bác Đỗ Thanh Hùng (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Hiểu sâu đồ thị hàm số y = ax², phương trình bậc hai và Định lí Viète."
  },
  {
    "id": "s79",
    "name": "Vũ Gia Dũng",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-79-9C",
    "overallScore": 9.7,
    "gamesPlayed": 33,
    "accuracyRate": 98,
    "averageTimeSec": 7.9,
    "badge": "Dũng Sĩ Đường Tròn",
    "topicsMastery": {
      "arithmetic": 99,
      "rational": 97,
      "algebra": 96,
      "equation": 97,
      "geometry": 95,
      "statistics": 96
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Thử thách Tốc độ",
        "score": 969,
        "timeSec": 39,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "14/10/2011",
    "address": "Quận Hải Châu, TP. Đà Nẵng",
    "accountPhone": "0969522761",
    "accountCode": "HS79",
    "accountPassword": "HS201102",
    "parentPhone": "0972895016",
    "parentName": "Bác Vũ Xuân An (Bố)",
    "parentRelation": "Bố",
    "parentPassword": "PH201102",
    "teacherNotes": "Vận dụng linh hoạt tỉ số lượng giác góc nhọn và hệ thức cạnh – góc."
  },
  {
    "id": "s80",
    "name": "Đỗ Quang Phúc",
    "classId": "class-9c",
    "gender": "male",
    "avatarSeed": "mq-80-9C",
    "overallScore": 9.0,
    "gamesPlayed": 14,
    "accuracyRate": 88,
    "averageTimeSec": 10.0,
    "badge": "Chuyên Gia Định Lí Viète",
    "topicsMastery": {
      "arithmetic": 88,
      "rational": 87,
      "algebra": 88,
      "equation": 89,
      "geometry": 90,
      "statistics": 88
    },
    "recentHistory": [
      {
        "date": "24/10/2026",
        "gameTitle": "Mật Mã Số Học",
        "score": 900,
        "timeSec": 50,
        "totalQuestions": 10
      }
    ],
    "attendance": "present",
    "dateOfBirth": "21/01/2011",
    "address": "Quận Thanh Khê, TP. Đà Nẵng",
    "accountPhone": "0946940692",
    "accountCode": "HS80",
    "accountPassword": "HS201102",
    "parentPhone": "0387363708",
    "parentName": "Cô Đỗ Thanh Hoa (Mẹ)",
    "parentRelation": "Mẹ",
    "parentPassword": "PH201102",
    "teacherNotes": "Chứng minh tứ giác nội tiếp tiến bộ rõ rệt, đủ năng lực ôn thi vào 10."
  }
];
