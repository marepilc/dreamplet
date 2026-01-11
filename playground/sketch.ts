import { Engine, Circle, Rect } from '../src'
import gsap from 'gsap'

async function run() {
  const engine = new Engine('canvas')
  await engine.init()

  const cornerRect = new Rect(10, 10, 50, 50, 'oklch(0.597 0.225 7.805)')
  engine.add(cornerRect)

  const circle = new Circle(200, 200, 80, '#00ffcc')
  engine.add(circle)

  const rect = new Rect(400, 100, 100, 100, '#ff9900')
  engine.add(rect)

  // Animate circle
  gsap.to(circle, {
    x: 600,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })

  // Animate rect
  gsap.to(rect, {
    rotation: 360,
    duration: 4,
    repeat: -1,
    ease: 'none'
  })
}

run().catch(console.error)
