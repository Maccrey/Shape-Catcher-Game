import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500'
};

const heightClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6'
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  showPercentage = false,
  color = 'blue',
  height = 'md',
  animated = true
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const colorClass = colorClasses[color];
  const heightClass = heightClasses[height];

  return (
    <div className="w-full">
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-sm">
          {label && <span className="font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-gray-600 font-semibold">
              {current} / {target}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full ${heightClass} bg-gray-200 rounded-full overflow-hidden shadow-inner`}>
        {animated ? (
          <motion.div
            className={`${heightClass} ${colorClass} rounded-full shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Shine effect */}
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        ) : (
          <div
            className={`${heightClass} ${colorClass} rounded-full shadow-lg transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shine effect */}
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        )}
      </div>

      {/* Milestone markers (optional) */}
      {target >= 10 && (
        <div className="relative mt-1 flex justify-between text-xs text-gray-400">
          {Array.from({ length: 5 }).map((_, i) => {
            const milestoneValue = Math.floor((target / 4) * i);
            const isMet = current >= milestoneValue;
            return (
              <span
                key={i}
                className={`${isMet ? 'text-gray-600 font-semibold' : ''}`}
              >
                {i === 4 ? target : milestoneValue}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface CircularProgressProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  target,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  showLabel = true
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-gray-500">
              {current}/{target}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
