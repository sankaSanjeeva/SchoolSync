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
  online: boolean
  lastOnline: number
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
  participants: User['uid'][]
  participantsMeta: (Pick<User, 'uid'> & { unreadCount: number })[]
  lastMessage: Partial<Message>
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
  type: 'text' | 'photo' | 'video' | 'document'
  timestamp: number
  status: MsgStatus
  edited?: boolean
  deletedFor?: Chat['participants']
}

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(chat: Message): DocumentData {
    return chat
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Message {
    return snapshot.data() as Message
  },
}
