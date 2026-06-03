import { useState } from 'react'
import { Plus, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Calendar } from '../components/ui/calendar'

const DEFAULT_PACKAGES = [
  { id: 'pk', name: 'payment-kernel',  version: '4.1.0', badge: 'Required' },
  { id: 'sa', name: 'security-agent',  version: '3.3.4', badge: 'Required' },
  { id: 'rd', name: 'receipt-driver',  version: '1.2.4', badge: 'Optional' },
  { id: 'ns', name: 'nfc-stack',        version: '3.0.2', badge: 'Optional' },
]

const DEFAULT_APPS = [
  { id: 'pp', name: 'PayPoint POS',   detail: 'v6.2.1 Main payment app', badge: 'Included' },
  { id: 'rm', name: 'Retail Manager', detail: 'v2.3.2 Inventory',        badge: 'Included' },
]

function TypeBadge({ type }) {
  if (type === 'Required' || type === 'Included')
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-foreground text-background">
        {type}
      </span>
    )
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-secondary text-secondary-foreground">
      {type}
    </span>
  )
}

function PackageTable({ rows, checked, onToggle }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden w-[523px]">
      {rows.map((row, i) => (
        <div
          key={row.id}
          className={`flex items-center h-[49px] ${i < rows.length - 1 ? 'border-b border-border' : ''}`}
        >
          <div className="pl-2 pr-1 shrink-0">
            <Checkbox
              checked={checked[row.id]}
              onCheckedChange={() => onToggle(row.id)}
            />
          </div>
          <div className="w-[130px] px-2 text-[14px] text-foreground shrink-0">{row.name}</div>
          <div className="flex-1 px-2 text-[14px] text-foreground">{row.detail ?? row.version}</div>
          <div className="w-[110px] px-2 shrink-0">
            <TypeBadge type={row.badge} />
          </div>
          <div className="px-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Switch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none ${
        checked ? 'bg-foreground' : 'bg-muted-foreground/30'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200 mt-0.5 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14px] text-muted-foreground">{label}</p>
      <p className="text-[16px] font-medium text-foreground">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  )
}

export default function NewConfigurationPage({ onCancel, onSave, ctaLabel = 'Create' }) {
  const [name, setName] = useState('')
  const [osVersion, setOsVersion] = useState('')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleCreate = () => {
    setCreating(true)
    setTimeout(() => {
      setCreating(false)
      onSave(name)
    }, 2000)
  }

  const [pkgChecked, setPkgChecked] = useState(() =>
    Object.fromEntries(DEFAULT_PACKAGES.map(r => [r.id, r.badge === 'Required']))
  )
  const [appChecked, setAppChecked] = useState(() =>
    Object.fromEntries(DEFAULT_APPS.map(r => [r.id, true]))
  )

  const togglePkg = (id) => setPkgChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleApp = (id) => setAppChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const checkedPkgs = DEFAULT_PACKAGES.filter(p => pkgChecked[p.id])
  const checkedApps = DEFAULT_APPS.filter(a => appChecked[a.id])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      <div className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div className="px-6 py-6">
          <h1 className="text-[24px] font-semibold text-foreground leading-tight">Create New Configuration</h1>
          <p className="text-[16px] text-muted-foreground mt-1">Define the OS, packages, and apps to deploy to matching devices</p>
        </div>

        {/* Two-column body */}
        <div className="flex items-start">
          {/* ── Left: form ── */}
          <div className="flex-1 min-w-0">
            {/* Config name */}
            <div className="px-6 py-6">
              <div className="flex flex-col gap-3 w-[320px]">
                <label className="text-[14px] font-medium text-foreground">Configuration name</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Retail Basic Config"
                  className="h-9 text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>

            {/* OS version */}
            <div className="px-6 py-6">
              <div className="flex flex-col gap-2 w-[320px]">
                <label className="text-[14px] font-medium text-foreground">OS version</label>
                <div className="relative">
                  <select
                    value={osVersion}
                    onChange={e => setOsVersion(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-background text-[14px] text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                  >
                    <option value="">Select version</option>
                    <option value="INGCO 9.2.0 - Beta">INGCO 9.2.0 - Beta</option>
                    <option value="INGCO 9.1.2 - Current">INGCO 9.1.2 - Current</option>
                    <option value="INGCO 8.4.6 - Stable">INGCO 8.4.6 - Stable</option>
                    <option value="INGCO 8.4.5 - Stable">INGCO 8.4.5 - Stable</option>
                    <option value="INGCO 7.8.3 - Legacy">INGCO 7.8.3 - Legacy</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <p className="text-[14px] text-muted-foreground">
                  Current fleet is on 9.1.2. Selecting newer version triggers staged rollout
                </p>
              </div>
            </div>

            {/* System packages */}
            <div className="px-6 py-6 flex flex-col gap-3">
              <div className="flex items-center justify-between w-[523px]">
                <span className="text-[14px] font-medium text-foreground">System packages</span>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              <PackageTable rows={DEFAULT_PACKAGES} checked={pkgChecked} onToggle={togglePkg} />
            </div>

            {/* Applications */}
            <div className="px-6 py-6 flex flex-col gap-3">
              <div className="flex items-center justify-between w-[523px]">
                <span className="text-[14px] font-medium text-foreground">Applications</span>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              <PackageTable rows={DEFAULT_APPS} checked={appChecked} onToggle={toggleApp} />
            </div>

            {/* Schedule Push Date */}
            <div className="px-6 py-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={scheduleEnabled} onChange={setScheduleEnabled} />
                <span className="text-[14px] font-medium text-foreground">Schedule Push Date</span>
              </div>
              {scheduleEnabled && (
                <div className="flex flex-col gap-3 w-[224px]">
                  <label className="text-[14px] font-medium text-foreground">Select Date</label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button className="h-9 px-3 flex items-center justify-between w-full rounded-md border border-input bg-background text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] hover:bg-muted/30 transition-colors">
                        <span className={scheduleDate ? 'text-foreground' : 'text-muted-foreground'}>
                          {scheduleDate ? scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pick a date'}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        selected={scheduleDate}
                        onSelect={(date) => { setScheduleDate(date); setCalendarOpen(false) }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: summary panel ── */}
          <div className="shrink-0 p-6 sticky top-0 self-start">
            <div className="w-[370px] bg-background border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-muted/60 px-4 py-3 border-b border-border">
                <p className="text-[13px] font-semibold text-foreground tracking-wide uppercase">Configuration Summary</p>
              </div>

              <div className="flex flex-col gap-6 p-4">
                <SummaryRow label="Config name" value={name} />
                <SummaryRow label="OS version" value={osVersion} />

                <div className="h-px bg-border" />

                <SummaryRow label="Estimated push" value="6min" />

                <div className="h-px bg-border" />

                {/* Packages */}
                <div className="flex flex-col gap-3">
                  <p className="text-[14px] text-muted-foreground">Packages</p>
                  {checkedPkgs.length > 0 ? checkedPkgs.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <p className="text-[16px] font-medium text-foreground flex-1 min-w-0 truncate">{p.name}</p>
                      <p className="text-[14px] text-foreground shrink-0">{p.version}</p>
                    </div>
                  )) : (
                    <p className="text-[14px] text-muted-foreground">None selected</p>
                  )}
                </div>

                {/* Applications */}
                <div className="flex flex-col gap-3">
                  <p className="text-[14px] text-muted-foreground">Applications</p>
                  {checkedApps.length > 0 ? checkedApps.map(a => (
                    <div key={a.id} className="flex items-center justify-between gap-3">
                      <p className="text-[16px] font-medium text-foreground shrink-0">{a.name}</p>
                      <p className="text-[14px] text-foreground text-right flex-1 min-w-0 truncate">{a.detail}</p>
                    </div>
                  )) : (
                    <p className="text-[14px] text-muted-foreground">None selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width footer */}
      <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          className="h-9 px-4 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
          onClick={onCancel}
        >
          Save Draft
        </Button>
        <Button
          className="h-9 px-6 text-[14px] font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
          onClick={handleCreate}
        >
          {ctaLabel}
        </Button>
      </div>

      {/* Creating overlay */}
      {creating && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-6 py-4 shadow-md">
            <svg className="w-5 h-5 text-muted-foreground animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-[16px] font-medium text-foreground">Creating configuration</span>
          </div>
        </div>
      )}
    </div>
  )
}
