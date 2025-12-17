// Hand Tracking & Gesture Types

export interface HandLandmark {
    x: number;
    y: number;
    z: number;
  }
  
  export interface HandData {
    landmarks: HandLandmark[];
    handedness: 'Left' | 'Right';
    score: number; // Confidence score
  }
  
  export interface Hand3DPosition {
    x: number;
    y: number;
    z: number;
    screenX: number;
    screenY: number;
  }
  
  export type GestureType = 'none' | 'open_palm' | 'pinch' | 'closed_fist';
  
  export interface GestureState {
    currentGesture: GestureType;
    confidence: number;
    handPosition: Hand3DPosition | null;
    isHandDetected: boolean;
  }
  
  export interface GestureDetectorConfig {
    pinchThreshold: number;
    smoothingFactor: number;
    minConfidence: number;
  }