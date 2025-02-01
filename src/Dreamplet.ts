export interface DreampletOptions {
    canvas?: HTMLCanvasElement
    container?: HTMLElement
    width?: number
    height?: number
}

export class Dreamplet {
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public width: number
    public height: number
    // Optional asset preloader function
    public preloader?: () => Promise<void>
    public setup?: () => void
    public draw?: () => void
    // Desired frames per second (default is 60)
    public fps: number = 60

    // Internal variables for fps control
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
        // Start the loop with an initial timestamp.
        requestAnimationFrame((time) => this.loop(time))
    }

    public stop() {
        this._running = false
    }

    /**
     * The main loop is throttled to update only when enough time has passed.
     * @param currentTime - The timestamp provided by requestAnimationFrame.
     */
    private loop(currentTime: number) {
        if (!this._running) return

        // If _lastTime is not set yet, initialize it with the current time.
        if (!this._lastTime) {
            this._lastTime = currentTime
        }

        const elapsed = currentTime - this._lastTime
        if (elapsed >= this._frameInterval) {
            // Call the draw function only if it's time for the next frame.
            if (this.draw) {
                this.draw()
            }
            // Update the last frame time.
            this._lastTime = currentTime
        }
        requestAnimationFrame((time) => this.loop(time))
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    public background(color: string) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    // Example helper method: draw a circle
    public circle(x: number, y: number, radius: number) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, radius, 0, Math.PI * 2)
        this.ctx.fill()
    }

    // Additional drawing helper methods can be added here...
}
