import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private particleSystem: ParticleSystem | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a12); // Simple color instead of gradient
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer with optimized settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // Disabled for better performance
      alpha: false,
      powerPreference: 'high-performance',
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1); // Lock to 1x for performance
    
    // Add canvas to container
    this.container.appendChild(this.renderer.domElement);
    
    // Initialize particle system
    this.particleSystem = new ParticleSystem(this.scene);
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize);
    
    console.log('✅ Three.js scene initialized (performance mode)');
    console.log('📷 Camera position:', this.camera.position);
  }
  
  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  public animate = () => {
    requestAnimationFrame(this.animate);
    
    // Update particle system
    if (this.particleSystem) {
      this.particleSystem.update();
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  };
  
  public getScene(): THREE.Scene {
    return this.scene;
  }
  
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }
  
  public getParticleSystem(): ParticleSystem | null {
    return this.particleSystem;
  }
  
  public cleanup() {
    window.removeEventListener('resize', this.handleResize);
    
    if (this.particleSystem) {
      this.particleSystem.cleanup();
    }
    
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    console.log('🧹 Three.js scene cleaned up');
  }
}