export class Keyboard {
    public keyIsPressed: boolean
    public altIsPressed: boolean
    public shiftIsPressed: boolean
    public ctrlIsPressed: boolean
    public keyPressed: string | null

    public keyDown: ((key: string) => void) | null
    public keyUp: ((key: string) => void) | null

    private _canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this.keyIsPressed = false
        this.altIsPressed = false
        this.shiftIsPressed = false
        this.ctrlIsPressed = false
        this.keyPressed = null
        this.keyDown = null
        this.keyUp = null

        this._canvas.tabIndex = 1
        this._bindEvents()
        this._focusCanvas()
    }

    private _bindEvents() {
        this._canvas.addEventListener('keydown', this._onKeyDown)
        this._canvas.addEventListener('keyup', this._onKeyUp)
    }

    private _focusCanvas() {
        this._canvas.focus()
    }

    public destroy() {
        this._canvas.removeEventListener('keydown', this._onKeyDown)
        this._canvas.removeEventListener('keyup', this._onKeyUp)
    }

    private _onKeyDown = (e: KeyboardEvent) => {
        this.keyIsPressed = true
        this._updateModifierKeys(e, true)
        this.keyPressed = e.key
        this.keyDown?.(e.key)
    }

    private _onKeyUp = (e: KeyboardEvent) => {
        this.keyIsPressed = false
        this._updateModifierKeys(e, false)
        this.keyPressed = null
        this.keyUp?.(e.key)
    }

    private _updateModifierKeys(e: KeyboardEvent, isPressed: boolean) {
        if (e.key === 'Alt') this.altIsPressed = isPressed
        if (e.key === 'Shift') this.shiftIsPressed = isPressed
        if (e.key === 'Control') this.ctrlIsPressed = isPressed
    }
}
