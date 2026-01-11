---
title: Getting Started
description: Learn how to set up and use Dreamplet in your project.
---

Dreamplet is a high-performance creative coding library that combines the power of Skia (via CanvasKit WASM) with the ease of GSAP animations.

## Installation

```bash
npm install dreamplet gsap canvaskit-wasm
```

## Basic Usage

To get started, you need a `<canvas>` element in your HTML:

```html
<canvas id="canvas"></canvas>
```

Then, you can initialize the engine and start drawing:

```typescript
import { Engine, Circle, Rect } from 'dreamplet';
import gsap from 'gsap';

async function run() {
    // Initialize the engine with the canvas ID
    const engine = new Engine('canvas');
    await engine.init();

    // Create a circle
    const circle = new Circle(200, 200, 80, '#00ffcc');
    engine.add(circle);

    // Animate with GSAP
    gsap.to(circle, {
        x: 600,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

run().catch(console.error);
```

## Next Steps

- Explore the [Engine Reference](/reference/engine)
- Learn about [Primitives](/reference/primitives)
