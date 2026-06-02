import { useState } from 'react'
import { Bell, RefreshCw, Settings } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

const NOTIFICATIONS = {
  Today: [
    {
      id: 1,
      initials: 'SC',
      color: 'bg-blue-100 text-blue-600',
      title: 'Sofia-Checkout-01 was successfully registered to Retail — Sofia Central',
      tag: 'Device Registered',
      tagColor: 'text-blue-500',
      time: 'Jun 2, 2026 · 10:14 AM',
      unread: true,
    },
    {
      id: 2,
      initials: 'VC',
      color: 'bg-red-100 text-red-600',
      title: 'Varna-Counter-03 went offline in Hospitality — Varna Coast',
      tag: 'Device Offline',
      tagColor: 'text-red-500',
      time: 'Jun 2, 2026 · 9:42 AM',
      unread: true,
    },
    {
      id: 3,
      initials: 'SR',
      color: 'bg-green-100 text-green-600',
      title: 'Sofia-Retail-v3.2.0 deployed successfully to Retail — Sofia Central',
      tag: 'Configuration Deployed',
      tagColor: 'text-green-600',
      time: 'Jun 2, 2026 · 8:55 AM',
      unread: false,
    },
    {
      id: 4,
      initials: 'SB',
      color: 'bg-orange-100 text-orange-600',
      title: 'Stara-Zagora-Bar-1 is reporting an error in Hospitality — Bansko Resort',
      tag: 'Device Error',
      tagColor: 'text-orange-500',
      time: 'Jun 2, 2026 · 8:03 AM',
      unread: false,
    },
    {
      id: 5,
      initials: 'PCI',
      color: 'bg-purple-100 text-purple-600',
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
      initials: 'PK',
      color: 'bg-blue-100 text-blue-600',
      title: 'Plovdiv-Kiosk-A was successfully registered to Retail — Plovdiv South',
      tag: 'Device Registered',
      tagColor: 'text-blue-500',
      time: 'Jun 1, 2026 · 4:10 PM',
      unread: false,
    },
    {
      id: 7,
      initials: 'TF',
      color: 'bg-green-100 text-green-600',
      title: 'Trakia-Fuel-v1.3.0 deployed successfully to Fuel — Trakia Highway',
      tag: 'Configuration Deployed',
      tagColor: 'text-green-600',
      time: 'Jun 1, 2026 · 2:45 PM',
      unread: false,
    },
    {
      id: 8,
      initials: 'DO',
      color: 'bg-red-100 text-red-600',
      title: 'Dobrich-Pharmacy-01 went offline in Pharmacy — Burgas',
      tag: 'Device Offline',
      tagColor: 'text-red-500',
      time: 'Jun 1, 2026 · 11:20 AM',
      unread: false,
    },
  ],
}

function NotificationItem({ item, onRead }) {
  return (
    <button
      onClick={() => onRead(item.id)}
      className="flex items-start gap-3 w-full px-4 py-3 hover:bg-muted/40 transition-colors text-left"
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground leading-snug line-clamp-2">{item.title}</p>
        <span className={cn('text-[12px] font-medium', item.tagColor)}>{item.tag}</span>
        <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
      </div>

      {/* Unread dot */}
      {item.unread && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
      )}
    </button>
  )
}

export default function NotificationPopover() {
  const [activeTab, setActiveTab] = useState('All')
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const unreadCount = Object.values(notifications).flat().filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = {}
      for (const group in prev) {
        updated[group] = prev[group].map(n => ({ ...n, unread: false }))
      }
      return updated
    })
  }

  const markRead = (id) => {
    setNotifications(prev => {
      const updated = {}
      for (const group in prev) {
        updated[group] = prev[group].map(n => n.id === id ? { ...n, unread: false } : n)
      }
      return updated
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[400px] p-0 rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start justify-between mb-0.5">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">Notification</h3>
              <p className="text-[12px] text-muted-foreground">Stay Update With Your Latest Notifications</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tabs + mark all */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              {['All', 'Payments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-1 px-3 h-7 rounded-full text-[13px] font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {tab}
                  {tab === 'All' && unreadCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={markAllRead}
              className="text-[12px] text-blue-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
            >
              <span className="w-3 h-3 inline-flex items-center justify-center">✓</span>
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto max-h-[440px]">
          {Object.entries(notifications).map(([group, items]) => (
            <div key={group}>
              <div className="px-4 py-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{group}</span>
              </div>
              {items.map(item => (
                <NotificationItem key={item.id} item={item} onRead={markRead} />
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
