import { round } from './math'

//────────────────────────────────────────────────────────────
// Noise Value Generator (Random Walk)
//────────────────────────────────────────────────────────────
export class Noise {
    private _min: number
    private _max: number
    private _range: number = 0 // Initialized to 0 to satisfy TS2564
    private _value: number

    constructor(min: number, max: number, noiseRange: number) {
        this._min = min
        this._max = max
        // Use the setter to compute _range
        this.noiseRange = noiseRange
        this._value = Math.random() * (max - min) + min
    }

    set min(value: number) {
        if (this._value < value) {
            this._value = value
        }
        this._min = value
        // Optionally update _range based on the new min:
        this._range =
            (this._range / (this._max - this._min)) * (this._max - value)
    }

    set max(value: number) {
        if (this._value > value) {
            this._value = value
        }
        this._max = value
        this._range =
            (this._range / (this._max - this._min)) * (value - this._min)
    }

    set noiseRange(value: number) {
        if (value > 0 && value < 1) {
            this._range = value * (this._max - this._min)
        }
    }

    get value(): number {
        this.nextValue()
        return this._value
    }

    set value(newValue: number) {
        if (newValue >= this._min && newValue <= this._max) {
            this._value = newValue
        }
    }

    get intValue(): number {
        this.nextValue()
        return round(this._value)
    }

    private nextValue(): void {
        let min0 = this._value - this._range / 2
        let max0 = this._value + this._range / 2
        if (min0 < this._min) {
            min0 = this._min
            max0 = min0 + this._range
        } else if (max0 > this._max) {
            max0 = this._max
            min0 = max0 - this._range
        }
        this._value = Math.random() * (max0 - min0) + min0
    }
}

//────────────────────────────────────────────────────────────
// Unified Noise Base Class
// Handles permutation generation, seeding, and helper functions.
//────────────────────────────────────────────────────────────
class NoiseBase {
    protected readonly permutation: number[]

    constructor(seed?: number) {
        this.permutation = this.generatePermutation(seed)
    }

    protected generatePermutation(seed?: number): number[] {
        const p = Array.from({ length: 256 }, (_, i) => i)
        const random =
            seed !== undefined ? this.seededRandom(seed) : Math.random
        for (let i = p.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1))
            ;[p[i], p[j]] = [p[j], p[i]]
        }
        // Duplicate array to avoid overflow in permutation lookups.
        return [...p, ...p]
    }

    protected seededRandom(seed: number): () => number {
        return () => {
            seed = (seed * 16807) % 2147483647
            return (seed - 1) / 2147483646
        }
    }

    protected fade(t: number): number {
        // Fade function as defined by Ken Perlin.
        return t * t * t * (t * (t * 6 - 15) + 10)
    }

    protected lerp(a: number, b: number, t: number): number {
        return a + t * (b - a)
    }
}

//────────────────────────────────────────────────────────────
// Simplex Noise 1D
// Produces values in roughly [-1, 1] (when amplitude is 1)
//────────────────────────────────────────────────────────────
export class SimplexNoise extends NoiseBase {
    // For 1D, the gradient can be either 1 or -1.
    private grad3 = [1, -1]

    constructor(seed?: number) {
        super(seed)
    }

    public noise(
        x: number,
        frequency: number = 1,
        amplitude: number = 1
    ): number {
        x *= frequency
        const i0 = Math.floor(x)
        const i1 = i0 + 1
        const x0 = x - i0
        const x1 = x0 - 1.0

        let t0 = 1.0 - x0 * x0
        let t1 = 1.0 - x1 * x1

        let n0 = 0,
            n1 = 0

        if (t0 > 0) {
            t0 *= t0
            n0 = t0 * t0 * this.grad(this.permutation[i0 & 255], x0)
        }
        if (t1 > 0) {
            t1 *= t1
            n1 = t1 * t1 * this.grad(this.permutation[i1 & 255], x1)
        }

        // rawNoise is roughly in [-1, 1]
        const rawNoise = 0.5 * (n0 + n1)
        // Map [-1, 1] -> [0, 1] then scale by amplitude
        return amplitude * ((rawNoise + 1) / 2)
    }

    private grad(hash: number, x: number): number {
        return this.grad3[hash & 1] * x
    }
}

//────────────────────────────────────────────────────────────
// Simplex Noise 2D
// Produces values in roughly [-1, 1] (when amplitude is 1)
//────────────────────────────────────────────────────────────
export class SimplexNoise2D extends NoiseBase {
    private grad3 = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1], // Duplicated to have 12 entries.
    ]

    private F2 = 0.5 * (Math.sqrt(3.0) - 1.0)
    private G2 = (3.0 - Math.sqrt(3.0)) / 6.0

    constructor(seed?: number) {
        super(seed)
    }

    public noise(
        xin: number,
        yin: number,
        frequency: number = 1,
        amplitude: number = 1
    ): number {
        xin *= frequency
        yin *= frequency

        let n0 = 0,
            n1 = 0,
            n2 = 0

        const s = (xin + yin) * this.F2
        const i = Math.floor(xin + s)
        const j = Math.floor(yin + s)

        const t = (i + j) * this.G2
        const X0 = i - t
        const Y0 = j - t
        const x0 = xin - X0
        const y0 = yin - Y0

        let i1: number, j1: number
        if (x0 > y0) {
            i1 = 1
            j1 = 0
        } else {
            i1 = 0
            j1 = 1
        }

        const x1 = x0 - i1 + this.G2
        const y1 = y0 - j1 + this.G2
        const x2 = x0 - 1.0 + 2.0 * this.G2
        const y2 = y0 - 1.0 + 2.0 * this.G2

        const ii = i & 255
        const jj = j & 255

        const gi0 = this.permutation[ii + this.permutation[jj]] % 12
        const gi1 = this.permutation[ii + i1 + this.permutation[jj + j1]] % 12
        const gi2 = this.permutation[ii + 1 + this.permutation[jj + 1]] % 12

        let t0 = 0.5 - x0 * x0 - y0 * y0
        if (t0 < 0) {
            n0 = 0
        } else {
            t0 *= t0
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0)
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1
        if (t1 < 0) {
            n1 = 0
        } else {
            t1 *= t1
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1)
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2
        if (t2 < 0) {
            n2 = 0
        } else {
            t2 *= t2
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2)
        }

        // rawNoise is roughly in [-1, 1]
        const rawNoise = 70.0 * (n0 + n1 + n2)
        // Map [-1, 1] -> [0, 1] then scale by amplitude
        return amplitude * ((rawNoise + 1) / 2)
    }

    private dot(g: number[], x: number, y: number): number {
        return g[0] * x + g[1] * y
    }
}

//────────────────────────────────────────────────────────────
// Simplex Noise 3D
// Produces values in roughly [-1, 1] (when amplitude is 1)
//────────────────────────────────────────────────────────────
export class SimplexNoise3D extends NoiseBase {
    private grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1],
    ]

    private F3 = 1.0 / 3.0
    private G3 = 1.0 / 6.0

    constructor(seed?: number) {
        super(seed)
    }

    public noise(
        x: number,
        y: number,
        z: number,
        frequency: number = 1,
        amplitude: number = 1
    ): number {
        x *= frequency
        y *= frequency
        z *= frequency

        let n0 = 0,
            n1 = 0,
            n2 = 0,
            n3 = 0

        const s = (x + y + z) * this.F3
        const i = Math.floor(x + s)
        const j = Math.floor(y + s)
        const k = Math.floor(z + s)

        const t = (i + j + k) * this.G3
        const X0 = i - t
        const Y0 = j - t
        const Z0 = k - t
        const x0 = x - X0
        const y0 = y - Y0
        const z0 = z - Z0

        let i1: number, j1: number, k1: number
        let i2: number, j2: number, k2: number
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1
                j1 = 0
                k1 = 0
                i2 = 1
                j2 = 1
                k2 = 0
            } else if (x0 >= z0) {
                i1 = 1
                j1 = 0
                k1 = 0
                i2 = 1
                j2 = 0
                k2 = 1
            } else {
                i1 = 0
                j1 = 0
                k1 = 1
                i2 = 1
                j2 = 0
                k2 = 1
            }
        } else {
            if (y0 < z0) {
                i1 = 0
                j1 = 0
                k1 = 1
                i2 = 0
                j2 = 1
                k2 = 1
            } else if (x0 < z0) {
                i1 = 0
                j1 = 1
                k1 = 0
                i2 = 0
                j2 = 1
                k2 = 1
            } else {
                i1 = 0
                j1 = 1
                k1 = 0
                i2 = 1
                j2 = 1
                k2 = 0
            }
        }

        const x1 = x0 - i1 + this.G3
        const y1 = y0 - j1 + this.G3
        const z1 = z0 - k1 + this.G3
        const x2 = x0 - i2 + 2.0 * this.G3
        const y2 = y0 - j2 + 2.0 * this.G3
        const z2 = z0 - k2 + 2.0 * this.G3
        const x3 = x0 - 1.0 + 3.0 * this.G3
        const y3 = y0 - 1.0 + 3.0 * this.G3
        const z3 = z0 - 1.0 + 3.0 * this.G3

        const ii = i & 255
        const jj = j & 255
        const kk = k & 255

        const gi0 =
            this.permutation[ii + this.permutation[jj + this.permutation[kk]]] %
            12
        const gi1 =
            this.permutation[
                ii + i1 + this.permutation[jj + j1 + this.permutation[kk + k1]]
            ] % 12
        const gi2 =
            this.permutation[
                ii + i2 + this.permutation[jj + j2 + this.permutation[kk + k2]]
            ] % 12
        const gi3 =
            this.permutation[
                ii + 1 + this.permutation[jj + 1 + this.permutation[kk + 1]]
            ] % 12

        let t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0
        if (t0 >= 0) {
            t0 *= t0
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0)
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1
        if (t1 >= 0) {
            t1 *= t1
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1)
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2
        if (t2 >= 0) {
            t2 *= t2
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2)
        }
        let t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3
        if (t3 >= 0) {
            t3 *= t3
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3)
        }

        // rawNoise is roughly in [-1, 1]
        const rawNoise = 32.0 * (n0 + n1 + n2 + n3)
        // Map [-1, 1] -> [0, 1] then scale by amplitude
        return amplitude * ((rawNoise + 1) / 2)
    }

    private dot(g: number[], x: number, y: number, z: number): number {
        return g[0] * x + g[1] * y + g[2] * z
    }
}
