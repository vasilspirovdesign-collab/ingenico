import { useState } from 'react'
import { Plus, Calendar, MoreHorizontal } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'

const FLEETS = [
  'Retail - Sofia Central',
  'Retail - Plovdiv South',
  'Hospitality - Varna Coast',
  'Hospitality - Bansko Resort',
  'Pharmacy - Burgas',
  'Fuel - Trakia Highway',
]

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

function Badge({ type }) {
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

function PackageRow({ row, isLast }) {
  const [checked, setChecked] = useState(row.badge === 'Required' || row.badge === 'Included')
  return (
    <div className={`flex items-center h-[49px] ${!isLast ? 'border-b border-border' : ''}`}>
      <div className="pl-2 pr-1 shrink-0">
        <Checkbox checked={checked} onCheckedChange={(val) => setChecked(!!val)} />
      </div>
      <div className="w-[130px] px-2 text-[14px] text-foreground shrink-0">{row.name}</div>
      <div className="flex-1 px-2 text-[14px] text-foreground">{row.detail ?? row.version}</div>
      <div className="w-[110px] px-2 shrink-0">
        <Badge type={row.badge} />
      </div>
      <div className="px-2 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function PackageTable({ rows }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden w-[523px]">
      {rows.map((row, i) => (
        <PackageRow key={row.id} row={row} isLast={i === rows.length - 1} />
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

export default function NewConfigurationPage({ onCancel, onSave, ctaLabel = 'Review & Create' }) {
  const [name, setName] = useState('')
  const [osVersion, setOsVersion] = useState('')
  const [scheduleEnabled, setScheduleEnabled] = useState(true)
  const [scheduleDate, setScheduleDate] = useState('2025-06-01')

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      <div className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div className="px-6 py-6 border-b border-border">
          <h1 className="text-[24px] font-semibold text-foreground leading-tight">Create New Configuration</h1>
          <p className="text-[16px] text-muted-foreground mt-1">Define the OS, packages, and apps to deploy to matching devices</p>
        </div>

        {/* Name */}
        <div className="px-6 py-6 border-b border-border">
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
        <div className="px-6 py-6 border-b border-border">
          <div className="flex flex-col gap-2 w-[320px]">
            <label className="text-[14px] font-medium text-foreground">OS version</label>
            <Input
              value={osVersion}
              onChange={e => setOsVersion(e.target.value)}
              placeholder="INGCO 9.1.2 - Current"
              className="h-9 text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
            />
            <p className="text-[14px] text-muted-foreground">
              Current fleet is on 9.1.2. Selecting newer version triggers staged rollout
            </p>
          </div>
        </div>

        {/* System packages */}
        <div className="px-6 py-6 border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between w-[523px]">
            <span className="text-[14px] font-medium text-foreground">System packages</span>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          <PackageTable rows={DEFAULT_PACKAGES} />
        </div>

        {/* Applications */}
        <div className="px-6 py-6 border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between w-[523px]">
            <span className="text-[14px] font-medium text-foreground">Applications</span>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          <PackageTable rows={DEFAULT_APPS} />
        </div>

        {/* Schedule Push Date */}
        <div className="px-6 py-6 border-b border-border flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={scheduleEnabled} onChange={setScheduleEnabled} />
            <span className="text-[14px] font-medium text-foreground">Schedule Push Date</span>
          </div>
          {scheduleEnabled && (
            <div className="flex flex-col gap-3 w-[224px]">
              <label className="text-[14px] font-medium text-foreground">Select Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="h-9 text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] pr-9"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="h-9 px-4 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
            onClick={onCancel}
          >
            Save Draft
          </Button>
          <Button
            className="h-9 px-4 text-[14px] font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
            onClick={() => onSave(name)}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
