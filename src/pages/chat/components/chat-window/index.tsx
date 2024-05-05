import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { format, formatDistance, isToday, isValid, isYesterday } from 'date-fns'
import { auth, db } from '@/firebase'
import { Chat, Message, chatConverter, messageConverter } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MoreIcon } from '@/assets/icons'
import { ChatType, MsgStatus } from '@/enums'
import { generateId } from '@/lib/utils'
import { ChatBubble, Editor, NewMessageIndicator } from './components'
import ChatBubbleSkeleton from './components/chat-bubble/chat-bubble-skeleton'
import { useUser } from '@/hooks/user'

interface Props {
  chat?: Partial<Chat>
  onCreateChat: (chat: Props['chat']) => void
}

export default function ChatWindow({ chat, onCreateChat }: Props) {
  const [newMessage, setNewMessage] = useState('')

  const dummyElement = useRef<HTMLDivElement>(null)

  const { users } = useUser()

  const q = useMemo(
    () =>
      query(
        collection(db, `chats/${chat?.id}/messages`).withConverter(
          messageConverter
        ),
        orderBy('timestamp', 'desc')
      ),
    [chat?.id]
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
        type: 'text',
        timestamp: +new Date(),
        status: MsgStatus.SENT,
      }
    ).then(() => {
      dummyElement.current?.scrollIntoView({ behavior: 'smooth' })
    })
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

  const showDateBanner = useCallback(
    (currentDate: Message['timestamp'], previousDate: Message['timestamp']) =>
      new Date(currentDate).getDate() !== new Date(previousDate).getDate(),
    []
  )

  const dateBannerText = useCallback((date: Message['timestamp']) => {
    if (!isValid(date)) {
      return null
    }
    if (isToday(date)) {
      return 'Today'
    }
    if (isYesterday(date)) {
      return 'Yesterday'
    }
    return format(new Date(date), 'MMMM do, yyyy')
  }, [])

  const unreadCount = useMemo(
    () =>
      chat?.participantsMeta?.find(({ uid }) => uid === auth.currentUser?.uid)
        ?.unreadCount ?? 0,
    [chat?.participantsMeta]
  )

  useEffect(() => {
    if (!loading) {
      dummyElement.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [loading])

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

          <div className="flex-grow" />

          <ScrollArea>
            <div className="flex flex-col-reverse gap-3 pt-2">
              <div ref={dummyElement} />

              {loading &&
                [1, 2, 3].map((x) => (
                  <ChatBubbleSkeleton
                    type={chat.type}
                    key={x}
                    isCurrentUser={Math.random() < 0.5}
                  />
                ))}

              {messages?.map((message, i) => (
                <Fragment key={message.id}>
                  <ChatBubble
                    message={message}
                    prevMsgSender={messages[i + 1]?.senderID}
                    participantsMeta={chat.participantsMeta}
                    type={chat.type}
                    id={chat.id}
                    isLast={i === 0}
                  />
                  {showDateBanner(
                    message.timestamp,
                    messages[i + 1]?.timestamp
                  ) && (
                    <div className="flex justify-center pointer-events-none">
                      <div className="rounded-lg px-2 text-sm bg-gray-300 dark:bg-gray-900 transition-colors">
                        <em className="opacity-50">
                          ~ {dateBannerText(message.timestamp)} ~
                        </em>
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </ScrollArea>

          {unreadCount > 0 && !loading && (
            <NewMessageIndicator
              messageCount={unreadCount}
              onClick={() => {
                dummyElement.current?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          )}

          <Editor
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={handleClickSend}
          />
        </div>
      ) : (
        <div />
      )}
    </main>
  )
}
