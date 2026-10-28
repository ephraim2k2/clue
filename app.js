/**
 * CLUE • SMART EDUCATIONAL GAMING PLATFORM
 * Interactive 3D Perspective Grid, Fanned Cards, Audio Synthesizer & Learning Modules
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // Role Data Store
  // =========================================================================
  const ROLES = {
    werewolf: {
      name: 'THE TACTICIAN',
      side: 'BRAIN GAMES & 3-LIVES',
      rating: '4.9',
      roleSummary: '3-Life System (3 Lives Tension) • Logic & Speed Drills',
      team: 'Cognitive Arena',
      winRate: '76.4%',
      difficultyStars: 5,
      players: '1v1 & Solo Arena',
      image: 'assets/card-werewolf.png',
      color: '#f43f5e',
      desc: 'Clue\'s signature 3-life game system. Every wrong answer costs a life. Tackle memory tests, pattern detection, word games, and speed challenges with adaptive hints: "You\'re getting close..."',
      heroTop: 'THE TACTICIAN.',
      heroBottom: 'BRAIN & 3-LIVES. <span class="hero-word-knowledge">KN<span class="target-o">O</span>WLEDGE</span> QUEST.',
      heroSub: 'Solve brain teasers, riddles, logic games, and unexpected speed challenges under the tension of a three-life countdown.'
    },
    seer: {
      name: 'THE MAESTRO',
      side: 'MUSIC & CINEMA GAMES',
      rating: '4.8',
      roleSummary: 'Who Sang This? • Guess the Actor & Quote',
      team: 'Entertainment Suite',
      winRate: '84.1%',
      difficultyStars: 3,
      players: 'Party & Multiplayer',
      image: 'assets/char-seer.jpg',
      color: '#c084fc',
      desc: 'Audio and visual entertainment engines: "Who Sang This?", "Guess the Song", "Finish the Lyrics", "What Movie Is This?", and "Complete the Quote" spanning Afrobeats, Nollywood, Hollywood, and global pop culture.',
      heroTop: 'THE MAESTRO.',
      heroBottom: 'MUSIC & MOVIES. <span class="hero-word-knowledge">KN<span class="target-o">O</span>WLEDGE</span> QUEST.',
      heroSub: 'From Afrobeats to cinema blockbusters. Test your ear and eye with music snippets, lyric riddles, and movie quote challenges.'
    },
    oldman: {
      name: 'THE SCHOLAR',
      side: 'STRUCTURED TESTS',
      rating: '4.9',
      roleSummary: 'Primary • Secondary • University (Course → Topic → Test)',
      team: 'Curriculum & Assessment',
      winRate: '79.5%',
      difficultyStars: 4,
      players: 'Diagnostic & Revision',
      image: 'assets/char-oldman.jpg',
      color: '#f97316',
      desc: 'Serious curriculum learning and assessment. Practice Primary and Secondary exams, and University degree topics: Course → Topic → Test (e.g., CHEM 101 → Atomic Structure → 20 Questions). Tracks performance and identifies weak areas.',
      heroTop: 'THE SCHOLAR.',
      heroBottom: 'LEARN & ASSESS. <span class="hero-word-knowledge">KN<span class="target-o">O</span>WLEDGE</span> QUEST.',
      heroSub: 'Master your academic exams from primary school to university courses. Structured tests with diagnostic tracking for students and tutors.'
    },
    witch: {
      name: 'THE DISCOVERER',
      side: 'CULTURE & FAITH',
      rating: '4.8',
      roleSummary: 'Nigerian & African Culture • Religion & Arabic',
      team: 'Heritage & World Knowledge',
      winRate: '81.2%',
      difficultyStars: 3,
      players: 'Discovery Quest',
      image: 'assets/char-witch.jpg',
      color: '#10b981',
      desc: 'Explore Nigerian and African culture, world religions (Christianity, Islam, mythology), and Arabic language challenges. Move seamlessly from football and history to food, traditions, and faith.',
      heroTop: 'THE DISCOVERER.',
      heroBottom: 'CULTURE & HERITAGE. <span class="hero-word-knowledge">KN<span class="target-o">O</span>WLEDGE</span> QUEST.',
      heroSub: 'Explore African culture, world history, faith, traditions, and multilingual Arabic challenges in one rich knowledge ecosystem.'
    },
    hunter: {
      name: 'THE CHAMPION',
      side: 'PARTIES & DUELS',
      rating: '4.7',
      roleSummary: '30-Player Parties • 1v1 Duels • Airtime & Cash',
      team: 'Live Arenas & Events',
      winRate: '77.0%',
      difficultyStars: 4,
      players: 'Party & Live Stream',
      image: 'assets/char-hunter.jpg',
      color: '#eab308',
      desc: 'Host interactive Clue Parties for 30+ players on their smartphones, join brand arenas like the MTN Music Challenge, and compete in Church and University derbies for airtime, data, and cash prizes.',
      heroTop: 'THE CHAMPION.',
      heroBottom: 'COMPETE & WIN. <span class="hero-word-knowledge">KN<span class="target-o">O</span>WLEDGE</span> QUEST.',
      heroSub: 'Turn gatherings into live game shows. Challenge friends, maintain daily streaks, and win real-world airtime, data, and prizes.'
    }
  };

  // =========================================================================
  // Web Audio Synthesizer (Zero external dependencies)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // =========================================================================
  // Ambient Background Music Player (assets/gigidelaromusic-calm-ether-loop-short-450954.mp3)
  // Continuous, robust, gapless looping engine
  // =========================================================================
  const bgAudio = document.getElementById('bgAudio');
  let musicEnabled = true;
  let isManuallyPaused = false;

  // Set rich, audible, pleasant background volume (0.60)
  if (bgAudio) {
    bgAudio.volume = 0.60;
    bgAudio.loop = true;

    // Handle seamless loop restart when audio reaches track end
    bgAudio.addEventListener('ended', () => {
      if (musicEnabled && !isManuallyPaused) {
        bgAudio.currentTime = 0;
        bgAudio.play().catch(() => {});
      }
    });

    // Proactive loop re-trigger to prevent end-of-track stalls or encoder gap hitches
    bgAudio.addEventListener('timeupdate', () => {
      if (musicEnabled && !isManuallyPaused && bgAudio.duration > 0) {
        if (bgAudio.currentTime >= bgAudio.duration - 0.08) {
          bgAudio.currentTime = 0;
          if (bgAudio.paused) {
            bgAudio.play().catch(() => {});
          }
        }
      }
    });

    // Auto-resume if accidentally paused by system hitch while musicEnabled
    bgAudio.addEventListener('pause', () => {
      if (musicEnabled && !isManuallyPaused) {
        setTimeout(() => {
          if (musicEnabled && !isManuallyPaused && bgAudio.paused) {
            bgAudio.play().catch(() => {});
          }
        }, 120);
      }
      updateSoundUI();
    });

    bgAudio.addEventListener('play', () => {
      updateSoundUI();
    });

    bgAudio.addEventListener('error', (e) => {
      console.warn('Audio element error encountered, reloading stream...', e);
      if (musicEnabled && !isManuallyPaused) {
        bgAudio.load();
        bgAudio.play().catch(() => {});
      }
    });
  }

  function startAmbientMusic() {
    if (!bgAudio) return;
    musicEnabled = true;
    isManuallyPaused = false;
    bgAudio.volume = 0.60;
    bgAudio.loop = true;

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateSoundUI();
      }).catch(() => {
        // Autoplay policy delayed until user gesture
        updateSoundUI();
      });
    }
  }

  function stopAmbientMusic() {
    if (!bgAudio) return;
    isManuallyPaused = true;
    musicEnabled = false;
    bgAudio.pause();
    updateSoundUI();
  }

  function toggleSoundAndMusic() {
    initAudio();
    const isPlaying = bgAudio && !bgAudio.paused;
    if (isPlaying) {
      stopAmbientMusic();
      soundEnabled = false;
      triggerToast('Sound & Music Muted');
    } else {
      soundEnabled = true;
      startAmbientMusic();
      playSwitchSnap();
      triggerToast('Ambient Music Playing');
    }
  }

  function updateSoundUI() {
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (!soundToggleBtn) return;
    const isPlaying = bgAudio && !bgAudio.paused;
    if (isPlaying) {
      soundToggleBtn.classList.add('playing');
      soundToggleBtn.classList.remove('muted');
      soundToggleBtn.setAttribute('title', 'Music & Sound Playing • Click to Mute');
    } else {
      soundToggleBtn.classList.remove('playing');
      soundToggleBtn.classList.add('muted');
      soundToggleBtn.setAttribute('title', 'Music & Sound Muted • Click to Play');
    }
  }

  // Switch Click / Snap
  function playSwitchSnap() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    // High click
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.04);

    // Second pop (Switch snap double-clack)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1800, now + 0.035);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 0.075);
    gain2.gain.setValueAtTime(0.25, now + 0.035);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.035);
    osc2.stop(now + 0.075);
  }

  // Coin Collection Chime
  function playCoinChime() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [987.77, 1318.51]; // B5 -> E6 classic coin sound
    notes.forEach((freq, idx) => {
      const now = audioCtx.currentTime + idx * 0.08;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  // Soft Hover Blip
  function playHoverSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.03);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Card Promotion Swoosh
  function playCardSelectSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // =========================================================================
  // 3D Curved Perspective Canvas Grid with Mouse Parallax
  // =========================================================================
  const canvas = document.getElementById('gridCanvas');
  const ctx = canvas.getContext('2d');

  let mouseX = 0;
  let mouseY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  // Background pattern left-to-right looping motion
  let gridOffsetX = 0;
  const gridSpeed = 0.65; // continuous speed flowing left-to-right

  // Ambient educational knowledge nodes that drift left-to-right across the grid
  const knowledgeNodes = [];
  const logoNodeColors = ['255, 255, 255', '245, 158, 11', '255, 75, 105', '199, 210, 254'];
  for (let k = 0; k < 28; k++) {
    knowledgeNodes.push({
      x: Math.random() * (window.innerWidth || 1400),
      lineIndex: Math.floor(Math.random() * 14),
      speed: 0.5 + Math.random() * 0.7,
      size: 1.5 + Math.random() * 1.8,
      alpha: 0.25 + Math.random() * 0.45,
      color: logoNodeColors[k % logoNodeColors.length]
    });
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    targetTiltX = normX * 18; // degrees
    targetTiltY = normY * 12;
  });

  function drawGrid() {
    // If user has scrolled past the landing fold, pause rendering to save GPU & keep scrolling smooth
    if (window.scrollY > (window.innerHeight || 800) + 100) {
      requestAnimationFrame(drawGrid);
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Smooth camera interpolation
    currentTiltX += (targetTiltX - currentTiltX) * 0.06;
    currentTiltY += (targetTiltY - currentTiltY) * 0.06;

    // Advance continuous left-to-right motion loop
    gridOffsetX += gridSpeed;

    ctx.clearRect(0, 0, width, height);

    // Solid Clue Royal Indigo (#4f46e5) background (no gradient)
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(0, 0, width, height);

    // Grid center and curvature parameters
    const centerX = width * 0.5 + currentTiltX * 1.5;
    const centerY = height * 0.42 + currentTiltY * 1.5;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';

    // 1. Horizontal Curved Latitude Lines (Cylindrical Dome effect)
    const horizCount = 14;
    const ySpacing = height / (horizCount - 1);
    const maxArch = 42; // Curvature arch in pixels

    for (let i = 0; i < horizCount; i++) {
      const baseY = i * ySpacing;
      // Lines near the top curve downwards; lines near bottom flatten
      const arch = maxArch * (1 - (i / horizCount) * 0.6);

      ctx.beginPath();
      ctx.moveTo(0, baseY + arch);
      
      // Curved quadratic/bezier across the screen
      ctx.quadraticCurveTo(
        centerX, 
        baseY - arch * 0.4 + currentTiltY, 
        width, 
        baseY + arch
      );
      
      // Luminous contrast across indigo dome
      const distFromCenter = Math.abs(baseY - centerY) / height;
      const alpha = Math.max(0.06, 0.16 - distFromCenter * 0.08);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.stroke();
    }

    // 2. Vertical Curved Longitude Lines (Animated left-to-right looping motion)
    const colSpacing = Math.max(64, width / 18);
    const currentOffset = gridOffsetX % colSpacing;
    const totalCols = Math.ceil(width / colSpacing) + 4;

    for (let j = -2; j < totalCols; j++) {
      const baseX = j * colSpacing + currentOffset;
      if (baseX < -colSpacing || baseX > width + colSpacing) continue;

      const xOffset = (baseX - centerX) / (width * 0.5); // -1 to 1
      const curveAmount = xOffset * xOffset * 32 * Math.sign(xOffset);

      ctx.beginPath();
      ctx.moveTo(baseX, 0);
      ctx.quadraticCurveTo(
        baseX - curveAmount + currentTiltX, 
        centerY, 
        baseX, 
        height
      );

      // Smooth fade-in as lines enter from left, and fade-out as they exit on right
      const edgeDist = Math.min(baseX, width - baseX);
      const edgeFade = Math.max(0, Math.min(1, edgeDist / 130));
      const alpha = Math.max(0.025, (0.15 - Math.abs(xOffset) * 0.07) * edgeFade);

      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.stroke();
    }

    // 3. Subtle Knowledge Nodes drifting along curves from left to right
    for (let k = 0; k < knowledgeNodes.length; k++) {
      const node = knowledgeNodes[k];
      node.x += node.speed;
      if (node.x > width + 30) {
        node.x = -30;
        node.lineIndex = Math.floor(Math.random() * horizCount);
        node.speed = 0.5 + Math.random() * 0.7;
      }

      const baseY = node.lineIndex * ySpacing;
      const arch = maxArch * (1 - (node.lineIndex / horizCount) * 0.6);
      const t = Math.max(0, Math.min(1, node.x / width));
      const yStart = baseY + arch;
      const yControl = baseY - arch * 0.4 + currentTiltY;
      const yEnd = baseY + arch;
      const nodeY = (1 - t) * (1 - t) * yStart + 2 * (1 - t) * t * yControl + t * t * yEnd;

      ctx.beginPath();
      ctx.arc(node.x, nodeY, node.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${node.color}, ${node.alpha.toFixed(3)})`;
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(drawGrid);
  }

  requestAnimationFrame(drawGrid);

  // =========================================================================
  // GSAP Animation Engine & Tactile Physics
  // =========================================================================
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP) {
    document.body.classList.add('gsap-active');
  }

  // Floating items floating animation & cursor parallax
  const witchFloat = document.getElementById('witchFloat');
  const cauldronFloat = document.getElementById('cauldronFloat');

  if (hasGSAP) {
    // Continuous subtle floating breathing loops
    gsap.to(witchFloat, {
      y: '+=14',
      rotation: 2.5,
      duration: 3.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    gsap.to(cauldronFloat, {
      y: '-=16',
      rotation: -2,
      duration: 4.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // 120fps hardware-accelerated cursor parallax using quickTo
    const witchXTo = gsap.quickTo(witchFloat, 'x', { duration: 0.8, ease: 'power2.out' });
    const witchYTo = gsap.quickTo(witchFloat, 'y', { duration: 0.8, ease: 'power2.out' });
    const cauldXTo = gsap.quickTo(cauldronFloat, 'x', { duration: 0.8, ease: 'power2.out' });
    const cauldYTo = gsap.quickTo(cauldronFloat, 'y', { duration: 0.8, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      witchXTo(x * -26);
      witchYTo(y * -20);
      cauldXTo(x * 26);
      cauldYTo(y * 20);
    });
  } else {
    // Non-GSAP fallback
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      if (witchFloat) witchFloat.style.transform = `translate(${x * -25}px, ${y * -20}px)`;
      if (cauldronFloat) cauldronFloat.style.transform = `translate(${x * 25}px, ${y * 20}px)`;
    });
  }

  // =========================================================================
  // Interactive Fanned Cards Deck (Individual Cards with 3D Hover & Tilt)
  // =========================================================================
  const cards = document.querySelectorAll('.fan-card');
  const heroTitleTop = document.getElementById('heroTitleTop');
  const heroTitleBottom = document.getElementById('heroTitleBottom');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const playHeroBtn = document.getElementById('playHeroBtn');

  // Exact resting geometric transformation for the 5-card fanned hand
  const CARD_RESTING = [
    { y: 48, rot: -22, scale: 0.96, z: 10 },
    { y: 18, rot: -11, scale: 0.98, z: 20 },
    { y: 0,  rot: 0,   scale: 1.04, z: 30 },
    { y: 18, rot: 11,  scale: 0.98, z: 20 },
    { y: 48, rot: 22,  scale: 0.96, z: 10 }
  ];

  let activeRoleKey = 'werewolf';

  function activateRole(roleKey) {
    const data = ROLES[roleKey];
    if (!data) return;

    activeRoleKey = roleKey;
    playCardSelectSound();

    cards.forEach(card => {
      if (card.dataset.role === roleKey) {
        card.classList.add('active-hero');
        if (hasGSAP) {
          gsap.fromTo(card, { scale: 1.02 }, { scale: 1.06, duration: 0.3, ease: 'back.out(2)' });
        }
      } else {
        card.classList.remove('active-hero');
      }
    });

    if (playHeroBtn) {
      const span = playHeroBtn.querySelector('span');
      if (span) {
        span.textContent = `Launch ${data.name} Quest`;
      }
    }
  }

  // Master Intro Dealing & Entrance Timeline
  if (hasGSAP) {
    const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Floating Capsule Navbar drops in smoothly
    introTl.from('.navbar', {
      y: -42,
      opacity: 0,
      duration: 0.9
    });

    // 2. Floating Witch & Cauldron pop in with spring elasticity
    introTl.from(['#witchFloat', '#cauldronFloat'], {
      scale: 0.35,
      opacity: 0,
      duration: 1.1,
      stagger: 0.14,
      ease: 'back.out(1.8)'
    }, '-=0.55');

    // 3. Hero Headlines stagger in with authority
    introTl.from(['#heroTitleTop', '#heroTitleBottom'], {
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power4.out'
    }, '-=0.6');

    // 4. Hero Subtitle glides up
    introTl.from('#heroSubtitle', {
      y: 18,
      opacity: 0,
      duration: 0.75
    }, '-=0.5');

    // 5. Epic Fanned Cards Dealing Sequence (deals like real game cards)
    cards.forEach((card, idx) => {
      const rest = CARD_RESTING[idx];
      introTl.fromTo(card, {
        y: 160,
        rotation: 0,
        scale: 0.8,
        opacity: 0
      }, {
        y: rest.y,
        rotation: rest.rot,
        scale: rest.scale,
        opacity: 1,
        duration: 1.15,
        ease: 'back.out(1.4)'
      }, `-=${idx === 0 ? 0.45 : 0.98}`);
    });

    // 6. Bottom utility bar fades up
    introTl.from('.bottom-bar', {
      y: 22,
      opacity: 0,
      duration: 0.75
    }, '-=0.5');
  }

  // Tactile Interactive Hover & 3D Tilt per Card (Smooth & Fluid)
  cards.forEach((card, i) => {
    const rest = CARD_RESTING[i];
    const innerBox = card.querySelector('.card-inner-box');
    const charImg = card.querySelector('.card-char-img, .full-card-art');
    const hoverFooter = card.querySelector('.card-hover-footer');

    card.addEventListener('mouseenter', () => {
      playHoverSound();

      if (hasGSAP) {
        // Elegantly glide hovered card upward with high z-index and straighten smoothly
        gsap.to(card, {
          x: 0,
          y: -46,
          rotation: 0,
          scale: 1.10,
          zIndex: 150,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        // Sibling cards gently soften without horizontal jitter
        cards.forEach((otherCard, j) => {
          if (j !== i) {
            const otherRest = CARD_RESTING[j];
            gsap.to(otherCard, {
              x: 0,
              y: otherRest.y,
              rotation: otherRest.rot,
              scale: otherRest.scale * 0.98,
              zIndex: otherRest.z,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });

        if (hoverFooter) {
          gsap.to(hoverFooter, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
      }
    });

    // Silky Smooth 3D Tilt following mouse over card
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (x - centerX) / centerX; // -1 to 1
      const tiltY = (y - centerY) / centerY;

      if (hasGSAP && innerBox) {
        gsap.to(innerBox, {
          rotateX: -tiltY * 7,
          rotateY: tiltX * 7,
          transformPerspective: 800,
          duration: 0.38,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (charImg) {
          gsap.to(charImg, {
            x: tiltX * 5,
            y: tiltY * 4,
            duration: 0.42,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      } else {
        const rotateX = tiltY * -8;
        const rotateY = tiltX * 8;
        card.style.transform = `translateY(-46px) rotate(0deg) scale(1.10) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (hasGSAP) {
        // Return this card to resting pose with graceful deceleration
        gsap.to(card, {
          x: 0,
          y: rest.y,
          rotation: rest.rot,
          scale: rest.scale,
          zIndex: rest.z,
          duration: 0.58,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        // Return all other cards to resting poses
        cards.forEach((otherCard, j) => {
          if (j !== i) {
            const otherRest = CARD_RESTING[j];
            gsap.to(otherCard, {
              x: 0,
              y: otherRest.y,
              rotation: otherRest.rot,
              scale: otherRest.scale,
              zIndex: otherRest.z,
              duration: 0.58,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });

        if (innerBox) {
          gsap.to(innerBox, { rotateX: 0, rotateY: 0, duration: 0.48, ease: 'power3.out', overwrite: 'auto' });
        }
        if (charImg) {
          gsap.to(charImg, { x: 0, y: 0, duration: 0.48, ease: 'power3.out', overwrite: 'auto' });
        }
        if (hoverFooter) {
          gsap.to(hoverFooter, { opacity: 0, y: 10, duration: 0.28, ease: 'power2.out' });
        }
      } else {
        card.style.transform = '';
      }
    });

    card.addEventListener('click', (e) => {
      const roleKey = card.dataset.role;
      if (card.classList.contains('active-hero')) {
        openRoleModal(roleKey);
      } else {
        activateRole(roleKey);
      }
    });

    card.addEventListener('dblclick', () => {
      openRoleModal(card.dataset.role);
    });

    // Quick Play / Select button inside card
    const selectBtn = card.querySelector('.card-select-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRoleModal(card.dataset.role);
      });
    }
  });

  // Button micro-interactions with GSAP elastic bounce
  if (hasGSAP) {
    const bounceElements = ['#clueLogoBtn', '#coinsPill', '.nav-signup-btn', '#playHeroBtn', '#soundToggleBtn', '#referenceOverlayBtn'];
    bounceElements.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.addEventListener('mousedown', () => {
          gsap.to(el, { scale: 0.94, duration: 0.12, ease: 'power1.out' });
        });
        el.addEventListener('mouseup', () => {
          gsap.to(el, { scale: 1, duration: 0.35, ease: 'elastic.out(1.3, 0.4)' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      }
    });
  }

  // =========================================================================
  // Role Details Modal Spotlight with GSAP Transitions
  // =========================================================================
  const roleModal = document.getElementById('roleModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPreviewSide = document.getElementById('modalPreviewSide');
  const modalSideBadge = document.getElementById('modalSideBadge');
  const modalRatingVal = document.getElementById('modalRatingVal');
  const modalRoleTitle = document.getElementById('modalRoleTitle');
  const modalRoleSummary = document.getElementById('modalRoleSummary');
  const statTeam = document.getElementById('statTeam');
  const statWinRate = document.getElementById('statWinRate');
  const statDifficulty = document.getElementById('statDifficulty');
  const statPlayers = document.getElementById('statPlayers');
  const modalRoleDesc = document.getElementById('modalRoleDesc');
  const modalSelectBtn = document.getElementById('modalSelectBtn');
  const modalAudioBtn = document.getElementById('modalAudioBtn');

  function renderStarRating(count, max = 5) {
    let html = '<span class="star-rating-row" style="display:inline-flex;gap:3px;align-items:center;">';
    for (let i = 1; i <= max; i++) {
      const fill = i <= count ? '#f59e0b' : 'rgba(0,0,0,0.18)';
      html += `<svg class="ui-icon" style="width:14px;height:14px;fill:${fill};" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
    html += '</span>';
    return html;
  }

  function openRoleModal(roleKey) {
    const data = ROLES[roleKey];
    if (!data) return;

    playSwitchSnap();

    // Populate modal fields
    modalSideBadge.textContent = data.side;
    if (data.side.includes('GOOD')) {
      modalSideBadge.style.color = '#38bdf8';
      modalSideBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      modalSideBadge.style.borderColor = 'rgba(56, 189, 248, 0.4)';
    } else {
      modalSideBadge.style.color = '#ff6b6b';
      modalSideBadge.style.background = 'rgba(244, 63, 94, 0.2)';
      modalSideBadge.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    }

    modalRatingVal.textContent = data.rating;
    modalRoleTitle.textContent = data.name;
    modalRoleSummary.textContent = data.roleSummary;
    statTeam.textContent = data.team;
    statWinRate.textContent = data.winRate;
    if (statDifficulty) statDifficulty.innerHTML = renderStarRating(data.difficultyStars || 5);
    statPlayers.textContent = data.players;
    modalRoleDesc.textContent = data.desc;

    // Spotlight card preview
    modalPreviewSide.innerHTML = `
      <div class="modal-spotlight-card" style="border-color: ${data.color}">
        <img src="${data.image}" alt="${data.name}">
      </div>
    `;

    roleModal.classList.add('active');
    roleModal.setAttribute('aria-hidden', 'false');

    if (hasGSAP) {
      gsap.fromTo(roleModal, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: 'power2.out' });
      gsap.fromTo('.modal-card', 
        { scale: 0.84, y: 35, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.48, ease: 'back.out(1.35)' }
      );
      gsap.from('.modal-card .stat-box', {
        opacity: 0,
        y: 14,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.14
      });
    }
  }

  function closeRoleModal() {
    if (hasGSAP) {
      gsap.to('.modal-card', {
        scale: 0.88,
        y: 20,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          roleModal.classList.remove('active');
          roleModal.setAttribute('aria-hidden', 'true');
          gsap.set('.modal-card', { clearProps: 'all' });
        }
      });
      gsap.to(roleModal, { opacity: 0, duration: 0.22 });
    } else {
      roleModal.classList.remove('active');
      roleModal.setAttribute('aria-hidden', 'true');
    }
    playSwitchSnap();
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeRoleModal);
  }

  if (roleModal) {
    roleModal.addEventListener('click', (e) => {
      if (e.target === roleModal) {
        closeRoleModal();
      }
    });
  }

  if (modalSelectBtn) {
    modalSelectBtn.addEventListener('click', () => {
      closeRoleModal();
      triggerToast(`${ROLES[activeRoleKey].name} learning module activated!`);
    });
  }

  if (modalAudioBtn) {
    modalAudioBtn.addEventListener('click', () => {
      playSwitchSnap();
      triggerToast(`Playing ${ROLES[activeRoleKey].name} audio walkthrough...`);
    });
  }

  // =========================================================================
  // Coin Incrementer (+50,000 on click)
  // =========================================================================
  const btnAddCoins = document.getElementById('btnAddCoins');
  const coinsAmount = document.getElementById('coinsAmount');
  const coinsPill = document.getElementById('coinsPill');

  let currentCoins = 28105820;

  function formatNumber(num) {
    return num.toLocaleString('de-DE'); // Formats with periods: 28.105.820
  }

  if (btnAddCoins) {
    btnAddCoins.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCoins += 50000;
      coinsAmount.textContent = formatNumber(currentCoins);

      // Play coin sound
      playCoinChime();

      // Spawn floating +50,000 particle
      const toast = document.createElement('div');
      toast.className = 'coin-float-toast';
      toast.innerHTML = '+50.000 <svg class="ui-icon ui-icon-gold" viewBox="0 0 24 24" style="width:12px;height:12px;vertical-align:-1px;"><circle cx="12" cy="12" r="10" fill="#facc15"/><polygon points="12,7 13.5,10.5 17.5,11 14.5,14 15.5,18 12,16 8.5,18 9.5,14 6.5,11 10.5,10.5" fill="#713f12"/></svg>';
      coinsPill.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 1000);
    });
  }

  // =========================================================================
  // Clue Logo Button (Click & Chirp & Smooth Scroll to Landing Top)
  // =========================================================================
  const clueLogoBtn = document.getElementById('clueLogoBtn');
  if (clueLogoBtn) {
    clueLogoBtn.addEventListener('click', () => {
      playSwitchSnap();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerToast('Clue System • Connected & Synced (v2.4.0)');
    });
  }

  // Games Navigation Button
  const btnGames = document.getElementById('btnGames');
  if (btnGames) {
    btnGames.addEventListener('click', () => {
      playSwitchSnap();
      const target = document.getElementById('cardsShowcase') || document.getElementById('pillarsSection');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      triggerToast('Academic Challenges & Modules Ready!');
    });
  }

  // =========================================================================
  // Sign Up Button (Navbar)
  // =========================================================================
  const navSignupBtn = document.getElementById('navSignupBtn');
  if (navSignupBtn) {
    navSignupBtn.addEventListener('click', () => {
      playSwitchSnap();
      const cta = document.getElementById('finalCtaSection');
      if (cta) {
        cta.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      triggerToast('Welcome to Clue! Registration opened for Smart Educational Games.');
    });
  }


  // =========================================================================
  // Notifications Drawer
  // =========================================================================
  const btnNotifications = document.getElementById('btnNotifications');
  const notifDrawer = document.getElementById('notifDrawer');
  const drawerClose = document.getElementById('drawerClose');

  if (btnNotifications && notifDrawer) {
    btnNotifications.addEventListener('click', () => {
      notifDrawer.classList.toggle('active');
      playSwitchSnap();
    });
  }

  if (drawerClose && notifDrawer) {
    drawerClose.addEventListener('click', () => {
      notifDrawer.classList.remove('active');
      playSwitchSnap();
    });
  }

  if (notifDrawer) {
    notifDrawer.addEventListener('click', (e) => {
      if (e.target === notifDrawer) {
        notifDrawer.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // Persistent Autoplay Unlock & Sound Toggle Button
  // =========================================================================
  const unlockAudioOnGesture = () => {
    initAudio();
    if (musicEnabled && !isManuallyPaused && bgAudio && bgAudio.paused) {
      startAmbientMusic();
    }
    // If audio playback is active, detach global unlock listeners
    if (bgAudio && !bgAudio.paused) {
      ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach((evt) => {
        document.removeEventListener(evt, unlockAudioOnGesture, true);
      });
    }
  };

  ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel'].forEach((evt) => {
    document.addEventListener(evt, unlockAudioOnGesture, true);
  });

  // Attempt initial playback immediately if browser allows autoplay
  try {
    startAmbientMusic();
  } catch (e) {
    // Waiting for first user gesture
  }

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSoundAndMusic();
    });
  }

  // =========================================================================
  // Reference Overlay Toggle
  // =========================================================================
  const referenceOverlayBtn = document.getElementById('referenceOverlayBtn');
  const referenceOverlay = document.getElementById('referenceOverlay');

  if (referenceOverlayBtn && referenceOverlay) {
    referenceOverlayBtn.addEventListener('click', () => {
      referenceOverlay.style.display = 'flex';
      playSwitchSnap();
    });

    referenceOverlay.addEventListener('click', () => {
      referenceOverlay.style.display = 'none';
      playSwitchSnap();
    });
  }

  // Play Hero Button
  if (playHeroBtn) {
    playHeroBtn.addEventListener('click', () => {
      playSwitchSnap();
      openRoleModal(activeRoleKey);
    });
  }

  // Promo Pill Click
  const promoPill = document.getElementById('promoPill');
  if (promoPill) {
    promoPill.addEventListener('click', () => {
      playCoinChime();
      triggerToast('Free Access Pass Activated: 5 Months full library access!');
    });
  }

  // Generic Toast Notification
  function triggerToast(message) {
    const existing = document.querySelector('.app-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(16, 17, 24, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(16px);
      z-index: 200;
      pointer-events: none;
      animation: toastFade 2.4s ease forwards;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  // Keybindings
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (roleModal && roleModal.classList.contains('active')) {
        closeRoleModal();
      }
      if (notifDrawer && notifDrawer.classList.contains('active')) {
        notifDrawer.classList.remove('active');
      }
      if (referenceOverlay && referenceOverlay.style.display === 'flex') {
        referenceOverlay.style.display = 'none';
      }
    }
  });

  // =========================================================================
  // Section 2: Live Battle Arenas & Interactive Filters
  // =========================================================================
  const scrollCueBtn = document.getElementById('scrollCueBtn');
  if (scrollCueBtn) {
    scrollCueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('arenasSection');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        playHoverSound();
      }
    });
  }

  // Filter Tabs
  const arenaTabs = document.querySelectorAll('.arena-tab');
  const arenaCards = document.querySelectorAll('.arena-card');

  arenaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      arenaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      playSwitchSnap();

      arenaCards.forEach(card => {
        const cat = card.dataset.category || '';
        const match = filter === 'all' || cat.includes(filter);

        if (hasGSAP) {
          if (match) {
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              display: 'flex',
              ease: 'power2.out'
            });
          } else {
            gsap.to(card, {
              opacity: 0,
              scale: 0.94,
              duration: 0.25,
              display: 'none',
              ease: 'power2.in'
            });
          }
        } else {
          card.style.display = match ? 'flex' : 'none';
        }
      });
    });
  });

  // Arena Play Buttons
  const arenaPlayBtns = document.querySelectorAll('.arena-play-btn');
  arenaPlayBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playCardSelectSound();
      const arenaType = btn.dataset.arena;
      if (arenaType && ROLES[arenaType]) {
        openRoleModal(arenaType);
      } else {
        triggerToast('Connecting to Live Matchmaking Queue...');
      }
    });
  });

  // Arena Card Click
  arenaCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.arena-play-btn') || e.target.closest('.arena-spectate-btn')) return;
      const arenaType = card.dataset.arena;
      if (arenaType && ROLES[arenaType]) {
        playHoverSound();
        openRoleModal(arenaType);
      }
    });
  });

  // Arena Spectate Buttons
  const arenaSpectateBtns = document.querySelectorAll('.arena-spectate-btn');
  arenaSpectateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSwitchSnap();
      const arenaType = btn.dataset.arena;
      triggerToast(`Connecting to Live Spectator Feed for ${arenaType ? arenaType.toUpperCase() : 'Arena'}...`);
      if (arenaType && ROLES[arenaType]) {
        setTimeout(() => openRoleModal(arenaType), 400);
      }
    });
  });

  // Gamified Quick Match Roulette
  const quickMatchBtn = document.getElementById('quickMatchBtn');
  if (quickMatchBtn) {
    quickMatchBtn.addEventListener('click', () => {
      playCardSelectSound();
      const arenaKeys = ['werewolf', 'seer', 'witch', 'hunter'];
      const picked = arenaKeys[Math.floor(Math.random() * arenaKeys.length)];
      const targetCard = document.querySelector(`.arena-${picked}`);
      
      triggerToast(`Quick Match Roulette: Entering ${picked.toUpperCase()} Arena!`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (hasGSAP) {
          gsap.fromTo(targetCard, 
            { y: -16, scale: 1.04, borderColor: '#ffffff' },
            { y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' }
          );
        }
      }
      setTimeout(() => {
        if (ROLES[picked]) openRoleModal(picked);
      }, 650);
    });
  }

  // Live Lobby Matchmaking Timer
  const lobbyTimer = document.getElementById('lobbyTimer');
  if (lobbyTimer) {
    let secondsLeft = 38;
    setInterval(() => {
      secondsLeft--;
      if (secondsLeft < 0) secondsLeft = 45;
      const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
      const ss = String(secondsLeft % 60).padStart(2, '0');
      lobbyTimer.textContent = `${mm}:${ss}`;
    }, 1000);
  }

  // VIP Learning Pass Claim Button
  const passClaimBtn = document.getElementById('passClaimBtn');
  if (passClaimBtn) {
    passClaimBtn.addEventListener('click', () => {
      playCoinChime();
      currentCoins += 50000;
      if (coinsAmount) coinsAmount.textContent = formatNumber(currentCoins);
      triggerToast('5 Months VIP Pass Claimed! +50,000 Coins Deposited.');
      if (hasGSAP) {
        gsap.fromTo(passClaimBtn, { scale: 0.92 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1.4, 0.4)' });
      }
    });
  }

  // =========================================================================
  // Footer & Final CTA Interactive Handlers
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      playSwitchSnap();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const footerSubscribeBtn = document.getElementById('footerSubscribeBtn');
  if (footerSubscribeBtn) {
    footerSubscribeBtn.addEventListener('click', () => {
      playCoinChime();
      triggerToast('Subscribed to The Clue Intel Dispatch! +500 XP');
      if (hasGSAP) {
        gsap.fromTo(footerSubscribeBtn, { scale: 0.93 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.4)' });
      }
    });
  }

  const footerSignUpBtn = document.getElementById('footerSignUpBtn');
  if (footerSignUpBtn) {
    footerSignUpBtn.addEventListener('click', () => {
      playCoinChime();
      currentCoins += 50000;
      if (coinsAmount) coinsAmount.textContent = formatNumber(currentCoins);
      triggerToast('Welcome! Your Free Season 01 Pass is Ready.');
      if (hasGSAP) {
        gsap.fromTo(footerSignUpBtn, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.4)' });
      }
    });
  }

  // =========================================================================
  // Platform Interactive Hub Handlers (Tests, Games, Prizes & Interviews)
  // =========================================================================
  function jumpToGameEngine(engineKey, toastMessage) {
    playCardSelectSound();
    if (typeof switchLibraryEngine === 'function') {
      switchLibraryEngine(engineKey);
    }
    triggerToast(toastMessage);
    const prizesSec = document.getElementById('prizesSection');
    if (prizesSec) {
      if (lenis) {
        lenis.scrollTo(prizesSec, { offset: -10, duration: 1.1 });
      } else {
        prizesSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    const previewCard = document.querySelector('.engine-interactive-preview');
    if (hasGSAP && previewCard) {
      gsap.fromTo(previewCard, { scale: 0.96 }, { scale: 1, duration: 0.55, delay: 0.35, ease: 'elastic.out(1.2, 0.4)' });
    }
  }

  const pillarBtns = document.querySelectorAll('.pillar-btn');
  pillarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      if (action === 'test') {
        jumpToGameEngine('brain', 'Loaded Curriculum & Rapid Logic Test on the Game Stage!');
      } else if (action === 'game') {
        jumpToGameEngine('music', 'Loaded Recreational Trivia & Audio Suite on the Game Stage!');
      } else if (action === 'prize') {
        jumpToGameEngine('duels', 'Loaded 3-Life Sudden Death Mode on the Game Stage!');
      } else if (action === 'interview') {
        jumpToGameEngine('movies', 'Loaded Daily Streak Challenge on the Game Stage!');
      }
    });
  });

  // =========================================================================
  // Section 3: The Clue Game Studio & Interactive Showcase
  // =========================================================================
  const engineNavTabs = document.querySelectorAll('.engine-nav-tab');
  const engineCategoryTag = document.getElementById('engineCategoryTag');
  const engineStatsTag = document.getElementById('engineStatsTag');
  const engineShowcaseTitle = document.getElementById('engineShowcaseTitle');
  const engineShowcaseDesc = document.getElementById('engineShowcaseDesc');
  const engineFeaturesList = document.getElementById('engineFeaturesList');
  const engineLaunchBtn = document.getElementById('engineLaunchBtn');
  const engineLaunchBtnText = document.getElementById('engineLaunchBtnText');
  const engineModeNote = document.getElementById('engineModeNote');
  const previewChromeTitle = document.getElementById('previewChromeTitle');
  const previewTimerPill = document.getElementById('previewTimerPill');
  const previewVisualStage = document.getElementById('previewVisualStage');
  const previewModeSub = document.getElementById('previewModeSub');
  const previewQuestion = document.getElementById('previewQuestion');
  const previewHintContent = document.getElementById('previewHintContent');
  const previewOptionsGrid = document.getElementById('previewOptionsGrid');
  const libraryShowcaseStage = document.getElementById('libraryShowcaseStage');

  const libraryEngines = {
    music: {
      category: 'AUDIO RECOGNITION ENGINE',
      stats: '12k+ Tracks • 5s Audio Snips',
      title: 'Music Games Suite: Who Sang This? & Lyric Blitz',
      desc: 'Test your musical instincts across Afrobeats, Amapiano, Hip-Hop, Pop, and Gospel. Listen to a 5-second audio snippet, name the artist, fill missing verses before the clock runs out, and explore deep album lore.',
      features: [
        { title: 'Who Sang This?', desc: 'Recognize breakout singles & global chart-toppers within 5 seconds.' },
        { title: 'Finish the Lyrics', desc: 'Fill missing verses and hooks under high-speed countdown clocks.' },
        { title: 'Artist & Album Deep Cuts', desc: 'Producers, release dates, tracklists, and cultural music history.' }
      ],
      btnText: 'Play Music Suite',
      modeNote: 'Mode: Solo Challenge or 1v1 Live Duel',
      chromeTitle: 'CLUE AUDIO ENGINE',
      timer: '00:04',
      visualHtml: `
        <div class="audio-waveform-graphic">
          <span class="wave-bar w1"></span>
          <span class="wave-bar w2"></span>
          <span class="wave-bar w3"></span>
          <span class="wave-bar w4"></span>
          <span class="wave-bar w5"></span>
          <span class="wave-bar w6"></span>
          <span class="wave-bar w7"></span>
          <span class="wave-bar w8"></span>
          <span class="wave-bar w9"></span>
          <span class="wave-bar w10"></span>
        </div>
        <span class="audio-playing-track">Now Playing: 5s Clip • Afrobeats Hit</span>
      `,
      modeSub: 'Who Sang This?',
      question: '"Name the artist behind this 2023 chart-topping hit:"',
      hint: '"Born in Lagos • Known for high-energy Fuji-infused anthems"',
      options: ['Burna Boy', 'Asake', 'Rema', 'Fireboy DML'],
      correctIndex: 1,
      modalRole: 'seer',
      toast: 'Music Games Suite: "Who Sang This?" and "Lyric Blitz" loaded!'
    },
    movies: {
      category: 'CINEMA & VISUAL ENGINE',
      stats: '8.5k+ Movies • Nollywood & Hollywood',
      title: 'Movie & Visual Suite: What Movie Is This? & Scene Decoders',
      desc: 'From record-breaking Nollywood blockbusters to Hollywood epics, anime, and streaming sensations. Guess actors, complete memorable quotes, and decode legendary scenes from key stills.',
      features: [
        { title: 'Scene Decoder', desc: 'Identify movies from key stills & premise riddles.' },
        { title: 'Complete the Quote', desc: 'Iconic cinema dialogue from Nollywood to global hits.' },
        { title: 'Guess the Actor', desc: 'Character roles, credits, and director filmographies.' }
      ],
      btnText: 'Play Movie Suite',
      modeNote: 'Mode: Time Attack & Elimination Derby',
      chromeTitle: 'CLUE CINEMA ENGINE',
      timer: '00:07',
      visualHtml: `
        <div style="display:flex;align-items:center;gap:8px;background:#f5f3ff;border:1px solid #ddd6fe;padding:8px 16px;border-radius:9999px;">
          <svg class="ui-icon" style="color:#7c3aed;width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
          <span style="font-size:12px;font-weight:700;font-style:italic;color:#4c1d95;">“If you don't know who I am, ask your father.”</span>
        </div>
      `,
      modeSub: 'Complete the Quote',
      question: '"Name this record-breaking box office Nollywood epic:"',
      hint: '"Directed by Jade Osiberu • Gritty street thriller set in Isale Eko"',
      options: ['King of Boys', 'Brotherhood', 'Gangs of Lagos', 'The Black Book'],
      correctIndex: 2,
      modalRole: 'seer',
      toast: 'Movie & Visual Suite: Scene Decoders & Iconic Dialogue loaded!'
    },
    brain: {
      category: 'RECREATIONAL COGNITIVE ENGINE',
      stats: '100+ Formats • Dynamic Difficulty',
      title: 'Brain Games Suite: Logic, Patterns & Memory Blitz',
      desc: 'Think, discover, and solve without feeling like you are taking an exam. Solve rapid logic riddles, visual pattern puzzles, word association challenges, and speed memory games.',
      features: [
        { title: 'Memory & Patterns', desc: 'Sequence puzzles and cognitive recall challenges.' },
        { title: 'Rapid Logic & Riddles', desc: 'Deductions designed to make you laugh and think.' },
        { title: 'Word & Visual Games', desc: 'Unexpected twists that sharpen your mental agility.' }
      ],
      btnText: 'Play Brain Suite',
      modeNote: 'Mode: Speed Logic & Daily Practice',
      chromeTitle: 'CLUE LOGIC ENGINE',
      timer: '00:12',
      visualHtml: `
        <div style="display:flex;align-items:center;gap:8px;background:#eef2ff;border:1px solid #c7d2fe;padding:8px 16px;border-radius:9999px;">
          <svg class="ui-icon" style="color:#4f46e5;width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <span style="font-size:12px;font-weight:700;color:#312e81;">Cognitive Speed Deduction • 15-Second Clock</span>
        </div>
      `,
      modeSub: 'Rapid Logic Puzzle',
      question: '"If 3 cats catch 3 mice in 3 minutes, how many minutes for 100 cats to catch 100 mice?"',
      hint: '"Think individual rates: Each cat catches 1 mouse in 3 minutes."',
      options: ['100 minutes', '30 minutes', '3 minutes', '1 minute'],
      correctIndex: 2,
      modalRole: 'seer',
      toast: 'Brain Games Suite: Speed Logic & Cognitive Riddles loaded!'
    },
    duels: {
      category: 'MULTIPLAYER TOURNAMENT ENGINE',
      stats: 'Live Matchmaking • 3-Life System',
      title: '1v1 & Competitive Arenas: Sudden Death & Elimination Cups',
      desc: 'Challenge friends or get matched with live opponents nationwide. Compete in 3-Life Sudden Death showdowns, bracket tournaments, and campus derbies with airtime and cash prizes.',
      features: [
        { title: 'Head-to-Head 1v1', desc: 'Real-time matchmaking with 3-second queue times.' },
        { title: '3-Life Sudden Death', desc: 'Every wrong answer costs a life; last player standing wins.' },
        { title: 'Elimination Cups & Leaderboards', desc: 'Weekly bracket tournaments with brand rewards.' }
      ],
      btnText: 'Enter 1v1 Arena',
      modeNote: 'Mode: Ranked Multiplayer Derby',
      chromeTitle: 'CLUE MULTIPLAYER HUD',
      timer: '00:03',
      visualHtml: `
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="display:flex;align-items:center;gap:6px;background:#eef2ff;border:1px solid #c7d2fe;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;color:#3730a3;">
            <span style="width:7px;height:7px;border-radius:50%;background:#4f46e5;"></span>
            <span>You (240 XP)</span>
          </div>
          <span style="font-size:11px;font-weight:900;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;border:1px solid #ddd6fe;">VS</span>
          <div style="display:flex;align-items:center;gap:6px;background:#f5f3ff;border:1px solid #ddd6fe;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;color:#581c87;">
            <span style="width:7px;height:7px;border-radius:50%;background:#7c3aed;"></span>
            <span>Kemi_99 (210 XP)</span>
          </div>
        </div>
      `,
      modeSub: '1v1 Sudden Death',
      question: '"Solve: What is the only word in English spelled with 5 consecutive vowels?"',
      hint: '"Originates from French • Means a waiting line of people or vehicles"',
      options: ['Queueing', 'Cooperative', 'Continuity', 'Sequencing'],
      correctIndex: 0,
      modalRole: 'werewolf',
      toast: '1v1 Matchmaking Arena: Live 3-Life Sudden Death queued!'
    }
  };

  let activeLibraryKey = 'music';
  let libraryAnswered = false;

  function renderLibraryOptions(engineKey) {
    if (!previewOptionsGrid) return;
    const engine = libraryEngines[engineKey];
    if (!engine) return;

    previewOptionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    engine.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'preview-opt-btn';
      btn.type = 'button';
      btn.dataset.opt = idx;
      btn.innerHTML = `
        <span class="opt-key">${letters[idx]}</span>
        <span class="opt-name">${optText}</span>
      `;
      btn.addEventListener('click', () => handleLibraryOptionClick(idx, btn));
      previewOptionsGrid.appendChild(btn);
    });
  }

  function handleLibraryOptionClick(idx, clickedBtn) {
    if (libraryAnswered) return;
    libraryAnswered = true;

    const engine = libraryEngines[activeLibraryKey];
    if (!engine) return;

    const allBtns = previewOptionsGrid ? previewOptionsGrid.querySelectorAll('.preview-opt-btn') : [];

    if (idx === engine.correctIndex) {
      clickedBtn.classList.add('opt-correct');
      playCoinChime();
      triggerToast('Correct! +500 XP Earned • Daily Streak Extended!');
      if (hasGSAP) {
        gsap.fromTo(clickedBtn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.4)' });
      }
    } else {
      clickedBtn.classList.add('opt-wrong');
      playSwitchSnap();
      if (allBtns[engine.correctIndex]) {
        allBtns[engine.correctIndex].classList.add('opt-correct');
      }
      triggerToast('Adaptive Clue triggered: Review the hint above!');
      if (hasGSAP) {
        gsap.fromTo(clickedBtn, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.2, 0.3)' });
      }
    }
  }

  function switchLibraryEngine(engineKey) {
    const engine = libraryEngines[engineKey];
    if (!engine) return;
    activeLibraryKey = engineKey;
    libraryAnswered = false;

    // Update nav tabs
    engineNavTabs.forEach(tab => {
      const isCurrent = tab.dataset.engine === engineKey;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Animate stage
    if (hasGSAP && libraryShowcaseStage) {
      gsap.fromTo(libraryShowcaseStage, { opacity: 0.75, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }

    if (engineCategoryTag) engineCategoryTag.textContent = engine.category;
    if (engineStatsTag) engineStatsTag.textContent = engine.stats;
    if (engineShowcaseTitle) engineShowcaseTitle.textContent = engine.title;
    if (engineShowcaseDesc) engineShowcaseDesc.textContent = engine.desc;

    if (engineFeaturesList) {
      engineFeaturesList.innerHTML = engine.features.map(f => `
        <div class="feature-item">
          <div class="feature-bullet-icon">
            <svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          </div>
          <div class="feature-item-content">
            <strong>${f.title}</strong>
            <span>${f.desc}</span>
          </div>
        </div>
      `).join('');
    }

    if (engineLaunchBtnText) engineLaunchBtnText.textContent = engine.btnText;
    if (engineModeNote) engineModeNote.textContent = engine.modeNote;
    if (previewChromeTitle) previewChromeTitle.textContent = engine.chromeTitle;
    if (previewTimerPill) previewTimerPill.textContent = engine.timer;
    if (previewVisualStage) previewVisualStage.innerHTML = engine.visualHtml;
    if (previewModeSub) previewModeSub.textContent = engine.modeSub;
    if (previewQuestion) previewQuestion.textContent = engine.question;
    if (previewHintContent) previewHintContent.textContent = engine.hint;

    renderLibraryOptions(engineKey);
  }

  // Attach tab listeners
  engineNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const engineKey = tab.dataset.engine;
      if (engineKey && libraryEngines[engineKey]) {
        playSwitchSnap();
        switchLibraryEngine(engineKey);
      }
    });
  });

  // Attach launch CTA listener
  if (engineLaunchBtn) {
    engineLaunchBtn.addEventListener('click', () => {
      playCoinChime();
      const engine = libraryEngines[activeLibraryKey];
      if (engine) {
        triggerToast(engine.toast);
        setTimeout(() => openRoleModal(engine.modalRole), 400);
      }
    });
  }

  // Initial options click listeners
  if (previewOptionsGrid) {
    const initialBtns = previewOptionsGrid.querySelectorAll('.preview-opt-btn');
    initialBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => handleLibraryOptionClick(idx, btn));
    });
  }

  const examActionBtns = document.querySelectorAll('.exam-action-btn');
  const examEngines = ['music', 'brain', 'duels', 'movies'];
  examActionBtns.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetEngine = examEngines[idx % examEngines.length];
      jumpToGameEngine(targetEngine, 'Loaded Live Event & Tournament Arena on the Game Stage!');
    });
  });

  // =========================================================================
  // Section 6: Interactive Pricing Toggle (Individual vs Company) & Plan Actions
  // =========================================================================
  const pricingTabs = document.querySelectorAll('.billing-tab[data-pricing-tab]');
  const pricingPanels = document.querySelectorAll('.pricing-grid[data-pricing-panel]');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetGroup = tab.dataset.pricingTab;
      if (!targetGroup) return;
      playSwitchSnap();

      pricingTabs.forEach(t => {
        const isCurrent = t === tab;
        t.classList.toggle('active', isCurrent);
        t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      pricingPanels.forEach(panel => {
        const isMatch = panel.dataset.pricingPanel === targetGroup;
        panel.classList.toggle('active', isMatch);
        if (isMatch && hasGSAP) {
          const cards = panel.querySelectorAll('.pricing-card');
          gsap.fromTo(cards,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' }
          );
        }
      });
    });
  });

  const pricingActionBtns = document.querySelectorAll('.pricing-action-btn');
  pricingActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.dataset.plan || 'Clue Plan';
      playCoinChime();
      triggerToast(`${planName} selected! Opening setup & instant access...`);
      if (hasGSAP) {
        gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' });
      }
    });
  });

  // Store Download Buttons & Mobile App HUD Simulation
  const storeDownloadBtns = document.querySelectorAll('.store-download-btn');
  storeDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const storeName = btn.dataset.store || 'Mobile Store';
      playCoinChime();
      triggerToast(`Redirecting to ${storeName} • Clue Mobile App (iOS & Android)...`);
      if (hasGSAP) {
        gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1.3, 0.4)' });
      }
    });
  });

  const finalSignUpBtn = document.getElementById('finalSignUpBtn');
  const phoneProgressFill = document.getElementById('phoneProgressFill');
  const phoneStreakDays = document.getElementById('phoneStreakDays');
  if (finalSignUpBtn) {
    finalSignUpBtn.addEventListener('click', () => {
      playCoinChime();
      currentCoins += 50000;
      if (coinsAmount) coinsAmount.textContent = formatNumber(currentCoins);
      if (phoneProgressFill) phoneProgressFill.style.width = '100%';
      if (phoneStreakDays) phoneStreakDays.textContent = 'Day 43 / 365';
      triggerToast('Daily 20/20 Target Complete! +₦1,500 Airtime Drop & 50,000 Clue Coins Credited.');
      if (hasGSAP) {
        gsap.fromTo(finalSignUpBtn, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.4)' });
      }
    });
  }

  // =========================================================================
  // Ultra-Smooth Inertial Scroll (Lenis + GSAP Ticker) & Real-time Progress
  // =========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  let lenis = null;

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }
  }

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8
    });

    if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  const landingHeroBackdrop = document.querySelector('.landing-hero-backdrop');
  const landingSection = document.getElementById('landingSection');
  const syncLandingBackdrop = () => {
    if (landingHeroBackdrop && landingSection) {
      landingHeroBackdrop.style.height = `${landingSection.offsetHeight}px`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', () => {
    updateScrollProgress();
    syncLandingBackdrop();
  }, { passive: true });
  window.addEventListener('load', syncLandingBackdrop);
  updateScrollProgress();
  syncLandingBackdrop();
  setTimeout(syncLandingBackdrop, 250);

  // Universal Smooth Navigation for In-Page Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -20, duration: 1.25 });
          } else if (hasGSAP && typeof ScrollToPlugin !== 'undefined') {
            gsap.to(window, { duration: 1.1, scrollTo: { y: targetElement, offsetY: 20 }, ease: 'power3.inOut' });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  // =========================================================================
  // GSAP ScrollTrigger Choreographed Section Animations
  // =========================================================================
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    // 1. Section Headers (Badge + Title + Subtitle)
    document.querySelectorAll('.platform-section').forEach((sec) => {
      const headerEls = sec.querySelectorAll(':scope > .section-pill-badge, :scope > .section-title, :scope > .section-subtitle');
      if (headerEls.length) {
        gsap.from(headerEls, {
          scrollTrigger: {
            trigger: sec,
            start: 'top 84%',
            toggleActions: 'play none none none'
          },
          y: 34,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });

    // 2. Pillars Section Cards (#pillarsSection)
    const pillarCards = document.querySelectorAll('#pillarsSection .pillar-card');
    if (pillarCards.length) {
      gsap.from(pillarCards, {
        scrollTrigger: {
          trigger: '#pillarsSection .pillars-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 46,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        stagger: 0.11,
        ease: 'power3.out'
      });
    }

    // 3. Expanding Game Library Section (#prizesSection)
    const engineTabs = document.querySelectorAll('#prizesSection .engine-nav-tab');
    if (engineTabs.length) {
      gsap.from(engineTabs, {
        scrollTrigger: {
          trigger: '#prizesSection .library-engines-nav',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }

    const showcaseStage = document.querySelector('#libraryShowcaseStage');
    if (showcaseStage) {
      gsap.from(showcaseStage, {
        scrollTrigger: {
          trigger: showcaseStage,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 44,
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        ease: 'power3.out'
      });
    }

    const telemetryItems = document.querySelectorAll('.engine-telemetry-ribbon .telemetry-item');
    if (telemetryItems.length) {
      gsap.from(telemetryItems, {
        scrollTrigger: {
          trigger: '.engine-telemetry-ribbon',
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }

    // 4. Clue Parties & Live Events Section (#interviewsSection)
    const examCards = document.querySelectorAll('#interviewsSection .exam-card');
    if (examCards.length) {
      gsap.from(examCards, {
        scrollTrigger: {
          trigger: '#interviewsSection .interviews-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 44,
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    const trustBar = document.querySelector('#interviewsSection .proctor-trust-bar');
    if (trustBar) {
      gsap.from(trustBar, {
        scrollTrigger: {
          trigger: trustBar,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 26,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out'
      });
    }

    // 5. Rewards & Sponsored Challenges (#howItWorksSection)
    const stepCards = document.querySelectorAll('#howItWorksSection .step-card');
    if (stepCards.length) {
      gsap.from(stepCards, {
        scrollTrigger: {
          trigger: '#howItWorksSection .how-it-works-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 44,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // 6. Clue Chat, Communities & Metrics (#proofSection)
    const proofMetrics = document.querySelectorAll('#proofSection .proof-metric-item');
    if (proofMetrics.length) {
      gsap.from(proofMetrics, {
        scrollTrigger: {
          trigger: '#proofSection .proof-metrics-ribbon',
          start: 'top 86%',
          toggleActions: 'play none none none'
        },
        y: 28,
        opacity: 0,
        scale: 0.94,
        duration: 0.75,
        stagger: 0.1,
        ease: 'back.out(1.4)'
      });
    }

    const testimonialCards = document.querySelectorAll('#proofSection .testimonial-card');
    if (testimonialCards.length) {
      gsap.from(testimonialCards, {
        scrollTrigger: {
          trigger: '#proofSection .testimonials-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 44,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // 6.5 Pricing Section Cards (#pricingSection)
    const pricingCards = document.querySelectorAll('#pricingGridIndividual .pricing-card');
    if (pricingCards.length) {
      gsap.from(pricingCards, {
        scrollTrigger: {
          trigger: '#pricingGridIndividual',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 44,
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    // 7. Mobile App Download Card (#finalCtaSection)
    const finalCtaCard = document.querySelector('#finalCtaSection .mobile-app-card');
    if (finalCtaCard) {
      gsap.from(finalCtaCard, {
        scrollTrigger: {
          trigger: finalCtaCard,
          start: 'top 84%',
          toggleActions: 'play none none none'
        },
        y: 48,
        opacity: 0,
        scale: 0.97,
        duration: 0.9,
        ease: 'power3.out'
      });
    }

    // 8. Obsidian Pro Footer Reveal (.gh-footer)
    const ghFooterCols = document.querySelectorAll('.gh-footer .gh-col, .gh-footer .gh-mascot-stage');
    if (ghFooterCols.length) {
      gsap.from(ghFooterCols, {
        scrollTrigger: {
          trigger: '.gh-footer',
          start: 'top 86%',
          toggleActions: 'play none none none'
        },
        y: 32,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }
  }
});

