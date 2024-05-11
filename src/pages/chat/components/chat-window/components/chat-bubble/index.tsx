import { useEffect, useMemo } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Message } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MsgStatus } from '@/enums'
import { useElementIsVisible } from '@/hooks'
import { useChat, useUser } from '@/contexts'
import { MessageContent } from './components'

interface Props {
  message: Message
  prevMsgSender: Message['senderID'] | undefined
  isLast: boolean
}

export default function ChatBubble({ message, prevMsgSender, isLast }: Props) {
  const { ref, visible } = useElementIsVisible()

  const { users } = useUser()
  const { chat } = useChat()

  const isCurrentUser = useMemo(
    () => auth.currentUser?.uid === message.senderID,
    [message.senderID]
  )

  const showConversantInfo = useMemo(
    () => !isCurrentUser && chat?.type === 'group',
    [chat?.type, isCurrentUser]
  )

  const isSameSender = useMemo(
    () => message.senderID === prevMsgSender,
    [message.senderID, prevMsgSender]
  )

  const isUnreadMessage = useMemo(
    () => !isCurrentUser && message.status === MsgStatus.SENT,
    [isCurrentUser, message.status]
  )

  const sender = useMemo(
    () => users?.find((user) => user.uid === message.senderID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message.senderID]
  )

  const showEditedTag = useMemo(() => {
    const isDeleted =
      message.status === MsgStatus.DELETED ||
      message.deletedFor?.includes(auth.currentUser?.uid ?? '')

    return !isDeleted && message.edited
  }, [message.deletedFor, message.edited, message.status])

  useEffect(() => {
    if (visible) {
      updateDoc(doc(db, `chats/${chat?.id}/messages/${message.id}`), {
        status: MsgStatus.READ,
      })

      updateDoc(doc(db, `chats/${chat?.id}`), {
        participantsMeta: chat?.participantsMeta?.map((participant) => {
          if (participant.uid === auth.currentUser?.uid) {
            return {
              uid: participant.uid,
              /**
               * Increase by one not working
               */
              // unreadCount: participant.unreadCount - 1,
              unreadCount: 0,
            }
          }
          return participant
        }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_minmax(100px,_1fr)] grid-rows-[auto_minmax(auto,_1fr)_auto] w-fit max-w-[calc(100%_-_100px)] px-3',
        isCurrentUser && 'mr-0 ml-auto'
      )}
    >
      {showConversantInfo && !isSameSender && (
        <div className="col-start-2 mb-1 px-3 font-medium text-xs text-gray-500">
          {sender?.name}
        </div>
      )}

      {showConversantInfo && (
        <Avatar className={cn('mr-3 w-12 h-12', isSameSender && 'invisible')}>
          <AvatarImage src={sender?.picture} />
          <AvatarFallback>{sender?.name?.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <MessageContent
        isCurrentUser={isCurrentUser}
        isLast={isLast}
        className="col-start-2 self-center"
        {...message}
      />

      {isUnreadMessage && <div ref={ref} />}

      <div className="col-start-2 flex justify-between gap-5 mt-1 px-3 font-medium text-xs text-gray-500">
        <em>{showEditedTag && 'Edited'}</em>
        <span>{formateTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
