import { LayoutDashboard, LayoutList, Settings, Package, Box, AppWindow, Users, FileText, Smartphone } from 'lucide-react'
import logo from '../assets/logo.svg'
import { cn } from '../lib/utils'

const NAV = [
  {
    label: 'FLEET',
    items: [
      { icon: LayoutDashboard, label: 'Devices',        page: 'devices'        },
      { icon: LayoutList,      label: 'Fleets',         page: 'fleets'         },
    ],
  },
  {
    label: 'DEPLOY',
    items: [
      { icon: Settings, label: 'Configurations', page: 'configurations' },
      { icon: Package,  label: 'Deployments',    page: 'deployments'    },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { icon: Box,       label: 'Packages',     page: 'packages',     disabled: true },
      { icon: AppWindow, label: 'Applications', page: 'applications', disabled: true },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: Users,    label: 'Users',     page: 'users',     disabled: true },
      { icon: FileText, label: 'Audit log', page: 'audit-log', disabled: true },
    ],
  },
]

export default function Sidebar({ activePage = 'devices', onNavigate }) {
  return (
    <aside className="w-[255px] shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Header */}
      <div className="h-[49px] flex items-center px-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2 px-1.5 py-1.5 w-full rounded-md">
          <img src={logo} alt="Ingenico" className="w-5 h-5 shrink-0" />
          <span className="text-[16px] font-semibold text-sidebar-accent-foreground tracking-normal truncate">
            Ingenico 360
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto py-2">
        {NAV.map((group) => (
          <div key={group.label} className="flex flex-col p-2">
            <div className="flex items-center h-8 px-2 opacity-70 mb-1">
              <span className="text-[12px] font-normal text-sidebar-foreground tracking-normal">
                {group.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => !item.disabled && onNavigate?.(item.page)}
                  className={cn(
                    'flex items-center gap-2 h-8 px-2 rounded-md w-full text-left transition-colors',
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed text-sidebar-foreground'
                      : item.page === activePage
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="text-[14px] font-normal leading-5 truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Device Mockups */}
      <div className="shrink-0 p-2 border-t border-sidebar-border">
        <button
          onClick={() => onNavigate?.('mockups')}
          className={cn(
            'flex items-center gap-2 h-8 px-2 rounded-md w-full text-left transition-colors',
            activePage === 'mockups'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
          )}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span className="text-[14px] font-normal leading-5 truncate">Device Mockups</span>
        </button>
      </div>
    </aside>
  )
}
