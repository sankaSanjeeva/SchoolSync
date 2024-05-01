import { useMemo, useState } from 'react'
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { formatDistance } from 'date-fns'
import { auth, db } from '@/firebase'
import { Chat, Message, chatConverter, messageConverter } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { ChatType, MsgStatus } from '@/enums'
import { generateId } from '@/lib/utils'
import { ChatBubble, Editor } from './components'
import ChatBubbleSkeleton from './components/chat-bubble/chat-bubble-skeleton'
import { useUser } from '@/hooks/user'

interface Props {
  chat?: Partial<Chat>
  onCreateChat: (chat: Props['chat']) => void
}

export default function ChatWindow({ chat, onCreateChat }: Props) {
  const [newMessage, setNewMessage] = useState('')

  const { users } = useUser()

  const q = query(
    collection(db, `chats/${chat?.id}/messages`).withConverter(
      messageConverter
    ),
    where('status', 'in', [MsgStatus.EDITED, MsgStatus.READ, MsgStatus.SENT]),
    orderBy('timestamp', 'desc')
  )

  const [messages, loading] = useCollectionData(q)

  const conversant = useMemo(() => {
    const uid = chat?.participants?.find((u) => u !== auth.currentUser?.uid)
    return users.find((user) => user.uid === uid)
  }, [chat?.participants, users])

  const sendMessage = (chatID: Chat['id'], senderID: Message['senderID']) => {
    setNewMessage('')
    const id = generateId()
    return setDoc(
      doc(db, `chats/${chatID}/messages/${id}`).withConverter(messageConverter),
      {
        id,
        senderID,
        content: newMessage,
        timestamp: +new Date(),
        status: MsgStatus.SENT,
      }
    )
  }

  const handleClickSend = async () => {
    const { currentUser } = auth

    if (!currentUser) {
      throw new Error('currentUser is not defined')
    }

    if (!chat?.id) {
      const id = generateId()
      const newChat = {
        id,
        type: ChatType.PERSONAL,
        participants: [
          ...(chat?.participants ?? []).map((participant) => participant),
          currentUser.uid,
        ],
        participantsMeta: [
          ...(chat?.participants ?? []).map((participant) => ({
            uid: participant,
            unreadCount: 1,
          })),
          {
            uid: currentUser?.uid,
            unreadCount: 0,
          },
        ],
        lastMessage: {
          content: newMessage,
          timestamp: +new Date(),
        },
      }
      await setDoc(doc(db, `chats/${id}`).withConverter(chatConverter), newChat)
      sendMessage(id, currentUser?.uid)
      onCreateChat(newChat)
    } else {
      sendMessage(chat.id, currentUser?.uid)
      updateDoc(doc(db, `chats/${chat.id}`), {
        lastMessage: {
          content: newMessage,
          timestamp: +new Date(),
        },
        participantsMeta: chat.participantsMeta?.map((participant) => {
          if (participant.uid === currentUser.uid) {
            return participant
          }
          return {
            ...participant,
            unreadCount: participant.unreadCount + 1,
          }
        }),
      })
    }
  }

  return (
    <main className="flex flex-grow bg-gray-100 dark:bg-black transition-colors">
      {chat ? (
        <div className="flex flex-col w-full">
          <header className="px-5 py-3 mx-0.5 grid grid-cols-[auto_1fr_auto] grid-rows-2 gap-x-2 [&>*]:self-center bg-white dark:bg-gray-900">
            <div className="row-span-2">
              <Avatar active={conversant?.online}>
                <AvatarImage src={conversant?.picture} />
                <AvatarFallback>
                  {conversant?.name?.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span>{conversant?.name}</span>
            <Button variant="ghost" size="icon" className="row-span-2">
              <MoreIcon />
            </Button>
            <span className="text-xs text-gray-400">
              {conversant?.online
                ? 'Online'
                : formatDistance(
                    conversant?.lastOnline ?? new Date(),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
            </span>
          </header>

          {/* <ScrollArea className="h-full"> */}

          <div className="flex-grow flex flex-col-reverse gap-3 overflow-auto pt-2">
            {loading &&
              [1, 2, 3].map((x) => (
                <ChatBubbleSkeleton
                  type={chat.type}
                  key={x}
                  isCurrentUser={Math.random() < 0.5}
                />
              ))}
            {messages?.map((message, i) => (
              <ChatBubble
                key={message.id}
                message={message}
                prevMsgSender={messages[i + 1]?.senderID}
                participantsMeta={chat.participantsMeta}
                type={chat.type}
                id={chat.id}
              />
            ))}
          </div>

          {/* </ScrollArea> */}

          <Editor
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleClickSend}
          />
        </div>
      ) : (
        <div />
      )}
    </main>
  )
}
