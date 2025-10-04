export enum Grade {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER'
}

export interface GradeConfig {
  grade: Grade;
  name: string;
  color: string;
  icon: string;
  minAccuracy: number; // 0-1
  minCombo: number;
  scoreBonus: number;
}

export const GRADE_CONFIGS: Record<Grade, GradeConfig> = {
  [Grade.BRONZE]: {
    grade: Grade.BRONZE,
    name: 'Bronze',
    color: '#cd7f32',
    icon: '🥉',
    minAccuracy: 0.5,
    minCombo: 0,
    scoreBonus: 100
  },
  [Grade.SILVER]: {
    grade: Grade.SILVER,
    name: 'Silver',
    color: '#c0c0c0',
    icon: '🥈',
    minAccuracy: 0.7,
    minCombo: 5,
    scoreBonus: 300
  },
  [Grade.GOLD]: {
    grade: Grade.GOLD,
    name: 'Gold',
    color: '#ffd700',
    icon: '🥇',
    minAccuracy: 0.85,
    minCombo: 10,
    scoreBonus: 500
  },
  [Grade.DIAMOND]: {
    grade: Grade.DIAMOND,
    name: 'Diamond',
    color: '#b9f2ff',
    icon: '💎',
    minAccuracy: 0.95,
    minCombo: 15,
    scoreBonus: 1000
  },
  [Grade.MASTER]: {
    grade: Grade.MASTER,
    name: 'Master',
    color: '#ff69b4',
    icon: '👑',
    minAccuracy: 1.0,
    minCombo: 20,
    scoreBonus: 2000
  }
};

export interface LevelResult {
  catches: number;
  misses: number;
  maxCombo: number;
  totalShapes: number;
  timeTaken: number;
  score: number;
}

export class GradeSystem {
  public calculateGrade(result: LevelResult): Grade {
    const accuracy = result.catches / result.totalShapes;
    const maxCombo = result.maxCombo;

    // Check grades from highest to lowest
    const grades = [
      Grade.MASTER,
      Grade.DIAMOND,
      Grade.GOLD,
      Grade.SILVER,
      Grade.BRONZE
    ];

    for (const grade of grades) {
      const config = GRADE_CONFIGS[grade];
      if (accuracy >= config.minAccuracy && maxCombo >= config.minCombo) {
        return grade;
      }
    }

    return Grade.BRONZE;
  }

  public getGradeConfig(grade: Grade): GradeConfig {
    return GRADE_CONFIGS[grade];
  }

  public getGradeBonus(grade: Grade): number {
    return GRADE_CONFIGS[grade].scoreBonus;
  }

  public getGradeMessage(grade: Grade): string {
    const config = GRADE_CONFIGS[grade];

    switch (grade) {
      case Grade.MASTER:
        return `${config.icon} PERFECT! Master Grade!`;
      case Grade.DIAMOND:
        return `${config.icon} AMAZING! Diamond Grade!`;
      case Grade.GOLD:
        return `${config.icon} EXCELLENT! Gold Grade!`;
      case Grade.SILVER:
        return `${config.icon} GREAT! Silver Grade!`;
      case Grade.BRONZE:
      default:
        return `${config.icon} GOOD! Bronze Grade!`;
    }
  }

  public getNextGrade(currentGrade: Grade): Grade | null {
    const gradeOrder = [
      Grade.BRONZE,
      Grade.SILVER,
      Grade.GOLD,
      Grade.DIAMOND,
      Grade.MASTER
    ];

    const currentIndex = gradeOrder.indexOf(currentGrade);
    if (currentIndex < gradeOrder.length - 1) {
      return gradeOrder[currentIndex + 1];
    }

    return null;
  }

  public getGradeRequirements(grade: Grade): string {
    const config = GRADE_CONFIGS[grade];
    return `${Math.round(config.minAccuracy * 100)}% accuracy, ${config.minCombo}+ combo`;
  }

  public isGradeUnlocked(grade: Grade, playerStats: {
    bestAccuracy: number;
    bestCombo: number;
  }): boolean {
    const config = GRADE_CONFIGS[grade];
    return (
      playerStats.bestAccuracy >= config.minAccuracy &&
      playerStats.bestCombo >= config.minCombo
    );
  }
}
