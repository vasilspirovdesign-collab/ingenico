import { useState, useRef, useEffect } from 'react'
import { Upload, ChevronDown, Plus, Trash2 } from 'lucide-react'
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
      {/* Left: two-row info */}
      <div className="flex-1 flex flex-col gap-[2px] min-w-0">
        {/* Row 1: icon + name */}
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-foreground shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-medium text-foreground">{device.name}</span>
        </div>
        {/* Row 2: spacer + IMEI + badge */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 shrink-0" />
          <div className="flex items-center gap-[10px]">
            <span className="text-[14px] font-light text-foreground whitespace-nowrap">{model} / IMEI {device.imei}</span>
            <span className="inline-flex items-center justify-center h-[22px] px-[10px] rounded-[10px] bg-secondary text-[12px] font-medium text-secondary-foreground whitespace-nowrap">
              Not registered
            </span>
          </div>
        </div>
      </div>
      {/* Right: action button */}
      {added ? (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.1)]"
          onClick={() => onRemove(device.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="h-9 gap-1.5 px-[10px] text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)] shrink-0"
          onClick={() => onAdd(device)}
        >
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      )}
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
  const [selectedConfig, setSelectedConfig] = useState(() => editingDevice?.config ?? 'Retail Basic Config')
  const [configSearch, setConfigSearch] = useState('')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const fileRef = useRef()
  const resultsRef = useRef()

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
      ).filter(d => !addedDevices.find(a => a.id === d.id))
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
            <div className="border border-border rounded-[10px] pl-6 pr-2 py-6 flex flex-col gap-6 shrink-0 w-[664px]">
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
                      added={false}
                    />
                  )) : (
                    <p className="text-[14px] text-muted-foreground text-center py-6">
                      {query ? 'No matching devices' : 'Search by name or serial number'}
                    </p>
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
                  {addedDevices.length === 0 ? 'No device added' : `${addedDevices.length} Added`}
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
                    <DeviceCard
                      key={device.id}
                      device={device}
                      model={model}
                      onRemove={handleRemove}
                      added={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* or bulk upload — centered short lines */}
          <div className="px-6 py-6 flex items-center gap-6 w-[664px]">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[14px] text-muted-foreground shrink-0">or upload file</span>
            <div className="flex-1 h-px bg-border" />
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
            return (
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
    </div>
  )
}
