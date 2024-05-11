import { useCallback, useMemo } from 'react'
import { DialogProps } from '@radix-ui/react-alert-dialog'
import { useChat, useUser } from '@/contexts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { auth } from '@/firebase'
import { Chat } from '@/types'
import ChatItem from '../../../chat-item'

export default function CretePrivateChat(props: DialogProps) {
  const { onOpenChange } = props

  const { users } = useUser()
  const { chats, setChat } = useChat()

  const onSelectUser = useCallback(
    (newChat: Partial<Chat> | undefined) => {
      const existingChat = chats?.find(
        (chat) =>
          chat.participants.includes(newChat?.participants?.[0] ?? '') &&
          chat.participants.includes(auth.currentUser?.uid ?? '')
      )
      setChat(existingChat ?? newChat)
      onOpenChange?.(false)
    },
    [chats, onOpenChange, setChat]
  )

  const userList = useMemo(
    () =>
      users
        ?.filter((user) => user.uid !== auth.currentUser?.uid)
        ?.map((user) => (
          <ChatItem
            key={user.uid}
            chat={{ participants: [user.uid], type: 'private' }}
            onClick={onSelectUser}
          />
        )),
    [onSelectUser, users]
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new private chat</DialogTitle>
          <DialogDescription>
            Select the person you want to chat with
          </DialogDescription>
        </DialogHeader>

        <div>{userList}</div>
      </DialogContent>
    </Dialog>
  )
}
