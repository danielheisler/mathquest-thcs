import React, { useState } from 'react';
import { Question, GradeLevel, MathTopic, DifficultyLevel } from '../../types/math';
import { soundManager } from '../../utils/sound';
import { BookOpen, Plus, Search, Filter, CheckCircle2, FileQuestion, Sparkles, Download, Trash2, HelpCircle, Eye, Edit3 } from 'lucide-react';
import { MathView } from '../common/MathView';
import { MathTypeToolbar } from '../common/MathTypeToolbar';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (newQ: Question) => void;
  onUpdateQuestion: (updatedQ: Question) => void;
  onDeleteQuestion: (qId: string) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<MathTopic | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [testExamModal, setTestExamModal] = useState<boolean>(false);
  const [generatedExam, setGeneratedExam] = useState<Question[]>([]);

  // Add/Edit question form state
  const [qGrade, setQGrade] = useState<GradeLevel>(8);
  const [qTopic, setQTopic] = useState<MathTopic>('algebra');
  const [qDifficulty, setQDifficulty] = useState<DifficultyLevel>('medium');
  const [qText, setQText] = useState<string>('');
  const [qFormula, setQFormula] = useState<string>('');
  const [qOptA, setQOptA] = useState<string>('');
  const [qOptB, setQOptB] = useState<string>('');
  const [qOptC, setQOptC] = useState<string>('');
  const [qOptD, setQOptD] = useState<string>('');
  const [qCorrectIdx, setQCorrectIdx] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState<string>('');
  const [qHint, setQHint] = useState<string>('');
  const [activeTargetField, setActiveTargetField] = useState<'formula' | 'text' | 'optA' | 'optB' | 'optC' | 'optD'>('formula');

  const handleStartEditQuestion = (q: Question) => {
    soundManager.playClick();
    setEditingQuestionId(q.id);
    setQGrade(q.grade);
    setQTopic(q.topic);
    setQDifficulty(q.difficulty);
    setQText(q.questionText);
    setQFormula(q.formula || '');
    setQOptA(q.options[0] || '');
    setQOptB(q.options[1] || '');
    setQOptC(q.options[2] || '');
    setQOptD(q.options[3] || '');
    setQCorrectIdx(q.correctAnswerIndex);
    setQExplanation(q.explanation || '');
    setQHint(q.hint || '');
    setShowAddModal(true);
  };

  const handleOpenAddModal = () => {
    soundManager.playClick();
    setEditingQuestionId(null);
    setQText('');
    setQFormula('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setQHint('');
    setShowAddModal(true);
  };

  const handleInsertSnippet = (snippet: string) => {
    if (activeTargetField === 'formula') {
      setQFormula(prev => prev ? `${prev} ${snippet}` : snippet);
    } else if (activeTargetField === 'text') {
      setQText(prev => prev ? `${prev} $${snippet}$` : `$${snippet}$`);
    } else if (activeTargetField === 'optA') {
      setQOptA(prev => prev ? `${prev} ${snippet}` : snippet);
    } else if (activeTargetField === 'optB') {
      setQOptB(prev => prev ? `${prev} ${snippet}` : snippet);
    } else if (activeTargetField === 'optC') {
      setQOptC(prev => prev ? `${prev} ${snippet}` : snippet);
    } else if (activeTargetField === 'optD') {
      setQOptD(prev => prev ? `${prev} ${snippet}` : snippet);
    }
  };

  const filtered = questions.filter(q => {
    const matchGrade = selectedGrade === 'all' || q.grade === selectedGrade;
    const matchTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        q.topicName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchTopic && matchDiff && matchSearch;
  });

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOptA || !qOptB || !qOptC || !qOptD) return;

    soundManager.playCorrect();
    const topicLabels: Record<MathTopic, string> = {
      arithmetic: 'Số học & Số nguyên',
      rational: 'Phân số & Số hữu tỉ',
      algebra: 'Đại số & Đa thức',
      equation: 'Phương trình & Hệ PT',
      geometry: 'Hình học & Đo lường',
      statistics: 'Thống kê & Xác suất'
    };

    if (editingQuestionId) {
      // Update existing question
      const updatedQuestion: Question = {
        id: editingQuestionId,
        grade: qGrade,
        topic: qTopic,
        topicName: topicLabels[qTopic],
        difficulty: qDifficulty,
        questionText: qText.trim(),
        formula: qFormula.trim() || undefined,
        options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()],
        correctAnswerIndex: qCorrectIdx,
        explanation: qExplanation.trim() || 'Học sinh áp dụng kiến thức định lý và quy tắc biến đổi tương đương để tìm đáp án.',
        hint: qHint.trim() || undefined
      };
      onUpdateQuestion(updatedQuestion);
    } else {
      // Add new question
      const newQuestion: Question = {
        id: `custom-q-${Date.now()}`,
        grade: qGrade,
        topic: qTopic,
        topicName: topicLabels[qTopic],
        difficulty: qDifficulty,
        questionText: qText.trim(),
        formula: qFormula.trim() || undefined,
        options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()],
        correctAnswerIndex: qCorrectIdx,
        explanation: qExplanation.trim() || 'Học sinh áp dụng kiến thức định lý và quy tắc biến đổi tương đương để tìm đáp án.',
        hint: qHint.trim() || undefined
      };
      onAddQuestion(newQuestion);
    }

    setShowAddModal(false);
    setEditingQuestionId(null);
    setQText('');
    setQFormula('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setQHint('');
  };

  const handleGenerateExam = (count: number) => {
    soundManager.playClick();
    const pool = selectedGrade === 'all'
      ? questions
      : questions.filter(q => q.grade === selectedGrade);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setGeneratedExam(shuffled);
    setTestExamModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">Kho Học Liệu & Đề Thi THCS</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Ngân Hàng Câu Hỏi & Tùy Chỉnh Đề Thi</h3>
            <p className="text-sm text-slate-600">
              Ngân hàng bài tập chuẩn GDPT THCS (Khối 6-9) kèm công cụ tùy biến đề thi, bài kiểm tra 15 phút và 45 phút.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleGenerateExam(10)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
            >
              <FileQuestion className="w-4 h-4 text-emerald-600" /> Tạo Đề 15 Phút Nhanh
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Grade filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as GradeLevel)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="all">Tất cả Khối THCS</option>
              <option value="6">Khối 6 (Số học & Hình trực quan)</option>
              <option value="7">Khối 7 (Số hữu tỉ & Tam giác)</option>
              <option value="8">Khối 8 (Hằng đẳng thức & Pythagoras)</option>
              <option value="9">Khối 9 (Căn thức & Hàm số bậc nhất)</option>
            </select>
          </div>

          {/* Topic filter */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="all">Tất cả Chủ Đề</option>
              <option value="arithmetic">Số học & Số nguyên</option>
              <option value="rational">Phân số & Số hữu tỉ</option>
              <option value="algebra">Đại số & Hằng đẳng thức</option>
              <option value="equation">Phương trình & Hệ PT</option>
              <option value="geometry">Hình học & Đo lường</option>
              <option value="statistics">Thống kê & Xác suất</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            >
              <option value="all">Mọi Mức Độ Nhận Thức</option>
              <option value="easy">Nhận biết (Dễ)</option>
              <option value="medium">Thông hiểu (Trung bình)</option>
              <option value="hard">Vận dụng cao (Khó)</option>
            </select>
          </div>
        </div>

        {/* Question Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-100">
          <span>Tìm thấy <b className="text-slate-900 font-mono">{filtered.length}</b> câu hỏi phù hợp</span>
          <span className="text-[11px] text-slate-400">Cô Diễm Quỳnh có thể chỉnh sửa nội dung hoặc thêm câu hỏi MathType tùy ý</span>
        </div>

        {/* Questions Cards List */}
        <div className="space-y-3.5">
          {filtered.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Toán {q.grade}
                  </span>
                  <span className="font-semibold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded">
                    {q.topicName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                    q.difficulty === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {q.difficulty === 'easy' ? 'Nhận biết' : q.difficulty === 'medium' ? 'Thông hiểu' : 'Vận dụng'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleStartEditQuestion(q)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Chỉnh sửa câu hỏi này"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px]">Sửa</span>
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playWrong();
                      onDeleteQuestion(q.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2 leading-relaxed">
                <span className="font-mono text-slate-400 font-normal mr-1.5">#{idx + 1}.</span>
                <MathView math={q.questionText} />
              </h4>

              {q.formula && (
                <div className="mb-3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 inline-block shadow-2xs">
                  <MathView math={q.formula} displayMode={true} />
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswerIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="truncate">
                        <MathView math={opt} />
                      </span>
                      {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="font-bold text-slate-800">Lời giải chi tiết:</span> <MathView math={q.explanation} />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không có câu hỏi nào khớp với bộ lọc đang chọn. Hãy thử tìm từ khóa khác hoặc bấm "Thêm Câu Hỏi Mới".
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              {editingQuestionId ? (
                <>
                  <Edit3 className="w-5 h-5 text-indigo-600" /> Chỉnh Sửa Câu Hỏi MathType
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-indigo-600" /> Tùy Chỉnh & Thêm Câu Hỏi Mới
                </>
              )}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {editingQuestionId
                ? 'Cô Diễm Quỳnh có thể chỉnh sửa nội dung đề bài, công thức MathType và các đáp án bên dưới.'
                : 'Thầy/Cô có thể tạo bài tập mới theo bài học trên lớp để học sinh ôn tập hoặc thi đấu.'}
            </p>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={qGrade}
                    onChange={(e) => setQGrade(parseInt(e.target.value) as GradeLevel)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Chủ Đề:</label>
                  <select
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value as MathTopic)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="arithmetic">Số học</option>
                    <option value="rational">Số hữu tỉ</option>
                    <option value="algebra">Đại số</option>
                    <option value="equation">Phương trình</option>
                    <option value="geometry">Hình học</option>
                    <option value="statistics">Thống kê</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mức Độ:</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="easy">Nhận biết</option>
                    <option value="medium">Thông hiểu</option>
                    <option value="hard">Vận dụng cao</option>
                  </select>
                </div>
              </div>

              {/* MathType Toolbar Component */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Chèn công thức MathType vào ô:</span>
                  <div className="flex gap-1">
                    {(['formula', 'text', 'optA', 'optB', 'optC', 'optD'] as const).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setActiveTargetField(f)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          activeTargetField === f
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f === 'formula' ? 'Công thức' : f === 'text' ? 'Đề bài' : f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <MathTypeToolbar
                  onInsert={handleInsertSnippet}
                  previewText={qFormula || qText}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nội dung câu hỏi {activeTargetField === 'text' && <span className="text-indigo-600 text-[10px]">(Đang chọn nhận ký tự MathType)</span>}:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ví dụ: Rút gọn phân số $\frac{18}{24}$..."
                  value={qText}
                  onFocus={() => setActiveTargetField('text')}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Công thức trọng tâm {activeTargetField === 'formula' && <span className="text-indigo-600 text-[10px]">(Đang chọn nhận ký tự MathType)</span>}:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: \frac{a}{b} = \frac{c}{d} hoặc a^2 + b^2 = c^2"
                  value={qFormula}
                  onFocus={() => setActiveTargetField('formula')}
                  onChange={(e) => setQFormula(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-0.5">
                    Đáp án A {activeTargetField === 'optA' && '✍️'}:
                  </label>
                  <input
                    type="text" required value={qOptA}
                    onFocus={() => setActiveTargetField('optA')}
                    onChange={(e) => setQOptA(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-0.5">
                    Đáp án B {activeTargetField === 'optB' && '✍️'}:
                  </label>
                  <input
                    type="text" required value={qOptB}
                    onFocus={() => setActiveTargetField('optB')}
                    onChange={(e) => setQOptB(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-0.5">
                    Đáp án C {activeTargetField === 'optC' && '✍️'}:
                  </label>
                  <input
                    type="text" required value={qOptC}
                    onFocus={() => setActiveTargetField('optC')}
                    onChange={(e) => setQOptC(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-0.5">
                    Đáp án D {activeTargetField === 'optD' && '✍️'}:
                  </label>
                  <input
                    type="text" required value={qOptD}
                    onFocus={() => setActiveTargetField('optD')}
                    onChange={(e) => setQOptD(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-emerald-700 block mb-1">Đáp án đúng:</label>
                  <select
                    value={qCorrectIdx}
                    onChange={(e) => setQCorrectIdx(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800"
                  >
                    <option value={0}>Đáp án A</option>
                    <option value={1}>Đáp án B</option>
                    <option value={2}>Đáp án C</option>
                    <option value={3}>Đáp án D</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Gợi ý cho học sinh:</label>
                  <input
                    type="text"
                    placeholder="Mẹo ngắn..."
                    value={qHint}
                    onChange={(e) => setQHint(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Lời giải chi tiết:</label>
                <textarea
                  rows={2}
                  placeholder="Giải thích từng bước để học sinh hiểu bài..."
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-serif"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingQuestionId ? 'Cập Nhật Câu Hỏi MathType' : 'Lưu Câu Hỏi MathType'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Exam Preview Modal */}
      {testExamModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase">Đề Kiểm Tra 15 Phút Tự Động</span>
                <h4 className="text-lg font-bold text-slate-900">Bộ Đề Toán THCS - {generatedExam.length} Câu Hỏi</h4>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> In Đề Ra Giấy
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1 text-xs">
              {generatedExam.map((q, i) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 leading-relaxed">
                    Câu {i + 1}: <MathView math={q.questionText} />
                  </div>
                  {q.formula && (
                    <div className="text-indigo-700 font-bold mb-2 p-2 bg-white rounded border border-slate-200 inline-block">
                      <MathView math={q.formula} displayMode={true} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-slate-700 mt-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{String.fromCharCode(65 + oi)}.</span>
                        <span><MathView math={opt} /></span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setTestExamModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
