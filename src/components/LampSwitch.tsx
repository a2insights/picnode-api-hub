'use client';

import * as motion from 'motion/react-client';
import { useMotionValue, useTransform, useSpring } from 'motion/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Moon, Sun, Sparkles } from 'lucide-react';

type Theme = 'light' | 'dark' | 'crystal';

export function LampSwitch() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Physics
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 15 });
  const lineLength = useTransform(springY, (val) => val + 64);

  // Sync theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) updateTheme(saved);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'crystal');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 50) {
      playClickSound();
      cycleTheme();
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'crystal'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];

    updateTheme(next);

    const messages = {
      light: { text: 'Let there be light! ☀️', icon: Sun },
      dark: { text: 'Welcome to the dark side 🌙', icon: Moon },
      crystal: { text: 'Shiny and chrome! ✨', icon: Sparkles },
    };

    const Config = messages[next];
    toast(Config.text, { icon: <Config.icon className="w-4 h-4" /> });
  };

  return (
    <div className="absolute top-full left-4 z-50 flex flex-col items-center w-[40px] h-[300px]">
      {/* SVG Cord */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
        <motion.line
          x1="50%"
          y1="0"
          x2="50%"
          y2={lineLength}
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground/50"
        />
      </svg>

      {/* Handle */}
      <motion.div
        style={{ y: springY }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.2 }}
        whileDrag={{ cursor: 'grabbing' }}
        className="relative z-10 mt-16 flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing bg-background border-2 border-primary"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {theme === 'light' && <Sun className="w-4 h-4 text-orange-500" />}
          {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
          {theme === 'crystal' && <Sparkles className="w-4 h-4 text-purple-500" />}
        </div>
      </motion.div>
    </div>
  );
}

// Simplified Sound Utility
function playClickSound() {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}
