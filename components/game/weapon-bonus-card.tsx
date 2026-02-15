'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WEAPON_BONUSES, TURTLES, type WeaponBonus } from '@/lib/data/turtle-personalities'
import { useTurtle } from '@/lib/contexts/turtle-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Swords, Lock, CheckCircle2 } from 'lucide-react'

interface BonusStatus {
  bonus: WeaponBonus
  active: boolean
  progress: string
}

/**
 * Weapon-Inspired Focus Mechanics — Shows XP bonus conditions
 * based on each turtle's weapon philosophy.
 */
export function WeaponBonusCard() {
  const { stance } = useTurtle()
  const [statuses, setStatuses] = useState<BonusStatus[]>([])

  useEffect(() => {
    async function evaluate() {
      try {
        const tasksRes = await fetch('/api/tasks', { cache: 'no-store' })
        const tasks: {
          id: string
          completed: boolean
          completedAt?: string | null
          priority?: string
          categoryId?: string | null
          turtleRole?: string | null
        }[] = tasksRes.ok ? await tasksRes.json() : []

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Tasks completed today
        const completedToday = tasks.filter(
          (t) => t.completed && t.completedAt && new Date(t.completedAt) >= today
        )

        // Evaluate each weapon bonus
        const results: BonusStatus[] = WEAPON_BONUSES.map((bonus) => {
          let active = false
          let progress = ''

          switch (bonus.condition) {
            case 'priority_order_3': {
              // Leo: Complete 3 tasks in priority order
              const priorities = ['URGENT', 'HIGH', 'MEDIUM', 'LOW']
              let inOrder = 0
              let lastPriIdx = -1
              for (const task of completedToday) {
                const idx = priorities.indexOf(task.priority ?? 'MEDIUM')
                if (idx >= lastPriIdx) {
                  inOrder++
                  lastPriIdx = idx
                }
              }
              active = inOrder >= 3
              progress = `${Math.min(inOrder, 3)}/3 in order`
              break
            }
            case 'multi_category_3': {
              // Donnie: Tasks across 3+ categories
              const cats = new Set(completedToday.map((t) => t.categoryId).filter(Boolean))
              active = cats.size >= 3
              progress = `${cats.size}/3 categories`
              break
            }
            case 'hardest_first': {
              // Raph: Highest priority task first
              if (completedToday.length > 0) {
                const first = completedToday[0]
                active = first.priority === 'URGENT' || first.priority === 'HIGH'
                progress = active ? 'Hard task first!' : 'First task wasn\'t high priority'
              } else {
                progress = 'No tasks yet today'
              }
              break
            }
            case 'chain_4': {
              // Mikey: 4+ tasks in a single session
              active = completedToday.length >= 4
              progress = `${Math.min(completedToday.length, 4)}/4 chain`
              break
            }
            default:
              progress = 'Unknown condition'
          }

          return { bonus, active, progress }
        })

        setStatuses(results)
      } catch {
        setStatuses(WEAPON_BONUSES.map((bonus) => ({
          bonus,
          active: false,
          progress: 'Unable to check',
        })))
      }
    }

    void evaluate()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Weapon Bonuses</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Complete these conditions to earn bonus XP from each turtle&apos;s weapon style.
        </p>
        <div className="space-y-2.5">
          {statuses.map(({ bonus, active, progress }, i) => {
            const turtle = TURTLES[bonus.turtle]
            const isStance = stance === bonus.turtle
            return (
              <motion.div
                key={bonus.name}
                className={`flex items-start gap-3 rounded-lg border p-2.5 transition-all ${
                  active
                    ? 'border-green-500/30 bg-green-500/5'
                    : isStance
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-base flex-shrink-0 mt-0.5">{turtle.weaponEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{bonus.name}</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1.5"
                      style={active ? { borderColor: '#22c55e', color: '#22c55e' } : undefined}
                    >
                      +{bonus.bonusPercent}%
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{bonus.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px]">
                    {active ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className={active ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {progress}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
