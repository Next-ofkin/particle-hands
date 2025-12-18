import * as THREE from 'three';

export type ThemeName = 'rainbow' | 'fire' | 'ocean' | 'matrix' | 'sunset' | 'monochrome';

export interface ColorTheme {
  name: string;
  displayName: string;
  emoji: string;
  getColor: () => THREE.Color;
}

export class ColorThemes {
  // Rainbow theme (original)
  public static rainbow: ColorTheme = {
    name: 'rainbow',
    displayName: 'Rainbow',
    emoji: '🌈',
    getColor: () => {
      const hue = Math.random();
      const saturation = 0.75 + Math.random() * 0.25;
      const lightness = 0.55 + Math.random() * 0.25;
      return new THREE.Color().setHSL(hue, saturation, lightness);
    }
  };

  // Fire theme (red, orange, yellow)
  public static fire: ColorTheme = {
    name: 'fire',
    displayName: 'Fire',
    emoji: '🔥',
    getColor: () => {
      const hue = Math.random() * 0.15; // 0-0.15 = red to yellow
      const saturation = 0.85 + Math.random() * 0.15;
      const lightness = 0.50 + Math.random() * 0.30;
      return new THREE.Color().setHSL(hue, saturation, lightness);
    }
  };

  // Ocean theme (blue, cyan, aqua)
  public static ocean: ColorTheme = {
    name: 'ocean',
    displayName: 'Ocean',
    emoji: '🌊',
    getColor: () => {
      const hue = 0.50 + Math.random() * 0.20; // 0.5-0.7 = cyan to blue
      const saturation = 0.70 + Math.random() * 0.30;
      const lightness = 0.50 + Math.random() * 0.30;
      return new THREE.Color().setHSL(hue, saturation, lightness);
    }
  };

  // Matrix theme (green shades)
  public static matrix: ColorTheme = {
    name: 'matrix',
    displayName: 'Matrix',
    emoji: '💚',
    getColor: () => {
      const hue = 0.33; // Green
      const saturation = 0.70 + Math.random() * 0.30;
      const lightness = 0.40 + Math.random() * 0.40;
      return new THREE.Color().setHSL(hue, saturation, lightness);
    }
  };

  // Sunset theme (pink, purple, orange)
  public static sunset: ColorTheme = {
    name: 'sunset',
    displayName: 'Sunset',
    emoji: '🌅',
    getColor: () => {
      const ranges = [
        { min: 0.85, max: 1.0 },  // Pink to red
        { min: 0.05, max: 0.15 }, // Orange to yellow
        { min: 0.75, max: 0.85 }, // Purple
      ];
      const range = ranges[Math.floor(Math.random() * ranges.length)];
      const hue = range.min + Math.random() * (range.max - range.min);
      const saturation = 0.75 + Math.random() * 0.25;
      const lightness = 0.55 + Math.random() * 0.25;
      return new THREE.Color().setHSL(hue, saturation, lightness);
    }
  };

  // Monochrome theme (white, gray)
  public static monochrome: ColorTheme = {
    name: 'monochrome',
    displayName: 'Monochrome',
    emoji: '⚪',
    getColor: () => {
      const value = 0.70 + Math.random() * 0.30; // Light grays to white
      return new THREE.Color(value, value, value);
    }
  };

  // Get all themes
  public static getAllThemes(): ColorTheme[] {
    return [
      this.rainbow,
      this.fire,
      this.ocean,
      this.matrix,
      this.sunset,
      this.monochrome,
    ];
  }

  // Get theme by name
  public static getTheme(name: ThemeName): ColorTheme {
    switch (name) {
      case 'rainbow': return this.rainbow;
      case 'fire': return this.fire;
      case 'ocean': return this.ocean;
      case 'matrix': return this.matrix;
      case 'sunset': return this.sunset;
      case 'monochrome': return this.monochrome;
      default: return this.rainbow;
    }
  }
}