'use client'

import { useEffect } from 'react'

export function ReminderService() {
  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return null // This component doesn't render anything
}
