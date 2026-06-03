import { useState } from 'react'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { Card } from '../components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { CONFIGURATIONS, CONFIG_STATS } from '../data/configurations'

const FILTERS = ['All 14', 'Active 6', 'Deploying 2', 'Drafts 3']
const ROWS_PER_PAGE = 10
const TOTAL_PAGES = 7

function StatusBadge({ status }) {
  if (status === 'Online') return (
    <span className="flex items-center gap-1.5 text-[13px] text-emerald-600">
      <span className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </span>
      Online
    </span>
  )
  if (status === 'Offline') return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
      Offline
    </span>
  )
  if (status === 'Deploying') return (
    <span className="flex items-center gap-1.5 text-[13px] text-sky-600">
      <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 6" />
      </svg>
      Deploying
    </span>
  )
  if (status === 'Error') return (
    <span className="flex items-center gap-1.5 text-[13px] text-red-500">
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.9 13.5H1.1L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="8" y1="6.5" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
      </svg>
      Error
    </span>
  )
  return null
}

export default function ConfigurationsPage({ onNewConfig }) {
  const [activeFilter, setActiveFilter] = useState('All 14')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  const toggleAll = (checked) => {
    setSelected(checked ? new Set(CONFIGURATIONS.map(c => c.id)) : new Set())
  }
  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <TopBar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-semibold text-foreground leading-tight">Configurations</h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">Manage OS versions, packages and apps pushed to your fleets/</p>
          </div>
          <Button
            onClick={onNewConfig}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4 h-9 text-[14px] font-medium"
          >
            New Configuration
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {CONFIG_STATS.map((stat) => (
            <Card key={stat.label} className="p-5 rounded-xl border border-border shadow-none">
              <p className="text-[28px] font-semibold text-foreground leading-none mb-1.5">{stat.value}</p>
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters + sort */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 h-8 rounded-full text-[13px] font-medium transition-colors border ${
                  activeFilter === f
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 h-8 text-[13px] rounded-lg border-border">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={selected.size === CONFIGURATIONS.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Name</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Fleet</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">OS</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONFIGURATIONS.map((config) => (
                <TableRow key={config.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(config.id)}
                      onCheckedChange={() => toggleOne(config.id)}
                    />
                  </TableCell>
                  <TableCell className="text-[14px] font-medium text-foreground">{config.name}</TableCell>
                  <TableCell className="text-[14px] text-foreground">
                    {config.fleet}
                    {config.fleetExtra && (
                      <span className="ml-1 font-semibold">+ {config.fleetExtra} more</span>
                    )}
                  </TableCell>
                  <TableCell><StatusBadge status={config.status} /></TableCell>
                  <TableCell className="text-[14px] text-foreground">{config.os}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Deploy</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-[13px] text-muted-foreground">
          <span>0 of 68 row(s) selected.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <div className="flex items-center gap-1 border border-border rounded-md px-2 h-8 text-[13px] font-medium text-foreground min-w-[56px] justify-between cursor-pointer hover:bg-muted">
                {ROWS_PER_PAGE}
                <svg className="w-3 h-3 ml-1" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span>Page {page} of {TOTAL_PAGES}</span>
            <div className="flex items-center gap-1">
              {[
                { label: '«', action: () => setPage(1) },
                { label: '‹', action: () => setPage(p => Math.max(1, p - 1)) },
                { label: '›', action: () => setPage(p => Math.min(TOTAL_PAGES, p + 1)) },
                { label: '»', action: () => setPage(TOTAL_PAGES) },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-[13px] hover:bg-muted transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-select action bar */}
      {selected.size > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl bg-white rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] border border-border flex items-center justify-between px-6 py-[18px] z-10">
          <span className="text-[14px] text-foreground">{selected.size} selected</span>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-9 px-4 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
              Archive
            </Button>
            <Button variant="outline" className="h-9 px-4 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
              Deploy
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
