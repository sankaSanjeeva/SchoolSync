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
import { format, isToday, isValid, isYesterday } from 'date-fns'
import { auth, db } from '@/firebase'
import { Chat, Message, chatConverter, messageConverter } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MsgStatus } from '@/enums'
import { generateId } from '@/lib/utils'
import { ChatBubble, Editor, Header, NewMessageIndicator } from './components'
import ChatBubbleSkeleton from './components/chat-bubble/chat-bubble-skeleton'
import { useChat } from '@/contexts'

export default function ChatWindow() {
  const [newMessage, setNewMessage] = useState('')

  const dummyElement = useRef<HTMLDivElement>(null)

  const { chat, setChat } = useChat()

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
        type: chat?.type,
        participants: [
          ...(chat?.participants ?? []).map((participant) => participant),
          currentUser.uid,
        ],
        participantsMeta: [
          ...(chat?.participants ?? []).map((participant) => ({
            uid: participant,
            unreadCount: 1,
            lastDeletedOn: +new Date(),
          })),
          {
            uid: currentUser?.uid,
            unreadCount: 0,
            lastDeletedOn: +new Date(),
          },
        ],
        lastMessage: {
          content: newMessage,
          timestamp: +new Date(),
        },
        ...(chat?.name ? { name: chat?.name } : {}),
      }
      await setDoc(
        doc(db, `chats/${id}`).withConverter(chatConverter),
        newChat as Chat
      )
      sendMessage(id, currentUser?.uid)
      setChat(newChat)
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
    <main className="flex flex-grow overflow-hidden bg-gray-100 dark:bg-black transition-colors">
      {chat ? (
        <div className="flex flex-col w-full">
          <Header />

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
            className="px-2 -translate-y-2"
          />
        </div>
      ) : (
        <div />
      )}
    </main>
  )
}
