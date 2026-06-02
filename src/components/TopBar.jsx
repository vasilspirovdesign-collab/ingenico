import NotificationPopover from './NotificationPopover'
import ProfilePopover from './ProfilePopover'

export default function TopBar() {
  return (
    <div className="flex items-center justify-end gap-3 px-6 h-[49px] border-b border-border shrink-0">
      <NotificationPopover />
      <ProfilePopover />
    </div>
  )
}
