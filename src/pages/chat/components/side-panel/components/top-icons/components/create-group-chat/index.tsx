import { useCallback, useMemo, useState } from 'react'
import { DialogProps } from '@radix-ui/react-alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useChat, useUser } from '@/contexts'
import { auth } from '@/firebase'
import { ChatType } from '@/enums'
import { Chat } from '@/types'
import ChatItem from '../../../chat-item'

export default function CreteGroupChat(props: DialogProps) {
  const { onOpenChange } = props

  const [participants, setParticipants] = useState<string[]>([])

  const { users } = useUser()
  const { setChat } = useChat()

  const handleSelectUser = useCallback((chat: Partial<Chat> | undefined) => {
    setParticipants((prev) => {
      if (prev.includes(chat?.participants?.[0] ?? '')) {
        return prev.filter((p) => p !== chat?.participants?.[0])
      }
      return [...prev, chat?.participants?.[0] ?? '']
    })
  }, [])

  const userList = useMemo(
    () =>
      users
        ?.filter((user) => user.uid !== auth.currentUser?.uid)
        ?.map((user) => (
          <ChatItem
            key={user.uid}
            chat={{ participants: [user.uid] }}
            onClick={handleSelectUser}
            className={
              participants.includes(user.uid) ? 'opacity-100' : 'opacity-50'
            }
          />
        )),
    [handleSelectUser, participants, users]
  )

  const startChat = () => {
    setChat({
      participants,
      type: ChatType.GROUP,
    })
    onOpenChange?.(false)
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new group chat</DialogTitle>
          <DialogDescription>
            Select the people you want to chat with
          </DialogDescription>
        </DialogHeader>

        <div>{userList}</div>

        <DialogFooter>
          <Button onClick={startChat}>Start</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
