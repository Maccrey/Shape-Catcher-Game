import { ShareImageGenerator, ShareImageData } from '../utils/shareImageGenerator';

export class ShareService {
  private imageGenerator: ShareImageGenerator;
  private static instance: ShareService;

  private constructor() {
    this.imageGenerator = new ShareImageGenerator();
  }

  public static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  /**
   * Share game score using Web Share API
   * Falls back to download if Web Share API is not supported
   */
  public async shareScore(data: ShareImageData): Promise<boolean> {
    try {
      const imageDataUrl = this.imageGenerator.generateShareImage(data);

      // Check if Web Share API is supported
      if (this.isWebShareSupported()) {
        // Convert data URL to blob
        const blob = await this.dataUrlToBlob(imageDataUrl);
        const file = new File([blob], 'shape-catcher-score.png', { type: 'image/png' });

        const shareData: ShareData = {
          title: 'Shape Catcher - My Score',
          text: `I scored ${data.score.toLocaleString()} points in Shape Catcher! Can you beat my score?`,
          files: [file]
        };

        // Check if sharing files is supported
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return true;
        } else {
          // Fall back to sharing without file
          await navigator.share({
            title: shareData.title,
            text: shareData.text,
            url: window.location.href
          });
          return true;
        }
      } else {
        // Fallback: Download the image
        this.imageGenerator.downloadImage(imageDataUrl);
        return false;
      }
    } catch (error) {
      console.error('Error sharing score:', error);

      // If sharing failed or was cancelled, offer download
      if (error instanceof Error && error.name !== 'AbortError') {
        const imageDataUrl = this.imageGenerator.generateShareImage(data);
        this.imageGenerator.downloadImage(imageDataUrl);
      }

      return false;
    }
  }

  /**
   * Check if Web Share API is supported
   */
  public isWebShareSupported(): boolean {
    return typeof navigator.share === 'function';
  }

  /**
   * Download score image directly
   */
  public downloadScoreImage(data: ShareImageData): void {
    const imageDataUrl = this.imageGenerator.generateShareImage(data);
    this.imageGenerator.downloadImage(imageDataUrl);
  }

  /**
   * Get share image as data URL for preview
   */
  public generateShareImagePreview(data: ShareImageData): string {
    return this.imageGenerator.generateShareImage(data);
  }

  /**
   * Convert data URL to Blob
   */
  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }

  /**
   * Copy share text to clipboard
   */
  public async copyShareText(data: ShareImageData): Promise<boolean> {
    const text = `I scored ${data.score.toLocaleString()} points in Shape Catcher!\n` +
                 `Level: ${data.level} | Max Combo: ${data.maxCombo}x\n` +
                 `Can you beat my score?`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  /**
   * Share to specific social platforms (fallback method)
   */
  public shareToSocialMedia(platform: 'twitter' | 'facebook', data: ShareImageData): void {
    const text = `I scored ${data.score.toLocaleString()} points in Shape Catcher!`;
    const url = window.location.href;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  }
}
