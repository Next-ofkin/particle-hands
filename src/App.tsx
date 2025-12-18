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
  const [currentShape, setCurrentShape] = useState<string>('Free Flow');

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 Initializing SHAPE-FORMING System...');

    const threeScene = new ThreeScene(containerRef.current);
    sceneRef.current = threeScene;

    const particleSystem = threeScene.getParticleSystem();
    if (particleSystem) {
      particleSystem.createMegaParticles(1000);
      setParticleCount(particleSystem.getParticleCount());
    }

    threeScene.animate();

    const mouseTracker = new MouseTracker(containerRef.current);
    mouseTrackerRef.current = mouseTracker;

    mouseTracker.initialize(
      (position: Hand3DPosition) => {
        setMouseActive(true);
        if (particleSystem) {
          particleSystem.setAttractionPoint(position);
        }
      },
      () => {
        setMouseActive(false);
        if (particleSystem) {
          particleSystem.setAttractionPoint(null);
        }
      }
    );

    // Keyboard controls for shapes
    const handleKeyPress = (e: KeyboardEvent) => {
      const ps = sceneRef.current?.getParticleSystem();
      if (!ps) return;

      switch (e.key) {
        case '1':
          ps.formShape('sphere');
          setCurrentShape('Sphere 🔵');
          break;
        case '2':
          ps.formShape('cube');
          setCurrentShape('Cube 🟦');
          break;
        case '3':
          ps.formShape('helix');
          setCurrentShape('Helix 🧬');
          break;
        case '4':
          ps.formShape('ring');
          setCurrentShape('Ring 💍');
          break;
        case '5':
          ps.formShape('heart');
          setCurrentShape('Heart ❤️');
          break;
        case '0':
          ps.formShape('free');
          setCurrentShape('Free Flow 🌊');
          break;
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
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
      
      <div className="info-overlay">
        <p>ParticleHands - Shape Formation ✨</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Press 1-5 for shapes • 0 to release
        </p>
        <p style={{ 
          fontSize: '13px', 
          marginTop: '8px', 
          color: '#6366F1',
          fontWeight: 600 
        }}>
          {currentShape}
        </p>
        {mouseActive && (
          <p style={{ 
            fontSize: '12px', 
            marginTop: '6px', 
            color: '#10B981',
            opacity: 0.8
          }}>
            Mouse active
          </p>
        )}
      </div>

      {/* Shape controls hint */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
      }}>
        <div>1: Sphere 🔵 • 2: Cube 🟦 • 3: Helix 🧬</div>
        <div style={{ marginTop: '4px' }}>4: Ring 💍 • 5: Heart ❤️ • 0: Free 🌊</div>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;