---
title: Engine
description: Reference for the Dreamplet Engine class.
---

The `Engine` class is the heart of Dreamplet. It manages the Skia surface, handles resizing, and drives the render loop.

## Constructor

The `Engine` can be initialized in two ways:

### Using Canvas ID
```typescript
const engine = new Engine('canvas-id');
```

### Using Options
```typescript
const engine = new Engine({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  width: 800,
  height: 600
});
```

## Methods

### `init()`
Initializes the CanvasKit WASM and sets up the render loop. Returns a `Promise<void>`.
```typescript
await engine.init();
```

### `add(primitive: Primitive)`
Adds a primitive (Circle, Rect, Path) to the engine to be rendered.
```typescript
engine.add(new Circle(100, 100, 50, '#ff0000'));
```

### `markDirty()`
Forces the engine to redraw on the next frame. Usually called automatically when adding primitives.
