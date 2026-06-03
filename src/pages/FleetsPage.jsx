import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { FLEETS, FLEET_STATS } from '../data/fleets'

const FILTERS = ['All 11', 'Active 8', 'Deploying 1', 'Drafts 2']

export default function FleetsPage() {
  const [activeFilter, setActiveFilter] = useState('All 11')

  const filtered = FLEETS.filter((f) => {
    if (activeFilter.startsWith('All')) return true
    if (activeFilter.startsWith('Active')) return f.status === 'Active'
    if (activeFilter.startsWith('Deploying')) return f.status === 'Deploying'
    if (activeFilter.startsWith('Drafts')) return f.status === 'Drafts'
    return true
  })

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-semibold text-foreground leading-tight">Fleets</h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">
              Group devices by location or vertical and manage configurations together
            </p>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-4 h-9 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
            New Fleet
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {FLEET_STATS.map((stat) => (
            <Card key={stat.label} className="p-5 rounded-xl border border-border shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
              <p className="text-[28px] font-semibold text-foreground leading-none mb-1.5">{stat.value}</p>
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters + sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-muted p-[3px] rounded-[10px] gap-0.5">
            {FILTERS.map((f) => {
              const [label, count] = f.split(' ')
              const active = activeFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-1.5 h-7 px-2 rounded-md text-[14px] font-medium transition-colors ${
                    active
                      ? 'bg-background text-foreground shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] border border-border'
                      : 'text-foreground hover:bg-background/50'
                  }`}
                >
                  {label}
                  {count && !active && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-foreground text-[13px] font-medium">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-[13px] rounded-md border-border shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by
          </Button>
        </div>

        {/* Fleet cards grid */}
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((fleet) => (
            <div key={fleet.id} className="bg-background border border-border rounded-xl overflow-hidden shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)]">
              {/* Card header */}
              <div className="bg-muted/60 px-4 py-3 border-b border-border">
                <span className="text-[14px] font-semibold text-foreground">{fleet.name}</span>
              </div>

              {/* Card body */}
              <div className="flex flex-col gap-6 p-4">
                {/* Device counts */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-muted-foreground">Devices</span>
                    <span className="text-[16px] font-medium text-foreground">{fleet.devices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-muted-foreground">Online</span>
                    <span className="text-[16px] font-medium text-foreground">{fleet.online}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-muted-foreground">Offline</span>
                    <span className="text-[16px] font-medium text-foreground">{fleet.offline}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Config + OS */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-muted-foreground shrink-0">Active config</span>
                    <span className="text-[16px] font-medium text-foreground text-right truncate">
                      {fleet.config ?? 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-muted-foreground shrink-0">OS</span>
                    <span className="text-[16px] font-medium text-foreground text-right">{fleet.os}</span>
                  </div>
                </div>

                {/* Update all button */}
                <Button variant="outline" className="w-full h-9 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
                  Update all
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
