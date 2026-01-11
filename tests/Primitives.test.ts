import { describe, it, expect, vi } from 'vitest'
import { Circle, Rect, Path } from '../src'

// Mock CanvasKit-related things
vi.mock('../src/loader', () => {
  class MockPaint {
    setColor = vi.fn()
    setAntiAlias = vi.fn()
    delete = vi.fn()
  }
  return {
    getCanvasKit: vi.fn().mockReturnValue({
      Paint: MockPaint,
      Path: {
        MakeFromSVGString: vi.fn().mockReturnValue({
          delete: vi.fn()
        })
      },
      LTRBRect: vi.fn().mockReturnValue(new Float32Array([0, 0, 100, 100])),
      parseColorString: vi.fn().mockReturnValue(new Float32Array([1, 0, 0, 1]))
    })
  }
})

describe('Primitives', () => {
  const mockCanvas = {
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    restore: vi.fn(),
    drawCircle: vi.fn(),
    drawRect: vi.fn(),
    drawPath: vi.fn()
  }

  it('Circle should draw correctly', () => {
    const circle = new Circle(100, 200, 50, '#ff0000')
    circle.draw(mockCanvas)

    expect(mockCanvas.save).toHaveBeenCalled()
    expect(mockCanvas.translate).toHaveBeenCalledWith(100, 200)
    expect(mockCanvas.drawCircle).toHaveBeenCalledWith(0, 0, 50, expect.anything())
    expect(mockCanvas.restore).toHaveBeenCalled()
  })

  it('Rect should draw correctly', () => {
    const rect = new Rect(10, 20, 100, 200, '#00ff00')
    rect.draw(mockCanvas)

    expect(mockCanvas.save).toHaveBeenCalled()
    expect(mockCanvas.translate).toHaveBeenCalledWith(10, 20)
    expect(mockCanvas.drawRect).toHaveBeenCalled()
    expect(mockCanvas.restore).toHaveBeenCalled()
  })

  it('Path should draw correctly', () => {
    const path = new Path(50, 60, 'M 0 0 L 10 10', '#0000ff')
    path.draw(mockCanvas)

    expect(mockCanvas.save).toHaveBeenCalled()
    expect(mockCanvas.translate).toHaveBeenCalledWith(50, 60)
    expect(mockCanvas.drawPath).toHaveBeenCalled()
    expect(mockCanvas.restore).toHaveBeenCalled()
  })
})
