import React, { useEffect, useState } from 'react';
import { Language } from '../../i18n/translations';
import { soundManager } from '../../utils/sound';
import {
  INITIAL_PRAISE,
  INITIAL_SECRETS,
  PraisePost,
  SecretNote,
  SECRETS_STORAGE_KEY,
  WALL_STORAGE_KEY,
} from '../classroom/ClassLifeHub';
import {
  MessageSquareLock,
  Send,
  ShieldCheck,
  Award,
  Heart,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';

interface StudentSharingBoxProps {
  language?: Language;
  activeStudentName?: string;
}

export const StudentSharingBox: React.FC<StudentSharingBoxProps> = ({
  language = 'vi',
}) => {
  const isEn = language === 'en';

  const [secrets, setSecrets] = useState<SecretNote[]>(() => {
    try {
      const raw = localStorage.getItem(SECRETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SECRETS;
  });

  const [praises, setPraises] = useState<PraisePost[]>(() => {
    try {
      const raw = localStorage.getItem(WALL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRAISE;
  });

  const [secretTopic, setSecretTopic] = useState<string>('Tâm tư / Áp lực học tập');
  const [secretText, setSecretText] = useState<string>('');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(SECRETS_STORAGE_KEY, JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem(WALL_STORAGE_KEY, JSON.stringify(praises));
  }, [praises]);

  // Keep synced across tabs if Teacher replies while Student has tab open
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SECRETS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSecrets(parsed);
        } catch {}
      }
      if (e.key === WALL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPraises(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleSendSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretText.trim()) return;
    soundManager.playCorrect();
    const newNote: SecretNote = {
      id: `sec-${Date.now()}`,
      topic: secretTopic,
      content: secretText.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'unread',
    };
    setSecrets((prev) => [newNote, ...prev]);
    setSecretText('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Warm Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-800 to-blue-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-indigo-700/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>{isEn ? '100% Anonymous & Safe Channel' : 'Kênh Chia Sẻ Bảo Mật & Hoàn Toàn Ẩn Danh'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          {isEn ? 'Anonymous "Sharing Box" & Class Wall of Fame' : 'Hộp Thư Ẩn Danh "Góc Sẻ Chia" & Gương Sáng Lớp Học'}
        </h2>
        <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 max-w-3xl">
          {isEn
            ? 'Safely share study stress, personal thoughts, or class activity ideas with Ms. Diễm Quỳnh without showing your name or phone number.'
            : 'Nơi các em thoải mái gửi tâm tư, áp lực học tập, thắc mắc khó nói hoặc góp ý hoạt động lớp tới Cô Diễm Quỳnh hoàn toàn ẩn danh.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (7 cols): ANONYMOUS SHARING BOX FOR STUDENTS */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareLock className="w-5 h-5 text-indigo-600" />
                <span>{isEn ? 'Anonymous "Sharing Box"' : 'Hộp Thư Ẩn Danh "Góc Sẻ Chia"'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Private channel to send study worries, feedback, or personal thoughts directly to Ms. Diễm Quỳnh.'
                  : 'Kênh bảo mật tiếp nhận tâm tư, áp lực học tập hoặc góp ý thầm kín từ học sinh gửi cô giáo chủ nhiệm.'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold shrink-0">
              <Lock className="w-3 h-3" />
              <span>{isEn ? 'Anonymous' : 'Ẩn danh 100%'}</span>
            </span>
          </div>

          <form
            onSubmit={handleSendSecret}
            className="space-y-3 p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/70 border border-indigo-100 dark:border-slate-700"
          >
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                {isEn ? 'Select Topic:' : 'Chọn chủ đề muốn sẻ chia:'}
              </label>
              <select
                value={secretTopic}
                onChange={(e) => setSecretTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tâm tư / Áp lực học tập">
                  {isEn ? 'Study Stress & Pressure' : 'Tâm tư / Áp lực học tập'}
                </option>
                <option value="Chuyện bạn bè trong lớp">
                  {isEn ? 'Peer Relationships' : 'Chuyện bạn bè trong lớp'}
                </option>
                <option value="Góp ý hoạt động sinh hoạt lớp">
                  {isEn ? 'Class Activity Ideas' : 'Góp ý hoạt động sinh hoạt lớp'}
                </option>
                <option value="Thắc mắc bài học Toán">
                  {isEn ? 'Math Lesson Question' : 'Thắc mắc bài học / Ôn thi Toán'}
                </option>
              </select>
            </div>

            <div>
              <textarea
                rows={3}
                required
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder={
                  isEn
                    ? 'Write your anonymous thoughts or feedback for Ms. Diễm Quỳnh...'
                    : 'Nhập tâm tư, áp lực học tập hoặc góp ý của em để gửi ẩn danh tới Cô Diễm Quỳnh...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? 'Send Anonymous Note' : 'Gửi Thư Ẩn Danh'}</span>
            </button>

            {sentSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {isEn
                    ? 'Your anonymous note has been securely delivered to Ms. Diễm Quỳnh!'
                    : 'Thư ẩn danh của em đã được gửi bảo mật tới Cô Diễm Quỳnh! Hãy kiểm tra phản hồi của cô bên dưới nhé.'}
                </span>
              </div>
            )}
          </form>

          {/* Messages & Replies List */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>{isEn ? 'Sent Letters & Teacher Replies' : 'Hòm Thư Đã Gửi & Phản Hồi Của Cô Diễm Quỳnh'}</span>
              <span className="text-[11px] font-mono text-slate-400">{secrets.length} thư</span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {secrets.map((sec) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">
                      🔒 {sec.topic}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[10px]">{sec.date}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          sec.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}
                      >
                        {sec.status === 'replied'
                          ? isEn
                            ? 'Replied'
                            : 'Đã phản hồi'
                          : isEn
                            ? 'Waiting for teacher'
                            : 'Đang chờ cô phản hồi'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{sec.content}</p>
                  {sec.teacherReply ? (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                      <b className="text-emerald-800 dark:text-emerald-300">Cô Diễm Quỳnh:</b> {sec.teacherReply}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      {isEn
                        ? 'Your note is queued privately for Ms. Diễm Quỳnh to review.'
                        : 'Cô Diễm Quỳnh sẽ sớm đọc và phản hồi ẩn danh tại mục này.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT (5 cols): WALL OF FAME & GRATITUDE (READ + LIKE) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isEn ? 'Weekly Wall of Fame' : 'Góc Gương Sáng Tuần Qua'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn
                ? 'Celebrate classmates and send hearts of encouragement!'
                : 'Cùng thả tim cổ vũ những gương sáng tiến bộ trong tuần của lớp nhé.'}
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {praises.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                    🌟 {p.studentName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                    {p.date}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{p.message}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{p.author}</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setPraises((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, likes: item.likes + 1 } : item
                        )
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{p.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isEn
                ? 'Everything submitted in the Sharing Box stays anonymous and is synced directly with Ms. Diễm Quỳnh’s Class Life portal.'
                : 'Mọi thư gửi ở Góc Sẻ Chia đều ẩn danh hoàn toàn và đồng bộ trực tiếp sang cổng Giáo viên của Cô Diễm Quỳnh.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
