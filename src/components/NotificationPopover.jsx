import { useState } from 'react'
import { Bell, RefreshCw, Settings } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

const NOTIFICATIONS = {
  Today: [
    {
      id: 1,
      initials: 'CM',
      color: 'bg-purple-100 text-purple-600',
      title: 'Courtney booked a haircut with Barber Mike for',
      tag: 'New Bookings',
      tagColor: 'text-blue-500',
      time: 'Feb 14, 2025 · 1:44 PM',
      unread: true,
    },
    {
      id: 2,
      initials: 'SB',
      color: 'bg-orange-100 text-orange-600',
      title: 'Smith booked a haircut with Barber...',
      tag: 'Rescheduled',
      tagColor: 'text-orange-500',
      time: 'Feb 14, 2025 · 1:44 PM',
      unread: false,
    },
    {
      id: 3,
      initials: 'JD',
      color: 'bg-green-100 text-green-600',
      title: 'John Doe new barber a haircut with Barber registrations',
      tag: 'New barber registrations',
      tagColor: 'text-green-500',
      time: 'Feb 14, 2025 · 10:00 AM',
      unread: false,
    },
    {
      id: 4,
      initials: 'BT',
      color: 'bg-zinc-100 text-zinc-600',
      title: 'Barber Tom has updated his availability for the week.',
      tag: 'Shift reminder',
      tagColor: 'text-zinc-500',
      time: 'Feb 13, 2025 · 3:00 PM',
      unread: false,
    },
    {
      id: 5,
      initials: 'LB',
      color: 'bg-yellow-100 text-yellow-600',
      title: 'Lisa Brown rated Barber Jason 5 Stars...',
      tag: 'New Review',
      tagColor: 'text-yellow-600',
      time: 'Feb 13, 2025 · 3:00 PM',
      unread: false,
    },
  ],
  Yesterdays: [
    {
      id: 6,
      initials: 'SJ',
      color: 'bg-pink-100 text-pink-600',
      title: 'Sarah Johnson booked a Beard Trim with Barber Alex for',
      tag: 'New Bookings',
      tagColor: 'text-blue-500',
      time: 'Feb 12, 2025 · 10:00 AM',
      unread: false,
    },
    {
      id: 7,
      initials: 'DM',
      color: 'bg-blue-100 text-blue-600',
      title: 'David Miller scheduled a Fade Cut with Barber Chris for',
      tag: 'New Bookings',
      tagColor: 'text-blue-500',
      time: 'Feb 12, 2025 · 10:00 AM',
      unread: false,
    },
    {
      id: 8,
      initials: 'ER',
      color: 'bg-teal-100 text-teal-600',
      title: 'Emma Roberts booked a Haircut & Style with Barber Jason for',
      tag: 'New Bookings',
      tagColor: 'text-blue-500',
      time: 'Feb 12, 2025 · 3:00 PM',
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
      {/* Avatar */}
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0', item.color)}>
        {item.initials}
      </div>

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
