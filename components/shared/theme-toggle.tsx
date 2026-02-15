'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/contexts/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="font-bold"
      title={`Switch to ${theme === 'tmnt' ? 'Transformers' : 'TMNT'} theme`}
    >
      {theme === 'tmnt' ? (
        <span className="flex items-center gap-2">
          🐢 TMNT
        </span>
      ) : (
        <span className="flex items-center gap-2">
          ⚡ Transformers
        </span>
      )}
    </Button>
  )
}
