import React, { useState, useEffect, useRef } from 'react';
import {
  initialLessonPlans,
  LESSON_PLANS_STORAGE_KEY,
  LessonPlan,
} from '../../data/lessonPlansData';
import { GradeLevel, Question } from '../../types/math';
import { Language } from '../../i18n/translations';
import { getLocalizedQuestion } from '../../utils/localize';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import {
  Presentation,
  Sparkles,
  Play,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Check,
  Download,
  Printer,
  ArrowUp,
  ArrowDown,
  Eye,
  BookOpen,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  Palette,
} from 'lucide-react';

export interface LectureSlide {
  id: string;
  layout: 'cover' | 'objectives' | 'concept' | 'example' | 'quiz' | 'summary';
  tag: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  formula?: string;
  quizOptions?: string[];
  correctOptionIndex?: number;
  quizExplanation?: string;
  speakerNotes: string;
}

type SlideThemeKey = 'indigo' | 'emerald' | 'midnight' | 'amber';

const SLIDE_THEMES: Record<
  SlideThemeKey,
  {
    nameVi: string;
    nameEn: string;
    bg: string;
    accentBadge: string;
    formulaBg: string;
    dot: string;
  }
> = {
  indigo: {
    nameVi: 'Xanh Sư Phạm',
    nameEn: 'Academic Indigo',
    bg: 'from-indigo-900 via-blue-900 to-slate-900 text-white',
    accentBadge: 'bg-indigo-500/30 text-indigo-100 border-indigo-400/40',
    formulaBg: 'bg-white/10 border-white/20 text-amber-300',
    dot: 'bg-indigo-600',
  },
  emerald: {
    nameVi: 'Bảng Xanh Phấn Trắng',
    nameEn: 'Green Chalkboard',
    bg: 'from-emerald-950 via-teal-900 to-slate-900 text-white',
    accentBadge: 'bg-emerald-500/25 text-emerald-100 border-emerald-400/40',
    formulaBg: 'bg-black/30 border-emerald-400/30 text-amber-300',
    dot: 'bg-emerald-600',
  },
  midnight: {
    nameVi: 'Tối Giản Hiện Đại',
    nameEn: 'Midnight Purple',
    bg: 'from-slate-950 via-purple-950 to-indigo-950 text-white',
    accentBadge: 'bg-purple-500/25 text-purple-200 border-purple-400/40',
    formulaBg: 'bg-white/10 border-purple-300/30 text-cyan-300',
    dot: 'bg-purple-600',
  },
  amber: {
    nameVi: 'Ấm Áp Nổi Bật',
    nameEn: 'Warm Sunset',
    bg: 'from-amber-900 via-orange-900 to-rose-950 text-white',
    accentBadge: 'bg-amber-400/25 text-amber-100 border-amber-300/40',
    formulaBg: 'bg-black/25 border-amber-300/30 text-yellow-200',
    dot: 'bg-amber-600',
  },
};

const GRADE_DEFAULT_FORMULAS: Record<GradeLevel, string> = {
  6: 'a^m \\cdot a^n = a^{m+n} \\quad ; \\quad S_{\\text{thoi}} = \\frac{1}{2} d_1 d_2',
  7: '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ \\quad ; \\quad \\frac{a}{b} = \\frac{c}{d} \\Rightarrow a\\cdot d = b\\cdot c',
  8: '(A \\pm B)^2 = A^2 \\pm 2AB + B^2 \\quad ; \\quad a^2 + b^2 = c^2',
  9: '\\Delta = b^2 - 4ac \\quad ; \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
};

function buildSlidesFromLessonPlan(
  plan: LessonPlan,
  questions: Question[],
  slideLang: Language
): LectureSlide[] {
  const isEn = slideLang === 'en';
  const gradeQuestions = questions.filter((q) => q.grade === plan.grade);
  const pool = gradeQuestions.length > 0 ? gradeQuestions : questions;
  const exampleRaw = pool[0];
  const quizRaw = pool[1] || pool[0];

  const exampleLoc = exampleRaw ? getLocalizedQuestion(exampleRaw, slideLang) : null;
  const quizLoc = quizRaw ? getLocalizedQuestion(quizRaw, slideLang) : null;

  const act1 = plan.activities[0];
  const act2 = plan.activities[1];
  const act3 = plan.activities[2];
  const act4 = plan.activities[3] || plan.activities[plan.activities.length - 1];

  return [
    {
      id: `sl-1-${Date.now()}`,
      layout: 'cover',
      tag: isEn ? `Grade ${plan.grade} · Week ${plan.weekNumber}` : `Toán ${plan.grade} · Tuần ${plan.weekNumber}`,
      title: plan.title,
      subtitle: `${plan.chapterName} · ${plan.textbookSeries}`,
      bullets: [
        isEn
          ? `Teacher: Ms. Diễm Quỳnh · Class PIN: 20112002`
          : `Giáo viên giảng dạy: ${plan.teacherName} · Mã lớp: 20112002`,
        isEn
          ? `Duration: ${plan.durationMinutes} minutes (${plan.periodRange})`
          : `Thời lượng: ${plan.durationMinutes} phút (${plan.periodRange})`,
        isEn
          ? `Curriculum Standard: GDPT 2018 (Circular 5512)`
          : `Chuẩn Chương trình GDPT 2018 (Công văn 5512)`,
      ],
      formula: GRADE_DEFAULT_FORMULAS[plan.grade],
      speakerNotes: isEn
        ? 'Welcome students to today’s lesson. Introduce the topic and warm up with real-world motivation.'
        : 'Chào mừng các em đến với tiết học hôm nay. Giới thiệu tên bài, chương và mục tiêu trọng tâm.',
    },
    {
      id: `sl-2-${Date.now()}`,
      layout: 'objectives',
      tag: isEn ? 'Lesson Objectives & Aids' : 'Mục Tiêu & Thiết Bị Dạy Học',
      title: isEn ? 'What We Will Master Today' : 'Mục Tiêu Cần Đạt & Phương Tiện',
      subtitle: isEn
        ? 'Aligned with Knowledge, Competencies, and Qualities'
        : 'Phát triển Kiến thức – Năng lực – Phẩm chất (5512)',
      bullets: [
        ...(plan.objectives.knowledge.slice(0, 2).map((k) => (isEn ? `Knowledge: ${k}` : `Kiến thức: ${k}`))),
        ...(plan.objectives.competencies.slice(0, 1).map((c) => (isEn ? `Competency: ${c}` : `Năng lực: ${c}`))),
        ...(plan.objectives.qualities.slice(0, 1).map((q) => (isEn ? `Quality: ${q}` : `Phẩm chất: ${q}`))),
        ...(plan.teachingAids.teacher.slice(0, 1).map((a) => (isEn ? `Tools: ${a}` : `Học liệu: ${a}`))),
      ],
      speakerNotes: isEn
        ? 'Share learning goals clearly so students know what skills they should acquire by the end of class.'
        : 'Trình bày nhanh để học sinh nắm rõ chuẩn kiến thức và kỹ năng cần đạt sau 45 phút.',
    },
    {
      id: `sl-3-${Date.now()}`,
      layout: 'concept',
      tag: isEn ? `Activity 1 · Warm-Up (${act1?.durationMinutes || 5}m)` : `${act1?.phaseName || 'Hoạt động 1: Khởi động'} (${act1?.durationMinutes || 5} phút)`,
      title: act1?.phaseName || (isEn ? 'Warm-Up Challenge' : 'Khởi Động & Kết Nối Tri Thức'),
      subtitle: act1?.objective || (isEn ? 'Connect prior knowledge to today’s topic' : 'Tạo hứng thú và gợi mở vấn đề bài học'),
      bullets: [
        act1?.implementationSteps?.assignTask || (isEn ? 'Present opening question to the class' : 'Đặt câu hỏi gợi mở và tổ chức thảo luận nhanh'),
        act1?.implementationSteps?.studentWork || (isEn ? 'Students observe, predict, and discuss in pairs' : 'Học sinh quan sát, dự đoán và thảo luận nhóm đôi'),
        act1?.expectedProduct || (isEn ? 'Identify the core problem of the lesson' : 'Hình thành nhu cầu tìm hiểu kiến thức mới'),
      ],
      speakerNotes: isEn
        ? 'Encourage quick hands-up or Body Camera warm-up before introducing formal theory.'
        : 'Khích lệ học sinh phát biểu nhanh hoặc khởi động bằng mini-game trước khi vào kiến thức mới.',
    },
    {
      id: `sl-4-${Date.now()}`,
      layout: 'concept',
      tag: isEn ? `Activity 2 · Core Concept (${act2?.durationMinutes || 15}m)` : `${act2?.phaseName || 'Hoạt động 2: Hình thành kiến thức'}`,
      title: isEn ? 'Core Concept & Key Formulas' : `Kiến Thức Trọng Tâm: ${plan.title}`,
      subtitle: act2?.objective || (isEn ? 'Key theorem, definition, and notation' : 'Định nghĩa, tính chất và công thức cần nhớ'),
      bullets: [
        act2?.implementationSteps?.assignTask || (isEn ? 'Guide students through discovery and proof' : 'Hướng dẫn học sinh khám phá quy tắc và chứng minh'),
        act2?.implementationSteps?.studentWork || (isEn ? 'Take structured notes and highlight formulas' : 'Ghi chép quy tắc tổng quát và đối chiếu ví dụ'),
        act2?.expectedProduct || (isEn ? 'Accurate notebook summary & formula mastery' : 'Nắm vững định lý và công thức trọng tâm bài học'),
      ],
      formula: exampleRaw?.formula || GRADE_DEFAULT_FORMULAS[plan.grade],
      speakerNotes: isEn
        ? 'Emphasize the boxed formula. Ask 2 students to restate the theorem in their own words.'
        : 'Nhấn mạnh công thức đóng khung trên bảng. Mời 1–2 học sinh phát biểu lại định nghĩa bằng lời.',
    },
    {
      id: `sl-5-${Date.now()}`,
      layout: 'example',
      tag: isEn ? `Activity 3 · Guided Example (${act3?.durationMinutes || 15}m)` : `Hoạt Động 3 · Ví Dụ Minh Họa Mẫu`,
      title: isEn
        ? `Worked Example (${exampleLoc?.topicName || plan.title})`
        : `Ví Dụ Mẫu (${exampleLoc?.topicName || plan.title})`,
      subtitle: exampleLoc?.questionText || (isEn ? 'Solve step-by-step on the board' : 'Phân tích đề và trình bày lời giải chuẩn mực'),
      formula: exampleRaw?.formula || GRADE_DEFAULT_FORMULAS[plan.grade],
      bullets: [
        isEn
          ? `Step 1 (Analyze): ${exampleLoc?.hint || 'Identify given conditions and target unknown.'}`
          : `Bước 1 (Phân tích): ${exampleLoc?.hint || 'Xác định giả thiết và yêu cầu bài toán.'}`,
        isEn
          ? `Step 2 (Compute): Apply core formula carefully.`
          : `Bước 2 (Biến đổi): Áp dụng công thức trọng tâm vừa học.`,
        isEn
          ? `Conclusion: ${exampleLoc?.explanation || 'Verify answer and units.'}`
          : `Bước 3 (Kết luận): ${exampleLoc?.explanation || 'Kiểm tra lại kết quả và đơn vị.'}`,
      ],
      speakerNotes: isEn
        ? 'Walk through each step slowly. Highlight common sign or calculation mistakes to avoid.'
        : 'Giảng chậm từng bước biến đổi, lưu ý lỗi sai thường gặp về dấu và điều kiện xác định.',
    },
    {
      id: `sl-6-${Date.now()}`,
      layout: 'quiz',
      tag: isEn ? 'Interactive Class Practice Quiz' : 'Luyện Tập Nhanh Tại Lớp',
      title: quizLoc?.questionText || (isEn ? 'Quick Class Check' : 'Câu Hỏi Củng Cố Nhanh'),
      subtitle: isEn
        ? `Grade ${plan.grade} · Click "Reveal Answer" after students raise hands`
        : `Toán ${plan.grade} · Bấm "Hiện Đáp Án" sau khi học sinh giơ bảng/phát biểu`,
      formula: quizRaw?.formula,
      bullets: [],
      quizOptions: quizLoc?.options || ['A', 'B', 'C', 'D'],
      correctOptionIndex: quizRaw?.correctAnswerIndex ?? 0,
      quizExplanation: quizLoc?.explanation || '',
      speakerNotes: isEn
        ? 'Give students 45 seconds to vote A/B/C/D, then click Reveal Answer to show explanation.'
        : 'Cho học sinh suy nghĩ 45 giây và giơ thẻ A/B/C/D, sau đó bấm Hiện Đáp Án để chốt kiến thức.',
    },
    {
      id: `sl-7-${Date.now()}`,
      layout: 'summary',
      tag: isEn ? `Activity 4 · Wrap-Up & Homework (${act4?.durationMinutes || 10}m)` : 'Tổng Kết & Giao Bài Tập Về Nhà',
      title: isEn ? 'Lesson Takeaways & Homework' : 'Ghi Nhớ & Nhiệm Vụ Về Nhà',
      subtitle: isEn ? 'Consolidate key formulas & practice online on MathQuest' : 'Hệ thống kiến thức và thực hành trên MathQuest THCS',
      bullets: [
        isEn
          ? `Summary: Review all key rules from "${plan.title}".`
          : `Tổng kết: Ôn lại công thức trọng tâm bài "${plan.title}".`,
        isEn
          ? `Homework: ${plan.homeworkAssignment}`
          : `Bài tập về nhà: ${plan.homeworkAssignment}`,
        isEn
          ? 'Online Practice: Log into Homework Portal (PIN: 20112002) & Speed Math Arena.'
          : 'Luyện tập Online: Vào mục Làm Bài Tập Về Nhà (Mã 20112002) & Thử Thách Tốc Độ.',
      ],
      speakerNotes: isEn
        ? 'Remind students of homework deadline and parent progress check.'
        : 'Dặn dò học sinh hoàn thành BTVN đúng hạn để hệ thống cập nhật về phụ huynh.',
    },
  ];
}

interface SlideStudioProps {
  lessonPlan?: LessonPlan | null;
  questions: Question[];
  language?: Language;
}

export const SlideStudio: React.FC<SlideStudioProps> = ({
  lessonPlan,
  questions,
  language = 'vi',
}) => {
  const isEn = language === 'en';

  const [savedPlans] = useState<LessonPlan[]>(() => {
    try {
      const raw = localStorage.getItem(LESSON_PLANS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialLessonPlans;
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    lessonPlan?.id || savedPlans[0]?.id || ''
  );
  const [slideLang, setSlideLang] = useState<Language>(language);
  const [theme, setTheme] = useState<SlideThemeKey>('indigo');
  const [slides, setSlides] = useState<LectureSlide[]>(() =>
    buildSlidesFromLessonPlan(lessonPlan || savedPlans[0] || initialLessonPlans[0], questions, language)
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [revealQuizAnswer, setRevealQuizAnswer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);

  // Sync when teacher clicks "Create Slides" from LessonPlanManager
  useEffect(() => {
    if (lessonPlan) {
      setSelectedPlanId(lessonPlan.id);
      setSlides(buildSlidesFromLessonPlan(lessonPlan, questions, slideLang));
      setActiveSlideIdx(0);
      setRevealQuizAnswer(false);
    }
  }, [lessonPlan?.id]);

  // Sync default slide language toggle cleanly if user toggles app language
  useEffect(() => {
    setSlideLang(language);
  }, [language]);

  const currentPlan =
    (lessonPlan && lessonPlan.id === selectedPlanId ? lessonPlan : null) ||
    savedPlans.find((p) => p.id === selectedPlanId) ||
    savedPlans[0] ||
    initialLessonPlans[0];

  const currentSlide = slides[activeSlideIdx] || slides[0];
  const activeTheme = SLIDE_THEMES[theme];

  const handleGenerateSlides = (targetPlan?: LessonPlan, targetLang?: Language) => {
    soundManager.playCorrect();
    const p = targetPlan || currentPlan;
    const l = targetLang || slideLang;
    setSlides(buildSlidesFromLessonPlan(p, questions, l));
    setActiveSlideIdx(0);
    setRevealQuizAnswer(false);
  };

  const handleUpdateCurrentSlide = (patch: Partial<LectureSlide>) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIdx ? { ...s, ...patch } : s))
    );
  };

  const handleAddBlankSlide = () => {
    soundManager.playClick();
    const newSlide: LectureSlide = {
      id: `sl-custom-${Date.now()}`,
      layout: 'concept',
      tag: slideLang === 'en' ? 'Custom Slide' : 'Slide Tùy Chỉnh',
      title: slideLang === 'en' ? 'New Lecture Point' : 'Nội Dung Bài Giảng Mới',
      subtitle: slideLang === 'en' ? 'Key note or extra exercise' : 'Ghi chú trọng tâm hoặc bài tập bổ sung',
      bullets: [
        slideLang === 'en' ? 'Key point 1...' : 'Ý chính thứ nhất...',
        slideLang === 'en' ? 'Key point 2...' : 'Ý chính thứ hai...',
      ],
      speakerNotes: '',
    };
    const next = [...slides];
    next.splice(activeSlideIdx + 1, 0, newSlide);
    setSlides(next);
    setActiveSlideIdx(activeSlideIdx + 1);
    setIsEditing(true);
  };

  const handleDuplicateSlide = () => {
    if (!currentSlide) return;
    soundManager.playClick();
    const copy: LectureSlide = {
      ...currentSlide,
      id: `sl-dup-${Date.now()}`,
      bullets: [...currentSlide.bullets],
    };
    const next = [...slides];
    next.splice(activeSlideIdx + 1, 0, copy);
    setSlides(next);
    setActiveSlideIdx(activeSlideIdx + 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    soundManager.playClick();
    const next = slides.filter((_, i) => i !== idx);
    setSlides(next);
    setActiveSlideIdx(Math.min(idx, next.length - 1));
  };

  const handleMoveSlide = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    soundManager.playClick();
    const next = [...slides];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    setSlides(next);
    setActiveSlideIdx(target);
  };

  // Keyboard navigation in fullscreen presentation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setRevealQuizAnswer(false);
        setActiveSlideIdx((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRevealQuizAnswer(false);
        setActiveSlideIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen, slides.length]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.().catch(() => {
        setIsFullscreen(true);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownloadHtml = () => {
    soundManager.playCorrect();
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const slidesHtml = slides
      .map(
        (s, idx) => `
      <section class="slide" data-index="${idx}" style="${idx === 0 ? 'display:flex' : 'display:none'}">
        <div class="tag">${escapeHtml(s.tag)} · Slide ${idx + 1}/${slides.length}</div>
        <h1>${escapeHtml(s.title)}</h1>
        ${s.subtitle ? `<p class="sub">${escapeHtml(s.subtitle)}</p>` : ''}
        ${s.formula ? `<div class="formula">${escapeHtml(s.formula)}</div>` : ''}
        ${
          s.bullets.length > 0
            ? `<ul>${s.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
            : ''
        }
        ${
          s.quizOptions
            ? `<div class="opts">${s.quizOptions
                .map(
                  (opt, oIdx) =>
                    `<div class="opt ${
                      oIdx === s.correctOptionIndex ? 'correct-hint' : ''
                    }"><b>${String.fromCharCode(65 + oIdx)}.</b> ${escapeHtml(opt)}</div>`
                )
                .join('')}</div>`
            : ''
        }
        <div class="footer">MathQuest THCS · Cô Diễm Quỳnh · PIN 20112002</div>
      </section>`
      )
      .join('\n');

    const fullHtml = `<!DOCTYPE html>
<html lang="${slideLang}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(currentPlan.title)} - Slides</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#fff;overflow:hidden}
    .deck{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
    .slide{width:90vw;max-width:1100px;height:80vh;background:linear-gradient(135deg,#1e1b4b,#1e3a8a,#0f172a);border-radius:24px;padding:48px;box-sizing:border-box;flex-direction:column;justify-content:space-between;box-shadow:0 25px 50px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15)}
    .tag{display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(99,102,241,.35);border:1px solid rgba(165,180,252,.4);font-size:13px;font-weight:700;width:fit-content}
    h1{font-size:36px;margin:16px 0 8px;line-height:1.2}
    .sub{font-size:18px;color:#cbd5e1;margin:0 0 18px}
    .formula{background:rgba(255,255,255,.1);padding:16px 24px;border-radius:14px;font-family:monospace;font-size:22px;color:#fcd34d;text-align:center;margin:12px 0}
    ul{font-size:20px;line-height:1.7;padding-left:24px}
    .opts{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
    .opt{background:rgba(255,255,255,.1);padding:14px 18px;border-radius:12px;font-size:18px}
    .footer{font-size:12px;color:#94a3b8;border-top:1px solid rgba(255,255,255,.12);padding-top:12px}
    .nav{position:fixed;bottom:20px;right:24px;display:flex;gap:10px}
    button{padding:10px 18px;border-radius:10px;border:none;background:#4f46e5;color:#fff;font-weight:700;cursor:pointer}
  </style>
</head>
<body>
  <div class="deck">${slidesHtml}</div>
  <div class="nav">
    <button onclick="step(-1)">← Prev</button>
    <button onclick="step(1)">Next →</button>
  </div>
  <script>
    let cur=0;const slides=document.querySelectorAll('.slide');
    function show(n){cur=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.style.display=i===cur?'flex':'none');}
    function step(d){show(cur+d);}
    window.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')step(1);if(e.key==='ArrowLeft')step(-1);});
  </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slides-toan-${currentPlan.grade}-${currentPlan.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Studio Top Hero & Controls */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/60 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isEn
                  ? 'Lecture Slide Studio · Synced With 5512 Lesson Plans'
                  : 'Studio Tạo Slide Bài Giảng · Đồng Bộ Giáo Án 5512'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isEn ? 'Smart Lecture Slide Generator' : 'Tạo Slide Trình Chiếu Bài Giảng Toán THCS'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              {isEn
                ? 'Automatically build an interactive 7-slide classroom deck from any Lesson Plan — including formulas, worked examples, live class quiz, and fullscreen projection.'
                : 'Tự động tạo bộ 7 slide trình chiếu chuẩn sư phạm tương ứng từng Giáo án (Mục tiêu, Khởi động, Kiến thức trọng tâm KaTeX, Ví dụ mẫu, Quiz tương tác tại lớp & Dặn dò).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{isEn ? 'Present Fullscreen' : 'Trình Chiếu Toàn Màn Hình'}</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              <span>{copiedNotice ? (isEn ? 'Downloaded HTML!' : 'Đã Tải HTML!') : (isEn ? 'Download HTML Deck' : 'Tải Slide HTML')}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print' : 'In Slide'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Plan & Theme Generator Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
              {isEn ? '1. Choose Lesson Plan to Convert:' : '1. Chọn Giáo Án Tương Ứng:'}
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedPlanId(nextId);
                const found = savedPlans.find((p) => p.id === nextId);
                if (found) handleGenerateSlides(found, slideLang);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-indigo-400/30 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {savedPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  [{isEn ? `Gr ${p.grade}` : `Lớp ${p.grade}`}] {p.title} ({p.periodRange})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
              {isEn ? '2. Slide Language:' : '2. Ngôn Ngữ Slide:'}
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-900/80 p-1 rounded-xl border border-indigo-400/30">
              {(['vi', 'en'] as Language[]).map((langOpt) => (
                <button
                  key={langOpt}
                  type="button"
                  onClick={() => {
                    setSlideLang(langOpt);
                    handleGenerateSlides(currentPlan, langOpt);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                    slideLang === langOpt ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  {langOpt === 'vi' ? 'VI' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>{isEn ? '3. Slide Theme:' : '3. Giao Diện Bảng Chiếu:'}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-indigo-400/30">
              {(Object.keys(SLIDE_THEMES) as SlideThemeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  title={isEn ? SLIDE_THEMES[key].nameEn : SLIDE_THEMES[key].nameVi}
                  className={`py-1 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    theme === key ? 'border-amber-400 bg-white/15 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${SLIDE_THEMES[key].dot} border border-white/50`} />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => handleGenerateSlides()}
              className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Regenerate Deck' : 'Tạo Lại Slide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Slide Thumbnails (Left) + Interactive 16:9 Stage (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Slide Filmstrip */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 no-print">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Presentation className="w-4 h-4 text-indigo-600" />
              {isEn ? `Slides (${slides.length})` : `Danh Sách Slide (${slides.length})`}
            </span>
            <button
              type="button"
              onClick={handleAddBlankSlide}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Add' : 'Thêm'}</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {slides.map((s, idx) => {
              const isSelected = idx === activeSlideIdx;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveSlideIdx(idx);
                    setRevealQuizAnswer(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/15'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-indigo-600 text-white">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, -1);
                        }}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        title={isEn ? 'Move up' : 'Lên'}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, 1);
                        }}
                        disabled={idx === slides.length - 1}
                        className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        title={isEn ? 'Move down' : 'Xuống'}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      {slides.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title={isEn ? 'Delete' : 'Xóa'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-indigo-600 truncate">{s.tag}</div>
                  <div className="text-xs font-extrabold text-slate-900 line-clamp-2 mt-0.5">{s.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 16:9 Stage + Quick Editor */}
        <div className="lg:col-span-9 space-y-4">
          {/* Action Toolbar above Stage */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setRevealQuizAnswer(false);
                  setActiveSlideIdx((i) => Math.max(0, i - 1));
                }}
                disabled={activeSlideIdx === 0}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 px-2">
                Slide {activeSlideIdx + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setRevealQuizAnswer(false);
                  setActiveSlideIdx((i) => Math.min(slides.length - 1, i + 1));
                }}
                disabled={activeSlideIdx === slides.length - 1}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsEditing((prev) => !prev);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isEditing
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? (isEn ? 'Done Editing' : 'Xong Chỉnh Sửa') : (isEn ? 'Edit Slide' : 'Chỉnh Sửa Slide')}</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicateSlide}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isEn ? 'Duplicate' : 'Nhân Bản'}</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? (isEn ? 'Exit' : 'Thu Nhỏ') : (isEn ? 'Projector' : 'Chiếu Lớn')}</span>
              </button>
            </div>
          </div>

          {/* 16:9 Projection Slide Stage */}
          {currentSlide && (
            <div
              ref={stageRef}
              className={`bg-gradient-to-br ${activeTheme.bg} rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden ${
                isFullscreen ? 'w-screen h-screen rounded-none p-12' : 'min-h-[460px]'
              }`}
            >
              {/* Top Slide Header */}
              <div className="flex items-center justify-between gap-4 z-10">
                <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold border ${activeTheme.accentBadge}`}>
                  {currentSlide.tag}
                </span>
                <span className="text-xs font-mono text-white/70">
                  Slide {activeSlideIdx + 1}/{slides.length} · MathQuest THCS
                </span>
              </div>

              {/* Slide Center Content */}
              <div className="my-auto py-6 space-y-5 z-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                    <MathView math={currentSlide.title} />
                  </h2>
                  {currentSlide.subtitle && (
                    <p className="text-sm sm:text-base text-white/80 mt-2 font-medium">
                      <MathView math={currentSlide.subtitle} />
                    </p>
                  )}
                </div>

                {/* Optional Highlighted KaTeX Formula Box */}
                {currentSlide.formula && (
                  <div className={`p-4 rounded-2xl border text-center text-lg sm:text-2xl font-bold shadow-inner ${activeTheme.formulaBg}`}>
                    <MathView math={currentSlide.formula} displayMode={true} />
                  </div>
                )}

                {/* Bullet Points */}
                {currentSlide.bullets.length > 0 && (
                  <ul className="space-y-3">
                    {currentSlide.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-white/95 leading-relaxed bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                        <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {bIdx + 1}
                        </span>
                        <span>
                          <MathView math={b} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Interactive Quiz Slide */}
                {currentSlide.quizOptions && currentSlide.quizOptions.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSlide.quizOptions.map((opt, oIdx) => {
                        const isCorrect = oIdx === currentSlide.correctOptionIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`p-4 rounded-2xl border text-sm sm:text-base font-bold flex items-center justify-between gap-3 transition-all ${
                              revealQuizAnswer && isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-300 ring-4 ring-emerald-300/40 scale-[1.01]'
                                : 'bg-white/10 border-white/20 text-white'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-mono text-xs font-black shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>
                                <MathView math={opt} />
                              </span>
                            </span>
                            {revealQuizAnswer && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playCorrect();
                          setRevealQuizAnswer((p) => !p);
                        }}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>
                          {revealQuizAnswer
                            ? (slideLang === 'en' ? 'Hide Answer' : 'Ẩn Đáp Án')
                            : (slideLang === 'en' ? 'Reveal Answer' : 'Hiện Đáp Án Đúng')}
                        </span>
                      </button>

                      {revealQuizAnswer && currentSlide.quizExplanation && (
                        <div className="flex-1 bg-emerald-950/60 border border-emerald-400/40 px-4 py-2 rounded-xl text-xs text-emerald-100">
                          <MathView math={currentSlide.quizExplanation} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Slide Footer & Fullscreen Quick Arrows */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/15 text-xs text-white/70 z-10">
                <span>
                  {slideLang === 'en'
                    ? `Lesson: ${currentPlan.title} · Ms. Diễm Quỳnh`
                    : `Bài giảng: ${currentPlan.title} · Cô Diễm Quỳnh`}
                </span>
                {isFullscreen && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRevealQuizAnswer(false);
                        setActiveSlideIdx((i) => Math.max(0, i - 1));
                      }}
                      className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRevealQuizAnswer(false);
                        setActiveSlideIdx((i) => Math.min(slides.length - 1, i + 1));
                      }}
                      className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="px-3 py-1 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg font-bold"
                    >
                      Esc
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Speaker Notes Strip */}
          {currentSlide && !isEditing && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950 no-print">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800 block mb-0.5">
                  {isEn ? 'Teacher Speaker Notes' : 'Ghi Chú Giảng Dạy Của Giáo Viên'}
                </span>
                <p>{currentSlide.speakerNotes || (isEn ? 'No notes yet. Click "Edit Slide" to customize.' : 'Chưa có ghi chú. Bấm "Chỉnh Sửa Slide" để thêm.')}</p>
              </div>
            </div>
          )}

          {/* In-place Slide Editor Panel */}
          {isEditing && currentSlide && (
            <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-4 no-print">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  {isEn ? `Editing Slide #${activeSlideIdx + 1}` : `Đang Chỉnh Sửa Slide #${activeSlideIdx + 1}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Done' : 'Xong'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Tag / Badge:' : 'Nhãn đầu slide:'}</label>
                  <input
                    type="text"
                    value={currentSlide.tag}
                    onChange={(e) => handleUpdateCurrentSlide({ tag: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'KaTeX Formula (Optional):' : 'Công thức KaTeX (Tùy chọn):'}</label>
                  <input
                    type="text"
                    value={currentSlide.formula || ''}
                    onChange={(e) => handleUpdateCurrentSlide({ formula: e.target.value })}
                    placeholder="a^2 + b^2 = c^2"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Slide Title:' : 'Tiêu đề Slide:'}</label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => handleUpdateCurrentSlide({ title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Subtitle:' : 'Phụ đề / Mô tả ngắn:'}</label>
                <input
                  type="text"
                  value={currentSlide.subtitle || ''}
                  onChange={(e) => handleUpdateCurrentSlide({ subtitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isEn ? 'Bullet Points (one per line):' : 'Các gạch đầu dòng (mỗi dòng 1 ý):'}
                </label>
                <textarea
                  rows={4}
                  value={currentSlide.bullets.join('\n')}
                  onChange={(e) =>
                    handleUpdateCurrentSlide({
                      bullets: e.target.value.split('\n'),
                    })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isEn ? 'Speaker Notes:' : 'Ghi chú giảng dạy:'}</label>
                <input
                  type="text"
                  value={currentSlide.speakerNotes}
                  onChange={(e) => handleUpdateCurrentSlide({ speakerNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
