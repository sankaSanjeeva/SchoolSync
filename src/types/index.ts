import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { ChatType, MsgStatus, Role } from '@/enums'

export type User = {
  uid: string
  name: string
  email: string
  picture: string
  role: Role
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(post: User): DocumentData {
    return post
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    return snapshot.data() as User
  },
}

export type Chat = {
  id: string
  type: ChatType
  memberIDs: User['uid'][]
  members: (Partial<User> & { unreadCount: number })[]
  lastMessage?: {
    content: string
    timestamp: number
  }
}

export const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat: Chat): DocumentData {
    return chat
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Chat {
    return snapshot.data() as Chat
  },
}

export type Message = {
  id: string
  senderID: User['uid']
  content: string
  timestamp: number
  status: MsgStatus
}

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(chat: Message): DocumentData {
    return chat
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Message {
    return snapshot.data() as Message
  },
}
