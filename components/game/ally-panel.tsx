'use client'

import { ALLIES } from '@/lib/data/turtle-personalities'
import { useTurtle } from '@/lib/contexts/turtle-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

/**
 * Ally Panel (#10) — Shows the 3 TMNT allies and their roles
 * in the app. Each ally maps to a specific feature:
 *   - Splinter → Guidance Layer
 *   - April → Intel Brief
 *   - Casey → Chaos Mode
 */
export function AllyPanel() {
  const { openSelector, stance } = useTurtle()

  const allies = [
    {
      ...ALLIES.splinter,
      feature: 'Guidance',
      status: 'Active — see tips above',
      featureComponent: 'SplinterGuidance',
    },
    {
      ...ALLIES.april,
      feature: 'Intel Brief',
      status: 'Active — daily briefings',
      featureComponent: 'AprilBrief',
    },
    {
      ...ALLIES.casey,
      feature: 'Chaos Mode',
      status: 'Ready — start a sprint',
      featureComponent: 'CaseyMode',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Your Allies</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] h-6 px-2"
            onClick={openSelector}
          >
            {stance ? 'Switch Turtle' : 'Pick Turtle'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allies.map((ally) => (
            <div
              key={ally.id}
              className="flex items-start gap-3 rounded-lg border p-2.5"
            >
              <span className="text-xl flex-shrink-0">{ally.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{ally.name}</span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                    {ally.feature}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {ally.description}
                </p>
                <p className="text-[10px] text-primary mt-1 font-medium">
                  {ally.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
