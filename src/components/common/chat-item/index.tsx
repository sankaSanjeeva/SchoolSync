import { useMemo } from 'react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Chat, User } from '@/types'
import { useChat, useUser } from '@/contexts'
import { GroupIcon, PersonIcon } from '@/assets/icons'

interface Props {
  chat: Partial<Chat> | undefined
  className?: string
  onClick?: (chat: Partial<Chat> | undefined) => void
}

export default function ChatItem({ chat, className, onClick }: Props) {
  const { users } = useUser()
  const { chat: selectedChat } = useChat()

  const conversant = useMemo(() => {
    if (chat?.type === 'group') {
      return {
        name: chat.name,
      } as User
    }
    const conversantId = chat?.participants?.find(
      (participant) => participant !== auth.currentUser?.uid
    )
    return users?.find((user) => user.uid === conversantId)
  }, [chat?.name, chat?.participants, chat?.type, users])

  const unreadCount = useMemo(
    () =>
      chat?.participantsMeta?.find(
        (participant) => participant.uid === auth.currentUser?.uid
      )?.unreadCount,
    [chat?.participantsMeta]
  )

  const lastMessage = useMemo(() => {
    const message = chat?.participantsMeta?.find(
      ({ uid }) => uid === auth.currentUser?.uid
    )?.lastMessageContent

    if (message) {
      return <em className="opacity-75">{message}</em>
    }

    const element = document.createElement('div')
    element.innerHTML = chat?.lastMessage?.content ?? ''

    return <span>{element.textContent}</span>
  }, [chat?.lastMessage?.content, chat?.participantsMeta])

  /**
   * If unread message count blinks when send a new message, add below logic
   */

  // const batchElement = useRef<HTMLSpanElement>(null)

  // useEffect(() => {
  //   batchElement.current?.animate(
  //     {
  //       opacity: [0, 1],
  //     },
  //     500
  //   )
  // }, [unreadCount])

  // <span ref={batchElement}>{unreadCount > 99 ? '99+' : unreadCount}</span>

  return (
    <button
      type="button"
      className={cn(
        'p-[10px] pl-5 w-full text-left transition-all',
        chat?.id &&
          chat?.id === selectedChat?.id &&
          'bg-gray-200 dark:bg-black',
        className
      )}
      onClick={() => onClick?.(chat)}
    >
      <div className="w-full grid grid-cols-[auto_1fr_auto_auto] grid-rows-2 gap-x-2 [&>*]:self-center">
        <div className="row-span-2">
          <Avatar active={conversant?.online}>
            <AvatarImage src={conversant?.picture} />
            <AvatarFallback>
              {chat?.type === 'group' ? (
                <GroupIcon className="h-8 w-8 text-gray-500" />
              ) : (
                <PersonIcon className="h-8 w-8 text-gray-500" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>

        <span className="text-ellipsis overflow-hidden text-nowrap font-bold">
          {conversant?.name}
        </span>

        {unreadCount ? (
          <span className="text-xs px-1 pt-0.5 pb-1 rounded-full text-white leading-none bg-theme">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : (
          <span />
        )}

        <span className="text-xs font-medium text-gray-500">
          {chat?.lastMessage?.timestamp &&
            format(chat.lastMessage.timestamp, 'p')}
        </span>

        <div
          className={cn(
            'col-span-3 text-ellipsis overflow-hidden text-nowrap text-sm font-medium',
            unreadCount ? 'text-black dark:text-white' : 'text-gray-400'
          )}
        >
          {lastMessage}
        </div>
      </div>
    </button>
  )
}
