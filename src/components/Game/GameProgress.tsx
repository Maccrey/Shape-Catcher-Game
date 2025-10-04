import { useGameStore } from '../../store/gameStore';
import { ProgressBar } from '../UI/ProgressBar';

export const GameProgress: React.FC = () => {
  const { levelManager, catchCount } = useGameStore();
  const levelConfig = levelManager.getCurrentLevelConfig();
  const progress = levelManager.getLevelProgress(catchCount);

  return (
    <div className="w-full max-w-md">
      <ProgressBar
        current={progress.catches}
        target={levelConfig.targetCatches}
        label={`Level ${levelConfig.level} Progress`}
        showPercentage={true}
        color="green"
        height="lg"
        animated={true}
      />
    </div>
  );
};
