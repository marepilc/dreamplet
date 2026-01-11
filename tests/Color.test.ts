import { describe, it, expect, vi } from 'vitest';
import { Rect } from '../src';

// Mock CanvasKit but allow real color logic
vi.mock('../src/loader', () => {
  const mockCK = {
    parseColorString: vi.fn((color: string) => {
      // Simulate Skia's failure for oklch (returning black)
      if (color.startsWith('oklch')) return new Float32Array([0, 0, 0, 1]);
      return new Float32Array([1, 1, 1, 1]); // default white for others
    }),
    Paint: vi.fn(() => ({
      setColor: vi.fn(),
      setAntiAlias: vi.fn(),
      delete: vi.fn(),
    })),
    LTRBRect: vi.fn(),
  };
  return {
    getCanvasKit: () => mockCK,
    loadCanvasKit: async () => mockCK,
  };
});

describe('Color Parsing', () => {
  it('should support oklch colors using internal converter', () => {
    const oklchColor = 'oklch(0.597 0.225 7.805)';
    
    const rect = new Rect(0, 0, 100, 100, oklchColor);
    const color = (rect as any).parseColor(oklchColor);
    
    // oklch(0.597 0.225 7.805)
    // Non-zero values confirm it's not black
    expect(color[0]).toBeGreaterThan(0.5);
    expect(color[1]).toBeGreaterThan(0);
    expect(color[2]).toBeGreaterThan(0);
    expect(color[3]).toBe(1.0); // alpha
  });

  it('should support oklch colors with alpha', () => {
    const oklchColor = 'oklch(0.597 0.225 7.805 / 0.5)';
    const rect = new Rect(0, 0, 100, 100, oklchColor);
    const color = (rect as any).parseColor(oklchColor);
    
    expect(color[3]).toBe(0.5);
  });

  it('should fallback to CanvasKit for non-oklch colors', () => {
    const hexColor = '#ff0000';
    const rect = new Rect(0, 0, 100, 100, hexColor);
    const color = (rect as any).parseColor(hexColor);
    
    expect(color).toEqual(new Float32Array([1, 1, 1, 1])); // Our mock returns white for non-oklch
  });
});
