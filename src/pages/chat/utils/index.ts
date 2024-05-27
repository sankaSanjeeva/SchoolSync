import { doc, setDoc, writeBatch } from 'firebase/firestore'
import { MsgStatus } from '@/enums'
import { auth, db } from '@/firebase'
import { Chat, Message, messageConverter } from '@/types'

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
  messages: Partial<Message> | Partial<Message>[]
) => {
  if (Array.isArray(messages)) {
    const batch = writeBatch(db)

    messages.forEach((message) => {
      const id = generateId()

      batch.set(doc(db, `chats/${chatId}/messages/${id}`), {
        id,
        type: 'text',
        timestamp: +new Date(),
        senderID: auth.currentUser?.uid,
        ...message,
      })
    })

    return batch.commit()
  }

  const id = generateId()

  return setDoc(
    doc(db, `chats/${chatId}/messages/${id}`).withConverter(messageConverter),
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
