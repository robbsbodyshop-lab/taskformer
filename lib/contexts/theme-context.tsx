'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'tmnt' | 'transformers'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// Create context with default value to avoid SSR errors
const ThemeContext = createContext<ThemeContextType>({
  theme: 'tmnt',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'tmnt'
    }
    const savedTheme = localStorage.getItem('taskformer-theme')
    return savedTheme === 'transformers' ? 'transformers' : 'tmnt'
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('taskformer-theme', theme)
    // Apply theme class to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'tmnt' ? 'transformers' : 'tmnt'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}
