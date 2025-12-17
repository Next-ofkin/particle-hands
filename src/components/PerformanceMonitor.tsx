import { useEffect, useState } from 'react';
import '../styles/PerformanceMonitor.css';

interface PerformanceMonitorProps {
  particleCount?: number;
}

export function PerformanceMonitor({ particleCount = 0 }: PerformanceMonitorProps) {
  const [fps, setFps] = useState<number>(60);
  const [avgFps, setAvgFps] = useState<number>(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsHistory: number[] = [];
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      // Update FPS every 500ms
      if (delta >= 500) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);

        // Track FPS history for average
        fpsHistory.push(currentFps);
        if (fpsHistory.length > 10) {
          fpsHistory.shift(); // Keep only last 10 readings
        }

        // Calculate average
        const avg = Math.round(
          fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
        );
        setAvgFps(avg);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Color based on performance
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return '#10B981'; // Green - excellent
    if (fps >= 40) return '#F59E0B'; // Yellow - okay
    return '#EF4444'; // Red - poor
  };

  return (
    <div className="performance-monitor">
      <div className="perf-row">
        <span className="perf-label">FPS:</span>
        <span className="perf-value" style={{ color: getFpsColor(fps) }}>
          {fps}
        </span>
      </div>
      
      <div className="perf-row">
        <span className="perf-label">Avg:</span>
        <span className="perf-value" style={{ color: getFpsColor(avgFps) }}>
          {avgFps}
        </span>
      </div>
      
      <div className="perf-row">
        <span className="perf-label">Particles:</span>
        <span className="perf-value">
          {particleCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}