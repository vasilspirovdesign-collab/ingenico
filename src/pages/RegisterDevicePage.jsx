import { useState, useRef, useEffect } from 'react'
import { Upload, ChevronDown, Plus, Trash2, X } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import ReviewModal from '../components/ReviewModal'
import { DEVICES } from '../data/devices'

const STEPS = ['Identify device', 'Assign to fleet', 'Apply configuration']

const CONFIGS = [
  { id: 1, name: 'Sofia-Retail-v3.2.0',      category: 'RETAIL',       badge: 'Active'  },
  { id: 2, name: 'Sofia-Retail-v3.1.0',      category: 'RETAIL',       badge: null       },
  { id: 3, name: 'Plovdiv-Retail-v3.2.0',    category: 'RETAIL',       badge: null       },
  { id: 4, name: 'Trakia-Fuel-v1.3.0',       category: 'FUEL',         badge: 'Latest'  },
  { id: 5, name: 'Trakia-Fuel-v1.2.2',       category: 'FUEL',         badge: null       },
  { id: 6, name: 'PCI-Compliant-v4.1.0',     category: 'HOSPITALITY',  badge: null       },
  { id: 7, name: 'Bulgaria-Base-v1.0.0',     category: 'BASE',         badge: null       },
]

const FLEETS = [
  { id: 1,  name: 'Retail - Sofia Central',      devices: 42, config: 'Sofia-Retail-v3.2.0',      status: 'Active' },
  { id: 2,  name: 'Retail - Plovdiv South',      devices: 28, config: 'Plovdiv-Retail-v3.2.0',    status: 'Active' },
  { id: 3,  name: 'Hospitality - Varna Coast',   devices: 15, config: 'Varna-Hospitality-v2.9.4', status: 'Active' },
  { id: 4,  name: 'Hospitality - Bansko Resort', devices: 8,  config: 'Bansko-Resort-v2.10.0',    status: 'Active' },
  { id: 5,  name: 'Pharmacy - Burgas',           devices: 6,  config: null,                       status: null     },
  { id: 6,  name: 'Fuel - Trakia Highway',       devices: 12, config: 'Trakia-Fuel-v1.3.0',       status: 'Active' },
  { id: 7,  name: 'Franchise - Ruse',            devices: 9,  config: null,                       status: null     },
  { id: 8,  name: 'Events - Sofia Arena',        devices: 20, config: 'Bulgaria-Base-v1.0.0',     status: 'Active' },
  { id: 9,  name: 'Staging - Sofia Lab',         devices: 6,  config: null,                       status: null     },
  { id: 10, name: 'QA - Plovdiv Office',         devices: 4,  config: null,                       status: null     },
  { id: 11, name: 'Stara Zagora - Bars',         devices: 7,  config: 'Bars-Resort-v2.10.0',       status: 'Active' },
]

function Stepper({ current, onStepClick }) {
  return (
    <div className="flex items-center gap-6 mb-8">
      {STEPS.map((step, i) => {
        const num = i + 1
        const active = num === current
        const completed = num < current
        const future = num > current
        return (
          <div key={step} className="flex items-center gap-6">
            <button
              onClick={() => !future && onStepClick?.(num)}
              className={cn('flex items-center gap-2', future ? 'cursor-default' : 'cursor-pointer')}
            >
              <div className={cn(
                'w-8 h-8 rounded-md flex items-center justify-center text-[14px] shrink-0 transition-colors',
                active    && 'bg-foreground text-background',
                completed && 'bg-foreground text-background',
                future    && 'bg-[#f5f5f5] text-muted-foreground/40'
              )}>
                {completed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                ) : num}
              </div>
              <span className={cn(
                'text-[14px] font-medium whitespace-nowrap transition-colors',
                active    && 'text-foreground',
                completed && 'text-foreground',
                future    && 'text-muted-foreground/40'
              )}>
                {step}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn('w-14 h-px transition-colors', completed ? 'bg-foreground/30' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DeviceCard({ device, model, onAdd, onRemove, added }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] border border-border bg-background w-full">
      {/* Info */}
      <div className="flex-1 flex flex-col gap-[2px] min-w-0">
        <span className="text-[14px] font-medium text-foreground">{device.name}</span>
        <div className="flex items-center gap-[10px]">
          <span className="text-[14px] font-light text-foreground whitespace-nowrap">{model} / IMEI {device.imei}</span>
          <span className="inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] bg-secondary text-[12px] font-medium text-secondary-foreground whitespace-nowrap">
            Not registered
          </span>
        </div>
      </div>
      {/* Action button */}
      <button
        onClick={() => added ? onRemove(device.id) : onAdd(device)}
        className={cn(
          'h-9 px-[10px] rounded-md border text-[14px] font-medium shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.1)] transition-colors',
          added
            ? 'bg-foreground text-background border-foreground hover:bg-foreground/90'
            : 'bg-background text-foreground border-border hover:bg-muted/50'
        )}
      >
        {added ? 'Added' : 'Add'}
      </button>
    </div>
  )
}

export default function RegisterDevicePage({ onCancel, onConfirm, onNewConfig, initialConfig, onConfigApplied, editingDevice }) {
  const [step, setStep] = useState(() => editingDevice ? 2 : 1)
  const [query, setQuery] = useState('')
  const [model, setModel] = useState('Lane 3000')
  const [dragging, setDragging] = useState(false)
  const [addedDevices, setAddedDevices] = useState(() => editingDevice ? [editingDevice] : [])
  const [label, setLabel] = useState('')
  const [selectedFleet, setSelectedFleet] = useState(() => {
    if (!editingDevice) return 1
    const match = FLEETS.find(f => f.name === editingDevice.fleet)
    return match ? match.id : 1
  })
  const [selectedConfig, setSelectedConfig] = useState(() => editingDevice?.config ?? null)
  const [configSearch, setConfigSearch] = useState('')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [newDeviceOpen, setNewDeviceOpen] = useState(false)
  const [ndLabel, setNdLabel] = useState('')
  const [ndModel, setNdModel] = useState('')
  const [ndSerial, setNdSerial] = useState('')
  const [ndImei, setNdImei] = useState('')
  const [addedToast, setAddedToast] = useState(null)
  const fileRef = useRef()
  const resultsRef = useRef()

  useEffect(() => {
    if (!newDeviceOpen) return
    const handler = (e) => { if (e.key === 'Escape') setNewDeviceOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [newDeviceOpen])

  const handleResultsScroll = () => {
    const el = resultsRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setScrollPercent(max > 0 ? el.scrollTop / max : 0)
  }

  useEffect(() => {
    if (initialConfig) {
      setSelectedConfig(initialConfig)
      setStep(3)
      onConfigApplied?.()
    }
  }, [initialConfig])

  const results = query.trim().length > 0
    ? DEVICES.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.imei.includes(query)
      )
    : []

  const handleAdd = (device) => {
    setAddedDevices(prev => [...prev, device])
  }
  const handleRemove = (id) => {
    setAddedDevices(prev => prev.filter(d => d.id !== id))
  }

  const firstDevice = addedDevices[0]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      {/* Header + stepper — always pinned */}
      <div className="px-6 pt-6 shrink-0">
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-foreground leading-tight">
            {editingDevice ? <>Edit &quot;{editingDevice.name}&quot; Details</> : 'Register New Device'}
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1">Add a Terminal to your organisation and assign it to a fleet.</p>
        </div>
        <Stepper current={step} onStepClick={setStep} />
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="flex-1 overflow-y-auto">

          {/* Two-column: search panel + added panel */}
          <div className="px-6 py-6 flex gap-6 items-start">

            {/* Left: bordered search panel */}
            <div className="border border-border rounded-[10px] pl-6 pr-2 py-6 flex flex-col gap-6 shrink-0 w-[664px] min-h-[404px]">
              {/* Header: label+count (flex-1) | filter input (flex-1) */}
              <div className="flex items-center gap-4 pr-2">
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-[14px] font-medium text-foreground whitespace-nowrap">Matching devices</span>
                  <span className="inline-flex items-center justify-center h-[22px] px-1.5 rounded-md border border-border bg-background text-[12px] font-medium text-muted-foreground">
                    {results.length}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Filter by name, Serial number"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-9 text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>

              {/* Cards + scrollbar */}
              <div className="flex gap-2">
                <div
                  ref={resultsRef}
                  onScroll={handleResultsScroll}
                  className="flex-1 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                  style={{ maxHeight: '240px' }}
                >
                  {results.length > 0 ? results.map(device => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      model={model}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                      added={!!addedDevices.find(a => a.id === device.id)}
                    />
                  )) : (
                    <div className="flex flex-col items-center gap-4 py-[67px]">
                      <p className="text-[14px] font-light text-foreground text-center">
                        {query ? 'No matching devices' : 'Filter by name, Serial number or add New Device'}
                      </p>
                      {!query && (
                        <Button
                          variant="outline"
                          className="h-9 gap-1.5 px-[10px] text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
                          onClick={() => setNewDeviceOpen(true)}
                        >
                          <Plus className="w-4 h-4" />
                          New Device
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {results.length > 0 && (
                  <div className="w-2 shrink-0 relative self-stretch">
                    <div
                      className="absolute w-full bg-[#e5e5e5] rounded-[6px] transition-all duration-75"
                      style={{
                        height: `${Math.min(100, Math.max(14, (4 / results.length) * 100))}%`,
                        top: `${scrollPercent * Math.max(0, 100 - Math.min(100, Math.max(14, (4 / results.length) * 100)))}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: added devices panel */}
            <div className="flex-1 min-w-0 bg-background border border-border rounded-xl overflow-hidden self-stretch">
              <div className="bg-[#fafafa] px-4 py-4 flex items-center justify-between border-b border-border">
                <span className="text-[14px] font-semibold text-foreground">
                  {addedDevices.length === 0 ? 'No device added' : `${addedDevices.length} device${addedDevices.length !== 1 ? 's' : ''} added`}
                </span>
                <button
                  onClick={() => setAddedDevices([])}
                  disabled={addedDevices.length === 0}
                  className="text-[14px] text-foreground underline underline-offset-2 disabled:opacity-40 disabled:cursor-default"
                >
                  Clear all
                </button>
              </div>
              {addedDevices.length > 0 && (
                <div className="p-4 flex flex-col gap-2">
                  {addedDevices.map(device => (
                    <div key={device.id} className="flex items-center gap-4 px-3 py-2 bg-[#fafafa] border border-dashed border-border rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]">
                      <p className="flex-1 text-[14px] font-semibold text-foreground truncate min-w-0">
                        {device.name} /
                        <span className="font-normal text-muted-foreground"> IMEI {device.imei}</span>
                      </p>
                      <button
                        onClick={() => handleRemove(device.id)}
                        className="w-6 h-6 rounded-full bg-[#f5f5f5] flex items-center justify-center shrink-0 hover:bg-muted transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* or upload file — centered short lines matching Figma px-[216px] */}
          <div className="px-[216px] py-6 flex items-center gap-6">
            <div className="w-14 h-px bg-border shrink-0" />
            <span className="text-[14px] text-muted-foreground shrink-0">or upload file</span>
            <div className="w-14 h-px bg-border shrink-0" />
          </div>

          {/* Upload File */}
          <div className="px-6 pb-8 flex flex-col gap-3">
            <p className="text-[14px] font-medium text-foreground">Upload File</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false) }}
              className={cn(
                'flex flex-col items-center justify-center h-[163px] w-[664px] rounded-md border border-dashed cursor-pointer transition-colors shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]',
                dragging ? 'border-foreground bg-muted/40' : 'border-border bg-background hover:bg-muted/30'
              )}
            >
              <input ref={fileRef} type="file" className="hidden" />
              <Upload className="w-6 h-6 text-muted-foreground mb-2.5" />
              <span className="text-[14px] font-medium text-muted-foreground">Drag and drop files here, or click to select files</span>
            </div>
          </div>

        </div>
      )}

      {/* ── Steps 2 & 3 — scrollable */}
      {(step === 2 || step === 3) && (
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="flex gap-6 items-start">

              {/* Left: fleet selection panel */}
              <div className="border border-border rounded-[10px] pl-6 pr-2 py-6 flex flex-col gap-6 shrink-0 w-[664px]">
                <div className="flex flex-col gap-2 pr-2">
                  <p className="text-[14px] font-medium text-foreground">Assign to fleet</p>
                  <p className="text-[14px] text-muted-foreground">Select a fleet - the device will inherit its active configuration.</p>
                </div>

                {/* Fleet rows + scrollbar */}
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '320px' }}>
                    {FLEETS.map((fleet) => {
                      const isSelected = selectedFleet === fleet.id
                      return (
                        <button
                          key={fleet.id}
                          onClick={() => setSelectedFleet(fleet.id)}
                          className={cn(
                            'relative flex flex-col gap-[2px] px-4 py-3 rounded-[10px] border text-left w-full transition-colors',
                            isSelected ? 'border-[#898887]' : 'border-border hover:bg-muted/20'
                          )}
                        >
                          {/* Row 1: checkbox + name */}
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-4 h-4 rounded-sm flex items-center justify-center shrink-0 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]',
                              isSelected ? 'bg-foreground' : 'bg-background border border-border'
                            )}>
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 6l3 3 5-5"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14px] font-medium text-foreground">{fleet.name}</span>
                          </div>
                          {/* Row 2: spacer + description */}
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 shrink-0" />
                            <span className="text-[14px] font-light text-foreground">
                              {fleet.devices} devices
                              {fleet.config
                                ? <> <span className="font-bold"> • </span> Config v3.1.0 <span className="font-bold"> • </span> {fleet.status}</>
                                : <> <span className="font-bold"> • </span> No config assigned</>
                              }
                            </span>
                          </div>
                          {/* Badge */}
                          {isSelected && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] bg-secondary text-[12px] font-medium text-secondary-foreground">
                              Selected
                            </span>
                          )}
                          {!isSelected && !fleet.config && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] bg-secondary text-[12px] font-medium text-secondary-foreground">
                              No config
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <div className="w-2 shrink-0 relative self-stretch">
                    <div className="absolute w-full bg-[#e5e5e5] rounded-[6px]" style={{ height: `${Math.min(100, (5 / FLEETS.length) * 100)}%`, top: 0 }} />
                  </div>
                </div>
              </div>

              {/* Right: added devices summary */}
              <div className="flex-1 min-w-0 bg-background border border-border rounded-xl overflow-hidden">
                <div className="bg-[#fafafa] px-4 py-4 flex items-center justify-between border-b border-border">
                  <span className="text-[14px] font-semibold text-foreground">{addedDevices.length} device{addedDevices.length !== 1 ? 's' : ''} added</span>
                  <button onClick={() => setStep(1)} className="text-[14px] text-foreground underline underline-offset-2">Edit</button>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {addedDevices.map(device => (
                    <div key={device.id} className="flex items-center gap-4 px-3 py-2 bg-[#fafafa] border border-dashed border-border rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]">
                      <p className="text-[14px] truncate">
                        <span className="font-semibold text-foreground">{device.name} /</span>
                        <span className="font-normal text-muted-foreground"> IMEI {device.imei}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (() => {
            const filtered = CONFIGS.filter(c =>
              !configSearch || c.name.toLowerCase().includes(configSearch.toLowerCase())
            )
            const categories = [...new Set(filtered.map(c => c.category))]
            const PACKAGES = [
              { name: 'payment-kernel', version: '4.1.0' },
              { name: 'security-agent',  version: '3.3.4' },
              { name: 'receipt-driver',  version: '1.2.4' },
            ]
            const APPS = [
              { name: 'PayPoint POS',   detail: 'v6.2.1 Main payment app' },
              { name: 'Retail Manager', detail: 'v2.3.2 Inventory'        },
            ]
            return (
              <div className="flex gap-6 items-start">
              <div className="bg-background border border-border rounded-xl overflow-hidden w-[562px]">
                {/* Panel header */}
                <div className="bg-[#fafafa] px-4 py-4 border-b border-border">
                  <span className="text-[14px] font-semibold text-foreground">Select Configuration</span>
                </div>
                <div className="p-4 flex flex-col gap-6">
                  {/* Search input */}
                  <div className="relative w-[320px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <Input
                      placeholder="Search by name.."
                      value={configSearch}
                      onChange={e => setConfigSearch(e.target.value)}
                      className="h-9 pl-9 text-[14px] font-light shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>

                  {/* Grouped config list + scrollbar */}
                  <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '320px' }}>
                      {categories.map(cat => (
                        <div key={cat} className="flex flex-col gap-3">
                          <p className="text-[14px] text-muted-foreground">{cat}</p>
                          <div className="flex flex-col gap-2">
                            {filtered.filter(c => c.category === cat).map(cfg => (
                              <button
                                key={cfg.id}
                                onClick={() => setSelectedConfig(cfg.name)}
                                className={cn(
                                  'flex items-center gap-[10px] h-[53px] px-2 rounded-[8px] text-left transition-colors',
                                  selectedConfig === cfg.name ? 'bg-foreground' : 'bg-secondary hover:bg-secondary/70'
                                )}
                              >
                                <span className={cn(
                                  'text-[14px] font-medium flex-1 truncate',
                                  selectedConfig === cfg.name ? 'text-background' : 'text-foreground'
                                )}>
                                  {cfg.name}
                                </span>
                                {cfg.badge && (
                                  <span className={cn(
                                    'inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] text-[12px] font-medium shrink-0',
                                    selectedConfig === cfg.name
                                      ? 'bg-background text-foreground'
                                      : 'bg-foreground text-background'
                                  )}>
                                    {cfg.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-2 shrink-0 relative self-stretch">
                      <div className="absolute w-full bg-[#e5e5e5] rounded-[6px]" style={{ height: `${Math.min(100, (4 / CONFIGS.length) * 100)}%`, top: 0 }} />
                    </div>
                  </div>

                  {/* Create new config button */}
                  <Button
                    variant="outline"
                    className="w-full h-9 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
                    onClick={onNewConfig}
                  >
                    Create new Configuration
                  </Button>
                </div>
              </div>

              {/* Configuration Summary panel */}
              <div className="bg-background border border-border rounded-xl overflow-hidden w-[370px] shrink-0">
                <div className="bg-[#fafafa] px-4 py-4 border-b border-border">
                  <span className="text-[14px] font-semibold text-foreground tracking-wide">CONFIGURATION SUMMARY</span>
                </div>
                <div className="p-4 flex flex-col gap-6">
                  {/* Config name */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[14px] text-muted-foreground">Config name</p>
                    <p className="text-[16px] font-medium text-foreground">{selectedConfig || <span className="text-muted-foreground">—</span>}</p>
                  </div>
                  {/* OS version */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[14px] text-muted-foreground">OS version</p>
                    <p className="text-[16px] font-medium text-foreground">INGCO 9.1.2 - Current</p>
                  </div>
                  <div className="h-px bg-border" />
                  {/* Estimated push */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[14px] text-muted-foreground">Estimated push</p>
                    <p className="text-[16px] font-medium text-foreground">6min</p>
                  </div>
                  <div className="h-px bg-border" />
                  {/* Packages */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[14px] text-muted-foreground">Packages</p>
                    {PACKAGES.map(p => (
                      <div key={p.name} className="flex items-center gap-3">
                        <p className="flex-1 text-[16px] font-medium text-foreground min-w-0 truncate">{p.name}</p>
                        <p className="text-[14px] text-foreground shrink-0">{p.version}</p>
                      </div>
                    ))}
                  </div>
                  {/* Applications */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[14px] text-muted-foreground">Applications</p>
                    {APPS.map(a => (
                      <div key={a.name} className="flex items-center gap-3">
                        <p className="text-[16px] font-medium text-foreground shrink-0">{a.name}</p>
                        <p className="flex-1 text-[14px] text-foreground text-right truncate">{a.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
        <div>
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-[14px] text-foreground hover:text-muted-foreground transition-colors"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} className="h-9 px-5 text-[14px] rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={() => step < 3 ? setStep(s => s + 1) : setReviewOpen(true)}
            disabled={step === 1 && addedDevices.length === 0}
            className="h-9 px-5 text-[14px] rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editingDevice ? 'Save Device' : step === 3 ? 'Review & Register' : 'Continue'}
          </Button>
        </div>
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={onConfirm || onCancel}
        device={{
          label: label || 'Checkout-12, Main Store',
          model,
          serial: firstDevice?.name || 'SN-2094-0041',
          imei: firstDevice?.imei || '354 882 11 123456 7',
        }}
        fleet={FLEETS.find(f => f.id === selectedFleet)}
        config={{ name: selectedConfig, osVersion: 'INGCO 9.1.2 - Current' }}
      />

      {/* New Device Modal */}
      {newDeviceOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(2px)', background: 'rgba(169,168,168,0.34)' }}
          onClick={() => setNewDeviceOpen(false)}
        >
          <div
            className="bg-background rounded-xl border border-border shadow-xl w-[1174px] h-[800px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-border shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[24px] font-semibold text-foreground leading-8">New Device</h2>
                  <p className="text-[16px] text-foreground mt-2">Add a new device to your organisation database</p>
                </div>
                <button onClick={() => setNewDeviceOpen(false)} className="text-foreground hover:opacity-60 transition-opacity">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex gap-2 px-6 py-6 overflow-hidden">
              {/* Left: form */}
              <div className="flex-1 bg-background border border-border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-[#fafafa] px-4 py-4 border-b border-border shrink-0">
                  <span className="text-[14px] font-semibold text-foreground tracking-wide">DEVICE DETAILS</span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
                  {/* Label + Model row */}
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col gap-3 w-[320px]">
                      <label className="text-[14px] font-medium text-foreground">Label</label>
                      <Input value={ndLabel} onChange={e => setNdLabel(e.target.value)} placeholder="Enter label" className="h-9 text-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
                    </div>
                    <div className="flex flex-col gap-3 w-[320px]">
                      <label className="text-[14px] font-medium text-foreground">Model</label>
                      <div className="relative">
                        <select
                          value={ndModel}
                          onChange={e => setNdModel(e.target.value)}
                          className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-background text-[16px] text-foreground appearance-none cursor-pointer focus:outline-none shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                        >
                          <option value="">Select model</option>
                          {['Lane 3000', 'Lane 5000', 'Lane 7000', 'Move 5000'].map(m => <option key={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  {/* Serial number */}
                  <div className="flex flex-col gap-3 w-[320px]">
                    <label className="text-[14px] font-medium text-foreground">Serial number</label>
                    <Input value={ndSerial} onChange={e => setNdSerial(e.target.value)} placeholder="Enter serial number" className="h-9 text-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
                  </div>
                  <div className="h-px bg-border" />
                  {/* IMEI */}
                  <div className="flex flex-col gap-3 w-[320px]">
                    <label className="text-[14px] font-medium text-foreground">IMEI</label>
                    <Input value={ndImei} onChange={e => setNdImei(e.target.value)} placeholder="Enter IMEI number" className="h-9 text-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
                  </div>
                </div>
              </div>

              {/* Right: preview */}
              <div className="w-[370px] shrink-0 bg-background border border-border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-[#fafafa] px-4 py-4 border-b border-border shrink-0">
                  <span className="text-[14px] font-semibold text-foreground tracking-wide">DEVICE DETAILS</span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-6">
                  {[
                    { label: 'Label',         value: ndLabel  },
                    { label: 'Model',         value: ndModel  },
                    { label: 'Serial number', value: ndSerial, divider: true },
                    { label: 'IMEI',          value: ndImei   },
                  ].map((row, i) => (
                    <div key={row.label}>
                      {row.divider && <div className="h-px bg-border mb-6" />}
                      <div className="flex flex-col gap-3">
                        <p className="text-[14px] text-muted-foreground">{row.label}</p>
                        <p className="text-[16px] font-medium text-foreground">{row.value || <span className="text-muted-foreground">—</span>}</p>
                      </div>
                    </div>
                  ))}
                  <span className="inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] bg-secondary text-[12px] font-medium text-secondary-foreground w-fit">
                    Not registered
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-6 border-t border-border flex items-center justify-end gap-3">
              <Button variant="outline" className="h-9 px-4 text-[14px] shadow-[0px_1px_1px_rgba(0,0,0,0.1)]" onClick={() => setNewDeviceOpen(false)}>
                Cancel
              </Button>
              <Button
                className="h-9 px-4 text-[14px] bg-foreground text-background hover:bg-foreground/90 shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
                onClick={() => {
                  const name = ndLabel || ndSerial
                  if (name) {
                    handleAdd({ id: Date.now(), name, imei: ndImei || ndSerial })
                    setAddedToast(name)
                    setTimeout(() => setAddedToast(null), 4000)
                  }
                  setNdLabel(''); setNdModel(''); setNdSerial(''); setNdImei('')
                  setNewDeviceOpen(false)
                }}
              >
                Add to Database
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Added to Database toast */}
      {addedToast && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-start gap-3 bg-foreground text-background rounded-xl px-4 py-3.5 shadow-lg w-[340px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <circle cx="12" cy="12" r="9"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/>
          </svg>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold">Device added successfully</span>
            <span className="text-[13px] opacity-70">{addedToast} has been added to the database</span>
          </div>
        </div>
      )}
    </div>
  )
}
