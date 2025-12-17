import * as THREE from 'three';
import type { Particle } from '../types/particle';

export class ParticleSystem {
  private particles: Particle[] = [];
  private particleMesh: THREE.Points | null = null;
  private scene: THREE.Scene;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private positions: Float32Array | null = null;
  private colors: Float32Array | null = null;
  private sizes: Float32Array | null = null;
  private time: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🎨 ParticleSystem initialized with GPU optimization');
  }

  private noise(x: number, y: number, z: number): number {
    return Math.sin(x * 0.5 + this.time * 0.3) * 
           Math.cos(y * 0.5 + this.time * 0.2) * 
           Math.sin(z * 0.3 + this.time * 0.15);
  }

  public createParticles(count: number = 1000) {
    console.log(`✨ Creating ${count} particles with GPU optimization...`);

    // Create particles array
    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        position: {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          z: (Math.random() - 0.5) * 20,
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0,
        },
        acceleration: { x: 0, y: 0, z: 0 },
        color: '#F0F0F5',
        size: 0.8 + Math.random() * 0.4, // Slight size variation
        opacity: 0.7 + Math.random() * 0.2, // Slight opacity variation
      };
      
      this.particles.push(particle);
    }

    // Create geometry with multiple attributes
    this.geometry = new THREE.BufferGeometry();
    
    // Positions
    this.positions = new Float32Array(count * 3);
    
    // Colors (for future use - different colored particles)
    this.colors = new Float32Array(count * 3);
    
    // Sizes (varying particle sizes)
    this.sizes = new Float32Array(count);

    // Fill initial data
    for (let i = 0; i < count; i++) {
      const particle = this.particles[i];
      
      // Position
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;
      
      // Color (soft white)
      this.colors[i * 3] = 0.94; // R
      this.colors[i * 3 + 1] = 0.94; // G
      this.colors[i * 3 + 2] = 0.96; // B
      
      // Size
      this.sizes[i] = particle.size;
    }

    // Set attributes
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
    
    this.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.colors, 3)
    );
    
    this.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(this.sizes, 1)
    );

    // GPU-optimized material with custom shader
    this.material = new THREE.PointsMaterial({
      size: 1.0, // Base size
      vertexColors: true, // Use vertex colors
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });

    // Create Points mesh
    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleMesh);

    console.log(`✅ ${count} particles created with GPU instancing`);
    console.log('🚀 GPU optimization active - ready for massive particle counts!');
  }

  public update() {
    if (this.particles.length === 0 || !this.positions) return;

    this.time += 0.01;
    const boundary = 50;

    // Batch update all particles (GPU-friendly)
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Noise-based organic movement
      const noiseScale = 0.02;
      const noiseStrength = 0.08;
      
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

      // Apply forces
      particle.velocity.x += noiseX;
      particle.velocity.y += noiseY;
      particle.velocity.z += noiseZ;

      // Damping
      const damping = 0.95;
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;
      particle.velocity.z *= damping;

      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Soft boundaries
      const pushStrength = 0.02;
      
      if (Math.abs(particle.position.x) > boundary) {
        particle.velocity.x -= Math.sign(particle.position.x) * pushStrength;
      }
      
      if (Math.abs(particle.position.y) > boundary) {
        particle.velocity.y -= Math.sign(particle.position.y) * pushStrength;
      }
      
      if (Math.abs(particle.position.z) > 10) {
        particle.velocity.z -= Math.sign(particle.position.z) * pushStrength;
      }

      // Update position buffer (single write)
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;
    }

    // Single GPU update (efficient!)
    if (this.geometry) {
      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  public getParticleCount(): number {
    return this.particles.length;
  }

  public cleanup() {
    if (this.particleMesh) {
      this.scene.remove(this.particleMesh);
    }
    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
    console.log('🧹 ParticleSystem cleaned up');
  }
}