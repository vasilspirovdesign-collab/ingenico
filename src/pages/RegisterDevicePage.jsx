import { useState, useRef, useEffect } from 'react'
import { Upload, ChevronDown, Plus, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import ReviewModal from '../components/ReviewModal'
import { DEVICES } from '../data/devices'

const STEPS = ['Identify device', 'Assign to fleet', 'Apply configuration']
const MODELS = ['Lane 3000', 'Lane 5000', 'Lane 7000', 'Move 5000']

const CONFIGS = [
  { id: 1, name: 'Sofia-Retail-v3.2.0',      category: 'RETAIL',      badge: 'Active'  },
  { id: 2, name: 'Sofia-Retail-v3.1.0',      category: 'RETAIL',      badge: null      },
  { id: 3, name: 'Plovdiv-Retail-v3.2.0',    category: 'RETAIL',      badge: null      },
  { id: 4, name: 'Trakia-Fuel-v1.3.0',       category: 'FUEL',        badge: 'Latest'  },
  { id: 5, name: 'Trakia-Fuel-v1.2.2',       category: 'FUEL',        badge: null      },
  { id: 6, name: 'PCI-Compliant-v4.1.0',     category: 'HOSPITALITY', badge: null      },
  { id: 7, name: 'Bulgaria-Base-v1.0.0',     category: 'BASE',        badge: null      },
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
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const num = i + 1
        const active = num === current
        return (
          <div key={step} className="flex items-center">
            <button
              onClick={() => onStepClick?.(num)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center text-[13px] font-semibold shrink-0 transition-colors',
                active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground group-hover:bg-foreground/10'
              )}>
                {num}
              </div>
              <span className={cn(
                'text-[14px] whitespace-nowrap transition-colors',
                active ? 'font-medium text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {step}
              </span>
            </button>
            {i < STEPS.length - 1 && <div className="w-14 h-px bg-border mx-4" />}
          </div>
        )
      })}
    </div>
  )
}

function DeviceCard({ device, model, onAdd, onRemove, added }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border bg-background w-[664px]">
      <div className="flex items-center gap-3 min-w-0">
        <svg className="w-4 h-4 text-muted-foreground shrink-0" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14px] font-medium text-foreground">{device.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted-foreground">{model} / IMEI {device.imei}</span>
            <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">Not registered</span>
          </div>
        </div>
      </div>
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
          className="h-9 gap-1.5 px-3 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)] shrink-0"
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
  const [selectedConfig, setSelectedConfig] = useState(() => editingDevice?.config ?? null)
  const [configSearch, setConfigSearch] = useState('')
  const [reviewOpen, setReviewOpen] = useState(false)
  const fileRef = useRef()

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
  const deviceId = firstDevice
    ? `${model} / IMEI ${firstDevice.imei}`
    : `${model} / IMEI 354 882 11 23456 7`

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      {/* Header + stepper — always pinned */}
      <div className="px-6 pt-6 shrink-0">
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-foreground leading-tight">
            {editingDevice ? <>Edit &quot;{editingDevice.name}&quot; Details</> : 'Register New Device'}
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1">Add a Terminal to your organisation and assing it to a fleet.</p>
        </div>
        <Stepper current={step} onStepClick={setStep} />
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-2 pb-4">

            {/* Upload — fixed height, fixed 664px wide */}
            <p className="text-[14px] font-medium text-foreground mb-3">Upload File</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false) }}
              className={cn(
                'flex flex-col items-center justify-center h-[280px] w-[664px] rounded-xl border border-dashed cursor-pointer transition-colors',
                dragging ? 'border-foreground bg-muted/40' : 'border-border bg-background hover:bg-muted/30'
              )}
            >
              <input ref={fileRef} type="file" className="hidden" />
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-[14px] text-muted-foreground">Drag and drop files here, or click to select files</span>
            </div>
          </div>

          {/* "or enter manually" — centered, short lines */}
          <div className="flex items-center justify-center gap-6 px-6 pb-4">
            <div className="w-14 h-px bg-border" />
            <span className="text-[13px] text-muted-foreground shrink-0">or enter manually</span>
            <div className="w-14 h-px bg-border" />
          </div>

          {/* Form — left-aligned, natural width */}
          <div className="px-6 pb-6">
            {/* Serial + Model row */}
            <div className="flex items-end gap-6 mb-4">
              <div className="flex flex-col gap-3 w-[320px]">
                <label className="text-[14px] font-medium text-foreground">Serial Number</label>
                <Input
                  placeholder="e.g SN-2094-XXXX"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9 text-[14px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                />
              </div>
              <div className="flex flex-col gap-3 w-[320px]">
                <label className="text-[14px] font-medium text-foreground">Model</label>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-background text-[14px] text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)]"
                  >
                    {MODELS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search results */}
            {results.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {results.map(device => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    model={model}
                    onAdd={handleAdd}
                    added={false}
                  />
                ))}
              </div>
            )}

            {/* Added section */}
            {addedDevices.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Added</p>
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
      )}

      {/* ── Steps 2 & 3 — scrollable */}
      {(step === 2 || step === 3) && (
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="max-w-[644px]">
              <div className="flex flex-col gap-2 mb-6">
                {addedDevices.length > 0 ? addedDevices.map(device => (
                  <div key={device.id} className="flex items-center px-4 h-11 rounded-lg border border-border bg-muted/30">
                    <span className="text-[14px] font-medium text-foreground">{device.name}</span>
                    <span className="text-[14px] text-muted-foreground ml-1.5">/ {model} / IMEI {device.imei}</span>
                  </div>
                )) : (
                  <div className="flex items-center px-4 h-11 rounded-lg border border-border bg-muted/30">
                    <span className="text-[14px] text-foreground">{deviceId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-foreground">Assing to fleet</p>
                <p className="text-[13px] text-muted-foreground mb-2">Select a fleet - the device will inherit its active configuration.</p>
                {FLEETS.map((fleet) => {
                  const isSelected = selectedFleet === fleet.id
                  return (
                    <button
                      key={fleet.id}
                      onClick={() => setSelectedFleet(fleet.id)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border text-left w-full transition-colors',
                        isSelected ? 'border-foreground bg-background' : 'border-border bg-background hover:bg-muted/30'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                        isSelected ? 'border-foreground' : 'border-muted-foreground'
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-foreground" />}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-[14px] font-medium text-foreground">{fleet.name}</span>
                        <span className="text-[13px] text-muted-foreground">
                          {fleet.devices} devices
                          {fleet.config ? ` • ${fleet.config} • ${fleet.status}` : ' • No config assigned'}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[12px] px-2.5 py-1 rounded-md border border-border text-foreground font-medium shrink-0">
                          Selected
                        </span>
                      )}
                      {!isSelected && !fleet.config && (
                        <span className="text-[12px] px-2.5 py-1 rounded-md border border-border text-muted-foreground shrink-0">
                          No config
                        </span>
                      )}
                    </button>
                  )
                })}
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
                <div className="bg-[#fafafa] px-4 py-4 border-b border-border">
                  <span className="text-[14px] font-semibold text-foreground">Select Configuration</span>
                </div>
                <div className="p-4 flex flex-col gap-6">
                  {/* Search */}
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

                  {/* Grouped list + scrollbar */}
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
                                    selectedConfig === cfg.name ? 'bg-background text-foreground' : 'bg-foreground text-background'
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

                  {/* Create new */}
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
            className="h-9 px-5 text-[14px] rounded-lg bg-foreground text-background hover:bg-foreground/90"
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
