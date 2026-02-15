import { Suspense } from 'react'
import { getAllCategoriesWithCounts } from '@/lib/queries/categories'
import { CategoryList } from '@/components/categories/category-list'
import { CreateCategoryButton } from '@/components/categories/create-category-button'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your tasks and habits with categories
          </p>
        </div>
        <Suspense fallback={<Button disabled><Plus className="mr-2 h-4 w-4" />Create Category</Button>}>
          <CreateCategoryButton />
        </Suspense>
      </div>

      <CategoryList categories={categories} />
    </div>
  )
}
