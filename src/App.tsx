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
      
      {/* Minimal Top Info */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.9)',
        zIndex: 999,
      }}>
        <div style={{ fontWeight: 600 }}>{currentShape}</div>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>{currentTheme}</div>
      </div>

      {/* Compact Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          width: '36px',
          height: '36px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showControls ? '✕' : '☰'}
      </button>

      {/* Sleek Bottom Control Bar */}
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(20px)',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {/* Compact Shape Pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '8px',
            justifyContent: 'space-between',
          }}>
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleShapeSelect(shape)}
                style={{
                  background: selectedShape === shape 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9))' 
                    : 'rgba(255, 255, 255, 0.08)',
                  border: selectedShape === shape 
                    ? '1px solid rgba(99, 102, 241, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {shape === 'sphere' && '🔵'}
                {shape === 'cube' && '🟦'}
                {shape === 'helix' && '🧬'}
                {shape === 'ring' && '💍'}
                {shape === 'heart' && '❤️'}
              </button>
            ))}
          </div>

          {/* Compact Action Row */}
          <div style={{
            display: 'flex',
            gap: '6px',
          }}>
            <button
              onClick={handleThemeCycle}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              🎨
            </button>
            <button
              onClick={handleFreeFlow}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              🌊 Free Flow
            </button>
          </div>
        </div>
      )}

      {/* Desktop Controls (hidden on mobile) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        display: window.innerWidth > 768 ? 'block' : 'none',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '6px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Desktop Controls:
        </div>
        <div>🖱️ Click: Form • Right-click: Cycle</div>
        <div style={{ marginTop: '4px' }}>⌨️ 1-5: Shapes • 0: Free • C: Theme</div>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;