import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
import {
  differenceInCalendarDays,
  format,
  isToday,
  isValid,
  isYesterday,
} from 'date-fns'
import ReactQuill from 'react-quill'
import { auth, db } from '@/firebase'
import { Message, messageConverter } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateId, sendMessage } from '@/pages/chat/utils'
import { ChatWindowAlt } from '@/assets/background'
import { useChat, useUser } from '@/contexts'
import { MsgStatus } from '@/enums'
import {
  ChatBubble,
  Editor,
  Header,
  InfoBanner,
  MessageWrapper,
  NewMessageIndicator,
} from './components'
import ChatBubbleSkeleton from './components/chat-bubble/chat-bubble-skeleton'

export default function ChatWindow() {
  const [newMessage, setNewMessage] = useState('')
  const [isChatInitiating, setIsChatInitiating] = useState(false)

  const editor = useRef<ReactQuill>(null)
  const dummyElement = useRef<HTMLDivElement>(null)

  const { chat, setChat } = useChat()
  const { user } = useUser()

  const q = useMemo(() => {
    const lastDeletedOn =
      chat?.participantsMeta?.find(({ uid }) => uid === auth.currentUser?.uid)
        ?.lastDeletedOn ?? 0

    return query(
      collection(db, `chats/${chat?.id}/messages`).withConverter(
        messageConverter
      ),
      where('timestamp', '>', lastDeletedOn),
      orderBy('timestamp', 'desc')
    )
  }, [chat?.id, chat?.participantsMeta])

  const [messages, loading] = useCollectionData(q)

  const handleClickSend = async () => {
    setNewMessage('')

    if (!auth.currentUser) {
      throw new Error('currentUser is not defined')
    }

    if (!chat?.id) {
      setIsChatInitiating(true)

      const id = generateId()
      const newChat = {
        id,
        type: chat?.type,
        participants: [
          ...(chat?.participants ?? []).map((participant) => participant),
          auth.currentUser.uid,
        ],
        participantsMeta: [
          ...(chat?.participants ?? []).map((participant) => ({
            uid: participant,
            unreadCount: 1,
          })),
          {
            uid: auth.currentUser.uid,
            unreadCount: 0,
          },
        ],
        lastMessage: {
          content: newMessage,
          timestamp: +new Date(),
        },
        ...(chat?.name ? { name: chat?.name } : {}),
      }

      await setDoc(doc(db, `chats/${id}`), newChat)
      await sendMessage(id, [
        {
          content: `${user?.name} started the conversation`,
          timestamp: +new Date(),
          type: 'info',
        },
        {
          content: (+new Date()).toString(),
          timestamp: +new Date() + 1,
          type: 'time',
        },
        {
          content: newMessage,
          timestamp: +new Date() + 2,
          status: MsgStatus.SENT,
        },
      ])

      setIsChatInitiating(false)
      setChat(newChat)

      return
    }

    if (
      differenceInCalendarDays(
        new Date(),
        messages?.[0]?.timestamp ?? new Date()
      ) > 0
    ) {
      await sendMessage(chat.id, {
        content: (+new Date()).toString(),
        type: 'time',
      }).then(() => {
        dummyElement.current?.scrollIntoView({ behavior: 'smooth' })
      })
    }

    sendMessage(chat.id, { content: newMessage }).then(() => {
      dummyElement.current?.scrollIntoView({ behavior: 'smooth' })
    })

    updateDoc(doc(db, `chats/${chat.id}`), {
      lastMessage: {
        content: newMessage,
        timestamp: +new Date(),
      },
      participantsMeta: chat.participantsMeta?.map((participant) => {
        const { lastMessageContent, ...rest } = participant
        if (participant.uid === auth.currentUser?.uid) {
          return rest
        }
        return {
          ...rest,
          unreadCount: participant.unreadCount + 1,
        }
      }),
    })
  }

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

  const getMessageType = useCallback(
    (message: Message, index: number) => {
      switch (message.type) {
        case 'text':
          return (
            <ChatBubble
              message={message}
              prevMessage={messages?.[index + 1]}
              isLast={index === 0}
            />
          )

        case 'info':
          return <InfoBanner>{message.content}</InfoBanner>

        case 'time':
          return (
            <InfoBanner>
              ~ {dateBannerText(Number(message.content))} ~
            </InfoBanner>
          )

        default:
          return null
      }
    },
    [dateBannerText, messages]
  )

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

  useEffect(() => {
    editor.current?.focus()
  }, [chat?.id])

  return (
    <main className="flex flex-grow overflow-hidden bg-gray-100 dark:bg-black transition-colors">
      {chat ? (
        <div className="flex flex-col w-full">
          <Header />

          <div className="flex-grow" />

          <ScrollArea>
            <div className="flex flex-col-reverse gap-3 pt-2">
              <div ref={dummyElement} />

              {(loading || isChatInitiating) &&
                [1, 2, 3].map((x) => (
                  <ChatBubbleSkeleton
                    type={chat.type}
                    key={x}
                    isCurrentUser={x % 2 > 0}
                  />
                ))}

              {messages?.map((message, index) => (
                <MessageWrapper
                  key={message.id}
                  message={message}
                  isLast={index === 0}
                >
                  {getMessageType(message, index)}
                </MessageWrapper>
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
            ref={editor}
          />
        </div>
      ) : (
        <motion.div
          className="w-full flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <ChatWindowAlt className="w-3/4 h-full dark:[&>:first-child]:stroke-gray-900 dark:[&>#fill-gray-300]:fill-gray-800 dark:[&>#stroke-gray-300]:stroke-gray-800 dark:[&>#gray-400]:stroke-gray-500" />
        </motion.div>
      )}
    </main>
  )
}
