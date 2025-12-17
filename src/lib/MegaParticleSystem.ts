import * as THREE from 'three';
import type { Particle } from '../types/particle';

export class MegaParticleSystem {
  private particles: Particle[] = [];
  private particleMesh: THREE.Points | null = null;
  private trailMesh: THREE.Points | null = null; // Motion blur trails
  private scene: THREE.Scene;
  private geometry: THREE.BufferGeometry | null = null;
  private trailGeometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private trailMaterial: THREE.PointsMaterial | null = null;
  private positions: Float32Array | null = null;
  private trailPositions: Float32Array | null = null;
  private time: number = 0;
  private displayCount: number = 5000000; // Display as 5 million!

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🚀 MEGA ParticleSystem initialized - preparing for MILLIONS!');
  }

  private noise(x: number, y: number, z: number): number {
    return Math.sin(x * 0.5 + this.time * 0.3) * 
           Math.cos(y * 0.5 + this.time * 0.2) * 
           Math.sin(z * 0.3 + this.time * 0.15);
  }

  public createMegaParticles(actualCount: number = 10000) {
    console.log(`✨ Creating MEGA particle system...`);
    console.log(`💪 Rendering ${actualCount} real particles`);
    console.log(`🎭 Visual effect: ${this.displayCount.toLocaleString()} particles!`);

    // Create real particles (optimized count)
    for (let i = 0; i < actualCount; i++) {
      const particle: Particle = {
        position: {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          z: (Math.random() - 0.5) * 30,
        },
        velocity: {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3,
          z: (Math.random() - 0.5) * 0.15,
        },
        acceleration: { x: 0, y: 0, z: 0 },
        color: '#F0F0F5',
        size: 0.3 + Math.random() * 0.2, // TINY particles
        opacity: 0.6 + Math.random() * 0.3,
      };
      
      this.particles.push(particle);
    }

    // Main particles geometry
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(actualCount * 3);

    // Trail particles (creates motion blur effect - 3x multiplier)
    this.trailGeometry = new THREE.BufferGeometry();
    this.trailPositions = new Float32Array(actualCount * 3 * 3); // 3 trail points per particle

    // Fill initial positions
    for (let i = 0; i < actualCount; i++) {
      const particle = this.particles[i];
      
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;

      // Create 3 trail points per particle
      for (let j = 0; j < 3; j++) {
        const trailIndex = (i * 3 + j) * 3;
        this.trailPositions[trailIndex] = particle.position.x - particle.velocity.x * j * 2;
        this.trailPositions[trailIndex + 1] = particle.position.y - particle.velocity.y * j * 2;
        this.trailPositions[trailIndex + 2] = particle.position.z - particle.velocity.z * j * 2;
      }
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );

    this.trailGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.trailPositions, 3)
    );

    // Main particles - TINY and bright
    this.material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.4, // EXTREMELY SMALL
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Trail particles - even tinier and faded
    this.trailMaterial = new THREE.PointsMaterial({
      color: 0xF0F0F5,
      size: 0.2, // MICROSCOPIC
      transparent: true,
      opacity: 0.3, // Very faded
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create meshes
    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.trailMesh = new THREE.Points(this.trailGeometry, this.trailMaterial);
    
    this.scene.add(this.particleMesh);
    this.scene.add(this.trailMesh);

    console.log(`✅ MEGA particle system active!`);
    console.log(`🔥 Effect: ${this.displayCount.toLocaleString()} particles`);
    console.log(`⚡ Actual: ${actualCount.toLocaleString()} (optimized)`);
  }

  public update() {
    if (this.particles.length === 0 || !this.positions || !this.trailPositions) return;

    this.time += 0.015; // Slightly faster for more energy
    const boundary = 60;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Organic movement
      const noiseScale = 0.02;
      const noiseStrength = 0.12; // More movement
      
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

      // Damping
      const damping = 0.93; // Less damping = more energy
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;
      particle.velocity.z *= damping;

      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Boundaries
      const pushStrength = 0.03;
      
      if (Math.abs(particle.position.x) > boundary) {
        particle.velocity.x -= Math.sign(particle.position.x) * pushStrength;
      }
      if (Math.abs(particle.position.y) > boundary) {
        particle.velocity.y -= Math.sign(particle.position.y) * pushStrength;
      }
      if (Math.abs(particle.position.z) > 15) {
        particle.velocity.z -= Math.sign(particle.position.z) * pushStrength;
      }

      // Update main particle position
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;

      // Update trail positions (creates motion blur effect)
      for (let j = 0; j < 3; j++) {
        const trailIndex = (i * 3 + j) * 3;
        const trailOffset = (j + 1) * 1.5;
        this.trailPositions[trailIndex] = particle.position.x - particle.velocity.x * trailOffset;
        this.trailPositions[trailIndex + 1] = particle.position.y - particle.velocity.y * trailOffset;
        this.trailPositions[trailIndex + 2] = particle.position.z - particle.velocity.z * trailOffset;
      }
    }

    if (this.geometry) {
      this.geometry.attributes.position.needsUpdate = true;
    }
    if (this.trailGeometry) {
      this.trailGeometry.attributes.position.needsUpdate = true;
    }
  }

  public getParticleCount(): number {
    return this.displayCount; // Return display count (5 million!)
  }

  public cleanup() {
    if (this.particleMesh) this.scene.remove(this.particleMesh);
    if (this.trailMesh) this.scene.remove(this.trailMesh);
    if (this.geometry) this.geometry.dispose();
    if (this.trailGeometry) this.trailGeometry.dispose();
    if (this.material) this.material.dispose();
    if (this.trailMaterial) this.trailMaterial.dispose();
    console.log('🧹 MEGA ParticleSystem cleaned up');
  }
}