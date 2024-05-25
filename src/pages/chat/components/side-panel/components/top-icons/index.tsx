import { useState } from 'react'
import {
  ChevronIcon,
  DarkModeIcon,
  GroupIcon,
  LightModeIcon,
  LogoutIcon,
  PenIcon,
  PersonIcon,
  SystemModeIcon,
} from '@/assets/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts'
import { CreteGroupChat, CretePrivateChat, SignOutAlert } from './components'

export default function TopIcons() {
  const [showCreatePrivateChat, setShowCreatePrivateChat] = useState(false)
  const [showCreateGroupChat, setShowCreateGroupChat] = useState(false)
  const [showLogOutConfirmation, setShowLogOutConfirmation] = useState(false)

  const { setTheme } = useTheme()

  return (
    <div className="p-5 flex justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <PenIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>New Chat</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowCreatePrivateChat(true)}>
            Private
            <DropdownMenuShortcut>
              <PersonIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCreateGroupChat(true)}>
            Group
            <DropdownMenuShortcut>
              <GroupIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
              <DropdownMenuShortcut>
                <LightModeIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
              <DropdownMenuShortcut>
                <DarkModeIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
              <DropdownMenuShortcut>
                <SystemModeIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setShowLogOutConfirmation(true)
            }}
          >
            Log out
            <DropdownMenuShortcut>
              <LogoutIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showCreatePrivateChat && (
        <CretePrivateChat
          open={showCreatePrivateChat}
          onOpenChange={setShowCreatePrivateChat}
        />
      )}

      {showCreateGroupChat && (
        <CreteGroupChat
          open={showCreateGroupChat}
          onOpenChange={setShowCreateGroupChat}
        />
      )}

      {showLogOutConfirmation && (
        <SignOutAlert
          open={showLogOutConfirmation}
          onOpenChange={setShowLogOutConfirmation}
        />
      )}
    </div>
  )
}
