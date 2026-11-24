/* ============================================================
   MAHARISHI PARTHIBANGOVINDHARAJ - BOGAR ASTROLOGY RESEARCH CENTRE
   DIVINE COSMIC JAVASCRIPT ENGINE (SACRED WHITE THEME)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initCosmicCanvas();
  initSacredAudio();
  initLanguageSwitcher();
  initLivePanchangam();
  initNumerologyCalculator();
  initZodiacExplorer();
  initBookingForm();
  init3DTilt();
  initFlyerModal();
  initScrollTop();
});

/* ============================================================
   1. INTERACTIVE GOLDEN STARDUST CANVAS (White & Gold Theme)
   ============================================================ */
function initCosmicCanvas() {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  const stars = [];
  const numStars = Math.min(140, Math.floor((width * height) / 9000));
  const mouse = { x: -1000, y: -1000, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function initStars() {
    stars.length = 0;
    // Sacred golden, amber, and saffron tones for white background
    const colors = ['#b8860b', '#d4af37', '#f59e0b', '#c2410c', '#b91c1c'];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseAlpha: Math.random() * 0.5 + 0.25,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
      });
    }
  }

  initStars();

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    // Delicate golden constellation lines
    for (let i = 0; i < stars.length; i++) {
      const s1 = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          const alpha = (1 - dist / 85) * 0.14;
          ctx.strokeStyle = `rgba(184, 134, 11, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    stars.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        s.x -= (dx / dist) * force * 1.5;
        s.y -= (dy / dist) * force * 1.5;
      }

      s.angle += s.twinkleSpeed;
      const alpha = s.baseAlpha + Math.sin(s.angle) * 0.2;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(0.85, alpha));
      ctx.fill();

      if (s.radius > 1.6) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animateStars);
  }

  animateStars();
}

/* ============================================================
   2. SACRED OM FREQUENCY & TIBETAN CHIME SYNTHESIZER
   ============================================================ */
let audioCtx = null;
let masterGain = null;
let isAudioPlaying = false;
let oscNodes = [];

function initSacredAudio() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const omShrineTrigger = document.getElementById('om-shrine-trigger');

  function startOmDrone() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);
    masterGain.connect(audioCtx.destination);

    const baseFreq = 136.1;
    const harmonics = [1, 2, 3, 4.02];
    const gains = [0.08, 0.04, 0.02, 0.01];

    oscNodes = [];

    harmonics.forEach((h, index) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h, audioCtx.currentTime);

      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.18 + index * 0.05, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(gains[index], audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      oscNodes.push({ osc, lfo });
    });

    isAudioPlaying = true;
    updateSoundUI();
  }

  function stopOmDrone() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        oscNodes.forEach(({ osc, lfo }) => {
          try {
            osc.stop();
            lfo.stop();
          } catch (e) {}
        });
        oscNodes = [];
        isAudioPlaying = false;
        updateSoundUI();
      }, 1200);
    } else {
      isAudioPlaying = false;
      updateSoundUI();
    }
  }

  function playTibetanChime(freq = 528) {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bellOsc = audioCtx.createOscillator();
      const bellGain = audioCtx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      bellOsc.frequency.exponentialRampToValueAtTime(freq * 0.99, audioCtx.currentTime + 2.5);

      bellGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3);

      bellOsc.connect(bellGain);
      bellGain.connect(audioCtx.destination);

      bellOsc.start();
      bellOsc.stop(audioCtx.currentTime + 3.1);
    } catch (e) {}
  }

  function updateSoundUI() {
    const label = soundToggleBtn?.querySelector('.audio-label');
    const isTa = document.body.classList.contains('lang-ta');

    if (isAudioPlaying) {
      soundToggleBtn?.classList.add('playing');
      if (label) {
        label.textContent = isTa ? 'புனித ஓம் ஒலி: இயங்குகிறது' : 'Sacred Om: Playing';
      }
    } else {
      soundToggleBtn?.classList.remove('playing');
      if (label) {
        label.textContent = isTa ? 'புனித ஓம் ஒலி: அணை' : 'Sacred Sound: Off';
      }
    }
  }

  soundToggleBtn?.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopOmDrone();
    } else {
      startOmDrone();
      playTibetanChime(528);
    }
  });

  omShrineTrigger?.addEventListener('click', () => {
    playTibetanChime(432);
    omShrineTrigger.classList.add('pulse-glow');
    setTimeout(() => omShrineTrigger.classList.remove('pulse-glow'), 1200);

    if (!isAudioPlaying) {
      startOmDrone();
    }
  });
}

/* ============================================================
   3. BILINGUAL LANGUAGE SWITCHER (English / தமிழ்)
   ============================================================ */
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    document.body.classList.remove('lang-en', 'lang-ta');
    document.body.classList.add(`lang-${lang}`);

    langBtns.forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    const translatable = document.querySelectorAll('[data-en][data-ta]');
    translatable.forEach((el) => {
      el.textContent = lang === 'ta' ? el.dataset.ta : el.dataset.en;
    });

    const activeRasiTab = document.querySelector('.rasi-tab.active');
    if (activeRasiTab) {
      const idx = parseInt(activeRasiTab.dataset.index, 10);
      updateRasiCard(idx, lang);
    }

    updatePanchangamText(lang);
  }

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
}

/* ============================================================
   4. LIVE PANCHANGAM & COSMIC ALIGNMENT TICKER
   ============================================================ */
const nakshatras = [
  { en: 'Ashwini', ta: 'அஸ்வினி' },
  { en: 'Bharani', ta: 'பரணி' },
  { en: 'Krittika', ta: 'கார்த்திகை' },
  { en: 'Rohini', ta: 'ரோகிணி' },
  { en: 'Mrigashirsha', ta: 'மிருகசீரிடம்' },
  { en: 'Ardra', ta: 'திருவாதிரை' },
  { en: 'Punarvasu', ta: 'புனர்பூசம்' },
  { en: 'Pushya', ta: 'பூசம்' },
  { en: 'Ashlesha', ta: 'ஆயில்யம்' },
  { en: 'Magha', ta: 'மகம்' },
  { en: 'Purva Phalguni', ta: 'பூரம்' },
  { en: 'Uttara Phalguni', ta: 'உத்திரம்' },
  { en: 'Hasta', ta: 'அஸ்தம்' },
  { en: 'Chitra', ta: 'சித்திரை' },
  { en: 'Swati', ta: 'சுவாதி' },
  { en: 'Vishakha', ta: 'விசாகம்' },
  { en: 'Anuradha', ta: 'அனுஷம்' },
  { en: 'Jyeshtha', ta: 'கேட்டை' },
  { en: 'Mula', ta: 'மூலம்' },
  { en: 'Purva Ashadha', ta: 'பூராடம்' },
  { en: 'Uttara Ashadha', ta: 'உத்திராடம்' },
  { en: 'Shravana', ta: 'திருவோணம்' },
  { en: 'Dhanishta', ta: 'அவிட்டம்' },
  { en: 'Shatabhisha', ta: 'சதயம்' },
  { en: 'Purva Bhadrapada', ta: 'பூரட்டாதி' },
  { en: 'Uttara Bhadrapada', ta: 'உத்திரட்டாதி' },
  { en: 'Revati', ta: 'ரேவதி' },
];

const tithis = [
  { en: 'Shukla Paksha Dashami', ta: 'சுக்ல பட்ச தசமி' },
  { en: 'Shukla Paksha Ekadashi', ta: 'சர்வ ஏகாதசி' },
  { en: 'Purnima (Full Moon)', ta: 'பௌர்ணமி சுப தினம்' },
  { en: 'Krishna Paksha Sashti', ta: 'கிருஷ்ண பட்ச சஷ்டி' },
  { en: 'Krishna Paksha Ashtami', ta: 'கிருஷ்ண பட்ச அஷ்டமி' },
  { en: 'Amavasya (New Moon)', ta: 'அமாவாசை சுப தார்ப்பணம்' },
  { en: 'Shukla Paksha Tritiya', ta: 'சுக்ல பட்ச திருதியை' },
  { en: 'Shukla Paksha Panchami', ta: 'சுக்ல பட்ச பஞ்சமி' },
];

function initLivePanchangam() {
  const isTa = document.body.classList.contains('lang-ta');
  updatePanchangamText(isTa ? 'ta' : 'en');
}

function updatePanchangamText(lang) {
  const ticker = document.getElementById('live-panchangam-text');
  if (!ticker) return;

  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );

  const curNak = nakshatras[dayOfYear % nakshatras.length];
  const curTithi = tithis[dayOfYear % tithis.length];

  if (lang === 'ta') {
    ticker.textContent = `இன்றைய திதி: ${curTithi.ta} • நட்சத்திரம்: ${curNak.ta} • சுப முகூர்த்த யோகம் நிலவுகிறது`;
  } else {
    ticker.textContent = `Current Tithi: ${curTithi.en} • Nakshatra: ${curNak.en} • Auspicious Muhurtham Window Active`;
  }
}

/* ============================================================
   5. CHALDEAN & VEDIC NUMEROLOGY CALCULATOR
   ============================================================ */
const chaldeanMap = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const planetData = {
  1: {
    planet: 'Sun (சூரிய பகவான்)',
    gem: 'Ruby (மாணிக்கம்)',
    days: 'Sunday, Gold & Saffron',
    reading:
      'Natural born pioneer, supreme leadership aura, and command. Aligning your name vibration ensures steady fame, executive authority, and royal recognition.',
    readingTa:
      'இயற்கையிலேயே தலைமைப் பண்பு, கம்பீரம் மற்றும் நிர்வாகத் திறன் கொண்டவர். சூரியனின் அருளால் அரசு வழியில் லாபம் மற்றும் புகழ் கிடைக்கும்.',
  },
  2: {
    planet: 'Moon (சந்திர பகவான்)',
    gem: 'Natural Pearl (முத்து)',
    days: 'Monday, White & Cream',
    reading:
      'Deeply intuitive, artistic genius, and empathetic peace-maker. Harmonizing your name removes mental fluctuations and draws divine prosperity.',
    readingTa:
      'அதிக மன ஆற்றல், படைப்பாற்றல் மற்றும் கற்பனை வளம் உள்ளவர். சந்திரனின் அருளால் மன அமைதி, வியாபார வளர்ச்சி மற்றும் அமைதியான வாழ்க்கை அமையும்.',
  },
  3: {
    planet: 'Jupiter (குரு பகவான் - Brihaspati)',
    gem: 'Yellow Sapphire (புஷ்பராகம்)',
    days: 'Thursday, Yellow & Golden Yellow',
    reading:
      'Wisdom seeker, spiritual counselor, and financial multiplier. An auspicious name brings immense grace in education, children, and legacy wealth.',
    readingTa:
      'ஞானம், ஆசான் தன்மை மற்றும் பொருளாதார வளர்ச்சி தரும் குருவின் அம்சம். பெயர் சீரமைப்பு மூலம் கல்வி, புத்திர பாக்கியம் மற்றும் பொன் பொருள் சேரும்.',
  },
  4: {
    planet: 'Rahu (ராகு பகவான்)',
    gem: 'Hessonite Garnet (கோமேதகம்)',
    days: 'Saturday, Electric Blue & Smoky Grey',
    reading:
      'Unconventional visionary, technical mastery, and sudden breakthrough energy. Balancing with Maharishi shields against unexpected setbacks.',
    readingTa:
      'புரட்சிகர சிந்தனை, நவீன தொழில் வெற்றி மற்றும் திடீர் அதிர்ஷ்டம் தரும் ராகு சக்தி. பெயர் எண் சமநிலை திடீர் ஏற்றங்களையும் வெற்றிகளையும் தரும்.',
  },
  5: {
    planet: 'Mercury (புதன் பகவான் - Budha)',
    gem: 'Emerald (மரகதம்)',
    days: 'Wednesday, Emerald Green',
    reading:
      'Master communicator, agile trader, analytical brilliance, and high adaptability. Supercharges commercial enterprise and global business.',
    readingTa:
      'சாணக்கிய புத்தி, வியாபார சாமர்த்தியம் மற்றும் நாவன்மை தரும் புதனின் அருள். வணிகம் மற்றும் சர்வதேச தொடர்புகளில் அபார வெற்றி கிடைக்கும்.',
  },
  6: {
    planet: 'Venus (சுக்கிர பகவான் - Shukra)',
    gem: 'Diamond / White Zircon (வைரம்)',
    days: 'Friday, Silvery White & Light Blue',
    reading:
      'Embodiment of luxury, marital bliss, aesthetic mastery, and boundless comfort. Attracts high-value client deals and family joy.',
    readingTa:
      'சுகபோக வாழ்வு, வாகன யோகம், கலை மற்றும் இல்வாழ்க்கை மகிழ்ச்சி தரும் சுக்கிரனின் அருள். பெயர் அதிர்வு லட்சுமி கடாட்சத்தை ஈர்க்கும்.',
  },
  7: {
    planet: 'Ketu (கேது பகவான்)',
    gem: "Cat's Eye (வைடூரியம்)",
    days: 'Tuesday, Smoky White & Grey',
    reading:
      'Philosophical depth, occult wisdom, research capability, and spiritual detachment. Channeling Ketu unlocks rare sixth-sense abilities.',
    readingTa:
      'ஆன்மீக நாட்டம், ஆராய்ச்சி திறன் மற்றும் உள்ளுணர்வு ஞானம் தரும் கேதுவின் சக்தி. சித்தர்களின் அருள் மற்றும் தெய்வீக ஈர்ப்பு உண்டாகும்.',
  },
  8: {
    planet: 'Saturn (சனி பகவான் - Shani)',
    gem: 'Blue Sapphire (நீலம்)',
    days: 'Saturday, Navy Blue & Black',
    reading:
      'Iron discipline, industrial mogul capacity, justice, and long-lasting monumental empires. Proper name alignment turns struggles into supreme victory.',
    readingTa:
      'விடாமுயற்சி, நீதி தவறாமை, தொழிற்சாலை மற்றும் நீடித்த பெருஞ்செல்வம் தரும் சனீஸ்வர பகவானின் அருள். கடின உழைப்பு பெரும் ராஜயோகமாகும்.',
  },
  9: {
    planet: 'Mars (செவ்வாய் பகவான் - Angaraka)',
    gem: 'Red Coral (பவளம்)',
    days: 'Tuesday, Crimson Red & Coral',
    reading:
      'Dynamic courage, real-estate dominion, medical/protective valor, and unyielding will. Directing this fire through Bogar blessings guarantees victory.',
    readingTa:
      'வீரம், தைரியம், பூமி லாபம் மற்றும் தளபதி தலைமை தரும் அங்காரக சக்தி. முருகனின் அருளோடு நிலம், தொழில் மற்றும் உடல் வலிமை மேலோங்கும்.',
  },
};

function reduceToSingleDigit(num) {
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

function calculateChaldean(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let ch of clean) {
    if (chaldeanMap[ch]) {
      sum += chaldeanMap[ch];
    }
  }
  return { compound: sum, single: reduceToSingleDigit(sum) };
}

function initNumerologyCalculator() {
  const calcBtn = document.getElementById('calculate-btn');
  const nameInput = document.getElementById('calc-name');
  const dobInput = document.getElementById('calc-dob');

  const initialBox = document.getElementById('calc-initial');
  const actualResult = document.getElementById('calc-actual-result');

  const resPsychic = document.getElementById('res-psychic');
  const resDestiny = document.getElementById('res-destiny');
  const resNameNum = document.getElementById('res-name-num');
  const resPlanet = document.getElementById('res-planet');
  const resGem = document.getElementById('res-gem');
  const resDays = document.getElementById('res-days');
  const resReading = document.getElementById('res-reading');
  const consultAlignedBtn = document.getElementById('consult-aligned-btn');

  calcBtn?.addEventListener('click', () => {
    const rawName = nameInput.value.trim() || 'DIVINE SEEKER';
    const rawDob = dobInput.value;

    if (!rawDob) {
      alert('Please select your Date of Birth.');
      return;
    }

    const [year, month, day] = rawDob.split('-').map((n) => parseInt(n, 10));
    const psychic = reduceToSingleDigit(day);

    const totalDobSum = String(day) + String(month) + String(year);
    const destinySum = totalDobSum
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
    const destiny = reduceToSingleDigit(destinySum);

    const nameData = calculateChaldean(rawName);
    const profile = planetData[destiny] || planetData[1];
    const isTa = document.body.classList.contains('lang-ta');

    resPsychic.textContent = psychic;
    resDestiny.textContent = destiny;
    resNameNum.textContent = `${nameData.compound}/${nameData.single}`;
    resPlanet.textContent = profile.planet;
    resGem.textContent = profile.gem;
    resDays.textContent = profile.days;
    resReading.textContent = isTa ? profile.readingTa : profile.reading;

    const waText = encodeURIComponent(
      `Namaste Maharishi Ji, I used your website Numerology tool:\nName: ${rawName}\nDOB: ${rawDob}\nPsychic No: ${psychic}\nDestiny No: ${destiny}\nName Vibration: ${nameData.compound}/${nameData.single}\nI would like an authentic consultation to align my name and life.`
    );
    consultAlignedBtn.href = `https://wa.me/919698016673?text=${waText}`;

    initialBox.classList.add('hidden');
    actualResult.classList.remove('hidden');

    actualResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ============================================================
   6. 12 RASI (ZODIAC CHAKRA) GUIDANCE DATA
   ============================================================ */
const rasiList = [
  {
    glyph: '♈',
    nameEn: 'Mesha (Aries)',
    nameTa: 'மேஷம்',
    elem: '🔥 Fire • Agni',
    deityEn: 'Lord Murugan',
    deityTa: 'முருகப் பெருமான்',
    lordEn: 'Mars (செவ்வாய்)',
    stoneEn: 'Red Coral (பவளம்)',
    strengthEn: 'Courage, Leadership, Pioneer Drive',
    strengthTa: 'தைரியம், தலைமை, புதிய முன்னெடுப்புகள்',
    descEn:
      'Under the fiery mantle of Mars and grace of Lord Murugan, Mesha natives are unstoppable when aligned. Consulting Maharishi channels impulsive energy into decisive wealth and family harmony.',
    descTa:
      'செவ்வாய் மற்றும் முருகப் பெருமானின் அருள் பெற்றவர்கள். மகரிஷி அவர்களின் ஜாதக ஆலோசனையால் அவசர முடிவுகள் தவிர்க்கப்பட்டு பெரும் பதவி மற்றும் சொத்து சுகம் சேரும்.',
  },
  {
    glyph: '♉',
    nameEn: 'Vrishabha (Taurus)',
    nameTa: 'ரிஷபம்',
    elem: '🌍 Earth • Prithvi',
    deityEn: 'Goddess Mahalakshmi',
    deityTa: 'ஸ்ரீ மகாலட்சுமி',
    lordEn: 'Venus (சுக்கிரன்)',
    stoneEn: 'Diamond / White Zircon (வைரம்)',
    strengthEn: 'Steadfastness, Wealth Manifestation, Art',
    strengthTa: 'நிலைத்தன்மை, தன சேர்க்கை, கலையார்வம்',
    descEn:
      'Governed by Venus and blessed by Mahalakshmi, Vrishabha natives are gifted with prosperity magnetism. Maharishi guides on choosing optimal business partnerships and Vastu alignments.',
    descTa:
      'சுக்கிரன் மற்றும் லட்சுமி கடாட்சம் நிறைந்த ராசி. சரியான தொழில் கூட்டு மற்றும் வாஸ்து அமைப்பு மூலம் நிரந்தர செல்வச் செழிப்பை அடையலாம்.',
  },
  {
    glyph: '♊',
    nameEn: 'Mithuna (Gemini)',
    nameTa: 'மிதுனம்',
    elem: '💨 Air • Vayu',
    deityEn: 'Lord Maha Vishnu',
    deityTa: 'ஸ்ரீ மகாவிஷ்ணு',
    lordEn: 'Mercury (புதன்)',
    stoneEn: 'Emerald (மரகத பச்சை)',
    strengthEn: 'Intellect, Oratory, Rapid Adaptability',
    strengthTa: 'புத்தி கூர்மை, பேச்சுத் திறன், வியாபாரம்',
    descEn:
      'Endowed with sharp intellect by Mercury. Maharishi helps Mithuna seekers overcome dual mindedness and harness cosmic vibrations for high-stakes business and academic triumphs.',
    descTa:
      'புதனின் ஆதிக்கத்தால் அபார அறிவுத்திறன் வாய்க்கும். இரட்டை மனநிலையை நீக்கி, தெளிவான முடிவுகள் எடுத்து வியாபாரத்தில் கொடிகட்டி பறக்க வழிகாட்டுகிறோம்.',
  },
  {
    glyph: '♋',
    nameEn: 'Kataka (Cancer)',
    nameTa: 'கடகம்',
    elem: '💧 Water • Jala',
    deityEn: 'Goddess Parvati / Amman',
    deityTa: 'அன்னை பார்வதி / அம்மன்',
    lordEn: 'Moon (சந்திரன்)',
    stoneEn: 'Natural South Sea Pearl (முத்து)',
    strengthEn: 'Deep Intuition, Family Love, Emotional Strength',
    strengthTa: 'உள்ளுணர்வு, குடும்ப பாசம், மனிதநேயம்',
    descEn:
      'Guided by the Moon, Kataka natives possess immense psychic empathy. Consultation shields against emotional mood swings and secures enduring real-estate prosperity.',
    descTa:
      'சந்திர பகவானின் ஆதிக்கம் பெற்ற மென்மையான உள்ளம். மன அமைதி பெறவும், வீடு மற்றும் வண்டி வாகன யோகங்களை நிலைநிறுத்தவும் சிறப்பு பரிகாரங்கள்.',
  },
  {
    glyph: '♌',
    nameEn: 'Simha (Leo)',
    nameTa: 'சிம்மம்',
    elem: '🔥 Fire • Agni',
    deityEn: 'Lord Shiva / Surya',
    deityTa: 'சிவபெருமான் / சூரிய நாராயணர்',
    lordEn: 'Sun (சூரியன்)',
    stoneEn: 'Burmese Ruby (மாணிக்கம்)',
    strengthEn: 'Royal Magnetism, Nobility, Sovereign Authority',
    strengthTa: 'ராஜ யோகம், கம்பீரம், அரசு செல்வாக்கு',
    descEn:
      'The royal sign of the Zodiac, radiating solar splendor. Maharishi aligns Simha native charts to overcome hidden adversaries, Pitru Dosha, and attain high governance recognition.',
    descTa:
      'சூரியனின் ராஜ கம்பீரம் பொருந்திய ராசி. எதிர்ப்புகளை வென்று அரசு, அரசியல் மற்றும் உயர்மட்ட பதவிகளில் ஜொலிக்க வழிகாட்டுகிறோம்.',
  },
  {
    glyph: '♍',
    nameEn: 'Kanya (Virgo)',
    nameTa: 'கன்னி',
    elem: '🌍 Earth • Prithvi',
    deityEn: 'Lord Vishnu / Hayagriva',
    deityTa: 'ஸ்ரீ ஹயக்ரீவர் / விஷ்ணு',
    lordEn: 'Mercury (புதன்)',
    stoneEn: 'Emerald (மரகதம்)',
    strengthEn: 'Analytical Mastery, Precision, Healing Arts',
    strengthTa: 'துல்லிய கணிப்பு, மருத்துவம், கணக்கியல்',
    descEn:
      'Masters of detail and perfection. Maharishi assists Kanya natives in dissolving career bottlenecks, overcoming over-critical anxieties, and securing top corporate careers.',
    descTa:
      'கணக்கு மற்றும் திட்டமிடலில் வல்லவர்கள். உத்தியோகத்தில் ஏற்படும் தடைகளை உடைத்து வெளிநாட்டு வேலை வாய்ப்புகளை பெற ஆலோசனை.',
  },
  {
    glyph: '♎',
    nameEn: 'Thula (Libra)',
    nameTa: 'துலாம்',
    elem: '💨 Air • Vayu',
    deityEn: 'Goddess Mahalakshmi',
    deityTa: 'ஸ்ரீ லட்சுமி நாராயணர்',
    lordEn: 'Venus (சுக்கிரன்)',
    stoneEn: 'Diamond / White Sapphire (வைரம்)',
    strengthEn: 'Equilibrium, Diplomacy, Aesthetic Elegance',
    strengthTa: 'சமநிலை, நியாய உணர்வு, பொது ஈர்ப்பு',
    descEn:
      'The divine scales of balance under Venus. Consultation resolves marriage match nuances, partnership disagreements, and attracts luxurious living.',
    descTa:
      'நீதி மற்றும் சுக்கிர யோகம் நிறைந்த ராசி. தாமதமாகும் திருமணங்களை உடனடியாக நடத்தி வைக்கவும், குடும்ப ஒற்றுமைக்கும் உகந்த வழிகாட்டல்.',
  },
  {
    glyph: '♏',
    nameEn: 'Vrischika (Scorpio)',
    nameTa: 'விருச்சிகம்',
    elem: '💧 Water • Jala',
    deityEn: 'Lord Murugan / Subrahmanya',
    deityTa: 'வேல் முருகன் / சுப்பிரமணியர்',
    lordEn: 'Mars & Ketu (செவ்வாய்)',
    stoneEn: 'Red Coral (சிவப்பு பவளம்)',
    strengthEn: 'Transformative Will, Occult Power, Fierce Loyalty',
    strengthTa: 'மறைமுக ஞானம், அசைக்க முடியாத உறுதி',
    descEn:
      'Mystic depth and raw stamina. Maharishi provides protective Kavachams and Gemology guidance to shield against evil eye (Drishti) and ignite grand entrepreneurial triumphs.',
    descTa:
      'சித்தர்களின் ஞானம் வசப்படும் ராசி. கண் திருஷ்டி, தொழில் எதிர்ப்புகளை தகர்த்து மகத்தான சாதனை புரிய பரிகார வழிகாட்டல்.',
  },
  {
    glyph: '♐',
    nameEn: 'Dhanusu (Sagittarius)',
    nameTa: 'தனுசு',
    elem: '🔥 Fire • Agni',
    deityEn: 'Lord Dakshinamurthy',
    deityTa: 'ஸ்ரீ தட்சிணாமூர்த்தி',
    lordEn: 'Jupiter (குரு)',
    stoneEn: 'Yellow Sapphire (மஞ்சள் புஷ்பராகம்)',
    strengthEn: 'Dharma, Higher Philosophy, Optimism, Luck',
    strengthTa: 'தர்ம சிந்தனை, ஆன்மீக பலம், அதிர்ஷ்டம்',
    descEn:
      'The archer aiming for cosmic truth under Guru Bhagavan. Consultation illuminates auspicious dates for major investments, pilgrimages, and progeny blessings.',
    descTa:
      'குருவின் நேரடி அருள் பெற்ற தர்ம ராசி. வெளிநாடு பயணம், உயர்கல்வி மற்றும் குழந்தை பாக்கிய தடைகளை நீக்கும் துல்லிய தீர்வுகள்.',
  },
  {
    glyph: '♑',
    nameEn: 'Makara (Capricorn)',
    nameTa: 'மகரம்',
    elem: '🌍 Earth • Prithvi',
    deityEn: 'Lord Saneeswara / Ganesha',
    deityTa: 'சனீஸ்வர பகவான் / விநாயகர்',
    lordEn: 'Saturn (சனி)',
    stoneEn: 'Blue Sapphire (இந்திர நீலம்)',
    strengthEn: 'Unmatched Endurance, Empire Building, Loyalty',
    strengthTa: 'உழைப்பு, நிர்வாக வல்லமை, நீண்ட ஆயுள்',
    descEn:
      'Architects of destiny under Saturn. Maharishi assists Makara natives during Sade Sati (Elara Sani) periods, transforming heavy karmic friction into monumental milestones.',
    descTa:
      'ஏழரை சனி மற்றும் அஷ்டம சனி காலங்களிலும் பயமின்றி, சனியின் ஆசியால் பெரும் சொத்துக்கள் சேர்க்கும் சூட்சும பரிகாரங்கள்.',
  },
  {
    glyph: '♒',
    nameEn: 'Kumbha (Aquarius)',
    nameTa: 'கும்பம்',
    elem: '💨 Air • Vayu',
    deityEn: 'Lord Shiva / Rudra',
    deityTa: 'ஸ்ரீ ருத்ர பெருமான்',
    lordEn: 'Saturn & Rahu (சனி & ராகு)',
    stoneEn: 'Blue Sapphire / Amethyst (நீலம்)',
    strengthEn: 'Global Vision, Inventive Genius, Humanitarianism',
    strengthTa: 'புதிய கண்டுபிடிப்பு, பொதுநலம், உலக பார்வை',
    descEn:
      'Cosmic water-bearer bringing enlightened progress. Maharishi provides energetic alignment for mega-projects, software/industrial ventures, and personal happiness.',
    descTa:
      'காலத்தை வெல்லும் சிந்தனையாளர்கள். புதிய தொழில் நிறுவனங்கள் துவங்கவும், கூட்டு வியாபாரத்தில் லாபம் பெறவும் வேத ஆலோசனை.',
  },
  {
    glyph: '♓',
    nameEn: 'Meena (Pisces)',
    nameTa: 'மீனம்',
    elem: '💧 Water • Jala',
    deityEn: 'Lord Vishnu / Matsya Murthy',
    deityTa: 'ஸ்ரீ மகாவிஷ்ணு / மச்ச அவதாரம்',
    lordEn: 'Jupiter (குரு)',
    stoneEn: 'Yellow Sapphire (புஷ்பராகம்)',
    strengthEn: 'Universal Compassion, Moksha, Divine Surrender',
    strengthTa: 'கருணை, மோட்ச ஞானம், தியாக உள்ளம்',
    descEn:
      'The final transcendent sign of the Zodiac under Jupiter. Maharishi unlocks abundance gates, overseas settlements, and spiritual peace for Meena natives.',
    descTa:
      'குரு பகவானின் ஆசி பெற்ற ஆன்மீக ராசி. வெளிநாட்டு குடியேற்றம், அமைதியான மனநிலை மற்றும் சகல ஐஸ்வர்யங்களும் கைகூட ஆலோசனை.',
  },
];

function initZodiacExplorer() {
  const grid = document.getElementById('rasi-grid');
  if (!grid) return;

  grid.innerHTML = '';

  rasiList.forEach((r, idx) => {
    const tab = document.createElement('div');
    tab.className = `rasi-tab ${idx === 0 ? 'active' : ''}`;
    tab.dataset.index = idx;
    tab.innerHTML = `
      <span class="rasi-tab-glyph">${r.glyph}</span>
      <span class="rasi-tab-name">${r.nameEn}</span>
      <span class="rasi-tab-sub">${r.nameTa}</span>
    `;

    tab.addEventListener('click', () => {
      document.querySelectorAll('.rasi-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const isTa = document.body.classList.contains('lang-ta');
      updateRasiCard(idx, isTa ? 'ta' : 'en');
    });

    grid.appendChild(tab);
  });

  const isTa = document.body.classList.contains('lang-ta');
  updateRasiCard(0, isTa ? 'ta' : 'en');
}

function updateRasiCard(index, lang) {
  const r = rasiList[index];
  if (!r) return;

  const icon = document.getElementById('current-rasi-icon');
  const deity = document.getElementById('current-rasi-deity');
  const name = document.getElementById('current-rasi-name');
  const elem = document.getElementById('current-rasi-elem');
  const lord = document.getElementById('current-rasi-lord');
  const stone = document.getElementById('current-rasi-stone');
  const strength = document.getElementById('current-rasi-strength');
  const text = document.getElementById('current-rasi-text');
  const consultLink = document.getElementById('rasi-consult-link');

  if (icon) icon.textContent = r.glyph;
  if (deity) deity.textContent = lang === 'ta' ? r.deityTa : r.deityEn;
  if (name) name.textContent = lang === 'ta' ? `${r.nameTa} (${r.nameEn})` : `${r.nameEn} - ${r.nameTa}`;
  if (elem) elem.textContent = r.elem;
  if (lord) lord.textContent = r.lordEn;
  if (stone) stone.textContent = r.stoneEn;
  if (strength) strength.textContent = lang === 'ta' ? r.strengthTa : r.strengthEn;
  if (text) text.textContent = lang === 'ta' ? r.descTa : r.descEn;

  if (consultLink) {
    const waText = encodeURIComponent(
      `Namaste Maharishi Ji, I would like complete consultation regarding ${r.nameEn} (${r.nameTa}) horoscope.`
    );
    consultLink.href = `https://wa.me/919698016673?text=${waText}`;
  }
}

/* ============================================================
   7. INTERACTIVE APPOINTMENT BOOKING & WHATSAPP GENERATOR
   ============================================================ */
function initBookingForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const dob = document.getElementById('client-dob')?.value;
    const tob = document.getElementById('client-tob')?.value || 'Not Specified';
    const pob = document.getElementById('client-pob')?.value.trim();
    const service = document.getElementById('client-service')?.value;
    const mode = document.getElementById('client-mode')?.value;
    const lang = document.getElementById('client-lang')?.value;
    const notes = document.getElementById('client-notes')?.value.trim() || 'General Life Guidance';

    const message =
      `🕉️ *DIVINE CONSULTATION REQUEST*\n` +
      `*Bogar Astrology Research Centre, Chennai*\n` +
      `----------------------------------------\n` +
      `👤 *Seeker Name:* ${name}\n` +
      `📱 *Phone / WA:* ${phone}\n` +
      `📅 *Date of Birth:* ${dob}\n` +
      `⏰ *Time of Birth:* ${tob}\n` +
      `📍 *Place of Birth:* ${pob}\n` +
      `⭐ *Service:* ${service}\n` +
      `🌐 *Mode:* ${mode}\n` +
      `🗣️ *Language:* ${lang}\n` +
      `📝 *Notes/Questions:* ${notes}\n` +
      `----------------------------------------\n` +
      `Namaste Maharishi Parthibangovindharaj Ji, please confirm an auspicious consultation slot.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919698016673?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ============================================================
   8. 3D TILT EFFECT FOR LUXURY CARDS
   ============================================================ */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ============================================================
   9. CONSECRATED FLYER MODAL VIEWER
   ============================================================ */
function initFlyerModal() {
  const openBtn = document.getElementById('view-flyer-btn');
  const thumb = document.getElementById('about-flyer-thumb');
  const modal = document.getElementById('flyer-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('modal-backdrop');

  function openModal() {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openModal);
  thumb?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ============================================================
   10. SCROLL TO TOP & DYNAMIC FLOATING ACTIONS
   ============================================================ */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
