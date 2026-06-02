import { UserCog, UserPlus, LogOut } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'

const USER = {
  name: 'Admin User',
  email: 'admin@ingenico.com',
  role: 'Fleet Administrator',
  initials: 'AU',
}

export default function ProfilePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center text-[12px] font-semibold text-white hover:ring-2 hover:ring-border transition-all shrink-0">
          {USER.initials}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[300px] p-0 rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center px-6 pt-6 pb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-[22px] font-semibold text-white mb-3">
            {USER.initials}
          </div>
          <p className="text-[16px] font-semibold text-foreground">{USER.name}</p>
          <p className="text-[13px] text-muted-foreground">{USER.email}</p>
          <span className="mt-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {USER.role}
          </span>
        </div>

        <Separator />

        {/* Actions */}
        <div className="px-2 py-2 flex flex-col gap-0.5">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] text-foreground hover:bg-muted transition-colors text-left">
            <UserCog className="w-4 h-4 text-muted-foreground shrink-0" />
            Manage your Account
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] text-foreground hover:bg-muted transition-colors text-left">
            <UserPlus className="w-4 h-4 text-muted-foreground shrink-0" />
            Add another account
          </button>
        </div>

        <Separator />

        <div className="px-2 py-2">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] text-foreground hover:bg-muted transition-colors text-left">
            <LogOut className="w-4 h-4 text-muted-foreground shrink-0" />
            Sign out
          </button>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 px-4 py-3">
          <button className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          <span className="text-muted-foreground text-[12px]">·</span>
          <button className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
