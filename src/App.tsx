import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThreeScene } from './lib/ThreeScene';
import { PerformanceMonitor } from './components/PerformanceMonitor';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  const [particleCount, setParticleCount] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 Initializing Three.js...');

    // Create Three.js scene
    const threeScene = new ThreeScene(containerRef.current);
    sceneRef.current = threeScene;

    // Create test particle
    const particleSystem = threeScene.getParticleSystem();
    if (particleSystem) {
      particleSystem.createTestParticle();
      setParticleCount(particleSystem.getParticleCount());
    }

    // Start animation loop
    threeScene.animate();

    // Cleanup on unmount
    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="app">
      <div className="canvas-container" ref={containerRef}>
        {/* Three.js canvas will be inserted here */}
      </div>
      
      {/* Info overlay */}
      <div className="info-overlay">
        <p>ParticleHands - Animation Test</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Watch the particle move and bounce! ✨
        </p>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;