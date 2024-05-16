import { useCallback, useMemo, useState } from 'react'
import { DialogProps } from '@radix-ui/react-alert-dialog'
import { useChat, useUser } from '@/contexts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { auth } from '@/firebase'
import { Chat } from '@/types'
import ChatItem from '../../../chat-item'

export default function CretePrivateChat(props: DialogProps) {
  const { onOpenChange } = props

  const [search, setSearch] = useState('')

  const { users } = useUser()
  const { chats, setChat } = useChat()

  const onSelectUser = useCallback(
    (newChat: Partial<Chat> | undefined) => {
      const existingChat = chats?.find(
        (chat) =>
          chat.participants.includes(newChat?.participants?.[0] ?? '') &&
          chat.participants.includes(auth.currentUser?.uid ?? '') &&
          chat.type === 'private'
      )
      setChat(existingChat ?? newChat)
      onOpenChange?.(false)
    },
    [chats, onOpenChange, setChat]
  )

  const userList = useMemo(
    () =>
      users
        ?.filter(
          (user) =>
            user.uid !== auth.currentUser?.uid &&
            user.name.toLowerCase().includes(search.toLowerCase())
        )
        ?.map((user) => (
          <ChatItem
            key={user.uid}
            chat={{ participants: [user.uid] }}
            onClick={onSelectUser}
          />
        )),
    [onSelectUser, search, users]
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

        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="text-sm" htmlFor="search-users">
            Search Users
          </label>
          <Input
            value={search}
            className="mt-1"
            id="search-users"
            placeholder="Search"
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[calc(100svh_-_260px)]">{userList}</ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
