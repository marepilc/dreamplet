import { Vector, abs, round } from './math'

export class Mouse {
    private _canvas: HTMLCanvasElement
    private _x: number
    private _y: number
    private _px: number
    private _py: number
    private readonly _pos: Vector
    private readonly _ppos: Vector
    /**
     * Returns `true` if any of the mouse buttons is pressed.
     */
    public isPressed: boolean
    /**
     *  Returns button number.
     */
    public button: number | null
    /**
     * This function may be defined by user
     */
    public wheel: ((e: WheelEvent) => void) | null
    /**
     * This function may be defined by user
     */
    public down: ((e: MouseEvent) => void) | null
    /**
     * This function may be defined by user
     */
    public up: ((e: MouseEvent) => void) | null
    /**
     * This function may be defined by user
     */
    public click: ((e: MouseEvent) => void) | null
    /**
     * This function may be defined by user
     */
    public dblClick: ((e: MouseEvent) => void) | null
    /**
     * This function may be defined by user
     */
    public move: (() => void) | null
    /**
     * This function may be defined by user
     */
    public enter: (() => void) | null
    /**
     * This function may be defined by user
     */
    public leave: (() => void) | null

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this._x = 0
        this._y = 0
        this._px = 0
        this._py = 0
        this._pos = new Vector(0, 0)
        this._ppos = new Vector(0, 0)
        this.isPressed = false
        this.button = null
        this.wheel = null
        this.down = null
        this.up = null
        this.click = null
        this.dblClick = null
        this.move = null
        this.enter = null
        this.leave = null

        this._canvas.addEventListener('mousemove', (e: MouseEvent) => {
            this._updateMousePos(canvas, e)
            if (this.move) this.move()
        })
        this._canvas.addEventListener('wheel', (e: WheelEvent) => {
            this._updateMousePos(canvas, e)
            if (this.wheel != null) {
                this.wheel(e)
            }
        })
        this._canvas.addEventListener(
            'mousedown',
            (e: MouseEvent) => {
                this.isPressed = true
                this.button = e.button
                if (this.down != null) {
                    this.down(e)
                }
            },
            false
        )
        this._canvas.addEventListener(
            'mouseup',
            (e: MouseEvent) => {
                this.isPressed = false
                this.button = null
                if (this.up != null) {
                    this.up(e)
                }
            },
            false
        )
        this._canvas.addEventListener(
            'click',
            (e: MouseEvent) => {
                if (this.click != null) {
                    this.click(e)
                }
            },
            false
        )
        this._canvas.addEventListener(
            'dblclick',
            (e: MouseEvent) => {
                if (this.dblClick != null) {
                    this.dblClick(e)
                }
            },
            false
        )
        this._canvas.addEventListener('mouseenter', () => {
            if (typeof this.enter === 'function') this.enter()
        })
        this._canvas.addEventListener('mouseleave', () => {
            if (typeof this.leave === 'function') this.leave()
        })
    }

    private _updateMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        this._px = this._x
        this._py = this._y
        this._ppos.set(this._px, this._py)
        let bbox = canvas.getBoundingClientRect()
        this._x = abs(round(e.clientX - bbox.left))
        this._y = abs(round(e.clientY - bbox.top))
        this._pos.set(this._x, this._y)
    }

    /**
     * Current mouse `X` position.
     */
    get x() {
        return this._x
    }

    /**
     * Current mouse `Y` position.
     */
    get y() {
        return this._y
    }

    /**
     * Previous mouse `X` position.
     */
    get px() {
        return this._px
    }

    /**
     * Previous mouse `Y` position.
     */
    get py() {
        return this._py
    }

    get pos() {
        return this._pos
    }

    get ppos() {
        return this._ppos
    }
}
