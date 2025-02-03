import { Vector, round } from './math'

export class Mouse {
    private _canvas: HTMLCanvasElement
    private _x: number
    private _y: number
    private _px: number
    private _py: number
    private readonly _pos: Vector
    private readonly _ppos: Vector

    public isPressed: boolean
    public button: number | null
    public wheel: ((e: WheelEvent) => void) | null
    public down: ((e: MouseEvent) => void) | null
    public up: ((e: MouseEvent) => void) | null
    public click: ((e: MouseEvent) => void) | null
    public dblClick: ((e: MouseEvent) => void) | null
    public move: ((e: MouseEvent) => void) | null
    public enter: ((e: MouseEvent) => void) | null
    public leave: ((e: MouseEvent) => void) | null

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

        this._bindEvents()
    }

    private _bindEvents() {
        this._canvas.addEventListener('mousemove', this._onMouseMove)
        this._canvas.addEventListener('wheel', this._onWheel)
        this._canvas.addEventListener('mousedown', this._onMouseDown)
        this._canvas.addEventListener('mouseup', this._onMouseUp)
        this._canvas.addEventListener('click', this._onClick)
        this._canvas.addEventListener('dblclick', this._onDblClick)
        this._canvas.addEventListener('mouseenter', this._onEnter)
        this._canvas.addEventListener('mouseleave', this._onLeave)
    }

    public destroy() {
        this._canvas.removeEventListener('mousemove', this._onMouseMove)
        this._canvas.removeEventListener('wheel', this._onWheel)
        this._canvas.removeEventListener('mousedown', this._onMouseDown)
        this._canvas.removeEventListener('mouseup', this._onMouseUp)
        this._canvas.removeEventListener('click', this._onClick)
        this._canvas.removeEventListener('dblclick', this._onDblClick)
        this._canvas.removeEventListener('mouseenter', this._onEnter)
        this._canvas.removeEventListener('mouseleave', this._onLeave)
    }

    private _onMouseMove = (e: MouseEvent) => {
        this._updateMousePos(e)
        this.move?.(e)
    }

    private _onWheel = (e: WheelEvent) => {
        this._updateMousePos(e)
        this.wheel?.(e)
    }

    private _onMouseDown = (e: MouseEvent) => {
        this.isPressed = true
        this.button = e.button
        this.down?.(e)
    }

    private _onMouseUp = (e: MouseEvent) => {
        this.isPressed = false
        this.button = null
        this.up?.(e)
    }

    private _onClick = (e: MouseEvent) => {
        this.click?.(e)
    }

    private _onDblClick = (e: MouseEvent) => {
        this.dblClick?.(e)
    }

    private _onEnter = (e: MouseEvent) => {
        this.enter?.(e)
    }

    private _onLeave = (e: MouseEvent) => {
        this.leave?.(e)
    }

    private _updateMousePos(e: MouseEvent | WheelEvent) {
        this._px = this._x
        this._py = this._y
        this._ppos.set(this._px, this._py)

        const bbox = this._canvas.getBoundingClientRect()
        this._x = round(e.clientX - bbox.left)
        this._y = round(e.clientY - bbox.top)
        this._pos.set(this._x, this._y)
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get px() {
        return this._px
    }

    get py() {
        return this._py
    }

    get pos() {
        return this._pos
    }

    get ppos() {
        return this._ppos
    }

    get deltaX() {
        return this._x - this._px
    }

    get deltaY() {
        return this._y - this._py
    }
}
