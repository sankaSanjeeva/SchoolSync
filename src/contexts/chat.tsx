import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { collection, orderBy, query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Chat, chatConverter } from '@/types'
import { auth, db } from '@/firebase'

type ChatProviderState = {
  chats: Chat[] | undefined
  loading: boolean
  chat: Partial<Chat> | undefined
  setChat: (chat: Partial<Chat> | undefined) => void
}

const ChatProviderContext = createContext<ChatProviderState>({
  chats: undefined,
  loading: false,
  chat: undefined,
  setChat: () => null,
})

export function ChatProvider({ children }: PropsWithChildren) {
  const [chat, setChat] = useState<ChatProviderState['chat']>()

  const [chats, loading] = useCollectionData(
    query(
      collection(db, 'chats').withConverter(chatConverter),
      where('participants', 'array-contains', auth.currentUser?.uid),
      orderBy('lastMessage.timestamp', 'desc')
    )
  )

  const value = useMemo(
    () => ({ chats, loading, chat, setChat }),
    [chat, chats, loading]
  )

  useEffect(() => {
    const c = chats?.find(({ id }) => id === chat?.id)
    if (c) {
      setChat(c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats])

  return (
    <ChatProviderContext.Provider value={value}>
      {children}
    </ChatProviderContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatProviderContext)

  if (context === undefined)
    throw new Error('useChat must be used within a ChatProvider')

  return context
}
