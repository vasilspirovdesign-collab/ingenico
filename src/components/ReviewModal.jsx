import { X, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'

const PACKAGES = [
  { name: 'payment-kernel', version: '4.1.0' },
  { name: 'security-agent',  version: '3.3.4' },
  { name: 'receipt-driver',  version: '1.2.4' },
]

const APPLICATIONS = [
  { name: 'PayPoint POS',   desc: 'v6.2.1 Main payment app' },
  { name: 'Retail Manager', desc: 'v2.3.2 Inventory'        },
]

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-3">{children}</p>
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border last:border-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[14px] font-medium text-foreground">{children}</span>
    </div>
  )
}

export default function ReviewModal({ open, onClose, onConfirm, device, fleet, config }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-background rounded-2xl shadow-xl w-[980px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-[20px] font-semibold text-foreground">Register New Device</h2>
            <p className="text-[14px] text-muted-foreground mt-0.5">Add a Terminal to your organisation and assing it to a fleet.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-4 px-6 py-5 flex-1 overflow-y-auto">
          {/* DEVICE */}
          <div className="rounded-xl border border-border p-4">
            <SectionLabel>Device</SectionLabel>
            <Field label="Label">{device?.label || 'Checkout-12, Main Store'}</Field>
            <Field label="Model">{device?.model || 'Checkout-12, Main Store'}</Field>
            <Field label="Serial number">{device?.serial || 'SN-2094-0041'}</Field>
            <Field label="IMEI">{device?.imei || '354 882 11 123456 7'}</Field>
            <div className="pt-3">
              <span className="text-[12px] px-2.5 py-1 rounded-md border border-border text-muted-foreground">
                Not registered
              </span>
            </div>
          </div>

          {/* FLEET */}
          <div className="rounded-xl border border-border p-4">
            <SectionLabel>Fleet</SectionLabel>
            <Field label="Fleet name">{fleet?.name || 'Retail - Sofia City'}</Field>
            <Field label="Current size">{fleet?.size || '42 devices'}</Field>
            <div className="flex flex-col gap-1 py-3 border-b border-border">
              <span className="text-[12px] text-muted-foreground">Active config</span>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-foreground">{fleet?.activeConfig || 'v3.2.0'}</span>
                <span className="text-[12px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">Latest</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-3">
              <span className="text-[12px] text-muted-foreground">Fleet health</span>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-foreground rounded-full" style={{ width: '90%' }} />
              </div>
              <span className="text-[14px] font-medium text-foreground">38 / 42 online</span>
            </div>
          </div>

          {/* CONFIGURATION */}
          <div className="rounded-xl border border-border p-4">
            <SectionLabel>Configuration</SectionLabel>
            <Field label="Config name">{config?.name || 'Retail - Sofia Config'}</Field>
            <Field label="OS version">{config?.osVersion || 'INGCO 9.1.2 - Current'}</Field>

            <div className="pt-3">
              <p className="text-[12px] text-muted-foreground mb-2">Packages</p>
              <div className="flex flex-col gap-1.5 mb-4">
                {PACKAGES.map(pkg => (
                  <div key={pkg.name} className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-foreground">{pkg.name}</span>
                    <span className="text-[13px] text-muted-foreground">{pkg.version}</span>
                  </div>
                ))}
              </div>

              <p className="text-[12px] text-muted-foreground mb-2">Applications</p>
              <div className="flex flex-col gap-1.5">
                {APPLICATIONS.map(app => (
                  <div key={app.name} className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-foreground">{app.name}</span>
                    <span className="text-[13px] text-muted-foreground">{app.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning + actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 gap-4">
          <div className="flex items-start gap-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-foreground">Config includes an OS upgrade - device will rebote</span>
              <span className="text-[13px] text-muted-foreground">The terminal will be briefly unavailable (3min) after the configuration is applied</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" onClick={onClose} className="h-9 px-5 text-[14px] rounded-lg">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="h-9 px-5 text-[14px] rounded-lg bg-foreground text-background hover:bg-foreground/90">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
