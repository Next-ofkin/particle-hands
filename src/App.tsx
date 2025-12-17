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

    console.log('🚀 Initializing Rainbow Nanobot System...');

    const threeScene = new ThreeScene(containerRef.current);
    sceneRef.current = threeScene;

    // Create nanobots - reduced count for visibility
    const particleSystem = threeScene.getParticleSystem();
    if (particleSystem) {
      particleSystem.createMegaParticles(1000); // 2000 visible nanobots!
      setParticleCount(particleSystem.getParticleCount());
    }

    threeScene.animate();

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="app">
      <div className="canvas-container" ref={containerRef} />
      
      <div className="info-overlay">
        <p>ParticleHands - Rainbow Nanobots 🌈</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Colorful nanobots • Clean & visible ✨
        </p>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;