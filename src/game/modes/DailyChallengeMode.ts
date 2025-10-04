import { ShapeType, ShapeColor } from '../../types/shape.types';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  seed: number;
  name: string;
  description: string;
  rules: {
    timeLimit: number;
    lives: number;
    targetScore: number;
    allowedShapes?: ShapeType[];
    allowedColors?: ShapeColor[];
    specialRule?: string;
  };
  rewards: {
    bronze: number;
    silver: number;
    gold: number;
  };
}

export interface DailyChallengeRecord {
  date: string;
  completed: boolean;
  score: number;
  grade: 'bronze' | 'silver' | 'gold' | null;
  completedAt?: number;
}

export class DailyChallengeMode {
  private currentChallenge: DailyChallenge | null = null;
  private records: Map<string, DailyChallengeRecord> = new Map();

  constructor() {
    this.loadRecords();
  }

  public getTodaysChallenge(): DailyChallenge {
    const today = this.getTodayDateString();

    // Check if we already generated today's challenge
    if (this.currentChallenge && this.currentChallenge.date === today) {
      return this.currentChallenge;
    }

    // Generate new challenge
    this.currentChallenge = this.generateChallenge(today);
    return this.currentChallenge;
  }

  private generateChallenge(date: string): DailyChallenge {
    const seed = this.dateSeed(date);
    const random = this.seededRandom(seed);

    const challenges = [
      {
        name: 'Speed Demon',
        description: 'Catch 50 shapes in 90 seconds',
        rules: {
          timeLimit: 90000,
          lives: 3,
          targetScore: 500,
          specialRule: 'Double fall speed'
        }
      },
      {
        name: 'Perfect Circle',
        description: 'Only circles allowed today',
        rules: {
          timeLimit: 120000,
          lives: 5,
          targetScore: 800,
          allowedShapes: [ShapeType.CIRCLE],
          specialRule: 'Circles only'
        }
      },
      {
        name: 'Rainbow Master',
        description: 'Catch shapes of all colors',
        rules: {
          timeLimit: 150000,
          lives: 3,
          targetScore: 1000,
          specialRule: 'Must catch all colors'
        }
      },
      {
        name: 'No Mistakes',
        description: 'One life, high stakes',
        rules: {
          timeLimit: 120000,
          lives: 1,
          targetScore: 600,
          specialRule: 'One life only'
        }
      },
      {
        name: 'Color Blind',
        description: 'All shapes are the same color',
        rules: {
          timeLimit: 120000,
          lives: 3,
          targetScore: 700,
          allowedColors: [ShapeColor.RED],
          specialRule: 'Single color mode'
        }
      }
    ];

    const challengeIndex = Math.floor(random() * challenges.length);
    const selectedChallenge = challenges[challengeIndex];

    return {
      id: `challenge_${date}`,
      date,
      seed,
      ...selectedChallenge,
      rewards: {
        bronze: 100,
        silver: 250,
        gold: 500
      }
    };
  }

  public recordCompletion(score: number): void {
    if (!this.currentChallenge) return;

    const grade = this.calculateGrade(score);
    const record: DailyChallengeRecord = {
      date: this.currentChallenge.date,
      completed: true,
      score,
      grade,
      completedAt: Date.now()
    };

    this.records.set(this.currentChallenge.date, record);
    this.saveRecords();
  }

  private calculateGrade(score: number): 'bronze' | 'silver' | 'gold' | null {
    if (!this.currentChallenge) return null;

    const target = this.currentChallenge.rules.targetScore;
    if (score >= target * 1.5) return 'gold';
    if (score >= target * 1.2) return 'silver';
    if (score >= target * 0.8) return 'bronze';
    return null;
  }

  public getTodaysRecord(): DailyChallengeRecord | undefined {
    return this.records.get(this.getTodayDateString());
  }

  public hasCompletedToday(): boolean {
    const record = this.getTodaysRecord();
    return record?.completed || false;
  }

  public getStreak(): number {
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateString = this.formatDate(currentDate);
      const record = this.records.get(dateString);

      if (!record?.completed) break;

      streak++;
      currentDate.setDate(currentDate.getDate() - 1);

      // Limit check to prevent infinite loop
      if (streak > 365) break;
    }

    return streak;
  }

  public getAllRecords(): DailyChallengeRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Utility methods
  private getTodayDateString(): string {
    return this.formatDate(new Date());
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private dateSeed(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  // Persistence
  private saveRecords(): void {
    try {
      const data = Array.from(this.records.entries());
      localStorage.setItem('daily_challenge_records', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save daily challenge records:', error);
    }
  }

  private loadRecords(): void {
    try {
      const saved = localStorage.getItem('daily_challenge_records');
      if (saved) {
        const data = JSON.parse(saved);
        this.records = new Map(data);
      }
    } catch (error) {
      console.warn('Failed to load daily challenge records:', error);
    }
  }
}
