'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TURTLE_LIST, type TurtleName } from '@/lib/data/turtle-personalities'
import { useTurtle } from '@/lib/contexts/turtle-context'
import { Button } from '@/components/ui/button'

export function TurtleSelector() {
  const { showSelector, setStance, closeSelector, stance } = useTurtle()
  const [selectedPreview, setSelectedPreview] = useState<TurtleName | null>(stance)

  // Lock body scroll when the modal is open (critical for iOS Safari)
  useEffect(() => {
    if (!showSelector) return
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [showSelector])

  if (!showSelector) return null

  const featured = selectedPreview
    ? TURTLE_LIST.find((t) => t.id === selectedPreview)
    : null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ height: '100dvh' }}
      >
        {/* Scrollable container — uses dvh for iOS Safari address-bar-safe height */}
        <div
          className="h-full w-full overflow-y-auto overscroll-contain p-4 pb-8"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex min-h-full items-center justify-center">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="overflow-hidden rounded-xl border-2 border-primary/40 bg-card shadow-2xl">
                {/* Header */}
                <div className="p-4 sm:p-6 pb-2 sm:pb-3 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    CHOOSE YOUR TURTLE
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Your stance defines your style &amp; unlocks unique bonuses
                  </p>
                </div>

                {/* Turtle Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3">
                  {TURTLE_LIST.map((turtle) => {
                    const isSelected = selectedPreview === turtle.id
                    return (
                      <button
                        key={turtle.id}
                        type="button"
                        className={`relative rounded-xl border-2 p-3 sm:p-4 text-left transition-colors active:scale-[0.97] ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border bg-card/50 active:bg-muted/50'
                        }`}
                        style={
                          isSelected
                            ? { borderColor: turtle.color, boxShadow: `0 0 20px ${turtle.color}30` }
                            : undefined
                        }
                        onClick={() => setSelectedPreview(turtle.id)}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-2xl sm:text-3xl">{turtle.bandana}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs sm:text-sm">{turtle.name}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{turtle.archetype}</p>
                          </div>
                          <span className="text-base sm:text-lg">{turtle.weaponEmoji}</span>
                        </div>
                        <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
                          {turtle.personality.map((trait) => (
                            <span
                              key={trait}
                              className="text-[9px] sm:text-[10px] rounded-full px-1.5 sm:px-2 py-0.5 bg-muted text-muted-foreground"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                        {isSelected && (
                          <div
                            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs"
                            style={{ backgroundColor: turtle.color }}
                          >
                            <span className="text-white font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Featured Preview */}
                <AnimatePresence mode="wait">
                  {featured && (
                    <motion.div
                      key={featured.id}
                      className="mx-4 sm:mx-6 mb-2 sm:mb-3 rounded-lg border p-3 sm:p-4"
                      style={{ borderColor: `${featured.color}40` }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs sm:text-sm font-semibold" style={{ color: featured.color }}>
                        {featured.weaponEmoji} {featured.weapon} — {featured.roleLabel}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{featured.description}</p>
                      <p className="text-[11px] sm:text-xs italic text-muted-foreground mt-1.5 sm:mt-2">
                        &ldquo;{featured.motto}&rdquo;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions — sticky at bottom so always reachable */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-4 sm:p-6 pt-2 sm:pt-3 bg-card border-t border-border/50">
                  {stance && (
                    <Button variant="ghost" size="sm" onClick={closeSelector}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={!selectedPreview}
                    onClick={() => selectedPreview && setStance(selectedPreview)}
                    style={
                      selectedPreview
                        ? { backgroundColor: TURTLE_LIST.find((t) => t.id === selectedPreview)?.color }
                        : undefined
                    }
                    className="text-white font-bold min-h-[44px] min-w-[44px]"
                  >
                    {stance ? 'Switch Stance' : 'Select Stance'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
