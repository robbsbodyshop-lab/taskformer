import Link from 'next/link'
import { CheckSquare, Calendar, FolderKanban, LayoutDashboard } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <CheckSquare className="h-6 w-6" />
            <span>TaskFormer</span>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-6 ml-auto">
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
          </nav>
        </div>
      </header>

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
