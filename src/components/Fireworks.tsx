import React, { useEffect, useRef } from 'react'

interface FireworksProps {
  duration?: number
}

const Fireworks: React.FC<FireworksProps> = ({ duration = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Firework particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.speedX = Math.random() * 4 - 2
        this.speedY = Math.random() * 4 - 2
        this.color = color
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.3) this.size -= 0.1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Store particles
    const particles: Particle[] = []

    // Create fireworks
    function createFireworks(x: number, y: number) {
      const particleCount = 80
      const colors = [
        '#FF0000',
        '#FFD700',
        '#00FF00',
        '#00FFFF',
        '#FF00FF',
        '#FFA500',
        '#9400D3'
      ]

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 6 + 3
        const color = colors[Math.floor(Math.random() * colors.length)]
        particles.push(new Particle(x, y, size, color))
      }
    }

    // Animation
    function animate() {
      if (!ctx) return

      // Clear the canvas with a fully transparent background
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        if (particles[i].size <= 0.3) {
          particles.splice(i, 1)
          i--
        }
      }

      if (Math.random() < 0.08) {
        const x = Math.random() * canvas!.width
        const y = (Math.random() * canvas!.height) / 2
        createFireworks(x, y)
      }

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Create initial fireworks
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const x = Math.random() * canvas!.width
        const y = (Math.random() * canvas!.height) / 2
        createFireworks(x, y)
      }, i * 250)
    }

    // Cleanup after duration
    const timeoutId = setTimeout(() => {
      particles.length = 0
    }, duration)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [duration])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  )
}

export default Fireworks
