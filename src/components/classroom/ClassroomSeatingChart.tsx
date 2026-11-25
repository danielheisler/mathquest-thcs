import React, { useState } from 'react';
import { Classroom, Student, ClassroomSeatingDesk, VnEduStudentAcademicRecord } from '../../types/math';
import { defaultSeatingDesks } from '../../data/vneduData';
import { soundManager } from '../../utils/sound';
import { Language } from '../../i18n/translations';
import { 
  Users, User, ArrowLeftRight, Check, AlertCircle, Phone, 
  Sparkles, Printer, UserCheck, Shield, Award, Edit2, RotateCcw
} from 'lucide-react';

interface ClassroomSeatingChartProps {
  classroom: Classroom;
  students: Student[];
  academicRecords: VnEduStudentAcademicRecord[];
  onSwapStudents?: (studentId1: string, studentId2: string) => void;
  language?: Language;
}

export const ClassroomSeatingChart: React.FC<ClassroomSeatingChartProps> = ({
  classroom,
  students,
  academicRecords,
  onSwapStudents,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [desks, setDesks] = useState<ClassroomSeatingDesk[]>(defaultSeatingDesks);
  const [selectedSeat, setSelectedSeat] = useState<{ deskNumber: number; side: 'left' | 'right' } | null>(null);
  const [swapSourceSeat, setSwapSourceSeat] = useState<{ deskNumber: number; side: 'left' | 'right'; studentId?: string } | null>(null);
  const [filterGroup, setFilterGroup] = useState<number | 'all'>('all');
  const [activeStudentModal, setActiveStudentModal] = useState<VnEduStudentAcademicRecord | null>(null);

  const getRecordById = (id?: string) => academicRecords.find(r => r.studentId === id);

  // Handle seat click
  const handleSeatClick = (deskNumber: number, side: 'left' | 'right', studentId?: string) => {
    soundManager.playClick();

    if (swapSourceSeat) {
      // Perform swap
      const sourceDeskNum = swapSourceSeat.deskNumber;
      const sourceSide = swapSourceSeat.side;

      setDesks(prevDesks => {
        const next = [...prevDesks];
        const sDeskIdx = next.findIndex(d => d.deskNumber === sourceDeskNum);
        const tDeskIdx = next.findIndex(d => d.deskNumber === deskNumber);

        if (sDeskIdx !== -1 && tDeskIdx !== -1) {
          const sDesk = { ...next[sDeskIdx] };
          const tDesk = { ...next[tDeskIdx] };

          const sStudentId = sourceSide === 'left' ? sDesk.leftStudentId : sDesk.rightStudentId;
          const tStudentId = side === 'left' ? tDesk.leftStudentId : tDesk.rightStudentId;

          // Swap
          if (sourceSide === 'left') sDesk.leftStudentId = tStudentId;
          else sDesk.rightStudentId = tStudentId;

          if (side === 'left') tDesk.leftStudentId = sStudentId;
          else tDesk.rightStudentId = sStudentId;

          next[sDeskIdx] = sDesk;
          next[tDeskIdx] = tDesk;
        }
        return next;
      });

      soundManager.playCorrect();
      setSwapSourceSeat(null);
      setSelectedSeat(null);
      return;
    }

    setSelectedSeat({ deskNumber, side });
    if (studentId) {
      const rec = getRecordById(studentId);
      if (rec) setActiveStudentModal(rec);
    }
  };

  const handleStartSwap = (deskNumber: number, side: 'left' | 'right', studentId?: string) => {
    soundManager.playClick();
    setSwapSourceSeat({ deskNumber, side, studentId });
    setSelectedSeat(null);
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              🪑
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isEn ? `Classroom Seating Chart — ${classroom.name} (${classroom.schoolYear})` : `Sơ Đồ Chỗ Ngồi Lớp ${classroom.name} (Năm Học ${classroom.schoolYear})`}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEn
              ? <>Homeroom: <strong className="text-slate-800">{classroom.homeroomTeacher}</strong> · Room: <strong>{classroom.roomNumber}</strong> · 4 Rows (Groups 1–4)</>
              : <>Giáo viên chủ nhiệm: <strong className="text-slate-800">{classroom.homeroomTeacher}</strong> · Phòng học: <strong>{classroom.roomNumber}</strong> · 4 Dãy (Tổ 1 - 4)</>}
          </p>
        </div>

        {/* Action Buttons & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {swapSourceSeat ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold animate-pulse">
              <span>{isEn ? 'Select destination seat to swap!' : 'Đang chọn học sinh đổi chỗ... Hãy bấm vào ghế đích!'}</span>
              <button
                onClick={() => setSwapSourceSeat(null)}
                className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-semibold text-[11px]"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                setSwapSourceSeat({ deskNumber: 1, side: 'left', studentId: 's1' });
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-200 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{isEn ? 'Swap Seats Mode' : 'Chế Độ Đổi Chỗ Ngồi'}</span>
            </button>
          )}

          {/* Group Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 1, 2, 3, 4] as const).map(g => (
              <button
                key={g}
                onClick={() => {
                  soundManager.playClick();
                  setFilterGroup(g);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterGroup === g ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {g === 'all' ? (isEn ? 'All Groups' : 'Tất Cả Tổ') : (isEn ? `Group ${g}` : `Tổ ${g}`)}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{isEn ? 'Print A4 Chart' : 'In Sơ Đồ A4'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Physical Floor Layout */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Wall Indicators */}
        <div className="absolute top-2 left-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span>🚪 Cửa chính ra vào</span>
        </div>
        <div className="absolute top-2 right-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span>🪟 Dãy cửa sổ hướng sân trường</span>
        </div>

        {/* Podium & Blackboard Stage */}
        <div className="max-w-xl mx-auto mb-8 text-center space-y-2">
          {/* Blackboard */}
          <div className="bg-emerald-900 border-4 border-amber-900 rounded-xl py-2.5 px-6 shadow-md text-emerald-100 font-mono text-xs font-bold tracking-widest flex items-center justify-between">
            <span>BẢNG LỚP HỌC</span>
            <span className="text-[10px] text-emerald-300 font-sans font-normal">Năm Học {classroom.schoolYear} · Lớp {classroom.name}</span>
            <span>MÃ: 20112002</span>
          </div>

          {/* Teacher's Desk & Podium */}
          <div className="inline-flex items-center gap-4 bg-amber-100/90 border border-amber-300 rounded-2xl px-6 py-2 shadow-xs">
            <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
              <span>👨‍🏫 Bục Giảng & Bàn Giáo Viên Chủ Nhiệm</span>
            </span>
          </div>
        </div>

        {/* 4 Dãy Bàn (Columns 1, 2, 3, 4 corresponding to Tổ 1, 2, 3, 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map(colIdx => {
            const isGroupFiltered = filterGroup === 'all' || filterGroup === colIdx;
            return (
              <div
                key={colIdx}
                className={`space-y-4 rounded-2xl p-3 border transition-all ${
                  isGroupFiltered 
                    ? 'bg-white/80 border-slate-200 shadow-xs' 
                    : 'opacity-40 bg-slate-100 border-slate-200'
                }`}
              >
                {/* Column / Group Header */}
                <div className="text-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-indigo-700 uppercase tracking-wider block">
                    DÃY {colIdx} · TỔ {colIdx}
                  </span>
                </div>

                {/* 4 Desks in this Column (Rows 1 to 4) */}
                <div className="space-y-3.5">
                  {[1, 2, 3, 4].map(rowIdx => {
                    const desk = desks.find(d => d.column === colIdx && d.row === rowIdx);
                    if (!desk) return null;

                    const leftRec = getRecordById(desk.leftStudentId);
                    const rightRec = getRecordById(desk.rightStudentId);

                    const isSourceLeft = swapSourceSeat?.deskNumber === desk.deskNumber && swapSourceSeat?.side === 'left';
                    const isSourceRight = swapSourceSeat?.deskNumber === desk.deskNumber && swapSourceSeat?.side === 'right';

                    return (
                      <div
                        key={desk.deskNumber}
                        className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 shadow-2xs hover:shadow-xs transition-shadow relative"
                      >
                        {/* Desk Number Badge */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 mb-2 px-1">
                          <span>Bàn #{desk.deskNumber} (Hàng {desk.row})</span>
                          <span className="text-slate-400 font-mono text-[9px]">2 Chỗ</span>
                        </div>

                        {/* 2 Seats per Desk */}
                        <div className="grid grid-cols-2 gap-2">
                          
                          {/* Left Seat */}
                          <button
                            type="button"
                            onClick={() => handleSeatClick(desk.deskNumber, 'left', desk.leftStudentId)}
                            className={`p-2 rounded-xl text-left border transition-all relative flex flex-col justify-between min-h-[74px] cursor-pointer ${
                              isSourceLeft
                                ? 'bg-amber-200 border-amber-400 ring-2 ring-amber-400 shadow-md scale-105'
                                : leftRec
                                  ? 'bg-white hover:bg-indigo-50/80 border-slate-200 shadow-2xs'
                                  : 'bg-slate-100/70 hover:bg-slate-200/70 border-dashed border-slate-300'
                            }`}
                          >
                            {leftRec ? (
                              <>
                                <div className="flex items-start justify-between gap-1">
                                  <span className="text-[11px] font-extrabold text-slate-900 truncate leading-tight block">
                                    {leftRec.studentName}
                                  </span>
                                  {leftRec.roleInClass && leftRec.roleInClass !== 'Học sinh' && (
                                    <span className="px-1 py-0.2 bg-red-50 text-red-700 text-[8px] font-bold rounded shrink-0 border border-red-200">
                                      {leftRec.roleInClass === 'Lớp trưởng' ? 'LT' : leftRec.roleInClass === 'Lớp phó học tập' ? 'LP' : 'TT'}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                                  <span>ĐTB: <strong className="text-indigo-600 font-bold">{leftRec.averageScore}</strong></span>
                                  <span className={`px-1 rounded ${leftRec.academicRanking === 'Tốt' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                                    {leftRec.academicRanking}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-[10px]">
                                <span>Ghế trống</span>
                              </div>
                            )}
                          </button>

                          {/* Right Seat */}
                          <button
                            type="button"
                            onClick={() => handleSeatClick(desk.deskNumber, 'right', desk.rightStudentId)}
                            className={`p-2 rounded-xl text-left border transition-all relative flex flex-col justify-between min-h-[74px] cursor-pointer ${
                              isSourceRight
                                ? 'bg-amber-200 border-amber-400 ring-2 ring-amber-400 shadow-md scale-105'
                                : rightRec
                                  ? 'bg-white hover:bg-indigo-50/80 border-slate-200 shadow-2xs'
                                  : 'bg-slate-100/70 hover:bg-slate-200/70 border-dashed border-slate-300'
                            }`}
                          >
                            {rightRec ? (
                              <>
                                <div className="flex items-start justify-between gap-1">
                                  <span className="text-[11px] font-extrabold text-slate-900 truncate leading-tight block">
                                    {rightRec.studentName}
                                  </span>
                                  {rightRec.roleInClass && rightRec.roleInClass !== 'Học sinh' && (
                                    <span className="px-1 py-0.2 bg-red-50 text-red-700 text-[8px] font-bold rounded shrink-0 border border-red-200">
                                      {rightRec.roleInClass === 'Lớp trưởng' ? 'LT' : rightRec.roleInClass === 'Lớp phó học tập' ? 'LP' : 'TT'}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                                  <span>ĐTB: <strong className="text-indigo-600 font-bold">{rightRec.averageScore}</strong></span>
                                  <span className={`px-1 rounded ${rightRec.academicRanking === 'Tốt' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'}`}>
                                    {rightRec.academicRanking}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-[10px]">
                                <span>Ghế trống</span>
                              </div>
                            )}
                          </button>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
              <span>LT/LP: Ban Cán Sự Lớp</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Học Lực Tốt (Giỏi)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span>Ghế Trống</span>
            </span>
          </div>
          <span className="text-[11px] font-sans">
            Mẹo: Bấm vào học sinh để xem hồ sơ hoặc chuyển đổi vị trí ngồi trong lớp.
          </span>
        </div>
      </div>

      {/* Student Detail Modal from Seating Chart */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-base">
                  {activeStudentModal.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activeStudentModal.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Số thứ tự #{activeStudentModal.rollNumber} · {activeStudentModal.roleInClass || 'Học sinh'} · Tổ {activeStudentModal.groupNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Học Lực (TT 22):</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{activeStudentModal.academicRanking}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Điểm Trung Bình HK:</span>
                  <span className="font-extrabold text-indigo-600 text-sm font-mono">{activeStudentModal.averageScore}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Rèn Luyện (Hạnh Kiểm):</span>
                  <span className="font-bold text-slate-800">{activeStudentModal.conductRanking}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Chuyên Cần:</span>
                  <span className="font-bold text-slate-800">
                    Nghỉ: {activeStudentModal.attendanceStats.excusedAbsence} (P) · {activeStudentModal.attendanceStats.unexcusedAbsence} (KP)
                  </span>
                </div>
              </div>

              {/* Parent Info */}
              <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">Thông Tin Phụ Huynh:</span>
                  <span className="font-mono text-indigo-700 font-bold">{activeStudentModal.parentPhone}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Người giám hộ: {activeStudentModal.parentName}
                </p>
              </div>

              {/* Homeroom Teacher Notes */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">Nhận xét của GVCN trên lớp:</span>
                <p className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-slate-800 italic leading-relaxed">
                  "{activeStudentModal.homeroomTeacherNotes || 'Ngoan ngoãn, hòa đồng với bạn bè trong tổ.'}"
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleStartSwap(activeStudentModal.deskNumber, activeStudentModal.seatSide, activeStudentModal.studentId);
                    setActiveStudentModal(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Đổi Chỗ Ngồi Cho Học Sinh Này</span>
                </button>

                <button
                  onClick={() => setActiveStudentModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
