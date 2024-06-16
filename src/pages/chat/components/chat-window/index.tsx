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
import { useDropzone } from 'react-dropzone'
import ReactQuill from 'react-quill'
import { auth, db } from '@/firebase'
import { Chat, Message, messageConverter } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { generateId, sendMessage } from '@/pages/chat/utils'
import { ChatWindowAlt } from '@/assets/background'
import { useChat, useFileUpload, useUser } from '@/contexts'
import { MsgStatus } from '@/enums'
import { cn } from '@/lib/utils'
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
  const [files, setFiles] = useState<File[]>([])
  const [isChatInitiating, setIsChatInitiating] = useState(false)

  const editor = useRef<ReactQuill>(null)
  const dummyElement = useRef<HTMLDivElement>(null)

  const { chat, setChat } = useChat()
  const { user } = useUser()
  const { files: filesToUpload, setFiles: setFileToUpload } = useFileUpload()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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

  const moveFilesToUpload = (chatId: Chat['id'], messageId: Message['id']) => {
    setFileToUpload([
      ...filesToUpload,
      ...files.map((file, i) => ({
        fileName: `${chatId}-${messageId}-${i}`,
        uploading: false,
        file,
      })),
    ])
  }

  const handleClickSend = async () => {
    const messageId = generateId()

    setNewMessage('')
    setFiles([])

    if (!auth.currentUser) {
      throw new Error('currentUser is not defined')
    }

    if (!chat?.id) {
      setIsChatInitiating(true)

      const chatId = generateId()
      const newChat = {
        id: chatId,
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

      await setDoc(doc(db, `chats/${chatId}`), newChat)
      await sendMessage(chatId, [
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
          id: messageId,
          content: newMessage,
          timestamp: +new Date() + 2,
          status: MsgStatus.SENT,
          attachments: files.map((f, i) => ({
            id: `${chatId}-${messageId}-${i}`,
            // eslint-disable-next-line no-nested-ternary
            type: f.type.startsWith('image')
              ? 'image'
              : // eslint-disable-next-line no-nested-ternary
                f.type.startsWith('video')
                ? 'video'
                : f.type.startsWith('application/pdf')
                  ? 'pdf'
                  : 'other',
          })),
        },
      ])

      moveFilesToUpload(chatId, messageId)

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

    sendMessage(chat.id, {
      id: messageId,
      content: newMessage,
      attachments: files.map((f, i) => ({
        id: `${chat.id}-${messageId}-${i}`,
        // eslint-disable-next-line no-nested-ternary
        type: f.type.startsWith('image')
          ? 'image'
          : // eslint-disable-next-line no-nested-ternary
            f.type.startsWith('video')
            ? 'video'
            : f.type.startsWith('application/pdf')
              ? 'pdf'
              : 'other',
      })),
    }).then(() => {
      dummyElement.current?.scrollIntoView({ behavior: 'smooth' })
      moveFilesToUpload(chat.id!, messageId)
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

          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={cn(
              'flex-grow flex flex-col relative overflow-hidden',
              'after:absolute after:flex after:justify-center after:items-center after:opacity-0 after:bg-white/75 dark:after:bg-black/75 after:transition-opacity',
              isDragActive &&
                'after:content-["Drop_your_files_here"] after:w-full after:h-full after:opacity-100'
            )}
            {...getRootProps()}
            onClick={() => {}}
          >
            <input {...getInputProps()} />
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
              files={files}
              setFiles={setFiles}
              className="mx-2 rounded-3xl -translate-y-2"
              ref={editor}
            />
          </div>
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
