import { Dreamplet } from '../Dreamplet'

export function circle(dpl: Dreamplet, x: number, y: number, radius: number) {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
}

export function line(
    dpl: Dreamplet,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

export function point(dpl: Dreamplet, x: number, y: number): void {
    const ctx = dpl.ctx
    ctx.fillRect(x, y, 1, 1)
}

export function rect(
    dpl: Dreamplet,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor?: string
) {
    const ctx = dpl.ctx
    if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fillRect(x, y, width, height)
    } else {
        ctx.strokeRect(x, y, width, height)
    }
}
