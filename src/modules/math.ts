import { number2str } from './utils'

export type SDevMethod = 'sample' | 'population'

export function constrain(v: number, l1: number, l2: number): number {
    if (v < Math.min(l1, l2)) {
        return Math.min(l1, l2)
    } else if (v > Math.max(l1, l2)) {
        return Math.max(l1, l2)
    } else {
        return v
    }
}

export function round(v: number, decimal?: number): number {
    // round
    if (decimal) {
        let n = 1
        for (let i = 0; i < decimal; i++) {
            n *= 10
        }
        return Math.round(v * n) / n
    } else {
        return Math.round(v)
    }
}

export function round2str(v: number, decimal: number): string {
    let s = number2str(round(v, decimal))
    let ss: string[] = s.split('.')
    let missing0: number
    if (ss.length === 2) {
        missing0 = decimal - ss[1].length
    } else {
        s += '.'
        missing0 = decimal
    }
    for (let i = 0; i < missing0; i++) {
        s += '0'
    }
    return s
}

export let floor: (v: number) => number = Math.floor
export let ceil: (v: number) => number = Math.ceil

export function sq(v: number): number {
    return Math.pow(v, 2)
}

export let pow: (x: number, y: number) => number = Math.pow
export let sqrt: (x: number) => number = Math.sqrt
export let abs: (x: number) => number = Math.abs

export function max(...args: number[]): number {
    return Math.max(...args)
}

export function min(...args: number[]): number {
    return Math.min(...args)
}

export function sum(...args: number[]): number {
    return args.reduce((a, b) => a + b)
}

export function avg(...args: number[]): number {
    return sum(...args) / args.length
}

export function centile(c: number, ...args: number[]): number {
    const dataCopy = args.slice()
    dataCopy.sort((a, b) => a - b)
    const n = dataCopy.length
    const pos = ((n + 1) * c) / 100
    const ix = Math.floor(pos)
    if (ix === 0) {
        return dataCopy[0]
    } else if (ix >= n) {
        return dataCopy[n - 1]
    } else {
        const remainder = pos - ix
        const diff = dataCopy[ix] - dataCopy[ix - 1]
        return dataCopy[ix - 1] + remainder * diff
    }
}

export function revCentile(v: number, ...args: number[]): number {
    const dataCopy = args.slice()
    dataCopy.sort((a, b) => a - b)
    const n = dataCopy.length
    let pos1 = 1
    let pos2 = dataCopy.length
    for (let i = 0; i < n; i++) {
        if (dataCopy[i] < v) {
            pos1++
        } else if (dataCopy[i] > v) {
            pos2 = i
            break
        }
    }
    return (floor(avg(pos1, pos2)) / n) * 100
}

export function iqr(...args: number[]): number {
    const q1 = centile(25, ...args)
    const q3 = centile(75, ...args)
    return q3 - q1
}

export function median(...args: number[]): number {
    return centile(50, ...args)
}

export function dataRange(...args: number[]): number {
    return max(...args) - min(...args)
}

export function stdDev(method: SDevMethod, ...args: number[]): number {
    const n = args.length
    const mean = avg(...args)
    let sum = 0
    for (let i = 0; i < n; i++) {
        sum += sq(args[i] - mean)
    }
    if (method === 'sample') {
        return sqrt(sum / (n - 1))
    } else {
        return sqrt(sum / n)
    }
}

export class Vector {
    private _x: number
    private _y: number

    /**
     * Creates a new 2D vector.
     * @param x
     * @param y
     */
    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    /**
     * Changes the x and y coordinates.
     * @param x New `X` coordinate.
     * @param y New `Y` coordinate.
     */
    public set(x: number, y: number) {
        this._x = x
        this._y = y
    }

    public get x(): number {
        return this._x
    }

    public set x(v: number) {
        this._x = v
    }

    public get y(): number {
        return this._y
    }

    public set y(v: number) {
        this._y = v
    }

    public get xy(): [number, number] {
        return [this._x, this._y]
    }

    /**
     * Returns duplicate of the vector.
     */
    public copy(): Vector {
        return new Vector(this._x, this._y)
    }

    /**
     * Add another vector and returns result (calling vector remains unchanged.)
     * @param v
     */
    public add(v: Vector): Vector {
        return new Vector(this._x + v.x, this._y + v.y)
    }

    /**
     * Modifies vector by adding another one.
     * @param v
     */
    public add2(v: Vector): void {
        this._x += v.x
        this._y += v.y
    }

    /**
     * Subtracts another vector and returns result (calling vector remains unchanged.)
     * @param v
     */
    public sub(v: Vector): Vector {
        return new Vector(this._x - v.x, this._y - v.y)
    }

    /**
     * Modifies vector by subtracting another one.
     * @param v
     */
    public sub2(v: Vector): void {
        this._x -= v.x
        this._y -= v.y
    }

    /**
     * Multiplies vector by scalar and returns result (calling vector remains unchanged.)
     * @param s
     */
    public mult(s: number): Vector {
        return new Vector(this._x * s, this._y * s)
    }

    /**
     * Modifies vector by multiplying by scalar.
     * @param s
     */
    public mult2(s: number): void {
        this._x *= s
        this._y *= s
    }

    /**
     * Divides vector by scalar and returns result (calling vector remains unchanged.)
     * @param s
     */
    public div(s: number): Vector {
        return new Vector(this._x / s, this._y / s)
    }

    /**
     * Modifies vector by dividing by scalar.
     * @param s
     */
    public div2(s: number): void {
        this._x /= s
        this._y /= s
    }

    /**
     * Returns the dot product of two vectors.
     * @param v
     */
    public dot(v: Vector): number {
        // dot product of two vectors
        return this._x * v.x + this._y * v.y
    }

    /**
     * Normalizes the vector and return as a new one (calling vector remains unchanged.)
     */
    public norm(): Vector {
        let e1 = this._x / Math.sqrt(this._x * this._x + this.y * this.y)
        let e2 = this._y / Math.sqrt(this._x * this._x + this._y * this._y)
        return new Vector(e1, e2)
    }

    /**
     * Normalizes the vector.
     */
    public norm2(): void {
        let e1 = this._x / Math.sqrt(this._x * this._x + this._y * this._y)
        let e2 = this._y / Math.sqrt(this._x * this._x + this._y * this._y)
        this._x = e1
        this._y = e2
    }

    get direction(): number {
        return Math.atan2(this._y, this._x)
    }

    set direction(angle: number) {
        let magnitude = this.magnitude
        this._x = Math.cos(angle) * magnitude
        this._y = Math.sin(angle) * magnitude
    }

    get magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    }

    set magnitude(magnitude: number) {
        let direction = this.direction
        this._x = Math.cos(direction) * magnitude
        this._y = Math.sin(direction) * magnitude
    }

    /**
     * Limits the vector's magnitude.
     * @param limitScalar
     */
    public limit(limitScalar: number) {
        if (this.magnitude > limitScalar) {
            let direction = this.direction
            this._x = Math.cos(direction) * limitScalar
            this._y = Math.sin(direction) * limitScalar
        }
    }
}

export const E = Math.E
export const PI = Math.PI
export const TWO_PI = Math.PI * 2
export const HALF_PI = Math.PI / 2
export const PHI = (1 + Math.sqrt(5)) / 2
export const sin = Math.sin
export const cos = Math.cos
export const tan = Math.tan
export const asin = Math.asin
export const acos = Math.acos
export const atan = Math.atan
export const atan2 = Math.atan2

export function dist(x1: number, y1: number, x2: number, y2: number): number {
    return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))
}
