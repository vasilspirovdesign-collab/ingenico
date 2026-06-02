import { useState } from 'react'
import { Bell, RefreshCw } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '../lib/utils'

const NOTIFICATIONS = {
  Today: [
    {
      id: 1,
      title: 'Sofia-Checkout-01 was successfully registered to Retail — Sofia Central',
      tag: 'Device Registered',
      tagColor: 'text-blue-500',
      time: 'Jun 2, 2026 · 10:14 AM',
      unread: true,
    },
    {
      id: 2,
      title: 'Varna-Counter-03 went offline in Hospitality — Varna Coast',
      tag: 'Device Offline',
      tagColor: 'text-destructive',
      time: 'Jun 2, 2026 · 9:42 AM',
      unread: true,
    },
    {
      id: 3,
      title: 'Sofia-Retail-v3.2.0 deployed successfully to Retail — Sofia Central',
      tag: 'Configuration Deployed',
      tagColor: 'text-green-600',
      time: 'Jun 2, 2026 · 8:55 AM',
      unread: false,
    },
    {
      id: 4,
      title: 'Stara-Zagora-Bar-1 is reporting an error in Hospitality — Bansko Resort',
      tag: 'Device Error',
      tagColor: 'text-orange-500',
      time: 'Jun 2, 2026 · 8:03 AM',
      unread: false,
    },
    {
      id: 5,
      title: 'PCI-Compliant-v4.1.0 deployment started across Retail + Pharmacy fleets',
      tag: 'Deployment Started',
      tagColor: 'text-purple-600',
      time: 'Jun 2, 2026 · 7:30 AM',
      unread: false,
    },
  ],
  Yesterday: [
    {
      id: 6,
      title: 'Plovdiv-Kiosk-A was successfully registered to Retail — Plovdiv South',
      tag: 'Device Registered',
      tagColor: 'text-blue-500',
      time: 'Jun 1, 2026 · 4:10 PM',
      unread: false,
    },
    {
      id: 7,
      title: 'Trakia-Fuel-v1.3.0 deployed successfully to Fuel — Trakia Highway',
      tag: 'Configuration Deployed',
      tagColor: 'text-green-600',
      time: 'Jun 1, 2026 · 2:45 PM',
      unread: false,
    },
    {
      id: 8,
      title: 'Dobrich-Pharmacy-01 went offline in Pharmacy — Burgas',
      tag: 'Device Offline',
      tagColor: 'text-destructive',
      time: 'Jun 1, 2026 · 11:20 AM',
      unread: false,
    },
  ],
}

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const unreadCount = Object.values(notifications).flat().filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = {}
      for (const group in prev) updated[group] = prev[group].map(n => ({ ...n, unread: false }))
      return updated
    })
  }

  const markRead = (id) => {
    setNotifications(prev => {
      const updated = {}
      for (const group in prev) updated[group] = prev[group].map(n => n.id === id ? { ...n, unread: false } : n)
      return updated
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[400px] p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-semibold">Notifications</p>
              <p className="text-[12px] text-muted-foreground">Stay up to date with your fleet</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="link" size="sm" className="h-auto p-0 text-[12px]" onClick={markAllRead}>
              ✓ Mark all as read
            </Button>
          </div>
        </div>

        <Separator />

        <ScrollArea className="max-h-[440px]">
          {Object.entries(notifications).map(([group, items]) => (
            <div key={group}>
              <p className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {group}
              </p>
              {items.map((item, i) => (
                <div key={item.id}>
                  <button
                    onClick={() => markRead(item.id)}
                    className="flex items-start gap-3 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium leading-snug line-clamp-2">{item.title}</p>
                      <p className={cn('text-[12px] font-medium mt-0.5', item.tagColor)}>{item.tag}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                    {item.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                  </button>
                  {i < items.length - 1 && <Separator className="mx-4 w-auto" />}
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
