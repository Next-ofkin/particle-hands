import type { Hand3DPosition } from '../types/gesture';

export class MouseTracker {
  private container: HTMLElement;
  private isActive: boolean = false;
  private onHandDetected: ((position: Hand3DPosition) => void) | null = null;
  private onHandLost: (() => void) | null = null;
  private onClick: ((position: Hand3DPosition) => void) | null = null;
  private onRightClick: ((position: Hand3DPosition) => void) | null = null;
  private mousePosition: Hand3DPosition = { x: 0, y: 0, z: 0, screenX: 0.5, screenY: 0.5 };

  constructor(container: HTMLElement) {
    this.container = container;
    console.log('🖱️ MouseTracker initialized');
  }

  public initialize(
    onHandDetected: (position: Hand3DPosition) => void,
    onHandLost: () => void,
    onClick?: (position: Hand3DPosition) => void,
    onRightClick?: (position: Hand3DPosition) => void
  ): Promise<boolean> {
    this.onHandDetected = onHandDetected;
    this.onHandLost = onHandLost;
    this.onClick = onClick || null;
    this.onRightClick = onRightClick || null;

    // Mouse move event
    this.container.addEventListener('mousemove', this.handleMouseMove);
    
    // Click events
    this.container.addEventListener('click', this.handleClick);
    this.container.addEventListener('contextmenu', this.handleRightClick);
    
    // Mouse enter/leave events
    this.container.addEventListener('mouseenter', () => {
      this.isActive = true;
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.isActive = false;
      if (this.onHandLost) {
        this.onHandLost();
      }
    });

    console.log('✅ Mouse tracking active with click detection!');
    console.log('🖱️ Click to form shapes!');
    
    return Promise.resolve(true);
  }

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    
    // Convert mouse position to normalized coords (0-1)
    const screenX = event.clientX / rect.width;
    const screenY = event.clientY / rect.height;

    // Convert to 3D space
    const x = (screenX - 0.5) * 100;
    const y = -(screenY - 0.5) * 100;
    const z = 0;

    this.mousePosition = {
      x,
      y,
      z,
      screenX,
      screenY,
    };

    if (this.isActive && this.onHandDetected) {
      this.onHandDetected(this.mousePosition);
    }
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.onClick) return;
    
    const rect = this.container.getBoundingClientRect();
    const screenX = event.clientX / rect.width;
    const screenY = event.clientY / rect.height;
    const x = (screenX - 0.5) * 100;
    const y = -(screenY - 0.5) * 100;
    
    this.onClick({ x, y, z: 0, screenX, screenY });
  };

  private handleRightClick = (event: MouseEvent) => {
    event.preventDefault(); // Prevent context menu
    if (!this.onRightClick) return;
    
    const rect = this.container.getBoundingClientRect();
    const screenX = event.clientX / rect.width;
    const screenY = event.clientY / rect.height;
    const x = (screenX - 0.5) * 100;
    const y = -(screenY - 0.5) * 100;
    
    this.onRightClick({ x, y, z: 0, screenX, screenY });
  };

  public cleanup() {
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('click', this.handleClick);
    this.container.removeEventListener('contextmenu', this.handleRightClick);
    console.log('🧹 MouseTracker cleaned up');
  }

  public isReady(): boolean {
    return true;
  }
}