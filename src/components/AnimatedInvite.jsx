import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, MapPin, Globe, Check, ChevronDown, Send } from 'lucide-react';

/**
 * AnimatedInvite - one theme-driven, JS-animated invitation for EVERY template.
 *
 * Theme (colors / fonts / ornament) is read from the template's default_data:
 *   bgColor, primaryColor, accentColor, textColor, subTextColor,
 *   fontFamily, scriptFont, ornament
 *
 * Effects: 3D door / curtain / split reveal, canvas particles (sparkles, petals,
 * leaves, lantern embers), shimmering names, drawing corner ornaments, spinning
 * mandala ring, scratch-to-reveal date with sparkle burst, live countdown,
 * scroll-reveal sections, Ken-Burns slideshow, music, RSVP, EN/HI toggle.
 *
 * Props: data, watermark (bool), watermarkText, onRsvp, className
 */

/* ---------------- colour helpers ---------------- */
const hex = (h) => {
  let s = (h || '#000000').replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
const lum = (c) => {
  const [r, g, b] = hex(c);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
const rgba = (c, a) => {
  const [r, g, b] = hex(c);
  return `rgba(${r},${g},${b},${a})`;
};

function buildTheme(d) {
  const bg = d.bgColor || '#04271D';
  const primary = d.primaryColor || '#0B3B2C';
  const accent = d.accentColor || '#D8B35A';
  const text = d.textColor || '#F6EBD3';
  const dark = lum(bg) < 0.5;
  return {
    bg, primary, accent, text, dark,
    alt: dark ? mix(bg, primary, 0.55) : mix(bg, primary, 0.07),
    deep: dark ? mix(bg, '#000000', 0.35) : mix(bg, primary, 0.14),
    heading: dark ? mix(accent, '#ffffff', 0.35) : primary,
    muted: rgba(text, 0.8),
    line: rgba(accent, 0.5),
    card: dark ? rgba(text, 0.06) : 'rgba(255,255,255,0.75)',
    btnBg: dark ? accent : primary,
    btnText: dark ? bg : '#ffffff',
    panelA: dark ? mix(bg, '#000000', 0.3) : primary,
    panelB: dark ? mix(bg, primary, 0.6) : mix(primary, '#000000', 0.3),
    nameGrad: dark
      ? [accent, mix(accent, '#ffffff', 0.7), accent]
      : [primary, mix(primary, accent, 0.6), primary],
  };
}

const FX = {
  'palace-arch': { intro: 'doors', particle: 'sparkle' },
  'emerald-frame': { intro: 'doors', particle: 'sparkle' },
  'door-reveal': { intro: 'doors', particle: 'sparkle' },
  'mandala-lotus': { intro: 'doors', particle: 'sparkle' },
  'jharokha-lanterns': { intro: 'doors', particle: 'ember' },
  'floral-rose-arch': { intro: 'curtain', particle: 'petal' },
  'botanical-arch': { intro: 'curtain', particle: 'petal' },
  'vintage-monogram': { intro: 'curtain', particle: 'petal' },
  'eucalyptus-wreath': { intro: 'split', particle: 'leaf' },
};

const I18N = {
  en: {
    open: 'Tap to open', scratch: 'Scratch to reveal the date', scratchDone: 'Save the date',
    countdown: 'Counting down to our day', days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs',
    programme: 'Celebration Programme', venue: 'The Venue', directions: 'Get Directions',
    dress: 'Dress Code', gallery: 'Our Moments', rsvp: 'RSVP', rsvpTitle: 'Will you celebrate with us?',
    name: 'Your name', guests: 'Guests', accept: 'Joyfully accept', decline: 'Regretfully decline',
    message: 'Leave a blessing (optional)', send: 'Send response', thanks: 'Thank you',
    thanksSub: 'Your response has been sent to the couple.', scroll: 'Scroll', lang: 'हिन्दी',
    withLove: 'With love & blessings',
  },
  hi: {
    open: 'खोलने के लिए टैप करें', scratch: 'तारीख देखने के लिए स्क्रैच करें', scratchDone: 'तारीख याद रखें',
    countdown: 'हमारे दिन की उलटी गिनती', days: 'दिन', hours: 'घंटे', mins: 'मिनट', secs: 'सेकंड',
    programme: 'कार्यक्रम', venue: 'स्थान', directions: 'रास्ता देखें',
    dress: 'ड्रेस कोड', gallery: 'हमारे पल', rsvp: 'RSVP', rsvpTitle: 'क्या आप हमारे साथ जश्न मनाएँगे?',
    name: 'आपका नाम', guests: 'अतिथि', accept: 'खुशी से स्वीकार', decline: 'क्षमा करें, नहीं आ पाएँगे',
    message: 'आशीर्वाद लिखें (वैकल्पिक)', send: 'जवाब भेजें', thanks: 'धन्यवाद',
    thanksSub: 'आपका जवाब जोड़े तक पहुँच गया है।', scroll: 'स्क्रॉल करें', lang: 'English',
    withLove: 'प्रेम और आशीर्वाद सहित',
  },
};

const CSS = `
@keyframes wi-fadeup{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes wi-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes wi-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes wi-draw{to{stroke-dashoffset:0}}
@keyframes wi-spin{to{transform:rotate(360deg)}}
@keyframes wi-pulse{0%,100%{box-shadow:0 0 0 0 var(--wi-glow)}50%{box-shadow:0 0 0 16px rgba(0,0,0,0)}}
@keyframes wi-kenburns{from{transform:scale(1)}to{transform:scale(1.14)}}
@keyframes wi-burst{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
@keyframes wi-glow{0%,100%{opacity:.35}50%{opacity:.75}}
`;

/* ---------------- Watermark ---------------- */
function Watermark({ text = 'PREVIEW • WEDDINVITES' }) {
  const tile = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><text x='160' y='100' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 160 100)' font-family='Arial,sans-serif' font-size='20' font-weight='700' letter-spacing='3' fill='white' fill-opacity='0.32' stroke='black' stroke-opacity='0.2' stroke-width='0.6'>${text}</text></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [text]);
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 z-[60]"
        style={{ backgroundImage: tile, backgroundRepeat: 'repeat' }} />
      <div aria-hidden="true"
        className="pointer-events-none select-none sticky bottom-0 z-[61] w-full text-center text-[10px] font-bold tracking-[0.2em] uppercase py-1.5"
        style={{ background: 'rgba(0,0,0,0.75)', color: '#f5e2a8' }}>
        Preview • Buy template to remove watermark
      </div>
    </>
  );
}

/* ---------------- Particles (canvas) ---------------- */
function Particles({ type, color, count = 28 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return undefined;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, raf = 0;
    const fit = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    fit();
    const rnd = (a, b) => a + Math.random() * (b - a);
    const make = (init) => ({
      x: rnd(0, w),
      y: type === 'ember' ? (init ? rnd(0, h) : h + 10) : type === 'sparkle' ? rnd(0, h) : (init ? rnd(-h, h) : -20),
      s: type === 'sparkle' ? rnd(2, 5) : type === 'ember' ? rnd(1.5, 3.5) : rnd(6, 12),
      vy: type === 'ember' ? -rnd(0.3, 0.9) : type === 'sparkle' ? 0 : rnd(0.4, 1.1),
      vx: rnd(-0.3, 0.3), r: rnd(0, 6.28), vr: rnd(-0.03, 0.03), ph: rnd(0, 6.28), sp: rnd(0.012, 0.035),
    });
    const ps = Array.from({ length: count }, () => make(true));
    const draw = (p) => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = color;
      if (type === 'sparkle') {
        const a = 0.2 + 0.8 * Math.abs(Math.sin(p.ph)); const s = p.s * (0.6 + 0.6 * a);
        ctx.globalAlpha = a; ctx.beginPath();
        ctx.moveTo(0, -s * 2); ctx.quadraticCurveTo(0, 0, s * 2, 0); ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0); ctx.quadraticCurveTo(0, 0, 0, -s * 2); ctx.fill();
      } else if (type === 'ember') {
        ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(p.ph));
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.s * 3);
        g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, p.s * 3, 0, 6.28); ctx.fill();
      } else if (type === 'leaf') {
        ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.ellipse(0, 0, p.s * 1.4, p.s * 0.5, 0, 0, 6.28); ctx.fill();
      } else {
        ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.moveTo(0, -p.s);
        ctx.quadraticCurveTo(p.s, -p.s * 0.3, 0, p.s); ctx.quadraticCurveTo(-p.s, -p.s * 0.3, 0, -p.s); ctx.fill();
      }
      ctx.restore();
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ps.forEach((p, i) => {
        p.ph += p.sp * 2; p.r += p.vr;
        if (type !== 'sparkle') {
          p.x += p.vx + Math.sin(p.ph) * 0.5; p.y += p.vy;
          if (type === 'ember' ? p.y < -20 : p.y > h + 20) ps[i] = make(false);
        }
        draw(p);
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', fit);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }, [type, color, count]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ---------------- Scroll reveal ---------------- */
function Reveal({ children, delay = 0, from = 'up', className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const start = from === 'left' ? 'translateX(-34px)' : from === 'right' ? 'translateX(34px)' : from === 'zoom' ? 'scale(.92)' : 'translateY(30px)';
  return (
    <div ref={ref} className={className}
      style={{ opacity: on ? 1 : 0, transform: on ? 'none' : start, transition: `opacity .9s ease ${delay}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- Scratch card ---------------- */
function ScratchDate({ label, caption, doneCaption, T, F }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const sparks = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2; const r = 70 + Math.random() * 60;
    return { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.7 };
  }), []);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, mix(T.accent, '#000000', 0.25)); g.addColorStop(0.5, mix(T.accent, '#ffffff', 0.45)); g.addColorStop(1, mix(T.accent, '#000000', 0.15));
    ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.font = '600 14px Cinzel, serif'; ctx.textAlign = 'center';
    ctx.fillText('✦  SCRATCH HERE  ✦', c.width / 2, c.height / 2 + 5);
  }, [T.accent]);

  const scratch = (e) => {
    if (!drawing.current || revealed) return;
    const c = canvasRef.current; const rect = c.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    const x = ((p.clientX - rect.left) / rect.width) * c.width;
    const y = ((p.clientY - rect.top) / rect.height) * c.height;
    const ctx = c.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 160) { total++; if (data[i] === 0) clear++; }
    if (clear / total > 0.45) setRevealed(true);
  };

  return (
    <div className="text-center">
      <p className="text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: T.accent, fontFamily: F.head }}>
        {revealed ? doneCaption : caption}
      </p>
      <div className="relative mx-auto" style={{ width: 280, height: 110 }}>
        <div className="absolute inset-0 rounded-2xl overflow-hidden border flex items-center justify-center"
          style={{ borderColor: T.accent, background: T.deep, touchAction: 'none' }}>
          <span className="text-xl tracking-wider px-2" style={{ color: T.heading, fontFamily: F.head }}>{label}</span>
          <canvas ref={canvasRef} width={280} height={110}
            className={`absolute inset-0 transition-opacity duration-700 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
            onMouseDown={() => (drawing.current = true)} onMouseUp={() => (drawing.current = false)}
            onMouseLeave={() => (drawing.current = false)} onMouseMove={scratch}
            onTouchStart={() => (drawing.current = true)} onTouchEnd={() => (drawing.current = false)} onTouchMove={scratch} />
        </div>
        {revealed && sparks.map((s, i) => (
          <span key={i} className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, color: T.accent, fontSize: 14, animation: 'wi-burst 1.2s ease-out forwards' }}>✦</span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Countdown ---------------- */
function parseTarget(d) {
  const w = d.weddingDate || '';
  if (/^\d{4}-\d{2}-\d{2}/.test(w)) return new Date(w).getTime();
  const time = (d.weddingTime || '').replace(/onwards/i, '').trim();
  let t = Date.parse(`${w} ${time}`);
  if (Number.isNaN(t)) t = Date.parse(w);
  return Number.isNaN(t) ? Date.now() + 30 * 86400000 : t;
}
function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return { d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [target]);
  return t;
}

/* ---------------- Intro (door / curtain / split) ---------------- */
function Intro({ mode, opened, onOpen, T, F, initials, hint }) {
  const ease = 'cubic-bezier(.65,0,.25,1)';
  const dur = mode === 'curtain' ? '1.8s' : '1.5s';
  const fabric = `repeating-linear-gradient(90deg, ${mix(T.panelA, '#000000', 0.18)} 0 14px, ${T.panelA} 14px 28px)`;

  const panels = mode === 'split'
    ? ['top', 'bottom'].map((side) => (
      <div key={side} className="absolute left-0 w-full" style={{
        height: '50%', [side === 'top' ? 'top' : 'bottom']: 0, background: `linear-gradient(${side === 'top' ? '180deg' : '0deg'}, ${T.panelA}, ${T.panelB})`,
        transform: opened ? `translateY(${side === 'top' ? '-101%' : '101%'})` : 'none', transition: `transform ${dur} ${ease}`,
        borderBottom: side === 'top' ? `1px solid ${T.accent}` : 'none', borderTop: side === 'bottom' ? `1px solid ${T.accent}` : 'none',
      }} />))
    : ['left', 'right'].map((side) => (
      <div key={side} className="absolute top-0 h-full" style={{
        width: '50%', [side]: 0,
        background: mode === 'curtain' ? fabric : `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, ${T.panelA}, ${T.panelB})`,
        transformOrigin: side === 'left' ? 'left center' : 'right center',
        transform: opened ? (mode === 'curtain' ? 'scaleX(0)' : `rotateY(${side === 'left' ? -105 : 105}deg)`) : 'none',
        transition: `transform ${dur} ${ease}`, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.45)',
        [side === 'left' ? 'borderRight' : 'borderLeft']: `${mode === 'curtain' ? 4 : 1}px solid ${T.accent}`,
      }}>
        {mode === 'doors' && (<>
          <div className="absolute inset-4 border rounded-t-full opacity-60" style={{ borderColor: T.accent }} />
          <div className="absolute inset-8 border rounded-t-full opacity-30" style={{ borderColor: T.accent }} />
          <div className="absolute top-1/2 w-3 h-3 rounded-full" style={{ background: T.accent, [side === 'left' ? 'right' : 'left']: 10 }} />
        </>)}
      </div>));

  return (
    <div className="absolute inset-0 z-50" style={{
      perspective: 1200, pointerEvents: opened ? 'none' : 'auto', visibility: opened ? 'hidden' : 'visible',
      transition: 'visibility 0s linear 1.9s',
    }}>
      {panels}
      <button onClick={onOpen} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center cursor-pointer"
        style={{ opacity: opened ? 0 : 1, transition: 'opacity .4s' }}>
        <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center border-2"
          style={{ borderColor: T.accent, background: rgba(T.panelA, 0.92), '--wi-glow': rgba(T.accent, 0.55), animation: 'wi-pulse 2s infinite' }}>
          <span className="text-4xl" style={{ color: mix(T.accent, '#ffffff', 0.45), fontFamily: F.script }}>{initials}</span>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] px-3 py-1 rounded-full inline-block"
          style={{ color: mix(T.accent, '#ffffff', 0.5), background: rgba(T.panelA, 0.7), fontFamily: F.head }}>{hint}</p>
      </button>
    </div>
  );
}

/* ================= MAIN ================= */
export default function AnimatedInvite({ data = {}, watermark = true, watermarkText, onRsvp, className = '' }) {
  const d = data;
  const T = useMemo(() => buildTheme(d), [d.bgColor, d.primaryColor, d.accentColor, d.textColor]);
  const fx = { ...(FX[d.ornament] || { intro: 'doors', particle: 'sparkle' }), ...(d.intro ? { intro: d.intro } : {}), ...(d.particle ? { particle: d.particle } : {}) };
  const F = {
    head: `'${d.fontFamily || 'Cinzel'}', serif`,
    script: `'${d.scriptFont || 'Great Vibes'}', cursive`,
    body: `'Playfair Display', Georgia, serif`,
  };

  const groom = d.groomName || 'Rohit';
  const bride = d.brideName || 'Priya';
  const groomBio = d.groomBio || (d.parentsGroom ? `Son of ${d.parentsGroom}` : '');
  const brideBio = d.brideBio || (d.parentsBride ? `Daughter of ${d.parentsBride}` : '');
  const target = useMemo(() => parseTarget(d), [d.weddingDate, d.weddingTime]);
  const dateLabel = d.weddingDateLabel
    || (/^\d{4}-\d{2}-\d{2}/.test(d.weddingDate || '') ? new Date(d.weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : d.weddingDate)
    || 'Save the date';
  const events = d.events || [];
  const verse = d.verse || d.tagline || 'Two souls, one journey. Join us as we begin forever.';
  const mapsQuery = d.mapsQuery || `${d.venue || ''} ${d.city || ''}`.trim();

  const [lang, setLang] = useState('en');
  const t = I18N[lang];
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: '', guests: '1', status: 'accept', message: '' });
  const [sent, setSent] = useState(false);
  const audio = useRef({ ctx: null, id: null });
  const left = useCountdown(target);

  const photos = d.photos && d.photos.length ? d.photos : null;
  const slideCount = photos ? photos.length : 3;
  useEffect(() => { const id = setInterval(() => setSlide((s) => (s + 1) % slideCount), 3600); return () => clearInterval(id); }, [slideCount]);

  const stopMusic = () => {
    const a = audio.current;
    if (a.id) clearInterval(a.id);
    if (a.ctx) a.ctx.close().catch(() => {});
    audio.current = { ctx: null, id: null }; setMusicOn(false);
  };
  const startMusic = () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; const ctx = new AC();
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; let i = 0;
      const tone = () => {
        if (ctx.state === 'closed') return;
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = notes[i % notes.length]; i += 1 + Math.floor(Math.random() * 3);
        g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 2);
      };
      tone(); audio.current = { ctx, id: setInterval(tone, 1400) }; setMusicOn(true);
    } catch (e) { console.error('Audio error', e); }
  };
  useEffect(() => () => stopMusic(), []);

  const openIntro = () => { setOpened(true); if (!musicOn) startMusic(); };
  const submit = (e) => { e.preventDefault(); setSent(true); if (onRsvp) onRsvp(form); };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;
  const nameSize = (n) => (n.length > 12 ? 42 : n.length > 8 ? 54 : 64);
  const shimmer = {
    backgroundImage: `linear-gradient(90deg, ${T.nameGrad[0]}, ${T.nameGrad[1]}, ${T.nameGrad[2]}, ${T.nameGrad[1]}, ${T.nameGrad[0]})`,
    backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
    animation: 'wi-shimmer 5s linear infinite',
  };
  const heroAnim = (delay) => (opened ? { animation: `wi-fadeup 1.1s ease ${delay}s both` } : { opacity: 0 });

  const Title = ({ children }) => (
    <h3 className="text-xl tracking-[0.15em] uppercase mb-1" style={{ color: T.heading, fontFamily: F.head }}>{children}</h3>
  );
  const Divider = () => (
    <div className="flex items-center justify-center gap-2 my-3">
      <span className="h-px w-12" style={{ background: T.accent }} /><span style={{ color: T.accent }}>◆</span><span className="h-px w-12" style={{ background: T.accent }} />
    </div>
  );
  const inputStyle = { borderColor: T.line, color: T.text, background: 'transparent' };
  const gradients = [
    `linear-gradient(135deg, ${T.primary}, ${mix(T.primary, T.accent, 0.4)})`,
    `linear-gradient(135deg, ${mix(T.accent, T.bg, 0.55)}, ${T.primary})`,
    `linear-gradient(135deg, ${T.deep}, ${mix(T.accent, T.primary, 0.5)})`,
  ];

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}
      style={{ background: T.bg, color: T.text, fontFamily: F.body, overflow: 'clip', maxHeight: opened ? 'none' : 680 }}>
      <style>{CSS}</style>

      <Intro mode={fx.intro} opened={opened} onOpen={openIntro} T={T} F={F} hint={t.open}
        initials={`${groom.charAt(0)}&${bride.charAt(0)}`} />

      <div style={{ filter: opened ? 'none' : 'blur(2px)', transition: 'filter 1s' }}>
        {/* top controls */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border cursor-pointer"
            style={{ borderColor: T.accent, color: T.heading, background: rgba(T.bg, 0.75) }}>
            <Globe className="w-3.5 h-3.5" /> {t.lang}
          </button>
          <button onClick={() => (musicOn ? stopMusic() : startMusic())} aria-label="Toggle music"
            className="p-2 rounded-full border cursor-pointer"
            style={{ borderColor: T.accent, color: T.heading, background: rgba(T.bg, 0.75) }}>
            {musicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* HERO */}
        <section className="relative min-h-[680px] flex flex-col items-center justify-center text-center px-8 py-20 overflow-hidden"
          style={{ background: `radial-gradient(ellipse at top, ${T.alt} 0%, ${T.bg} 72%)` }}>
          {d.heroImage && (
            <div className="absolute inset-0" style={{
              backgroundImage: `url('${d.heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center',
              animation: 'wi-kenburns 18s ease-in-out infinite alternate', opacity: 0.55,
            }} />
          )}
          {d.heroImage && <div className="absolute inset-0" style={{ background: rgba(T.bg, 0.55) }} />}

          {/* spinning mandala ring */}
          <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ width: 380, height: 380, marginLeft: -190, marginTop: -190, animation: 'wi-spin 70s linear infinite' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={T.accent} strokeOpacity=".35" strokeWidth=".3">
              <circle cx="50" cy="50" r="48" strokeDasharray="1.2 2" />
              <circle cx="50" cy="50" r="40" />
              {Array.from({ length: 12 }).map((_, i) => (
                <ellipse key={i} cx="50" cy="14" rx="3.2" ry="8" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
          </div>

          <Particles type={fx.particle} color={fx.particle === 'petal' ? mix(T.accent, T.primary, 0.3) : fx.particle === 'leaf' ? mix(T.primary, T.accent, 0.4) : T.accent} />

          {/* frames + drawing corners */}
          <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: rgba(T.accent, 0.45) }} />
          <div className="absolute inset-6 border pointer-events-none" style={{ borderColor: rgba(T.accent, 0.2) }} />
          {['top-4 left-4', 'top-4 right-4 scale-x-[-1]', 'bottom-4 left-4 scale-y-[-1]', 'bottom-4 right-4 scale-[-1]'].map((pos) => (
            <svg key={pos} className={`absolute w-14 h-14 ${pos}`} viewBox="0 0 48 48" fill="none" stroke={T.accent} strokeWidth="1.5">
              <path d="M2 46V14C2 7 7 2 14 2H46" strokeDasharray="200" strokeDashoffset="200" style={opened ? { animation: 'wi-draw 2.2s ease .4s forwards' } : undefined} />
              <path d="M10 46V18C10 13 13 10 18 10H46" opacity=".5" strokeDasharray="200" strokeDashoffset="200" style={opened ? { animation: 'wi-draw 2.6s ease .7s forwards' } : undefined} />
              <circle cx="14" cy="14" r="2.5" fill={T.accent} stroke="none" />
            </svg>
          ))}

          <div className="relative z-10">
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: T.heading, fontFamily: F.head, ...heroAnim(0.3) }}>{d.tagline || "We're getting married"}</p>
            <div style={heroAnim(0.5)}><Divider /></div>
            <h1 className="leading-tight" style={{ fontFamily: F.script, fontSize: nameSize(groom), ...shimmer, ...(opened ? { animation: 'wi-shimmer 5s linear infinite, wi-fadeup 1.1s ease .7s both' } : { opacity: 0 }) }}>{groom}</h1>
            {groomBio && <p className="text-[11px] italic opacity-80" style={heroAnim(0.9)}>{groomBio}</p>}
            <p className="text-3xl my-2 italic" style={{ color: T.accent, ...(opened ? { animation: 'wi-fadeup 1s ease 1.05s both, wi-float 3.5s ease-in-out 2s infinite' } : { opacity: 0 }) }}>&amp;</p>
            <h1 className="leading-tight" style={{ fontFamily: F.script, fontSize: nameSize(bride), ...shimmer, ...(opened ? { animation: 'wi-shimmer 5s linear infinite, wi-fadeup 1.1s ease 1.3s both' } : { opacity: 0 }) }}>{bride}</h1>
            {brideBio && <p className="text-[11px] italic opacity-80" style={heroAnim(1.5)}>{brideBio}</p>}
            <p className="mt-5 text-[11px] tracking-[0.25em] uppercase" style={{ color: T.accent, fontFamily: F.head, ...heroAnim(1.8) }}>{dateLabel}{d.city ? ` • ${d.city}` : ''}</p>
          </div>

          <div className="absolute bottom-8 flex flex-col items-center text-[10px] uppercase tracking-[0.3em] z-10" style={{ color: T.accent }}>
            {t.scroll}<ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </section>

        {/* VERSE + SCRATCH */}
        <section className="px-8 py-14 text-center" style={{ background: T.alt }}>
          <Reveal><p className="italic text-base max-w-xs mx-auto leading-relaxed" style={{ color: T.muted }}>“{verse}”</p></Reveal>
          <Divider />
          <Reveal from="zoom" delay={150}><ScratchDate label={dateLabel} caption={t.scratch} doneCaption={t.scratchDone} T={T} F={F} /></Reveal>
        </section>

        {/* COUNTDOWN */}
        <section className="px-6 py-12 text-center" style={{ background: T.bg }}>
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: T.accent, fontFamily: F.head }}>{t.countdown}</p>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {[[left.d, t.days], [left.h, t.hours], [left.m, t.mins], [left.s, t.secs]].map(([v, l]) => (
                <div key={l} className="rounded-xl py-3 border" style={{ borderColor: T.line, background: T.card }}>
                  <span className="block text-2xl" style={{ color: T.heading, fontFamily: F.head }}>{String(v).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-70">{l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* PROGRAMME */}
        <section className="px-6 py-12 text-center" style={{ background: T.alt }}>
          <Reveal><Title>{t.programme}</Title><Divider /></Reveal>
          <div className="space-y-3 max-w-sm mx-auto text-left">
            {events.map((ev, i) => (
              <Reveal key={i} from={i % 2 ? 'right' : 'left'} delay={i * 120}>
                <div className="rounded-2xl p-4 border" style={{ borderColor: T.line, background: T.card }}>
                  <div className="flex justify-between items-center text-[11px] mb-1" style={{ color: T.accent }}>
                    <span className="uppercase tracking-widest font-bold">{ev.date}</span><span>{ev.time}</span>
                  </div>
                  <h4 className="font-bold text-base" style={{ color: T.heading }}>{ev.name}</h4>
                  <p className="text-xs opacity-75">{ev.venue}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* VENUE */}
        <section className="px-6 py-12 text-center" style={{ background: T.bg }}>
          <Reveal>
            <Title>{t.venue}</Title><Divider />
            <p className="font-bold text-lg" style={{ color: T.heading }}>{d.venue}</p>
            <p className="text-xs opacity-75 mb-4">{d.address || d.city}</p>
            <div className="rounded-2xl overflow-hidden border mx-auto max-w-sm" style={{ borderColor: T.accent }}>
              <iframe title="venue-map" src={mapsEmbed} width="100%" height="200" style={{ border: 0 }} loading="lazy" />
            </div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 rounded-full text-xs font-bold"
              style={{ background: T.btnBg, color: T.btnText }}>
              <MapPin className="w-3.5 h-3.5" /> {t.directions}
            </a>
            {d.dressCode && <p className="mt-5 text-xs opacity-80"><span className="uppercase tracking-widest" style={{ color: T.accent }}>{t.dress}: </span>{d.dressCode}</p>}
          </Reveal>
        </section>

        {/* SLIDESHOW */}
        <section className="px-6 py-12 text-center" style={{ background: T.alt }}>
          <Reveal><Title>{t.gallery}</Title><Divider /></Reveal>
          <Reveal from="zoom">
            <div className="relative mx-auto max-w-sm h-64 rounded-2xl overflow-hidden border" style={{ borderColor: T.accent }}>
              {Array.from({ length: slideCount }).map((_, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000 flex items-center justify-center"
                  style={{ opacity: slide === i ? 1 : 0, background: photos ? `url(${photos[i]}) center/cover` : gradients[i % gradients.length], animation: slide === i ? 'wi-kenburns 8s ease-out forwards' : 'none' }}>
                  {!photos && <span className="text-5xl opacity-70" style={{ color: mix(T.accent, '#ffffff', 0.4), fontFamily: F.script }}>{groom.charAt(0)} ♥ {bride.charAt(0)}</span>}
                </div>
              ))}
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
                {Array.from({ length: slideCount }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: slide === i ? T.accent : 'rgba(255,255,255,.5)' }} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* RSVP */}
        <section className="px-6 py-12" style={{ background: T.bg }}>
          <Reveal className="text-center">
            <Title>{t.rsvp}</Title>
            <p className="italic text-sm opacity-85">{t.rsvpTitle}</p>
            <Divider />
          </Reveal>
          {sent ? (
            <div className="max-w-sm mx-auto text-center rounded-2xl p-6 border" style={{ borderColor: T.accent, background: T.card }}>
              <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: T.btnBg, color: T.btnText }}><Check className="w-5 h-5" /></div>
              <h4 className="font-bold" style={{ color: T.heading }}>{t.thanks}, {form.name || '♥'}!</h4>
              <p className="text-xs opacity-75 mt-1">{t.thanksSub}</p>
            </div>
          ) : (
            <Reveal>
              <form onSubmit={submit} className="max-w-sm mx-auto space-y-3 rounded-2xl p-5 border" style={{ borderColor: T.line, background: T.card }}>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.name}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={inputStyle} />
                <div className="grid grid-cols-2 gap-2">
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="text-sm px-3 py-2 rounded-lg border outline-none" style={{ ...inputStyle, background: T.dark ? T.bg : '#fff' }}>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {t.guests}</option>)}
                  </select>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="text-sm px-3 py-2 rounded-lg border outline-none" style={{ ...inputStyle, background: T.dark ? T.bg : '#fff' }}>
                    <option value="accept">{t.accept}</option><option value="decline">{t.decline}</option>
                  </select>
                </div>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.message}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none" style={inputStyle} />
                <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: T.btnBg, color: T.btnText }}>
                  <Send className="w-4 h-4" /> {t.send}
                </button>
              </form>
            </Reveal>
          )}
        </section>

        {/* FOOTER */}
        <footer className="px-6 pt-8 pb-12 text-center" style={{ background: T.deep }}>
          <p className="text-3xl" style={{ ...shimmer, fontFamily: F.script }}>{groom} &amp; {bride}</p>
          <p className="text-[11px] uppercase tracking-[0.25em] mt-1 opacity-70">{t.withLove}</p>
          {(d.rsvpPhone || d.rsvp) && <p className="text-xs mt-3 opacity-70">{d.rsvpPhone || d.rsvp}</p>}
        </footer>
      </div>

      {watermark && <Watermark text={watermarkText} />}
    </div>
  );
}
