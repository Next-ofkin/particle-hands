import * as THREE from 'three';
import type { Particle, Vector3 } from '../types/particle';
import type { Hand3DPosition } from '../types/gesture';
import { ShapeGenerator } from './ShapeGenerator';
import { ColorThemes, type ThemeName } from './ColorThemes';

type ShapeMode = 'free' | 'sphere' | 'cube' | 'helix' | 'ring' | 'heart';

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
  private displayCount: number = 1000;
  private attractionPoint: THREE.Vector3 | null = null;
  private isAttracting: boolean = false;
  private currentShape: ShapeMode = 'free';
  private targetPositions: Vector3[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🌈 ADVANCED NANOBOT System - Shape Formation Ready');
  }

  private noise(x: number, y: number, z: number): number {
    return Math.sin(x * 0.5 + this.time * 0.3) * 
           Math.cos(y * 0.5 + this.time * 0.2) * 
           Math.sin(z * 0.3 + this.time * 0.15);
  }

  private getRandomColor(): THREE.Color {
    const hue = Math.random();
    const saturation = 0.75 + Math.random() * 0.25;
    const lightness = 0.55 + Math.random() * 0.25;
    return new THREE.Color().setHSL(hue, saturation, lightness);
  }

  public createMegaParticles(actualCount: number = 1000) {
    console.log(`🌈 Creating SHAPE-FORMING nanobots...`);

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

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(actualCount * 3);
    this.colors = new Float32Array(actualCount * 3);
    this.sizes = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      const particle = this.particles[i];
      const color = new THREE.Color(particle.color);
      
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;

      this.colors[i * 3] = color.r;
      this.colors[i * 3 + 1] = color.g;
      this.colors[i * 3 + 2] = color.b;

      this.sizes[i] = particle.size;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 1.2,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      depthTest: true,
    });

    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleMesh);

    console.log(`✅ Shape-forming nanobots ready!`);
  }

  // Form a shape at specific position
  public formShape(shape: ShapeMode, centerPosition?: { x: number; y: number; z: number }) {
    this.currentShape = shape;
    
    if (shape === 'free') {
      this.targetPositions = [];
      console.log('🌊 Released to free flow');
      return;
    }

    const count = this.particles.length;
    let positions: Vector3[] = [];
    
    switch (shape) {
      case 'sphere':
        positions = ShapeGenerator.generateSphere(count);
        console.log('🔵 Forming SPHERE');
        break;
      case 'cube':
        positions = ShapeGenerator.generateCube(count);
        console.log('🟦 Forming CUBE');
        break;
      case 'helix':
        positions = ShapeGenerator.generateHelix(count);
        console.log('🧬 Forming HELIX');
        break;
      case 'ring':
        positions = ShapeGenerator.generateRing(count);
        console.log('💍 Forming RING');
        break;
      case 'heart':
        positions = ShapeGenerator.generateHeart(count);
        console.log('❤️ Forming HEART');
        break;
    }
    
    // Offset positions to center location if provided
    if (centerPosition) {
      this.targetPositions = positions.map(pos => ({
        x: pos.x + centerPosition.x,
        y: pos.y + centerPosition.y,
        z: pos.z + centerPosition.z,
      }));
    } else {
      this.targetPositions = positions;
    }
  }

  // Change color theme
  public changeTheme(theme: ThemeName) {
    const colorTheme = ColorThemes.getTheme(theme);
    
    console.log(`🎨 Changing theme to: ${colorTheme.displayName} ${colorTheme.emoji}`);
    
    // Update all particle colors
    for (let i = 0; i < this.particles.length; i++) {
      const newColor = colorTheme.getColor();
      this.particles[i].color = `#${newColor.getHexString()}`;
      
      // Update color buffer
      if (this.colors) {
        this.colors[i * 3] = newColor.r;
        this.colors[i * 3 + 1] = newColor.g;
        this.colors[i * 3 + 2] = newColor.b;
      }
    }
    
    // Update geometry colors
    if (this.geometry && this.colors) {
      this.geometry.attributes.color.needsUpdate = true;
    }
  }

  public setAttractionPoint(position: Hand3DPosition | null) {
    if (position) {
      this.attractionPoint = new THREE.Vector3(position.x, position.y, position.z);
      this.isAttracting = true;
    } else {
      this.isAttracting = false;
    }
  }

  public update() {
    if (this.particles.length === 0 || !this.positions) return;

    this.time += 0.012;
    const boundary = 60;
    const isForming = this.currentShape !== 'free';

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Ambient noise (reduced when forming shapes)
      const noiseScale = 0.018;
      const noiseStrength = isForming ? 0.02 : (this.isAttracting ? 0.03 : 0.08);
      
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

      // SHAPE FORMATION (highest priority)
      if (isForming && this.targetPositions[i]) {
        const target = this.targetPositions[i];
        const dx = target.x - particle.position.x;
        const dy = target.y - particle.position.y;
        const dz = target.z - particle.position.z;
        
        const shapeStrength = 0.12; // Strong pull to shape
        
        particle.velocity.x += dx * shapeStrength;
        particle.velocity.y += dy * shapeStrength;
        particle.velocity.z += dz * shapeStrength;
      }
      // MOUSE ATTRACTION (when not forming shape)
      else if (this.isAttracting && this.attractionPoint && !isForming) {
        const dx = this.attractionPoint.x - particle.position.x;
        const dy = this.attractionPoint.y - particle.position.y;
        const dz = this.attractionPoint.z - particle.position.z;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Separation from other particles
        let separationForceX = 0;
        let separationForceY = 0;
        let separationForceZ = 0;
        
        const separationDistance = 3;
        const separationStrength = 0.08;
        
        for (let j = 0; j < this.particles.length; j++) {
          if (i === j) continue;
          
          const other = this.particles[j];
          const odx = particle.position.x - other.position.x;
          const ody = particle.position.y - other.position.y;
          const odz = particle.position.z - other.position.z;
          const oDist = Math.sqrt(odx * odx + ody * ody + odz * odz);
          
          if (oDist < separationDistance && oDist > 0) {
            const pushForce = (separationDistance - oDist) / separationDistance;
            separationForceX += (odx / oDist) * pushForce * separationStrength;
            separationForceY += (ody / oDist) * pushForce * separationStrength;
            separationForceZ += (odz / oDist) * pushForce * separationStrength;
          }
        }
        
        particle.velocity.x += separationForceX;
        particle.velocity.y += separationForceY;
        particle.velocity.z += separationForceZ;
        
        const attractionStrength = 0.08;
        const safeDistance = 15;
        
        if (distance > safeDistance) {
          const forceX = (dx / distance) * attractionStrength;
          const forceY = (dy / distance) * attractionStrength;
          const forceZ = (dz / distance) * attractionStrength;
          
          particle.velocity.x += forceX;
          particle.velocity.y += forceY;
          particle.velocity.z += forceZ;
        } else {
          const orbitStrength = 0.05;
          const perpX = -dy / distance;
          const perpY = dx / distance;
          
          particle.velocity.x += perpX * orbitStrength;
          particle.velocity.y += perpY * orbitStrength;
        }
      }

      // Speed limit
      const maxSpeed = 2.5;
      const speed = Math.sqrt(
        particle.velocity.x * particle.velocity.x +
        particle.velocity.y * particle.velocity.y +
        particle.velocity.z * particle.velocity.z
      );
      
      if (speed > maxSpeed) {
        particle.velocity.x = (particle.velocity.x / speed) * maxSpeed;
        particle.velocity.y = (particle.velocity.y / speed) * maxSpeed;
        particle.velocity.z = (particle.velocity.z / speed) * maxSpeed;
      }

      // Damping
      const damping = 0.96;
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;
      particle.velocity.z *= damping;

      // Update position
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Boundaries (looser when forming shapes)
      const pushStrength = isForming ? 0.01 : 0.025;
      const shapeBoundary = isForming ? 80 : boundary;
      
      if (Math.abs(particle.position.x) > shapeBoundary) {
        particle.velocity.x -= Math.sign(particle.position.x) * pushStrength;
      }
      if (Math.abs(particle.position.y) > shapeBoundary) {
        particle.velocity.y -= Math.sign(particle.position.y) * pushStrength;
      }
      if (Math.abs(particle.position.z) > 20) {
        particle.velocity.z -= Math.sign(particle.position.z) * pushStrength;
      }

      // Update buffer
      this.positions[i * 3] = particle.position.x;
      this.positions[i * 3 + 1] = particle.position.y;
      this.positions[i * 3 + 2] = particle.position.z;
    }

    if (this.geometry) {
      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  public getCurrentShape(): ShapeMode {
    return this.currentShape;
  }

  public getParticleCount(): number {
    return this.displayCount;
  }

  public cleanup() {
    if (this.particleMesh) this.scene.remove(this.particleMesh);
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    console.log('🧹 Shape-forming system cleaned up');
  }
}