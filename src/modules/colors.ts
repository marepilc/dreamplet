import { constrain } from './math'
import { int } from './utils'

interface ColorRGB {
    r: number
    g: number
    b: number
}

export function color2rgba(
    c: number[] | string | number,
    alpha: number = 1
): string {
    let r: number
    let g: number
    let b: number
    let a: number
    switch (typeof c) {
        case 'object':
            if (Array.isArray(c) && c.length === 3) {
                r = constrain(c[0], 0, 255)
                g = constrain(c[1], 0, 255)
                b = constrain(c[2], 0, 255)
                a = constrain(alpha, 0, 1)
            } else {
                r = g = b = 0
                a = 1
            }
            break
        case 'number':
            r = g = b = constrain(c as number, 0, 255)
            a = constrain(alpha, 0, 1)
            break
        case 'string':
            let rgb = str2rgb(c as string)
            r = rgb.r
            g = rgb.g
            b = rgb.b
            a = constrain(alpha, 0, 1)
            break
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`
}

function str2rgb(col: string): ColorRGB {
    let rgb: ColorRGB = {
        r: 0,
        g: 0,
        b: 0,
    }
    let rgx: RegExp = /^#+([a-fA-F\d]{6}|[a-fA-F\d]{3})$/
    if (rgx.test(col)) {
        if (col.length == 4) {
            col = col.slice(0, 2) + col[1] + col.slice(2)
            col = col.slice(0, 4) + col[3] + col.slice(4)
            col = col + col[5]
        }
        rgb.r = int(col.slice(1, 3), 16)
        rgb.g = int(col.slice(3, 5), 16)
        rgb.b = int(col.slice(5), 16)
    }
    return rgb
}
