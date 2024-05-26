import { doc, setDoc } from 'firebase/firestore'
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

export const sendMessage = (chatId: Chat['id'], message: Partial<Message>) => {
  const id = generateId()

  return setDoc(
    doc(db, `chats/${chatId}/messages/${id}`).withConverter(messageConverter),
    {
      id,
      type: 'text',
      timestamp: +new Date(),
      status: MsgStatus.SENT,
      ...(message.type !== 'info' ? { senderID: auth.currentUser?.uid } : {}),
      ...message,
    }
  )
}
