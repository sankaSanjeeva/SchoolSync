import { useEffect, useMemo } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Chat, Message, chatConverter } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MsgStatus } from '@/enums'
import { useElementIsVisible } from '@/hooks'
import { useChat, useUser } from '@/contexts'
import { PersonIcon } from '@/assets/icons'
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

  const isUnreadMessage = useMemo(() => {
    if (chat?.type === 'private') {
      return !isCurrentUser && message.status === MsgStatus.SENT
    }
    return !isCurrentUser && isLast
  }, [chat?.type, isCurrentUser, isLast, message.status])

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

  const resetUnreadCount = (
    participantsMeta: Chat['participantsMeta'] | undefined
  ) => {
    updateDoc(doc(db, `chats/${chat?.id}`), {
      participantsMeta: participantsMeta?.map((participant) => {
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
      /**
       * TODO: need to check
       * Get fresh data before update.
       * If not this use old data of participantsMeta
       */
      getDoc(doc(db, `chats/${chat?.id}`).withConverter(chatConverter)).then(
        (res) => {
          const participantsMeta = res.data()?.participantsMeta

          if (chat?.type === 'private') {
            updateDoc(doc(db, `chats/${chat?.id}/messages/${message.id}`), {
              status: MsgStatus.READ,
            })
            resetUnreadCount(participantsMeta)
          } else if (
            (participantsMeta?.find(({ uid }) => uid === auth.currentUser?.uid)
              ?.unreadCount ?? 0) > 0
          ) {
            resetUnreadCount(participantsMeta)
          }
        }
      )
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
        <Avatar className={cn('mr-3 w-12 h-12', isSameSender && 'invisible')}>
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

      {isUnreadMessage && <div ref={ref} />}

      <div
        className={cn(
          'col-start-2 flex justify-between gap-5 px-3 font-medium text-xs text-gray-500',
          isDeletedMessage && !isCurrentUser && chat?.type === 'group'
            ? '-mt-[6px]'
            : 'mt-1'
        )}
      >
        <em>{showEditedTag && 'Edited'}</em>
        <span>{formateTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
