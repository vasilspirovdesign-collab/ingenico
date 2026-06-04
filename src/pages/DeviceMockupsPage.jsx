import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TopBar from '../components/TopBar'
import logo from '../assets/logo.svg'

const STATES = ['Payment Screen', 'Update Available', 'Downloading', 'Review Update', 'Complete']

function StatePayment() {
  return (
    <div className="flex flex-col h-full">
      {/* Alert banner */}
      <div className="mx-[21px] mt-[28px] bg-background border border-border rounded-[10px] px-4 py-3">
        <div className="flex items-center gap-3 mb-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 7v5"/>
            <path d="M12 16v.5"/>
          </svg>
          <span className="text-[14px] font-medium text-foreground">Update available</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 shrink-0" />
          <span className="text-[14px] font-light text-foreground leading-5">Downloading in background won't interrupt payments</span>
        </div>
      </div>

      {/* Center: icon + amount */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0">
        <div className="w-[104px] h-[104px] rounded-full bg-[#f0f0f0] flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-foreground">
            <rect x="5" y="10" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M5 16h30" stroke="currentColor" strokeWidth="1.75"/>
            <rect x="9" y="21" width="8" height="3" rx="1" fill="currentColor"/>
          </svg>
        </div>
        <p className="text-[48px] font-semibold text-foreground leading-none">$49.39</p>
      </div>

      {/* Buttons */}
      <div className="shrink-0 px-[27px] pb-[121px] flex flex-col gap-2">
        <button className="w-full h-12 bg-foreground text-background text-[14px] font-medium rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
          Tap to pay
        </button>
        <button className="w-full h-12 bg-background text-foreground text-[14px] font-medium rounded-md border border-border">
          Insert card
        </button>
      </div>
    </div>
  )
}

function StateAvailable({ onDownload }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-0">
        <div className="w-[104px] h-[104px] rounded-full bg-[#f0f0f0] flex items-center justify-center mb-7">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
            <path d="M12 12v9"/><path d="m8 17 4 4 4-4"/>
          </svg>
        </div>
        <h2 className="text-[24px] font-semibold text-foreground text-center mb-2">Update available</h2>
        <p className="text-[24px] text-foreground text-center mb-10">Config Sofia-Retail-v3.2.0</p>
        <div className="w-[345px] flex flex-col gap-3">
          <div className="flex items-center justify-between text-[14px] text-muted-foreground">
            <span>Current version</span><span>Sofia-Retail-v3.1.0</span>
          </div>
          <div className="flex items-center justify-between text-[14px] text-muted-foreground">
            <span>New version</span><span className="text-foreground font-medium">Sofia-Retail-v3.2.0</span>
          </div>
          <div className="flex items-center justify-between text-[14px] text-muted-foreground">
            <span>Size</span><span>24.8 MB</span>
          </div>
        </div>
        <button onClick={onDownload} className="mt-8 w-[345px] h-11 bg-foreground text-background text-[15px] font-medium rounded-lg">
          Download
        </button>
      </div>
      <div className="shrink-0 px-6 pb-8">
        <div className="flex items-center gap-3 border border-border rounded-[10px] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span className="text-[14px] font-medium text-foreground">Device continue to operate during download</span>
        </div>
      </div>
    </div>
  )
}

function StateDownloading({ progress }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-0">
        <div className="w-[104px] h-[104px] rounded-full bg-[#f0f0f0] flex items-center justify-center mb-7">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
            <path d="M12 12v9"/><path d="m8 17 4 4 4-4"/>
          </svg>
        </div>
        <h2 className="text-[24px] font-semibold text-foreground text-center mb-2">Update available</h2>
        <p className="text-[24px] text-foreground text-center mb-10">Config Sofia-Retail-v3.2.0</p>
        <div className="w-[345px] flex flex-col gap-2">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(23,23,23,0.2)' }}>
            <div className="h-full rounded-full bg-foreground transition-none" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-[16px] text-foreground">
            <span>{progress < 100 ? 'Downloading..' : 'Complete'}</span>
            <span>{progress}%</span>
          </div>
        </div>
        <p className="text-[16px] text-foreground mt-4">
          {progress < 100 ? `${Math.round((100 - progress) * 0.45)} sec remaining` : 'Done!'}
        </p>
      </div>
      <div className="shrink-0 px-6 pb-8">
        <div className="flex items-center gap-3 border border-border rounded-[10px] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span className="text-[14px] font-medium text-foreground">Device continue to operate during download</span>
        </div>
      </div>
    </div>
  )
}

const PACKAGES = [
  { name: 'payment-kernel', version: '4.1.0', badge: 'Required' },
  { name: 'security-agent',  version: '3.3.4', badge: 'Required' },
  { name: 'receipt-driver',  version: '1.2.4', badge: 'Optional' },
  { name: 'nfc-stack',       version: '3.0.2', badge: 'Optional' },
]
const APPS = [
  { name: 'PayPoint POS',   detail: 'v6.2.1 Main payment app', badge: 'Included' },
  { name: 'Retail Manager', detail: 'v2.3.2 Inventory',        badge: 'Included' },
]

function ReviewBadge({ type }) {
  const dark = type === 'Required' || type === 'Included'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${dark ? 'bg-foreground text-background' : 'bg-secondary text-secondary-foreground'}`}>
      {type}
    </span>
  )
}

function StateReview({ onInstall }) {
  const [installing, setInstalling] = useState(false)

  const handleInstall = () => {
    setInstalling(true)
    setTimeout(() => {
      setInstalling(false)
      onInstall()
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Titles */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-[24px] font-semibold text-foreground mb-2">Review update</h2>
          <p className="text-[24px] text-foreground leading-snug">Config Sofia-Retail-v3.2.0<br />is ready</p>
          <p className="text-[16px] text-foreground mt-6">Changes from current version:</p>
        </div>

        {/* Packages table */}
        <div className="mx-6 rounded-md border border-border overflow-hidden mb-3">
          {PACKAGES.map((p, i) => (
            <div key={p.name} className={`flex items-center h-[49px] px-2 gap-1 ${i < PACKAGES.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="text-[14px] text-foreground w-[110px] shrink-0">{p.name}</span>
              <span className="text-[14px] text-foreground flex-1">{p.version}</span>
              <ReviewBadge type={p.badge} />
            </div>
          ))}
        </div>

        {/* Apps table — no checkboxes */}
        <div className="mx-6 rounded-md border border-border overflow-hidden mb-4">
          {APPS.map((a, i) => (
            <div key={a.name} className={`flex items-center h-[49px] px-2 gap-2 ${i < APPS.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="text-[14px] text-foreground shrink-0">{a.name}</span>
              <span className="text-[14px] text-foreground flex-1 truncate">{a.detail}</span>
              <ReviewBadge type={a.badge} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-aligned: info + buttons */}
      <div className="shrink-0 px-6 pb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 border border-border rounded-[10px] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span className="text-[14px] font-medium text-foreground">Device will reboot after install</span>
        </div>
        <button
          onClick={handleInstall}
          className="w-full h-14 bg-background border border-border rounded-md text-[14px] font-medium text-foreground shadow-[0px_1px_1px_rgba(0,0,0,0.1)] hover:bg-muted/50 transition-colors"
        >
          Install now
        </button>
        <button className="w-full h-14 bg-background border border-border rounded-md text-[14px] font-medium text-foreground shadow-[0px_1px_1px_rgba(0,0,0,0.1)] hover:bg-muted/50 transition-colors">
          Postpone until Idle
        </button>
      </div>

      {/* Installing overlay */}
      {installing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-6 py-4 shadow-md">
            <svg className="w-5 h-5 text-muted-foreground animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-[16px] font-medium text-foreground">Installing..</span>
          </div>
        </div>
      )}
    </div>
  )
}

function StateComplete() {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 flex flex-col items-center pt-10 px-6 gap-0">
        {/* Check icon */}
        <div className="w-[104px] h-[104px] rounded-full bg-[#f0f0f0] flex items-center justify-center mb-7">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        {/* "Update complete" */}
        <h2 className="text-[24px] font-semibold text-foreground text-center mb-2">Update complete</h2>

        {/* "Config Sofia-Retail-v3.2.0" */}
        <p className="text-[24px] text-foreground text-center mb-8">Config Sofia-Retail-v3.2.0</p>

        {/* Configuration card */}
        <div className="w-full bg-white border border-border rounded-[14px] overflow-hidden">
          <div className="bg-[#fafafa] px-4 py-4 border-b border-border">
            <span className="text-[13px] font-semibold text-foreground tracking-wide uppercase">Configuration</span>
          </div>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-muted-foreground">Config name</p>
              <p className="text-[16px] font-medium text-foreground">Retail - Sofia Config</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-muted-foreground">OS version</p>
              <p className="text-[16px] font-medium text-foreground">INGCO 9.1.2 - Current</p>
            </div>
            <div className="h-px bg-border" />
            <p className="text-[14px] font-medium text-foreground text-center">See more</p>
          </div>
        </div>
      </div>

      {/* Back to payments — bottom aligned */}
      <div className="shrink-0 px-6 pb-6">
        <button className="w-full h-14 bg-background border border-border rounded-md text-[14px] font-medium text-foreground shadow-[0px_1px_1px_rgba(0,0,0,0.1)] hover:bg-muted/50 transition-colors">
          Back to payments
        </button>
      </div>
    </div>
  )
}

export default function DeviceMockupsPage() {
  const [stateIndex, setStateIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (stateIndex !== 2) return
    setProgress(0)
    const start = Date.now()
    const duration = 4000

    const tick = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 1 ? t * (2 - t) : 1
      const val = Math.round(100 * eased)
      setProgress(val)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setStateIndex(3), 600)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stateIndex])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/30">
      <TopBar />

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start py-10 gap-6">
        {/* 412px device frame */}
        <div
          className="relative bg-white border border-border rounded-[4px] shadow-sm overflow-hidden"
          style={{ width: 412, height: 917 }}
        >
          {/* Device header */}
          <div className="flex items-center gap-2 h-[49px] px-3 border-b border-border shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#0a0a0a" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" fill="#0a0a0a" opacity="0.15"/>
            </svg>
            <span className="text-[16px] font-semibold text-foreground">Ingenico 360</span>
          </div>

          {/* Screen content */}
          <div style={{ height: 868 }}>
            {stateIndex === 0 && <StatePayment />}
            {stateIndex === 1 && <StateAvailable onDownload={() => setStateIndex(2)} />}
            {stateIndex === 2 && <StateDownloading progress={progress} />}
            {stateIndex === 3 && <StateReview onInstall={() => setStateIndex(4)} />}
            {stateIndex === 4 && <StateComplete />}
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStateIndex(i => Math.max(0, i - 1))}
            disabled={stateIndex === 0}
            className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-background text-[14px] font-medium text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="flex items-center gap-2">
            {STATES.map((s, i) => (
              <button
                key={s}
                onClick={() => setStateIndex(i)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] transition-colors border ${
                  i === stateIndex
                    ? 'bg-foreground text-background border-foreground font-medium'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStateIndex(i => Math.min(STATES.length - 1, i + 1))}
            disabled={stateIndex === STATES.length - 1}
            className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-background text-[14px] font-medium text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
