import { Hands } from '@mediapipe/hands';
import type { Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import type { Hand3DPosition } from '../types/gesture';

export class HandTracker {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private isInitialized: boolean = false;
  private onHandDetected: ((position: Hand3DPosition) => void) | null = null;
  private onHandLost: (() => void) | null = null;

  constructor() {
    console.log('🤚 HandTracker initialized');
  }

  public async initialize(
    onHandDetected: (position: Hand3DPosition) => void,
    onHandLost: () => void
  ): Promise<boolean> {
    try {
      console.log('📹 Requesting camera access...');

      this.onHandDetected = onHandDetected;
      this.onHandLost = onHandLost;

      // Create hidden video element
      this.videoElement = document.createElement('video');
      this.videoElement.style.display = 'none';
      document.body.appendChild(this.videoElement);

      // Initialize MediaPipe Hands
      this.hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      this.hands.setOptions({
        maxNumHands: 1, // Track one hand only
        modelComplexity: 1, // 0=lite, 1=full (we use full for accuracy)
        minDetectionConfidence: 0.7, // 70% confidence minimum
        minTrackingConfidence: 0.5, // 50% tracking confidence
      });

      // Set up results callback
      this.hands.onResults(this.onResults.bind(this));

      // Initialize camera
      this.camera = new Camera(this.videoElement, {
        onFrame: async () => {
          if (this.hands && this.videoElement) {
            await this.hands.send({ image: this.videoElement });
          }
        },
        width: 640,
        height: 480,
      });

      await this.camera.start();

      this.isInitialized = true;
      console.log('✅ Hand tracking initialized successfully!');
      console.log('🤚 Show your hand to the camera!');

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize hand tracking:', error);
      return false;
    }
  }

  private onResults(results: Results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Hand detected!
      const landmarks = results.multiHandLandmarks[0]; // First hand
      
      // Get palm center (landmark 9 = middle of palm)
      const palmCenter = landmarks[9];

      // Convert to 3D position (screen coords to 3D space)
      const hand3DPosition: Hand3DPosition = {
        // Convert from 0-1 range to -50 to 50 range (matches particle boundary)
        x: (palmCenter.x - 0.5) * 100,
        y: -(palmCenter.y - 0.5) * 100, // Invert Y (screen coords are top-down)
        z: -palmCenter.z * 50, // Z depth
        screenX: palmCenter.x,
        screenY: palmCenter.y,
      };

      // Call callback
      if (this.onHandDetected) {
        this.onHandDetected(hand3DPosition);
      }
    } else {
      // No hand detected
      if (this.onHandLost) {
        this.onHandLost();
      }
    }
  }

  public cleanup() {
    if (this.camera) {
      this.camera.stop();
    }
    if (this.videoElement) {
      document.body.removeChild(this.videoElement);
    }
    if (this.hands) {
      this.hands.close();
    }
    console.log('🧹 HandTracker cleaned up');
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}