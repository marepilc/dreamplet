import { color2rgba } from './modules/colors'

export interface DreampletOptions {
    canvas?: HTMLCanvasElement
    container?: HTMLElement
    width?: number
    height?: number
}

export class Dreamplet {
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public assets: { [key: string]: any } = {}
    public width: number
    public height: number
    public preloader?: () => Promise<void>
    public setup?: () => void
    public draw?: () => void
    public fps: number = 60
    public still: boolean = false
    private _currentFrame: number = 0
    private _currentFill: string | CanvasGradient = 'gray'
    private _currentStroke: string = 'black'
    private _withFill: boolean = true
    private _withStroke: boolean = true

    // Internal variables for loop control
    private _running: boolean = false
    private _frameInterval: number = 1000 / this.fps
    private _lastTime: number = 0

    constructor(options: DreampletOptions = {}) {
        // Use provided canvas or create a new one
        if (options.canvas) {
            this.canvas = options.canvas
        } else {
            this.canvas = document.createElement('canvas')
            // Append the canvas to the provided container, or document body by default.
            ;(options.container || document.body).appendChild(this.canvas)
        }

        // Set dimensions (with defaults)
        this.width = options.width || 400
        this.height = options.height || 400
        this.canvas.width = this.width
        this.canvas.height = this.height

        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Could not get 2D context from canvas.')
        }
        this.ctx = ctx
    }

    public get currentFrame(): number {
        return this._currentFrame
    }

    public get currentFill(): string | CanvasGradient {
        return this._currentFill
    }

    public set currentFill(value: string | CanvasGradient) {
        this._currentFill = value
    }

    public get currentStroke(): string {
        return this._currentStroke
    }

    public set currentStroke(value: string) {
        this._currentStroke = value
    }

    public get withFill(): boolean {
        return this._withFill
    }

    public set withFill(value: boolean) {
        this._withFill = value
    }

    public get withStroke(): boolean {
        return this._withStroke
    }

    public set withStroke(value: boolean) {
        this._withStroke = value
    }

    /**
     * Optionally update the frame rate.
     * @param fps - Desired frames per second.
     */
    public setFrameRate(fps: number) {
        this.fps = fps
        this._frameInterval = 1000 / fps
    }

    /**
     * Start the sketch. This method is asynchronous so it can wait
     * for preloading to finish before running setup and draw.
     */
    public async start() {
        if (this.preloader) {
            await this.preloader()
        }
        if (this.setup) {
            this.setup()
        }
        this._running = true
        // If still is true, call draw once and don't start the loop.
        if (this.still) {
            if (this.draw) {
                this.draw()
            }
        } else {
            requestAnimationFrame((time) => this.loop(time))
        }
    }

    public stop() {
        this._running = false
    }

    /**
     * The main loop, throttled to update only when enough time has passed.
     * If the still property is true, the loop halts after one draw.
     * @param currentTime - The timestamp provided by requestAnimationFrame.
     */
    private loop(currentTime: number) {
        if (!this._running) return
        if (!this._lastTime) {
            this._lastTime = currentTime
        }
        const elapsed = currentTime - this._lastTime
        if (elapsed >= this._frameInterval) {
            if (this.draw) {
                this.draw()
            }
            this._lastTime = currentTime
            // If still is true, stop running after one draw.
            if (this.still) {
                this._running = false
                return
            }
        }
        this._currentFrame++
        requestAnimationFrame((time) => this.loop(time))
    }

    // drawing

    public clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    public background(
        c: number[] | string | number | CanvasGradient,
        alpha: number = 1
    ): void {
        if (
            Array.isArray(c) ||
            typeof c === 'string' ||
            typeof c === 'number'
        ) {
            this.ctx.fillStyle = color2rgba(c, alpha)
        } else {
            this.ctx.fillStyle = c
        }
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    public save() {
        this.ctx.save()
    }

    public restore() {
        this.ctx.restore()
    }

    public translate(x: number, y: number) {
        this.ctx.translate(x, y)
    }

    public rotate(angle: number) {
        this.ctx.rotate(angle)
    }

    public scale(x: number, y: number) {
        this.ctx.scale(x, y)
    }

    public fill(
        c: number[] | string | number | CanvasGradient,
        alpha: number = 1
    ): void {
        if (
            Array.isArray(c) ||
            typeof c === 'string' ||
            typeof c === 'number'
        ) {
            this.ctx.fillStyle = color2rgba(c, alpha)
            this._currentFill = this.ctx.fillStyle
        } else {
            this.ctx.fillStyle = c
            this._currentFill = c
        }
        this._withFill = true
    }

    public noFill(): void {
        this.ctx.fillStyle = 'transparent'
        this._withFill = false
    }

    public stroke(c: number[] | string | number, alpha: number = 1): void {
        this.ctx.strokeStyle = color2rgba(c, alpha)
        this._currentStroke = this.ctx.strokeStyle
        this._withStroke = true
    }

    public noStroke(): void {
        this.ctx.strokeStyle = 'transparent'
        this._withStroke = false
    }

    public lineWidth(width: number): void {
        this.ctx.lineWidth = width
    }

    public lineCap(style: CanvasLineCap): void {
        this.ctx.lineCap = style
    }
    // aliases
    public strokeWeight = this.lineWidth
    public strokeCap = this.lineCap

    public lineJoin(style: CanvasLineJoin, miterValue: number = 10): void {
        if (style === 'miter') {
            this.ctx.miterLimit = miterValue
        }
        this.ctx.lineJoin = style
    }

    public dashLine(dash: number[] = [5, 5], offset: number = 0): void {
        this.ctx.setLineDash(dash)
        this.ctx.lineDashOffset = offset
    }

    public solidLine(): void {
        this.ctx.setLineDash([])
    }

    public shadow(
        color: number[] | string | number,
        blur: number,
        offsetX: number,
        offsetY: number,
        alpha: number = 1
    ): void {
        this.ctx.shadowColor = color2rgba(color, alpha)
        this.ctx.shadowBlur = blur
        this.ctx.shadowOffsetX = offsetX
        this.ctx.shadowOffsetY = offsetY
    }

    public clearShadow(): void {
        this.ctx.shadowColor = 'transparent'
        this.ctx.shadowBlur = 0
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
    }
}
