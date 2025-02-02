import { Dreamplet } from '../Dreamplet'

export type ImgOrigin =
    | 'left-bottom'
    | 'right-bottom'
    | 'center-bottom'
    | 'left-top'
    | 'right-top'
    | 'center-top'
    | 'left-horizon'
    | 'right-horizon'
    | 'center-horizon'

export function arc(
    dpl: Dreamplet,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise: boolean = false
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    ctx.fill()
}

export function bezier(
    dpl: Dreamplet,
    x1: number,
    y1: number,
    cx1: number,
    cy1: number,
    cx2: number,
    cy2: number,
    x2: number,
    y2: number
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2)
    ctx.stroke()
}

export function ellipse(
    dpl: Dreamplet,
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    angle: number = 0
): void {
    const ctx = dpl.ctx
    if (angle !== 0) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    } else {
        ctx.beginPath()
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
    }
    ctx.fill()
}

export function circle(
    dpl: Dreamplet,
    x: number,
    y: number,
    radius: number
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
}

export function line(
    dpl: Dreamplet,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

export function placeImage(
    dpl: Dreamplet,
    img: HTMLImageElement,
    x: number,
    y: number,
    origin: ImgOrigin = 'center-horizon',
    width?: number,
    height?: number
): void {
    const imgWidth = width ?? img.width // Use provided width or original width
    const imgHeight = height ?? img.height // Use provided height or original height

    let x0 = x
    let y0 = y

    // Horizontal positioning
    if (origin.includes('right')) {
        x0 -= imgWidth
    } else if (origin.includes('center')) {
        x0 -= imgWidth / 2
    }

    // Vertical positioning
    if (origin.includes('bottom')) {
        y0 -= imgHeight
    } else if (origin.includes('horizon')) {
        y0 -= imgHeight / 2
    }

    // Draw the image with or without scaling
    dpl.ctx.drawImage(img, x0, y0, imgWidth, imgHeight)
}

export function point(dpl: Dreamplet, x: number, y: number): void {
    const ctx = dpl.ctx
    ctx.fillRect(x, y, 1, 1)
}

export function polygon(
    dpl: Dreamplet,
    x: number,
    y: number,
    radius: number,
    n: number
): void {
    const ctx = dpl.ctx
    let angle = (Math.PI * 2) / n
    ctx.beginPath()
    for (let a = 0; a < Math.PI * 2; a += angle) {
        let sx = x + Math.cos(a - Math.PI / 2) * radius
        let sy = y + Math.sin(a - Math.PI / 2) * radius
        ctx.lineTo(sx, sy)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

export function polyline(
    dpl: Dreamplet,
    points: number[],
    closed: boolean = false
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.moveTo(points[0], points[1])
    for (let i = 2; i < points.length; i += 2) {
        ctx.lineTo(points[i], points[i + 1])
    }
    if (closed) {
        ctx.closePath()
    }
    ctx.stroke()
}

export function rect(
    dpl: Dreamplet,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number = 0
): void {
    const ctx = dpl.ctx
    if (radius === 0) {
        ctx.fillRect(x, y, width, height)
        ctx.strokeRect(x, y, width, height)
    } else {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.arcTo(x + width, y, x + width, y + radius, radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
        ctx.lineTo(x + radius, y + height)
        ctx.arcTo(x, y + height, x, y + height - radius, radius)
        ctx.lineTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

export function ring(
    dpl: Dreamplet,
    x: number,
    y: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number = 0,
    endAngle: number = Math.PI * 2
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.arc(x, y, innerRadius, startAngle, endAngle)
    ctx.arc(x, y, outerRadius, endAngle, startAngle, true)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

export function spline(
    dpl: Dreamplet,
    points: number[],
    tension: number = 0.5,
    closed: boolean = false
): void {
    const ctx = dpl.ctx
    let len = points.length
    let t1x: number, t2x: number, t1y: number, t2y: number
    let c1: number, c2: number, c3: number, c4: number
    let st: number, t: number, i: number

    ctx.beginPath()
    ctx.moveTo(points[0], points[1])

    for (i = 2; i < len; i += 2) {
        let n = i + 1
        let n1 = i + 2
        let n2 = i + 3
        if (i + 2 === len) {
            n1 = closed ? 0 : i
            n2 = closed ? 1 : i + 1
        } else if (i + 3 === len) {
            n2 = closed ? 0 : i + 1
        }

        t1x = (points[n1] - points[i - 2]) * tension
        t2x = (points[n2] - points[i]) * tension
        t1y = (points[n1 + 1] - points[i - 1]) * tension
        t2y = (points[n2 + 1] - points[n]) * tension

        for (t = 0; t <= 1; t += 0.05) {
            c1 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1
            c2 = -(2 * Math.pow(t, 3)) + 3 * Math.pow(t, 2)
            c3 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t
            c4 = Math.pow(t, 3) - Math.pow(t, 2)

            st = c1 * points[i] + c2 * points[n1] + c3 * t1x + c4 * t2x
            let st1 = c1 * points[n] + c2 * points[n2] + c3 * t1y + c4 * t2y
            ctx.lineTo(st, st1)
        }
    }
    ctx.stroke()
}

export function square(
    dpl: Dreamplet,
    x: number,
    y: number,
    size: number,
    radius: number = 0
): void {
    const ctx = dpl.ctx
    if (radius === 0) {
        ctx.fillRect(x, y, size, size)
        ctx.strokeRect(x, y, size, size)
    } else {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + size - radius, y)
        ctx.arcTo(x + size, y, x + size, y + radius, radius)
        ctx.lineTo(x + size, y + size - radius)
        ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius)
        ctx.lineTo(x + radius, y + size)
        ctx.arcTo(x, y + size, x, y + size - radius, radius)
        ctx.lineTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

export function star(
    dpl: Dreamplet,
    x: number,
    y: number,
    innerRadius: number,
    outerRadius: number,
    n: number
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    const rotation = (Math.PI / 2) * 3
    const step = Math.PI / n

    ctx.moveTo(x, y - outerRadius)
    for (let i = 0; i < n; i++) {
        let x1 = x + Math.cos(rotation + step * i * 2) * outerRadius
        let y1 = y + Math.sin(rotation + step * i * 2) * outerRadius
        ctx.lineTo(x1, y1)
        x1 = x + Math.cos(rotation + step * (i * 2 + 1)) * innerRadius
        y1 = y + Math.sin(rotation + step * (i * 2 + 1)) * innerRadius
        ctx.lineTo(x1, y1)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

export function triangle(
    dpl: Dreamplet,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
): void {
    const ctx = dpl.ctx
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}
