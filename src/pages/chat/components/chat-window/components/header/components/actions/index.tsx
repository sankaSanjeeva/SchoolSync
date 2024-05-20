import { useState } from 'react'
import { MoreIcon, PersonIcon, TrashIcon, TravelerIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChat } from '@/contexts'
import { AddMembers, LeaveGroup } from './components'

export default function Actions() {
  const [showAddMember, setShowAddMember] = useState(false)
  const [showLeaveAlert, setShowLeaveAlert] = useState(false)

  const { chat } = useChat()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          {chat?.type === 'group' && (
            <DropdownMenuItem onClick={() => setShowAddMember(true)}>
              Add Members
              <DropdownMenuShortcut>
                <PersonIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {chat?.id && (
            <DropdownMenuItem
              disabled
              className="text-red-500 focus:!text-red-500"
            >
              Delete Chat
              <DropdownMenuShortcut>
                <TrashIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {chat?.id && chat?.type === 'group' && (
            <DropdownMenuItem
              className="text-red-500 focus:!text-red-500"
              onClick={() => setShowLeaveAlert(true)}
            >
              Leave Group
              <DropdownMenuShortcut>
                <TravelerIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showAddMember && (
        <AddMembers open={showAddMember} onOpenChange={setShowAddMember} />
      )}

      <LeaveGroup open={showLeaveAlert} onOpenChange={setShowLeaveAlert} />
    </>
  )
}
