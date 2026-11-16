const cues = [
  { at: 0.16, x: 0.20, y: 0.25, color: '255,184,75', size: 1.12 },
  { at: 0.47, x: 0.80, y: 0.30, color: '255,137,157', size: 1.11 },
  { at: 0.92, x: 0.48, y: 0.16, color: '255,223,147', size: 1.35 },
  { at: 1.34, x: 0.15, y: 0.56, color: '247,127,160', size: .86 },
  { at: 1.54, x: 0.87, y: 0.59, color: '255,195,104', size: .92 },
  { at: 2.09, x: 0.27, y: 0.20, color: '255,186,78', size: 1.24 },
  { at: 2.18, x: 0.75, y: 0.22, color: '255,143,157', size: 1.22 },
  { at: 2.70, x: 0.12, y: 0.40, color: '255,179,90', size: .94 },
  { at: 2.81, x: 0.88, y: 0.41, color: '255,138,168', size: .97 },
  { at: 2.47, x: 0.50, y: 0.11, color: '255,226,157', size: 1.18 },
]

export function createFireworks(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  const density = Math.min(devicePixelRatio, 1.75)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width * density
  canvas.height = height * density
  ctx?.setTransform(density, 0, 0, density, 0, 0)
  const distance = Math.min(width, height) * .39

  function draw(time: number) {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'

    const fountainFade = Math.min(1, Math.max(0, (time + .49) * 2.4), Math.max(0, (3.9 - time) * 1.9))
    if (fountainFade > 0) {
      for (const origin of [.055, .945]) {
        for (let index = 0; index < 47; index++) {
          const seed = (index * 73 % 101) / 101
          const lifetime = .54 + seed * .78
          const age = (time + .5 + index * .031) % lifetime
          const life = age / lifetime
          const rise = height * (.2 + seed * .3)
          const drift = (origin < .5 ? 1 : -1) * width * ((index * 31 % 77) / 310 - .05)
          const baseX = origin * width
          const baseY = height * .96
          const last = Math.max(0, life - .045)
          const curve = (p: number) => 2.94 * p - 2.10 * p ** 2
          const opacity = (1 - life) * fountainFade * (.66 + .34 * seed)
          ctx.beginPath()
          ctx.moveTo(baseX + drift * last, baseY - rise * curve(last))
          ctx.lineTo(baseX + drift * life, baseY - rise * curve(life))
          ctx.strokeStyle = `rgba(255,${index % 3 === 0 ? 145 : 209},107,${opacity})`
          ctx.lineWidth = .7 + seed * 1.2
          ctx.stroke()
        }
      }
    }

    for (const cue of cues) {
      const age = time - cue.at
      if (age < -.47 || age > 1.7) continue
      const x = cue.x * width
      const y = cue.y * height
      if (age < 0) {
        const p = (age + .47) / .47
        const tip = y + (height - y) * (1 - p) ** 2
        const tail = tip + 40 + 52 * (1 - p)
        const glow = ctx.createLinearGradient(x, tip, x, tail)
        glow.addColorStop(0, `rgba(${cue.color},.95)`)
        glow.addColorStop(1, `rgba(${cue.color},0)`)
        ctx.fillStyle = glow
        ctx.fillRect(x - 1.5, tip, 3, tail - tip)
        continue
      }

      const life = age / 1.7
      if (life < .2) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 45 + distance * life)
        halo.addColorStop(0, `rgba(${cue.color},${(.2 - life) * 1.72})`)
        halo.addColorStop(1, `rgba(${cue.color},0)`)
        ctx.fillStyle = halo
        ctx.fillRect(x - 110, y - 110, 220, 220)
      }

      const expansion = 1 - (1 - life) ** 2.7
      const trailing = 1 - (1 - Math.max(0, life - .145)) ** 2.7
      for (let index = 0; index < 74; index++) {
        const angle = index * Math.PI / 37 + cue.x
        const spread = distance * cue.size * (.51 + (index * 17 % 29) / 57)
        const endX = x + Math.cos(angle) * spread * expansion
        const endY = y + Math.sin(angle) * spread * expansion + 69 * life ** 2
        const flicker = life > .25 && index % 4 === 0 ? .65 + .35 * Math.sin(index + life * 42) ** 2 : 1
        const opacity = (1 - life) ** 1.12 * (.72 + (index % 5) * .07) * flicker
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(angle) * spread * trailing, y + Math.sin(angle) * spread * trailing + 54 * life ** 2)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(${cue.color},${opacity * .86})`
        ctx.lineWidth = index % 3 === 0 ? 2.2 : 1.12
        ctx.stroke()
        ctx.fillStyle = `rgba(255,235,191,${opacity})`
        ctx.beginPath()
        ctx.arc(endX, endY, index % 4 === 0 ? 1.75 : 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }
  return draw
}
