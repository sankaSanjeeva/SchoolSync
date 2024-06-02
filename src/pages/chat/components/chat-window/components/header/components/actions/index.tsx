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
import { AddMembers, DeleteChat, LeaveGroup } from './components'

export default function Actions() {
  const [showAddMember, setShowAddMember] = useState(false)
  const [showLeaveAlert, setShowLeaveAlert] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const { chat } = useChat()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={!chat?.id && chat?.type === 'private'}
          >
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
              className="text-red-500 focus:!text-red-500"
              onClick={() => setShowDeleteAlert(true)}
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

      <DeleteChat open={showDeleteAlert} onOpenChange={setShowDeleteAlert} />
    </>
  )
}
