import React, { useState, useEffect } from 'react';
import { AntiCheatIncident, HomeworkSubmission, Student, Classroom } from '../../types/math';
import { ANTI_CHEAT_CHANNEL_NAME, ANTI_CHEAT_STORAGE_KEY, ANTI_CHEAT_REMOTE_WARNING_KEY } from '../../utils/antiCheatProctor';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Eye, Bell, BellOff, 
  Send, Clock, History, RotateCcw, User, CheckCircle2, MessageSquare, 
  Phone, Sparkles, Radio, ExternalLink, X, AlertOctagon, Check, Volume2
} from 'lucide-react';

interface AntiCheatMonitorPanelProps {
  students: Student[];
  classroom: Classroom;
  submissions: HomeworkSubmission[];
  language?: Language;
}

export const AntiCheatMonitorPanel: React.FC<AntiCheatMonitorPanelProps> = ({
  students,
  classroom,
  submissions,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [incidents, setIncidents] = useState<AntiCheatIncident[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(ANTI_CHEAT_STORAGE_KEY);
        if (saved) {
          const list = JSON.parse(saved);
          return list.filter((item: any) => item.incident).map((item: any) => item.incident);
        }
      } catch {}
    }

    // Default seeded incident history for demonstration
    return [
      {
        id: 'inc-seed-1',
        studentId: 's5',
        studentName: 'Vũ Đức Trọng',
        classCode: '20112002',
        timestamp: '20:12:35',
        type: 'tab_switch',
        durationSec: 15,
        questionNumber: 4,
        details: 'Học sinh chuyển sang tab Google Tìm Kiếm tại Câu số 4 · Rời màn hình 15 giây',
        severity: 'medium'
      },
      {
        id: 'inc-seed-2',
        studentId: 's6',
        studentName: 'Dương Khánh Linh',
        classCode: '20112002',
        timestamp: '20:15:02',
        type: 'tab_switch',
        durationSec: 22,
        questionNumber: 6,
        details: 'Học sinh chuyển tab tra cứu kết quả tại Câu số 6 (Lần 3) · Rời màn hình 22 giây',
        severity: 'high'
      }
    ];
  });

  const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState<boolean>(true);
  const [selectedStudentForLog, setSelectedStudentForLog] = useState<Student | null>(null);
  const [smsStudent, setSmsStudent] = useState<{ student: Student; count: number; awaySec: number } | null>(null);
  const [remoteWarningSent, setRemoteWarningSent] = useState<string | null>(null);
  const [lastIncidentStudent, setLastIncidentStudent] = useState<string | null>(null);
  const [liveAlertBanner, setLiveAlertBanner] = useState<{
    studentName: string;
    timestamp: string;
    questionNumber: number;
    durationSec: number;
  } | null>(null);

  // Real-time synchronization via BroadcastChannel & storage events
  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(ANTI_CHEAT_CHANNEL_NAME);
        channel.onmessage = (event) => {
          const data = event.data;
          if (data && (data.type === 'TAB_SWITCH' || data.type === 'WINDOW_BLUR')) {
            const inc = data.incident;
            if (inc) {
              setIncidents(prev => [inc, ...prev]);
              setLastIncidentStudent(inc.studentName);
              setLiveAlertBanner({
                studentName: inc.studentName,
                timestamp: inc.timestamp,
                questionNumber: inc.questionNumber,
                durationSec: inc.durationSec || 0
              });
              if (isAlertSoundEnabled) {
                // Tiếng còi chuông cảnh báo bảo mật khẩn cấp bên máy giáo viên chính
                soundManager.playCheatAlarm();
              }
            }
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    // Storage event fallback for cross-window sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ANTI_CHEAT_STORAGE_KEY && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          const incs = list.filter((item: any) => item.incident).map((item: any) => item.incident);
          setIncidents(incs);
          const newest = incs[0];
          if (newest) {
            setLiveAlertBanner({
              studentName: newest.studentName,
              timestamp: newest.timestamp,
              questionNumber: newest.questionNumber,
              durationSec: newest.durationSec || 0
            });
            if (isAlertSoundEnabled) {
              soundManager.playCheatAlarm();
            }
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [isAlertSoundEnabled]);

  // Aggregate stats per student
  const studentViolationsMap = new Map<string, { count: number; totalAwaySec: number; logs: AntiCheatIncident[] }>();
  incidents.forEach(inc => {
    const existing = studentViolationsMap.get(inc.studentName) || { count: 0, totalAwaySec: 0, logs: [] };
    existing.count += 1;
    existing.totalAwaySec += inc.durationSec || 0;
    existing.logs.push(inc);
    studentViolationsMap.set(inc.studentName, existing);
  });

  // KPI calculations
  const totalIncidents = incidents.length;
  const flaggedStudentsCount = Array.from(studentViolationsMap.values()).filter(v => v.count >= 3).length;
  const suspiciousStudentsCount = Array.from(studentViolationsMap.values()).filter(v => v.count >= 1 && v.count < 3).length;

  const handleSendRemoteWarning = (studentName: string) => {
    soundManager.playCorrect();
    try {
      localStorage.setItem(ANTI_CHEAT_REMOTE_WARNING_KEY, JSON.stringify({
        studentName,
        teacherMessage: 'Cô Diễm Quỳnh nhắc nhở: Hãy tập trung làm bài, không được rời màn hình hoặc tra cứu kết quả trên mạng!',
        timestamp: Date.now()
      }));
    } catch {}

    setRemoteWarningSent(studentName);
    setTimeout(() => setRemoteWarningSent(null), 3000);
  };

  const handleClearLogs = () => {
    soundManager.playClick();
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ nhật ký giám sát chuyển tab của ca thi này không?')) {
      setIncidents([]);
      try {
        localStorage.removeItem(ANTI_CHEAT_STORAGE_KEY);
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-rose-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 backdrop-blur-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>{isEn ? 'Live Anti-Cheat Tab Monitor Radar' : 'Hệ Thống Giám Sát Chống Gian Lận Chuyển Tab (Live Anti-Cheat Radar)'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isEn ? 'Live Student Tab-Switch & Focus Report' : 'Báo Cáo Trực Tiếp Học Sinh Chuyển Tab & Tra Cứu'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? 'Instantly detects when a student leaves the exam window or opens another browser tab, firing a live alert directly to the teacher console.'
                : 'Tự động phát hiện ngay lập tức khi học sinh rời khỏi màn hình bài thi, mở tab khác để tra Google/ChatGPT hoặc Alt-Tab chuyển ứng dụng, đồng thời phát tín hiệu cảnh báo trực tiếp về máy của Cô Diễm Quỳnh.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-rose-200/90 pt-1">
              <span>{isEn ? 'Class Code:' : 'Mã Lớp:'} <strong className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">20112002</strong></span>
              <span>·</span>
              <span>{isEn ? 'Lead Teacher:' : 'Giáo viên quản nhiệm:'} <strong className="text-white">Cô Diễm Quỳnh</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                {isEn ? 'Online & synced 0s delay' : 'Đang trực tuyến & đồng bộ 0s'}
              </span>
            </div>
          </div>

          {/* Controls & KPIs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Test Siren Button */}
            <button
              onClick={() => {
                soundManager.playCheatAlarm();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all active:scale-95"
              title={isEn ? 'Test anti-cheat alarm sound' : 'Phát thử âm thanh còi chuông cảnh báo vi phạm chuyển tab trên máy giáo viên'}
            >
              <Volume2 className="w-4 h-4 text-white animate-pulse" />
              <span>{isEn ? 'Test Siren' : 'Thử Chuông Báo Động'}</span>
            </button>

            {/* Alert sound toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsAlertSoundEnabled(prev => !prev);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                isAlertSoundEnabled 
                  ? 'bg-rose-600/30 border-rose-500 text-rose-200 shadow-sm' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isEn ? 'Toggle alarm sound' : 'Bật/Tắt chuông báo động trên máy GV'}
            >
              {isAlertSoundEnabled ? <Bell className="w-4 h-4 text-rose-400 animate-bounce" /> : <BellOff className="w-4 h-4" />}
              <span>{isAlertSoundEnabled ? (isEn ? 'Siren: ON' : 'Chuông Báo Động: Đang Bật') : (isEn ? 'Siren: OFF' : 'Chuông: Đã Tắt')}</span>
            </button>

            <button
              onClick={handleClearLogs}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset Session' : 'Đặt Lại Ca Mới'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* EMERGENCY LIVE SIREN WARNING BANNER (Khi có học sinh chuyển tab) */}
      {liveAlertBanner && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white rounded-2xl p-4 shadow-xl border-2 border-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
              <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 font-black rounded text-[10px] uppercase tracking-wider">
                  🚨 CẢNH BÁO CHUYỂN TAB TỨC THỜI
                </span>
                <span className="font-mono text-xs text-rose-100">{liveAlertBanner.timestamp}</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Học sinh <u>{liveAlertBanner.studentName}</u> vừa rời khỏi màn hình bài thi (Câu {liveAlertBanner.questionNumber})!
              </h3>
              <p className="text-xs text-rose-100">
                Phát hiện học sinh chuyển sang ứng dụng khác hoặc mở tab tìm kiếm Google · Chuông cảnh báo đã reo bên máy Cô Diễm Quỳnh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                handleSendRemoteWarning(liveAlertBanner.studentName);
              }}
              className="px-3.5 py-2 bg-white text-rose-700 font-extrabold rounded-xl text-xs hover:bg-rose-50 transition-colors shadow-sm"
            >
              Gửi Nhắc Nhở Ngay
            </button>
            <button
              onClick={() => setLiveAlertBanner(null)}
              className="px-3 py-2 bg-rose-800/80 text-white hover:bg-rose-800 rounded-xl text-xs font-bold transition-colors"
            >
              Tắt Cảnh Báo
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Tổng Lượt Chuyển Tab
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-rose-600 font-mono">{totalIncidents}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Vi Phạm Nghiêm Trọng (≥ 3 lần)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-rose-700 font-mono">{flaggedStudentsCount}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Nghi Vấn Tra Cứu (1-2 lần)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600 font-mono">{suspiciousStudentsCount}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Học Sinh Tập Trung Tốt
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600 font-mono">
              {Math.max(0, students.length - flaggedStudentsCount - suspiciousStudentsCount)} / {students.length}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Warning Notification Toast if remote message was sent */}
      {remoteWarningSent && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between text-xs font-bold text-emerald-900 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Đã gửi cảnh báo răn đe trực tiếp đến màn hình học sinh: <strong>{remoteWarningSent}</strong>!</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Đồng bộ hoàn tất</span>
        </div>
      )}

      {/* Main Student Monitoring Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Danh Sách Học Sinh & Mức Độ Trung Thực Làm Bài
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-sans">
            Tự động cập nhật mỗi khi học sinh đổi tab
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5 min-w-[170px]">Học Sinh</th>
                <th className="p-3.5 text-center bg-emerald-50/60 text-emerald-900 border-x border-emerald-100 min-w-[150px]">
                  🕒 Giờ Vào - Giờ Ra (Ca Làm)
                </th>
                <th className="p-3.5 text-center">Trạng Thái Tập Trung</th>
                <th className="p-3.5 text-center">Số Lần Chuyển Tab</th>
                <th className="p-3.5 text-center">Tổng Thời Gian Rời Màn Hình</th>
                <th className="p-3.5 text-center min-w-[200px]">Hành Động Của Giáo Viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {students.map((student, idx) => {
                const violation = studentViolationsMap.get(student.name);
                const switchCount = violation?.count || 0;
                const awaySec = violation?.totalAwaySec || 0;
                const sub = submissions.find(s => s.studentName === student.name || s.studentId === student.id);
                const mockEntryTimes = ['19:42:15', '20:07:40', '20:26:40', '21:01:23', '19:12:00', '19:31:50'];
                const mockExitTimes = ['19:45:19', '20:10:32', '20:30:10', '21:05:45', '19:15:30', '19:35:10'];
                const entryTime = sub?.entryTime || mockEntryTimes[idx % mockEntryTimes.length];
                const exitTime = sub?.exitTime || mockExitTimes[idx % mockExitTimes.length];

                let statusBadge = (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Trung thực (100% Tập trung)
                  </span>
                );

                if (switchCount >= 3) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-black text-[11px] border border-rose-300 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      VI PHẠM NGIÊM TRỌNG (Gian Lận)
                    </span>
                  );
                } else if (switchCount >= 1) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Nghi vấn tra cứu ngoài trang
                    </span>
                  );
                }

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {student.gender === 'male' ? 'Nam' : 'Nữ'} · Lớp {classroom.name} · SĐT PH: {student.parentPhone}
                      </div>
                    </td>

                    {/* ENTRY & EXIT TIME COLUMN */}
                    <td className="p-3.5 text-center font-mono bg-emerald-50/20 border-x border-emerald-100">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                          🟢 Vào: {entryTime}
                        </span>
                        <span className="text-[11px] font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                          🏁 Ra: {exitTime}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      {statusBadge}
                    </td>
                    <td className="p-3.5 text-center font-mono font-black text-sm">
                      <span className={switchCount >= 3 ? 'text-rose-600' : switchCount >= 1 ? 'text-amber-600' : 'text-slate-400'}>
                        {switchCount} lần
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                      {awaySec > 0 ? `${awaySec} giây` : '0s'}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View detailed log */}
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedStudentForLog(student);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Xem lịch sử từng giây"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Chi Tiết</span>
                        </button>

                        {/* Send warning message to student screen */}
                        <button
                          type="button"
                          onClick={() => handleSendRemoteWarning(student.name)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Gửi cảnh báo răn đe trên máy học sinh"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Cảnh Báo Học Sinh</span>
                        </button>

                        {/* SMS / Zalo to parents */}
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setSmsStudent({ student, count: switchCount, awaySec });
                          }}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Nhắn tin thông báo cho phụ huynh"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Báo Phụ Huynh</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Incident Stream / Activity Feed */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-white">
              Nhật Ký Sự Kiện Chuyển Tab Thời Gian Thực (Live Incident Feed)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Ghi nhận {incidents.length} sự kiện
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Chưa có vi phạm chuyển tab nào được ghi nhận trong ca làm bài này. Tất cả học sinh đang tập trung tốt!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {incidents.slice(0, 10).map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/80 flex items-center justify-between gap-4 text-xs animate-fadeIn"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    inc.severity === 'high' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{inc.studentName}</span>
                      <span className="px-2 py-0.2 rounded bg-slate-700 text-slate-300 font-mono text-[10px]">
                        {inc.timestamp}
                      </span>
                      {inc.durationSec > 0 && (
                        <span className="text-[10px] text-rose-300 font-bold bg-rose-950 px-2 py-0.2 rounded border border-rose-800">
                          Rời màn hình: {inc.durationSec}s
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      {inc.details}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendRemoteWarning(inc.studentName)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold text-[10px] shrink-0 border border-amber-400/30 transition-colors"
                >
                  Nhắc Nhở
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Detailed Student Incident Logs */}
      {selectedStudentForLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Lịch Sử Chuyển Tab: {selectedStudentForLog.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chi tiết từng lần rời khỏi giao diện làm bài tập về nhà
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForLog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-72 overflow-y-auto">
              {(studentViolationsMap.get(selectedStudentForLog.name)?.logs || []).length === 0 ? (
                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl">
                  Học sinh chưa có vi phạm chuyển tab nào. Toàn bộ quá trình làm bài diễn ra trung thực!
                </div>
              ) : (
                (studentViolationsMap.get(selectedStudentForLog.name)?.logs || []).map((l, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-rose-700">Lần {i + 1}</span>
                        <span className="text-slate-500 font-mono">[{l.timestamp}]</span>
                        <span className="px-2 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Câu số {l.questionNumber}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{l.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudentForLog(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: SMS Warning to Parent */}
      {smsStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  📱
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Nhắn Tin Báo Phụ Huynh Về Việc Chuyển Tab
                  </h3>
                  <p className="text-xs text-slate-500">
                    Học sinh: {smsStudent.student.name} · SĐT PH: {smsStudent.student.parentPhone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSmsStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nội dung tin nhắn cảnh báo gửi phụ huynh:</label>
              <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {`[Toán THCS Cô Diễm Quỳnh - Lớp ${classroom.name}]\n`}
                {`Kính gửi phụ huynh em ${smsStudent.student.name},\n`}
                {`Trong lúc làm bài tập về nhà trực tuyến, hệ thống giám sát tự động ghi nhận học sinh đã rời khỏi màn hình bài làm ${smsStudent.count} lần (tổng thời gian ra ngoài tra cứu: ${smsStudent.awaySec} giây).\n`}
                {`Kính nhờ gia đình phối hợp nhắc nhở em tự giác làm bài trung thực để đạt hiệu quả học tập thực chất.`}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <a
                href={`sms:${smsStudent.student.parentPhone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                  `[Cô Diễm Quỳnh] Kính gửi phụ huynh em ${smsStudent.student.name}: Hệ thống ghi nhận học sinh đã chuyển tab ${smsStudent.count} lần trong lúc làm BTVN. Nhờ gia đình nhắc nhở em tự giác làm bài!`
                )}`}
                onClick={() => {
                  soundManager.playCorrect();
                  setSmsStudent(null);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Tin Nhắn SMS Ngay</span>
              </a>

              <button
                onClick={() => setSmsStudent(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
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
