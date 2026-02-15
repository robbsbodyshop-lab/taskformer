'use client'

import Link from 'next/link'
import { CheckSquare, Calendar, FolderKanban, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from '@/lib/contexts/theme-context'

export function DashboardHeader() {
  const { theme } = useTheme()

  const logoIcon = theme === 'tmnt' ? '🐢' : '⚡'
  const logoText = theme === 'tmnt' ? 'TaskFormer' : 'TaskFormer'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">{logoIcon}</span>
          <span>{logoText}</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex items-center gap-4 ml-auto">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <LayoutDashboard className="inline-block h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <Link
            href="/tasks"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <CheckSquare className="inline-block h-4 w-4 mr-1" />
            Tasks
          </Link>
          <Link
            href="/habits"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <Calendar className="inline-block h-4 w-4 mr-1" />
            Habits
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <FolderKanban className="inline-block h-4 w-4 mr-1" />
            Categories
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
