import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryActions } from './category-actions'
import type { Category } from '@prisma/client'

interface CategoryWithCounts extends Category {
  _count: {
    tasks: number
    habits: number
  }
}

interface CategoryListProps {
  categories: CategoryWithCounts[]
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No categories yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first category to organize your tasks and habits
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {category.icon && <span className="text-2xl">{category.icon}</span>}
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </CardTitle>
                </div>
              </div>
              <CategoryActions category={category} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {category._count.tasks} task{category._count.tasks !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                {category._count.habits} habit{category._count.habits !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
