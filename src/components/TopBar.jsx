import NotificationPopover from './NotificationPopover'

export default function TopBar() {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-3 border-b border-border shrink-0">
      <NotificationPopover />
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
    </div>
  )
}
