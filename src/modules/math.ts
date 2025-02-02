export function constrain(v: number, l1: number, l2: number): number {
    if (v < Math.min(l1, l2)) {
        return Math.min(l1, l2)
    } else if (v > Math.max(l1, l2)) {
        return Math.max(l1, l2)
    } else {
        return v
    }
}
