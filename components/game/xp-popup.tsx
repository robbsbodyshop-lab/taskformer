'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPPopupProps {
  amount: number
  onDone: () => void
}

export function XPPopup({ amount, onDone }: XPPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-20 right-4 z-[100] pointer-events-none"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground text-sm shadow-lg"
          animate={{ y: -50, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        >
          +{amount} XP
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
