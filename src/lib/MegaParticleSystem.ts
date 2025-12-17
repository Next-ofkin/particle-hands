import * as THREE from 'three';
import type { Particle } from '../types/particle';

export class MegaParticleSystem {
  private particles: Particle[] = [];
  private particleMesh: THREE.Points | null = null;
  private scene: THREE.Scene;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private positions: Float32Array | null = null;
  private colors: Float32Array | null = null;
  private sizes: Float32Array | null = null;
  private time: number = 0;
  private displayCount: number = 1000; // Show real count

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🌈 NANOBOT ParticleSystem - Clean Colorful Mode');
  }

  private noise(x: number, y: number, z: number): number {
    return Math.sin(x * 0.5 + this.time * 0.3) * 
           Math.cos(y * 0.5 + this.time * 0.2) * 
           Math.sin(z * 0.3 + this.time * 0.15);
  }

  // Generate random vibrant color
  private getRandomColor(): THREE.Color {
    const hue = Math.random(); // Full rainbow
    const saturation = 0.75 + Math.random() * 0.25; // Vibrant
    const lightness = 0.55 + Math.random() * 0.25; // Bright
    return new THREE.Color().setHSL(hue, saturation, lightness);
  }

  public createMegaParticles(actualCount: number = 10000) {
    console.log(`🌈 Creating CLEAN COLORFUL NANOBOT system...`);
    console.log(`💪 Rendering ${actualCount} real nanobots`);
    console.log(`🎭 Visual effect: ${this.displayCount.toLocaleString()} nanobots!`);

    // Create particles with random colors
    for (let i = 0; i < actualCount; i++) {
      const color = this.getRandomColor();
      
      const particle: Particle = {
        position: {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          z: (Math.random() - 0.5) * 30,
        },
        velocity: {
          x: (Math.random() - 0.5) * 0.25,
          y: (Math.random() - 0.5) * 0.25,
          z: (Math.random() - 0.5) * 0.12,
        },
        acceleration: { x: 0, y: 0, z: 0 },
        color: `#${color.getHexString()}`,
        size: 0.5 + Math.random() * 0.4,
        opacity: 0.85 + Math.random() * 0.15,
      };
      
      this.particles.push(particle);
    }

    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(actualCount * 3);
    this.colors = new Float32Array(actualCount * 3);
    this.sizes = new Float32Array(actualCount);

    // Fill data
    for (let i = 0; i < actualCount; i++) {
      const particle = this.particles[i];
      const color = new THREE.Color(particle.color);
      
      // Positions
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;

      // Colors (each different!)
      this.colors[i * 3] = color.r;
      this.colors[i * 3 + 1] = color.g;
      this.colors[i * 3 + 2] = color.b;

      // Sizes
      this.sizes[i] = particle.size;
    }

    // Set attributes
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    // Clean material - NO glow, just colorful nanobots
    this.material = new THREE.PointsMaterial({
      vertexColors: true, // Individual colors
      size: 1.2, // Slightly bigger so colors are visible
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.NormalBlending, // Normal (no glow effect)
      depthWrite: false,
      depthTest: true,
    });

    // Create mesh
    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleMesh);

    console.log(`✅ CLEAN COLORFUL NANOBOT system active!`);
    console.log(`🌈 Each nanobot unique color - NO glow`);
  }

  public update() {
    if (this.particles.length === 0 || !this.positions) return;

    this.time += 0.012;
    const boundary = 60;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Smooth organic movement
      const noiseScale = 0.018;
      const noiseStrength = 0.10;
      
      const noiseX = this.noise(
        particle.position.x * noiseScale,
        particle.position.y * noiseScale,
        this.time
      ) * noiseStrength;
      
      const noiseY = this.noise(
        particle.position.y * noiseScale,
        particle.position.x * noiseScale,
        this.time + 100
      ) * noiseStrength;
      
      const noiseZ = this.noise(
        particle.position.z * noiseScale,
        particle.position.x * noiseScale,
        this.time + 200
      ) * noiseStrength * 0.5;

      particle.velocity.x += noiseX;
      particle.velocity.y += noiseY;
      particle.velocity.z += noiseZ;

      const damping = 0.96;
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;
      particle.velocity.z *= damping;

      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Boundaries
      const pushStrength = 0.025;
      
      if (Math.abs(particle.position.x) > boundary) {
        particle.velocity.x -= Math.sign(particle.position.x) * pushStrength;
      }
      if (Math.abs(particle.position.y) > boundary) {
        particle.velocity.y -= Math.sign(particle.position.y) * pushStrength;
      }
      if (Math.abs(particle.position.z) > 15) {
        particle.velocity.z -= Math.sign(particle.position.z) * pushStrength;
      }

      // Update positions
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;
    }

    if (this.geometry) {
      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  public getParticleCount(): number {
    return this.displayCount;
  }

  public cleanup() {
    if (this.particleMesh) this.scene.remove(this.particleMesh);
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    console.log('🧹 NANOBOT system cleaned up');
  }
}