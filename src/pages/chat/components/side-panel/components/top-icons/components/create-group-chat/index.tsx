/* eslint-disable jsx-a11y/label-has-associated-control */
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat, useUser } from '@/contexts'
import { auth } from '@/firebase'
import { Chat } from '@/types'
import { ChatItem } from '@/components/common'
import { Input } from '@/components/ui/input'

export default function CreteGroupChat(props: DialogProps) {
  const { onOpenChange } = props

  const [participants, setParticipants] = useState<string[]>([])
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')

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
        ?.filter(
          (user) =>
            user.uid !== auth.currentUser?.uid &&
            user.name.toLowerCase().includes(search.toLowerCase())
        )
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
    [handleSelectUser, participants, search, users]
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

        <div>
          <label className="text-sm" htmlFor="group-name">
            Group Name
          </label>
          <Input
            value={name}
            className="mt-1"
            id="group-name"
            placeholder="Name"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
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

        <ScrollArea className="h-[calc(100svh_-_400px)]">{userList}</ScrollArea>

        <DialogFooter>
          <Button disabled={disableStart} onClick={startChat}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
