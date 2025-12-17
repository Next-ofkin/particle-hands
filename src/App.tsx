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

    console.log('🚀 Initializing MEGA Particle System...');

    const threeScene = new ThreeScene(containerRef.current);
    sceneRef.current = threeScene;

    // Create MEGA particles!
    const particleSystem = threeScene.getParticleSystem();
    if (particleSystem) {
      particleSystem.createMegaParticles(10000); // 10k real, looks like 5 million!
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
        <p>ParticleHands - MEGA MODE 🔥</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          The impossible made possible ✨
        </p>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;