# 🎨 Dreamplet: Development Roadmap

## Phase 1: Foundation (Core Engine)

_Goal: Initialize the Skia WebAssembly environment and render basic graphics within a modern Vite workflow._

- **1.1. Environment Setup:**
- Configure Vite in `library mode`.
- Setup TypeScript with `vite-plugin-dts` for automated type definitions.
- Implement asynchronous loading of `canvaskit-wasm` (handling the `.wasm` binary path).

- **1.2. Surface & Canvas Management:**
- Create a central `Engine` or `Stage` class.
- Implement automatic high-DPI scaling (handling `window.devicePixelRatio` for crisp visuals).
- Handle window resizing and canvas context loss/recovery.

- **1.3. Smart Memory Management:**
- Develop a **Disposable Pattern** to wrap Skia objects (Paint, Path, Surface).
- Create an internal registry to automatically track and `.delete()` WASM objects to prevent memory leaks.

## Phase 2: Animation Integration (GSAP & Ticker)

_Goal: Drive the Skia render loop using GSAP’s high-performance timing engine._

- **2.1. The Render Loop (Ticker):**
- Hook into `gsap.ticker` to synchronize the Skia `surface.flush()` with the browser's refresh rate.
- Implement a "Dirty State" flag to only redraw when properties actually change (CPU optimization).

- **2.2. Tweenable Primitive Classes:**
- Build base classes for `Circle`, `Rect`, and `Path`.
- Expose properties (x, y, scale, rotation, color) in a way that GSAP can target them directly.

- **2.3. Color & Unit Parsing:**
- Create utility functions to convert CSS colors/Hex to `CanvasKit.Color` (Float32Array).

## Phase 3: Skottie & Lottie Support

_Goal: Integrate vector animations with the flexibility of code-based control._

- **3.1. Asset Pipeline:**
- Build an async loader for Lottie JSON files and external image assets.

- **3.2. Skottie Wrapper:**
- Create a `LottieView` class to manage animation playback.
- Expose a `progress` property (0-1) to allow GSAP to "scrub" through the animation.

- **3.3. Advanced Control:**
- Implement segment-based playback (e.g., play only frames 20 to 60).
- Add support for dynamic property overrides within the Lottie file (changing colors of layers via code).

## Phase 4: Creative Toolkit (The "Artist" API)

_Goal: Provide high-level tools that make complex visual effects easy to write._

- **4.1. Generative Tools:**
- Implement noise functions (Perlin/Simplex) for organic motion.
- Add a `Group` system for nested transformations (parent-child relationships).

- **4.2. Typography Engine:**
- Simplify font loading and the `SkParagraph` API for advanced text layouts.
- Integrate text-on-path capabilities.

- **4.3. Filters & Shaders:**
- Create an easy API for Blur, Drop Shadows, and custom RuntimeEffects (GLSL shaders).

## Phase 5: Ecosystem & Optimization

_Goal: Finalize for public use and performance at scale._

- **5.1. Hit Testing & Interaction:**
- Implement a system to detect mouse/touch events on vector shapes.

- **5.2. Benchmarking:**
- Optimize the transfer of data between the JS thread and the WASM memory.

- **5.3. Documentation & Playground:**
- Build an interactive documentation site with live code editors (using VitePress or similar).

---

### Milestone 1: The "Hello World"

The first success metric will be a script where:

1. **dreamplet** initializes.
2. A `Circle` is created with a simple Hex color string.
3. `gsap.to(circle, { x: 500, duration: 2, ease: "expo.out" })` works seamlessly.

---

## 🛠️ How to use the Playground

The playground is a dedicated space for writing and testing sketches using the Dreamplet library.

1.  **Start the Playground:**
    Run the following command in your terminal:
    ```bash
    npm run dev
    ```
    (or `npm run playground`)
2.  **Access in Browser:**
    Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
3.  **Create Sketches:**
    Edit `playground/sketch.ts` to create your own animations. The playground automatically reloads when you save changes.
