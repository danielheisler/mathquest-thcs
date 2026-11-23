import React, { useState } from 'react';
import { BodyMotionQuestion, GradeLevel } from '../../types/math';
import { initialBodyMotionQuestions } from '../../data/bodyMotionQuestionsData';
import { BodyMotionQuizGame } from './BodyMotionQuizGame';
import { BodyTiltTrueFalseGame } from './BodyTiltTrueFalseGame';
import { CameraCatchMathGame } from './CameraCatchMathGame';
import { soundManager } from '../../utils/sound';
import { 
  Camera, Zap, Target, Plus, Check, Sparkles, BookOpen, 
  HelpCircle, Presentation, Users, MonitorPlay, Video
} from 'lucide-react';

interface BodyCameraGamesHubProps {
  activeStudentName?: string;
  activeClassName?: string;
}

export const BodyCameraGamesHub: React.FC<BodyCameraGamesHubProps> = ({
  activeStudentName = 'Nguyễn Minh Quân',
  activeClassName = 'Lớp 6A1'
}) => {
  const [activeGame, setActiveGame] = useState<'motion_quiz' | 'tilt_tf' | 'catch_math'>('motion_quiz');
  const [questions, setQuestions] = useState<BodyMotionQuestion[]>(initialBodyMotionQuestions);

  // Add Question Modal state for Teacher Cô Diễm Quỳnh
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newGrade, setNewGrade] = useState<GradeLevel>(6);
  const [newTopicName, setNewTopicName] = useState<string>('Số Tự Nhiên');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newFormula, setNewFormula] = useState<string>('');
  const [opt1, setOpt1] = useState<string>('');
  const [opt2, setOpt2] = useState<string>('');
  const [opt3, setOpt3] = useState<string>('');
  const [newCorrectIdx, setNewCorrectIdx] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState<string>('');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim()) return;

    const newQ: BodyMotionQuestion = {
      id: `bm-custom-${Date.now()}`,
      grade: newGrade,
      topic: 'arithmetic',
      topicName: newTopicName,
      questionText: newQuestionText.trim(),
      formula: newFormula.trim() || undefined,
      options: [
        {
          text: opt1.trim(),
          pose: 'both_hands_up',
          poseLabel: 'Hai tay giơ cao qua đầu',
          color: 'blue'
        },
        {
          text: opt2.trim(),
          pose: 'right_hand_up',
          poseLabel: 'Giơ tay phải lên cao',
          color: 'red'
        },
        {
          text: opt3.trim(),
          pose: 'left_hand_up',
          poseLabel: 'Giơ tay trái lên cao',
          color: 'green'
        }
      ],
      correctIndex: newCorrectIdx,
      explanation: newExplanation.trim() || 'Đáp án chính xác dựa trên kiến thức bài học.'
    };

    setQuestions(prev => [newQ, ...prev]);
    soundManager.playCorrect();
    setShowAddModal(false);

    // Reset fields
    setNewQuestionText('');
    setNewFormula('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setNewExplanation('');
  };

  const gameModes = [
    {
      id: 'motion_quiz',
      title: 'Đố Vui Vận Động (Chuẩn Lớp Học)',
      desc: 'Chiếu bảng câu hỏi bên trái, Camera trực tiếp bên phải. Học sinh tạo dáng cơ thể để chọn đáp án!',
      icon: Camera,
      badge: 'Theo ảnh lớp học ⭐',
      color: 'from-blue-600 to-indigo-600 text-white'
    },
    {
      id: 'tilt_tf',
      title: 'Nghiêng Người Đúng / Sai',
      desc: 'Nghiêng sang Trái = ĐÚNG, nghiêng sang Phải = SAI. Đọ phản xạ tính toán nhanh như chớp!',
      icon: Zap,
      badge: 'Vận động toàn thân',
      color: 'from-emerald-600 to-teal-600 text-white'
    },
    {
      id: 'catch_math',
      title: 'Hứng Bóng Toán Học (Bắt Bong Bóng)',
      desc: 'Bong bóng chứa đáp án bay trên màn hình camera. Dùng tay hoặc đầu chạm vào để nổ bóng!',
      icon: Target,
      badge: 'Cực vui nhộn',
      color: 'from-pink-600 to-rose-600 text-white'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro & Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Trò Chơi Tương Tác Qua Camera Máy Tính & Máy Chiếu Lớp Học</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Vận Động Cơ Thể Chọn Đáp Án Toán Học
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Học sinh đứng trước máy tính hoặc màn hình tivi/máy chiếu lớp học, thực hiện các tư thế cơ thể 
            (giơ 2 tay lên cao, giơ tay phải, giơ tay trái, nghiêng người) để trả lời câu hỏi và rèn luyện thể chất kết hợp tư duy toán học!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Cô Quỳnh Thêm Câu Hỏi Mới Cho Lớp</span>
            </button>
            <div className="text-xs text-indigo-200 flex items-center gap-1">
              <span>Mã Lớp:</span>
              <strong className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">20112002</strong>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameModes.map(m => {
          const Icon = m.icon;
          const isSelected = activeGame === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                soundManager.playClick();
                setActiveGame(m.id as any);
              }}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-4 ring-indigo-500/10 shadow-lg scale-[1.01]'
                  : 'bg-white/80 hover:bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                  {isSelected ? 'Đang chơi chế độ này' : 'Bấm để vào chơi'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-600 animate-ping' : 'bg-slate-300'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Component */}
      <div>
        {activeGame === 'motion_quiz' && (
          <BodyMotionQuizGame
            customQuestions={questions}
            activeStudentName={activeStudentName}
            activeClassName={activeClassName}
          />
        )}
        {activeGame === 'tilt_tf' && (
          <BodyTiltTrueFalseGame
            activeStudentName={activeStudentName}
            activeClassName={activeClassName}
          />
        )}
        {activeGame === 'catch_math' && (
          <CameraCatchMathGame
            activeStudentName={activeStudentName}
            activeClassName={activeClassName}
          />
        )}
      </div>

      {/* Add Custom Question Modal for Teacher Cô Diễm Quỳnh */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Thêm Câu Hỏi Vận Động Cơ Thể Mới
                  </h3>
                  <p className="text-xs text-slate-500">
                    Giáo viên Cô Diễm Quỳnh soạn câu hỏi cho lớp 20112002
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chủ Đề / Bài Học:</label>
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="VD: Số học, Hằng đẳng thức..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nội Dung Câu Hỏi: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="VD: Dùng các chữ số 1, 2, 3 lập số lớn nhất..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Công thức Toán KaTeX/MathType (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="VD: A^2 - B^2 hoặc (-15) + (-25)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              {/* 3 Options corresponding to 3 Poses */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 block">
                  3 Đáp án tương ứng 3 Động tác cơ thể:
                </span>

                {/* Option 1: Both Hands Up */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="shrink-0 text-xs font-bold text-blue-700 w-32 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>🙆‍♂️ Giơ 2 tay:</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    placeholder="Nội dung đáp án 1..."
                    className="flex-1 p-2 bg-white border border-blue-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <label className="flex items-center gap-1 cursor-pointer shrink-0 text-xs font-bold text-blue-800">
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={newCorrectIdx === 0}
                      onChange={() => setNewCorrectIdx(0)}
                    />
                    <span>Đúng</span>
                  </label>
                </div>

                {/* Option 2: Right Hand Up */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="shrink-0 text-xs font-bold text-rose-700 w-32 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>🙋‍♀️ Giơ tay phải:</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    placeholder="Nội dung đáp án 2..."
                    className="flex-1 p-2 bg-white border border-rose-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <label className="flex items-center gap-1 cursor-pointer shrink-0 text-xs font-bold text-rose-800">
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={newCorrectIdx === 1}
                      onChange={() => setNewCorrectIdx(1)}
                    />
                    <span>Đúng</span>
                  </label>
                </div>

                {/* Option 3: Left Hand Up */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="shrink-0 text-xs font-bold text-emerald-700 w-32 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>🙋‍♂️ Giơ tay trái:</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    placeholder="Nội dung đáp án 3..."
                    className="flex-1 p-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <label className="flex items-center gap-1 cursor-pointer shrink-0 text-xs font-bold text-emerald-800">
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={newCorrectIdx === 2}
                      onChange={() => setNewCorrectIdx(2)}
                    />
                    <span>Đúng</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lời giải thích / Hướng dẫn giải:
                </label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Giải thích ngắn gọn khi học sinh làm bài..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Câu Hỏi Vào Trò Chơi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
