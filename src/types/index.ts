import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { MsgStatus, Role } from '@/enums'

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

type PrivateChat = {
  type: 'private'
  name?: string
}

type GroupChat = {
  type: 'group'
  name: string
}

/**
 * participant's meta data relevant to the chat
 */
type ParticipantsMeta = {
  unreadCount: number
  lastDeletedOn?: number
  /**
   * Participant specific last message.
   * eg:- "You deleted the message"
   */
  lastMessageContent?: string
} & Pick<User, 'uid'>

export type Chat = {
  id: string
  participants: User['uid'][]
  participantsMeta: ParticipantsMeta[]
  lastMessage: Partial<Message>
} & (PrivateChat | GroupChat)

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
  type: 'text' | 'photo' | 'video' | 'document' | 'info'
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
