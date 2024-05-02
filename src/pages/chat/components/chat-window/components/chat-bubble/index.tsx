import { useEffect, useMemo } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Chat, Message } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType, MsgStatus } from '@/enums'
import { useElementIsVisible } from '@/hooks'
import { useUser } from '@/hooks/user'
import { MessageContent } from './components'

interface Props
  extends Partial<Pick<Chat, 'id' | 'type' | 'participantsMeta'>> {
  message: Message
  prevMsgSender: Message['senderID'] | undefined
  isLast: boolean
}

export default function ChatBubble({
  message,
  prevMsgSender,
  id: chatId,
  type,
  participantsMeta,
  isLast,
}: Props) {
  const { ref, visible } = useElementIsVisible()
  const { users } = useUser()

  const isCurrentUser = useMemo(
    () => auth.currentUser?.uid === message.senderID,
    [message.senderID]
  )

  const showConversantInfo = useMemo(
    () => !isCurrentUser && type === ChatType.GROUP,
    [isCurrentUser, type]
  )

  const isSameSender = useMemo(
    () => message.senderID === prevMsgSender,
    [message.senderID, prevMsgSender]
  )

  const shouldPassRef = useMemo(
    () => !isCurrentUser && message.status === MsgStatus.SENT,
    [isCurrentUser, message.status]
  )

  const sender = useMemo(
    () => users.find((user) => user.uid === message.senderID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message.senderID]
  )

  useEffect(() => {
    if (visible) {
      updateDoc(doc(db, `chats/${chatId}/messages/${message.id}`), {
        status: MsgStatus.READ,
      })

      updateDoc(doc(db, `chats/${chatId}`), {
        participantsMeta: participantsMeta?.map((participant) => {
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
      {...(shouldPassRef && { ref })}
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
        chatId={chatId!}
        isCurrentUser={isCurrentUser}
        isLast={isLast}
        {...message}
      />

      <div
        className={cn(
          'col-start-2 mt-1 px-3 font-medium text-xs text-gray-500',
          isCurrentUser && 'text-end'
        )}
      >
        {formateTime(message.timestamp)}
      </div>
    </div>
  )
}
