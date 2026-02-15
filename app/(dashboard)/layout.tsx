'use client'

import { DashboardHeader } from '@/components/shared/dashboard-header'
import { BottomNav } from '@/components/shared/bottom-nav'
import { GameProvider } from '@/lib/contexts/game-context'
import { TurtleProvider } from '@/lib/contexts/turtle-context'
import { TurtleSelector } from '@/components/game/turtle-selector'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GameProvider>
      <TurtleProvider>
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <DashboardHeader />

          {/* Main Content - extra bottom padding on mobile for bottom nav */}
          <main className="flex-1 pb-20 md:pb-0">
            <div className="container py-4 md:py-8 px-4 md:px-8">
              {children}
            </div>
          </main>

          {/* Footer - hidden on mobile */}
          <footer className="hidden md:block border-t">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js, Prisma, and shadcn/ui
              </p>
            </div>
          </footer>

          {/* Bottom Navigation - mobile only */}
          <BottomNav />

          {/* Turtle Stance Selector (modal overlay) */}
          <TurtleSelector />
        </div>
      </TurtleProvider>
    </GameProvider>
  )
}
