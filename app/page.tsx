'use client';
import { useEffect, useState } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface LeaderboardEntry {
  name: string;
  moves: number;
  time: number;
  date: string;
}

export default function MemoryGame() {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'difficulty' | 'playing' | 'won'>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [time, setTime] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [pendingScore, setPendingScore] = useState<{ moves: number; time: number } | null>(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const emojis = {
    easy: ['🚧', '🏗️', '👷', '🔨', '⚒️', '🧱'],
    medium: ['🚧', '🏗️', '👷', '🔨', '⚒️', '🧱', '🪜', '⛏️'],
    hard: ['🚧', '🏗️', '👷', '🔨', '⚒️', '🧱', '🪜', '⛏️', '🔩', '🪛', '🏭', '🏢'],
  };

  const totalPairs = {
    easy: 6,
    medium: 8,
    hard: 12,
  };

  useEffect(() => {
    setMounted(true);
    loadLeaderboard();
    loadBestScore();
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Safe leaderboard loader
  const loadLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error('Leaderboard response is not an array:', data);
        setLeaderboard([]);
        return;
      }

      // Data is already parsed objects from the API
      const validated: LeaderboardEntry[] = data.filter((entry): entry is LeaderboardEntry => {
        // Validate that each entry has the required fields
        return (
          entry &&
          typeof entry === 'object' &&
          typeof entry.name === 'string' &&
          typeof entry.moves === 'number' &&
          typeof entry.time === 'number' &&
          typeof entry.date === 'string'
        );
      });

      setLeaderboard(validated);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
    }
  };

  const loadBestScore = () => {
    const best = localStorage.getItem('memoryBestScore');
    if (best) setBestScore(parseInt(best));
  };

  const saveScore = async (finalMoves: number, finalTime: number) => {
    setPendingScore({ moves: finalMoves, time: finalTime });
    setShowNameModal(true);
  };

  const submitScore = async () => {
    if (!playerName.trim() || !pendingScore) return;

    const entry: LeaderboardEntry = {
      name: playerName.trim().slice(0, 20),
      moves: pendingScore.moves,
      time: pendingScore.time,
      date: new Date().toISOString(),
    };

    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      await loadLeaderboard();
    } catch (error) {
      console.error('Failed to save score:', error);
      alert('Failed to save to leaderboard.');
    }

    if (!bestScore || pendingScore.moves < bestScore) {
      setBestScore(pendingScore.moves);
      localStorage.setItem('memoryBestScore', pendingScore.moves.toString());
    }

    setShowNameModal(false);
    setPlayerName('');
    setPendingScore(null);
  };

  const skipSave = () => {
    setShowNameModal(false);
    setPlayerName('');
    setPendingScore(null);
  };

  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    } catch (e) {}
  };

  const initializeGame = (diff: 'easy' | 'medium' | 'hard') => {
    const selectedEmojis = emojis[diff];
    const gameCards: Card[] = [];

    selectedEmojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setTime(0);
    setGameState('playing');
    setDifficulty(diff);
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    if (flippedCards.includes(cardId)) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    playSound(400, 0.1);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards(prev => prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c)));

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        playSound(800, 0.3);
        if (navigator.vibrate) navigator.vibrate(50);

        // FASTER: Reduced from 600ms to 400ms
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);

          if (matchedPairs + 1 === totalPairs[difficulty]) {
            setTimeout(() => saveScore(moves + 1, time), 500);
            setGameState('won');
          }
        }, 400);
      } else {
        playSound(200, 0.2);
        // FASTER: Reduced from 1000ms to 700ms
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 700);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gridCols = {
    easy: 'grid-cols-3',
    medium: 'grid-cols-4',
    hard: 'grid-cols-4',
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Fixed header - MORE PROMINENT */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 border-b-4 border-yellow-600 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 relative">
            <div className="flex items-center gap-2 animate-pulse">
              <span className="text-3xl">🚧</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-black drop-shadow-lg">
                UNDER CONSTRUCTION
              </h1>
              <span className="text-3xl">🚧</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="absolute right-0 bg-black/40 hover:bg-black/60 p-2 rounded-lg transition-colors"
              aria-label="Toggle sound"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* Brick wall background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        {Array.from({ length: 15 }).map((_, row) => (
          <div
            key={row}
            className="flex gap-1"
            style={{ marginLeft: row % 2 === 0 ? '0' : '60px' }}
          >
            {Array.from({ length: 25 }).map((_, col) => (
              <div
                key={col}
                className="w-20 h-10 bg-orange-800 border border-orange-900"
                style={{ marginBottom: '2px' }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl border-4 border-yellow-500 p-6 md:p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-3xl md:text-4xl font-bold">Memory Match</h2>
                <p className="text-lg text-slate-300">
                  Test your memory while we build something amazing!
                </p>

                {bestScore && (
                  <p className="text-xl text-yellow-400 font-bold">Your Best: {bestScore} moves</p>
                )}

                <button
                  onClick={() => setShowDifficultyModal(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-2xl"
                >
                  ▶ PLAY NOW
                </button>
              </div>
            </div>

            {/* COMPACT Leaderboard */}
            <div className="mt-6 bg-slate-800/80 backdrop-blur-lg rounded-2xl border-4 border-yellow-500 p-4 md:p-6 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">
                🏆 TOP 10 CHAMPIONS
              </h3>
              {leaderboard.length === 0 ? (
                <div className="text-center text-slate-400 py-6">
                  <p className="text-3xl mb-2">👀</p>
                  <p className="text-sm">No scores yet! Be the first!</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500'
                          : index === 1
                            ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400'
                            : index === 2
                              ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-600'
                              : 'bg-slate-700/50'
                      }`}
                    >
                      <div className="text-lg min-w-[1.75rem] text-center">
                        {index === 0
                          ? '🥇'
                          : index === 1
                            ? '🥈'
                            : index === 2
                              ? '🥉'
                              : `#${index + 1}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{entry.name}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{entry.moves}</div>
                        <div className="text-xs text-slate-400">{formatTime(entry.time)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">{moves}</div>
                <div className="text-xs md:text-sm text-slate-400">MOVES</div>
              </div>
              <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">{formatTime(time)}</div>
                <div className="text-xs md:text-sm text-slate-400">TIME</div>
              </div>
              <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {matchedPairs}/{totalPairs[difficulty]}
                </div>
                <div className="text-xs md:text-sm text-slate-400">PAIRS</div>
              </div>
            </div>

            {/* Game Board */}
            <div className="max-w-2xl mx-auto">
              <div className={`grid ${gridCols[difficulty]} gap-2 md:gap-3`}>
                {cards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isMatched || isChecking}
                    className={`aspect-square rounded-xl text-5xl md:text-6xl flex items-center justify-center transition-all transform ${
                      card.isFlipped || card.isMatched
                        ? 'bg-slate-800 scale-100'
                        : 'bg-slate-700 hover:bg-slate-600 active:scale-95'
                    } ${card.isMatched ? 'opacity-50 scale-95' : ''} shadow-lg border-2 ${
                      card.isMatched ? 'border-green-500' : 'border-slate-600'
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('menu')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                ← BACK TO MENU
              </button>
            </div>
          </div>
        )}

        {/* Won State */}
        {gameState === 'won' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border-4 border-yellow-500 p-8 shadow-2xl text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold">You Won!</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400">{moves}</div>
                  <div className="text-sm text-slate-400">MOVES</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400">{formatTime(time)}</div>
                  <div className="text-sm text-slate-400">TIME</div>
                </div>
              </div>

              {bestScore && moves <= bestScore && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl text-black">
                  <p className="text-xl font-bold">🏆 NEW PERSONAL BEST! 🏆</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => initializeGame(difficulty)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  PLAY AGAIN
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  BACK TO MENU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - BETTER COLORS */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 py-3 text-center text-sm">
        <span className="text-slate-400">© {new Date().getFullYear()}</span>{' '}
        <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Mehran Khan
        </span>
      </footer>

      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border-4 border-yellow-500 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-6">Choose Difficulty</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowDifficultyModal(false);
                  initializeGame('easy');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <div className="text-3xl mb-1">😊</div>
                <div className="text-xl">EASY</div>
                <div className="text-sm opacity-80">6 pairs - Perfect for beginners</div>
              </button>
              <button
                onClick={() => {
                  setShowDifficultyModal(false);
                  initializeGame('medium');
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <div className="text-3xl mb-1">🤔</div>
                <div className="text-xl">MEDIUM</div>
                <div className="text-sm opacity-80">8 pairs - Good challenge</div>
              </button>
              <button
                onClick={() => {
                  setShowDifficultyModal(false);
                  initializeGame('hard');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-xl">HARD</div>
                <div className="text-sm opacity-80">12 pairs - Expert mode</div>
              </button>
            </div>
            <button
              onClick={() => setShowDifficultyModal(false)}
              className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border-4 border-yellow-500 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-4">🎉 Great Job!</h3>
            <p className="text-center text-slate-300 mb-6">Enter your name for the leaderboard:</p>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitScore()}
              placeholder="Your name..."
              maxLength={20}
              autoFocus
              className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-yellow-500 focus:outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={skipSave}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Skip
              </button>
              <button
                onClick={submitScore}
                disabled={!playerName.trim()}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
