import * as THREE from 'three';
import { MegaParticleSystem } from './MegaParticleSystem';

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private particleSystem: MegaParticleSystem | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a12);
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1);
    
    this.container.appendChild(this.renderer.domElement);
    
    this.particleSystem = new MegaParticleSystem(this.scene);
    
    window.addEventListener('resize', this.handleResize);
    
    console.log('✅ MEGA Three.js scene initialized');
  }
  
  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  public animate = () => {
    requestAnimationFrame(this.animate);
    
    if (this.particleSystem) {
      this.particleSystem.update();
    }
    
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
  
  public getParticleSystem(): MegaParticleSystem | null {
    return this.particleSystem;
  }
  
  public cleanup() {
    window.removeEventListener('resize', this.handleResize);
    
    if (this.particleSystem) {
      this.particleSystem.cleanup();
    }
    
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    console.log('🧹 MEGA Three.js scene cleaned up');
  }
}