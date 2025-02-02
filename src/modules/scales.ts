// Linear Scale
export function linearScale(domain: [number, number], range: [number, number]) {
    const [d0, d1] = domain
    const [r0, r1] = range
    return (value: number) => ((value - d0) / (d1 - d0)) * (r1 - r0) + r0
}

// Band Scale
export function bandScale(
    domain: string[],
    range: [number, number],
    padding: number = 0.1
) {
    const [r0, r1] = range
    const step = (r1 - r0) / (domain.length + padding * (domain.length - 1))
    const bandWidth = step * (1 - padding)

    const scale = (value: string) => {
        const index = domain.indexOf(value)
        return index !== -1 ? r0 + index * (step + padding * step) : undefined
    }

    scale.bandwidth = () => bandWidth
    return scale
}

// Point Scale
export function pointScale(
    domain: string[],
    range: [number, number],
    padding: number = 0.5
) {
    const [r0, r1] = range
    const step = (r1 - r0) / (domain.length - 1 + padding * 2)

    return (value: string) => {
        const index = domain.indexOf(value)
        return index !== -1 ? r0 + step * (index + padding) : undefined
    }
}

// Ordinal Scale
export function ordinalScale(domain: string[], range: any[]) {
    const map = new Map(domain.map((d, i) => [d, range[i % range.length]]))
    return (value: string) => map.get(value)
}
