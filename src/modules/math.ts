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
