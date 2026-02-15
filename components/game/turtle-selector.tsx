'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TURTLE_LIST, type TurtleName } from '@/lib/data/turtle-personalities'
import { useTurtle } from '@/lib/contexts/turtle-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function TurtleSelector() {
  const { showSelector, setStance, closeSelector, stance } = useTurtle()
  const [hoveredTurtle, setHoveredTurtle] = useState<TurtleName | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<TurtleName | null>(stance)

  if (!showSelector) return null

  const featured = selectedPreview
    ? TURTLE_LIST.find((t) => t.id === selectedPreview)
    : null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <Card className="overflow-hidden border-2 border-primary/40 bg-card">
            {/* Header */}
            <div className="p-6 pb-3 text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                CHOOSE YOUR TURTLE
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your stance defines your productivity style and unlocks unique bonuses
              </p>
            </div>

            {/* Turtle Grid */}
            <div className="grid grid-cols-2 gap-3 p-6 pt-3">
              {TURTLE_LIST.map((turtle) => {
                const isSelected = selectedPreview === turtle.id
                const isHovered = hoveredTurtle === turtle.id
                return (
                  <motion.button
                    key={turtle.id}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50 bg-card/50'
                    }`}
                    style={
                      isSelected || isHovered
                        ? { borderColor: turtle.color, boxShadow: `0 0 20px ${turtle.color}30` }
                        : undefined
                    }
                    onClick={() => setSelectedPreview(turtle.id)}
                    onMouseEnter={() => setHoveredTurtle(turtle.id)}
                    onMouseLeave={() => setHoveredTurtle(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{turtle.bandana}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{turtle.name}</p>
                        <p className="text-xs text-muted-foreground">{turtle.archetype}</p>
                      </div>
                      <span className="text-lg">{turtle.weaponEmoji}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {turtle.personality.map((trait) => (
                        <span
                          key={trait}
                          className="text-[10px] rounded-full px-2 py-0.5 bg-muted text-muted-foreground"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    {isSelected && (
                      <motion.div
                        className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs"
                        style={{ backgroundColor: turtle.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-white font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Featured Preview */}
            <AnimatePresence mode="wait">
              {featured && (
                <motion.div
                  key={featured.id}
                  className="mx-6 mb-3 rounded-lg border p-4"
                  style={{ borderColor: `${featured.color}40` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-semibold" style={{ color: featured.color }}>
                    {featured.weaponEmoji} {featured.weapon} — {featured.roleLabel}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{featured.description}</p>
                  <p className="text-xs italic text-muted-foreground mt-2">
                    &ldquo;{featured.motto}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 pt-3">
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
                className="text-white font-bold"
              >
                {stance ? 'Switch Stance' : 'Select Stance'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
