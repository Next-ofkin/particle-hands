import type { Hand3DPosition } from '../types/gesture';

export class MouseTracker {
  private container: HTMLElement;
  private isActive: boolean = false;
  private onHandDetected: ((position: Hand3DPosition) => void) | null = null;
  private mousePosition: Hand3DPosition = { x: 0, y: 0, z: 0, screenX: 0.5, screenY: 0.5 };

  constructor(container: HTMLElement) {
    this.container = container;
    console.log('🖱️ MouseTracker initialized');
  }

  public initialize(
    onHandDetected: (position: Hand3DPosition) => void,
    onHandLost: () => void
  ): Promise<boolean> {
    this.onHandDetected = onHandDetected;

    // Mouse move event
    this.container.addEventListener('mousemove', this.handleMouseMove);
    
    // Mouse enter/leave events
    this.container.addEventListener('mouseenter', () => {
      this.isActive = true;
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.isActive = false;
      onHandLost();
    });

    console.log('✅ Mouse tracking active!');
    console.log('🖱️ Move your mouse to control particles!');
    
    return Promise.resolve(true);
  }

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isActive || !this.onHandDetected) return;

    const rect = this.container.getBoundingClientRect();
    
    // Convert mouse position to normalized coords (0-1)
    const screenX = event.clientX / rect.width;
    const screenY = event.clientY / rect.height;

    // Convert to 3D space (-50 to 50 to match particle boundary)
    const x = (screenX - 0.5) * 100;
    const y = -(screenY - 0.5) * 100; // Invert Y
    const z = 0;

    this.mousePosition = {
      x,
      y,
      z,
      screenX,
      screenY,
    };

    this.onHandDetected(this.mousePosition);
  };

  public cleanup() {
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    console.log('🧹 MouseTracker cleaned up');
  }

  public isReady(): boolean {
    return true;
  }
}