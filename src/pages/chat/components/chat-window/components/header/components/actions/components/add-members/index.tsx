import { useCallback, useMemo, useState } from 'react'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
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
import { auth, db } from '@/firebase'
import { Chat } from '@/types'
import { Input } from '@/components/ui/input'
import { ChatItem } from '@/components/common'

export default function AddMembers(props: DialogProps) {
  const { onOpenChange } = props

  const [participants, setParticipants] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const { users } = useUser()
  const { chat, setChat } = useChat()

  const handleSelectUser = useCallback((c: Partial<Chat> | undefined) => {
    setParticipants((prev) => {
      if (prev.includes(c?.participants?.[0] ?? '')) {
        return prev.filter((p) => p !== c?.participants?.[0])
      }
      return [...prev, c?.participants?.[0] ?? '']
    })
  }, [])

  const userList = useMemo(
    () =>
      users
        ?.filter(
          (user) =>
            ![auth.currentUser?.uid, ...(chat?.participants ?? [])].includes(
              user.uid
            ) && user.name.toLowerCase().includes(search.toLowerCase())
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
    [chat?.participants, handleSelectUser, participants, search, users]
  )

  const addUsers = () => {
    if (chat?.id) {
      updateDoc(doc(db, `chats/${chat?.id}`), {
        participants: arrayUnion(...participants),
        participantsMeta: arrayUnion(
          ...participants.map((uid) => ({
            uid,
            /**
             * Users cannot see messages that were sent before they joined.
             */
            lastDeletedOn: +new Date(),
            unreadCount: 0,
          }))
        ),
      })
    } else {
      setChat({
        ...chat,
        participants: [...(chat?.participants ?? []), ...participants],
      })
    }

    onOpenChange?.(false)
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new members</DialogTitle>
          <DialogDescription>
            Select the people you want to add
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

        <ScrollArea className="h-[calc(100svh_-_316px)]">{userList}</ScrollArea>

        <DialogFooter>
          <Button disabled={participants.length < 1} onClick={addUsers}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
