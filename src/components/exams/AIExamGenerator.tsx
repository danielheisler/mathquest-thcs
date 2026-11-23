import React, { useState } from 'react';
import { GradeLevel, SemesterExam, ExamQuestion } from '../../types/math';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import {
  Sparkles,
  FileText,
  BookOpenCheck,
  Printer,
  Play,
  Trash2,
  FolderOpen,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Wand2,
  SlidersHorizontal,
  Clock,
  Award,
  Lightbulb,
  Layers,
} from 'lucide-react';

interface AIExamGeneratorProps {
  aiExams: SemesterExam[];
  onSaveAIExam: (exam: SemesterExam) => void;
  onDeleteAIExam: (examId: string) => void;
  onTakeExam: (exam: SemesterExam) => void;
}

type AIExamPreset = 'midterm' | 'final' | 'quiz_15m' | 'custom';
type DifficultyOption = 'basic' | 'standard' | 'advanced';
type WorkspaceTab = 'exam' | 'solutions' | 'library';

const GRADE_TOPIC_SUGGESTIONS: Record<GradeLevel, string[]> = {
  6: [
    'Tập hợp số tự nhiên, lũy thừa, chia hết',
    'Số nguyên, quy tắc dấu ngoặc và phép tính',
    'Phân số, số thập phân và bài toán tỉ số phần trăm',
    'Hình học trực quan, điểm, đường thẳng, đoạn thẳng, góc',
    'Thu thập dữ liệu và xác suất thực nghiệm',
  ],
  7: [
    'Số hữu tỉ, số thực và giá trị tuyệt đối',
    'Tỉ lệ thức, đại lượng tỉ lệ thuận và tỉ lệ nghịch',
    'Biểu thức đại số và đa thức một biến',
    'Tam giác bằng nhau, đường đồng quy trong tam giác',
    'Hình lăng trụ đứng, biểu đồ đoạn thẳng và xác suất',
  ],
  8: [
    'Đa thức nhiều biến và 7 hằng đẳng thức đáng nhớ',
    'Phân thức đại số và các phép biến đổi',
    'Hàm số bậc nhất y = ax + b và đồ thị',
    'Tứ giác, định lí Thalès và tam giác đồng dạng',
    'Phương trình bậc nhất một ẩn và giải toán bằng lập phương trình',
  ],
  9: [
    'Hệ phương trình bậc nhất hai ẩn và bài toán thực tế',
    'Căn bậc hai, căn bậc ba và rút gọn biểu thức chứa căn',
    'Phương trình bậc hai, định lí Vi-ét và hàm số y = ax²',
    'Hệ thức lượng trong tam giác vuông và tỉ số lượng giác',
    'Đường tròn, góc nội tiếp, tứ giác nội tiếp (Ôn thi vào 10)',
  ],
};

const LEVEL_BADGES: Record<string, { label: string; cls: string }> = {
  nhan_biet: { label: 'Nhận biết', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  thong_hieu: { label: 'Thông hiểu', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  van_dung: { label: 'Vận dụng', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  van_dung_cao: { label: 'Vận dụng cao', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const AIExamGenerator: React.FC<AIExamGeneratorProps> = ({
  aiExams,
  onSaveAIExam,
  onDeleteAIExam,
  onTakeExam,
}) => {
  // Generator Form State
  const [grade, setGrade] = useState<GradeLevel>(8);
  const [semester, setSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [examType, setExamType] = useState<AIExamPreset>('midterm');
  const [difficulty, setDifficulty] = useState<DifficultyOption>('standard');
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [customCounts, setCustomCounts] = useState({ mc: 8, tf: 1, sa: 2, essay: 3 });

  // Active Exam & UI State
  const [activeExam, setActiveExam] = useState<SemesterExam | null>(() => aiExams[0] || null);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('solutions');
  const [showInlineAnswers, setShowInlineAnswers] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [printMode, setPrintMode] = useState<'exam' | 'solutions'>('exam');

  // Per-question deep AI explanation state
  const [deepExplanations, setDeepExplanations] = useState<Record<string, string>>({});
  const [loadingExplainId, setLoadingExplainId] = useState<string | null>(null);
  const [explainErrorMap, setExplainErrorMap] = useState<Record<string, string>>({});

  const handleGenerateExam = async () => {
    soundManager.playClick();
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          semester,
          examType,
          difficulty,
          topicPrompt,
          customCounts: examType === 'custom' ? customCounts : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.exam) {
        throw new Error(data?.error || 'Không thể tạo đề thi AI lúc này. Vui lòng thử lại.');
      }

      const newExam: SemesterExam = data.exam;
      setActiveExam(newExam);
      onSaveAIExam(newExam);
      setDeepExplanations({});
      setExplainErrorMap({});
      setWorkspaceTab('exam');
      soundManager.playCorrect();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Đã xảy ra lỗi kết nối tới máy chủ AI.');
      soundManager.playWrong();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplainDeeper = async (q: ExamQuestion) => {
    if (!activeExam) return;
    soundManager.playClick();
    setLoadingExplainId(q.id);
    setExplainErrorMap(prev => ({ ...prev, [q.id]: '' }));

    try {
      const res = await fetch('/api/ai/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.questionText,
          formula: q.formula,
          options: q.options,
          grade: activeExam.grade,
          currentExplanation: q.explanation || q.sampleSolution,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.detailedExplanation) {
        throw new Error(data?.error || 'Không thể lấy phân tích sâu từ AI.');
      }
      setDeepExplanations(prev => ({ ...prev, [q.id]: data.detailedExplanation }));
      soundManager.playCorrect();
    } catch (err: any) {
      setExplainErrorMap(prev => ({
        ...prev,
        [q.id]: err?.message || 'Lỗi kết nối AI khi phân tích câu hỏi.',
      }));
    } finally {
      setLoadingExplainId(null);
    }
  };

  const triggerPrint = (mode: 'exam' | 'solutions') => {
    soundManager.playClick();
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const renderSectionGroup = (exam: SemesterExam) => {
    const sections: { key: string; title: string; items: ExamQuestion[] }[] = [];
    exam.questions.forEach(q => {
      const secKey = q.section || 'I';
      const existing = sections.find(s => s.key === secKey);
      if (existing) {
        existing.items.push(q);
      } else {
        const fallbackTitle =
          secKey === 'I'
            ? 'PHẦN I. TRẮC NGHIỆM KHÁCH QUAN'
            : secKey === 'II'
              ? q.questionType === 'essay'
                ? 'PHẦN II. TỰ LUẬN'
                : 'PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI'
              : secKey === 'III'
                ? 'PHẦN III. TRẢ LỜI NGẮN'
                : 'PHẦN IV. TỰ LUẬN';
        sections.push({
          key: secKey,
          title: q.sectionTitle || fallbackTitle,
          items: [q],
        });
      }
    });
    return sections;
  };

  const getExamSummaryBadges = (exam: SemesterExam) => {
    const mc = exam.questions.filter(q => q.questionType === 'multiple_choice' || !q.questionType).length;
    const tf = exam.questions.filter(q => q.questionType === 'true_false').length;
    const sa = exam.questions.filter(q => q.questionType === 'short_answer').length;
    const essay = exam.questions.filter(q => q.questionType === 'essay').length;
    return { mc, tf, sa, essay };
  };

  const activeSections = activeExam ? renderSectionGroup(activeExam) : [];

  return (
    <div className="space-y-6">
      {/* Main Screen UI (hidden during A4 printing) */}
      <div className="space-y-6 no-print">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold tracking-wider uppercase border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Tạo Đề Thi AI Trực Tiếp · Không Cần Kho Tài Liệu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Phòng Ra Đề Toán THCS Bằng AI &amp; Giải Chi Tiết Từng Bước
              </h1>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Tự động biên soạn đề thi Toán Khối 6–9 hoàn toàn mới bất cứ lúc nào theo đúng mẫu chuẩn của{' '}
                <b>Cô Diễm Quỳnh</b> (Giữa kỳ / Cuối kỳ 20 câu hoặc Kiểm tra 15 phút 6 câu), kèm{' '}
                <b>Mục Giải Chi Tiết từng câu</b>, biểu điểm chấm tự luận và chế độ in giấy A4.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px]">
                <div className="text-2xl font-black text-amber-300">{aiExams.length}</div>
                <div className="text-[11px] font-semibold text-indigo-100">Đề AI đã lưu</div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center min-w-[110px]">
                <div className="text-2xl font-black text-emerald-300">100%</div>
                <div className="text-[11px] font-semibold text-indigo-100">Có giải chi tiết</div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Thiết Lập Ma Trận &amp; Yêu Cầu Tạo Đề Mới
                </h2>
                <p className="text-xs text-slate-500">
                  AI tự sáng tạo câu hỏi mới 100% theo Chương trình GDPT 2018 — không cần tải file hay kho đề sẵn.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left column: Grade, Semester, Difficulty */}
            <div className="lg:col-span-5 space-y-4">
              {/* Grade */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  1. Chọn Khối Lớp
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([6, 7, 8, 9] as GradeLevel[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setGrade(g);
                      }}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        grade === g
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    2. Học Kỳ
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['HK1', 'HK2'] as const).map(sem => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setSemester(sem);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          semester === sem
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sem === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    3. Mức Độ Phân Hóa
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as DifficultyOption)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="basic">Cơ bản (Nhẹ nhàng)</option>
                    <option value="standard">Chuẩn GDPT 2018</option>
                    <option value="advanced">Nâng cao / Bồi dưỡng HSG</option>
                  </select>
                </div>
              </div>

              {/* Exam Structure Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  4. Cấu Trúc Đề Thi (Chuẩn Cô Diễm Quỳnh)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'midterm' as AIExamPreset,
                      title: 'Đề Giữa Kỳ (60p)',
                      desc: '12 TN ABCD + 1 Đ/S (4 ý) + 2 TLN + 5 Tự luận',
                    },
                    {
                      id: 'final' as AIExamPreset,
                      title: 'Đề Cuối Kỳ (90p)',
                      desc: '12 TN ABCD + 1 Đ/S (4 ý) + 2 TLN + 5 Tự luận',
                    },
                    {
                      id: 'quiz_15m' as AIExamPreset,
                      title: 'Kiểm Tra 15 Phút',
                      desc: '4 câu TN ABCD (4đ) + 2 câu Tự luận (6đ)',
                    },
                    {
                      id: 'custom' as AIExamPreset,
                      title: 'Chuyên Đề Tùy Chỉnh',
                      desc: 'Tự chọn số câu cho từng dạng bài',
                    },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setExamType(preset.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        examType === preset.id
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                        <span>{preset.title}</span>
                        {examType === preset.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom counts if custom selected */}
              {examType === 'custom' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tùy chỉnh số lượng câu từng phần (Tổng 10 điểm)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'mc', label: 'TN ABCD', max: 16 },
                      { key: 'tf', label: 'Đúng/Sai', max: 4 },
                      { key: 'sa', label: 'Trả lời ngắn', max: 6 },
                      { key: 'essay', label: 'Tự luận', max: 6 },
                    ].map(field => (
                      <div key={field.key} className="bg-white p-2 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{field.label}</label>
                        <input
                          type="number"
                          min={0}
                          max={field.max}
                          value={customCounts[field.key as keyof typeof customCounts]}
                          onChange={e =>
                            setCustomCounts(prev => ({
                              ...prev,
                              [field.key]: Math.max(0, Math.min(field.max, Number(e.target.value) || 0)),
                            }))
                          }
                          className="w-full text-sm font-black text-indigo-700 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Free-form topic prompt & quick chips */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  5. Nội Dung Kiến Thức / Yêu Cầu Riêng (Không Bắt Buộc)
                </label>
                <textarea
                  rows={4}
                  value={topicPrompt}
                  onChange={e => setTopicPrompt(e.target.value)}
                  placeholder={`Ví dụ: Tập trung vào chuyên đề Toán lớp ${grade} ${semester}, thêm 1 bài toán thực tế mua sắm / tính khoảng cách, câu tự luận cuối là bài chứng minh bất đẳng thức hoặc hình học nâng cao...`}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />

                <div>
                  <div className="text-[11px] font-bold text-slate-500 mb-2">
                    Gợi ý chuyên đề nhanh Toán Lớp {grade} (nhấn để điền):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {GRADE_TOPIC_SUGGESTIONS[grade].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setTopicPrompt(prev => (prev.trim() ? `${prev.trim()}; ${chip}` : chip));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-100 transition-colors cursor-pointer"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Generate CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateExam}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 disabled:opacity-60 text-white font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI đang biên soạn đề thi &amp; lời giải chi tiết (15–30 giây)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Tạo Đề Thi &amp; Lời Giải Chi Tiết Bằng AI Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setWorkspaceTab('exam');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                workspaceTab === 'exam'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Xem Đề Thi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setWorkspaceTab('solutions');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                workspaceTab === 'solutions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Giải Chi Tiết Từng Bước</span>
              {activeExam && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    workspaceTab === 'solutions' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {activeExam.questions.length} câu
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setWorkspaceTab('library');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                workspaceTab === 'library'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Kho Đề AI Đã Tạo ({aiExams.length})</span>
            </button>
          </div>

          {/* Quick Actions for Active Exam */}
          {activeExam && workspaceTab !== 'library' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onTakeExam(activeExam);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Làm Thử / Thi Ngay</span>
              </button>
              <button
                type="button"
                onClick={() => triggerPrint('exam')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Đề A4</span>
              </button>
              <button
                type="button"
                onClick={() => triggerPrint('solutions')}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Giải Chi Tiết A4</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State if no active exam */}
        {!activeExam && workspaceTab !== 'library' && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Chưa có đề AI nào đang mở
            </h3>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Hãy chọn khối lớp, cấu trúc đề ở khung phía trên rồi nhấn{' '}
              <b>“Tạo Đề Thi &amp; Lời Giải Chi Tiết Bằng AI Ngay”</b>. Đề mới sẽ tự động lưu vào kho đề của ứng dụng và sẵn sàng để học sinh thi thử hoặc in giấy A4.
            </p>
          </div>
        )}

        {/* Active Exam Header Card */}
        {activeExam && workspaceTab !== 'library' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-violet-100 text-violet-800 text-[11px] font-extrabold">
                    ✨ AI Biên Soạn
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                    Toán Lớp {activeExam.grade} · {activeExam.semester}
                  </span>
                  {activeExam.code && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-mono text-[11px] font-bold">
                      Mã đề: {activeExam.code}
                    </span>
                  )}
                  {activeExam.createdAt && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tạo lúc: {activeExam.createdAt}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900">{activeExam.title}</h2>
                <p className="text-xs text-slate-600">{activeExam.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {activeExam.durationMinutes} phút
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  {activeExam.questions.length} câu
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Thang {activeExam.totalPoints} điểm
                </span>
              </div>
            </div>

            {/* Matrix Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <span className="text-emerald-800 font-semibold">Nhận biết</span>
                <span className="font-black text-emerald-700">{activeExam.matrix.nhanBiet}%</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                <span className="text-sky-800 font-semibold">Thông hiểu</span>
                <span className="font-black text-sky-700">{activeExam.matrix.thongHieu}%</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <span className="text-amber-800 font-semibold">Vận dụng</span>
                <span className="font-black text-amber-700">{activeExam.matrix.vanDung}%</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <span className="text-rose-800 font-semibold">Vận dụng cao</span>
                <span className="font-black text-rose-700">{activeExam.matrix.vanDungCao}%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: EXAM PAPER VIEW */}
        {activeExam && workspaceTab === 'exam' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="text-sm font-extrabold text-slate-900">
                Nội Dung Đề Thi Hoàn Chỉnh
              </div>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowInlineAnswers(prev => !prev);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {showInlineAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showInlineAnswers ? 'Ẩn Đáp Án Nhanh' : 'Hiện Đáp Án Nhanh'}</span>
              </button>
            </div>

            {activeSections.map(section => (
              <div key={section.key} className="space-y-4">
                <div className="px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-black text-sm">
                  {section.title}
                </div>

                <div className="space-y-4">
                  {section.items.map(q => {
                    const lvl = LEVEL_BADGES[q.level] || LEVEL_BADGES.thong_hieu;
                    return (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-xs font-black">
                              Câu {q.number}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${lvl.cls}`}>
                              {lvl.label}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-slate-500">({q.points} điểm)</span>
                        </div>

                        <div className="text-sm text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                          {q.questionText}
                        </div>

                        {q.formula && (
                          <div className="p-3 rounded-xl bg-white border border-slate-200 overflow-x-auto">
                            <MathView math={q.formula} displayMode />
                          </div>
                        )}

                        {/* Multiple choice options */}
                        {(q.questionType === 'multiple_choice' || !q.questionType) && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, idx) => {
                              const isCorrect = idx === q.correctAnswerIndex;
                              return (
                                <div
                                  key={idx}
                                  className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2 ${
                                    showInlineAnswers && isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                      : 'bg-white border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <span className="font-black text-indigo-700 shrink-0">
                                    {String.fromCharCode(65 + idx)}.
                                  </span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* True / False sub-questions */}
                        {q.questionType === 'true_false' && q.subQuestions && (
                          <div className="space-y-2 pt-1">
                            {q.subQuestions.map(sub => (
                              <div
                                key={sub.id}
                                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm flex items-center justify-between gap-3"
                              >
                                <div>
                                  <span className="font-black text-indigo-700 mr-1.5">{sub.label})</span>
                                  <span className="text-slate-800">{sub.text}</span>
                                </div>
                                {showInlineAnswers && (
                                  <span
                                    className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] shrink-0 ${
                                      sub.isCorrect
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {q.questionType === 'short_answer' && showInlineAnswers && (
                          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                            Đáp số: {q.correctShortAnswer}
                          </div>
                        )}

                        {/* Essay */}
                        {q.questionType === 'essay' && showInlineAnswers && q.sampleSolution && (
                          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 whitespace-pre-line leading-relaxed">
                            <div className="font-extrabold text-emerald-800 mb-1">Tóm tắt lời giải:</div>
                            {q.sampleSolution}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DETAILED STEP-BY-STEP SOLUTIONS VIEW */}
        {activeExam && workspaceTab === 'solutions' && (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950">
                    Mục Giải Chi Tiết Từng Câu &amp; Biểu Điểm Sư Phạm
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Mỗi câu hỏi đều có đáp án chuẩn, phân tích từng bước giải, biểu điểm chấm tự luận và nút{' '}
                    <b>“AI Phân Tích Sâu 4 Bước”</b> để hỗ trợ học sinh hiểu cặn kẽ.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerPrint('solutions')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Toàn Bộ Giải Chi Tiết (A4)</span>
              </button>
            </div>

            {activeSections.map(section => (
              <div key={section.key} className="space-y-4">
                <div className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-black text-sm">
                  {section.title}
                </div>

                {section.items.map(q => {
                  const lvl = LEVEL_BADGES[q.level] || LEVEL_BADGES.thong_hieu;
                  const deepText = deepExplanations[q.id];
                  const deepErr = explainErrorMap[q.id];
                  const isLoadingDeep = loadingExplainId === q.id;

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4"
                    >
                      {/* Question header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black">
                            Câu {q.number}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${lvl.cls}`}>
                            {lvl.label}
                          </span>
                          <span className="text-xs font-bold text-slate-500">({q.points} điểm)</span>
                        </div>

                        {/* Correct Answer Pill */}
                        {(q.questionType === 'multiple_choice' || !q.questionType) &&
                          q.options &&
                          q.correctAnswerIndex !== undefined && (
                            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black">
                              Đáp án đúng: {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}
                            </span>
                          )}

                        {q.questionType === 'short_answer' && q.correctShortAnswer && (
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black">
                            Đáp số: {q.correctShortAnswer}
                          </span>
                        )}
                      </div>

                      {/* Question statement */}
                      <div className="text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                        {q.questionText}
                      </div>

                      {q.formula && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                          <MathView math={q.formula} displayMode />
                        </div>
                      )}

                      {/* True / False itemized explanations */}
                      {q.questionType === 'true_false' && q.subQuestions && (
                        <div className="space-y-2.5">
                          <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                            Đáp án &amp; giải thích từng ý a, b, c, d:
                          </div>
                          {q.subQuestions.map(sub => (
                            <div
                              key={sub.id}
                              className={`p-3.5 rounded-2xl border text-xs sm:text-sm space-y-1 ${
                                sub.isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-200'
                                  : 'bg-rose-50/60 border-rose-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-semibold text-slate-900">
                                  <span className="font-black mr-1.5">{sub.label})</span>
                                  {sub.text}
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-md font-black text-[11px] shrink-0 ${
                                    sub.isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-rose-600 text-white'
                                  }`}
                                >
                                  {sub.isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                              </div>
                              {sub.explanation && (
                                <div className="text-xs text-slate-700 pl-4 border-l-2 border-slate-300 mt-1">
                                  <b>Giải thích:</b> {sub.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Step-by-step detailed solution box */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                        <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-emerald-600" />
                          <span>Lời Giải Chi Tiết Từng Bước</span>
                        </div>
                        <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                          {q.questionType === 'essay' && q.sampleSolution
                            ? q.sampleSolution
                            : q.explanation}
                        </div>

                        {q.questionType === 'short_answer' && q.acceptedAnswers && q.acceptedAnswers.length > 1 && (
                          <div className="text-xs text-emerald-800 pt-1">
                            <b>Các cách viết tương đương được chấm đúng:</b> {q.acceptedAnswers.join(' ; ')}
                          </div>
                        )}
                      </div>

                      {/* Essay grading rubric table */}
                      {q.questionType === 'essay' && q.rubric && q.rubric.length > 0 && (
                        <div className="rounded-2xl border border-indigo-200 overflow-hidden">
                          <div className="px-4 py-2 bg-indigo-50 text-xs font-extrabold text-indigo-900">
                            Biểu Điểm Chấm Tự Luận Chi Tiết
                          </div>
                          <div className="divide-y divide-indigo-100">
                            {q.rubric.map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="px-4 py-2.5 bg-white flex items-center justify-between gap-4 text-xs"
                              >
                                <span className="text-slate-700">{step.step}</span>
                                <span className="font-black text-indigo-700 shrink-0">
                                  +{step.points} đ
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deep Pedagogical Explanation Trigger */}
                      <div className="pt-1 flex flex-col gap-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            disabled={isLoadingDeep}
                            onClick={() => handleExplainDeeper(q)}
                            className="px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                          >
                            {isLoadingDeep ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>AI đang phân tích sâu 4 bước...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>
                                  {deepText
                                    ? 'Tạo Lại Phân Tích Sâu 4 Bước'
                                    : 'AI Giải Thích Sâu Hơn (Công Thức · Bước Giải · Lỗi Sai · Mẹo)'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>

                        {deepErr && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                            {deepErr}
                          </div>
                        )}

                        {deepText && (
                          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-1.5">
                            <div className="text-xs font-black text-violet-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-violet-600" />
                              <span>Phân Tích Sư Phạm Chuyên Sâu Từ Trợ Lý AI</span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                              {deepText}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SAVED AI EXAMS LIBRARY */}
        {workspaceTab === 'library' && (
          <div className="space-y-4">
            {aiExams.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-2">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-800">
                  Kho Đề AI Đang Trống
                </h3>
                <p className="text-xs text-slate-500">
                  Mọi đề thi bạn tạo bằng AI sẽ tự động được lưu tại đây và đồng bộ sang mục Luyện Đề Thi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiExams.map(exam => {
                  const counts = getExamSummaryBadges(exam);
                  const isCurrent = activeExam?.id === exam.id;
                  return (
                    <div
                      key={exam.id}
                      className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between gap-4 ${
                        isCurrent
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-violet-100 text-violet-800 text-[11px] font-extrabold">
                            ✨ Toán Lớp {exam.grade} · {exam.semester}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{exam.code}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{exam.description}</p>
                        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100">{exam.durationMinutes} phút</span>
                          {counts.mc > 0 && <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">{counts.mc} TN</span>}
                          {counts.tf > 0 && <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">{counts.tf} Đ/S</span>}
                          {counts.sa > 0 && <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">{counts.sa} TLN</span>}
                          {counts.essay > 0 && <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">{counts.essay} Tự luận</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setActiveExam(exam);
                            setWorkspaceTab('solutions');
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs cursor-pointer"
                        >
                          Xem Giải Chi Tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            onTakeExam(exam);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Thi Ngay
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            if (window.confirm(`Xóa đề "${exam.title}" khỏi kho đề AI?`)) {
                              onDeleteAIExam(exam.id);
                              if (activeExam?.id === exam.id) {
                                setActiveExam(aiExams.find(e => e.id !== exam.id) || null);
                              }
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Xóa đề này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRINT-ONLY A4 SHEET (Either Clean Exam Paper or Full Detailed Solutions Sheet) */}
      {activeExam && (
        <div className="hidden print:block text-black bg-white p-4 text-[12pt] leading-relaxed">
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-4">
            <div className="text-center w-5/12">
              <div className="font-bold uppercase text-xs">TRƯỜNG THCS · TỔ TOÁN HỌC</div>
              <div className="font-bold text-xs mt-0.5">GV Phụ Trách: Cô Diễm Quỳnh</div>
              <div className="text-[11px] mt-0.5">Mã đề: {activeExam.code || 'AI-THCS'}</div>
            </div>
            <div className="text-center w-7/12">
              <div className="font-black uppercase text-sm">
                {printMode === 'exam'
                  ? activeExam.title
                  : `ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT - ${activeExam.title}`}
              </div>
              <div className="text-xs italic mt-0.5">
                Môn: Toán Lớp {activeExam.grade} ({activeExam.semester}) · Thời gian làm bài: {activeExam.durationMinutes} phút
              </div>
            </div>
          </div>

          {printMode === 'exam' && (
            <div className="mb-4 text-xs flex justify-between border border-black p-2">
              <span>Họ và tên học sinh: ........................................................................</span>
              <span>Lớp: .................</span>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-4">
            {activeSections.map(section => (
              <div key={section.key} className="space-y-2.5">
                <div className="font-bold uppercase text-sm border-b border-slate-400 pb-1">
                  {section.title}
                </div>

                {section.items.map(q => (
                  <div key={q.id} className="break-inside-avoid space-y-1">
                    <div className="text-xs sm:text-sm">
                      <b>Câu {q.number} ({q.points}đ):</b> {q.questionText}
                    </div>
                    {q.formula && (
                      <div className="my-1">
                        <MathView math={q.formula} displayMode />
                      </div>
                    )}

                    {/* Exam print view */}
                    {printMode === 'exam' && (
                      <>
                        {(q.questionType === 'multiple_choice' || !q.questionType) && q.options && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 text-xs">
                            {q.options.map((opt, idx) => (
                              <div key={idx}>
                                <b>{String.fromCharCode(65 + idx)}.</b> {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        {q.questionType === 'true_false' && q.subQuestions && (
                          <div className="pl-4 space-y-0.5 text-xs">
                            {q.subQuestions.map(sub => (
                              <div key={sub.id}>
                                <b>{sub.label})</b> {sub.text} (Đúng / Sai)
                              </div>
                            ))}
                          </div>
                        )}
                        {q.questionType === 'short_answer' && (
                          <div className="pl-4 text-xs italic">
                            Đáp số: .........................................................
                          </div>
                        )}
                      </>
                    )}

                    {/* Detailed Solutions print view */}
                    {printMode === 'solutions' && (
                      <div className="pl-3 border-l-2 border-black/60 text-xs space-y-1 mt-1">
                        {(q.questionType === 'multiple_choice' || !q.questionType) &&
                          q.options &&
                          q.correctAnswerIndex !== undefined && (
                            <div>
                              <b>Đáp án đúng:</b> {String.fromCharCode(65 + q.correctAnswerIndex)}.{' '}
                              {q.options[q.correctAnswerIndex]}
                            </div>
                          )}
                        {q.questionType === 'true_false' && q.subQuestions && (
                          <div className="space-y-0.5">
                            {q.subQuestions.map(sub => (
                              <div key={sub.id}>
                                <b>
                                  {sub.label}) {sub.isCorrect ? 'Đúng' : 'Sai'}
                                </b>
                                {sub.explanation ? ` — ${sub.explanation}` : ''}
                              </div>
                            ))}
                          </div>
                        )}
                        {q.questionType === 'short_answer' && (
                          <div>
                            <b>Đáp số:</b> {q.correctShortAnswer}
                          </div>
                        )}
                        <div className="whitespace-pre-line">
                          <b>Giải chi tiết:</b>{' '}
                          {q.questionType === 'essay' && q.sampleSolution
                            ? q.sampleSolution
                            : q.explanation}
                        </div>
                        {q.questionType === 'essay' && q.rubric && q.rubric.length > 0 && (
                          <div>
                            <b>Biểu điểm:</b>{' '}
                            {q.rubric.map(r => `${r.step} (${r.points}đ)`).join(' ; ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
