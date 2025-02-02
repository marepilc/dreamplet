# Dreamplet

Dreamplet is a simple and easy-to-use library for creative coding and data visualization in TypeScript. It is designed to be used in the browser or for Power BI custom visuals.

## Installation

```bash
npm install dreamplet
```

## Usage

```typescript
import { Dreamplet, Mouse, Keyboard } from 'dreamplet'

const dreamplet = new Dreamplet()
const sketch = new Dreamplet({ container, width: 800, height: 600 })
const mouse = new Mouse(sketch.canvas)
const keyboard = new Keyboard(sketch.canvas)

sketch.preloader = async () => {
    sketch.assets['avatar'] = await loadImage('assets/avatar.jpeg')
}

sketch.setup = () => {
    console.log('Setup! I\'m called only once.')
}

sketch.draw = () => {
    const time = Date.now() * 0.002
    const x = sketch.width / 2 + Math.sin(time) * 100
    const y = sketch.height / 2
    
    sketch.background('#eee')
    placeImage(sketch, sketch.assets.avatar, x, y, 'right-horizon', 150, 150)
    sketch.fill('#000')
    sketch.fontSize = 20
    sketch.fontFamily = 'monospace'
    sketch.fontWeight = '200'
    sketch.textAlign = 'left'
    text(sketch, 'Hello, Dreamplet!', 10, 20)
    text(sketch, `Mouse position: ${mouse.x}, ${mouse.y}`, 10, 580)
}

// add onCkick event
mouse.click = () => {
    console.log('Clicked!')
}

// add onKeyPress event
keyboard.keyUp = (key) => {
    console.log('Pressed:', key)
}

sketch.start()
```