'use client'

import { TURTLES, ROLE_TO_TURTLE, type TurtleRole } from '@/lib/data/turtle-personalities'

interface TurtleRoleBadgeProps {
  role: TurtleRole | string | null | undefined
  compact?: boolean
}

/**
 * Displays a small colored badge showing the TMNT role
 * assigned to a task. Matches the turtle's color.
 */
export function TurtleRoleBadge({ role, compact = false }: TurtleRoleBadgeProps) {
  if (!role || !(role in ROLE_TO_TURTLE)) return null

  const turtleName = ROLE_TO_TURTLE[role as TurtleRole]
  const turtle = TURTLES[turtleName]

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-[10px] font-medium"
        style={{ color: turtle.color }}
        title={`${turtle.name} — ${turtle.roleLabel}`}
      >
        {turtle.bandana}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
      style={{
        borderColor: `${turtle.color}40`,
        backgroundColor: `${turtle.color}10`,
        color: turtle.color,
      }}
      title={`${turtle.name} — ${turtle.roleLabel}`}
    >
      {turtle.bandana} {turtle.roleLabel}
    </span>
  )
}
