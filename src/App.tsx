import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThreeScene } from './lib/ThreeScene';
import { MouseTracker } from './lib/MouseTracker';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import type { Hand3DPosition } from './types/gesture';
import type { ThemeName } from './lib/ColorThemes';

type ShapeType = 'sphere' | 'cube' | 'helix' | 'ring' | 'heart';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  const mouseTrackerRef = useRef<MouseTracker | null>(null);
  const [particleCount, setParticleCount] = useState<number>(0);
  const [currentShape, setCurrentShape] = useState<string>('Free Flow');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('sphere');
  const [currentTheme, setCurrentTheme] = useState<string>('Rainbow 🌈');
  const [showControls, setShowControls] = useState<boolean>(true);
  const shapeIndexRef = useRef<number>(0);
  const themeIndexRef = useRef<number>(0);

  const shapeNames = {
    sphere: 'Sphere 🔵',
    cube: 'Cube 🟦',
    helix: 'Helix 🧬',
    ring: 'Ring 💍',
    heart: 'Heart ❤️',
  };

  const shapes: ShapeType[] = ['sphere', 'cube', 'helix', 'ring', 'heart'];
  
  const themes: ThemeName[] = ['rainbow', 'fire', 'ocean', 'matrix', 'sunset', 'monochrome'];
  const themeNames = {
    rainbow: 'Rainbow 🌈',
    fire: 'Fire 🔥',
    ocean: 'Ocean 🌊',
    matrix: 'Matrix 💚',
    sunset: 'Sunset 🌅',
    monochrome: 'Monochrome ⚪',
  };

  // Handle shape selection from buttons
  const handleShapeSelect = (shape: ShapeType) => {
    const ps = sceneRef.current?.getParticleSystem();
    if (!ps) return;
    
    setSelectedShape(shape);
    ps.formShape(shape);
    setCurrentShape(shapeNames[shape]);
  };

  // Handle theme cycling
  const handleThemeCycle = () => {
    const ps = sceneRef.current?.getParticleSystem();
    if (!ps) return;
    
    themeIndexRef.current = (themeIndexRef.current + 1) % themes.length;
    const nextTheme = themes[themeIndexRef.current];
    ps.changeTheme(nextTheme);
    setCurrentTheme(themeNames[nextTheme]);
  };

  // Handle free flow
  const handleFreeFlow = () => {
    const ps = sceneRef.current?.getParticleSystem();
    if (!ps) return;
    
    ps.formShape('free');
    setCurrentShape('Free Flow 🌊');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 Initializing MOBILE-READY System...');

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
        if (particleSystem) {
          particleSystem.setAttractionPoint(position);
        }
      },
      () => {
        if (particleSystem) {
          particleSystem.setAttractionPoint(null);
        }
      },
      (position: Hand3DPosition) => {
        const ps = sceneRef.current?.getParticleSystem();
        if (!ps) return;
        
        ps.formShape(selectedShape, { x: position.x, y: position.y, z: position.z });
        setCurrentShape(shapeNames[selectedShape]);
      },
      (position: Hand3DPosition) => {
        const ps = sceneRef.current?.getParticleSystem();
        if (!ps) return;
        
        shapeIndexRef.current = (shapeIndexRef.current + 1) % shapes.length;
        const nextShape = shapes[shapeIndexRef.current];
        setSelectedShape(nextShape);
        
        ps.formShape(nextShape, { x: position.x, y: position.y, z: position.z });
        setCurrentShape(shapeNames[nextShape]);
      }
    );

    // Keyboard controls (still work on desktop)
    const handleKeyPress = (e: KeyboardEvent) => {
      const ps = sceneRef.current?.getParticleSystem();
      if (!ps) return;

      switch (e.key) {
        case '1':
          handleShapeSelect('sphere');
          break;
        case '2':
          handleShapeSelect('cube');
          break;
        case '3':
          handleShapeSelect('helix');
          break;
        case '4':
          handleShapeSelect('ring');
          break;
        case '5':
          handleShapeSelect('heart');
          break;
        case '0':
          handleFreeFlow();
          break;
        case 'c':
        case 'C':
          handleThemeCycle();
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
  }, [selectedShape]);

  return (
    <div className="app">
      <div className="canvas-container" ref={containerRef} />
      
      {/* Top Info */}
      <div className="info-overlay">
        <p>ParticleHands ✨</p>
        <p style={{ 
          fontSize: '13px', 
          marginTop: '8px', 
          color: '#6366F1',
          fontWeight: 600 
        }}>
          {currentShape}
        </p>
        <p style={{ 
          fontSize: '11px', 
          marginTop: '4px', 
          color: '#F59E0B',
          opacity: 0.8
        }}>
          {currentTheme}
        </p>
      </div>

      {/* Toggle Controls Button (Mobile) */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showControls ? '✕' : '☰'}
      </button>

      {/* Mobile Control Panel */}
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '16px',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1000,
          maxWidth: '90vw',
          width: 'auto',
        }}>
          {/* Shape Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => handleShapeSelect('sphere')}
              style={{
                background: selectedShape === 'sphere' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              🔵 Sphere
            </button>
            <button
              onClick={() => handleShapeSelect('cube')}
              style={{
                background: selectedShape === 'cube' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              🟦 Cube
            </button>
            <button
              onClick={() => handleShapeSelect('helix')}
              style={{
                background: selectedShape === 'helix' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              🧬 Helix
            </button>
            <button
              onClick={() => handleShapeSelect('ring')}
              style={{
                background: selectedShape === 'ring' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              💍 Ring
            </button>
            <button
              onClick={() => handleShapeSelect('heart')}
              style={{
                background: selectedShape === 'heart' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              ❤️ Heart
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleThemeCycle}
              style={{
                background: 'rgba(245, 158, 11, 0.8)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                flex: 1,
              }}
            >
              🎨 Theme
            </button>
            <button
              onClick={handleFreeFlow}
              style={{
                background: 'rgba(16, 185, 129, 0.8)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                flex: 1,
              }}
            >
              🌊 Free Flow
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: '12px',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
          }}>
            Tap anywhere to form selected shape
          </div>
        </div>
      )}

      {/* Desktop Controls (hidden on mobile) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        display: window.innerWidth > 768 ? 'block' : 'none',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '6px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Desktop Controls:
        </div>
        <div>🖱️ Left Click: Form {shapeNames[selectedShape]}</div>
        <div style={{ marginTop: '4px' }}>🖱️ Right Click: Cycle shapes</div>
        <div style={{ marginTop: '4px' }}>⌨️ 1-5: Select shape • 0: Free flow</div>
        <div style={{ marginTop: '4px', color: '#F59E0B' }}>⌨️ C: Cycle color themes</div>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;