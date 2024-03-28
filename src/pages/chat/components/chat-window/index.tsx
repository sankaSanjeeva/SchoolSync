import { ChangeEvent, useState } from 'react'
import { addDoc, collection, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { Chat, Message, chatConverter, messageConverter } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreIcon, PaperclipIcon, SendIcon, SmileyIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const active = true

interface Props {
  chat?: Partial<Chat>
  onCreateChat: (chat: Props['chat']) => void
}

export default function ChatWindow({ chat, onCreateChat }: Props) {
  const [text, setText] = useState('')

  const receiver = chat?.members?.find((u) => u.uid !== auth.currentUser?.uid)

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`
    setText(e.target.value)
  }

  const sendMessage = (chatID: Chat['id'], senderID: Message['senderID']) => {
    return addDoc(
      collection(db, `chats/${chatID}/messages`).withConverter(
        messageConverter
      ),
      {
        senderID,
        content: text,
        timestamp: +new Date(),
      }
    )
  }

  const handleClickSend = async () => {
    const { currentUser } = auth

    if (!currentUser) {
      throw new Error('currentUser is not defined')
    }

    if (!chat?.id) {
      const newChatRef = await addDoc(
        collection(db, 'chats').withConverter(chatConverter),
        {
          id: '',
          memberIDs: [
            ...(chat?.members?.map((x) => x.uid!) ?? []),
            currentUser?.uid,
          ],
          members: [
            ...(chat?.members ?? []),
            {
              email: currentUser?.email?.toString(),
              name: currentUser?.displayName?.toString(),
              picture: currentUser?.photoURL?.toString(),
              uid: currentUser?.uid,
            },
          ],
        }
      )

      await sendMessage(newChatRef.id, currentUser?.uid)
      await updateDoc(newChatRef, { id: newChatRef.id })
      const doc = await getDoc(newChatRef)
      onCreateChat(doc.data())
    } else {
      await sendMessage(chat.id, currentUser?.uid)
    }

    setText('')
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

          <div className="flex flex-col-reverse overflow-auto">
            <div className="p-10">hello1</div>
            <div className="p-10">hello2</div>
            <div className="p-10">hello3</div>
            <div className="p-10">hello4</div>
            <div className="p-10">hello5</div>
            <div className="p-10">hello6</div>
            <div className="p-10">hello7</div>
            <div className="p-10">hello8</div>
            <div className="p-10">hello9</div>
            <div className="p-10">hello</div>
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
