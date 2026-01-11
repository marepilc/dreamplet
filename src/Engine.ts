import { CanvasKit, Surface } from 'canvaskit-wasm'
import { loadCanvasKit } from './loader'
import gsap from 'gsap'
import { Primitive } from './primitives'

export interface EngineOptions {
  canvas: HTMLCanvasElement
  width?: number
  height?: number
}

export class Engine {
  private ck!: CanvasKit
  private surface!: Surface
  private readonly canvas: HTMLCanvasElement
  private dpr: number = window.devicePixelRatio || 1
  private isDirty: boolean = true
  private primitives: Primitive[] = []

  constructor(canvasId: string)
  constructor(options: EngineOptions)
  constructor(optionsOrId: EngineOptions | string) {
    if (typeof optionsOrId === 'string') {
      const canvas = document.getElementById(optionsOrId) as HTMLCanvasElement
      if (!canvas) {
        throw new Error(`Canvas element with id "${optionsOrId}" not found`)
      }
      this.canvas = canvas
    } else {
      this.canvas = optionsOrId.canvas
      if (optionsOrId.width) {
        this.canvas.width = optionsOrId.width * this.dpr
        this.canvas.style.width = `${optionsOrId.width}px`
      }
      if (optionsOrId.height) {
        this.canvas.height = optionsOrId.height * this.dpr
        this.canvas.style.height = `${optionsOrId.height}px`
      }
    }

    this.dpr = window.devicePixelRatio || 1

    // GSAP integration: observe property changes if possible or just use the ticker
    // For now, we'll mark dirty on every tick if there's any GSAP activity,
    // but a better way is to proxy properties.
  }

  async init() {
    this.ck = await loadCanvasKit()
    this.handleResize()

    this.setupResizeHandler()
    this.startRenderLoop()
  }

  private updateSurface() {
    if (this.surface) {
      this.surface.delete()
    }
    this.surface = this.ck.MakeCanvasSurface(this.canvas)!
    if (!this.surface) {
      throw new Error('Could not create Skia surface')
    }
  }

  add(primitive: Primitive) {
    this.primitives.push(primitive)
    this.markDirty()
  }

  private setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.handleResize()
    })
  }

  private handleResize() {
    this.dpr = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()
    const width = rect.width || window.innerWidth
    const height = rect.height || window.innerHeight

    this.canvas.width = Math.round(width * this.dpr)
    this.canvas.height = Math.round(height * this.dpr)
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.updateSurface()
    this.markDirty()
  }

  markDirty() {
    this.isDirty = true
  }

  private startRenderLoop() {
    gsap.ticker.add(() => {
      // If there are any active tweens, we should redraw.
      if (gsap.globalTimeline.getChildren(false, true, false).length > 0) {
        this.markDirty()
      }

      if (this.isDirty) {
        this.render()
        this.isDirty = false
      }
    })
  }

  private render() {
    const canvas = this.surface.getCanvas()
    if (!canvas) return

    canvas.clear(this.ck.TRANSPARENT)
    canvas.save()
    canvas.scale(this.dpr, this.dpr)

    for (const primitive of this.primitives) {
      primitive.draw(canvas)
    }

    canvas.restore()
    this.surface.flush()
  }
}
