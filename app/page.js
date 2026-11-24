'use client';

import React, { useState, useEffect, useRef } from 'react';

/* ─── DATA ─── */
const nakshatras = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula',
  'Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
];
const nakshatrasTa = [
  'அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை',
  'புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்',
  'அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்',
  'பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்',
  'பூரட்டாதி','உத்திரட்டாதி','ரேவதி'
];
const tithis = ['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dvadashi','Trayodashi','Chaturdashi','Purnima / Amavasya'];

const chaldean = { A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8 };

const planets = {
  1:{ planet:'Sun (சூரியன்)',gem:'Ruby (மாணிக்கம்)',days:'Sunday • Gold & Saffron',
      en:'Supreme authority, executive clarity and royal recognition. Aligning your name vibration unlocks steady prosperity and public respect.',
      ta:'சூரியனின் பரிபூரண அருள். அரசு வழியில் ஆதாயம், தலைமை பதவி, மற்றும் புகழ்பெற்ற வாழ்க்கை அமையும்.' },
  2:{ planet:'Moon (சந்திரன்)',gem:'Natural Pearl (முத்து)',days:'Monday • White & Cream',
      en:'Intuitive wisdom, creative magnetism, and emotional peace. Name balancing dissolves anxiety and attracts enduring harmony.',
      ta:'சந்திரனின் அருள். மன அமைதி, கற்பனை வளம், தாயன்பு மற்றும் இல்லற மகிழ்ச்சி பெருகும்.' },
  3:{ planet:'Jupiter (குரு)',gem:'Yellow Sapphire (புஷ்பராகம்)',days:'Thursday • Yellow & Gold',
      en:'Supreme wisdom, spiritual counseling, and wealth multiplying power. High achievements in studies, children, and legacy assets.',
      ta:'குருவின் பார்வை கோடி நன்மை தரும். புத்திர பாக்கியம், உயர் கல்வி மற்றும் பெரும் தன லாபம்.' },
  4:{ planet:'Rahu (ராகு)',gem:'Hessonite (கோமேதகம்)',days:'Saturday • Electric Blue',
      en:'Visionary thinking, technical mastery, and rapid breakthroughs. Correct vibration protects against sudden karmic hurdles.',
      ta:'புதிய தொழில் யுக்திகள், சர்வதேச வாய்ப்புகள் மற்றும் எதிர்பாராத ராஜ யோகம்.' },
  5:{ planet:'Mercury (புதன்)',gem:'Emerald (மரகதம்)',days:'Wednesday • Emerald Green',
      en:'Commercial brilliance, rapid adaptability, and negotiation success. Supercharges business enterprises and trade networks.',
      ta:'சாணக்கிய புத்தி, வியாபார லாபம், மற்றும் சிறந்த தகவல் தொடர்பு ஆற்றல்.' },
  6:{ planet:'Venus (சுக்கிரன்)',gem:'Diamond (வைரம்)',days:'Friday • Silvery White',
      en:'Luxury, marital bliss, aesthetic mastery, and comfort. Attracts high-value client opportunities and joyful family life.',
      ta:'சகல சௌபாக்கியங்கள், வாகன யோகம், கலை ஈர்ப்பு மற்றும் லட்சுமி கடாட்சம்.' },
  7:{ planet:"Ketu (கேது)",gem:"Cat's Eye (வைடூரியம்)",days:'Tuesday • Smoky White',
      en:'Occult insight, spiritual discernment, and research capability. Channeling Ketu unlocks rare intuitive foresight.',
      ta:'சித்தர்களின் ஞானம், ஆன்மீக பலம் மற்றும் தெளிவான உள்ளுணர்வு வழிகாட்டல்.' },
  8:{ planet:'Saturn (சனி)',gem:'Blue Sapphire (நீலம்)',days:'Saturday • Navy Blue',
      en:'Monumental endurance, justice, and long-lasting empires. Proper name alignment transforms patience into unassailable triumph.',
      ta:'விடாமுயற்சிக்கு உன்னத வெற்றி, நீடித்த பெருஞ்செல்வம் மற்றும் மக்கள் செல்வாக்கு.' },
  9:{ planet:'Mars (செவ்வாய்)',gem:'Red Coral (பவளம்)',days:'Tuesday • Crimson Red',
      en:'Dynamic courage, real-estate prosperity, and executive leadership. Channeling this fire through Bogar blessings guarantees victory.',
      ta:'தைரியம், நிலம் மற்றும் பூமி யோகம், தொழில் தடைகளை உடைக்கும் வெற்றி.' }
};

const gems = [
  { emoji:'🔴',nameEn:'Ruby (Manikkam)',nameTa:'மாணிக்கம்',planet:'Sun',finger:'Ring Finger (Gold)',hz:528,
    descEn:'Bestows leadership, vitality, royal authority, and elevates weakened Surya doshas.',
    descTa:'தலைமைப் பண்பு, கம்பீரம், உடல் ஆரோக்கியம் தரும்.' },
  { emoji:'⚪',nameEn:'Natural Pearl (Muthu)',nameTa:'முத்து',planet:'Moon',finger:'Little Finger (Silver)',hz:396,
    descEn:'Bestows emotional balance, calm clarity, memory enhancement, and restful sleep.',
    descTa:'மன அமைதி, தெளிவான சிந்தனை, நல்ல தூக்கம் தரும்.' },
  { emoji:'🟠',nameEn:'Red Coral (Pavazham)',nameTa:'பவளம்',planet:'Mars',finger:'Ring Finger (Gold / Copper)',hz:417,
    descEn:'Ignites courage, physical stamina, clears debts, and supports real-estate acquisition.',
    descTa:'வீரம், உடல் வலிமை, கடன் நிவர்த்தி தரும்.' },
  { emoji:'🟢',nameEn:'Emerald (Maragatham)',nameTa:'மரகதம்',planet:'Mercury',finger:'Little Finger (Gold)',hz:639,
    descEn:'Sharpened business intellect, persuasive communication, speech clarity, and commerce luck.',
    descTa:'வியாபார மேன்மை, புத்திகூர்மை, நாவன்மை தரும்.' },
  { emoji:'🟡',nameEn:'Yellow Sapphire (Pushparagam)',nameTa:'புஷ்பராகம்',planet:'Jupiter',finger:'Index Finger (Gold)',hz:741,
    descEn:'Supreme blessing for marriage timing, children (Santhana Bhagyam), and spiritual wealth.',
    descTa:'விரைவான திருமணம், குழந்தை பாக்கியம், ஆன்மீக ஞானம் தரும்.' },
  { emoji:'💎',nameEn:'Diamond / Zircon (Vairam)',nameTa:'வைரம்',planet:'Venus',finger:'Middle Finger (Gold/Platinum)',hz:852,
    descEn:'Magnetic luxury, artistic brilliance, marital harmony, and aesthetic prosperity.',
    descTa:'சுகபோக வாழ்க்கை, கவர்ச்சி, மணவாழ்க்கை மகிழ்ச்சி தரும்.' },
  { emoji:'🔵',nameEn:'Blue Sapphire (Neelam)',nameTa:'இந்திர நீலம்',planet:'Saturn',finger:'Middle Finger (Silver)',hz:174,
    descEn:'Transforms obstacles into immense career power, longevity, and industrial dominance.',
    descTa:'தொழில் முடக்கம் நீங்கி பெரும் ராஜயோகம், நீண்ட ஆயுள் தரும்.' },
  { emoji:'🟤',nameEn:'Hessonite (Gomedhakam)',nameTa:'கோமேதகம்',planet:'Rahu',finger:'Middle Finger (Silver)',hz:285,
    descEn:'Shields from deceit, occult negativity, and enables sudden unexpected windfalls.',
    descTa:'எதிர்ப்புகள் விலகும், திடீர் தன லாபம் மற்றும் வெளிநாட்டு யோகம்.' },
  { emoji:'🔘',nameEn:"Cat's Eye (Vaidooryam)",nameTa:'வைடூரியம்',planet:'Ketu',finger:'Little Finger (Silver)',hz:963,
    descEn:"Awakens higher spiritual intuition, guards against hidden enemies and negative eye.",
    descTa:'கண் திருஷ்டி அகலும், உள்ளுணர்வு பலப்படும் மற்றும் ஞான மோட்ச மார்க்கம்.' }
];

const testimonials = [
  { name:'Priya Ramachandran',loc:'Chennai',quote:'Maharishi predicted my job change with stunning accuracy. His Chaldean name correction opened doors I never imagined. Truly divine guidance.',stars:5,avatar:'👩' },
  { name:'Suresh Kumar',loc:'Coimbatore',quote:'Got my baby daughter\'s name selected after a thorough birth chart analysis. The name resonates with peace and prosperity. Eternally grateful!',stars:5,avatar:'👨' },
  { name:'Lavanya Bhaskar',loc:'Bangalore',quote:'The Vastu consultation transformed my business office. Without breaking walls, the energy shifted remarkably. Revenue increased 40% in 6 months.',stars:5,avatar:'👩' },
  { name:'Murugesan S.',loc:'Madurai',quote:'WhatsApp video consultation was smooth and detailed. Maharishi explained my Saturn transit clearly and gave practical remedies that actually worked.',stars:5,avatar:'🧔' },
  { name:'Deepa Nair',loc:'Kochi',quote:'Recommended Ruby after my Surya analysis. Within weeks, my health improved and I got a promotion. Genuine knowledge rooted in Siddhar tradition.',stars:5,avatar:'👩' },
  { name:'Arun Krishnamurthy',loc:'Singapore',quote:'Consulted online from Singapore for marriage compatibility. The detailed report saved us from a mismatch and guided us to the right partner.',stars:5,avatar:'👨' }
];

export default function BogarAstrologyPage() {
  const [lang, setLang]           = useState('en');
  const [audio, setAudio]         = useState(false);
  const [calcName, setCalcName]   = useState('');
  const [calcDob, setCalcDob]     = useState('1990-01-15');
  const [result, setResult]       = useState(null);
  const [activeGem, setActiveGem] = useState(4);
  const [modal, setModal]         = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [panchangam, setPanchangam] = useState('');
  const [form, setForm]           = useState({
    name:'', phone:'', dob:'', tob:'', pob:'',
    service:'Vedic Astrology Consultation',
    mode:'Online (WhatsApp Video / Phone Call)',
    language:'Tamil & English', notes:''
  });

  const audioCtxRef   = useRef(null);
  const masterGainRef = useRef(null);
  const oscNodesRef   = useRef([]);
  const isTa = lang === 'ta';

  /* Canvas — golden sparks */
  useEffect(() => {
    const canvas = document.getElementById('sacred-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: Math.min(80, Math.floor(w*h/14000)) }, () => ({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*1.6+0.4,
      vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2,
      alpha: Math.random()*0.3+0.1, phase: Math.random()*Math.PI*2,
      color: ['#d4af37','#b8860b','#f59e0b','#ffe082'][Math.floor(Math.random()*4)]
    }));
    let animId;
    const loop = () => {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=w; if (p.x>w) p.x=0;
        if (p.y<0) p.y=h; if (p.y>h) p.y=0;
        p.phase += 0.018;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(0.55, p.alpha + Math.sin(p.phase)*0.12));
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  /* Panchangam + scroll */
  useEffect(() => {
    const today = new Date();
    const doy = Math.floor((today - new Date(today.getFullYear(),0,0))/86400000);
    const nak = isTa ? nakshatrasTa[doy % nakshatrasTa.length] : nakshatras[doy % nakshatras.length];
    const tit = tithis[doy % tithis.length];
    setPanchangam(isTa
      ? `திதி: ${tit} • நட்சத்திரம்: ${nak} • இன்று சுப முகூர்த்த யோகம் நிலவுகிறது`
      : `Tithi: ${tit} • Nakshatra: ${nak} • Auspicious Muhurtham Window Active Today`
    );
    const onScroll = () => setScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isTa]);

  /* Audio toggle */
  const toggleAudio = () => {
    if (audio) {
      masterGainRef.current?.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime+1);
      setTimeout(() => {
        oscNodesRef.current.forEach(({osc,lfo}) => { try{osc.stop();lfo.stop();}catch(e){} });
        oscNodesRef.current = [];
        setAudio(false);
      }, 1100);
    } else {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) audioCtxRef.current = new AC();
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        const actx = audioCtxRef.current;
        const master = actx.createGain();
        master.gain.setValueAtTime(0.001, actx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.06, actx.currentTime+2.5);
        master.connect(actx.destination);
        masterGainRef.current = master;
        const nodes = [1,2,3].map((h,i) => {
          const osc = actx.createOscillator(), g = actx.createGain();
          const lfo = actx.createOscillator(), lg = actx.createGain();
          osc.type = i===0?'sine':'triangle';
          osc.frequency.value = 136.1 * h;
          lfo.frequency.value = 0.15+i*0.05; lg.gain.value = 1.2;
          lfo.connect(lg); lg.connect(osc.frequency); lfo.start();
          g.gain.value = [0.07,0.035,0.018][i];
          osc.connect(g); g.connect(master); osc.start();
          return {osc,lfo};
        });
        oscNodesRef.current = nodes;
        setAudio(true);
      } catch(e) {}
    }
  };

  const chime = (freq=432) => {
    try {
      const AC = window.AudioContext||window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      if (audioCtxRef.current.state==='suspended') audioCtxRef.current.resume();
      const actx = audioCtxRef.current;
      const now = actx.currentTime;

      // Rich temple bell: fundamental + 2nd + 3rd harmonics
      const harmonics = [
        { mult:1,    gainVal:0.22, type:'sine'     },
        { mult:2.76, gainVal:0.09, type:'sine'     },
        { mult:5.4,  gainVal:0.04, type:'triangle' },
      ];

      harmonics.forEach(({ mult, gainVal, type }) => {
        const osc = actx.createOscillator();
        const g   = actx.createGain();
        osc.type = type;
        osc.frequency.value = freq * mult;
        // Attack → long resonant decay (like a temple bell)
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(gainVal, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        osc.connect(g);
        g.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 5);
      });

      // Soft strike click (impulse at attack)
      const buf = actx.createBuffer(1, actx.sampleRate * 0.08, actx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/data.length, 2);
      const src = actx.createBufferSource();
      const sg  = actx.createGain();
      src.buffer = buf;
      sg.gain.setValueAtTime(0.06, now);
      sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      src.connect(sg); sg.connect(actx.destination);
      src.start(now);
    } catch(e){}
  };

  /* Numerology */
  const reduce = n => { while(n>9) n=[...String(n)].reduce((a,b)=>a+parseInt(b),0); return n; };
  const chaldeanSum = name => {
    const cl = name.toUpperCase().replace(/[^A-Z]/g,'');
    let s = 0;
    for (const c of cl) if (chaldean[c]) s += chaldean[c];
    return { compound: s, single: reduce(s) };
  };
  const calculate = e => {
    e.preventDefault();
    if (!calcDob) return;
    const [y,m,d] = calcDob.split('-').map(Number);
    const psychic = reduce(d);
    const destiny = reduce([...String(d)+String(m)+String(y)].reduce((a,b)=>a+parseInt(b),0));
    const rawName = calcName.trim() || 'DIVINE SEEKER';
    const nameData = chaldeanSum(rawName);
    const prof = planets[destiny] || planets[1];
    setResult({ psychic, destiny, nameCompound: nameData.compound, nameSingle: nameData.single,
      planet: prof.planet, gem: prof.gem, days: prof.days,
      reading: isTa ? prof.ta : prof.en, nameUsed: rawName });
    chime(432);
  };

  /* Booking */
  const handleSubmit = e => {
    e.preventDefault();
    const { name,phone,dob,tob,pob,service,mode,language,notes } = form;
    const msg = `🕉️ *DIVINE CONSULTATION REQUEST*\n*Bogar Astrology Research Centre, Chennai*\n${'─'.repeat(40)}\n👤 *Seeker:* ${name}\n📱 *Phone:* ${phone}\n📅 *DOB:* ${dob}\n⏰ *TOB:* ${tob||'Not specified'}\n📍 *POB:* ${pob}\n⭐ *Service:* ${service}\n🌐 *Mode:* ${mode}\n🗣️ *Language:* ${language}\n📝 *Notes:* ${notes||'Life & Destiny Guidance'}\n${'─'.repeat(40)}\nNamaste Maharishi Ji, please confirm my consultation slot. 🙏`;
    window.open(`https://wa.me/919698016673?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const gem = gems[activeGem];

  return (
    <div className={isTa ? 'lang-ta' : ''}>
      {/* Canvas Sparks */}
      <canvas id="sacred-canvas" />

      {/* Mantra Ribbon */}
      <div className="mantra-ribbon">
        <div className="mantra-track">
          {[...Array(4)].map((_,i) => (
            <span key={i} style={{display:'inline-flex',alignItems:'center',gap:0}}>
              <span className="mantra-item">॥ ஓம் ஸ்ரீ போகர் சித்தரே நமஹ ॥</span>
              <span className="mantra-sep">✦</span>
              <span className="mantra-item">ஸ்ரீ மகா கணபதியே நமஹ ॥</span>
              <span className="mantra-sep">✦</span>
              <span className="mantra-item">ஓம் ஸரவணபவ ॥</span>
              <span className="mantra-sep">✦</span>
              <span className="mantra-item">Om Sri Bogar Siddhare Namaha ॥</span>
              <span className="mantra-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clean Luxury Header */}
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#hero" className="logo-link">
            <div className="logo-emblem">🕉️</div>
            <div className="logo-text">
              <span className="logo-name">{isTa?'போகர் ஜோதிடம்':'BOGAR ASTROLOGY'}</span>
              <span className="logo-sub">{isTa?'ஆராய்ச்சி மையம் • சென்னை':'RESEARCH CENTRE • CHENNAI'}</span>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#about">{isTa?'மகரிஷி':'About'}</a></li>
            <li><a href="#services">{isTa?'சேவைகள்':'Services'}</a></li>
            <li><a href="#studio">{isTa?'எண்கணிதம்':'Numerology'}</a></li>
            <li><a href="#gemology">{isTa?'ரத்தினம்':'Gemology'}</a></li>
            <li><a href="#booking">{isTa?'முன்பதிவு':'Consultation'}</a></li>
          </ul>

          <div className="header-actions">
            <button className={`sound-btn${audio?' on':''}`} onClick={toggleAudio} title="Sacred Om Drone">
              <div className="bars"><span/><span/><span/></div>
              <span className="sound-text">{audio ? (isTa?'ஓம்':'Om') : (isTa?'ஒலி':'Sound')}</span>
            </button>

            <div className="lang-toggle">
              <button className={`lang-pill${lang==='en'?' active':''}`} onClick={()=>setLang('en')}>EN</button>
              <button className={`lang-pill${lang==='ta'?' active':''}`} onClick={()=>setLang('ta')}>தமிழ்</button>
            </div>

            <a href="https://wa.me/919698016673?text=Namaste%20Maharishi%20Ji%2C%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noreferrer" className="nav-cta">
              <span className="nav-cta-desktop">📲 +91 9698016673</span>
              <span className="nav-cta-mobile">💬 WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left */}
            <div className="hero-left">
              <div className="hero-eyebrow">
                <div className="eyebrow-dot" />
                {isTa?'போகர் ஜோதிட ஆராய்ச்சி மையம் • சென்னை':'BOGAR ASTROLOGY RESEARCH CENTRE • CHENNAI'}
              </div>

              <h1 className="hero-title">
                {isTa ? (
                  <><span className="gold-text">தெய்வீக</span><br/>ஜோதிட ஞானம்</>
                ) : (
                  <><span className="gold-text">Divine</span><br/>Cosmic Wisdom</>
                )}
              </h1>

              <p className="hero-name-line">
                {isTa ? (
                  <>மகரிஷி <strong>பார்த்திபன் கோவிந்தராஜ்</strong> M.A., M.Phil.</>
                ) : (
                  <>by <strong>Maharishi Parthibangovindharaj</strong> M.A., M.Phil. — Renowned Astro Consultant</>
                )}
              </p>

              <p className="hero-desc">
                {isTa
                  ? 'பழனி போகர் சித்தரின் பரம்பரை ஆசியுடன், ஜோதிடம், எண் கணிதம், ரத்தினவியல் மற்றும் வாஸ்து மூலம் உங்கள் வாழ்வில் ஆழமான தெய்வீக தீர்வுகள் பெறுங்கள். தமிழ் & ஆங்கிலத்தில் இணையம் மற்றும் நேரடியாக ஆலோசனை.'
                  : 'Rooted in the sacred lineage of Siddhar Bogar of Palani, Maharishi illuminates your career, marriage, health, and family prosperity through authentic Vedic wisdom. Online (WhatsApp) & offline consultations in Tamil & English.'
                }
              </p>

              <div className="hero-cta-row">
                <a href="#booking" className="btn-gold">
                  📅 {isTa?'ஆலோசனை முன்பதிவு':'Book Consultation'}
                </a>
                <a href="https://wa.me/919698016673" target="_blank" rel="noreferrer" className="btn-whatsapp">
                  💬 WhatsApp Now
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-num gold-text-static">25+</span>
                  <span className="stat-txt">{isTa?'ஆண்டு அனுபவம்':'Years Experience'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num gold-text-static">10K+</span>
                  <span className="stat-txt">{isTa?'துல்லிய ஜாதகங்கள்':'Horoscopes Read'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num gold-text-static">100%</span>
                  <span className="stat-txt">{isTa?'இடிக்காத வாஸ்து':'No-Demolition Vastu'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num gold-text-static">2</span>
                  <span className="stat-txt">{isTa?'மொழிகளில் ஆலோசனை':'Languages'}</span>
                </div>
              </div>

              {/* Panchangam strip */}
              <div className="panchangam-strip" style={{marginTop:'2.5rem'}}>
                <div className="panch-live">
                  <div className="panch-dot" />
                  {isTa?'இன்று LIVE':'Live Today'}
                </div>
                <span className="panch-text">{panchangam}</span>
              </div>
            </div>

            {/* Right — Flyer Card */}
            <div className="hero-visual">
              <div className="orbit-ring orbit-1"><div className="orbit-dot"/></div>
              <div className="orbit-ring orbit-2" />
              <div className="orbit-ring orbit-3"><div className="orbit-dot" style={{top:'auto',bottom:'-3.5px'}}/></div>

              <div className="flyer-card" onClick={()=>setModal(true)} title="Click to zoom">
                <img src="/maharishi-flyer.jpg" alt="Maharishi Parthibangovindharaj — Bogar Astrology Research Centre Chennai" />
                <div className="flyer-badge">
                  ✦ {isTa?'அழைப்பிதழ் பெரிதாக்க கிளிக்':'Click to View Full Flyer'} ✦
                </div>
              </div>

              <div className="hero-feature-tags">
                <div className="float-tag float-tag-tl">
                  <div className="float-tag-icon">🌐</div>
                  <div>
                    <div>{isTa?'இணைய / நேரடி':'Online & Offline'}</div>
                    <div className="tag-label">{isTa?'ஆலோசனை':'Consultations'}</div>
                  </div>
                </div>
                <div className="float-tag float-tag-br">
                  <div className="float-tag-icon">🗣️</div>
                  <div>
                    <div>{isTa?'தமிழ் & ஆங்கிலம்':'Tamil & English'}</div>
                    <div className="tag-label">{isTa?'இரு மொழி ஆலோசனை':'Bilingual'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="section section-alt" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual">
              <div className="about-flyer">
                <img src="/maharishi-flyer.jpg" alt="Maharishi" />
                <div className="about-flyer-overlay">
                  <span className="about-flyer-label">BOGAR ASTROLOGY RESEARCH CENTRE</span>
                </div>
              </div>
              <div className="about-corner-badge">
                <span>25+</span>
                <span>YEARS</span>
                <span>MASTERY</span>
              </div>
            </div>
            <div className="about-content">
              <p className="about-pretag">{isTa?'போகர் சித்தரின் பரம்பரை வழி':'In the sacred lineage of Siddhar Bogar'}</p>
              <h2 className="about-h2">
                {isTa ? <><span className="gold-text-static">மகரிஷி</span><br/>பார்த்திபன் கோவிந்தராஜ்</> : <><span className="gold-text-static">Maharishi</span><br/>Parthibangovindharaj</>}
              </h2>
              <div className="about-credential">🎓 M.A., M.Phil. — Vedic Scholar & Astro Consultant</div>
              <p className="about-para">
                {isTa
                  ? 'போகர் சித்தரின் நேரடி ஆசியையும் வேத சாஸ்திரங்களின் ஆழமான ஞானத்தையும் பெற்ற மகரிஷி பார்த்திபன் கோவிந்தராஜ் அவர்கள், 25 ஆண்டுகளுக்கும் மேலாக ஆயிரக்கணக்கான குடும்பங்களுக்கு தெய்வீக வழிகாட்டல் அளித்து வருகிறார்.'
                  : 'With deep mastery in classical Vedic traditions and direct spiritual lineage from Siddhar Bogar of Palani, Maharishi Parthibangovindharaj has guided thousands of seekers across India and internationally toward clarity, prosperity, and divine alignment.'
                }
              </p>
              <p className="about-para">
                {isTa
                  ? 'சென்னையிலுள்ள போகர் ஜோதிட ஆராய்ச்சி மையத்தில் நேரடியாகவும், WhatsApp வீடியோ கால் மூலமாகவும் உலகம் முழுவதும் ஆலோசனை வழங்குகிறார். தமிழ் மற்றும் ஆங்கிலத்தில் அழகான விளக்கங்கள்.'
                  : 'Operating from the Bogar Astrology Research Centre in Chennai, he offers in-person and online consultations via WhatsApp video calls for clients worldwide. All consultations in Tamil & English with compassionate clarity.'
                }
              </p>
              <div className="about-pillars-row">
                {[
                  {icon:'⭐',label:isTa?'வேத ஜோதிடம்':'Vedic Astrology',sub:isTa?'ஜனன ஜாதக பலன்':'Birth Chart Analysis'},
                  {icon:'🔢',label:isTa?'எண் கணிதம்':'Numerology',sub:isTa?'சால்டியன் முறை':'Chaldean System'},
                  {icon:'💎',label:isTa?'நவரத்தின விஞ்ஞானம்':'Gemology',sub:isTa?'ரத்தின தேர்வு':'Stone Selection'},
                  {icon:'🏛️',label:isTa?'இடிக்காத வாஸ்து':'Vastu Shastra',sub:isTa?'இல்ல & வணிக வாஸ்து':'Home & Office'}
                ].map((m,i) => (
                  <div className="about-micro-card" key={i}>
                    <div className="mc-icon">{m.icon}</div>
                    <div>
                      <div className="mc-label">{m.label}</div>
                      <div className="mc-sub">{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES / 4 PILLARS ─── */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <div className="sec-eyebrow">{isTa?'தெய்வீக சேவைகள்':'Sacred Sciences'}</div>
            <h2 className="sec-title">{isTa?'நான்கு தெய்வீக ஜோதிட சேவைகள்':'Four Pillars of Divine Guidance'}</h2>
            <div className="gold-divider"><span/><em>✦</em><span/></div>
            <p className="sec-desc" style={{marginTop:'1rem'}}>
              {isTa
                ? 'ஒவ்வொரு நபரின் வாழ்விலும் ஏற்படும் சவால்களுக்கு சித்தர்களின் அறிவியல் பூர்வமான தீர்வுகள்.'
                : 'Empirical Vedic solutions customized for career, marriage, energy alignment, and residential prosperity.'
              }
            </p>
          </div>

          <div className="pillars-grid">
            {[
              { emoji:'⭐', cat:isTa?'வேத ஜோதிடம்':'Vedic Astrology', title:isTa?'ஜோதிட ஆலோசனை':'Astrology Consultations',
                desc:isTa?'ஜனன ஜாதகம், தசா-புக்தி, கோச்சார கிரக சஞ்சாரங்களை துல்லியமாக ஆராய்ந்து வழிகாட்டுகிறோம்.':'Deep analysis of your birth chart, dasha periods, and planetary transits to resolve life crossroads.',
                items: isTa
                  ? ['திருமணப் பொருத்தம் & தோஷ நிவர்த்தி','கல்வி & வெளிநாட்டு வேலை','கர்ம வினை & பித்ரு தோஷம்','சந்தான பாக்கியம்','தொழில் & வியாபாரம்']
                  : ['Marriage & Porutham Compatibility','Higher Education & Career Path','Karma & Pitru Dosha Remedies','Children & Santhana Bhagyam','Business & Startup Wealth'],
                link:'#booking', linkText:isTa?'ஜாதகம் பார்க்க →':'Book Horoscope →', featured:false },
              { emoji:'⚡', cat:isTa?'எண் கணிதம்':'Numerology', title:isTa?'சால்டியன் எண் கணிதம்':'Chaldean & Vedic Numerology',
                desc:isTa?'பிரபஞ்ச எண்களின் அதிர்வோடு உங்கள் பெயரை இணைத்து வாழ்க்கையில் உடனடி மாற்றங்கள்.':'Harmonize your name with cosmic numeric frequencies for unstoppable growth and prosperity.',
                items: isTa
                  ? ['அதிர்ஷ்ட எண்கள்','பெயர் தேர்வு','தேதி தேர்வு','வியாபார பெயர் பொருத்தம்','வண்டி எண் பொருத்தம்']
                  : ['Lucky Numbers for Wealth','Newborn Baby Name Selection','Auspicious Date Selection','Corporate Brand Alignment','Vehicle & Mobile Number Match'],
                link:'#studio', linkText:isTa?'எண் கணிப்பு →':'Try Studio →', featured:true, badge:isTa?'பிரபலம்':'POPULAR' },
              { emoji:'💎', cat:isTa?'ரத்தினவியல்':'Gemology', title:isTa?'நவரத்தின விஞ்ஞானம்':'Navaratna Gemology',
                desc:isTa?'உங்கள் ஜாதகத்திற்கு ஏற்ற ரத்தினம் அணிவதால் கிரக தோஷங்கள் நீங்கி நற்பலன்கள் பெருகும்.':'Prescribed gemstones based on your birth chart to neutralize planetary doshas and amplify positive energies.',
                items: isTa
                  ? ['நவரத்தின தேர்வு','ரத்தின தரம் சோதனை','அணியும் விரல் வழிகாட்டல்','கிரக தோஷ நிவர்த்தி','ஆற்றல் சமநிலை']
                  : ['Personalized Stone Selection','Gem Quality Verification','Wearing Finger Guidance','Planetary Dosha Removal','Energy Balancing & Healing'],
                link:'#gemology', linkText:isTa?'ரத்தினம் பார்க்க →':'Explore Gems →', featured:false },
              { emoji:'🏛️', cat:isTa?'வாஸ்து சாஸ்திரம்':'Vastu Shastra', title:isTa?'இடிக்காத வாஸ்து':'No-Demolition Vastu',
                desc:isTa?'சுவர் இடிக்காமல் உங்கள் வீட்டு மற்றும் வணிக இடத்தில் ஐந்து பூத சக்திகளை சீரமைக்கிறோம்.':'Realign the five elemental forces in your home and office without demolition for peace and prosperity.',
                items: isTa
                  ? ['வீட்டு வாஸ்து','அலுவலக வாஸ்து','வியாபார இட வாஸ்து','திசை திருத்தம்','வாஸ்து பரிகாரம்']
                  : ['Home Vastu Analysis','Office & Business Vastu','Directional Energy Correction','No-Demolition Remedies','Residential Prosperity Alignment'],
                link:'#booking', linkText:isTa?'வாஸ்து ஆலோசனை →':'Book Vastu →', featured:false }
            ].map((p,i) => (
              <div className={`pillar${p.featured?' featured':''}`} key={i}>
                {p.badge && <span className="pillar-badge">{p.badge}</span>}
                <div className="pillar-emoji">{p.emoji}</div>
                <div className="pillar-category">{p.cat}</div>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
                <ul className="pillar-items">
                  {p.items.map((it,j) => <li key={j}>{it}</li>)}
                </ul>
                <a href={p.link} className="pillar-link">{p.linkText}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NUMEROLOGY STUDIO ─── */}
      <section className="section section-alt" id="studio">
        <div className="container">
          <div className="section-header">
            <div className="sec-eyebrow">{isTa?'இலவச கணிப்பு':'Free Calculator'}</div>
            <h2 className="sec-title">{isTa?'ஜோதிட எண் கணிதம் — Live Studio':'Numerology Live Studio'}</h2>
            <div className="gold-divider"><span/><em>🔢</em><span/></div>
          </div>

          <div className="studio-layout">
            {/* Form */}
            <form className="studio-form-wrap" onSubmit={calculate}>
              <h3 className="studio-form-title">{isTa?'உங்கள் எண்கணித பலன்':'Your Numerology Reading'}</h3>
              <p className="studio-form-sub">
                {isTa?'உங்கள் பெயர் மற்றும் பிறந்த தேதியை உள்ளிட்டு உடனடி பலன் பெறுங்கள்.':'Enter your name and date of birth to receive your instant cosmic number reading.'}
              </p>
              <div className="form-row">
                <label>{isTa?'உங்கள் பெயர் (English):':'Your Full Name (English):'}</label>
                <input type="text" className="form-input" placeholder={isTa?'உ.ம்: RAJAN KUMAR':'e.g. RAJAN KUMAR'} value={calcName} onChange={e=>setCalcName(e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isTa?'பிறந்த தேதி:':'Date of Birth:'}</label>
                <input type="date" className="form-input" required value={calcDob} onChange={e=>setCalcDob(e.target.value)} />
              </div>
              <button type="submit" className="calc-btn">
                ✨ {isTa?'எண்கணிதம் கணி':'Calculate Now'}
              </button>
            </form>

            {/* Result */}
            <div className="result-wrap">
              {!result ? (
                <div className="result-empty">
                  <div className="result-empty-icon">🔮</div>
                  <p>{isTa?'உங்கள் பெயர் & தேதியை உள்ளிட்டு கணி பொத்தானை அழுத்துங்கள்':'Enter your details and click Calculate to reveal your cosmic numbers'}</p>
                </div>
              ) : (
                <>
                  <div className="num-trio">
                    <div className="num-box">
                      <div className="num-box-label">{isTa?'சைக்கிக் (முலாங்க்)':'Psychic (Mulank)'}</div>
                      <div className="num-box-val">{result.psychic}</div>
                    </div>
                    <div className="num-box primary">
                      <div className="num-box-label">{isTa?'தலைவிதி (பாக்யாங்க்)':'Destiny (Bhagyank)'}</div>
                      <div className="num-box-val">{result.destiny}</div>
                    </div>
                    <div className="num-box">
                      <div className="num-box-label">{isTa?'பெயர் எண்':'Name Number'}</div>
                      <div className="num-box-val">{result.nameCompound}/{result.nameSingle}</div>
                    </div>
                  </div>
                  <div className="result-props">
                    <div className="result-row"><span className="result-row-key">{isTa?'ஆளும் கிரகம்:':'Ruling Planet:'}</span><span className="result-row-val">{result.planet}</span></div>
                    <div className="result-row"><span className="result-row-key">{isTa?'அதிர்ஷ்ட ரத்தினம்:':'Lucky Gemstone:'}</span><span className="result-row-val">{result.gem}</span></div>
                    <div className="result-row"><span className="result-row-key">{isTa?'சுப நாள் & நிறம்:':'Lucky Days & Colors:'}</span><span className="result-row-val">{result.days}</span></div>
                    <div className="result-divider"/>
                    <div className="result-row"><span className="result-row-key">{isTa?'தெய்வீக பலன்:':'Divine Reading:'}</span><span className="result-row-val">{result.reading}</span></div>
                  </div>
                  <a href={`https://wa.me/919698016673?text=Namaste%20Maharishi%20Ji%2C%20my%20name%20is%20${encodeURIComponent(result.nameUsed)}%2C%20DOB%20${calcDob}%2C%20Psychic%20Number%20${result.psychic}%2C%20Destiny%20${result.destiny}.%20Please%20guide%20me%20for%20name%20balancing.`} target="_blank" rel="noreferrer" className="consult-cta">
                    💬 {isTa?'மகரிஷியிடம் ஆலோசனை பெறுங்கள்':'Consult Maharishi for Name Balancing'}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GEMOLOGY / NAVARATNA ─── */}
      <section className="section" id="gemology">
        <div className="container">
          <div className="section-header">
            <div className="sec-eyebrow">{isTa?'நவரத்தின விஞ்ஞானம்':'Sacred Navaratna'}</div>
            <h2 className="sec-title">{isTa?'ஒன்பது திவ்ய ரத்தினங்கள்':'Nine Sacred Gemstones'}</h2>
            <div className="gold-divider"><span/><em>💎</em><span/></div>
          </div>
          <div className="gem-layout">
            <div>
              <div className="gem-tokens">
                {gems.map((g,i) => (
                  <button
                    key={i}
                    className={`gem-token${i===activeGem?' active':''}`}
                    onClick={()=>{ setActiveGem(i); chime(g.hz); }}
                  >
                    <div className="gem-emoji">{g.emoji}</div>
                    <div className="gem-name">{g.nameEn.split('(')[0].trim()}</div>
                    <div className="gem-planet">{g.planet}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="gem-detail-card">
              <div className="gem-detail-top">
                <div className="gem-big-emoji">{gem.emoji}</div>
                <div>
                  <div className="gem-detail-name">{isTa?gem.nameTa:gem.nameEn}</div>
                  <div className="gem-detail-planet">{gem.planet} Stone</div>
                </div>
              </div>
              <div className="gem-detail-row"><strong>{isTa?'விரல்:':'Finger:'}</strong><span>{gem.finger}</span></div>
              <div className="gem-desc-block">{isTa?gem.descTa:gem.descEn}</div>
              <a href={`https://wa.me/919698016673?text=Namaste%20Maharishi%20Ji%2C%20I%20want%20to%20know%20if%20${encodeURIComponent(gem.nameEn)}%20is%20suitable%20for%20me.`} target="_blank" rel="noreferrer" className="consult-cta" style={{marginTop:'1.5rem'}}>
                💬 {isTa?'இந்த ரத்தினம் பற்றி ஆலோசனை':'Ask About This Gemstone'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="sec-eyebrow">{isTa?'நம்பிக்கைக்கு சாட்சி':'Testimonials'}</div>
            <h2 className="sec-title">{isTa?'சீடர்களின் வெற்றி கதைகள்':'What Seekers Say'}</h2>
            <div className="gold-divider"><span/><em>🙏</em><span/></div>
          </div>
          <div className="testi-grid">
            {testimonials.map((t,i) => (
              <div className="testi-card" key={i}>
                <div className="testi-stars">{[...Array(t.stars)].map((_,j)=><span key={j} className="testi-star">★</span>)}</div>
                <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-loc">📍 {t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="section" id="booking">
        <div className="container">
          <div className="section-header">
            <div className="sec-eyebrow">{isTa?'ஆலோசனை':'Consultation'}</div>
            <h2 className="sec-title">{isTa?'இன்றே சுப யோகம் பெறுங்கள்':'Book Your Divine Consultation'}</h2>
            <div className="gold-divider"><span/><em>🕉️</em><span/></div>
          </div>
          <div className="booking-wrap">
            {/* Form */}
            <form className="booking-form-card" onSubmit={handleSubmit}>
              <h3 className="booking-form-title">{isTa?'முன்பதிவு படிவம்':'Consultation Booking Form'}</h3>
              <p className="booking-form-sub">
                {isTa?'படிவம் நிரப்பினால், WhatsApp மூலம் நேரடியாக மகரிஷியிடம் அனுப்பப்படும்.':'This form sends directly to Maharishi on WhatsApp for immediate confirmation.'}
              </p>

              <div className="form-two-col">
                <div className="form-row">
                  <label>{isTa?'உங்கள் பெயர்:':'Full Name:'}</label>
                  <input className="form-input" placeholder={isTa?'முழு பெயர்':'Your name'} required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="form-row">
                  <label>{isTa?'தொலைபேசி / WhatsApp:':'Phone / WhatsApp:'}</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                </div>
              </div>
              <div className="form-two-col">
                <div className="form-row">
                  <label>{isTa?'பிறந்த தேதி:':'Date of Birth:'}</label>
                  <input type="date" className="form-input" required value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} />
                </div>
                <div className="form-row">
                  <label>{isTa?'பிறந்த நேரம்:':'Time of Birth:'}</label>
                  <input type="time" className="form-input" value={form.tob} onChange={e=>setForm({...form,tob:e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <label>{isTa?'பிறந்த இடம்:':'Place of Birth:'}</label>
                <input className="form-input" placeholder={isTa?'நகரம், மாவட்டம், மாநிலம்':'City, District, State'} required value={form.pob} onChange={e=>setForm({...form,pob:e.target.value})} />
              </div>
              <div className="form-two-col">
                <div className="form-row">
                  <label>{isTa?'சேவை வகை:':'Service Type:'}</label>
                  <select className="form-select" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                    <option>Vedic Astrology Consultation</option>
                    <option>Numerology & Name Correction</option>
                    <option>Gemstone Recommendation</option>
                    <option>Vastu Consultation</option>
                    <option>Marriage Compatibility (Porutham)</option>
                    <option>Baby Name Selection</option>
                    <option>Business Name Numerology</option>
                    <option>Comprehensive Package (All Services)</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>{isTa?'ஆலோசனை முறை:':'Consultation Mode:'}</label>
                  <select className="form-select" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
                    <option>Online (WhatsApp Video / Phone Call)</option>
                    <option>In-Person at Chennai Centre</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <label>{isTa?'கேள்வி / குறிப்பு:':'Your Question / Notes:'}</label>
                <textarea className="form-textarea" placeholder={isTa?'உங்கள் முக்கிய கேள்வி அல்லது அக்கறை என்ன?':'What is your primary concern or question?'} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
              </div>
              <button type="submit" className="submit-btn">
                💬 {isTa?'WhatsApp மூலம் முன்பதிவு செய்க':'Book via WhatsApp — Free to Message'}
              </button>
            </form>

            {/* Sidebar info */}
            <div className="booking-info">
              <h3 className="booking-info-title">{isTa?'தொடர்பு தகவல்':'Contact & Info'}</h3>
              {[
                { icon:'📱', label:isTa?'தொலைபேசி / WhatsApp':'Phone / WhatsApp', val:'+91 9698016673' },
                { icon:'📍', label:isTa?'இடம்':'Location', val:'Bogar Astrology Research Centre, Chennai, Tamil Nadu' },
                { icon:'🌐', label:isTa?'ஆலோசனை வகைகள்':'Modes', val:isTa?'இணையம் (WhatsApp வீடியோ) & நேரடி':'Online (WhatsApp Video/Call) & In-Person' },
                { icon:'🗣️', label:isTa?'மொழிகள்':'Languages', val:isTa?'தமிழ் & ஆங்கிலம்':'Tamil & English' },
                { icon:'⏰', label:isTa?'ஆலோசனை நேரம்':'Consultation Hours', val:isTa?'தினமும் காலை 8 மணி — இரவு 9 மணி':'Daily 8:00 AM — 9:00 PM IST' },
                { icon:'💰', label:isTa?'தொடர்பு கொள்க':'How to Book', val:isTa?'WhatsApp பதிவு பெறுக — எந்த கேள்வியும் இலவசம்':'Message on WhatsApp — Free to Enquire' }
              ].map((info,i) => (
                <div className="info-card" key={i}>
                  <div className="info-icon">{info.icon}</div>
                  <div>
                    <div className="info-label">{info.label}</div>
                    <div className="info-val">{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="footer-logo"><span className="gold-text">BOGAR ASTROLOGY</span></div>
                <p className="footer-tagline">Research Centre, Chennai</p>
                <div className="footer-contact-row">📱 <a href="tel:+919698016673">+91 9698016673</a></div>
                <div className="footer-contact-row">💬 <a href="https://wa.me/919698016673" target="_blank" rel="noreferrer">WhatsApp for Consultation</a></div>
                <div className="footer-contact-row">📍 Chennai, Tamil Nadu</div>
                <div className="footer-contact-row">🌐 Online & Offline Consultations</div>
              </div>
              <div>
                <div className="footer-col-title">{isTa?'சேவைகள்':'Services'}</div>
                <ul className="footer-col-links">
                  <li><a href="#services">{isTa?'வேத ஜோதிடம்':'Vedic Astrology'}</a></li>
                  <li><a href="#studio">{isTa?'எண் கணிதம்':'Numerology'}</a></li>
                  <li><a href="#gemology">{isTa?'ரத்தினவியல்':'Gemology'}</a></li>
                  <li><a href="#services">{isTa?'வாஸ்து சாஸ்திரம்':'Vastu Shastra'}</a></li>
                  <li><a href="#booking">{isTa?'திருமண பொருத்தம்':'Marriage Porutham'}</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">{isTa?'ஆலோசனை':'Consultation'}</div>
                <ul className="footer-col-links">
                  <li><a href="#booking">{isTa?'முன்பதிவு':'Book Appointment'}</a></li>
                  <li><a href="https://wa.me/919698016673" target="_blank" rel="noreferrer">WhatsApp Now</a></li>
                  <li><a href="#studio">{isTa?'இலவச கணிப்பு':'Free Calculator'}</a></li>
                  <li><a href="#booking">{isTa?'இணையம் / நேரடி':'Online / In-Person'}</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">{isTa?'தகவல்':'Info'}</div>
                <ul className="footer-col-links">
                  <li><a href="#about">{isTa?'மகரிஷி பற்றி':'About Maharishi'}</a></li>
                  <li><a href="#about">{isTa?'போகர் பரம்பரை':'Bogar Lineage'}</a></li>
                  <li><a href="#booking">{isTa?'தமிழ் & ஆங்கிலம்':'Tamil & English'}</a></li>
                  <li><a href="tel:+919698016673">{isTa?'தொடர்பு':'Contact Us'}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <span>© 2024 Bogar Astrology Research Centre, Chennai. All Rights Reserved.</span>
            <span>🕉️ Maharishi Parthibangovindharaj M.A., M.Phil. — Astro Consultant</span>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <div className="fab-cluster">
        <a href="https://wa.me/919698016673" target="_blank" rel="noreferrer" className="fab fab-wa" title="WhatsApp">💬</a>
        <a href="tel:+919698016673" className="fab fab-call" title="Call Now">📞</a>
      </div>

      {scrollTop && (
        <button className="scroll-top-btn" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} title="Back to top">↑</button>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setModal(false)}>✕</button>
            <img src="/maharishi-flyer.jpg" alt="Maharishi Parthibangovindharaj" />
          </div>
        </div>
      )}
    </div>
  );
}
