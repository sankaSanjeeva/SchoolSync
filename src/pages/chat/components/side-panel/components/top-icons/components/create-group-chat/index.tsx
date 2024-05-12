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
import { Chat } from '@/types'
import ChatItem from '../../../chat-item'
import { Input } from '@/components/ui/input'

export default function CreteGroupChat(props: DialogProps) {
  const { onOpenChange } = props

  const [participants, setParticipants] = useState<string[]>([])
  const [name, setName] = useState('')

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

  const disableStart = useMemo(
    () => participants.length < 1 || !name,
    [name, participants.length]
  )

  const startChat = () => {
    setChat({ participants, type: 'group', name })
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

        <Input
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>{userList}</div>

        <DialogFooter>
          <Button disabled={disableStart} onClick={startChat}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
