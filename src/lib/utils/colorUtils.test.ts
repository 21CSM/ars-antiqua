import { describe, it, expect, beforeEach } from 'vitest';
import { getTagColor, getContrastColor } from './colorUtils'; // Adjust the import path as needed

describe('Color Utils', () => {
  beforeEach(() => {
    // Clear the color cache before each test
    (getTagColor as any).colorCache = new Map();
  });

  describe('getTagColor', () => {
    it('should return a valid HSL color string', () => {
      const color = getTagColor('test');
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should return the same color for the same tag', () => {
      const color1 = getTagColor('sameTag');
      const color2 = getTagColor('sameTag');
      expect(color1).toBe(color2);
    });

    it('should return different colors for different tags', () => {
      const color1 = getTagColor('tag1');
      const color2 = getTagColor('tag2');
      expect(color1).not.toBe(color2);
    });

    it('should handle empty string', () => {
      const color = getTagColor('');
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should handle long strings', () => {
      const longTag = 'a'.repeat(1000);
      const color = getTagColor(longTag);
      expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });

    it('should generate colors within the specified ranges', () => {
      const color = getTagColor('test');
      const [hue, saturation, lightness] = color.match(/\d+/g)!.map(Number);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
      expect(saturation).toBeGreaterThanOrEqual(25);
      expect(saturation).toBeLessThanOrEqual(45);
      expect(lightness).toBeGreaterThanOrEqual(85);
      expect(lightness).toBeLessThanOrEqual(95);
    });
  });

  describe('getContrastColor', () => {
    it('should return dark gray for light background', () => {
      const contrastColor = getContrastColor('hsl(0, 0%, 90%)');
      expect(contrastColor).toBe('#4A4A4A');
    });

    it('should return light gray for dark background', () => {
      const contrastColor = getContrastColor('hsl(0, 0%, 20%)');
      expect(contrastColor).toBe('#E0E0E0');
    });

    it('should handle edge case of pure white', () => {
      const contrastColor = getContrastColor('hsl(0, 0%, 100%)');
      expect(contrastColor).toBe('#4A4A4A');
    });

    it('should handle edge case of pure black', () => {
      const contrastColor = getContrastColor('hsl(0, 0%, 0%)');
      expect(contrastColor).toBe('#E0E0E0');
    });

    it('should handle invalid HSL string gracefully', () => {
      const contrastColor = getContrastColor('not a color');
      expect(contrastColor).toBe('#E0E0E0'); // Defaults to light gray for invalid input
    });
  });

  describe('Integration of getTagColor and getContrastColor', () => {
    it('should generate consistent contrast colors for the same tag', () => {
      const tagColor = getTagColor('testTag');
      const contrastColor1 = getContrastColor(tagColor);
      const contrastColor2 = getContrastColor(tagColor);
      expect(contrastColor1).toBe(contrastColor2);
    });

    it('should generate appropriate contrast colors for various tags', () => {
      const tags = ['light', 'dark', 'medium', 'vibrant', 'muted'];
      tags.forEach(tag => {
        const tagColor = getTagColor(tag);
        const contrastColor = getContrastColor(tagColor);
        expect(contrastColor).toMatch(/^#[A-F0-9]{6}$/);
      });
    });
  });
});