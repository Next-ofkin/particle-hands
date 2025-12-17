// Common Types

export interface AppConfig {
    enableHandTracking: boolean;
    enableAudio: boolean;
    particleCount: number;
    performanceMode: 'high' | 'medium' | 'low';
  }
  
  export interface PerformanceStats {
    fps: number;
    particleCount: number;
    drawCalls: number;
    memoryUsage: number;
  }
  
  export type AppState = 'loading' | 'ready' | 'error' | 'running';
  
  export interface ErrorState {
    hasError: boolean;
    errorMessage: string;
    errorType: 'camera' | 'webgl' | 'tracking' | 'unknown';
  }