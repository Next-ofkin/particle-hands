import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThreeScene } from './lib/ThreeScene';
import { MouseTracker } from './lib/MouseTracker';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import type { Hand3DPosition } from './types/gesture';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  const mouseTrackerRef = useRef<MouseTracker | null>(null);
  const [particleCount, setParticleCount] = useState<number>(0);
  const [mouseActive, setMouseActive] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 Initializing INTERACTIVE Nanobot System...');

    // Create Three.js scene
    const threeScene = new ThreeScene(containerRef.current);
    sceneRef.current = threeScene;

    // Create nanobots
    const particleSystem = threeScene.getParticleSystem();
    if (particleSystem) {
      particleSystem.createMegaParticles(1000);
      setParticleCount(particleSystem.getParticleCount());
    }

    // Start animation
    threeScene.animate();

    // Initialize mouse tracking
    const mouseTracker = new MouseTracker(containerRef.current);
    mouseTrackerRef.current = mouseTracker;

    mouseTracker.initialize(
      (position: Hand3DPosition) => {
        setMouseActive(true);
        // Make particles attracted to mouse!
        if (particleSystem) {
          particleSystem.setAttractionPoint(position);
        }
      },
      () => {
        setMouseActive(false);
        // Release particles when mouse leaves
        if (particleSystem) {
          particleSystem.setAttractionPoint(null);
        }
      }
    );

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
      if (mouseTrackerRef.current) {
        mouseTrackerRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="app">
      <div className="canvas-container" ref={containerRef} />
      
      {/* Info overlay */}
      <div className="info-overlay">
        <p>ParticleHands - Interactive Nanobots 🌈</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Move mouse to attract nanobots!
        </p>
        {mouseActive && (
          <p style={{ 
            fontSize: '14px', 
            marginTop: '8px', 
            color: '#10B981',
            fontWeight: 600 
          }}>
            ✅ Attracting Nanobots!
          </p>
        )}
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;