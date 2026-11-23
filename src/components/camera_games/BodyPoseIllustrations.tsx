import React from 'react';
import { BodyPoseType } from '../../types/math';

interface BodyPoseIllustrationProps {
  pose: BodyPoseType;
  className?: string;
  size?: number;
  highlighted?: boolean;
}

export const BodyPoseIllustration: React.FC<BodyPoseIllustrationProps> = ({
  pose,
  className = '',
  size = 64,
  highlighted = false
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative transition-transform duration-200 ${
        highlighted ? 'scale-110 drop-shadow-md' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title={getPoseLabel(pose)}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow effect if highlighted */}
        {highlighted && (
          <circle cx="50" cy="60" r="48" fill="#FDE047" opacity="0.3" className="animate-pulse" />
        )}

        {/* Dynamic Pose Renderings */}
        {pose === 'both_hands_up' && (
          <g>
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            {/* Shoes */}
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso / School Shirt */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            {/* Blue School Collar & Scarf */}
            <path d="M44 52 L50 64 L56 52 Z" fill="#EF4444" />
            <path d="M40 50 C44 56 56 56 60 50" stroke="#0284C7" strokeWidth="2.5" fill="none" />

            {/* Arms: Both raised overhead */}
            {/* Left arm going up */}
            <path
              d="M38 56 C26 42 22 24 28 14"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Left hand */}
            <circle cx="28" cy="12" r="6" fill="#FBBF24" />
            <path d="M26 8 L29 6 L32 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right arm going up */}
            <path
              d="M62 56 C74 42 78 24 72 14"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Right hand */}
            <circle cx="72" cy="12" r="6" fill="#FBBF24" />
            <path d="M74 8 L71 6 L68 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            {/* Hair */}
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 C60 26 56 26 50 28 C44 26 40 26 34 32 Z"
              fill="#1E293B"
            />
            {/* Eyes */}
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            {/* Smile */}
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="41" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
            <circle cx="59" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
          </g>
        )}

        {pose === 'right_hand_up' && (
          <g>
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#DC2626"
              strokeWidth="2.5"
            />
            <path d="M44 52 L50 64 L56 52 Z" fill="#EF4444" />
            <path d="M40 50 C44 56 56 56 60 50" stroke="#DC2626" strokeWidth="2.5" fill="none" />

            {/* Left arm: Down / on hip */}
            <path
              d="M38 56 C28 66 28 78 36 84"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="36" cy="84" r="5.5" fill="#FBBF24" />

            {/* Right arm: Pointing / raised high to the right */}
            <path
              d="M62 56 C74 46 82 30 84 16"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="85" cy="14" r="6" fill="#FBBF24" />
            {/* Gesture motion indicator */}
            <path d="M80 8 Q86 6 92 10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 C60 26 56 26 50 28 C44 26 40 26 34 32 Z"
              fill="#1E293B"
            />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="41" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
            <circle cx="59" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
          </g>
        )}

        {pose === 'left_hand_up' && (
          <g>
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#16A34A"
              strokeWidth="2.5"
            />
            <path d="M44 52 L50 64 L56 52 Z" fill="#EF4444" />
            <path d="M40 50 C44 56 56 56 60 50" stroke="#16A34A" strokeWidth="2.5" fill="none" />

            {/* Left arm: Raised high to the left */}
            <path
              d="M38 56 C26 46 18 30 16 16"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="15" cy="14" r="6" fill="#FBBF24" />
            <path d="M10 10 Q14 6 20 8" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />

            {/* Right arm: Down / on hip */}
            <path
              d="M62 56 C72 66 72 78 64 84"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="64" cy="84" r="5.5" fill="#FBBF24" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 C60 26 56 26 50 28 C44 26 40 26 34 32 Z"
              fill="#1E293B"
            />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="41" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
            <circle cx="59" cy="40" r="2" fill="#FCA5A5" opacity="0.8" />
          </g>
        )}

        {pose === 'cross_arms' && (
          <g>
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#9333EA"
              strokeWidth="2.5"
            />
            <path d="M44 52 L50 64 L56 52 Z" fill="#EF4444" />

            {/* Crossed Arms forming X on chest */}
            <path
              d="M36 58 C46 66 54 74 62 76"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M64 58 C54 66 46 74 38 76"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="36" cy="76" r="5" fill="#FBBF24" />
            <circle cx="64" cy="76" r="5" fill="#FBBF24" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 C60 26 56 26 50 28 C44 26 40 26 34 32 Z"
              fill="#1E293B"
            />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M46 43 Q50 45 54 43" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {pose === 'tilt_left' && (
          <g transform="rotate(-15 50 110)">
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso tilted */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#0D9488"
              strokeWidth="2.5"
            />
            {/* Arms swaying left */}
            <path d="M36 56 C24 64 16 76 18 86" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
            <path d="M64 56 C60 68 56 80 52 86" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 Z"
              fill="#1E293B"
            />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {pose === 'tilt_right' && (
          <g transform="rotate(15 50 110)">
            {/* Legs */}
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            {/* Torso tilted */}
            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            {/* Arms swaying right */}
            <path d="M36 56 C40 68 44 80 48 86" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
            <path d="M64 56 C76 64 84 76 82 86" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />

            {/* Head */}
            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path
              d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 Z"
              fill="#1E293B"
            />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {pose === 'hands_on_hips' && (
          <g>
            <rect x="40" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <rect x="52" y="88" width="8" height="28" rx="4" fill="#1E293B" />
            <ellipse cx="43" cy="116" rx="6" ry="3.5" fill="#0F172A" />
            <ellipse cx="57" cy="116" rx="6" ry="3.5" fill="#0F172A" />

            <path
              d="M36 54 C36 48 64 48 64 54 L62 90 L38 90 Z"
              fill="#FFFFFF"
              stroke="#6366F1"
              strokeWidth="2.5"
            />
            {/* Arms on hips (triangles) */}
            <path d="M38 56 L24 70 L36 78" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M62 56 L76 70 L64 78" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" fill="none" />

            <circle cx="50" cy="36" r="16" fill="#FED7AA" />
            <path d="M34 32 C34 20 44 16 50 16 C56 16 66 20 66 32 Z" fill="#1E293B" />
            <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <ellipse cx="56" cy="36" rx="2" ry="2.5" fill="#0F172A" />
            <path d="M45 42 Q50 47 55 42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

export function getPoseLabel(pose: BodyPoseType): string {
  switch (pose) {
    case 'both_hands_up':
      return 'Hai tay giơ cao qua đầu';
    case 'right_hand_up':
      return 'Giơ tay phải lên cao';
    case 'left_hand_up':
      return 'Giơ tay trái lên cao';
    case 'cross_arms':
      return 'Bắt chéo 2 tay trước ngực';
    case 'tilt_left':
      return 'Nghiêng người sang trái';
    case 'tilt_right':
      return 'Nghiêng người sang phải';
    case 'hands_on_hips':
      return 'Hai tay chống hông';
    default:
      return 'Tư thế vận động';
  }
}

export function getPoseColorClasses(color: 'blue' | 'red' | 'green' | 'amber' | 'purple', isSelected: boolean = false) {
  switch (color) {
    case 'blue':
      return {
        bg: isSelected ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-300' : 'bg-blue-500 hover:bg-blue-600 text-white',
        border: 'border-blue-600',
        badge: 'bg-blue-700 text-blue-100',
        accent: '#2563EB'
      };
    case 'red':
      return {
        bg: isSelected ? 'bg-red-600 text-white shadow-lg ring-4 ring-red-300' : 'bg-red-500 hover:bg-red-600 text-white',
        border: 'border-red-600',
        badge: 'bg-red-700 text-red-100',
        accent: '#DC2626'
      };
    case 'green':
      return {
        bg: isSelected ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300' : 'bg-emerald-500 hover:bg-emerald-600 text-white',
        border: 'border-emerald-600',
        badge: 'bg-emerald-700 text-emerald-100',
        accent: '#059669'
      };
    case 'amber':
      return {
        bg: isSelected ? 'bg-amber-600 text-white shadow-lg ring-4 ring-amber-300' : 'bg-amber-500 hover:bg-amber-600 text-white',
        border: 'border-amber-600',
        badge: 'bg-amber-700 text-amber-100',
        accent: '#D97706'
      };
    case 'purple':
    default:
      return {
        bg: isSelected ? 'bg-purple-600 text-white shadow-lg ring-4 ring-purple-300' : 'bg-purple-500 hover:bg-purple-600 text-white',
        border: 'border-purple-600',
        badge: 'bg-purple-700 text-purple-100',
        accent: '#9333EA'
      };
  }
}
