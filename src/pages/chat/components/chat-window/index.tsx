import { ChangeEvent, useState } from 'react'
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
import { auth, db } from '@/firebase'
import { Chat, Message, chatConverter, messageConverter } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreIcon, PaperclipIcon, SendIcon, SmileyIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatType, MsgStatus } from '@/enums'
import { generateId } from '@/lib/utils'
import { ChatBubble } from './components'

const active = true

interface Props {
  chat?: Partial<Chat>
  onCreateChat: (chat: Props['chat']) => void
}

export default function ChatWindow({ chat, onCreateChat }: Props) {
  const [text, setText] = useState('')

  const q = query(
    collection(db, `chats/${chat?.id}/messages`).withConverter(
      messageConverter
    ),
    where('status', 'in', [MsgStatus.EDITED, MsgStatus.READ, MsgStatus.SENT]),
    orderBy('timestamp', 'desc')
  )

  const [messages] = useCollectionData(q)

  const receiver = chat?.members?.find((u) => u.uid !== auth.currentUser?.uid)

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`
    setText(e.target.value)
  }

  const sendMessage = (chatID: Chat['id'], senderID: Message['senderID']) => {
    setText('')
    const id = generateId()
    return setDoc(
      doc(db, `chats/${chatID}/messages/${id}`).withConverter(messageConverter),
      {
        id,
        senderID,
        content: text,
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
        memberIDs: [
          ...(chat?.members ?? []).map((member) => member.uid!),
          currentUser?.uid,
        ],
        members: [
          ...(chat?.members ?? []).map((member) => ({
            ...member,
            unreadCount: 1,
          })),
          {
            email: currentUser?.email?.toString(),
            name: currentUser?.displayName?.toString(),
            picture: currentUser?.photoURL?.toString(),
            uid: currentUser?.uid,
            unreadCount: 0,
          },
        ],
        lastMessage: {
          content: text,
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
          content: text,
          timestamp: +new Date(),
        },
        members: chat.members?.map((member) => {
          if (member.uid === currentUser.uid) {
            return member
          }
          return {
            ...member,
            unreadCount: member.unreadCount + 1,
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
              <Avatar active={active}>
                <AvatarImage src={receiver?.picture} />
                <AvatarFallback>
                  {receiver?.name?.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span>{receiver?.name}</span>
            <Button variant="ghost" size="icon" className="row-span-2">
              <MoreIcon />
            </Button>
            <span className="text-xs text-gray-400">Online</span>
          </header>

          {/* <ScrollArea className="h-full"> */}

          <div className="flex-grow flex flex-col-reverse gap-3 overflow-auto">
            {messages?.map((message, i) => (
              <ChatBubble
                key={message.id}
                message={message}
                prevMsgSender={messages[i + 1]?.senderID}
                members={chat.members}
                type={chat.type}
                id={chat.id}
              />
            ))}
          </div>

          {/* </ScrollArea> */}

          <div className="p-5">
            <Textarea
              variant="chat"
              rows={1}
              startAdornment={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <SmileyIcon />
                </Button>
              }
              endAdornment={
                text ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleClickSend}
                  >
                    <SendIcon className="text-gray-500" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PaperclipIcon />
                  </Button>
                )
              }
              className="px-[54px] py-3"
              value={text}
              onChange={handleInput}
            />
          </div>
        </div>
      ) : (
        <div />
      )}
    </main>
  )
}
