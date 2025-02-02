export function randomInt(a: number, b: number): number {
    return (
        Math.floor(Math.random() * (Math.max(a, b) - Math.min(a, b) + 1)) +
        Math.min(a, b)
    )
}

export function choose(items: any[]): any {
    return items[randomInt(0, items.length - 1)]
}
