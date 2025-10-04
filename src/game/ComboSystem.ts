import { COMBO_TIMEOUT, COMBO_TIERS } from '../config/constants';

export interface ComboState {
  count: number;
  maxCount: number;
  timer: number;
  isActive: boolean;
  currentTier: number;
  multiplier: number;
}

export interface ComboTier {
  threshold: number;
  name: string;
  multiplier: number;
  color: string;
  message: string;
}

export const COMBO_TIER_CONFIG: ComboTier[] = [
  { threshold: 3, name: 'Nice!', multiplier: 1.1, color: '#22c55e', message: 'Nice!' },
  { threshold: 5, name: 'Great!', multiplier: 1.2, color: '#3b82f6', message: 'Great!' },
  { threshold: 10, name: 'Awesome!', multiplier: 1.5, color: '#a855f7', message: 'Awesome!' },
  { threshold: 15, name: 'Amazing!', multiplier: 2.0, color: '#f59e0b', message: 'Amazing!' },
  { threshold: 20, name: 'Legendary!', multiplier: 3.0, color: '#ef4444', message: 'LEGENDARY!' },
  { threshold: 30, name: 'GODLIKE!', multiplier: 5.0, color: '#ffd700', message: '🔥 GODLIKE! 🔥' }
];

export class ComboSystem {
  private state: ComboState;
  private onComboChange?: (state: ComboState) => void;
  private onTierReached?: (tier: ComboTier) => void;

  constructor() {
    this.state = {
      count: 0,
      maxCount: 0,
      timer: 0,
      isActive: false,
      currentTier: -1,
      multiplier: 1.0
    };
  }

  public setOnComboChange(callback: (state: ComboState) => void): void {
    this.onComboChange = callback;
  }

  public setOnTierReached(callback: (tier: ComboTier) => void): void {
    this.onTierReached = callback;
  }

  public increment(): void {
    this.state.count++;
    this.state.maxCount = Math.max(this.state.maxCount, this.state.count);
    this.state.timer = COMBO_TIMEOUT;
    this.state.isActive = true;

    // Check for tier advancement
    const newTier = this.getCurrentTierIndex();
    if (newTier > this.state.currentTier) {
      this.state.currentTier = newTier;
      const tier = COMBO_TIER_CONFIG[newTier];
      this.state.multiplier = tier.multiplier;

      if (this.onTierReached) {
        this.onTierReached(tier);
      }
    }

    this.notifyChange();
  }

  public reset(): void {
    this.state.count = 0;
    this.state.timer = 0;
    this.state.isActive = false;
    this.state.currentTier = -1;
    this.state.multiplier = 1.0;

    this.notifyChange();
  }

  public update(deltaTime: number): void {
    if (!this.state.isActive) return;

    this.state.timer -= deltaTime * 1000; // Convert to milliseconds

    if (this.state.timer <= 0) {
      this.reset();
    } else {
      this.notifyChange();
    }
  }

  public getState(): ComboState {
    return { ...this.state };
  }

  public getCount(): number {
    return this.state.count;
  }

  public getMaxCount(): number {
    return this.state.maxCount;
  }

  public getMaxCombo(): number {
    return this.getMaxCount();
  }

  public getMultiplier(): number {
    return this.state.multiplier;
  }

  public getTimer(): number {
    return this.state.timer;
  }

  public getTimerPercent(): number {
    return Math.max(0, this.state.timer / COMBO_TIMEOUT);
  }

  public isActive(): boolean {
    return this.state.isActive;
  }

  public getCurrentTier(): ComboTier | null {
    if (this.state.currentTier >= 0 && this.state.currentTier < COMBO_TIER_CONFIG.length) {
      return COMBO_TIER_CONFIG[this.state.currentTier];
    }
    return null;
  }

  public getCurrentTierIndex(): number {
    for (let i = COMBO_TIER_CONFIG.length - 1; i >= 0; i--) {
      if (this.state.count >= COMBO_TIER_CONFIG[i].threshold) {
        return i;
      }
    }
    return -1;
  }

  public getNextTier(): ComboTier | null {
    const currentIndex = this.getCurrentTierIndex();
    if (currentIndex + 1 < COMBO_TIER_CONFIG.length) {
      return COMBO_TIER_CONFIG[currentIndex + 1];
    }
    return null;
  }

  public getProgressToNextTier(): number {
    const nextTier = this.getNextTier();
    if (!nextTier) return 1.0; // Already at max tier

    const currentTier = this.getCurrentTier();
    const currentThreshold = currentTier ? currentTier.threshold : 0;
    const nextThreshold = nextTier.threshold;

    return (this.state.count - currentThreshold) / (nextThreshold - currentThreshold);
  }

  public calculateBonusScore(baseScore: number): number {
    return Math.floor(baseScore * this.state.multiplier);
  }

  public shouldShowSlowMotion(): boolean {
    return this.state.count >= 15; // Slow motion at 15+ combo
  }

  public shouldShowScreenEffect(): boolean {
    return this.state.count >= 10; // Screen effects at 10+ combo
  }

  public getComboMessage(): string {
    const tier = this.getCurrentTier();
    return tier ? tier.message : '';
  }

  public getComboColor(): string {
    const tier = this.getCurrentTier();
    return tier ? tier.color : '#ffffff';
  }

  private notifyChange(): void {
    if (this.onComboChange) {
      this.onComboChange(this.getState());
    }
  }

  public serialize(): any {
    return {
      maxCount: this.state.maxCount
    };
  }

  public deserialize(data: any): void {
    this.state.maxCount = data.maxCount || 0;
  }
}