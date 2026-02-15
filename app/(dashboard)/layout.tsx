'use client'

import { DashboardHeader } from '@/components/shared/dashboard-header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Prisma, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}
