import { UserCog, UserPlus, LogOut, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const USER = {
  name: 'Admin User',
  email: 'admin@ingenico.com',
  role: 'Fleet Administrator',
  initials: 'AU',
}

export default function ProfilePopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-[12px] font-semibold text-white hover:ring-2 hover:ring-border transition-all shrink-0 outline-none">
          {USER.initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[260px]">
        {/* Identity */}
        <DropdownMenuLabel className="flex flex-col items-center text-center gap-2 py-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-[20px] font-semibold text-white">
            {USER.initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">{USER.name}</p>
            <p className="text-[12px] font-normal text-muted-foreground">{USER.email}</p>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {USER.role}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <UserCog className="w-4 h-4" />
          Manage your Account
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <UserPlus className="w-4 h-4" />
          Add another account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-center gap-2 px-2 py-2">
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          <span className="text-muted-foreground text-[11px]">·</span>
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
