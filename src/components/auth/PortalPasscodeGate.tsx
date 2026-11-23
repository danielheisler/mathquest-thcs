import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { Student } from '../../types/math';
import { 
  Lock, KeyRound, ShieldCheck, Eye, EyeOff, CheckCircle2, 
  AlertCircle, ArrowLeft, Users, GraduationCap, Sparkles, Phone, HelpCircle
} from 'lucide-react';

interface PortalPasscodeGateProps {
  portalType: 'parent' | 'teacher';
  teacherName?: string;
  teacherPin: string;
  parentPin: string;
  students: Student[];
  onSuccess: (matchedPhone?: string) => void;
  onBackToStudent: () => void;
}

export const PortalPasscodeGate: React.FC<PortalPasscodeGateProps> = ({
  portalType,
  teacherName = 'Cô Diễm Quỳnh',
  teacherPin,
  parentPin,
  students,
  onSuccess,
  onBackToStudent
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isTeacher = portalType === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passcode.trim();

    if (!cleanInput) {
      soundManager.playWrong();
      setErrorMessage('Vui lòng nhập mã bảo mật.');
      return;
    }

    if (isTeacher) {
      // Teacher Passcode check (strictly matches configured teacherPin)
      if (cleanInput === teacherPin) {
        soundManager.playVictory();
        setIsSuccess(true);
        setErrorMessage(null);
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        soundManager.playWrong();
        setErrorMessage('Mật mã Giáo Viên không chính xác. Vui lòng thử lại.');
      }
    } else {
      // Parent Passcode check (strictly matches configured parentPin sent privately by teacher)
      const normalizedInput = cleanInput.toLowerCase().replace(/[\s\.\-]/g, '');
      const normalizedParentPin = parentPin.toLowerCase().replace(/[\s\.\-]/g, '');

      if (normalizedInput === normalizedParentPin) {
        soundManager.playVictory();
        setIsSuccess(true);
        setErrorMessage(null);
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        soundManager.playWrong();
        setErrorMessage('Mật mã Phụ Huynh không chính xác. Vui lòng nhập đúng mật mã do Cô Diễm Quỳnh gửi riêng.');
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 px-4">
      <div className={`max-w-md w-full rounded-3xl p-7 sm:p-8 shadow-2xl border transition-all ${
        isTeacher 
          ? 'bg-white border-indigo-200 shadow-indigo-100' 
          : 'bg-white border-emerald-200 shadow-emerald-100'
      }`}>
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-md ${
            isTeacher 
              ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white' 
              : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
          }`}>
            {isTeacher ? <GraduationCap className="w-8 h-8" /> : <Users className="w-8 h-8" />}
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 ${
            isTeacher ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span>{isTeacher ? 'Khu Vực Bảo Mật Giáo Viên' : 'Khu Vực Bảo Mật Phụ Huynh'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isTeacher ? 'Xác Thực Quyền Giáo Viên' : 'Xác Thực Góc Phụ Huynh'}
          </h2>
          
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
            {isTeacher 
              ? `Không gian quản lý dành riêng cho ${teacherName} (GV Chủ nhiệm & Bộ môn Toán). Vui lòng nhập mật mã bảo vệ.`
              : `Sổ theo dõi dành riêng cho Phụ huynh học sinh môn Toán của ${teacherName}. Vui lòng nhập mật mã riêng do giáo viên cung cấp.`
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isTeacher ? 'Mật Mã Bảo Vệ Giáo Viên:' : 'Mật Mã Góc Phụ Huynh:'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                autoFocus
                autoComplete="off"
                placeholder={isTeacher ? 'Nhập mật mã riêng của giáo viên...' : 'Nhập mật mã do Cô Diễm Quỳnh gửi riêng...'}
                className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errorMessage 
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30' 
                    : isTeacher
                      ? 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Ẩn mật mã' : 'Hiện mật mã'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mật mã chính xác! Đang mở giao diện...</span>
            </div>
          )}

          {/* Private Security Notice (No passcodes exposed) */}
          <div className={`p-3 rounded-2xl border text-[11px] flex items-start gap-2 ${
            isTeacher
              ? 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
              : 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
          }`}>
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isTeacher ? 'text-indigo-600' : 'text-emerald-600'}`} />
            <p className="leading-relaxed">
              {isTeacher
                ? 'Mật mã giáo viên được bảo mật tuyệt đối và không hiển thị công khai trên hệ thống.'
                : 'Mật mã Góc Phụ Huynh được giữ riêng tư và do Cô Diễm Quỳnh gửi riêng tới từng Quý Phụ huynh qua Zalo hoặc SMS.'}
            </p>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className={`w-full py-3 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isTeacher 
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{isTeacher ? 'Mở Khóa Góc Giáo Viên' : 'Mở Khóa Góc Phụ Huynh'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onBackToStudent();
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Góc Học Sinh</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
