'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TURTLE_LIST, type TurtleRole } from '@/lib/data/turtle-personalities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTurtle } from '@/lib/contexts/turtle-context'

interface RoleCount {
  role: TurtleRole
  count: number
}

/**
 * Brotherhood Team Meter — Shows the balance of task roles across
 * all 4 turtle archetypes. Fetches role distribution from the API.
 */
export function BrotherhoodMeter() {
  const { stance } = useTurtle()
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tasks?includeRoles=1', { cache: 'no-store' })
        if (!res.ok) return
        const tasks: { turtleRole?: string | null; completed?: boolean }[] = await res.json()

        const counts: Record<TurtleRole, number> = {
          LEADERSHIP: 0,
          RESEARCH: 0,
          EXECUTION: 0,
          CREATIVE: 0,
        }
        let t = 0
        for (const task of tasks) {
          if (task.turtleRole && task.turtleRole in counts) {
            counts[task.turtleRole as TurtleRole]++
            t++
          }
        }
        setTotal(t)
        setRoleCounts([
          { role: 'LEADERSHIP', count: counts.LEADERSHIP },
          { role: 'RESEARCH', count: counts.RESEARCH },
          { role: 'EXECUTION', count: counts.EXECUTION },
          { role: 'CREATIVE', count: counts.CREATIVE },
        ])
      } catch {
        // silently fail
      }
    }
    void load()
  }, [])

  // Map role → turtle data
  const roleToTurtle: Record<TurtleRole, typeof TURTLE_LIST[number]> = {
    LEADERSHIP: TURTLE_LIST[0], // Leo
    RESEARCH: TURTLE_LIST[1],   // Donnie
    EXECUTION: TURTLE_LIST[2],  // Raph
    CREATIVE: TURTLE_LIST[3],   // Mikey
  }

  const maxCount = Math.max(...roleCounts.map((r) => r.count), 1)

  // Determine balance status
  const isBalanced =
    total >= 4 &&
    roleCounts.every((r) => r.count >= Math.floor(total / 8))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐢</span>
            <CardTitle className="text-sm font-medium">Brotherhood Balance</CardTitle>
          </div>
          {isBalanced && (
            <span className="text-[10px] font-semibold text-green-600 bg-green-500/10 rounded-full px-2 py-0.5">
              Balanced!
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-xs text-muted-foreground">
            Tag tasks with turtle roles to see your team balance.
          </p>
        ) : (
          <div className="space-y-3">
            {roleCounts.map(({ role, count }) => {
              const turtle = roleToTurtle[role]
              const percent = total > 0 ? (count / maxCount) * 100 : 0
              const isStance = stance && turtle.id === stance
              return (
                <div key={role} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isStance ? 'text-primary' : ''}`}>
                      {turtle.bandana} {turtle.name}
                    </span>
                    <span className="text-muted-foreground">
                      {count} {count === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: turtle.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
