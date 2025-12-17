// Particle System Types

export interface Vector3 {
    x: number;
    y: number;
    z: number;
  }
  
  export interface Particle {
    position: Vector3;
    velocity: Vector3;
    acceleration: Vector3;
    targetPosition?: Vector3; // Used when forming shapes
    color: string;
    size: number;
    opacity: number;
  }
  
  export interface ParticleSystemConfig {
    particleCount: number;
    boundarySize: number;
    maxSpeed: number;
    attractionStrength: number;
    damping: number;
  }
  
  export type ParticleState = 'idle' | 'attracted' | 'forming' | 'locked';