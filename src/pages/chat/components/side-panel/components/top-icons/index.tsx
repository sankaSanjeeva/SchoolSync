import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import {
  ChevronIcon,
  DarkModeIcon,
  LightModeIcon,
  LogoutIcon,
  PencilIcon,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function TopIcons() {
  const [showLogOutConfirmation, setShowLogOutConfirmation] = useState(false)

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div className="p-5 flex justify-end gap-1">
      <Button variant="ghost" size="icon">
        <PencilIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem>
              Light
              <DropdownMenuShortcut>
                <LightModeIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Dark
              <DropdownMenuShortcut>
                <DarkModeIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
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

      <AlertDialog
        open={showLogOutConfirmation}
        onOpenChange={setShowLogOutConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              After signing out of this account, you will need to sign in again
              to access this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
