'use client'

import { useTheme } from '@/lib/contexts/theme-context'

export function ThemedWelcome() {
  const { theme } = useTheme()

  const messages = {
    tmnt: {
      title: 'Cowabunga! Welcome to TaskFormer',
      subtitle: 'Your radical task and habit tracker - Turtle Power! 🐢🍕',
    },
    transformers: {
      title: 'Transform and Roll Out!',
      subtitle: 'Your powerful task and habit tracking system - More than meets the eye! ⚡🤖',
    },
  }

  const message = messages[theme]

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{message.title}</h1>
      <p className="text-muted-foreground">{message.subtitle}</p>
    </div>
  )
}
