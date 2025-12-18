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
  const [mouseActive, setMouseActive] = useState<boolean>(false);
  const [currentShape, setCurrentShape] = useState<string>('Free Flow');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('sphere');
  const [currentTheme, setCurrentTheme] = useState<string>('Rainbow 🌈');
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

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 Initializing THEMED System...');

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

    const handleKeyPress = (e: KeyboardEvent) => {
      const ps = sceneRef.current?.getParticleSystem();
      if (!ps) return;

      switch (e.key) {
        case '1':
          setSelectedShape('sphere');
          ps.formShape('sphere');
          setCurrentShape('Sphere 🔵');
          break;
        case '2':
          setSelectedShape('cube');
          ps.formShape('cube');
          setCurrentShape('Cube 🟦');
          break;
        case '3':
          setSelectedShape('helix');
          ps.formShape('helix');
          setCurrentShape('Helix 🧬');
          break;
        case '4':
          setSelectedShape('ring');
          ps.formShape('ring');
          setCurrentShape('Ring 💍');
          break;
        case '5':
          setSelectedShape('heart');
          ps.formShape('heart');
          setCurrentShape('Heart ❤️');
          break;
        case '0':
          ps.formShape('free');
          setCurrentShape('Free Flow 🌊');
          break;
        case 'c':
        case 'C':
          themeIndexRef.current = (themeIndexRef.current + 1) % themes.length;
          const nextTheme = themes[themeIndexRef.current];
          ps.changeTheme(nextTheme);
          setCurrentTheme(themeNames[nextTheme]);
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
      
      <div className="info-overlay">
        <p>ParticleHands - Color Themes! 🎨</p>
        <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Click: Form • Right-click: Cycle • C: Theme
        </p>
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
          color: '#8B5CF6',
          opacity: 0.8
        }}>
          Selected: {shapeNames[selectedShape]}
        </p>
        <p style={{ 
          fontSize: '11px', 
          marginTop: '4px', 
          color: '#F59E0B',
          opacity: 0.8
        }}>
          Theme: {currentTheme}
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
        <div style={{ fontWeight: 600, marginBottom: '6px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Controls:
        </div>
        <div>🖱️ Left Click: Form {shapeNames[selectedShape]}</div>
        <div style={{ marginTop: '4px' }}>🖱️ Right Click: Cycle shapes</div>
        <div style={{ marginTop: '4px' }}>⌨️ 1-5: Select shape • 0: Free flow</div>
        <div style={{ marginTop: '4px', color: '#F59E0B' }}>⌨️ C: Cycle color themes 🎨</div>
      </div>

      <PerformanceMonitor particleCount={particleCount} />
    </div>
  );
}

export default App;