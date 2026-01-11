import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Engine } from '../src';
import { Circle } from '../src';

// Mock CanvasKit-related things
vi.mock('../src/loader', () => {
  class MockPaint {
    setColor = vi.fn();
    setAntiAlias = vi.fn();
    delete = vi.fn();
  }
  return {
    loadCanvasKit: vi.fn().mockResolvedValue({
      MakeCanvasSurface: vi.fn().mockReturnValue({
        getCanvas: vi.fn().mockReturnValue({
          clear: vi.fn(),
          save: vi.fn(),
          scale: vi.fn(),
          restore: vi.fn(),
        }),
        flush: vi.fn(),
        delete: vi.fn(),
      }),
      TRANSPARENT: 0,
    }),
    getCanvasKit: vi.fn().mockReturnValue({
      Paint: MockPaint,
      parseColorString: vi.fn().mockReturnValue(new Float32Array([0, 0, 0, 1])),
    }),
  };
});

describe('Engine', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    document.body.innerHTML = '<canvas id="canvas"></canvas>';
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
  });

  it('should initialize with a canvas ID', () => {
    const engine = new Engine('canvas');
    expect(engine).toBeDefined();
  });

  it('should initialize with EngineOptions', () => {
    const engine = new Engine({ canvas });
    expect(engine).toBeDefined();
  });

  it('should throw if canvas ID is not found', () => {
    expect(() => new Engine('non-existent')).toThrow('Canvas element with id "non-existent" not found');
  });

  it('should add primitives', () => {
    const engine = new Engine('canvas');
    const circle = new Circle(100, 100, 50, '#ff0000');
    engine.add(circle);
    // Primitives are private, but we can check if it marks dirty
    const markDirtySpy = vi.spyOn(engine, 'markDirty');
    engine.add(circle);
    expect(markDirtySpy).toHaveBeenCalled();
  });
});
