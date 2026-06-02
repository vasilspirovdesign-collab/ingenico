import { UserCog, UserPlus, LogOut } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
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
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-[12px] font-semibold text-white hover:ring-2 hover:ring-border transition-all shrink-0 outline-none">
          {USER.initials}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[260px] p-0">
        {/* Identity */}
        <div className="flex flex-col items-center text-center gap-2 px-4 py-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-[20px] font-semibold text-white">
            {USER.initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">{USER.name}</p>
            <p className="text-[12px] text-muted-foreground">{USER.email}</p>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {USER.role}
          </span>
        </div>

        <Separator />

        <div className="p-1">
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-3 text-[13px]">
            <UserCog className="w-4 h-4" />
            Manage your Account
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-3 text-[13px]">
            <UserPlus className="w-4 h-4" />
            Add another account
          </Button>
        </div>

        <Separator />

        <div className="p-1">
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-3 text-[13px] text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-center gap-2 py-3">
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          <span className="text-[11px] text-muted-foreground">·</span>
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
