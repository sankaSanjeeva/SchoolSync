import { useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatItem from '../chat-item'
import { Chat, User } from '@/types'
import { auth } from '@/firebase'

export default function SearchResult({
  chats,
  search,
  userWithNoChats,
  onSelectChat,
}: {
  chats: Chat[] | undefined
  search: string
  userWithNoChats: User[] | undefined
  onSelectChat?: (chat?: Partial<Chat>) => void
}) {
  const filteredChats = useMemo(
    () =>
      chats?.filter((chat) => {
        const user = chat.members.find(
          (member) => member.uid !== auth.currentUser?.uid
        )
        return user?.name?.toLowerCase().includes(search.toLowerCase())
      }),
    [chats, search]
  )

  const filteredUsersWithNoChat = useMemo(
    () =>
      userWithNoChats?.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      ),
    [userWithNoChats, search]
  )

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
              chat={{ members: [{ ...user, unreadCount: 0 }] }}
              onSelectChat={onSelectChat}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
