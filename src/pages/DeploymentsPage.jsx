import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

const STATS = [
  { value: '24', label: 'Total this week' },
  { value: '2',  label: 'Live now'        },
  { value: '19', label: 'Completed'       },
  { value: '2',  label: 'Failed'          },
  { value: '1',  label: 'Scheduled'       },
]

const LIVE = [
  {
    name: 'Hospitality-Central-v2.10.0',
    status: 'live',
    devices: '18 devices', started: 'Started 13:55', left: '4min left',
    detail: '11 done   4 installing   3 queued',
    progress: 61, count: '11 / 18',
  },
  {
    name: 'Sofia-Retail-v3.2.0',
    status: 'live',
    devices: '42 devices', started: 'Started 14:02', left: '2min left',
    detail: '38 done   2 installing   2 queued',
    progress: 90, count: '38 / 42',
  },
]

const RECENT = [
  {
    name: 'Hospitality-Central-v2.10.0',
    status: 'completed',
    devices: '18 devices', started: 'Started 13:55', left: '4min left',
    detail: '11 done   4 installing   3 queued',
    progress: 61, count: '11 / 18',
  },
  {
    name: 'Trakia-Fuel-v1.3.0',
    status: 'failed',
    devices: '25 devices', started: 'Yesterday, 22:24', left: null,
    detail: '22 done   3 failed',
    progress: 88, count: null, countFailed: '3 failed',
  },
  {
    name: 'Pharmacy-Burgas',
    status: 'completed',
    devices: '8 devices', started: 'Yesterday, 09:08', left: null,
    detail: '8 updated',
    progress: 100, count: '8 / 8',
    badgeTop: true,
  },
]

const ACTIVITY = [
  {
    color: 'bg-blue-500',
    title: 'Sofia-Retail-v3.2.0 - 38/42 done',
    sub: 'Retail - Sofia Central in progress',
    time: '2 min ago',
  },
  {
    color: 'bg-green-500',
    title: 'Plovdiv-Retail-v3.2.0  complete',
    sub: '28 / 28 devices updated',
    time: 'Today, 11:24',
  },
  {
    color: 'bg-red-500',
    title: 'Trakia-Fuel-v1.3.0 - 3 installs',
    sub: 'Rollback triggered',
    time: 'Yesterday, 22:24',
  },
  {
    color: 'bg-muted-foreground/30',
    title: 'Sofia-Retail-v3.2.0 - 38/42 done',
    sub: 'Retail - Sofia Central in progress',
    time: '2 min ago',
  },
]

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 h-[22px] px-1.5 rounded-md border border-border bg-background text-[12px] font-medium text-muted-foreground shrink-0">
        <svg className="w-3 h-3 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Live
      </span>
    )
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 h-[22px] px-1.5 rounded-md border border-border bg-background text-[12px] font-medium text-muted-foreground shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
        </svg>
        Completed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 h-[22px] px-1.5 rounded-md border border-border bg-background text-[12px] font-medium text-muted-foreground shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.29 3.86-8.66 15A1 1 0 0 0 2.5 20.5h18a1 1 0 0 0 .87-1.5l-8.66-15a1 1 0 0 0-1.73 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
      </svg>
      Failed
    </span>
  )
}

function ProgressBar({ progress }) {
  return (
    <div className="h-2 rounded-full overflow-hidden flex-1" style={{ background: 'rgba(23,23,23,0.15)' }}>
      <div className="h-full rounded-full bg-foreground" style={{ width: `${progress}%` }} />
    </div>
  )
}

function DeploymentRow({ item, isLast }) {
  return (
    <div className={`flex gap-3 items-start p-3 ${!isLast ? 'border-b border-border' : ''}`}>
      {/* Left: info */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-medium text-foreground truncate">{item.name}</span>
          {!item.badgeTop && <StatusBadge status={item.status} />}
        </div>
        <div className="flex items-center gap-2 text-[16px] font-medium text-foreground flex-wrap">
          <span>{item.devices}</span>
          <span>{item.started}</span>
          {item.left && <span>{item.left}</span>}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-foreground flex-wrap">
          {item.detail.split('   ').map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      {/* Right: badge (top) + progress */}
      <div className="flex flex-col items-end gap-3 shrink-0 w-[287px] self-stretch">
        {item.badgeTop && (
          <div className="shrink-0">
            <StatusBadge status={item.status} />
          </div>
        )}
        <div className="flex items-end gap-3 w-full flex-1">
          <ProgressBar progress={item.progress} />
          {item.countFailed ? (
            <span className="text-[14px] text-destructive shrink-0">{item.countFailed}</span>
          ) : item.count ? (
            <span className="text-[14px] text-muted-foreground shrink-0">{item.count}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function TableSection({ title, rows }) {
  return (
    <div className="bg-background border border-border rounded-md overflow-hidden">
      <div className="bg-muted border-b border-border h-10 flex items-center px-2">
        <span className="text-[14px] font-medium text-foreground">{title}</span>
      </div>
      {rows.map((row, i) => (
        <DeploymentRow key={row.name + i} item={row} isLast={i === rows.length - 1} />
      ))}
    </div>
  )
}

export default function DeploymentsPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-foreground leading-tight">Deployments</h1>
            <p className="text-[16px] text-muted-foreground mt-1">Live and recent configuration pushes across all fleets</p>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 px-4 text-[14px] font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.1)]">
            New Deployment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6">
          {STATS.map((s) => (
            <Card key={s.label} className="p-6 rounded-xl border border-border shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
              <p className="text-[24px] font-semibold text-foreground leading-8 mb-1.5">{s.value}</p>
              <p className="text-[14px] text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Two-column body */}
        <div className="flex gap-6 items-start">
          {/* Left: deployment tables */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <TableSection title="LIVE DEPLOYMENTS" rows={LIVE} />
            <TableSection title="RECENT DEPLOYMENTS" rows={RECENT} />
          </div>

          {/* Right: activity feed */}
          <div className="shrink-0 w-[340px] bg-background border border-border rounded-md overflow-hidden">
            <div className="bg-muted border-b border-border h-10 flex items-center px-2">
              <span className="text-[14px] font-medium text-foreground">ACTIVITY</span>
            </div>
            {ACTIVITY.map((item, i) => (
              <div key={i} className={`flex gap-3 items-start p-3 ${i < ACTIVITY.length - 1 ? 'border-b border-border' : ''}`}>
                <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${item.color}`} />
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] font-medium text-foreground leading-6">{item.title}</p>
                  <p className="text-[14px] text-foreground">{item.sub}</p>
                  <p className="text-[14px] text-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
