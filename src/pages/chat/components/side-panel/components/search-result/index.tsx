import { collection, query, where } from 'firebase/firestore'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatItem from '../chat-item'
import { Chat, userConverter } from '@/types'
import { auth, db } from '@/firebase'

export default function SearchResult({
  chats,
  search,
  onSelectChat,
}: {
  chats?: Chat[]
  search: string
  onSelectChat?: (chat?: Partial<Chat>) => void
}) {
  const recipients =
    chats?.map((x) => x.memberIDs.find((y) => y !== auth.currentUser?.uid)) ??
    []

  const [newChats] = useCollectionDataOnce(
    query(
      collection(db, 'users').withConverter(userConverter),
      where('uid', 'not-in', [...recipients, auth.currentUser?.uid])
    )
  )

  return (
    <ScrollArea className="h-[calc(100vh_-_132px)]">
      <div>
        <div className="text-sm font-bold px-5 py-3 sticky top-0 z-10 bg-white dark:bg-gray-900 transition-colors">
          CHATS
        </div>
        <div>
          {chats
            ?.filter((u) => {
              const user = u.members.find(
                (x) => x.uid !== auth.currentUser?.uid
              )
              return user?.name?.toLowerCase().includes(search.toLowerCase())
            })
            .map((chat) => (
              <ChatItem key={chat.id} chat={chat} onSelectChat={onSelectChat} />
            ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-bold px-5 py-3 sticky top-0 z-10 bg-white dark:bg-gray-900 transition-colors">
          NEW CHATS
        </div>
        <div>
          {newChats?.map((user) => (
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
