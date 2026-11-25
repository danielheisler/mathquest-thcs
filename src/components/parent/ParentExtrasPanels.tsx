import React, { useState, useEffect } from 'react';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Heart,
  Sparkles,
  Camera,
  Trophy,
  ShieldCheck,
  BookOpen,
  Compass,
  Download,
  Lightbulb,
  Users,
} from 'lucide-react';

export type ParentExtraTab =
  | 'schedule_feedback'
  | 'family_fun'
  | 'wellbeing_survey'
  | 'parent_library';

interface ParentExtrasPanelsProps {
  activeTab: ParentExtraTab;
  studentName: string;
  className: string;
  language?: Language;
}

const FEEDBACK_STORAGE_KEY = 'mathquest_parent_feedback_v1';
const FAMILY_DIARY_STORAGE_KEY = 'mathquest_family_diary_v1';
const SURVEY_STORAGE_KEY = 'mathquest_wellbeing_surveys_v1';

const WEEKLY_SCHEDULE = [
  {
    dayVi: 'Thứ 2',
    dayEn: 'Mon',
    activityVi: 'Chào cờ & Học Toán: Luyện tập chủ đề trọng tâm',
    activityEn: 'Flag Salute & Math Practice',
    examVi: 'Kiểm tra vở bài tập đầu tuần',
    examEn: 'Notebook check',
    toolsVi: 'Sách GK, vở ghi, bút màu',
    toolsEn: 'Textbook, notebook, highlighters',
  },
  {
    dayVi: 'Thứ 3',
    dayEn: 'Tue',
    activityVi: 'Hình học trực quan & Thực hành Phòng Lab 3D',
    activityEn: 'Visual Geometry & 3D Lab Session',
    examVi: 'Đố vui 5 phút đầu giờ (Camera)',
    examEn: '5-min Body Camera warm-up',
    toolsVi: 'Thước thẳng, ê-ke, compa',
    toolsEn: 'Ruler, set square, compass',
  },
  {
    dayVi: 'Thứ 4',
    dayEn: 'Wed',
    activityVi: 'Đại số & Luyện đề trắc nghiệm chuẩn GDPT 2018',
    activityEn: 'Algebra & GDPT 2018 Quiz Practice',
    examVi: 'Kiểm tra 15 phút (Hệ số 1)',
    examEn: '15-min Regular Quiz (Coeff. 1)',
    toolsVi: 'Máy tính bỏ túi Casio, giấy nháp',
    toolsEn: 'Scientific calculator, scratchpad',
  },
  {
    dayVi: 'Thứ 5',
    dayEn: 'Thu',
    activityVi: 'Hoạt động ngoại khóa STEM Toán học & Tư duy logic',
    activityEn: 'STEM Math Club & Logic Puzzles',
    examVi: 'Đấu trường Đội nhóm đua thuyền',
    examEn: 'Team Math Boat Race',
    toolsVi: 'Đồng phục thể dục / thẻ nhóm',
    toolsEn: 'PE uniform / team badge',
  },
  {
    dayVi: 'Thứ 6',
    dayEn: 'Fri',
    activityVi: 'Sinh hoạt lớp cuối tuần & Rung chuông vàng',
    activityEn: 'Weekly Class Review & Golden Bell',
    examVi: 'Chốt điểm BTVN tuần & Tuyên dương',
    examEn: 'Weekly HW wrap-up & Praise wall',
    toolsVi: 'Sổ tay rèn thói quen 21 ngày',
    toolsEn: '21-day habit tracker',
  },
  {
    dayVi: 'Thứ 7',
    dayEn: 'Sat',
    activityVi: 'Thử thách "Cùng con chinh phục cuối tuần" tại nhà',
    activityEn: 'Weekend Family Challenge at Home',
    examVi: 'Nộp Nhật ký gia đình (tích điểm Tổ)',
    examEn: 'Submit Family Diary (bonus pts)',
    toolsVi: 'Hoạt động cùng bố mẹ',
    toolsEn: 'Parent-child activity',
  },
];

const MATCH_QUIZ = [
  {
    qVi: 'Màu sắc yêu thích nhất của con hiện tại là gì?',
    qEn: 'What is your child’s current favorite color?',
    optsVi: ['Xanh dương / Xanh lá', 'Tím / Hồng pastel', 'Đen / Trắng tối giản', 'Vàng / Cam năng động'],
    optsEn: ['Blue / Green', 'Purple / Pastel Pink', 'Black / White Minimal', 'Yellow / Energetic Orange'],
    childPick: 0,
  },
  {
    qVi: 'Phần kiến thức Toán con thường thấy ngại hoặc hay hỏi nhất?',
    qEn: 'Which math topic does your child find hardest?',
    optsVi: ['Số nguyên & Phân số', 'Biến đổi Hằng đẳng thức / Phương trình', 'Chứng minh Hình học', 'Thống kê & Xác suất'],
    optsEn: ['Integers & Fractions', 'Identities & Equations', 'Geometry Proofs', 'Statistics & Probability'],
    childPick: 2,
  },
  {
    qVi: 'Ước mơ nghề nghiệp con nhắc tới gần đây?',
    qEn: 'What career dream has your child mentioned recently?',
    optsVi: ['Lập trình / Trí tuệ nhân tạo', 'Bác sĩ / Y dược', 'Kiến trúc / Thiết kế', 'Giáo viên / Kinh tế'],
    optsEn: ['Software / AI Engineer', 'Doctor / Healthcare', 'Architecture / Design', 'Teacher / Economics'],
    childPick: 0,
  },
  {
    qVi: 'Điều con mong bố mẹ thay đổi nhất khi nhắc nhở việc học?',
    qEn: 'What does your child wish parents changed when reminding them to study?',
    optsVi: ['Không so sánh con với bạn khác', 'Khen ngợi trước khi góp ý lỗi sai', 'Cho con tự chọn khung giờ học', 'Cùng con chơi/học nhẹ nhàng 15 phút'],
    optsEn: ['Avoid comparing with peers', 'Praise effort before correcting mistakes', 'Let child pick study schedule', 'Spend 15 mins learning/playing together'],
    childPick: 0,
  },
  {
    qVi: 'Cách con thích được động viên sau một bài kiểm tra tốt?',
    qEn: 'How does your child prefer to be rewarded after a good test?',
    optsVi: ['Một bữa ăn cả nhà cùng nấu', 'Lời khen chân thành & tin tưởng', 'Thời gian đọc truyện / chơi thể thao', 'Chuyến dã ngoại cuối tuần'],
    optsEn: ['Cooking a family meal together', 'Heartfelt praise & trust', 'Extra reading / sports time', 'Weekend outdoor picnic'],
    childPick: 1,
  },
];

export const ParentExtrasPanels: React.FC<ParentExtrasPanelsProps> = ({
  activeTab,
  studentName,
  className,
  language = 'vi',
}) => {
  const isEn = language === 'en';

  // 1. Feedback Box State
  const [feedbackCat, setFeedbackCat] = useState<string>('Chất lượng giảng dạy');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackList, setFeedbackList] = useState<{ id: string; cat: string; text: string; date: string }[]>(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  // 2. Parent & Teen Matching Quiz State
  const [matchAnswers, setMatchAnswers] = useState<Record<number, number>>({});
  const [matchSubmitted, setMatchSubmitted] = useState<boolean>(false);

  // 3. Family Challenge Diary State
  const [selectedChallenge, setSelectedChallenge] = useState<string>(
    'Cùng con giải một bài toán tính tiền & phần trăm giảm giá ngoài siêu thị'
  );
  const [diaryNote, setDiaryNote] = useState<string>('');
  const [diaryImage, setDiaryImage] = useState<string | null>(null);
  const [diaryPosts, setDiaryPosts] = useState<
    { id: string; studentName: string; challenge: string; note: string; image?: string | null; date: string; points: number }[]
  >(() => {
    try {
      const raw = localStorage.getItem(FAMILY_DIARY_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'fd-1',
        studentName: 'Nguyễn Minh Quân',
        challenge: 'Cùng con đọc 1 cuốn sách và viết 1 câu cảm nhận',
        note: 'Hai bố con đọc chương "Số nguyên tố kỳ diệu" và cùng giải đố 3 câu rất vui!',
        date: '23/11/2026',
        points: 20,
      },
    ];
  });

  // 4. Wellbeing Anonymous Survey State
  const [surveyAnxiety, setSurveyAnxiety] = useState<string>('Bình thường, con khá thoải mái');
  const [surveySupport, setSurveySupport] = useState<string>('');
  const [surveySleep, setSurveySleep] = useState<string>('7–8 tiếng/ngày');
  const [surveySaved, setSurveySaved] = useState<boolean>(false);

  // 5. Library Filter
  const [libSection, setLibSection] = useState<'math' | 'homeroom' | 'career'>('math');

  useEffect(() => {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem(FAMILY_DIARY_STORAGE_KEY, JSON.stringify(diaryPosts));
  }, [diaryPosts]);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    soundManager.playCorrect();
    setFeedbackList((prev) => [
      {
        id: `fb-${Date.now()}`,
        cat: feedbackCat,
        text: feedbackText.trim(),
        date: new Date().toLocaleDateString('vi-VN'),
      },
      ...prev,
    ]);
    setFeedbackText('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const handlePickDiaryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDiaryImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostFamilyDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryNote.trim()) return;
    soundManager.playCorrect();
    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setDiaryPosts((prev) => [
      {
        id: `fd-${Date.now()}`,
        studentName,
        challenge: selectedChallenge,
        note: diaryNote.trim(),
        image: diaryImage,
        date: new Date().toLocaleDateString('vi-VN'),
        points: 20,
      },
      ...prev,
    ]);
    setDiaryNote('');
    setDiaryImage(null);
  };

  const handleSubmitWellbeingSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    try {
      const prevRaw = localStorage.getItem(SURVEY_STORAGE_KEY);
      const prevArr = prevRaw ? JSON.parse(prevRaw) : [];
      localStorage.setItem(
        SURVEY_STORAGE_KEY,
        JSON.stringify([
          {
            id: `sv-${Date.now()}`,
            anxiety: surveyAnxiety,
            sleep: surveySleep,
            support: surveySupport.trim(),
            date: new Date().toLocaleDateString('vi-VN'),
          },
          ...prevArr,
        ])
      );
    } catch {}
    setSurveySaved(true);
    setSurveySupport('');
    setTimeout(() => setSurveySaved(false), 3500);
  };

  const handleDownloadCareerGuide = () => {
    soundManager.playCorrect();
    const content = `BÍ KÍP HƯỚNG NGHIỆP & CHỌN KHỐI THI (CẤP 2 -> THPT)\nTrường THCS · Cô Diễm Quỳnh\n\n1. Kỳ thi Tuyển sinh lớp 10 THPT:\n- 3 môn thi chính: Toán, Ngữ văn, Ngoại ngữ (Tiếng Anh).\n- Tổ hợp gợi ý khi vào lớp 10 (GDPT 2018):\n  + Khối Tự nhiên - Công nghệ (A00, A01): Toán - Lý - Hóa / Toán - Lý - Anh.\n  + Khối Khoa học Sức khỏe (B00): Toán - Hóa - Sinh.\n  + Khối Kinh tế - Ngôn ngữ (D01): Toán - Văn - Anh.\n\n2. Xu hướng nghề nghiệp nổi bật:\n- Trí tuệ nhân tạo & Khoa học dữ liệu (nền tảng Toán + Tin học).\n- Kỹ thuật bán dẫn & Năng lượng xanh.\n- Tâm lý học đường & Truyền thông số.\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bi-kip-huong-nghiep-chon-khoi-thi.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const matchCorrectCount = MATCH_QUIZ.filter((q, idx) => matchAnswers[idx] === q.childPick).length;
  const matchPercent = Math.round((matchCorrectCount / MATCH_QUIZ.length) * 100);

  return (
    <div className="space-y-6">
      {/* 1. SCHEDULE & HAPPY CLASSROOM FEEDBACK */}
      {activeTab === 'schedule_feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Schedule */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>
                  {isEn ? `Weekly Class Schedule (${className})` : `Lịch Trình Tuần & Kế Hoạch Lớp (${className})`}
                </span>
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {isEn ? 'Updated Weekly' : 'Cập nhật hàng tuần'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3 font-bold">{isEn ? 'Day' : 'Thứ'}</th>
                    <th className="py-2.5 px-3 font-bold">{isEn ? 'Activities & Events' : 'Hoạt động / Ngoại khóa'}</th>
                    <th className="py-2.5 px-3 font-bold">{isEn ? 'Test / Check' : 'Lịch kiểm tra'}</th>
                    <th className="py-2.5 px-3 font-bold">{isEn ? 'Tools Needed' : 'Dụng cụ chuẩn bị'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {WEEKLY_SCHEDULE.map((row) => (
                    <tr key={row.dayVi} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                        {isEn ? row.dayEn : row.dayVi}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 dark:text-slate-100 font-medium">
                        {isEn ? row.activityEn : row.activityVi}
                      </td>
                      <td className="py-2.5 px-3 text-indigo-700 dark:text-indigo-300 font-semibold">
                        {isEn ? row.examEn : row.examVi}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                        {isEn ? row.toolsEn : row.toolsVi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Happy Classroom Feedback Box */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-rose-500" />
              <span>{isEn ? '"Happy Class" Feedback Box' : 'Hộp Thư "Góp Ý Xây Dựng Lớp Học Hạnh Phúc"'}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Share constructive suggestions privately with Ms. Diễm Quỳnh to improve lessons and class care.'
                : 'Kênh tiếp nhận ý kiến đóng góp văn minh từ phụ huynh gửi riêng cho cô giáo chủ nhiệm / bộ môn.'}
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3">
              <select
                value={feedbackCat}
                onChange={(e) => setFeedbackCat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="Chất lượng giảng dạy">{isEn ? 'Teaching & Math Practice' : 'Chất lượng giảng dạy & bài tập'}</option>
                <option value="Hoạt động ngoại khóa">{isEn ? 'Class Events & Care' : 'Hoạt động lớp & ngoại khóa'}</option>
                <option value="Đề xuất hỗ trợ con">{isEn ? 'Student Support Request' : 'Đề xuất hỗ trợ riêng cho con'}</option>
              </select>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={isEn ? 'Write your constructive feedback...' : 'Nhập ý kiến đóng góp gửi cô Diễm Quỳnh...'}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              {feedbackSent && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEn ? 'Feedback sent privately to Ms. Quỳnh!' : 'Đã gửi góp ý riêng tư tới Cô Diễm Quỳnh!'}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEn ? 'Send Private Feedback' : 'Gửi Góp Ý Xây Dựng'}</span>
              </button>
            </form>

            {feedbackList.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 max-h-44 overflow-y-auto">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  {isEn ? 'Recent Sent Feedback' : 'Góp ý đã gửi gần đây'}
                </div>
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-0.5">
                    <div className="flex justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span>{fb.cat}</span>
                      <span>{fb.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200">{fb.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FAMILY FUN: MATCHING QUIZ & WEEKLY CHALLENGE DIARY */}
      {activeTab === 'family_fun' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Parent & Teen Matching Quiz */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                {isEn ? 'Parent & Teen Matching Quiz' : 'Trò Chơi Gắn Kết Gia Đình'}
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Heart className="w-5 h-5 text-pink-500" />
                <span>{isEn ? 'How Well Do You Know Your Child?' : 'Trò Chơi "Hiểu Con Đến Đâu?"'}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? `Answer these 5 fun questions about ${studentName} to see your match percentage!`
                  : `Bố mẹ thử đoán sở thích và mong muốn của em ${studentName} để xem mức độ hiểu ý con nhé!`}
              </p>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {MATCH_QUIZ.map((item, qIdx) => (
                <div key={qIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {qIdx + 1}. {isEn ? item.qEn : item.qVi}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(isEn ? item.optsEn : item.optsVi).map((opt, oIdx) => {
                      const picked = matchAnswers[qIdx] === oIdx;
                      const isMatch = matchSubmitted && oIdx === item.childPick;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setMatchAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                          }}
                          className={`px-2.5 py-2 rounded-lg border text-left text-[11px] font-semibold cursor-pointer transition-all ${
                            isMatch
                              ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                              : picked
                                ? 'bg-pink-600 text-white border-pink-600'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playCorrect();
                  setMatchSubmitted(true);
                }}
                disabled={Object.keys(matchAnswers).length < MATCH_QUIZ.length}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold cursor-pointer"
              >
                {isEn ? 'Check Match Score' : 'Xem % Hiểu Ý Con'}
              </button>

              {matchSubmitted && (
                <div className="px-3.5 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 text-xs font-extrabold text-pink-800 dark:text-pink-200">
                  💖 {isEn ? 'Match:' : 'Khớp ý con:'} {matchPercent}% ({matchCorrectCount}/{MATCH_QUIZ.length})
                </div>
              )}
            </div>
          </div>

          {/* Weekly Family Challenge & Diary */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                {isEn ? 'Family Challenge & Diary' : 'Thử Thách Tuần & Nhật Ký Gia Đình'}
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{isEn ? 'Conquer Weekly Challenges Together' : 'Thử Thách "Cùng Con Chinh Phục Cuối Tuần"'}</span>
              </h4>
            </div>

            <form onSubmit={handlePostFamilyDiary} className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 space-y-2.5">
              <select
                value={selectedChallenge}
                onChange={(e) => setSelectedChallenge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="Cùng con giải một bài toán tính tiền & phần trăm giảm giá ngoài siêu thị">
                  🛒 {isEn ? 'Solve a real shopping discount math problem together' : 'Cùng con giải bài toán thực tế ngoài siêu thị'}
                </option>
                <option value="Cùng con đọc 1 cuốn sách và viết 1 câu cảm nhận">
                  📖 {isEn ? 'Read 1 book together & write 1 reflection sentence' : 'Cùng con đọc 1 cuốn sách và viết 1 câu cảm nhận'}
                </option>
                <option value="Cùng con đo chiều cao/diện tích bàn học và tính chu vi">
                  📐 {isEn ? 'Measure study desk & compute area/perimeter' : 'Cùng con đo bàn học & tính chu vi, diện tích'}
                </option>
              </select>

              <textarea
                rows={2}
                value={diaryNote}
                onChange={(e) => setDiaryNote(e.target.value)}
                placeholder={isEn ? 'Share your weekend moment with your child...' : 'Chia sẻ khoảnh khắc cùng con vào Nhật ký gia đình (+20đ thi đua)...'}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>{diaryImage ? (isEn ? 'Photo attached ✓' : 'Đã chọn ảnh ✓') : (isEn ? 'Attach Photo' : 'Tải ảnh khoảnh khắc')}</span>
                  <input type="file" accept="image/*" onChange={handlePickDiaryPhoto} className="hidden" />
                </label>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer"
                >
                  {isEn ? 'Post to Family Diary (+20 pts)' : 'Đăng Nhật Ký (+20đ Tổ)'}
                </button>
              </div>
            </form>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {diaryPosts.map((post) => (
                <div key={post.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
                      👨‍👩‍👧 {post.studentName} · +{post.points}đ
                    </span>
                    <span className="text-slate-400">{post.date}</span>
                  </div>
                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">{post.challenge}</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200">{post.note}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Family moment"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ANONYMOUS PARENT WELLBEING MINI-SURVEY */}
      {activeTab === 'wellbeing_survey' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm max-w-3xl mx-auto space-y-5">
          <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {isEn ? 'Understanding Your Child · Anonymous Parent Mini-Survey' : 'Góc "Thấu Hiểu Con Trẻ" (Khảo Sát Ẩn Danh Gửi Cô Giáo)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Share discreetly about any study anxiety or support needs at home so Ms. Diễm Quỳnh can care for students who rarely speak up in class.'
                  : 'Bảng khảo sát kín đáo giúp phụ huynh chia sẻ tâm lý, áp lực thi cử ở nhà để cô giáo kịp thời quan tâm, nâng đỡ những học sinh ít bộc lộ trên lớp.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitWellbeingSurvey} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                1. {isEn
                  ? 'Have you noticed any signs of anxiety or academic pressure in your child recently?'
                  : 'Dạo gần đây anh/chị có nhận thấy con có biểu hiện lo âu hay áp lực học tập/thi cử gì không?'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { vi: 'Bình thường, con khá thoải mái', en: 'Normal, seems comfortable' },
                  { vi: 'Hơi căng thẳng trước kỳ thi', en: 'Slightly stressed before exams' },
                  { vi: 'Lo âu nhiều, cần cô hỗ trợ thêm', en: 'Anxious, needs extra support' },
                ].map((opt) => (
                  <button
                    key={opt.vi}
                    type="button"
                    onClick={() => setSurveyAnxiety(opt.vi)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                      surveyAnxiety === opt.vi
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isEn ? opt.en : opt.vi}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                2. {isEn ? 'Average daily sleep & rest schedule:' : 'Thời lượng nghỉ ngơi & giấc ngủ trung bình của con:'}
              </label>
              <select
                value={surveySleep}
                onChange={(e) => setSurveySleep(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="Đủ 8 tiếng trở lên">{isEn ? '8+ hours/day (Great)' : 'Đủ 8 tiếng trở lên (Rất tốt)'}</option>
                <option value="7–8 tiếng/ngày">{isEn ? '7–8 hours/day (Normal)' : '7–8 tiếng/ngày (Ổn định)'}</option>
                <option value="Dưới 6.5 tiếng (thức khuya ôn bài)">{isEn ? 'Under 6.5 hours (Stays up late)' : 'Dưới 6.5 tiếng (Thường thức khuya ôn bài)'}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                3. {isEn
                  ? 'What extra support would you like Ms. Diễm Quỳnh to provide during exam prep?'
                  : 'Anh/chị mong muốn cô hỗ trợ thêm điều gì cho con trong giai đoạn ôn thi sắp tới?'}
              </label>
              <textarea
                rows={3}
                value={surveySupport}
                onChange={(e) => setSurveySupport(e.target.value)}
                placeholder={isEn ? 'Share anonymously with Ms. Diễm Quỳnh...' : 'Nhập chia sẻ ẩn danh gửi cô giáo...'}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {surveySaved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'Anonymous survey submitted confidentially!' : 'Đã gửi khảo sát ẩn danh bảo mật tới Cô Diễm Quỳnh!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isEn ? 'Submit Anonymous Survey' : 'Gửi Khảo Sát Ẩn Danh (Bảo Mật 100%)'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. PARENT HANDBOOK & CAREER LIBRARY */}
      {activeTab === 'parent_library' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>{isEn ? 'Parenting Handbook & Career Guide' : 'Cẩm Nang Đồng Hành & Bí Kíp Hướng Nghiệp'}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? '1–2 minute visual cards for Math Hacks, Teen Psychology & High-School Track Selection.'
                  : 'Thông tin súc tích đọc nhanh trong 1–2 phút dành cho phụ huynh THCS.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'math', labelVi: '📐 Mẹo Đồng Hành Toán', labelEn: '📐 Math Hacks' },
                { id: 'homeroom', labelVi: '💚 Tâm Lý & An Toàn Mạng', labelEn: '💚 Teen Psychology' },
                { id: 'career', labelVi: '🧭 Hướng Nghiệp & Khối Thi', labelEn: '🧭 Career & Tracks' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setLibSection(sec.id as 'math' | 'homeroom' | 'career');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    libSection === sec.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isEn ? sec.labelEn : sec.labelVi}
                </button>
              ))}
            </div>
          </div>

          {libSection === 'math' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  titleVi: '1. Chơi Toán Cuối Tuần Không Áp Lực',
                  titleEn: '1. Stress-Free Weekend Math Games',
                  bodyVi: 'Thay vì ép làm 20 bài tập giống nhau, bố mẹ cùng con chơi Vòng Quay Công Thức hoặc Hải chiến Tọa độ Oxy 15 phút để con giữ phản xạ tự nhiên.',
                  bodyEn: 'Instead of 20 repetitive drills, play Formula Wheel or Oxy Battleship for 15 minutes together.',
                },
                {
                  titleVi: '2. Cách Nhận Biết Con Hổng Kiến Thức',
                  titleEn: '2. Spotting Knowledge Gaps Early',
                  bodyVi: 'Quan sát 3 dấu hiệu: hay sai dấu âm (−), nhầm quy tắc chuyển vế ở phương trình và ngại vẽ hình phụ. Xem ngay mục Độ chính xác theo chuyên đề trong hồ sơ.',
                  bodyEn: 'Watch for sign errors, equation balancing mistakes, and avoiding geometry diagrams.',
                },
                {
                  titleVi: '3. Quy Tắc 3 Bước Hỏi Thay Vì Giải Hộ',
                  titleEn: '3. Ask 3 Guiding Questions Instead of Solving',
                  bodyVi: 'Khi con bí bài: (1) Đề bài cho gì? (2) Cần tìm đại lượng nào? (3) Công thức nào nối hai phần đó? Hỏi gợi mở giúp con tự bật ra hướng giải.',
                  bodyEn: 'Ask: (1) What is given? (2) What is asked? (3) Which formula links them?',
                },
              ].map((card) => (
                <div key={card.titleVi} className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-2">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isEn ? card.titleEn : card.titleVi}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? card.bodyEn : card.bodyVi}
                  </p>
                </div>
              ))}
            </div>
          )}

          {libSection === 'homeroom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  titleVi: '1. Lắng Nghe Con Tuổi Dậy Thì',
                  titleEn: '1. Listening to Pre-Teens & Teens',
                  bodyVi: 'Học sinh lớp 6–9 nhạy cảm với lời chê trước mặt người khác. Hãy dành 10 phút đi dạo hoặc ăn tối không điện thoại để nghe con kể chuyện lớp.',
                  bodyEn: 'Middle schoolers value privacy. Spend 10 phone-free minutes daily listening without interrupting.',
                },
                {
                  titleVi: '2. Phòng Chống Bạo Lực Học Đường',
                  titleEn: '2. Preventing School Bullying',
                  bodyVi: 'Chú ý nếu con đột ngột ngại đi học, thu mình hoặc mất ngủ. Nhắn ngay cho Cô Chủ nhiệm qua Hộp thư hoặc Góc Thấu hiểu con trẻ để phối hợp xử lý sớm.',
                  bodyEn: 'Watch for sudden school avoidance or withdrawal and coordinate early with the homeroom teacher.',
                },
                {
                  titleVi: '3. An Toàn Mạng & Kiểm Soát Thời Gian Màn Hình',
                  titleEn: '3. Cyber Safety & Healthy Screen Habits',
                  bodyVi: 'Thống nhất nguyên tắc "3 Không": Không chia sẻ mật khẩu/ảnh riêng tư, Không bấm link lạ, Không dùng mạng xã hội quá 21h30 tối.',
                  bodyEn: 'Agree on 3 rules: No sharing passwords, no unknown links, and screens off before 9:30 PM.',
                },
              ].map((card) => (
                <div key={card.titleVi} className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 space-y-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isEn ? card.titleEn : card.titleVi}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? card.bodyEn : card.bodyVi}
                  </p>
                </div>
              ))}
            </div>
          )}

          {libSection === 'career' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    code: 'A00 · A01 (Toán – Lý – Hóa / Anh)',
                    careerVi: 'Công nghệ thông tin, Trí tuệ nhân tạo, Kỹ thuật bán dẫn, Kiến trúc',
                    careerEn: 'Computer Science, AI, Semiconductor Engineering, Architecture',
                    noteVi: 'Phù hợp học sinh thích tư duy logic, lập trình, thí nghiệm vật lý.',
                    noteEn: 'Great for students who enjoy logic, coding, and physics.',
                  },
                  {
                    code: 'D01 (Toán – Văn – Tiếng Anh)',
                    careerVi: 'Kinh tế quốc tế, Tài chính, Truyền thông đa phương tiện, Sư phạm',
                    careerEn: 'International Economics, Finance, Digital Media, Education',
                    noteVi: 'Tổ hợp linh hoạt, mở rộng cơ hội học bổng song ngữ & quốc tế.',
                    noteEn: 'Flexible track opening bilingual and international programs.',
                  },
                  {
                    code: 'B00 (Toán – Hóa – Sinh)',
                    careerVi: 'Y khoa, Dược học, Công nghệ sinh học, Môi trường',
                    careerEn: 'Medicine, Pharmacy, Biotechnology, Environmental Science',
                    noteVi: 'Cần sự kiên trì, ghi nhớ hệ thống và nền tảng Toán – Khoa học tự nhiên.',
                    noteEn: 'Suited for careful learners strong in Math & Natural Sciences.',
                  },
                  {
                    code: 'Tuyển sinh Lớp 10 THPT (GDPT 2018)',
                    careerVi: '3 môn bắt buộc: Toán – Ngữ văn – Ngoại ngữ + định hướng chọn tổ hợp Tự chọn',
                    careerEn: 'Core Grade 10 Entrance: Math – Literature – Foreign Language',
                    noteVi: 'Lớp 8–9 nên rà soát học lực đều 3 môn để chọn trường THPT phù hợp.',
                    noteEn: 'Grades 8–9 should balance all 3 core subjects ahead of high-school admission.',
                  },
                ].map((track) => (
                  <div key={track.code} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-indigo-700 dark:text-indigo-300">
                      <Compass className="w-4 h-4" />
                      <span>{track.code}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isEn ? track.careerEn : track.careerVi}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? track.noteEn : track.noteVi}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadCareerGuide}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isEn ? 'Download Career & Track Guide (.txt)' : 'Tải Tài Liệu Hướng Nghiệp & Chọn Khối Thi'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
