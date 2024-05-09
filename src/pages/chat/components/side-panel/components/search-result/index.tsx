import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatItem from '../chat-item'
import { Chat } from '@/types'
import { auth } from '@/firebase'
import { useUser } from '@/contexts'

export default function SearchResult({
  chats,
  search,
}: {
  chats: Chat[] | undefined
  search: string
}) {
  const [, setSearchParams] = useSearchParams()

  const { users } = useUser()

  const filteredChats = useMemo(
    () =>
      chats?.filter((chat) => {
        const uid = chat.participants.find(
          (participant) => participant !== auth.currentUser?.uid
        )
        return users
          .find((user) => user.uid === uid)
          ?.name?.toLowerCase()
          .includes(search.toLowerCase())
      }),
    [chats, search, users]
  )

  const conversances = useMemo(
    () =>
      chats?.map((x) =>
        x.participants.find((y) => y !== auth.currentUser?.uid)
      ) ?? [],
    [chats]
  )

  const usersWithNoChats = useMemo(
    () =>
      users.filter(
        (user) =>
          !conversances.includes(user.uid) && user.uid !== auth.currentUser?.uid
      ),
    [conversances, users]
  )

  const filteredUsersWithNoChat = useMemo(() => {
    return usersWithNoChats.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [usersWithNoChats, search])

  const onSelectChat = () => {
    setSearchParams((params) => {
      params.delete('search')
      return params
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh_-_132px)]">
      <div>
        <div className="text-sm font-bold px-5 py-3 sticky top-0 z-10 bg-white dark:bg-gray-900 transition-colors">
          CHATS
        </div>
        <div>
          {filteredChats?.map((chat) => (
            <ChatItem key={chat.id} chat={chat} onSelectChat={onSelectChat} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-bold px-5 py-3 sticky top-0 z-10 bg-white dark:bg-gray-900 transition-colors">
          NEW CHATS
        </div>
        <div>
          {filteredUsersWithNoChat?.map((user) => (
            <ChatItem
              key={user.uid}
              chat={{ participants: [user.uid] }}
              onSelectChat={onSelectChat}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
