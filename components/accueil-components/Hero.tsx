'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Building2, Car, Shield, MapPin } from 'lucide-react'

// ── Canvas scene (unchanged logic, no style changes needed) ──────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath()
}

function CarScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let t = 0

    function resize() {
      if (!canvas || !ctx) return
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas!.offsetWidth
    const H = () => canvas!.offsetHeight

    function getPathPoint(progress: number) {
      const p = progress >= 1 ? 0.9999 : progress % 1
      const x0 = W() * 0.05, y0 = H() * 0.75
      const x1 = W() * 0.25, y1 = H() * 0.35
      const x2 = W() * 0.65, y2 = H() * 0.55
      const x3 = W() * 0.95, y3 = H() * 0.25
      const mt = 1 - p
      return {
        x: mt**3*x0 + 3*mt**2*p*x1 + 3*mt*p**2*x2 + p**3*x3,
        y: mt**3*y0 + 3*mt**2*p*y1 + 3*mt*p**2*y2 + p**3*y3,
      }
    }

    function drawScene(timestamp: number) {
      if (!ctx) return
      const w = W(), h = H()
      ctx.clearRect(0, 0, w, h)
      t = timestamp * 0.0004

      ctx.save()
      ctx.strokeStyle = 'rgba(234,179,8,0.04)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke() }
      for (let j = 0; j < h; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke() }
      ctx.restore()

      const grad = ctx.createLinearGradient(w*0.05, h*0.75, w*0.95, h*0.25)
      grad.addColorStop(0, 'rgba(234,179,8,0)')
      grad.addColorStop(0.3, 'rgba(234,179,8,0.6)')
      grad.addColorStop(0.7, 'rgba(20,184,166,0.6)')
      grad.addColorStop(1, 'rgba(99,102,241,0)')

      ctx.save()
      ctx.strokeStyle = grad
      ctx.lineWidth = 2
      ctx.shadowBlur = 20
      ctx.shadowColor = 'rgba(234,179,8,0.5)'
      ctx.setLineDash([8, 6])
      ctx.lineDashOffset = -t * 200
      ctx.beginPath()
      ctx.moveTo(w*0.05, h*0.75)
      ctx.bezierCurveTo(w*0.25, h*0.35, w*0.65, h*0.55, w*0.95, h*0.25)
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 20
      ctx.beginPath()
      ctx.moveTo(w*0.05, h*0.75)
      ctx.bezierCurveTo(w*0.25, h*0.35, w*0.65, h*0.55, w*0.95, h*0.25)
      ctx.stroke()
      ctx.restore()

      const pins = [
        { progress: 0,    label: 'Paris',     color: '#fde047' },
        { progress: 0.5,  label: 'Lyon',      color: '#2dd4bf' },
        { progress: 0.99, label: 'Marseille', color: '#818cf8' },
      ]
      pins.forEach(({ progress, label, color }) => {
        const pos = getPathPoint(progress)
        const pingR = 12 + Math.sin(t * 3 + progress * 6) * 4
        const pingAlpha = 0.3 + Math.sin(t * 3 + progress * 6) * 0.2
        ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = pingAlpha
        ctx.beginPath(); ctx.arc(pos.x, pos.y, pingR, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
        ctx.save(); ctx.fillStyle = color; ctx.shadowBlur = 15; ctx.shadowColor = color
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        ctx.save(); ctx.fillStyle = color; ctx.font = '600 11px system-ui'
        ctx.fillText(label, pos.x + 10, pos.y - 8); ctx.restore()
      })

      const carProgress = (t * 0.3) % 1
      const carPos = getPathPoint(carProgress)
      const carNext = getPathPoint((carProgress + 0.01) % 1)
      const angle = Math.atan2(carNext.y - carPos.y, carNext.x - carPos.x)

      for (let i = 0; i < 8; i++) {
        const tp = ((carProgress - i * 0.012) + 1) % 1
        const tp2 = getPathPoint(tp)
        ctx.save(); ctx.fillStyle = `rgba(234,179,8,${0.15 - i * 0.018})`
        ctx.beginPath(); ctx.arc(tp2.x, tp2.y, 6 - i * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      }

      ctx.save()
      ctx.translate(carPos.x, carPos.y); ctx.rotate(angle)
      ctx.fillStyle = '#fde047'; ctx.shadowBlur = 25; ctx.shadowColor = '#fde047'
      ctx.fillRect(-12, -5, 24, 10)
      ctx.fillStyle = 'rgba(253,224,71,0.5)'; ctx.fillRect(-6, -8, 14, 6)
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(-8, 5, 3, 0, Math.PI * 2); ctx.arc(8, 5, 3, 0, Math.PI * 2); ctx.fill()
      ctx.restore()

      const cardX = w * 0.72, cardY = h * 0.15
      ctx.save(); ctx.globalAlpha = 0.88
      ctx.fillStyle = 'rgba(9,9,11,0.95)'; ctx.strokeStyle = 'rgba(253,224,71,0.25)'; ctx.lineWidth = 1
      roundRect(ctx, cardX, cardY, 155, 58, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#fde047'; ctx.font = '700 10px system-ui'; ctx.fillText('● EN ROUTE', cardX + 10, cardY + 17)
      ctx.fillStyle = '#fff'; ctx.font = '400 9px system-ui'; ctx.fillText('Convoyeur: Thomas M.', cardX + 10, cardY + 31)
      ctx.fillStyle = 'rgba(45,212,191,0.9)'; ctx.font = '600 9px system-ui'; ctx.fillText('ETA: 2h 34min • 187km', cardX + 10, cardY + 45)
      ctx.restore()

      animFrame = requestAnimationFrame(drawScene)
    }

    animFrame = requestAnimationFrame(drawScene)
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Carte animée de suivi GPS en temps réel"
      className="w-full h-full block"
    />
  )
}

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { val: '4 200+', label: 'Missions complétées' },
  { val: '850+',   label: 'Convoyeurs actifs' },
  { val: '98%',    label: 'Satisfaction client' },
]

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-20 gap-12 md:gap-16 relative">

      {/* ── Left column ── */}
      <div className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-600/[0.08] border border-orange-600/20 rounded-full px-4 py-1.5 mb-8">
          <span className="bg-orange-600 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest">
            NOUVEAU
          </span>
          <span className="text-sm text-zinc-300/70 tracking-wide">Disponible sur iOS & Android</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter text-white mb-6">
          Le convoyage<br />
          <span className="text-orange-600">automobile</span><br />
          réinventé.
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-md mb-10 font-light">
          Connectez agences et convoyeurs certifiés à travers toute la France.
          Missions publiées, acceptées et suivies en temps réel — en quelques clics.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-yellow-200 text-zinc-950 text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-orange-600/15">
            <Building2 className="w-4 h-4" />
            Publier une mission
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-transparent hover:bg-white/[0.04] text-white text-sm font-semibold border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all duration-200">
            <Car className="w-4 h-4" />
            Devenir convoyeur
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 pt-8 border-t border-white/[0.06]">
          {stats.map(({ val, label }) => (
            <div key={label}>
              <div className="text-2xl font-black text-orange-600 tracking-tight">{val}</div>
              <div className="text-xs text-zinc-500 mt-0.5 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: canvas ── */}
      <div className={`relative h-[420px] md:h-[480px] transition-all duration-1000 ease-out delay-200 ${
        visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'
      }`}>
        {/* Orbs */}
        <div className="absolute top-[10%] left-[20%] w-72 h-72 rounded-full bg-orange-600/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[15%] right-[10%] w-48 h-48 rounded-full bg-teal-400/[0.07] blur-3xl pointer-events-none" />

        {/* Frame */}
        <div className="absolute inset-0 border border-white/[0.06] rounded-2xl overflow-hidden bg-zinc-950/50 backdrop-blur-sm">
          <CarScene />

          {/* Bottom-left badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-zinc-950/90 border border-white/[0.08] rounded-xl px-4 py-2.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_theme(colors.teal.400)] shrink-0" />
            <span className="text-xs font-bold text-white tracking-wide">Suivi GPS Temps Réel</span>
          </div>

          {/* Top-right badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-orange-600/10 border border-orange-600/20 rounded-lg px-3 py-1.5">
            <Shield className="w-3 h-3 text-orange-600" />
            <span className="text-[11px] font-bold text-orange-600 tracking-wider">SÉCURISÉ</span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-2.5 -left-2.5 w-7 h-7 border-t-2 border-l-2 border-orange-600 rounded-tl" />
        <div className="absolute -bottom-2.5 -right-2.5 w-7 h-7 border-b-2 border-r-2 border-teal-400 rounded-br" />
      </div>
    </section>
  )
}