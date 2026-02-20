import type { VisionTheme } from './types';

export class VisionRegistry {
  private readonly visions = new Map<string, VisionTheme>();

  constructor(initialVisions: VisionTheme[] = []) {
    for (const vision of initialVisions) {
      this.register(vision);
    }
  }

  register(vision: VisionTheme): void {
    this.visions.set(vision.id, vision);
  }

  has(visionId: string): boolean {
    return this.visions.has(visionId);
  }

  get(visionId: string): VisionTheme | undefined {
    return this.visions.get(visionId);
  }

  getOrFallback(visionId: string): VisionTheme | undefined {
    const selectedVision = this.visions.get(visionId);
    if (selectedVision) {
      return selectedVision;
    }

    return this.list()[0];
  }

  list(): VisionTheme[] {
    return Array.from(this.visions.values());
  }
}
