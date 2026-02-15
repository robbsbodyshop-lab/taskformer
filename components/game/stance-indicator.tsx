'use client'

import { useTurtle } from '@/lib/contexts/turtle-context'
import { Button } from '@/components/ui/button'

/**
 * Small clickable stance indicator for the header.
 * Shows the current turtle's bandana emoji and name.
 * Clicking opens the turtle selector.
 */
export function StanceIndicator() {
  const { stanceProfile, openSelector } = useTurtle()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs gap-1.5"
      onClick={openSelector}
      title={
        stanceProfile
          ? `${stanceProfile.name} stance — ${stanceProfile.roleLabel}`
          : 'Pick your turtle'
      }
    >
      <span className="text-sm">
        {stanceProfile?.bandana ?? '🐢'}
      </span>
      <span className="hidden sm:inline text-muted-foreground">
        {stanceProfile ? stanceProfile.name : 'Pick Turtle'}
      </span>
    </Button>
  )
}
