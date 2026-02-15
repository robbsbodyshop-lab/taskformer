'use client'

import { useTheme } from '../contexts/theme-context'

export function useThemedColors() {
  const { theme } = useTheme()

  const tmntColors = [
    '#00A651', // Turtle green
    '#FF6B35', // Orange (Mikey)
    '#4169E1', // Blue (Leo)
    '#9370DB', // Purple (Don)
    '#DC143C', // Red (Raph)
    '#FFD700', // Gold/Yellow
    '#228B22', // Forest green
    '#FF8C00', // Dark orange
    '#1E90FF', // Dodger blue
    '#BA55D3', // Medium orchid
  ]

  const transformersColors = [
    '#0057A8', // Autobot blue
    '#FF0000', // Decepticon red
    '#9370DB', // Energon purple
    '#808080', // Metallic gray
    '#00BFFF', // Deep sky blue
    '#DC143C', // Crimson red
    '#4B0082', // Indigo
    '#C0C0C0', // Silver
    '#1C1C1C', // Almost black
    '#FFD700', // Gold
  ]

  return theme === 'tmnt' ? tmntColors : transformersColors
}
