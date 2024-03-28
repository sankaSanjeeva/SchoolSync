import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { Role } from '@/enums'

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
  memberIDs: User['uid'][]
  members: (Partial<User> & { unreadCount?: number | null })[]
  lastMessage?: {
    content: string
    timestamp: string
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
  senderID: User['uid']
  content: string
  timestamp: string | number
}

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(chat: Message): DocumentData {
    return chat
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Message {
    return snapshot.data() as Message
  },
}
