'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { getGameProgress, type GameProgressData } from '@/lib/queries/game'
import type { UnlockedAchievement } from '@/lib/utils/achievements'
import type { AwardResult } from '@/lib/utils/xp'
import { XPPopup } from '@/components/game/xp-popup'
import { LevelUpModal } from '@/components/game/level-up-modal'
import { AchievementToast } from '@/components/game/achievement-toast'

interface GameContextType {
  progress: GameProgressData | null
  refreshGameState: () => Promise<void>
  handleGameReward: (xp?: AwardResult, achievements?: UnlockedAchievement[]) => void
}

const GameContext = createContext<GameContextType>({
  progress: null,
  refreshGameState: async () => {},
  handleGameReward: () => {},
})

interface XPPopupState {
  id: number
  amount: number
}

interface LevelUpState {
  level: number
  title: string
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<GameProgressData | null>(null)
  const [xpPopups, setXPPopups] = useState<XPPopupState[]>([])
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null)
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([])

  const refreshGameState = useCallback(async () => {
    try {
      const data = await getGameProgress()
      setProgress(data)
    } catch (err) {
      console.error('Failed to load game progress:', err)
    }
  }, [])

  // Load on mount
  useEffect(() => {
    let cancelled = false
    getGameProgress().then((data) => {
      if (!cancelled) setProgress(data)
    }).catch((err) => {
      console.error('Failed to load game progress:', err)
    })
    return () => { cancelled = true }
  }, [])

  const handleGameReward = useCallback(
    (xp?: AwardResult, newAchievements?: UnlockedAchievement[]) => {
      if (xp) {
        // Show XP popup
        setXPPopups((prev) => [
          ...prev,
          { id: Date.now(), amount: xp.xpGained },
        ])

        // Update local progress immediately
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                level: xp.level,
                currentXP: xp.currentXP,
                totalXP: xp.totalXP,
                title: xp.title,
              }
            : prev
        )

        // Show level-up if it happened
        if (xp.levelUp) {
          setLevelUp({ level: xp.level, title: xp.title })
        }
      }

      if (newAchievements && newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements])
      }
    },
    []
  )

  const dismissXPPopup = useCallback((id: number) => {
    setXPPopups((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const dismissLevelUp = useCallback(() => {
    setLevelUp(null)
  }, [])

  const dismissAchievement = useCallback(() => {
    setAchievements((prev) => prev.slice(1))
  }, [])

  return (
    <GameContext.Provider value={{ progress, refreshGameState, handleGameReward }}>
      {children}

      {/* XP popups */}
      {xpPopups.map((popup) => (
        <XPPopup
          key={popup.id}
          amount={popup.amount}
          onDone={() => dismissXPPopup(popup.id)}
        />
      ))}

      {/* Level-up modal */}
      {levelUp && (
        <LevelUpModal
          level={levelUp.level}
          title={levelUp.title}
          onDismiss={dismissLevelUp}
        />
      )}

      {/* Achievement toasts - show one at a time */}
      {achievements.length > 0 && (
        <AchievementToast
          achievement={achievements[0]}
          onDismiss={dismissAchievement}
        />
      )}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
