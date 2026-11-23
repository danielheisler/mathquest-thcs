import React, { useState } from 'react';
import { MathView } from './MathView';
import { soundManager } from '../../utils/sound';
import { Eye, Keyboard, Sparkles, Check } from 'lucide-react';

interface MathTypeToolbarProps {
  onInsert: (snippet: string) => void;
  previewText?: string;
}

export const MathTypeToolbar: React.FC<MathTypeToolbarProps> = ({
  onInsert,
  previewText = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<'calc' | 'geometry' | 'operators' | 'symbols'>('calc');

  const categories = [
    { id: 'calc', label: 'Phân Số & Đại Số' },
    { id: 'geometry', label: 'Hình Học & Góc' },
    { id: 'operators', label: 'Phép Toán & Quan Hệ' },
    { id: 'symbols', label: 'Ký Hiệu & Tập Hợp' },
  ];

  const mathSnippets = {
    calc: [
      { label: 'Phân số', latex: '\\frac{a}{b}', display: '\\frac{a}{b}' },
      { label: 'Số mũ', latex: 'x^{2}', display: 'x^2' },
      { label: 'Lũy thừa n', latex: 'x^{n}', display: 'x^n' },
      { label: 'Chỉ số dưới', latex: 'x_{1}', display: 'x_1' },
      { label: 'Căn bậc 2', latex: '\\sqrt{x}', display: '\\sqrt{x}' },
      { label: 'Căn bậc n', latex: '\\sqrt[n]{x}', display: '\\sqrt[n]{x}' },
      { label: 'Hệ 2 PT', latex: '\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}', display: '\\begin{cases} a \\\\ b \\end{cases}' },
      { label: 'Hiệu bình phương', latex: '(a - b)(a + b)', display: 'a^2 - b^2' },
      { label: 'Bình phương tổng', latex: '(a + b)^2 = a^2 + 2ab + b^2', display: '(a+b)^2' }
    ],
    geometry: [
      { label: 'Góc', latex: '\\widehat{ABC}', display: '\\widehat{ABC}' },
      { label: 'Góc xOy', latex: '\\widehat{xOy}', display: '\\widehat{xOy}' },
      { label: 'Độ (°)', latex: '^{\\circ}', display: '90^\\circ' },
      { label: 'Tam giác', latex: '\\triangle ABC', display: '\\triangle ABC' },
      { label: 'Vuông góc', latex: '\\perp', display: '\\perp' },
      { label: 'Song song', latex: '\\parallel', display: '\\parallel' },
      { label: 'Đồng dạng', latex: '\\sim', display: '\\sim' },
      { label: 'Véc-tơ', latex: '\\vec{v}', display: '\\vec{v}' },
      { label: 'Độ dài đoạn', latex: 'AB = CD', display: 'AB' }
    ],
    operators: [
      { label: 'Nhân (×)', latex: '\\times', display: '\\times' },
      { label: 'Nhân chấm (·)', latex: '\\cdot', display: '\\cdot' },
      { label: 'Chia (:)', latex: ':', display: ':' },
      { label: 'Chia (÷)', latex: '\\div', display: '\\div' },
      { label: 'Cộng trừ (±)', latex: '\\pm', display: '\\pm' },
      { label: 'Khác (≠)', latex: '\\neq', display: '\\neq' },
      { label: 'Gần bằng (≈)', latex: '\\approx', display: '\\approx' },
      { label: 'Nhỏ hơn bằng (≤)', latex: '\\le', display: '\\le' },
      { label: 'Lớn hơn bằng (≥)', latex: '\\ge', display: '\\ge' }
    ],
    symbols: [
      { label: 'Thuộc (∈)', latex: '\\in', display: '\\in' },
      { label: 'Không thuộc (∉)', latex: '\\notin', display: '\\notin' },
      { label: 'Tập số thực ℝ', latex: '\\mathbb{R}', display: '\\mathbb{R}' },
      { label: 'Tập số nguyên ℤ', latex: '\\mathbb{Z}', display: '\\mathbb{Z}' },
      { label: 'Tập số tự nhiên ℕ', latex: '\\mathbb{N}', display: '\\mathbb{N}' },
      { label: 'Số Pi (π)', latex: '\\pi', display: '\\pi' },
      { label: 'Góc Alpha (α)', latex: '\\alpha', display: '\\alpha' },
      { label: 'Delta (Δ)', latex: '\\Delta', display: '\\Delta' }
    ]
  };

  const handleSnippetClick = (snippet: string) => {
    soundManager.playClick();
    onInsert(snippet);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-white shadow-md space-y-3">
      {/* Category selector */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-black">
            √
          </div>
          <span className="text-xs font-bold text-slate-200">Thanh Công Cụ MathType THCS:</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id as any)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons Grid with authentic MathType rendering */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
        {mathSnippets[activeCategory].map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSnippetClick(btn.latex)}
            className="p-2 bg-slate-800/90 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
            title={`Chèn: ${btn.label} (${btn.latex})`}
          >
            <div className="h-6 flex items-center justify-center text-slate-100 group-hover:text-white text-sm">
              <MathView math={btn.display} displayMode={false} />
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-indigo-100 truncate w-full text-center">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Live MathType Preview if previewText is provided */}
      {previewText && (
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-xs">
          <span className="text-slate-400 shrink-0 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Xem trước MathType:
          </span>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex-1 overflow-x-auto text-amber-300 font-serif">
            <MathView math={previewText} displayMode={true} />
          </div>
        </div>
      )}
    </div>
  );
};
