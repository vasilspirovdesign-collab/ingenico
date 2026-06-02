import { useState, useRef, useEffect } from 'react'
import { Upload, CheckCircle2, ChevronDown, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import ReviewModal from '../components/ReviewModal'

const STEPS = ['Identify device', 'Assign to fleet', 'Apply configuration']
const MODELS = ['Lane 3000', 'Lane 5000', 'Lane 7000', 'Move 5000']

const CONFIGS = [
  { id: 1, name: 'Banking-Sofia-v4.2.0', active: false },
  { id: 2, name: 'Banking-Sofia-v4.1.3', active: false },
  { id: 3, name: 'Retail-Sofia-v3.1.3',  active: true  },
  { id: 4, name: 'Retail-Sofia-v3.1.0',  active: false },
]

const FLEETS = [
  { id: 1, name: 'Retail - Sofia City',  devices: 42, config: 'Config v3.1.0', status: 'Active' },
  { id: 2, name: 'Banking - Bulgaria',   devices: 6,  config: null,            status: null     },
  { id: 3, name: 'Staging',              devices: 6,  config: null,            status: null     },
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
                'w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 transition-colors',
                active ? 'bg-foreground text-background' : 'border border-border text-muted-foreground group-hover:border-foreground group-hover:text-foreground'
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
            {i < STEPS.length - 1 && <div className="w-24 h-px bg-border mx-4" />}
          </div>
        )
      })}
    </div>
  )
}

export default function RegisterDevicePage({ onCancel, onConfirm }) {
  const [step, setStep] = useState(1)
  const [serial, setSerial] = useState('')
  const [model, setModel] = useState('Lane 3000')
  const [dragging, setDragging] = useState(false)
  const [label, setLabel] = useState('')
  const [selectedFleet, setSelectedFleet] = useState(1)
  const [selectedConfig, setSelectedConfig] = useState('Retail Basic Config')
  const [configOpen, setConfigOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const fileRef = useRef()
  const configRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (configRef.current && !configRef.current.contains(e.target)) setConfigOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const deviceFound = serial.length > 0
  const deviceId = `${model} / IMEI 354 882 11 23456 7`

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-end gap-3 px-6 py-3 border-b border-border shrink-0">
        <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-foreground leading-tight">Register New Device</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Add a Terminal to your organisation and assing it to a fleet.</p>
        </div>

        <Stepper current={step} onStepClick={setStep} />

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="max-w-[644px]">
            <p className="text-[14px] font-medium text-foreground mb-3">Upload File</p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false) }}
              className={cn(
                'flex flex-col items-center justify-center h-[164px] rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                dragging ? 'border-foreground bg-muted/40' : 'border-border bg-background hover:bg-muted/30'
              )}
            >
              <input ref={fileRef} type="file" className="hidden" />
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-[14px] text-muted-foreground">Drag and drop files here, or click to select files</span>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[13px] text-muted-foreground shrink-0">or enter manually</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-foreground">Serial Number</label>
                <Input
                  placeholder="e.g SN-2094-XXXX"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="h-10 text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-foreground">Model</label>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-background text-[14px] text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {MODELS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {deviceFound && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium text-foreground">Device found</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">{deviceId}</span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Not registered</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="max-w-[644px]">
            {/* Device banner */}
            <div className="flex items-center px-4 h-11 rounded-lg border border-border bg-muted/30 mb-6">
              <span className="text-[14px] text-foreground">{deviceId}</span>
            </div>

            {/* Device label */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-[14px] font-medium text-foreground">Device label <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                placeholder="e.g Checkout-12, Main Store"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-10 text-[14px] max-w-[428px]"
              />
              <p className="text-[13px] text-muted-foreground">Visible to operators on the device list. Defaults to serial number.</p>
            </div>

            {/* Fleet picker */}
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
                    {/* Radio */}
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
        {step === 3 && (
          <div className="max-w-[644px]">
            <p className="text-[14px] font-medium text-foreground mb-3">Select Configuration</p>

            <div className="flex items-center gap-3 mb-6">
              {/* Custom dropdown */}
              <div ref={configRef} className="relative w-[370px]">
                <button
                  onClick={() => setConfigOpen(o => !o)}
                  className="flex items-center justify-between w-full h-10 px-3 rounded-md border border-input bg-background text-[14px] text-foreground hover:bg-muted/30 transition-colors"
                >
                  <span>{selectedConfig}</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', configOpen && 'rotate-180')} />
                </button>

                {configOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-border bg-background shadow-md z-10 overflow-hidden">
                    <div className="px-3 py-2 text-[12px] font-medium text-muted-foreground border-b border-border">
                      Configurations
                    </div>
                    {CONFIGS.map(cfg => (
                      <button
                        key={cfg.id}
                        onClick={() => { setSelectedConfig(cfg.name); setConfigOpen(false) }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-[14px] text-foreground hover:bg-muted/40 transition-colors text-left"
                      >
                        <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.active ? 'bg-foreground' : 'invisible')} />
                        {cfg.name}
                      </button>
                    ))}
                    <button className="w-full px-3 py-2.5 text-[14px] text-muted-foreground text-center border-t border-border hover:bg-muted/40 transition-colors">
                      See all
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[13px] text-muted-foreground shrink-0">or</span>

              <Button variant="outline" className="h-10 px-4 text-[14px] rounded-md gap-1.5 shrink-0">
                <Plus className="w-4 h-4" />
                Create New Configuration
              </Button>
            </div>

            {/* Config details — shown after selection */}
            {selectedConfig !== 'Retail Basic Config' && (
              <>
                {/* Config name + Target fleet */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-foreground">Configuration name</label>
                    <Input value={selectedConfig} readOnly className="h-10 text-[14px] bg-muted/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-foreground">Target Fleet</label>
                    <Input value="Retail - Sofia" readOnly className="h-10 text-[14px] bg-muted/30" />
                  </div>
                </div>

                {/* OS version */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-[14px] font-medium text-foreground">OS version</label>
                  <Input defaultValue="INGCO 9.1.2 - Current" className="h-10 text-[14px] max-w-[370px]" />
                  <p className="text-[13px] text-muted-foreground">Current fleet is on 9.1.2. Selecting newer version triggers staged rollout</p>
                </div>

                {/* System packages */}
                <div className="mb-6">
                  <p className="text-[14px] font-medium text-foreground mb-3">System packages</p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    {[
                      { name: 'payment-kernel', version: '4.1.0', type: 'Required' },
                      { name: 'security-agent',  version: '3.3.4', type: 'Required' },
                      { name: 'receipt-driver',  version: '1.2.4', type: 'Optional' },
                      { name: 'nfc-stack',       version: '3.0.2', type: 'Optional' },
                    ].map((pkg, i, arr) => (
                      <div key={pkg.name} className={cn('flex items-center gap-3 px-4 py-3', i < arr.length - 1 && 'border-b border-border')}>
                        <input type="checkbox" className="w-4 h-4 rounded shrink-0 accent-foreground" />
                        <span className="text-[14px] text-foreground flex-1">{pkg.name}</span>
                        <span className="text-[14px] text-muted-foreground w-16">{pkg.version}</span>
                        <span className={cn(
                          'text-[12px] px-3 py-1 rounded-full font-medium',
                          pkg.type === 'Required' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground border border-border'
                        )}>
                          {pkg.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application */}
                <div>
                  <p className="text-[14px] font-medium text-foreground mb-3">Application</p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    {[
                      { name: 'PayPoint POS',    desc: 'v6.2.1 Main payment app', type: 'Included' },
                      { name: 'Retail Manager',  desc: 'v2.3.2 Inventory',        type: 'Included' },
                    ].map((app, i, arr) => (
                      <div key={app.name} className={cn('flex items-center gap-3 px-4 py-3', i < arr.length - 1 && 'border-b border-border')}>
                        <input type="checkbox" className="w-4 h-4 rounded shrink-0 accent-foreground" />
                        <span className="text-[14px] text-foreground flex-1">{app.name}</span>
                        <span className="text-[14px] text-muted-foreground flex-1">{app.desc}</span>
                        <span className="text-[12px] px-3 py-1 rounded-full font-medium bg-foreground text-background">
                          {app.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>{/* end content */}

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
          {step === 3 ? 'Review & Register' : 'Continue'}
        </Button>
        </div>
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={onConfirm || onCancel}
        device={{ label: label || 'Checkout-12, Main Store', model, serial: serial || 'SN-2094-0041', imei: '354 882 11 123456 7' }}
        fleet={FLEETS.find(f => f.id === selectedFleet)}
        config={{ name: selectedConfig, osVersion: 'INGCO 9.1.2 - Current' }}
      />
    </div>
  )
}
