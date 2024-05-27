import { useEffect, useMemo } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { format } from 'date-fns'
import { auth, db } from '@/firebase'
import { cn } from '@/lib/utils'
import { Message } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MsgStatus } from '@/enums'
import { useElementIsVisible } from '@/hooks'
import { useChat, useUser } from '@/contexts'
import { PersonIcon } from '@/assets/icons'
import { MessageContent } from './components'

interface Props {
  message: Message
  prevMessage: Message | undefined
  isLast: boolean
}

export default function ChatBubble({ message, prevMessage, isLast }: Props) {
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

  const showNameAndAvatar = useMemo(
    () =>
      message.senderID !== prevMessage?.senderID ||
      ['info', 'time'].includes(prevMessage.type),
    [message.senderID, prevMessage?.senderID, prevMessage?.type]
  )

  const sender = useMemo(
    () => users?.find((user) => user.uid === message.senderID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message.senderID]
  )

  const isDeletedMessage = useMemo(
    () =>
      message.status === MsgStatus.DELETED ||
      message.deletedFor?.includes(auth.currentUser?.uid ?? ''),
    [message.deletedFor, message.status]
  )

  const showEditedTag = useMemo(
    () => !isDeletedMessage && message.edited,
    [isDeletedMessage, message.edited]
  )

  const showFakeDivRef = useMemo(
    () =>
      !isCurrentUser &&
      // if group chat
      ((chat?.type === 'group' && isLast) ||
        // if private chat
        (chat?.type === 'private' && message.status === MsgStatus.SENT)),
    [chat?.type, isCurrentUser, isLast, message.status]
  )

  const resetUnreadCount = () => {
    updateDoc(doc(db, `chats/${chat?.id}`), {
      participantsMeta: chat?.participantsMeta?.map((participant) => {
        if (participant.uid === auth.currentUser?.uid) {
          return {
            ...participant,
            unreadCount: 0,
          }
        }
        return participant
      }),
    })
  }

  useEffect(() => {
    if (visible) {
      if (chat?.type === 'private') {
        updateDoc(doc(db, `chats/${chat?.id}/messages/${message.id}`), {
          status: MsgStatus.READ,
        })
      }
      if (isLast) {
        resetUnreadCount()
      }
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
      {showConversantInfo && showNameAndAvatar && (
        <div
          className={cn(
            'col-start-2  px-3 font-medium text-xs text-gray-500',
            isDeletedMessage && !isCurrentUser ? '-mb-1' : 'mb-1'
          )}
        >
          {sender?.name}
        </div>
      )}

      {showConversantInfo && (
        <Avatar
          className={cn(
            'mr-3 w-12 h-12 invisible',
            showNameAndAvatar && 'visible'
          )}
        >
          <AvatarImage src={sender?.picture} />
          <AvatarFallback>
            <PersonIcon className="h-7 w-7 text-gray-500" />
          </AvatarFallback>
        </Avatar>
      )}

      <MessageContent
        isCurrentUser={isCurrentUser}
        isLast={isLast}
        className="col-start-2 self-center"
        {...message}
      />

      {showFakeDivRef && <div ref={ref} />}

      <div
        className={cn(
          'col-start-2 flex justify-between gap-5 px-3 font-medium text-xs text-gray-500',
          isDeletedMessage && !isCurrentUser && chat?.type === 'group'
            ? '-mt-[6px]'
            : 'mt-1'
        )}
      >
        <em>{showEditedTag && 'Edited'}</em>
        <span>{format(message.timestamp, 'p')}</span>
      </div>
    </div>
  )
}
