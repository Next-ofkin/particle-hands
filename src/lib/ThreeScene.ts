import * as THREE from 'three';
import { MegaParticleSystem } from './MegaParticleSystem';

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particleSystem: MegaParticleSystem | null = null;
  private animationId: number | null = null;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Adjust camera distance based on screen size
    const isMobile = window.innerWidth < 768;
    this.camera.position.z = isMobile ? 120 : 80; // Zoom out more on mobile

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.particleSystem = new MegaParticleSystem(this.scene);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    window.addEventListener('resize', () => this.onWindowResize(container));

    console.log('✨ ThreeScene initialized with mobile support');
  }

  private onWindowResize(container: HTMLElement) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    // Update camera position on resize
    const isMobile = window.innerWidth < 768;
    this.camera.position.z = isMobile ? 120 : 80;
  }

  public animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.particleSystem) {
      this.particleSystem.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  public getParticleSystem(): MegaParticleSystem | null {
    return this.particleSystem;
  }

  public cleanup() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.particleSystem) {
      this.particleSystem.cleanup();
    }
    
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize);
    
    console.log('🧹 ThreeScene cleaned up');
  }
}