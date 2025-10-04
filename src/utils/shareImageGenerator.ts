import { ShapeType, ShapeColor } from '../types/shape.types';

export interface ShareImageData {
  score: number;
  level: number;
  maxCombo: number;
  totalCatches: number;
  accuracy: number;
  mode: string;
  grade?: string;
}

export class ShareImageGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private readonly width = 1200;
  private readonly height = 630;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas 2D context');
    }
    this.ctx = ctx;
  }

  public generateShareImage(data: ShareImageData): string {
    this.clearCanvas();
    this.drawBackground();
    this.drawTitle();
    this.drawStats(data);
    this.drawShapes();
    this.drawFooter();

    return this.canvas.toDataURL('image/png');
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private drawBackground(): void {
    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#1e3a8a'); // Blue
    gradient.addColorStop(0.5, '#7c3aed'); // Purple
    gradient.addColorStop(1, '#db2777'); // Pink

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Add subtle pattern
    this.ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = Math.random() * 20 + 10;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  private drawTitle(): void {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    // Game title
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 72px Arial, sans-serif';
    this.ctx.fillText('Shape Catcher', this.width / 2, 40);

    // Subtitle
    this.ctx.font = '32px Arial, sans-serif';
    this.ctx.fillStyle = '#e0e7ff';
    this.ctx.fillText('My Game Results', this.width / 2, 130);
  }

  private drawStats(data: ShareImageData): void {
    const startY = 220;
    const lineHeight = 80;

    // Main score
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.font = 'bold 96px Arial, sans-serif';
    this.ctx.fillText(data.score.toLocaleString(), this.width / 2, startY);

    this.ctx.font = '28px Arial, sans-serif';
    this.ctx.fillStyle = '#fcd34d';
    this.ctx.fillText('SCORE', this.width / 2, startY + 105);

    // Other stats in grid
    const statsY = startY + 180;
    const stats = [
      { label: 'Level', value: data.level.toString() },
      { label: 'Max Combo', value: `${data.maxCombo}x` },
      { label: 'Catches', value: data.totalCatches.toString() },
      { label: 'Accuracy', value: `${Math.round(data.accuracy)}%` }
    ];

    const statWidth = this.width / stats.length;
    stats.forEach((stat, index) => {
      const x = (index + 0.5) * statWidth;

      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 48px Arial, sans-serif';
      this.ctx.fillText(stat.value, x, statsY);

      this.ctx.font = '24px Arial, sans-serif';
      this.ctx.fillStyle = '#c7d2fe';
      this.ctx.fillText(stat.label, x, statsY + 55);
    });

    // Grade badge (if present)
    if (data.grade) {
      const badgeX = this.width - 120;
      const badgeY = 80;
      const badgeSize = 80;

      // Draw badge circle
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.beginPath();
      this.ctx.arc(badgeX, badgeY, badgeSize / 2, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw grade text
      this.ctx.fillStyle = '#1e3a8a';
      this.ctx.font = 'bold 36px Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(data.grade, badgeX, badgeY);
    }
  }

  private drawShapes(): void {
    // Draw decorative shapes
    const shapes = [
      { x: 100, y: 500, type: 'circle', color: '#ef4444' },
      { x: 250, y: 530, type: 'square', color: '#3b82f6' },
      { x: 950, y: 500, type: 'triangle', color: '#22c55e' },
      { x: 1100, y: 530, type: 'star', color: '#eab308' }
    ];

    shapes.forEach(shape => {
      this.ctx.save();
      this.ctx.fillStyle = shape.color;
      this.ctx.globalAlpha = 0.8;

      switch (shape.type) {
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(shape.x, shape.y, 30, 0, Math.PI * 2);
          this.ctx.fill();
          break;

        case 'square':
          this.ctx.fillRect(shape.x - 30, shape.y - 30, 60, 60);
          break;

        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(shape.x, shape.y - 35);
          this.ctx.lineTo(shape.x + 30, shape.y + 20);
          this.ctx.lineTo(shape.x - 30, shape.y + 20);
          this.ctx.closePath();
          this.ctx.fill();
          break;

        case 'star':
          this.drawStar(shape.x, shape.y, 5, 35, 15);
          this.ctx.fill();
          break;
      }

      this.ctx.restore();
    });
  }

  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
  }

  private drawFooter(): void {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillStyle = '#e0e7ff';
    this.ctx.font = '24px Arial, sans-serif';
    this.ctx.fillText('Play now and beat my score!', this.width / 2, this.height - 20);
  }

  public downloadImage(dataUrl: string, filename: string = 'shape-catcher-score.png'): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
