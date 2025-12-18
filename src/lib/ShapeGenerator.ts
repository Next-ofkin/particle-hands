import type { Vector3 } from '../types/particle';

export class ShapeGenerator {
  // Generate sphere positions
  public static generateSphere(count: number, radius: number = 30): Vector3[] {
    const positions: Vector3[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);

      positions.push({ x, y, z });
    }

    return positions;
  }

  // Generate cube positions
  public static generateCube(count: number, size: number = 50): Vector3[] {
    const positions: Vector3[] = [];
    const particlesPerEdge = Math.ceil(Math.cbrt(count));
    const spacing = size / particlesPerEdge;
    const offset = size / 2;

    for (let i = 0; i < count; i++) {
      const x = ((i % particlesPerEdge) * spacing) - offset;
      const y = (Math.floor((i / particlesPerEdge) % particlesPerEdge) * spacing) - offset;
      const z = (Math.floor(i / (particlesPerEdge * particlesPerEdge)) * spacing) - offset;

      positions.push({ x, y, z });
    }

    return positions;
  }

  // Generate helix (DNA spiral)
  public static generateHelix(count: number, radius: number = 20, height: number = 60): Vector3[] {
    const positions: Vector3[] = [];
    const turns = 3; // Number of spiral turns

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns;
      
      const x = radius * Math.cos(angle);
      const y = (t - 0.5) * height; // Center vertically
      const z = radius * Math.sin(angle);

      positions.push({ x, y, z });
    }

    return positions;
  }

  // Generate ring/torus
  public static generateRing(count: number, majorRadius: number = 30, minorRadius: number = 10): Vector3[] {
    const positions: Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2;
      const v = ((i * 13) % count / count) * Math.PI * 2; // Varied minor angle
      
      const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
      const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
      const z = minorRadius * Math.sin(v);

      positions.push({ x, y, z });
    }

    return positions;
  }

  // Generate heart shape
  public static generateHeart(count: number, scale: number = 20): Vector3[] {
    const positions: Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      
      // Parametric heart equation
      const x = scale * 16 * Math.pow(Math.sin(t), 3);
      const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const z = scale * Math.sin(t) * Math.cos(t) * 3; // Add 3D depth

      positions.push({ x: x / 16, y: y / 16, z: z / 16 });
    }

    return positions;
  }
}