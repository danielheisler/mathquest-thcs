import React, { useState } from 'react';
import {
  initialLessonPlans,
  LESSON_PLANS_STORAGE_KEY,
  LessonActivityStep,
  LessonPlan,
  LessonPlanStatus,
} from '../../data/lessonPlansData';
import { GradeLevel } from '../../types/math';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  FileText,
  Layers,
  Plus,
  Printer,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
  Check,
  ClipboardList,
  Lightbulb,
  Presentation,
} from 'lucide-react';

const STATUS_META: Record<
  LessonPlanStatus,
  { label: string; badgeClass: string }
> = {
  taught: {
    label: 'Đã giảng dạy',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  approved: {
    label: 'Đã duyệt',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  draft: {
    label: 'Đang soạn',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

function loadLessonPlans(): LessonPlan[] {
  if (typeof window === 'undefined') return initialLessonPlans;
  try {
    const raw = localStorage.getItem(LESSON_PLANS_STORAGE_KEY);
    if (!raw) return initialLessonPlans;
    const parsed = JSON.parse(raw) as LessonPlan[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialLessonPlans;
  } catch {
    return initialLessonPlans;
  }
}

interface LessonPlanManagerProps {
  language?: Language;
  onCreateSlidesFromPlan?: (plan: LessonPlan) => void;
}

export const LessonPlanManager: React.FC<LessonPlanManagerProps> = ({
  language = 'vi',
  onCreateSlidesFromPlan,
}) => {
  const isEn = language === 'en';
  const [plans, setPlans] = useState<LessonPlan[]>(() => loadLessonPlans());
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'HK1' | 'HK2'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => loadLessonPlans()[0]?.id || '');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Modal state (Add / Edit lesson plan)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formGrade, setFormGrade] = useState<GradeLevel>(6);
  const [formSemester, setFormSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [formWeek, setFormWeek] = useState<number>(1);
  const [formPeriodRange, setFormPeriodRange] = useState<string>('Tiết 1 - 2');
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formChapter, setFormChapter] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formStatus, setFormStatus] = useState<LessonPlanStatus>('draft');
  const [formKnowledge, setFormKnowledge] = useState<string>('');
  const [formCompetencies, setFormCompetencies] = useState<string>('');
  const [formQualities, setFormQualities] = useState<string>('');
  const [formTeacherAids, setFormTeacherAids] = useState<string>('');
  const [formStudentAids, setFormStudentAids] = useState<string>('');
  const [formAct1, setFormAct1] = useState<string>('');
  const [formAct2, setFormAct2] = useState<string>('');
  const [formAct3, setFormAct3] = useState<string>('');
  const [formAct4, setFormAct4] = useState<string>('');
  const [formHomework, setFormHomework] = useState<string>('');
  const [formReflection, setFormReflection] = useState<string>('');

  const persistPlans = (next: LessonPlan[]) => {
    setPlans(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LESSON_PLANS_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const filteredPlans = plans
    .filter((p) => {
      const matchGrade = selectedGrade === 'all' || p.grade === selectedGrade;
      const matchSemester = selectedSemester === 'all' || p.semester === selectedSemester;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.chapterName.toLowerCase().includes(q) ||
        `tuần ${p.weekNumber}`.includes(q);
      return matchGrade && matchSemester && matchSearch;
    })
    .sort((a, b) => a.grade - b.grade || a.weekNumber - b.weekNumber);

  const activePlan =
    filteredPlans.find((p) => p.id === selectedPlanId) ||
    filteredPlans[0] ||
    plans[0];

  const openCreateModal = () => {
    soundManager.playClick();
    setEditingPlanId(null);
    setFormGrade(selectedGrade === 'all' ? 6 : selectedGrade);
    setFormSemester(selectedSemester === 'all' ? 'HK1' : selectedSemester);
    setFormWeek(1);
    setFormPeriodRange('Tiết 1 - 2');
    setFormDuration(90);
    setFormChapter('Chương I. Tập hợp các số tự nhiên');
    setFormTitle('');
    setFormStatus('draft');
    setFormKnowledge('Nắm vững định nghĩa, tính chất và các bước giải dạng toán trọng tâm.');
    setFormCompetencies('Rèn tư duy lập luận toán học và giải quyết vấn đề thực tiễn.');
    setFormQualities('Chăm chỉ, cẩn thận, trung thực trong học tập.');
    setFormTeacherAids('Máy chiếu, phiếu học tập, bảng nhóm.');
    setFormStudentAids('SGK Toán THCS, vở ghi, thước kẻ, máy tính cầm tay.');
    setFormAct1('Tình huống thực tế mở đầu kết hợp câu hỏi ôn bài cũ.');
    setFormAct2('Hình thành khái niệm/định lý mới qua ví dụ mẫu và thảo luận nhóm.');
    setFormAct3('Làm bài tập củng cố tại lớp theo mức độ từ cơ bản đến vận dụng.');
    setFormAct4('Bài toán thực tế liên hệ đời sống và dặn dò chuẩn bị tiết sau.');
    setFormHomework('Làm bài tập SGK và hoàn thành đề luyện tập trên MathQuest.');
    setFormReflection('');
    setShowModal(true);
  };

  const openEditModal = (plan: LessonPlan) => {
    soundManager.playClick();
    setEditingPlanId(plan.id);
    setFormGrade(plan.grade);
    setFormSemester(plan.semester);
    setFormWeek(plan.weekNumber);
    setFormPeriodRange(plan.periodRange);
    setFormDuration(plan.durationMinutes);
    setFormChapter(plan.chapterName);
    setFormTitle(plan.title);
    setFormStatus(plan.status);
    setFormKnowledge(plan.objectives.knowledge.join('\n'));
    setFormCompetencies(plan.objectives.competencies.join('\n'));
    setFormQualities(plan.objectives.qualities.join('\n'));
    setFormTeacherAids(plan.teachingAids.teacher.join('\n'));
    setFormStudentAids(plan.teachingAids.student.join('\n'));
    setFormAct1(plan.activities[0]?.content || '');
    setFormAct2(plan.activities[1]?.content || '');
    setFormAct3(plan.activities[2]?.content || '');
    setFormAct4(plan.activities[3]?.content || '');
    setFormHomework(plan.homeworkAssignment);
    setFormReflection(plan.reflectionNotes);
    setShowModal(true);
  };

  const splitLines = (text: string): string[] =>
    text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const existing = editingPlanId ? plans.find((p) => p.id === editingPlanId) : null;
    const baseActivities: LessonActivityStep[] = existing?.activities
      ? existing.activities.map((act, idx) => ({
          ...act,
          content: [formAct1, formAct2, formAct3, formAct4][idx] || act.content,
        }))
      : [
          {
            id: `act-1-${Date.now()}`,
            phaseNumber: 1,
            phaseName: 'Hoạt động 1: Khởi động',
            durationMinutes: 7,
            objective: 'Tạo hứng thú và kết nối kiến thức nền.',
            content: formAct1,
            expectedProduct: 'Câu trả lời của học sinh.',
            implementationSteps: {
              assignTask: 'GV nêu câu hỏi/tình huống mở đầu cho cả lớp.',
              studentWork: 'HS suy nghĩ cá nhân hoặc trao đổi cặp đôi.',
              reportDiscuss: '2 HS nêu ý kiến, cả lớp nhận xét.',
              teacherConclusion: 'GV dẫn dắt vào bài mới.',
            },
          },
          {
            id: `act-2-${Date.now()}`,
            phaseNumber: 2,
            phaseName: 'Hoạt động 2: Hình thành kiến thức mới',
            durationMinutes: Math.max(15, Math.round(formDuration * 0.4)),
            objective: 'HS khám phá và nắm chắc kiến thức trọng tâm.',
            content: formAct2,
            expectedProduct: 'Định nghĩa/quy tắc và ví dụ ghi vở chuẩn.',
            implementationSteps: {
              assignTask: 'GV giao phiếu học tập và hướng dẫn ví dụ mẫu.',
              studentWork: 'HS thảo luận nhóm hoàn thành nội dung khám phá.',
              reportDiscuss: 'Đại diện nhóm trình bày bảng, các nhóm khác phản biện.',
              teacherConclusion: 'GV chuẩn hóa kiến thức ghi bảng.',
            },
          },
          {
            id: `act-3-${Date.now()}`,
            phaseNumber: 3,
            phaseName: 'Hoạt động 3: Luyện tập',
            durationMinutes: Math.max(12, Math.round(formDuration * 0.35)),
            objective: 'Củng cố kỹ năng giải toán và khắc phục lỗi sai.',
            content: formAct3,
            expectedProduct: 'Lời giải bài tập tại lớp.',
            implementationSteps: {
              assignTask: 'GV giao bài tập phân mức trên bảng/máy chiếu.',
              studentWork: 'HS tự giải vào vở, 2 HS lên bảng trình bày.',
              reportDiscuss: 'Cả lớp đối chiếu đáp án và nhận xét bài làm.',
              teacherConclusion: 'GV chốt phương pháp và lưu ý lỗi sai thường gặp.',
            },
          },
          {
            id: `act-4-${Date.now()}`,
            phaseNumber: 4,
            phaseName: 'Hoạt động 4: Vận dụng & Dặn dò',
            durationMinutes: 8,
            objective: 'Liên hệ thực tiễn và hướng dẫn tự học ở nhà.',
            content: formAct4,
            expectedProduct: 'Phương án giải bài toán thực tế.',
            implementationSteps: {
              assignTask: 'GV nêu bài toán thực tế và giao BTVN.',
              studentWork: 'HS trao đổi nhanh hướng giải quyết.',
              reportDiscuss: 'Đại diện 1 nhóm báo cáo ý tưởng.',
              teacherConclusion: 'GV tổng kết tiết học và giao nhiệm vụ tiết sau.',
            },
          },
        ];

    const newPlan: LessonPlan = {
      id: existing?.id || `lp-${Date.now()}`,
      grade: formGrade,
      semester: formSemester,
      weekNumber: Math.max(1, Math.min(35, Number(formWeek) || 1)),
      periodRange: formPeriodRange.trim() || 'Tiết 1',
      durationMinutes: Math.max(45, Number(formDuration) || 45),
      chapterName: formChapter.trim() || 'Chuyên đề Toán THCS',
      title: formTitle.trim(),
      textbookSeries: existing?.textbookSeries || 'Kết nối tri thức với cuộc sống (GDPT 2018)',
      teacherName: 'Cô Diễm Quỳnh',
      status: formStatus,
      updatedAt: new Date().toLocaleDateString('vi-VN'),
      objectives: {
        knowledge: splitLines(formKnowledge),
        competencies: splitLines(formCompetencies),
        qualities: splitLines(formQualities),
      },
      teachingAids: {
        teacher: splitLines(formTeacherAids),
        student: splitLines(formStudentAids),
      },
      activities: baseActivities,
      homeworkAssignment: formHomework.trim(),
      reflectionNotes: formReflection.trim(),
    };

    const next = existing
      ? plans.map((p) => (p.id === existing.id ? newPlan : p))
      : [newPlan, ...plans];

    persistPlans(next);
    setSelectedPlanId(newPlan.id);
    soundManager.playCorrect();
    setShowModal(false);
  };

  const handleToggleStatus = (plan: LessonPlan) => {
    soundManager.playClick();
    const order: LessonPlanStatus[] = ['draft', 'approved', 'taught'];
    const nextStatus = order[(order.indexOf(plan.status) + 1) % order.length];
    const next = plans.map((p) =>
      p.id === plan.id
        ? { ...p, status: nextStatus, updatedAt: new Date().toLocaleDateString('vi-VN') }
        : p
    );
    persistPlans(next);
  };

  const handleDeletePlan = (planId: string) => {
    if (plans.length <= 1) return;
    soundManager.playClick();
    const next = plans.filter((p) => p.id !== planId);
    persistPlans(next);
    if (selectedPlanId === planId) {
      setSelectedPlanId(next[0]?.id || '');
    }
  };

  const handleCopyLessonPlan = (plan: LessonPlan) => {
    soundManager.playClick();
    const lines: string[] = [
      `KẾ HOẠCH BÀI DẠY (CHUẨN CÔNG VĂN 5512)`,
      `Môn: Toán ${plan.grade} (${plan.semester}) | Tuần ${plan.weekNumber} (${plan.periodRange} - ${plan.durationMinutes} phút)`,
      `Chủ đề: ${plan.chapterName}`,
      `Tên bài: ${plan.title}`,
      `Giáo viên soạn: ${plan.teacherName}`,
      ``,
      `I. MỤC TIÊU`,
      `1. Kiến thức:`,
      ...plan.objectives.knowledge.map((k) => `- ${k}`),
      `2. Năng lực:`,
      ...plan.objectives.competencies.map((c) => `- ${c}`),
      `3. Phẩm chất:`,
      ...plan.objectives.qualities.map((q) => `- ${q}`),
      ``,
      `II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU`,
      `- Giáo viên: ${plan.teachingAids.teacher.join('; ')}`,
      `- Học sinh: ${plan.teachingAids.student.join('; ')}`,
      ``,
      `III. TIẾN TRÌNH DẠY HỌC`,
      ...plan.activities.flatMap((act) => [
        `${act.phaseName} (${act.durationMinutes} phút)`,
        `  + Mục tiêu: ${act.objective}`,
        `  + Nội dung: ${act.content}`,
        `  + Sản phẩm: ${act.expectedProduct}`,
        `  + Tổ chức thực hiện:`,
        `    * B1 (Chuyển giao): ${act.implementationSteps.assignTask}`,
        `    * B2 (Thực hiện): ${act.implementationSteps.studentWork}`,
        `    * B3 (Báo cáo/Thảo luận): ${act.implementationSteps.reportDiscuss}`,
        `    * B4 (Kết luận): ${act.implementationSteps.teacherConclusion}`,
        ``,
      ]),
      `IV. HƯỚNG DẪN VỀ NHÀ & RÚT KINH NGHIỆM`,
      `- BTVN: ${plan.homeworkAssignment}`,
      `- Rút kinh nghiệm: ${plan.reflectionNotes || 'Chưa có ghi chú'}`,
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  const taughtCount = plans.filter((p) => p.status === 'taught').length;
  const approvedCount = plans.filter((p) => p.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-indigo-800/70 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-xs font-bold text-indigo-100">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isEn
                  ? 'Standard 5512 Lesson Plans · GDPT 2018 Curriculum'
                  : 'Kế Hoạch Bài Dạy Chuẩn Công Văn 5512 · GDPT 2018'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isEn
                ? 'Lesson Plans & Teaching Roadmap (Grades 6–9)'
                : 'Giáo Án & Lộ Trình Giảng Dạy Toán THCS'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              {isEn
                ? 'Manage weekly curriculum lesson plans with objectives, teaching aids, and 4 structured classroom activities with minute-by-minute timing.'
                : 'Quản lý giáo án chi tiết theo từng tuần PPCT (Khối 6 – 9), đầy đủ mục tiêu phẩm chất – năng lực, thiết bị dạy học và 4 hoạt động lên lớp thực tế kèm phân bổ thời gian từng phút.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">
                {isEn ? 'Total Plans' : 'Tổng Giáo Án'}
              </span>
              <span className="text-xl font-black font-mono text-white">{plans.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">
                {isEn ? 'Taught' : 'Đã Giảng Dạy'}
              </span>
              <span className="text-xl font-black font-mono text-emerald-300">{taughtCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">
                {isEn ? 'Approved' : 'Đã Duyệt'}
              </span>
              <span className="text-xl font-black font-mono text-amber-300">{approvedCount}</span>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isEn ? 'New Lesson Plan' : 'Soạn Giáo Án Mới'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 6, 7, 8, 9] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedGrade(g);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                selectedGrade === g
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {g === 'all' ? (isEn ? 'All Grades' : 'Tất cả khối') : (isEn ? `Grade ${g}` : `Toán ${g}`)}
            </button>
          ))}

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {(['all', 'HK1', 'HK2'] as const).map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedSemester(sem);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sem === 'all' ? (isEn ? 'Full Year' : 'Cả năm') : sem}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEn ? 'Search lesson, chapter, week...' : 'Tìm tên bài, chương, tuần...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Split View: Left Roadmap List + Right Detailed 5512 Lesson Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Curriculum Roadmap Timeline */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {isEn
                  ? `Teaching Roadmap (${filteredPlans.length} plans)`
                  : `Lộ trình giảng dạy (${filteredPlans.length} bài)`}
              </span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {filteredPlans.map((plan) => {
              const isSelected = activePlan?.id === plan.id;
              const statusMeta = STATUS_META[plan.status];
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPlanId(plan.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-4 ring-indigo-500/10 shadow-md'
                      : 'bg-white/90 hover:bg-white border-slate-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold text-[11px] border border-indigo-100">
                      Toán {plan.grade} · Tuần {plan.weekNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="text-sm font-extrabold text-slate-900 leading-snug">
                    {plan.title}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2">
                    <span className="truncate">{plan.chapterName}</span>
                    <span className="font-mono font-semibold text-slate-600 shrink-0">
                      {plan.periodRange}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredPlans.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                Chưa có giáo án nào khớp bộ lọc hiện tại. Bấm <b>Soạn Giáo Án Mới</b> để thêm!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed 5512 Lesson Plan Document */}
        {activePlan && (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Document Header + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-bold">
                    Toán Lớp {activePlan.grade} · {activePlan.semester}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold">
                    Tuần {activePlan.weekNumber} · {activePlan.periodRange} ({activePlan.durationMinutes} phút)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(activePlan)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold border cursor-pointer transition-opacity hover:opacity-80 ${STATUS_META[activePlan.status].badgeClass}`}
                    title="Bấm để đổi trạng thái (Đang soạn → Đã duyệt → Đã giảng dạy)"
                  >
                    {STATUS_META[activePlan.status].label}
                  </button>
                </div>

                <p className="text-xs font-semibold text-indigo-700">
                  {activePlan.chapterName}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activePlan.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Bộ sách: <b>{activePlan.textbookSeries}</b> · GV soạn: <b>{activePlan.teacherName}</b> · Cập nhật: {activePlan.updatedAt}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
                {onCreateSlidesFromPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onCreateSlidesFromPlan(activePlan);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Create Lecture Slides' : 'Tạo Slide Bài Giảng'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(activePlan)}
                  className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Edit' : 'Chỉnh sửa'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLessonPlan(activePlan)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? (isEn ? 'Copied' : 'Đã chép') : (isEn ? 'Copy' : 'Sao chép')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    window.print();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Print Plan' : 'In giáo án'}</span>
                </button>
                {plans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(activePlan.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                    title="Xóa giáo án này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Section I: Mục tiêu */}
            <section className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>I. Mục tiêu bài học</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                  <div className="font-extrabold text-indigo-900">1. Về kiến thức</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                    {activePlan.objectives.knowledge.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                  <div className="font-extrabold text-emerald-900">2. Về năng lực</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                    {activePlan.objectives.competencies.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                  <div className="font-extrabold text-amber-900">3. Về phẩm chất</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                    {activePlan.objectives.qualities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section II: Thiết bị dạy học */}
            <section className="space-y-2.5">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>II. Thiết bị dạy học và học liệu</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-800 block">Giáo viên chuẩn bị:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    {activePlan.teachingAids.teacher.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-800 block">Học sinh chuẩn bị:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    {activePlan.teachingAids.student.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section III: Tiến trình dạy học thực tế (4 Hoạt động chuẩn 5512) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                  <span>III. Tiến trình dạy học (Lộ trình 4 hoạt động trên lớp)</span>
                </h4>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Tổng: {activePlan.activities.reduce((sum, a) => sum + a.durationMinutes, 0)} phút
                </span>
              </div>

              <div className="space-y-4">
                {activePlan.activities.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                  >
                    <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-extrabold">{act.phaseName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/15 font-mono text-[11px] font-bold flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-amber-300" />
                        {act.durationMinutes} phút
                      </span>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-0.5">a) Mục tiêu</span>
                          <p className="text-slate-600 leading-relaxed">{act.objective}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-0.5">b) Nội dung</span>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{act.content}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-0.5">c) Sản phẩm dự kiến</span>
                          <p className="text-slate-600 leading-relaxed">{act.expectedProduct}</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-1.5">
                        <span className="font-extrabold text-indigo-950 block">
                          d) Tổ chức thực hiện (4 bước chuẩn sư phạm):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 leading-relaxed">
                          <div>
                            <b className="text-indigo-700">• B1 Chuyển giao:</b> {act.implementationSteps.assignTask}
                          </div>
                          <div>
                            <b className="text-indigo-700">• B2 Thực hiện:</b> {act.implementationSteps.studentWork}
                          </div>
                          <div>
                            <b className="text-indigo-700">• B3 Báo cáo/Thảo luận:</b> {act.implementationSteps.reportDiscuss}
                          </div>
                          <div>
                            <b className="text-indigo-700">• B4 Kết luận:</b> {act.implementationSteps.teacherConclusion}
                          </div>
                        </div>
                      </div>

                      {act.boardNotes && (
                        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-100 font-mono text-[11px] whitespace-pre-line border border-emerald-800">
                          <span className="font-bold text-amber-300 block mb-1 uppercase text-[10px]">
                            Trình bày bảng trọng tâm:
                          </span>
                          {act.boardNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section IV: Dặn dò & Rút kinh nghiệm */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5">
                <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Hướng dẫn học ở nhà (BTVN)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{activePlan.homeworkAssignment}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Rút kinh nghiệm sau tiết dạy</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activePlan.reflectionNotes || 'Chưa có ghi chú rút kinh nghiệm sau tiết dạy.'}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {editingPlanId ? 'Chỉnh Sửa Giáo Án (KHBD)' : 'Soạn Giáo Án Mới (Chuẩn 5512)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Điền thông tin bài dạy và lộ trình 4 hoạt động trên lớp
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khối lớp</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value={6}>Toán 6</option>
                    <option value={7}>Toán 7</option>
                    <option value={8}>Toán 8</option>
                    <option value={9}>Toán 9</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Học kỳ</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as 'HK1' | 'HK2')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="HK1">Học kỳ 1</option>
                    <option value="HK2">Học kỳ 2</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tuần PPCT</label>
                  <input
                    type="number"
                    min={1}
                    max={35}
                    value={formWeek}
                    onChange={(e) => setFormWeek(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trạng thái</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LessonPlanStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="draft">Đang soạn</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="taught">Đã giảng dạy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tiết PPCT</label>
                  <input
                    type="text"
                    value={formPeriodRange}
                    onChange={(e) => setFormPeriodRange(e.target.value)}
                    placeholder="VD: Tiết 10 - 11"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min={45}
                    max={180}
                    step={45}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chương / Chủ đề</label>
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên bài dạy <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Bài 12: Ước chung và Ước chung lớn nhất"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mục tiêu kiến thức (mỗi dòng 1 ý)</label>
                  <textarea
                    rows={3}
                    value={formKnowledge}
                    onChange={(e) => setFormKnowledge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Năng lực cần đạt</label>
                  <textarea
                    rows={3}
                    value={formCompetencies}
                    onChange={(e) => setFormCompetencies(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phẩm chất</label>
                  <textarea
                    rows={3}
                    value={formQualities}
                    onChange={(e) => setFormQualities(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thiết bị của Giáo viên</label>
                  <textarea
                    rows={2}
                    value={formTeacherAids}
                    onChange={(e) => setFormTeacherAids(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Học liệu của Học sinh</label>
                  <textarea
                    rows={2}
                    value={formStudentAids}
                    onChange={(e) => setFormStudentAids(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hoạt động 1: Khởi động</label>
                  <textarea
                    rows={2}
                    value={formAct1}
                    onChange={(e) => setFormAct1(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hoạt động 2: Hình thành kiến thức</label>
                  <textarea
                    rows={2}
                    value={formAct2}
                    onChange={(e) => setFormAct2(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hoạt động 3: Luyện tập</label>
                  <textarea
                    rows={2}
                    value={formAct3}
                    onChange={(e) => setFormAct3(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hoạt động 4: Vận dụng & Dặn dò</label>
                  <textarea
                    rows={2}
                    value={formAct4}
                    onChange={(e) => setFormAct4(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hướng dẫn BTVN</label>
                  <input
                    type="text"
                    value={formHomework}
                    onChange={(e) => setFormHomework(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rút kinh nghiệm sau tiết dạy</label>
                  <input
                    type="text"
                    value={formReflection}
                    onChange={(e) => setFormReflection(e.target.value)}
                    placeholder="Ghi chú tỉ lệ HS hiểu bài, cần điều chỉnh..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingPlanId ? 'Lưu Cập Nhật' : 'Lưu Giáo Án'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
