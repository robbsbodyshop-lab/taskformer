'use client'

import { useTheme } from '@/lib/contexts/theme-context'

export function ThemedWelcome() {
  const { theme } = useTheme()

  const messages = {
    tmnt: {
      title: 'Cowabunga! Press Start',
      subtitle: 'Arcade mode active: stack XP, build streaks, and shell-shock your goals.',
    },
    transformers: {
      title: 'Transform and Roll Out!',
      subtitle: 'Your powerful task and habit tracking system - More than meets the eye! ⚡🤖',
    },
  }

  const message = messages[theme]

  return (
    <div className={theme === 'tmnt' ? 'rounded-xl border border-primary/40 bg-card/70 px-4 py-3 shadow-[0_0_28px_rgba(46,230,107,0.16)]' : ''}>
      <h1 className="text-3xl font-bold tracking-tight">{message.title}</h1>
      <p className="text-muted-foreground">{message.subtitle}</p>
    </div>
  )
}
