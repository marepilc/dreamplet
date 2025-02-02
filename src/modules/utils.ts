import { constrain } from './math'

export function deg2rad(a: number): number {
    return (a * Math.PI) / 180
}

export function hexStr(v: number): string {
    if (constrain(v, 0, 255).toString(16).length == 1) {
        return 0 + constrain(v, 0, 255).toString(16)
    } else {
        return constrain(v, 0, 255).toString(16)
    }
}

export function int(s: string, radix: number = 10): number {
    return parseInt(s, radix)
}

export function number2str(x: number, radix: number = 10): string {
    return x.toString(radix)
}

export function print(...items: any) {
    if (items.length != 0) {
        console.log(...items)
    } else {
        window.print()
    }
}

export let str: StringConstructor = String

export function svg2img(svg: string): HTMLImageElement {
    let img = new Image()
    let blob = new Blob([svg], { type: 'image/svg+xml' })
    img.src = URL.createObjectURL(blob)
    return img
}

export function thousandSep(v: number, sep: string): string {
    let s: string = number2str(v)
    let st: string[] = s.split('.')
    let st1 = st[0]
    let st2 = st.length > 1 ? '.' + st[1] : ''
    let rgx: RegExp = /(\d+)(\d{3})/
    while (rgx.test(st1)) {
        st1 = st1.replace(rgx, '$1' + sep + '$2')
    }
    return st1 + st2
}
