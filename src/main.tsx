import React, { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/dm-sans'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/cinzel/latin-500.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/noto-sans-telugu/telugu-400.css'
import '@fontsource/noto-sans-telugu/telugu-600.css'
import { wedding } from './wedding'
import { createFireworks } from './fireworks'
import './style.css'

type Language = 'en' | 'te'
type Copy = typeof wedding.en
type Stage = 'closed' | 'opening' | 'open'
const weddingInstant = new Date(`${wedding.date}T${wedding.muhurtham}:00${wedding.offset}`)
const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches
const read = (key: string) => { try { return sessionStorage.getItem(key) } catch { return null } }
const remember = (key: string, value: string) => { try { sessionStorage.setItem(key, value) } catch { /* Optional in private browsing. */ } }
const locale = (lang: Language) => lang === 'en' ? 'en-GB' : 'te-IN'
const displayDate = (lang: Language, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale(lang), { ...options, timeZone: wedding.timeZone }).format(weddingInstant)
const displayTime = (lang: Language, time: string) =>
  new Intl.DateTimeFormat(locale(lang), { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: wedding.timeZone })
    .format(new Date(`${wedding.date}T${time}:00${wedding.offset}`))
const fullDate = (lang: Language) => displayDate(lang, { dateStyle: 'full' })
const mapLink = wedding.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${wedding.en.place}, ${wedding.en.address}`)

function Words({ children }: { children: string }) {
  return <>
    <span className="sr-only">{children}</span>
    <span className="sentence" aria-hidden="true">
      {children.split(' ').map((word, index) => <React.Fragment key={index}>
        {index > 0 && ' '}<span className="word-mask"><span className="word" style={{ '--word': index } as CSSProperties}>{word}</span></span>
      </React.Fragment>)}
    </span>
  </>
}

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    heart: <path d="M12 21s-8.5-5-9.5-10.2C1.4 5.3 8.4 2 12 7c3.6-5 10.6-1.7 9.5 3.8C20.5 16 12 21 12 21Z"/>,
    arrow: <path d="M12 4v15m-5-5 5 5 5-5"/>,
    pin: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    sound: <><path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10"/></>,
    mute: <><path d="M4 9h4l5-4v14l-5-4H4zM17 10l5 5m0-5-5 5"/></>,
    replay: <path d="M4 11a8 8 0 1 1 2 6m-2-6V5m0 6h6"/>,
    share: <><path d="M12 15V3m-4 4 4-4 4 4M7 11H5v10h14V11h-2"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Flourish() {
  return <svg className="flourish" aria-hidden="true" viewBox="0 0 168 25" fill="none">
    <path d="M0 13h48c16 0 17-10 28-7 5 1 6 8 1 10-4 2-8-2-5-5M168 13h-48c-16 0-17-10-28-7-5 1-6 8-1 10 4 2 8-2 5-5" stroke="currentColor"/>
    <path d="m84 2 5 10-5 10-5-10z" fill="currentColor"/>
  </svg>
}

function VenueOrnament() {
  return <svg className="venue-ornament" viewBox="0 0 172 104" aria-hidden="true" fill="none">
    <g stroke="currentColor" strokeWidth=".85">
      <path d="M86 6c6 11 14 12 20 17 10 7 13 14 12 24h-64C53 37 56 30 66 23c6-5 14-6 20-17Z"/>
      <path d="M86 13c4 9 11 11 17 15 8 5 10 9 10 14H59c0-5 2-9 10-14 6-4 13-6 17-15Z"/>
      <path d="M48 48h76M51 52h70M47 88h78m-86 5h94M60 52v36m5-36v36m42-36v36m5-36v36M75 88V72c0-7 4-11 11-15 7 4 11 8 11 15v16"/>
      <path d="M6 77c13 5 22 3 34-8M9 87c14 0 22-2 29-9m-19-6c-2-5-5-8-10-9 1 7 4 9 10 9Zm9 1c3-6 2-11-2-16-4 8-2 13 2 16Z"/>
      <path d="M6 77c13 5 22 3 34-8M9 87c14 0 22-2 29-9m-19-6c-2-5-5-8-10-9 1 7 4 9 10 9Zm9 1c3-6 2-11-2-16-4 8-2 13 2 16Z" transform="translate(172) scale(-1 1)"/>
    </g>
  </svg>
}

function Monogram() {
  return <span className="monogram" aria-hidden="true">
    <svg viewBox="0 0 128 128" fill="none">
      <path d="M64 3c9 17 22 19 35 23 4 13 9 26 26 38-17 12-22 25-26 38-13 4-26 6-35 23-9-17-22-19-35-23-4-13-9-26-26-38 17-12 22-25 26-38C42 22 55 20 64 3Z" stroke="currentColor"/>
      <path d="M64 12c10 14 22 17 31 19 4 12 9 23 21 33-12 10-17 21-21 33-9 2-21 5-31 19-10-14-22-17-31-19-4-12-9-23-21-33 12-10 17-21 21-33 9-2 21-5 31-19Z" stroke="currentColor" opacity=".52"/>
      <path d="m64 26 3 4-3 4-3-4zm0 68 3 4-3 4-3-4z" fill="currentColor"/>
    </svg>
    <span>{wedding.monogram[0]}<i>&amp;</i>{wedding.monogram[1]}</span>
  </span>
}

function Countdown({ copy }: { copy: Copy }) {
  const remaining = () => Math.max(0, Math.ceil((+weddingInstant - Date.now()) / 1000))
  const [seconds, setSeconds] = useState(remaining)
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(remaining()), 250)
    return () => clearInterval(timer)
  }, [])
  const units = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
  return <section className="countdown night" aria-label={copy.countdown}>
    <Flourish/>
    <h2>{copy.countdown}</h2>
    {seconds > 0 ? <dl className="clock">{units.map((value, i) => <div key={copy.units[i]}>
      <dt>{copy.units[i]}</dt><dd>{String(value).padStart(2, '0')}</dd>
    </div>)}</dl> : <p>{copy.celebrate}</p>}
  </section>
}

function Diya() {
  return <svg className="diya" aria-hidden="true" viewBox="0 0 100 112" fill="none">
    <ellipse className="diya-glow" cx="50" cy="45" rx="43" ry="40" fill="url(#diya-light)"/>
    <g className="diya-flame">
      <path d="M50 19c7 15 19 24 11 38-5 9-18 8-23-1-6-12 7-22 12-37Z" fill="#df7b25"/>
      <path d="M50 38c4 10 10 14 6 20-3 5-9 5-12 0-3-6 3-11 6-20Z" fill="#fff2b9"/>
    </g>
    <path d="M13 68Q50 59 87 68L80 79Q50 96 20 79ZM45 84h10v11l19 6H26l19-6Z" fill="url(#diya-brass)" stroke="#805029"/>
    <path d="M19 70Q50 77 81 70M25 77Q50 84 75 77" stroke="#f5cd7f"/>
    <path d="M50 65v-5" stroke="#603a25" strokeWidth="2"/>
  </svg>
}

function BlessingPetals() {
  return <div className="blessing-petals" aria-hidden="true">{Array.from({ length: 32 }, (_, i) =>
    <i key={i} style={{ left: `${3 + i * 37 % 94}%`, '--petal-color': ['#e7a74d', '#c76a7b', '#f8dfab'][i % 3], '--petal-size': `${7 + i % 9}px` } as CSSProperties}/>
  )}</div>
}

function Art({ src, className = '', loading = 'lazy' }: { src: string; className?: string; loading?: 'lazy' | 'eager' }) {
  return <img className={className} src={src} alt="" loading={loading} decoding="async" width="768" height="512"/>
}

const petalAngles = [211, 232, 253, 273, 293, 314, 333, 348, 19, 153, 165, 187]
function Petals({ visible }: { visible: boolean }) {
  return <span className="petals" aria-hidden="true">{visible && petalAngles.map((angle, i) => {
    const a = angle * Math.PI / 180
    const distance = 68 + (i * 29) % 90
    return <i key={angle} style={{ '--x': `${Math.cos(a) * distance}px`, '--y': `${Math.sin(a) * distance}px`, '--d': `${i * 20}ms`, '--r': `${angle}deg` } as CSSProperties}/>
  })}</span>
}

function DriftingPetals({ count = 10 }: { count?: number }) {
  return <div className="drifting-petals" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => <i key={i} style={{
      '--petal-x': `${5 + (i * 29 % 90)}%`,
      '--petal-delay': `${-(i * 1.73)}s`,
      '--petal-duration': `${8 + (i % 6)}s`,
    } as CSSProperties}/>)}
  </div>
}

function App() {
  const [lang, setLang] = useState<Language>(() => read('wedding-lang') === 'te' ? 'te' : 'en')
  const [stage, setStage] = useState<Stage>('closed')
  const [heart, setHeart] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [sound, setSound] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const cover = useRef<HTMLDivElement>(null)
  const invitation = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const start = useRef<HTMLHeadingElement>(null)
  const openButton = useRef<HTMLButtonElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const fade = useRef<gsap.core.Tween | null>(null)
  const soundRequest = useRef(0)
  const copy = wedding[lang]
  const names = `${copy.groom} & ${copy.bride}`
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || new URL(location.pathname, location.origin).href
  const shareUrl = 'https://wa.me/?text=' + encodeURIComponent(`${copy.family} — ${copy.invite} ${names}. ${fullDate(lang)}.\n\n${publicUrl}`)
  const theme = {
    '--emerald': wedding.theme.emerald, '--ivory': wedding.theme.ivory, '--gold': wedding.theme.gold,
    '--floral-art': `url("${wedding.art.flowers}")`,
    '--welcome-art': `url("${wedding.art.welcome}")`,
    '--burgundy': wedding.theme.burgundy, '--curtain-image': `url("${wedding.art.curtains}")`, '--cover': `url("${wedding.art.cover}")`, '--envelope': `url("${wedding.art.envelope}")`, '--mobile-envelope': `url("${wedding.art.envelopeMobile}")`,
  } as CSSProperties

  useEffect(() => { document.documentElement.lang = lang; remember('wedding-lang', lang) }, [lang])
  useEffect(() => {
    const image = new Image()
    const silk = new Image()
    silk.src = wedding.art.curtains
    image.onload = image.onerror = () => setLoaded(true)
    image.src = matchMedia('(max-width: 640px)').matches ? wedding.art.envelopeMobile : wedding.art.envelope
    const fallback = window.setTimeout(() => setLoaded(true), 1800)
    return () => { clearTimeout(fallback); image.onload = image.onerror = null }
  }, [])
  useEffect(() => {
    document.body.classList.toggle('sealed', stage !== 'open')
    return () => document.body.classList.remove('sealed')
  }, [stage])
  useEffect(() => {
    if (stage !== 'open' || !motionOK()) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      }
    }), { rootMargin: '0px 0px -9% 0px', threshold: 0.07 })
    invitation.current?.querySelectorAll('.reveal:not(.in-view)').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [stage, heart])

  useEffect(() => {
    const canvas = invitation.current?.querySelector<HTMLCanvasElement>('.closing-fireworks')
    if (stage !== 'open' || !heart || !canvas || !motionOK()) return
    let celebration: gsap.core.Tween | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const draw = createFireworks(canvas)
      const clock = { time: -.47 }
      celebration = gsap.to(clock, {
        time: 4.55, duration: 5.02, ease: 'none',
        onUpdate: () => draw(clock.time),
      })
      observer.disconnect()
    }, { threshold: .25 })
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      celebration?.kill()
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [stage, heart])

  async function playMusic() {
    const player = audio.current
    if (!player) return
    const request = ++soundRequest.current
    fade.current?.kill()
    player.volume = 0.05
    try {
      await player.play()
      if (request !== soundRequest.current) return
      fade.current = gsap.to(player, { volume: 0.45, duration: motionOK() ? 1.25 : 0 })
      setSound(true)
      setAudioError(false)
      remember('wedding-sound', 'on')
    } catch {
      if (request === soundRequest.current) setAudioError(true)
    }
  }
  function toggleMusic() {
    if (!sound) { void playMusic(); return }
    ++soundRequest.current
    fade.current?.kill()
    const player = audio.current
    if (player) fade.current = gsap.to(player, {
      volume: 0, duration: motionOK() ? 0.45 : 0, onComplete: () => player.pause(),
    })
    remember('wedding-sound', 'off')
    setSound(false)
  }
  function openInvitation() {
    if (stage !== 'closed') return
    if (read('wedding-sound') !== 'off' && !sound) void playMusic()
    window.scrollTo(0, 0)
    const finish = () => { setStage('open'); requestAnimationFrame(() => start.current?.focus({ preventScroll: true })) }
    if (!motionOK() || !cover.current || !content.current) { finish(); return }
    setStage('opening')
    const shell = cover.current
    const panels = shell.querySelectorAll('.door')
    const curtains = shell.querySelectorAll('.curtain')
    const select = (s: string) => shell.querySelectorAll(s)
    const canvas = shell.querySelector('canvas')!
    const drawFireworks = createFireworks(canvas)
    const fireworks = { time: -0.47 }
    const title = select('.overture-line')
    const blessing = content.current
    const drapery = shell.querySelectorAll<HTMLElement>('.curtain')
    const overture = shell.querySelector('.overture')!
    timeline.current = gsap.timeline({ onComplete: finish })
      .to(select('.seal'), { scale: 0.93, duration: 0.16, ease: 'power2.out' }, 0)
      .to(select('.seal-ring'), { scale: 2.1, opacity: 0, duration: 0.83, ease: 'power2.out' }, 0.14)
      .to(select('.seal'), { scale: 1.22, rotate: -13, y: -22, duration: 0.37, ease: 'back.out(2)' }, 0.15)
      .to(select('.seal'), { scale: 0.65, rotate: 34, y: -90, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0.52)
      .to(select('.seam-glow'), { opacity: 0.9, duration: 0.4 }, 0.19)
      .fromTo(select('.welcome-art'), { scale: 1.045 }, { scale: 1.16, duration: 1.68, ease: 'sine.inOut' }, 0)
      .to(panels, { xPercent: i => i === 0 ? -129 : 129, rotateY: i => i === 0 ? 57 : -57, duration: 1.24, ease: 'power3.inOut' }, 0.63)
      .set(panels, { visibility: 'hidden' }, 1.89)
      .to(select('.seam-glow'), { opacity: 0, duration: 0.38 }, 0.76)
      .fromTo(curtains, { scaleX: 1.035 }, { scaleX: 1, duration: .5 }, 1.29)
      .to(drapery[0], { clipPath: 'polygon(0 0, 100% 0, 90% 23%, 73% 49%, 79% 76%, 94% 100%, 0 100%)', duration: .8, ease: 'power2.inOut' }, 1.72)
      .to(drapery[1], { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 6% 100%, 21% 76%, 27% 49%, 10% 23%)', duration: .8, ease: 'power2.inOut' }, 1.72)
      .to(select('.opening-light'), { opacity: 0.58, duration: 0.56, ease: 'sine.inOut' }, 1.57)
      .to(curtains, { xPercent: i => i === 0 ? -116 : 116, scaleX: 0.67, skewY: i => i === 0 ? 11 : -11, duration: 1.48, ease: 'power3.inOut' }, 1.9)
      .fromTo(title, { y: 30, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, stagger: 0.24, duration: 0.82, ease: 'power3.out' }, 2.68)
      .fromTo(select('.overture-names .word'), { yPercent: 117, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .23, duration: .72, ease: 'power3.out' }, 3.06)
      .to(select('.opening-light'), { opacity: 0, duration: 0.67 }, 2.38)
      .to(fireworks, { time: 4.55, duration: 5.02, ease: 'none', onUpdate: () => drawFireworks(fireworks.time) }, 1.96)
      .fromTo(select('.overture-art'), { scale: 1.13 }, { scale: 1, duration: 3.8, ease: 'power2.out' }, 2.02)
      .fromTo(select('.overture-copy .flourish'), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .87, ease: 'power2.out' }, 2.89)
      .to([overture, canvas], { opacity: 0, scale: 1.06, duration: .91, ease: 'sine.inOut' }, 5.91)
      .fromTo(blessing.querySelector('.blessing-frame'), { '--frame-draw': '0%', '--halo-light': 0 }, { '--frame-draw': '100%', '--halo-light': 1, duration: 1.3, ease: 'power2.out' }, 5.91)
      .fromTo(blessing.querySelectorAll('.diya-flame, .diya-glow'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: .18, duration: .48, ease: 'back.out(2)', clearProps: 'opacity,transform' }, 6.28)
      .fromTo(blessing.querySelector('.ganesha'), { filter: 'brightness(.44) sepia(.24)', opacity: .27 }, { filter: 'brightness(1) sepia(0)', opacity: 1, duration: 1.35, ease: 'sine.inOut', clearProps: 'opacity,filter' }, 6.62)
      .fromTo(blessing.querySelectorAll('.blessing-petals i'), { y: '-12vh', opacity: 0, rotation: -42 }, {
        keyframes: [{ opacity: .93, duration: .21 }, { y: '65vh', x: (i: number) => i % 2 ? 43 : -38, rotation: (i: number) => 140 + i * 17, opacity: 0, duration: 1.8, ease: 'sine.in' }],
        stagger: { each: .026, from: 'random' },
      }, 6.73)
      .fromTo(blessing.querySelectorAll('.blessing .word'), { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .095, duration: .64, ease: 'power3.out', clearProps: 'opacity,transform' }, 7.65)
      .fromTo(blessing.querySelectorAll('.blessing .flourish, .blessing .scroll-link'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: .39, duration: .66, ease: 'power2.out', clearProps: 'opacity,transform' }, 8.64)
  }
  function replay() {
    timeline.current?.kill()
    setHeart(false)
    if (location.hash) history.replaceState(null, '', location.pathname + location.search)
    setStage('closed')
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => openButton.current?.focus({ preventScroll: true }))
  }
  const directions = <a className="action" href={mapLink} target="_blank" rel="noopener noreferrer"><Icon name="pin"/>{copy.directions}</a>

  return <div className="app" style={theme}>
    <div className="controls">
      <div className="languages" aria-label={lang === 'en' ? 'Language' : 'భాష'}>
        <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        <button type="button" lang="te" aria-pressed={lang === 'te'} onClick={() => setLang('te')}>తెలుగు</button>
      </div>
      {wedding.music && <button className="music" type="button" onClick={toggleMusic} title={sound ? copy.soundOff : copy.soundOn} aria-label={sound ? copy.soundOff : copy.soundOn}><Icon name={sound ? 'sound' : 'mute'}/></button>}
    </div>
    {wedding.music && <audio ref={audio} src={wedding.music} preload="none" loop onError={() => { setSound(false); setAudioError(true) }}/>}
    {audioError && <p className="audio-error" role="status">{copy.audioError}</p>}
    {stage !== 'open' && <div className="gate" ref={cover} aria-hidden={stage === 'opening'}>
      <div className="overture" aria-hidden="true">
        <div className="overture-art"/>
        <div className="overture-copy">
          <p className="eyebrow overture-line">{copy.family}</p>
          <Flourish/>
          <p className="overture-names"><span className="overture-line"><Words>{copy.groom}</Words></span><i className="overture-line">&amp;</i><span className="overture-line"><Words>{copy.bride}</Words></span></p>
          <p className="eyebrow overture-line">{displayDate(lang, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="curtain left"/><div className="curtain right"/>
      <div className="opening-light"/><canvas className="fireworks" aria-hidden="true"/>
      <div className="door left"><div className="welcome-art"/></div><div className="door right"><div className="welcome-art"/></div>
      <div className="seam"><span className="seam-glow"/></div>
      <div className="seal-ring"/>
      <div className="seal" aria-hidden="true">
        <svg className="seal-paper" viewBox="0 0 180 190" fill="none">
          <defs>
            <linearGradient id="seal-stock" x1="0" y1="0" x2="180" y2="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff0d3"/><stop offset=".54" stopColor="#f3dcb6"/><stop offset="1" stopColor="#e3be87"/>
            </linearGradient>
            <path id="seal-cut" d="M90 5c12 0 14 10 24 11 13 0 19 3 25 14 3 7 13 8 20 15 8 9 4 18 10 26 4 7 7 15 7 24s-3 17-7 24c-6 8-2 17-10 26-7 7-17 8-20 15-6 11-12 14-25 14-10 1-12 11-24 11s-14-10-24-11c-13 0-19-3-25-14-3-7-13-8-20-15-8-9-4-18-10-26-4-7-7-15-7-24s3-17 7-24c6-8 2-17 10-26 7-7 17-8 20-15 6-11 12-14 25-14 10-1 12-11 24-11Z"/>
          </defs>
          <use href="#seal-cut" fill="url(#seal-stock)" stroke="#fff1ce" strokeWidth="2"/>
          <use href="#seal-cut" transform="translate(7.2 7.6) scale(.92)" stroke="#a47844" strokeWidth="1.2"/>
          <use href="#seal-cut" transform="translate(11.7 12.35) scale(.87)" stroke="#b78b53" strokeWidth=".65" opacity=".7"/>
          <path d="M27 68c2-13 12-11 15-20 2-8 12-11 19-8m-23 15c7 1 11-4 10-9M153 68c-2-13-12-11-15-20-2-8-12-11-19-8m23 15c-7 1-11-4-10-9M27 122c2 13 12 11 15 20 2 8 12 11 19 8m-23-15c7-1 11 4 10 9m105-22c-2 13-12 11-15 20-2 8-12 11-19 8m23-15c-7-1-11 4-10 9" stroke="#9c7043" strokeWidth=".8" strokeLinecap="round"/>
        </svg>
        <div className="seal-copy">
          <span className="seal-monogram">{wedding.monogram[0]} <i>&amp;</i> {wedding.monogram[1]}</span>
          <span className="seal-label">{copy.sealLabel}</span>
          <Icon name="arrow" size={14}/>
        </div>
      </div>
      <button className="cover-trigger" ref={openButton} type="button" aria-label={copy.open} disabled={stage === 'opening'} onClick={openInvitation}/>
      {!loaded && stage === 'closed' && <div className="loader" aria-busy="true"><Monogram/></div>}
    </div>}
    <main ref={invitation} inert={stage !== 'open'} className={stage === 'closed' ? 'closed' : ''}>
      <div ref={content}>
        <h1 className="sr-only">{names}</h1>
        <section className="blessing paper">
          <DriftingPetals/>
          <div className="blessing-frame">
            <svg className="diya-defs" width="0" height="0" aria-hidden="true"><defs>
              <radialGradient id="diya-light"><stop stopColor="#ffc35e" stopOpacity=".75"/><stop offset="1" stopColor="#ffc35e" stopOpacity="0"/></radialGradient>
              <linearGradient id="diya-brass"><stop stopColor="#86501e"/><stop offset=".48" stopColor="#e4ae51"/><stop offset="1" stopColor="#895024"/></linearGradient>
            </defs></svg>
            <BlessingPetals/>
            <p className="eyebrow"><Words>{copy.invocation}</Words></p>
            <div className="deity-stage">
              <div className="deity-halo" aria-hidden="true"/>
              <Art src={wedding.art.ganesha} className="ganesha"/>
              <div className="diya-left"><Diya/></div><div className="diya-right"><Diya/></div>
            </div>
            <Flourish/>
            <h2 ref={start} tabIndex={-1}><Words>{copy.blessings}</Words></h2>
            <a href="#couple" className="scroll-link">{copy.scroll}<Icon name="arrow" size={17}/></a>
          </div>
        </section>
        <section id="couple" className="couple paper">
          <DriftingPetals/>
          <Art src={wedding.art.flowers} className="couple-art"/>
          <div className="couple-inner reveal">
            <Monogram/>
            <p className="eyebrow">{copy.family}</p>
            <p className="couple-invite"><Words>{copy.invite}</Words></p>
            <Flourish/>
            {wedding.photos.groom && <Art src={wedding.photos.groom} className="portrait"/>}
            <h2><Words>{copy.groom}</Words></h2><div className="weds-divider"><span>{copy.weds}</span></div>
            {wedding.photos.bride && <Art src={wedding.photos.bride} className="portrait"/>}
            <h2><Words>{copy.bride}</Words></h2><p className="alternate">({copy.alternate})</p>
            <Flourish/>
          </div>
        </section>
        <section className="heart-scene night">
          <DriftingPetals/>
          <div className="reveal">
            <p className="eyebrow">{copy.heartTitle}</p>
            <div className={heart ? "heart-wrap heart-open" : "heart-wrap"}>
              <div className="heart-halo" aria-hidden="true"/>
              <Petals visible={heart}/>
              {heart && <span className="heart-wave" aria-hidden="true"><i/><i/><i/></span>}
              <button type="button" onClick={() => setHeart(true)} className={heart ? 'heart touched' : 'heart'} aria-expanded={heart} aria-controls="wedding-details" aria-label={copy.heart}>
                <svg aria-hidden="true" viewBox="0 0 200 184" fill="none">
                  <defs>
                    <linearGradient id="foil" x1="0%" x2="100%" y1="0%" y2="100%"><stop stopColor="#f7deb4"/><stop offset=".47" stopColor="#b3844a"/><stop offset=".68" stopColor="#f0cc92"/><stop offset="1" stopColor="#946330"/></linearGradient>
                    <clipPath id="heart-left"><path d="M0 0h100v184H0z"/></clipPath>
                    <clipPath id="heart-right"><path d="M100 0h100v184H100z"/></clipPath>
                    <g id="heart-foil">
                      <path d="M100 170C82 155 17 118 12 70 6 22 63 1 100 44c37-43 94-22 88 26-5 48-70 85-88 100Z" fill="url(#foil)"/>
                      <path d="M100 153C82 139 30 108 25 70c-5-37 43-53 75-11 32-42 80-26 75 11-5 38-57 69-75 83Z" stroke="#69481f" strokeWidth="1.2"/>
                      <path d="M100 135c0-35 3-40 37-55-4 30-15 38-37 55Zm0 0c0-35-3-40-37-55 4 30 15 38 37 55Zm0 0c-13-18-15-34 0-58 15 24 13 40 0 58Z" stroke="#674623" strokeWidth="1.3"/>
                    </g>
                  </defs>
                  <g className="heart-inner">
                    <path d="M100 137C87 125 51 104 48 79c-4-28 29-38 52-11 23-27 56-17 52 11-3 25-39 46-52 58Z" fill="#f6e2be"/>
                    <path d="m100 75 5 13 13 5-13 5-5 13-5-13-13-5 13-5Z" fill="#946036"/>
                  </g>
                  <g className="heart-shell heart-left"><use href="#heart-foil" clipPath="url(#heart-left)"/></g>
                  <g className="heart-shell heart-right"><use href="#heart-foil" clipPath="url(#heart-right)"/></g>
                </svg>
              </button>
            </div>
            <div className="heart-caption" aria-live="polite">{heart ? <p className="love-message"><Words>{copy.love}</Words></p> : <p>{copy.heart}</p>}</div>
            {heart && <a className="scroll-link" href="#wedding-details">{copy.continue}<Icon name="arrow" size={17}/></a>}
          </div>
        </section>
        <div id="wedding-details" hidden={!heart}>
          <section className="date-scene paper">
            <div className="reveal">
              <p className="eyebrow">{copy.save}</p>
              <time dateTime={wedding.date}>
                <span>{displayDate(lang, { day: '2-digit' })}</span>
                <strong>{displayDate(lang, { month: 'long' })}</strong>
                <b>{displayDate(lang, { year: 'numeric' })}</b>
                <small>{displayDate(lang, { weekday: 'long' })}</small>
              </time>
              <Flourish/>
            </div>
          </section>
          <Countdown copy={copy}/>
          <section className="split ceremony paper">
            <Art src={wedding.art.ceremony} className="split-art" loading={heart ? "eager" : "lazy"}/>
            <div className="split-copy reveal">
              <p className="eyebrow">{copy.ceremonyLabel}</p><h2>{copy.ceremony}</h2><Flourish/>
              <div className="ceremony-datetime">
                <p>{fullDate(lang)}</p>
                <time dateTime={weddingInstant.toISOString()}>{displayTime(lang, wedding.muhurtham)} <small>IST</small></time>
              </div>
            </div>
          </section>
          <section className="split dinner">
            <svg className="split-art dinner-illustration" viewBox="0 0 764 508" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <image href={wedding.art.dinner} width="764" height="508"/>
              <path className="serving-stream" d="M359 299c7 8 9 19 11 28" fill="none" stroke="#ecad52" strokeWidth="4" strokeLinecap="round" pathLength="1"/>
              <circle className="serving-drop" cx="365" cy="304" r="3" fill="#f3b65c"/>
              <g className="serving-steam" fill="none" stroke="#fff7de" strokeWidth="2" strokeLinecap="round"><path d="M445 270q-6-9 2-17t-1-16"/><path d="M461 265q-7-10 2-20t0-17"/><path d="M477 269q-7-9 0-17t2-16"/></g>
            </svg>
            <div className="split-copy reveal">
              <p className="eyebrow">{copy.dinnerLabel}</p><h2>{copy.dinner}</h2><Flourish/>
              <p>{fullDate(lang)}</p><p className="event-time">{lang === 'en' && copy.from + ' '}{displayTime(lang, wedding.dinner)}{lang === 'te' && ' ' + copy.from}</p><p>{copy.dinnerNote}</p>
            </div>
          </section>
          <section className="venue paper">
            <Art src={wedding.art.village} className="venue-art" loading={heart ? "eager" : "lazy"}/>
            <div className="village-light" aria-hidden="true"/>
            <div className="venue-frame reveal">
              <VenueOrnament/><p className="eyebrow">{copy.venue}</p><h2>{copy.place}</h2>
              <address>{copy.address}</address><Flourish/>{directions}
              <p className="map-note">{copy.villageIllustration}</p>
              {!wedding.mapsUrl && <p className="map-note">{copy.mapNote}</p>}
            </div>
          </section>
          <section className="family paper">
            <DriftingPetals/>
            <div className="family-card reveal">
              <Monogram/><h2><Words>{copy.families}</Words></h2><Flourish/>
              <div className="family-grid">
                <article className="family-panel">
                  <Art src={wedding.art.groomFamily} className="family-portrait"/>
                  <div className="family-caption">
                    <h3 className="eyebrow">{copy.groomFamily}</h3>
                    <p>{copy.groomParents}</p>
                    <small>{copy.groom} · {copy.groomRelation}</small>
                  </div>
                </article>
                <article className="family-panel">
                  <Art src={wedding.art.brideFamily} className="family-portrait"/>
                  <div className="family-caption">
                    <h3 className="eyebrow">{copy.brideFamily}</h3>
                    <p>{copy.brideParents}</p>
                    <small>{copy.brideHometown}</small>
                    <small>{copy.bride} · {copy.brideRelation}</small>
                  </div>
                </article>
              </div>
              <p className="portrait-note">{copy.familyIllustration}</p>
              <Flourish/>
              <div className="family-dedications">
                <div className="family-dedication">
                  <p>{copy.brotherDedication}</p>
                  <h3>{copy.brotherName}</h3>
                </div>
                <div className="family-dedication">
                  <p>{copy.sisterDedication}</p>
                  <h3>{copy.sisterNames}</h3>
                </div>
              </div>
            </div>
          </section>
          <footer className="closing night">
            <div className="closing-art" aria-hidden="true"/>
            <canvas className="closing-fireworks" aria-hidden="true"/>
            <DriftingPetals count={16}/>
            <div className="closing-composition">
              <Art src={wedding.art.namasteLeft} className="closing-namaste namaste-left"/>
              <div className="reveal closing-copy">
                <Monogram/><h2><Words>{copy.closing}</Words></h2><p><Words>{copy.farewell}</Words></p><Flourish/>
                <p className="signature">{names}</p><p className="eyebrow">{copy.family}</p>
                <div className="closing-actions flex flex-wrap justify-center">
                  <button type="button" className="action" onClick={replay}><Icon name="replay"/>{copy.replay}</button>
                  <a className="action" href={shareUrl} target="_blank" rel="noopener noreferrer"><Icon name="share"/>{copy.share}</a>
                  {directions}
                </div>
              </div>
              <Art src={wedding.art.namasteRight} className="closing-namaste namaste-right"/>
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>
}

createRoot(document.getElementById('root')!).render(<App/>)
