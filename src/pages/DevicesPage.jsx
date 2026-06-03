import { useState, useEffect } from 'react'
import { MoreHorizontal, ArrowUpDown, Trash2 } from 'lucide-react'
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
import {
  Dialog, DialogContent, DialogClose,
} from '../components/ui/dialog'
import { DEVICES, STATS } from '../data/devices'

const FILTERS = ['All 142', 'Needs attention 3', 'Online 128', 'Offline 11']

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

export default function DevicesPage({ onRegister, onEditDevice, newDeviceId }) {
  const [activeFilter, setActiveFilter] = useState('All 142')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletedName, setDeletedName] = useState(null)

  useEffect(() => {
    if (!deletedName) return
    const id = setTimeout(() => setDeletedName(null), 4000)
    return () => clearTimeout(id)
  }, [deletedName])

  const toggleAll = (checked) => {
    setSelected(checked ? new Set(DEVICES.map(d => d.id)) : new Set())
  }
  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-semibold text-foreground leading-tight">Devices</h1>
            <p className="text-[14px] text-muted-foreground mt-0.5">All terminals registerd to your organisation</p>
          </div>
          <Button onClick={onRegister} className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-4 h-9 text-[14px] font-medium">
            Register Device
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map((stat) => (
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
                    checked={selected.size === DEVICES.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Device</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Fleet</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Configuration</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEVICES.map((device) => (
                <TableRow key={device.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(device.id)}
                      onCheckedChange={() => toggleOne(device.id)}
                    />
                  </TableCell>
                  <TableCell className="text-[14px] font-medium text-foreground">
                    <span className="flex items-center gap-2">
                      {device.name} <span className="text-muted-foreground font-normal">/ IMEI {device.imei}</span>
                      {newDeviceId === device.id && (
                        <span className="text-[11px] font-semibold tracking-wide px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-muted">
                          NEW
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-[14px] text-foreground">{device.fleet}</TableCell>
                  <TableCell>
                    <StatusBadge status={device.status} />
                  </TableCell>
                  <TableCell className="text-[14px] text-foreground">{device.config}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditDevice?.(device)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(device)}>Remove device</DropdownMenuItem>
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
          <span>{selected.size} of 68 row(s) selected.</span>
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

      {/* Delete toast */}
      {deletedName && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 bg-foreground text-background rounded-xl px-4 py-3.5 shadow-lg w-[340px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
          </svg>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold">Device removed</span>
            <span className="text-[13px] opacity-70">{deletedName} has been permanently removed</span>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent showCloseButton={false} className="max-w-[320px] p-0 overflow-hidden gap-0">
          {/* Icon area */}
          <div className="flex items-center justify-center bg-red-50 py-8 relative">
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-3 -left-4 text-red-300 text-lg font-light select-none">+</span>
              <span className="absolute -top-1 right-0 text-red-300 text-sm font-light select-none">+</span>
              <span className="absolute bottom-0 -left-3 text-red-300 text-sm font-light select-none">+</span>
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2 px-6 pt-5 pb-6 text-center">
            <p className="text-[16px] font-semibold text-foreground">Remove Device?</p>
            <p className="text-[13px] text-muted-foreground leading-snug">
              <span className="font-medium text-foreground">{deleteTarget?.name}</span> will be permanently removed and cannot be recovered.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 px-6 pb-6">
            <DialogClose
              render={<Button variant="outline" className="flex-1 h-9 text-[14px] font-medium" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="flex-1 h-9 text-[14px] font-medium bg-red-500 hover:bg-red-600 text-white border-0"
              onClick={() => { setDeletedName(deleteTarget?.name); setDeleteTarget(null) }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
