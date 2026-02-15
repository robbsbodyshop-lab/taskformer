'use client'

import { useMemo } from 'react'
import { useTheme } from '@/lib/contexts/theme-context'
import { useTurtle } from '@/lib/contexts/turtle-context'

export function ThemedWelcome() {
  const { theme } = useTheme()
  const { stanceProfile, dialogues } = useTurtle()

  // Pick a stable greeting from the dialogue set
  const greeting = useMemo(() => {
    if (!dialogues?.greeting?.length) return null
    // Use a deterministic pick based on array length to avoid impure Math.random in render
    return dialogues.greeting[0]
  }, [dialogues])

  const messages = {
    tmnt: {
      title: stanceProfile
        ? `${stanceProfile.bandana} ${greeting ?? 'Cowabunga! Press Start'}`
        : 'Cowabunga! Press Start',
      subtitle: stanceProfile
        ? `${stanceProfile.name} stance active — ${stanceProfile.focusStyle}`
        : 'Arcade mode active: stack XP, build streaks, and shell-shock your goals.',
    },
    transformers: {
      title: 'Transform and Roll Out!',
      subtitle: 'Your powerful task and habit tracking system - More than meets the eye!',
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
