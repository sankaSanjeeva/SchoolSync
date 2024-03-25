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
  lastMessage: {
    content: string
    timestamp: string
  }
  memberIDs: string[]
  members: (Partial<User> & { unreadCount?: number | null })[]
}

export const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore(post: Chat): DocumentData {
    return post
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Chat {
    return snapshot.data() as Chat
  },
}
