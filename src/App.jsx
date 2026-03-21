import { useEffect, useState, useRef } from 'react'
import './App.css'

/* ─── CONFIG ─────────────────────────────────────────── */
const CV_SITE_URL = 'https://tudor-halasag.github.io'

/* ─── DATA ───────────────────────────────────────────── */
const LOGOS = [
  { id: 'L1', title: 'Logo Project 01', sub: 'Brand Identity', placeholder: true },
  { id: 'L2', title: 'Logo Project 02', sub: 'Wordmark Design', placeholder: true },
  { id: 'L3', title: 'Logo Project 03', sub: 'Monogram Mark', placeholder: true },
  { id: 'L4', title: 'Logo Project 04', sub: 'Logomark System', placeholder: true },
  { id: 'L5', title: 'Logo Project 05', sub: 'Brand System', placeholder: true },
  { id: 'L6', title: 'Logo Project 06', sub: 'Visual Identity', placeholder: true },
]

const CAD_ITEMS = [
  { id: 'C1', title: 'Assembly 01', sub: 'Mechanical Design · CATIA V6', spec: ['Material: Steel S235', 'Tolerance: ±0.05mm', 'DOF: 3'], placeholder: true },
  { id: 'C2', title: 'Part Design 02', sub: 'Parametric Modelling · AutoCAD', spec: ['Material: Aluminium 6061', 'Surface: Ra 1.6μm', 'Mass: 0.84 kg'], placeholder: true },
  { id: 'C3', title: 'Assembly 03', sub: 'Structural Analysis · SolidWorks', spec: ['FOS: 2.4', 'Max Stress: 187 MPa', 'Deflection: 0.3mm'], placeholder: true },
  { id: 'C4', title: 'Component 04', sub: 'Sheet Metal · CATIA V6', spec: ['Thickness: 2mm', 'Bend Radius: 3mm', 'Unfold: 340×180mm'], placeholder: true },
]

const TRACKS = [
  { id: 'T1', title: 'Untitled Track 01', genre: 'Rock / Metal', bpm: '90 BPM', key: 'D Minor', duration: '—', src: null },
  { id: 'T2', title: 'Untitled Track 02', genre: 'Progressive Metal', bpm: '—', key: '—', duration: '—', src: null },
  { id: 'T3', title: 'Untitled Track 03', genre: 'Ambient / Electronic', bpm: '—', key: '—', duration: '—', src: null },
]

const OTHER = [
  { id: 'O1', icon: '🎨', title: 'Adobe Illustrator Work', sub: 'Vector illustration & graphic design', placeholder: true },
  { id: 'O2', icon: '⚡', title: 'Circuit Schematics', sub: 'LTspice & Tina-TI simulation outputs', placeholder: true },
  { id: 'O3', icon: '📐', title: 'Technical Drawings', sub: 'Engineering documentation & blueprints', placeholder: true },
]

/* ─── HOOKS ──────────────────────────────────────────── */
function useScrollFade() {
  useEffect(() => {
    const els = document.querySelectorAll('.sf')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const siblings = Array.from(e.target.parentElement.querySelectorAll('.sf:not(.in)'))
          const idx = siblings.indexOf(e.target)
          setTimeout(() => e.target.classList.add('in'), Math.min(idx * 90, 500))
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useActiveNav(setActive) {
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const io = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [setActive])
}

/* ─── AUDIO PLAYER ───────────────────────────────────── */
function AudioPlayer({ track }) {
  const [playing, setPlaying]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  function togglePlay() {
    if (!track.src) return
    const a = audioRef.current
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  function handleTimeUpdate() {
    const a = audioRef.current
    if (a.duration) setProgress(a.currentTime / a.duration)
  }

  function handleLoaded() { setDuration(audioRef.current.duration) }

  function handleSeek(e) {
    if (!track.src) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * audioRef.current.duration
    setProgress(pct)
  }

  function handleEnded() { setPlaying(false); setProgress(0) }

  function fmt(s) {
    if (!s || isNaN(s)) return '—'
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2,'0')}`
  }

  return (
    <div className={`player-card sf${playing ? ' playing' : ''}`}>
      {track.src && (
        <audio ref={audioRef} src={track.src}
          onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoaded}
          onEnded={handleEnded} preload="metadata"
          onContextMenu={e => e.preventDefault()} controlsList="nodownload" />
      )}
      <div className="player-meta">
        <div className="player-info">
          <span className="player-title">{track.title}</span>
          <span className="player-genre">{track.genre}</span>
        </div>
        <div className="player-specs">
          <span className="spec-chip">{track.bpm}</span>
          <span className="spec-chip">{track.key}</span>
        </div>
      </div>
      <div className="player-controls">
        <button className="play-btn" onClick={togglePlay} disabled={!track.src}
          aria-label={playing ? 'Pause' : 'Play'}>
          {playing
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          }
        </button>
        <div className="scrubber" onClick={handleSeek}>
          <div className="scrubber-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="player-time">{track.src ? fmt(duration) : 'Soon'}</span>
      </div>
    </div>
  )
}

/* ─── LOGO CARD ──────────────────────────────────────── */
function LogoCard({ item }) {
  return (
    <div className="logo-card sf">
      <div className="logo-canvas">
        <div className="logo-ph">
          <span className="logo-ph-label">[ {item.id} ]</span>
          <div className="logo-ph-cross"><span/><span/></div>
        </div>
      </div>
      <div className="logo-footer">
        <span className="logo-title">{item.title}</span>
        <span className="logo-sub">{item.sub}</span>
      </div>
    </div>
  )
}

/* ─── CAD CARD ───────────────────────────────────────── */
function CadCard({ item }) {
  return (
    <div className="cad-card sf">
      <div className="cad-canvas">
        <div className="cad-ph">
          <div className="cad-wireframe">
            {[...Array(5)].map((_,i) => <div key={i} className="wf-line" style={{'--i':i}}/>)}
            <div className="cad-box"/>
          </div>
          <span className="cad-ph-label">[ {item.id} ]</span>
        </div>
        <div className="cad-overlay-tl">{item.spec[0]}</div>
        <div className="cad-overlay-br">{item.spec[2]}</div>
      </div>
      <div className="cad-footer">
        <div>
          <span className="cad-title">{item.title}</span>
          <span className="cad-sub">{item.sub}</span>
        </div>
        <div className="cad-specs">
          {item.spec.map(s => <span key={s} className="spec-chip mono">{s}</span>)}
        </div>
      </div>
    </div>
  )
}

/* ─── NAV ────────────────────────────────────────────── */
const NAV_LINKS = [
  { id: 'identity',    label: '01 Identity' },
  { id: 'engineering', label: '02 Engineering' },
  { id: 'music',       label: '03 Music' },
  { id: 'other',       label: '04 Other' },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
}

/* ─── LOGO SVG (inlined TAH logo, recolored white) ───── */
function TahLogo({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill={color}>
      <g transform="translate(0,1024) scale(0.1,-0.1)">
        <path d="M1280 6460 c0 -5 59 -62 132 -127 73 -65 165 -148 206 -185 l73 -68 455 0 454 0 2 -880 3 -881 95 90 c52 49 177 165 277 258 l181 168 1 623 1 622 666 0 665 0 46 43 c225 207 357 330 361 337 1 3 -812 6 -1808 7 -1068 2 -1810 -1 -1810 -7z"/>
        <path d="M8270 6156 l0 -316 -845 0 -845 0 0 310 0 310 -515 0 c-283 0 -515 -3 -515 -6 0 -4 31 -38 68 -78 38 -39 149 -157 248 -261 98 -105 282 -299 408 -433 l229 -242 883 0 884 0 0 -378 0 -377 278 -227 277 -226 3 1111 c1 610 1 1111 0 1113 -2 1 -128 5 -280 9 l-278 7 0 -316z"/>
        <path d="M5015 6372 c-49 -48 -151 -144 -225 -212 -74 -69 -173 -161 -220 -205 -190 -179 -592 -550 -990 -915 -457 -419 -714 -660 -708 -665 2 -1 84 17 183 41 99 24 338 80 530 125 l350 81 215 214 215 214 820 0 820 -1 190 -204 c116 -125 197 -204 209 -204 11 -1 177 -26 369 -57 192 -30 357 -54 366 -52 13 2 -55 80 -237 273 -264 280 -937 995 -1166 1240 -72 77 -170 180 -217 230 -47 49 -105 111 -129 138 l-43 47 -121 0 -121 0 -90 -88z m387 -657 c79 -82 168 -176 197 -207 l54 -58 -479 0 -479 0 212 210 211 209 49 3 c26 2 58 1 69 -2 12 -3 87 -72 166 -155z"/>
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [scrolled,  setScrolled]  = useState(false)
  const [activeNav, setActiveNav] = useState('')
  const [menuOpen,  setMenuOpen]  = useState(false)

  useScrollFade()
  useActiveNav(setActiveNav)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleNav(id) { scrollTo(id); setMenuOpen(false) }

  return (
    <div className="app">

      {/* GRID OVERLAY */}
      <div className="grid-overlay" aria-hidden="true"/>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a href={CV_SITE_URL} className="nav-logo" aria-label="Back to CV">
            <TahLogo size={120} color="#fff"/>
            <span className="nav-logo-text">WORKS</span>
          </a>
          <ul className="nav-links">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <button className={`nav-link${activeNav === id ? ' active' : ''}`}
                  onClick={() => handleNav(id)}>{label}</button>
              </li>
            ))}
          </ul>
          <a href={CV_SITE_URL} className="nav-cv-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to CV
          </a>
          <button className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          <div className="mobile-backdrop" onClick={() => setMenuOpen(false)}/>
          <div className="mobile-inner">
            {NAV_LINKS.map(({ id, label }, i) => (
              <button key={id} className="mobile-link" style={{'--i': i}}
                onClick={() => handleNav(id)}>{label}</button>
            ))}
            <a href={CV_SITE_URL} className="mobile-cv-link">← Back to CV</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow anim" style={{'--d':'0s'}}>Tudor-Andrei Hălășag</p>
          <h1 className="hero-title anim" style={{'--d':'0.12s'}}>
            Selected<br/><em>Works</em>
          </h1>
          <p className="hero-sub anim" style={{'--d':'0.26s'}}>
            Visual identity, engineering design &amp; audio production.
          </p>
          <div className="hero-tags anim" style={{'--d':'0.4s'}}>
            {['Branding','CAD / Engineering','Music Production','Illustration'].map(t => (
              <span key={t} className="hero-tag">{t}</span>
            ))}
          </div>
          <div className="hero-scroll anim" style={{'--d':'0.6s'}}>
            <span>scroll</span>
            <div className="scroll-line"/>
          </div>
        </div>
        <div className="hero-accent-text" aria-hidden="true">PORTFOLIO</div>
      </section>

      {/* ── SECTION 01: VISUAL IDENTITY ── */}
      <section id="identity" className="section">
        <div className="container">
          <div className="sec-header sf">
            <div className="sec-num">01</div>
            <div>
              <h2 className="sec-title">Visual Identity</h2>
              <p className="sec-desc">Logo design, brand systems &amp; visual language — built in Adobe Illustrator.</p>
            </div>
          </div>
          <div className="logo-grid">
            {LOGOS.map(item => <LogoCard key={item.id} item={item}/>)}
          </div>
        </div>
      </section>

      {/* ── SECTION 02: ENGINEERING ── */}
      <section id="engineering" className="section">
        <div className="container">
          <div className="sec-header sf">
            <div className="sec-num">02</div>
            <div>
              <h2 className="sec-title">Technical Engineering</h2>
              <p className="sec-desc">CAD models, assemblies &amp; parametric designs — CATIA V6, AutoCAD, SolidWorks.</p>
            </div>
          </div>
          <div className="cad-grid">
            {CAD_ITEMS.map(item => <CadCard key={item.id} item={item}/>)}
          </div>
        </div>
      </section>

      {/* ── SECTION 03: MUSIC ── */}
      <section id="music" className="section">
        <div className="container">
          <div className="sec-header sf">
            <div className="sec-num">03</div>
            <div>
              <h2 className="sec-title">Music Works</h2>
              <p className="sec-desc">Original compositions in rock, metal &amp; electronic — stream only, no download.</p>
            </div>
          </div>
          <div className="tracks-list">
            {TRACKS.map(t => <AudioPlayer key={t.id} track={t}/>)}
          </div>
          <p className="music-note sf">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Audio streams are protected. Playback only — downloading is disabled.
          </p>
        </div>
      </section>

      {/* ── SECTION 04: OTHER ── */}
      <section id="other" className="section">
        <div className="container">
          <div className="sec-header sf">
            <div className="sec-num">04</div>
            <div>
              <h2 className="sec-title">Other Creative Work</h2>
              <p className="sec-desc">Illustration, circuit schematics, technical drawings &amp; more.</p>
            </div>
          </div>
          <div className="other-grid">
            {OTHER.map(item => (
              <div key={item.id} className="other-card sf">
                <span className="other-icon">{item.icon}</span>
                <h3 className="other-title">{item.title}</h3>
                <p className="other-sub">{item.sub}</p>
                <div className="other-ph">
                  <span className="other-ph-label">[ Coming Soon ]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <a href={CV_SITE_URL} className="footer-logo" aria-label="Back to CV">
            <TahLogo size={80} color="rgba(255,255,255,0.5)"/>
          </a>
          <span className="footer-sep">·</span>
          <span>© 2026 Tudor-Andrei Hălășag</span>
          <span className="footer-sep">·</span>
          <a href={CV_SITE_URL} className="footer-cv-link">tudor-halasag.github.io</a>
        </div>
      </footer>

    </div>
  )
}
