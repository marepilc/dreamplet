import type { Dreamplet } from '../Dreamplet'

export function text(dpl: Dreamplet, text: string, x: number, y: number) {
    const lines = text.split('\n')
    let lineY = y
    for (let i = 0; i < lines.length; i++) {
        dpl.ctx.fillText(lines[i], x, lineY)
        lineY += dpl.fontSize * dpl.lineHeight
    }
}

export function textOnArc(
    dpl: Dreamplet,
    text: string,
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    textAlign: CanvasTextAlign = 'center',
    outside: boolean = true,
    inwards: boolean = false,
    kerning: number = 0
): number {
    const clockwise = textAlign === 'left' ? 1 : -1 // draw clockwise if right. Else counterclockwise
    if (!outside) {
        radius -= dpl.fontSize
    }
    if (
        ((textAlign === 'center' || textAlign === 'right') && inwards) ||
        (textAlign === 'left' && !inwards)
    ) {
        text = text.split('').reverse().join('')
    }
    dpl.save()
    dpl.translate(x, y)
    let _startAngle = startAngle
    startAngle += Math.PI / 2
    if (!inwards) {
        startAngle += Math.PI
    }
    dpl.textBaseline = 'middle'
    dpl.textAlign = 'center'
    if (textAlign === 'center') {
        for (let i = 0; i < text.length; i++) {
            let charWidth = dpl.ctx.measureText(text[i]).width
            startAngle +=
                ((charWidth + (i === text.length - 1 ? 0 : kerning)) /
                    (radius - dpl.fontSize) /
                    2) *
                -clockwise
        }
    }
    let tempAngle = 0
    dpl.ctx.rotate(startAngle)
    for (let i = 0; i < text.length; i++) {
        let charWidth = dpl.ctx.measureText(text[i]).width
        dpl.ctx.rotate((charWidth / 2 / (radius - dpl.fontSize)) * clockwise)
        dpl.ctx.fillText(
            text[i],
            0,
            (inwards ? 1 : -1) * (0 - radius + dpl.fontSize / 2)
        )

        dpl.ctx.rotate(
            ((charWidth / 2 + kerning) / (radius - dpl.fontSize)) * clockwise
        )
        tempAngle +=
            (charWidth / 2 / (radius - dpl.fontSize)) * clockwise +
            ((charWidth / 2 + kerning) / (radius - dpl.fontSize)) * clockwise
    }
    dpl.restore()
    return _startAngle + tempAngle
}
