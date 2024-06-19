import { doc, setDoc, writeBatch } from 'firebase/firestore'
import { Chat, Message, messageConverter as converter } from '@/types'
import { MsgStatus } from '@/enums'
import { auth, db } from '@/firebase'

export const generateId = (): string => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''

  for (let i = 0; i < 20; i += 1) {
    id += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return id
}

export const sendMessage = (
  chatId: Chat['id'],
  messages:
    | (Pick<Message, 'content'> & Partial<Message>)
    | (Pick<Message, 'content' | 'timestamp'> & Partial<Message>)[]
) => {
  if (Array.isArray(messages)) {
    const batch = writeBatch(db)

    messages.forEach((message) => {
      const id = message.id ?? generateId()

      batch.set(
        doc(db, `chats/${chatId}/messages/${id}`).withConverter(converter),
        {
          id,
          type: 'text',
          senderID: auth.currentUser?.uid,
          ...message,
        }
      )
    })

    return batch.commit()
  }

  const id = messages.id ?? generateId()

  return setDoc(
    doc(db, `chats/${chatId}/messages/${id}`).withConverter(converter),
    {
      id,
      type: 'text',
      timestamp: +new Date(),
      status: MsgStatus.SENT,
      senderID: auth.currentUser?.uid,
      ...messages,
    }
  )
}
