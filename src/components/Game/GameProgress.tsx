import { useGameStore } from '../../store/gameStore';
import { ProgressBar } from '../UI/ProgressBar';

export const GameProgress: React.FC = () => {
  const levelManager = useGameStore(state => state.levelManager);
  const levelConfig = levelManager.getCurrentLevelConfig();
  // Use 0 as default since catchCount tracking is in gameStore
  const progress = levelManager.getLevelProgress(0);

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
