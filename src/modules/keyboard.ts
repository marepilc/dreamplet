export class Keyboard {
    /**
     * Returns `true` if any key is pressed.
     */
    public keyIsPressed: boolean
    /**
     * Returns `true` if *Alt* is pressed.
     */
    public altIsPressed: boolean
    /**
     * Returns `true` if *Shift* is pressed.
     */
    public shiftIsPressed: boolean
    /**
     * Returns `true` if *Ctrl* is pressed.
     */
    public ctrlIsPressed: boolean
    /**
     * Returns currently pressed key or `null` if no key is pressed.
     */
    public keyPressed: string | null
    /**
     * This function may be defined by user
     */
    public keyDown: ((key: string) => void) | null
    /**
     * This function may be defined by user
     */
    public keyUp: ((key: string) => void) | null
    private _canvas: HTMLCanvasElement

    /**
     *
     * @param canvas HTML5 Canvas element with the visualization.
     */
    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this.keyIsPressed = false
        this.altIsPressed = false
        this.shiftIsPressed = false
        this.ctrlIsPressed = false
        this.keyPressed = null
        this.keyDown = null
        this.keyUp = null
        this._canvas.tabIndex = 1 // to make it focusable
        this._canvas.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keyIsPressed = true
            if (e.key === 'Alt') this.altIsPressed = true
            if (e.key === 'Shift') this.shiftIsPressed = true
            if (e.key === 'Control') this.ctrlIsPressed = true
            this.keyPressed = e.key
            if (this.keyDown != null) {
                this.keyDown(e.key)
            }
        })
        this._canvas.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keyIsPressed = false
            if (e.key === 'Alt') this.altIsPressed = false
            if (e.key === 'Shift') this.shiftIsPressed = false
            if (e.key === 'Control') this.ctrlIsPressed = false
            this.keyPressed = null
            if (this.keyUp != null) {
                this.keyUp(e.key)
            }
        })
    }
}
