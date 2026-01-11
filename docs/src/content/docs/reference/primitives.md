---
title: Primitives
description: Reference for Dreamplet drawing primitives.
---

Primitives are the building blocks of your visuals. All primitives share common properties that can be animated.

## Common Properties

| Property   | Type     | Description                                 |
| :--------- | :------- | :------------------------------------------ |
| `x`        | `number` | X position                                  |
| `y`        | `number` | Y position                                  |
| `scale`    | `number` | Scale factor (default: 1)                   |
| `rotation` | `number` | Rotation in degrees                         |
| `color`    | `string` | CSS color string (Hex, RGB, HSL, and OKLCH) |

### Supported Color Formats

Dreamplet supports most standard CSS color formats:

- **Hex:** `#ff0000`, `#f00`
- **RGB/RGBA:** `rgb(255, 0, 0)`, `rgba(255, 0, 0, 0.5)`
- **HSL/HSLA:** `hsl(0, 100%, 50%)`
- **OKLCH:** `oklch(0.597 0.225 7.805)` (Supported via internal converter)
- **Named colors:** `red`, `blue`, `transparent`

## Circle

```typescript
new Circle(x: number, y: number, radius: number, color: string)
```

## Rect

```typescript
new Rect(x: number, y: number, width: number, height: number, color: string)
```

## Path

```typescript
new Path(x: number, y: number, svgPath: string, color: string)
```

Uses SVG path strings for complex shapes.

```typescript
const heart = new Path(
  100,
  100,
  'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z',
  '#ff0000'
)
engine.add(heart)
```
