'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);
  const [easterEgg, setEasterEgg] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quote, setQuote] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // NEW: Single-screen engagement states
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [achievements, setAchievements] = useState<Array<{ id: number; text: string }>>([]);
  const [bgHue] = useState(230);
  const [comboCount, setComboCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);

  const holdTimerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const achievementIdRef = useRef(0);
  const lastShakeTime = useRef(0);

  const quotes = [
    'Building the future, one line at a time',
    'Where code meets creativity',
    'Crafting digital experiences',
    'Innovation in progress',
    'Creating something legendary',
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    const quoteTimer = setInterval(() => {
      setQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  // Sound effect function
  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // Achievement system
  const addAchievement = (text: string) => {
    const id = achievementIdRef.current++;
    setAchievements(prev => [...prev, { id, text }]);
    playSound(800, 0.3);
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }, 3000);
  };

  // NEW: Shake detection
  useEffect(() => {
    let lastX = 0,
      lastY = 0,
      lastZ = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || !acc.x || !acc.y || !acc.z) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if (deltaX + deltaY + deltaZ > 30) {
        const now = Date.now();
        if (now - lastShakeTime.current > 1000) {
          lastShakeTime.current = now;
          handleShake();
        }
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  const handleShake = () => {
    const newShakeCount = shakeCount + 1;
    setShakeCount(newShakeCount);

    // Trigger confetti explosion
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 100;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const id = particleIdRef.current++;
      const emojis = ['✨', '⭐', '💫', '🌟', '💥', '🎉', '🎊', '🔥'];
      setParticles(prev => [
        ...prev,
        {
          id,
          x,
          y,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        },
      ]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 1500);
    }

    playSound(600 + newShakeCount * 100, 0.5);

    if (newShakeCount === 1) {
      addAchievement('🎉 Shake Master! Keep shaking!');
    } else if (newShakeCount === 5) {
      addAchievement('💪 Earthquake Mode Activated!');
    }

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  };

  // NEW: Device tilt (gyroscope)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta && e.gamma) {
        // Beta is front-to-back tilt (-180 to 180)
        // Gamma is left-to-right tilt (-90 to 90)
        setTiltX(e.gamma / 90); // Normalize to -1 to 1
        setTiltY(e.beta / 180);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // NEW: Hold to charge mechanism
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsHolding(true);

    let progress = 0;
    holdTimerRef.current = window.setInterval(() => {
      progress += 2;
      setHoldProgress(progress);

      if (progress >= 100) {
        handleChargeComplete();
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      }
    }, 20);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleChargeComplete = () => {
    // Massive explosion effect
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const id = particleIdRef.current++;
        const emojis = ['💥', '⚡', '🌟', '✨', '💫', '🔥'];
        setParticles(prev => [
          ...prev,
          {
            id,
            x,
            y,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
          },
        ]);

        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== id));
        }, 1500);
      }, i * 10);
    }

    addAchievement('⚡ POWER UNLEASHED! ⚡');
    playSound(200, 1);

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  // Konami code detector
  useEffect(() => {
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];

    const handleKeyPress = (e: KeyboardEvent) => {
      setKonami(prev => {
        const newKonami = [...prev, e.key].slice(-10);
        if (newKonami.join(',') === konamiCode.join(',')) {
          setSecretUnlocked(true);
          playSound(800, 0.5);
          addAchievement('🎮 KONAMI CODE ACTIVATED!');
          setTimeout(() => setSecretUnlocked(false), 5000);
        }
        return newKonami;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [soundEnabled]);

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Interactive canvas background with tilt
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const orbs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      hue: number;
      trail: Array<{ x: number; y: number }>;
    }> = [];

    const hues = [230, 330, 140, 25, 280, 190]; // Blue, Pink, Green, Orange, Purple, Cyan

    for (let i = 0; i < 12; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      orbs.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 120 + 60,
        hue: hues[i % hues.length],
        trail: [],
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach(orb => {
        // Apply tilt effect
        const tiltOffsetX = tiltX * 50;
        const tiltOffsetY = tiltY * 50;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Gentle attraction to tilt position
        orb.x += (tiltOffsetX - (orb.x - orb.baseX)) * 0.02;
        orb.y += (tiltOffsetY - (orb.y - orb.baseY)) * 0.02;

        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;

        orb.trail.push({ x: orb.x, y: orb.y });
        if (orb.trail.length > 20) orb.trail.shift();

        orb.trail.forEach((pos, i) => {
          const alpha = (i / orb.trail.length) * 0.3;
          const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, orb.size * 0.5);
          gradient.addColorStop(0, `hsl(${orb.hue}, 70%, 60%, ${alpha})`);
          gradient.addColorStop(1, `hsl(${orb.hue}, 70%, 60%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, orb.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        gradient.addColorStop(0, `hsl(${orb.hue}, 70%, 60%, 0.3)`);
        gradient.addColorStop(1, `hsl(${orb.hue}, 70%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [tiltX, tiltY]);

  // Handle click particles with combo system
  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;

    // Combo system: rapid taps within 500ms
    if (timeSinceLastTap < 500) {
      setComboCount(prev => prev + 1);

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = window.setTimeout(() => {
        setComboCount(0);
      }, 500);
    } else {
      setComboCount(0);
    }

    setLastTapTime(now);

    const newClicks = clicks + 1;
    setClicks(newClicks);

    const comboMultiplier = Math.min(comboCount + 1, 5);
    playSound(400 + newClicks * 50 + comboMultiplier * 100, 0.1);

    // Achievement milestones
    if (newClicks === 1) addAchievement('🎯 First Tap!');
    if (newClicks === 10) {
      setEasterEgg(true);
      addAchievement('🎉 10 Taps Milestone!');
      setTimeout(() => setEasterEgg(false), 3000);
    }
    if (newClicks === 50) addAchievement('🔥 50 Taps! On Fire!');
    if (newClicks === 100) addAchievement('💯 Century Club!');

    if (comboCount >= 5) {
      addAchievement(`⚡ ${comboCount}x COMBO!`);
    }

    // Vibrate on mobile
    if (navigator.vibrate) {
      navigator.vibrate(comboMultiplier * 10);
    }

    const emojis = ['✨', '⭐', '💫', '🌟', '💥', '🎉', '🎊', '🔥'];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // More particles with combo
    for (let i = 0; i < comboMultiplier; i++) {
      const id = particleIdRef.current++;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;

      setParticles(prev => [
        ...prev,
        {
          id,
          x: x + offsetX,
          y: y + offsetY,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        },
      ]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 1500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const progress = Math.min((clicks / 10) * 100, 100);

  return (
    <>
      <style jsx global>{`
        html,
        body {
          overflow: hidden;
          height: 100%;
          width: 100%;
          position: fixed;
          touch-action: none;
          user-select: none;
        }
      `}</style>
      <main
        className="h-screen w-screen text-[#e8e8e8] relative overflow-hidden cursor-crosshair transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, hsl(${bgHue}, 20%, 4%), hsl(${bgHue}, 30%, 8%), hsl(${bgHue}, 20%, 4%))`,
        }}
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {/* Animated canvas background */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        {/* Grid overlay */}
        <div className="grid-overlay" style={{ opacity: 0.3 }} />

        {/* Vignette */}
        <div className="vignette" />

        {/* Mouse follower */}
        <div
          className="mouse-follower"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            borderColor: `hsl(${bgHue}, 70%, 60%)`,
            boxShadow: `0 0 20px hsl(${bgHue}, 70%, 60%, 0.3)`,
          }}
        />

        {/* Click particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="click-particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
            }}
          >
            {particle.emoji}
          </div>
        ))}

        {/* Achievement toasts */}
        <div className="achievement-container">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-toast">
              {achievement.text}
            </div>
          ))}
        </div>

        {/* Combo counter */}
        {comboCount > 0 && <div className="combo-display">{comboCount}x COMBO!</div>}

        {/* Hold to charge indicator */}
        {isHolding && (
          <div className="charge-indicator">
            <div className="charge-text">HOLD TO CHARGE</div>
            <div className="charge-bar">
              <div className="charge-fill" style={{ width: `${holdProgress}%` }} />
            </div>
            <div className="charge-percentage">{Math.floor(holdProgress)}%</div>
          </div>
        )}

        {/* Sound toggle */}
        <button
          onClick={e => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
            playSound(600, 0.1);
          }}
          className="sound-toggle"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
          <div className={`content-wrapper ${mounted ? 'mounted' : ''} max-w-5xl w-full`}>
            {/* Rotating badge */}
            <div className="flex justify-center mb-4">
              <div className="rotating-badge">
                <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={`hsl(${bgHue}, 70%, 60%)`}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="rotating-circle"
                  />
                  <text x="50" y="55" textAnchor="middle" className="badge-text" fill="#e8e8e8">
                    {secretUnlocked ? '👾' : 'SOON'}
                  </text>
                </svg>
              </div>
            </div>

            {/* Name with glitch on hover */}
            <h1 className="name-title group">
              <span className="name-main">Mehran Khan</span>
              <span className="name-glitch" aria-hidden="true">
                Mehran Khan
              </span>
              <span className="name-glitch" aria-hidden="true">
                Mehran Khan
              </span>
            </h1>

            {/* Under Construction badge */}
            <div className="construction-badge">
              <span className="construction-icon">🚧</span>
              <span className="construction-text">Under Construction</span>
              <span className="construction-icon">🚧</span>
            </div>

            {/* Rotating taglines */}
            <div className="tagline-container">
              <p className="tagline">
                {easterEgg ? (
                  <span className="easter-egg">🎉 You found the secret! Keep exploring... 🎉</span>
                ) : (
                  <span className="rotating-quote">{quotes[quote]}</span>
                )}
              </p>
            </div>

            {/* Progress bar with click counter */}
            <div className="progress-section">
              <div className="progress-label">
                <span className="text-sm sm:text-base">Development Progress</span>
                <span className="text-sm sm:text-base font-mono">{Math.floor(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, hsl(${bgHue}, 70%, 50%), hsl(${bgHue + 60}, 70%, 60%))`,
                  }}
                />
                <div className="progress-shine" />
              </div>
              <p className="progress-hint">
                {clicks < 10
                  ? `Tap to contribute • ${10 - clicks} more needed`
                  : '✅ Milestone Achieved!'}
              </p>
            </div>

            {/* Live stats grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-value font-mono">
                  {mounted ? formatTime(time) : '00:00:00'}
                </div>
                <div className="stat-label">System Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👆</div>
                <div className="stat-value">{clicks}</div>
                <div className="stat-label">Taps</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📳</div>
                <div className="stat-value">{shakeCount}</div>
                <div className="stat-label">Shakes</div>
              </div>
            </div>

            {/* Fun messages */}
            <div className="fun-messages">
              <p className="text-center text-sm sm:text-base">
                💡 Try: Shake your phone • Hold anywhere 💡
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-10">
          <div className="text-center">
            <p className="footer-text text-sm sm:text-base">
              © {new Date().getFullYear()} Mehran Khan
            </p>
          </div>
        </footer>

        <style>{`
        /* Grid overlay */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        /* Vignette */
        .vignette {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Achievement toasts */
        .achievement-container {
          position: fixed;
          top: 5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          pointer-events: none;
          max-width: 90vw;
        }

        .achievement-toast {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.9), rgba(255, 107, 157, 0.9));
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-align: center;
          animation: achievementSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          font-size: 0.9rem;
        }

        @keyframes achievementSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Combo display */
        .combo-display {
          position: fixed;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          z-index: 99;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ffd93d, #ff6b9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          pointer-events: none;
          animation: comboPulse 0.3s ease-in-out;
          text-shadow: 0 0 30px rgba(255, 217, 61, 0.5);
        }

        @keyframes comboPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Hold to charge */
        .charge-indicator {
          position: fixed;
          bottom: 8rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99;
          text-align: center;
          pointer-events: none;
          width: 90%;
          max-width: 400px;
        }

        .charge-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4a9eff;
          margin-bottom: 1rem;
          animation: chargePulse 0.5s ease-in-out infinite;
        }

        @keyframes chargePulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .charge-bar {
          width: 300px;
          max-width: 80vw;
          height: 30px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 15px;
          overflow: hidden;
          border: 2px solid #4a9eff;
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
        }

        .charge-fill {
          height: 100%;
          background: linear-gradient(90deg, #4a9eff, #ff6b9d, #ffd93d);
          border-radius: 15px;
          transition: width 0.02s linear;
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.8);
        }

        .charge-percentage {
          font-size: 2rem;
          font-weight: 700;
          color: #ffd93d;
          margin-top: 1rem;
        }

        /* Sound toggle */
        .sound-toggle {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 50;
          font-size: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .sound-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        /* Mouse follower */
        .mouse-follower {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 9999;
          opacity: 0.5;
        }

        /* Click particles */
        .click-particle {
          position: absolute;
          pointer-events: none;
          z-index: 9998;
          animation: particleFloat 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-size: 2rem;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -120px) scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }

        /* Rotating badge */
        .rotating-badge {
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(74, 158, 255, 0.3));
        }

        .rotating-circle {
          animation: rotate 20s linear infinite;
          transform-origin: center;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .badge-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        /* Content animations */
        .content-wrapper {
          opacity: 0;
          transform: translateY(30px);
        }

        .content-wrapper.mounted {
          animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Name with glitch effect on hover */
        .name-title {
          font-family: 'Times New Roman', Georgia, serif;
          font-size: clamp(2rem, 8vw, 4.5rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          text-align: center;
          margin-bottom: 1.5rem;
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .name-main {
          position: relative;
          z-index: 3;
          background: linear-gradient(180deg, #ffffff 0%, #a0a0a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
        }

        .name-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          z-index: 1;
        }

        .name-title:hover .name-glitch:nth-child(2) {
          animation: glitch1 0.3s infinite;
          color: #4a9eff;
          opacity: 0.8;
        }

        .name-title:hover .name-glitch:nth-child(3) {
          animation: glitch2 0.3s infinite;
          color: #ff6b9d;
          opacity: 0.8;
        }

        @keyframes glitch1 {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch2 {
          0% { transform: translate(0); }
          20% { transform: translate(3px, -3px); }
          40% { transform: translate(3px, 3px); }
          60% { transform: translate(-3px, -3px); }
          80% { transform: translate(-3px, 3px); }
          100% { transform: translate(0); }
        }

        /* Under Construction Badge */
        .construction-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 999px;
          backdrop-filter: blur(10px);
          animation: constructionPulse 2s ease-in-out infinite;
          max-width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }

        .construction-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: clamp(0.75rem, 2vw, 0.875rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #ffd93d, #ffb347);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .construction-icon {
          font-size: 1rem;
          animation: constructionBlink 1.5s ease-in-out infinite;
        }

        .construction-icon:last-child {
          animation-delay: 0.75s;
        }

        @keyframes constructionPulse {
          0%, 100% {
            border-color: rgba(255, 193, 7, 0.3);
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.2);
          }
          50% {
            border-color: rgba(255, 193, 7, 0.6);
            box-shadow: 0 0 30px rgba(255, 193, 7, 0.4);
          }
        }

        @keyframes constructionBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Tagline */
        .tagline-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          min-height: 2rem;
        }

        .tagline {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: clamp(0.875rem, 2.5vw, 1.125rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          text-align: center;
          color: #c0c0c0;
        }

        .rotating-quote {
          display: inline-block;
          background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 8s ease-in-out infinite, fadeIn 0.5s ease-in;
          font-weight: 500;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .easter-egg {
          color: #ffd93d;
          font-weight: 600;
          animation: bounce 0.6s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Progress section */
        .progress-section {
          max-width: 600px;
          margin: 0 auto 2rem;
          padding: 0 1rem;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: #ffffff;
          font-weight: 500;
        }

        .progress-bar {
          height: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          to { left: 200%; }
        }

        .progress-hint {
          text-align: center;
          font-size: 1rem;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 500;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 0.75rem;
          max-width: 500px;
          margin: 0 auto 1.5rem;
          padding: 0 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 0.75rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          animation: iconBob 2s ease-in-out infinite;
        }

        @keyframes iconBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .stat-card:nth-child(2) .stat-icon { animation-delay: 0.2s; }
        .stat-card:nth-child(3) .stat-icon { animation-delay: 0.4s; }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #e8e8e8;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.65rem;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }

        /* Fun messages */
        .fun-messages {
          margin-top: 1rem;
        }

        .fun-messages p {
          color: #ffffff;
        }

        /* Footer */
        .footer-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
            max-width: 300px;
          }

          .sound-toggle {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
          }

          .stat-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
      </main>
    </>
  );
}
