import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * MathView component renders formulas and mixed text using KaTeX,
 * mimicking authentic MathType typography (Computer Modern / Times Math fonts,
 * italic variables, upright operators, true fraction bars, radicals, angle hats, etc.).
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = false,
  className = ''
}) => {
  const html = useMemo(() => {
    if (!math) return '';

    // Check if the text contains LaTeX delimiters like $...$ or $$...$$
    const hasDelimiters = math.includes('$');

    if (hasDelimiters) {
      // Split text and render $...$ parts with KaTeX
      const parts = math.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
      return parts.map((part) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const rawMath = part.slice(2, -2).trim();
          try {
            return katex.renderToString(rawMath, { displayMode: true, throwOnError: false });
          } catch {
            return part;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const rawMath = part.slice(1, -1).trim();
          try {
            return katex.renderToString(rawMath, { displayMode: false, throwOnError: false });
          } catch {
            return part;
          }
        } else {
          return part;
        }
      }).join('');
    }

    // If string looks like a pure formula, render it directly
    const looksLikeFormula = 
      math.includes('\\') || 
      math.includes('^') || 
      math.includes('_') || 
      math.includes('=') || 
      math.includes('+') || 
      math.includes('-') || 
      math.includes('/') || 
      math.includes('sqrt') ||
      math.includes('°');

    if (looksLikeFormula && displayMode) {
      // Normalize common simple representations if needed
      let normalized = math
        .replace(/°/g, '^\\circ')
        .replace(/x(\d)/g, 'x_$1');
      try {
        return katex.renderToString(normalized, { displayMode: true, throwOnError: false });
      } catch {
        return math;
      }
    }

    try {
      return katex.renderToString(math, { displayMode, throwOnError: false });
    } catch {
      return math;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-math font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
