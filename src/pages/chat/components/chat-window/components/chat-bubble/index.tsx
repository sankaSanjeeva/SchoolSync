import { useMemo } from 'react'
import { auth } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Chat, Message } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType } from '@/enums'

interface Props extends Partial<Pick<Chat, 'type' | 'members'>> {
  message: Message
  prevMsgSender: Message['senderID'] | undefined
}

export default function ChatBubble({
  message,
  prevMsgSender,
  type,
  members,
}: Props) {
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

  const sender = useMemo(
    () => members?.find((x) => x.uid === message.senderID),
    [members, message.senderID]
  )

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
        <Avatar className={cn('mr-3', isSameSender && 'invisible')}>
          <AvatarImage src={sender?.picture} />
          <AvatarFallback>{sender?.name?.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div className="col-start-2 self-center rounded-lg p-3 bg-gray-300 dark:bg-gray-900 transition-colors">
        {message.content}
      </div>

      <div className="col-start-2 mt-1 px-3 font-medium text-xs text-gray-500">
        {formateTime(message.timestamp)}
      </div>
    </div>
  )
}
