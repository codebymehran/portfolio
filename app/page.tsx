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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [quote, setQuote] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Interactive canvas background
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

    // Floating orbs with trails
    const orbs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      trail: Array<{ x: number; y: number }>;
    }> = [];

    for (let i = 0; i < 12; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 120 + 60,
        color: ['#4a9eff', '#ff6b9d', '#ffd93d', '#6bcf7f', '#a78bfa', '#fb923c'][
          Math.floor(Math.random() * 6)
        ],
        trail: [],
      });
    }

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw orbs with trails
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;

        // Draw trail
        orb.trail.push({ x: orb.x, y: orb.y });
        if (orb.trail.length > 20) orb.trail.shift();

        orb.trail.forEach((pos, i) => {
          const alpha = (i / orb.trail.length) * 0.3;
          const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, orb.size * 0.5);
          gradient.addColorStop(
            0,
            orb.color +
              Math.floor(alpha * 255)
                .toString(16)
                .padStart(2, '0')
          );
          gradient.addColorStop(1, orb.color + '00');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, orb.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw main orb
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        gradient.addColorStop(0, orb.color + '50');
        gradient.addColorStop(1, orb.color + '00');

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
  }, []);

  // Handle click particles
  const handleClick = (e: React.MouseEvent) => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    playSound(400 + newClicks * 50, 0.1);

    // Easter egg after 10 clicks
    if (newClicks === 10) {
      setEasterEgg(true);
      playSound(800, 0.5);
      setTimeout(() => setEasterEgg(false), 3000);
    }

    // Create particle with random emoji
    const emojis = ['✨', '⭐', '💫', '🌟', '💥', '🎉', '🎊', '🔥'];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = particleIdRef.current++;

    setParticles(prev => [
      ...prev,
      { id, x, y, emoji: emojis[Math.floor(Math.random() * emojis.length)] },
    ]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1500);
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
    <main
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1e] to-[#0a0a0a] text-[#e8e8e8] relative overflow-hidden cursor-crosshair"
      onClick={handleClick}
    >
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Mouse follower */}
      <div
        className="mouse-follower"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
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

      {/* Secret unlock notification */}
      {secretUnlocked && <div className="secret-notification">🎮 KONAMI CODE ACTIVATED! 🎮</div>}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        <div className={`content-wrapper ${mounted ? 'mounted' : ''} max-w-5xl w-full`}>
          {/* Rotating badge */}
          <div className="flex justify-center mb-8">
            <div className="rotating-badge">
              <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="rotating-circle"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a9eff" />
                    <stop offset="50%" stopColor="#ff6b9d" />
                    <stop offset="100%" stopColor="#ffd93d" />
                  </linearGradient>
                </defs>
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
                <>
                  <span className="rotating-quote">{quotes[quote]}</span>
                </>
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
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-shine" />
            </div>
            <p className="progress-hint">
              {clicks < 10
                ? `Click to contribute • ${10 - clicks} more clicks needed`
                : '✅ Milestone Achieved!'}
            </p>
          </div>

          {/* Live stats grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-value font-mono">{mounted ? formatTime(time) : '00:00:00'}</div>
              <div className="stat-label">System Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👆</div>
              <div className="stat-value">{clicks}</div>
              <div className="stat-label">Interactions</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-value">2026</div>
              <div className="stat-label">Launch Year</div>
            </div>
          </div>

          {/* Fun messages */}
          <div className="fun-messages"></div>
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

      <style jsx>{`
        /* Grid overlay */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(74, 158, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 158, 255, 0.03) 1px, transparent 1px);
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

        /* Secret notification */
        .secret-notification {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          background: linear-gradient(135deg, #4a9eff, #ff6b9d);
          color: white;
          padding: 2rem 3rem;
          border-radius: 1rem;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          animation: secretAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 60px rgba(74, 158, 255, 0.4);
        }

        @keyframes secretAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* Mouse follower */
        .mouse-follower {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid #4a9eff;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 9999;
          opacity: 0.5;
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
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
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
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
          font-size: clamp(2.5rem, 10vw, 6rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          text-align: center;
          margin-bottom: 2rem;
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
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitch2 {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(3px, -3px);
          }
          40% {
            transform: translate(3px, 3px);
          }
          60% {
            transform: translate(-3px, -3px);
          }
          80% {
            transform: translate(-3px, 3px);
          }
          100% {
            transform: translate(0);
          }
        }

        /* Under Construction Badge */
        .construction-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
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
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #ffd93d, #ffb347);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .construction-icon {
          font-size: 1.25rem;
          animation: constructionBlink 1.5s ease-in-out infinite;
        }

        .construction-icon:last-child {
          animation-delay: 0.75s;
        }

        @keyframes constructionPulse {
          0%,
          100% {
            border-color: rgba(255, 193, 7, 0.3);
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.2);
          }
          50% {
            border-color: rgba(255, 193, 7, 0.6);
            box-shadow: 0 0 30px rgba(255, 193, 7, 0.4);
          }
        }

        @keyframes constructionBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Tagline */
        .tagline-container {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          min-height: 3rem;
        }

        .tagline {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: clamp(1rem, 3vw, 1.5rem);
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
          animation:
            gradientShift 8s ease-in-out infinite,
            fadeIn 0.5s ease-in;
          font-weight: 500;
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .easter-egg {
          color: #ffd93d;
          font-weight: 600;
          animation: bounce 0.6s ease-in-out infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Progress section */
        .progress-section {
          max-width: 600px;
          margin: 0 auto 3rem;
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
          background: linear-gradient(90deg, #4a9eff, #ff6b9d, #ffd93d);
          border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
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
          to {
            left: 200%;
          }
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
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          max-width: 700px;
          margin: 0 auto 2.5rem;
          padding: 0 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          animation: iconBob 2s ease-in-out infinite;
        }

        @keyframes iconBob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .stat-card:nth-child(2) .stat-icon {
          animation-delay: 0.2s;
        }
        .stat-card:nth-child(3) .stat-icon {
          animation-delay: 0.4s;
        }
        .stat-card:nth-child(4) .stat-icon {
          animation-delay: 0.6s;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 600;
          color: #e8e8e8;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #b0b0b0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }

        /* Fun messages */
        .fun-messages {
          margin-top: 2rem;
        }

        .fun-messages p {
          color: #ffffff;
        }

        .tip-text {
          color: #4a9eff;
          font-weight: 600;
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
        }
      `}</style>
    </main>
  );
}
