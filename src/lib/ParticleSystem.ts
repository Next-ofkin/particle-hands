import * as THREE from 'three';
import type { Particle } from '../types/particle';

export class ParticleSystem {
  private particles: Particle[] = [];
  private particleMesh: THREE.Points | null = null;
  private scene: THREE.Scene;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private positions: Float32Array | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🎨 ParticleSystem initialized');
  }

  // Create a single test particle
  public createTestParticle() {
    console.log('✨ Creating test particle...');

    // Create one particle at center with some velocity
    const particle: Particle = {
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0.2, y: 0.1, z: 0 }, // Slightly faster movement
      acceleration: { x: 0, y: 0, z: 0 },
      color: '#F0F0F5',
      size: 1,
      opacity: 1,
    };

    this.particles.push(particle);

    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(3);
    this.positions[0] = particle.position.x;
    this.positions[1] = particle.position.y;
    this.positions[2] = particle.position.z;

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );

    // Optimized material
    this.material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5, // Slightly bigger so it's more visible
      transparent: false, // Disabled for performance
      sizeAttenuation: false, // Disabled for performance
      blending: THREE.NormalBlending, // Changed from Additive for performance
    });

    // Create Points mesh
    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleMesh);

    console.log('✅ Test particle created with optimized settings');
    console.log('📊 Particle count:', this.particles.length);
  }

  public update() {
    if (this.particles.length === 0 || !this.positions) return;

    // Update particle
    const particle = this.particles[0];

    // Update position
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;
    particle.position.z += particle.velocity.z;

    // Boundary check - bounce back if particle goes too far
    const boundary = 40;
    
    if (Math.abs(particle.position.x) > boundary) {
      particle.velocity.x *= -1;
    }
    
    if (Math.abs(particle.position.y) > boundary) {
      particle.velocity.y *= -1;
    }

    // Update geometry positions (direct array access - faster)
    this.positions[0] = particle.position.x;
    this.positions[1] = particle.position.y;
    this.positions[2] = particle.position.z;

    // Tell Three.js the positions have changed
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