'use client'

import { useGame } from '@/lib/contexts/game-context'
import { cn } from '@/lib/utils'

const tierColors: Record<string, string> = {
  Novice: 'bg-muted text-muted-foreground border-muted-foreground/30',
  Apprentice: 'bg-green-500/15 text-green-600 border-green-500/40',
  Warrior: 'bg-blue-500/15 text-blue-600 border-blue-500/40',
  Champion: 'bg-purple-500/15 text-purple-600 border-purple-500/40',
  Legend: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/40',
}

export function LevelBadge() {
  const { progress } = useGame()

  if (!progress) return null

  const colorClass = tierColors[progress.title] ?? tierColors.Novice

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold',
        colorClass
      )}
      title={`${progress.title} - Level ${progress.level}`}
    >
      <span className="text-[10px]">Lv</span>
      <span>{progress.level}</span>
    </div>
  )
}
