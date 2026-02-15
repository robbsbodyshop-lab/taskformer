'use client'

import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTurtle } from '@/lib/contexts/turtle-context'

interface LevelUpModalProps {
  level: number
  title: string
  onDismiss: () => void
}

// Precomputed random-ish offsets per slot (deterministic, no Math.random)
const PARTICLE_OFFSETS = [0.3, 0.7, 0.1, 0.9, 0.5, 0.2, 0.8, 0.4, 0.6, 0.15, 0.85, 0.55]

function Particle({ index }: { index: number }) {
  const style = useMemo(() => {
    const angle = (index / 12) * Math.PI * 2
    const distance = 80 + PARTICLE_OFFSETS[index % PARTICLE_OFFSETS.length] * 60
    return {
      '--tx': `${Math.cos(angle) * distance}px`,
      '--ty': `${Math.sin(angle) * distance}px`,
    } as React.CSSProperties
  }, [index])

  const colors = ['bg-yellow-400', 'bg-primary', 'bg-chart-1', 'bg-chart-2', 'bg-green-400']

  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${colors[index % colors.length]}`}
      style={style}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: 0,
        x: `var(--tx)`,
        y: `var(--ty)`,
        scale: 0,
      }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
    />
  )
}

export function LevelUpModal({ level, title, onDismiss }: LevelUpModalProps) {
  const { getDialogue, stanceProfile } = useTurtle()

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const levelUpMessage = getDialogue('levelUp')

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div
          className="relative flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-2xl border"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Particles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <Particle key={i} index={i} />
            ))}
          </div>

          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            🎉
          </motion.div>

          <div className="text-center">
            <motion.p
              className="text-sm text-muted-foreground uppercase tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Level Up!
            </motion.p>
            <motion.p
              className="text-4xl font-black mt-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              Level {level}
            </motion.p>
            <motion.p
              className="text-lg font-semibold text-primary mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {title}
            </motion.p>
          </div>

          {/* Turtle-voiced message */}
          {levelUpMessage && (
            <motion.p
              className="text-xs text-muted-foreground text-center max-w-[200px] italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {stanceProfile?.bandana} &ldquo;{levelUpMessage}&rdquo;
            </motion.p>
          )}

          <motion.button
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onDismiss}
          >
            Tap to continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
