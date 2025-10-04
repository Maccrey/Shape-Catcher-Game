export interface TimeAttackState {
  score: number;
  elapsedTime: number;
  remainingTime: number;
  shapesLeft: number;
  bonusTime: number;
}

export class TimeAttackMode {
  private totalTime: number; // milliseconds
  private state: TimeAttackState;

  constructor(totalTime: number = 180000) {
    // Default 3 minutes
    this.totalTime = totalTime;
    this.state = {
      score: 0,
      elapsedTime: 0,
      remainingTime: totalTime,
      shapesLeft: 0,
      bonusTime: 0
    };
  }

  public update(deltaTime: number, score: number): void {
    this.state.elapsedTime += deltaTime * 1000;
    this.state.score = score;
    this.state.remainingTime = Math.max(
      0,
      this.totalTime + this.state.bonusTime - this.state.elapsedTime
    );
  }

  public addBonusTime(milliseconds: number): void {
    this.state.bonusTime += milliseconds;
    this.state.remainingTime += milliseconds;
  }

  public getRemainingTime(): number {
    return this.state.remainingTime;
  }

  public getRemainingTimeFormatted(): string {
    const totalSeconds = Math.ceil(this.state.remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public getElapsedTime(): number {
    return this.state.elapsedTime;
  }

  public isTimeUp(): boolean {
    return this.state.remainingTime <= 0;
  }

  public getTimePercentage(): number {
    const total = this.totalTime + this.state.bonusTime;
    return (this.state.remainingTime / total) * 100;
  }

  public getState(): TimeAttackState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = {
      score: 0,
      elapsedTime: 0,
      remainingTime: this.totalTime,
      shapesLeft: 0,
      bonusTime: 0
    };
  }

  // Time pressure mechanics
  public shouldWarnTimeRunningOut(): boolean {
    return this.state.remainingTime <= 30000 && this.state.remainingTime > 0;
  }

  public getUrgencyLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const timeLeft = this.state.remainingTime;
    if (timeLeft > 120000) return 'low'; // > 2 minutes
    if (timeLeft > 60000) return 'medium'; // > 1 minute
    if (timeLeft > 30000) return 'high'; // > 30 seconds
    return 'critical'; // <= 30 seconds
  }

  // Bonus calculation
  public calculateTimeBonusScore(): number {
    // Bonus points for time remaining
    const secondsRemaining = Math.floor(this.state.remainingTime / 1000);
    return secondsRemaining * 10;
  }

  public getFinalScore(): number {
    return this.state.score + this.calculateTimeBonusScore();
  }
}
