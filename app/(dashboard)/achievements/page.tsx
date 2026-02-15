'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock } from 'lucide-react'
import { getAchievements } from '@/lib/queries/game'
import { getAchievementDefs } from '@/lib/utils/achievements'
import { achievementIconMap } from '@/components/game/achievement-icon'
import { XPBar } from '@/components/game/xp-bar'
import { useGame } from '@/lib/contexts/game-context'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Achievement } from '@prisma/client'

export const dynamic = 'force-dynamic'

// Achievement definitions available client-side (no async check functions)
const ACHIEVEMENT_DISPLAY = getAchievementDefs().map((d) => ({
  key: d.key,
  name: d.name,
  description: d.description,
  icon: d.icon,
  xpReward: d.xpReward,
}))

export default function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { progress } = useGame()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAchievements()
        setUnlocked(data)
      } catch (error) {
        console.error('Failed to load achievements:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void loadData()
  }, [])

  const unlockedKeys = new Set(unlocked.map((a) => a.key))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading achievements...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 md:h-7 md:w-7 text-yellow-500" />
          Achievements
        </h1>
        <p className="text-muted-foreground">
          {unlocked.length} of {ACHIEVEMENT_DISPLAY.length} unlocked
        </p>
      </div>

      {/* XP Progress */}
      {progress && (
        <Card>
          <CardContent className="pt-6">
            <XPBar
              currentXP={progress.currentXP}
              xpToNextLevel={progress.xpToNextLevel}
              level={progress.level}
              title={progress.title}
            />
          </CardContent>
        </Card>
      )}

      {/* Achievement Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENT_DISPLAY.map((def) => {
          const isUnlocked = unlockedKeys.has(def.key)
          const unlockedData = unlocked.find((a) => a.key === def.key)
          const Icon = achievementIconMap[def.icon]

          return (
            <Card
              key={def.key}
              className={cn(
                'transition-all',
                isUnlocked
                  ? 'border-yellow-500/30 hover:shadow-md'
                  : 'opacity-50 grayscale'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      isUnlocked
                        ? 'bg-yellow-500/20 text-yellow-600'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isUnlocked ? (
                      Icon ? <Icon className="h-5 w-5" /> : <Trophy className="h-5 w-5" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      {isUnlocked ? def.name : '???'}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isUnlocked ? def.description : 'Keep playing to discover this achievement'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {def.xpReward > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{def.xpReward} XP
                    </Badge>
                  )}
                  {isUnlocked && unlockedData && (
                    <span className="text-[10px] text-muted-foreground">
                      Unlocked {format(new Date(unlockedData.unlockedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
