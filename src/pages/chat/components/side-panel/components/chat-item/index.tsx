import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Chat } from '@/types'
import { useUser } from '@/hooks/user'

interface Props {
  chat?: Partial<Chat>
  selectedChat?: Partial<Chat>
  onSelectChat?: (chat: Props['chat']) => void
}

export default function ChatItem({ chat, selectedChat, onSelectChat }: Props) {
  const { users } = useUser()

  const conversant = useMemo(() => {
    const conversantId = chat?.participants?.find(
      (participant) => participant !== auth.currentUser?.uid
    )
    return users.find((user) => user.uid === conversantId)
  }, [chat?.participants, users])

  const unreadCount = useMemo(
    () =>
      chat?.participantsMeta?.find(
        (participant) => participant.uid === auth.currentUser?.uid
      )?.unreadCount,
    [chat?.participantsMeta]
  )

  const lastMessage = useMemo(() => {
    const element = document.createElement('div')
    element.innerHTML = chat?.lastMessage?.content ?? ''
    return element.textContent
  }, [chat?.lastMessage?.content])

  return (
    <button
      type="button"
      className={cn(
        'p-[10px] pl-5 w-full text-left hover:bg-gray-200 dark:hover:bg-black transition-colors',
        chat?.id === selectedChat?.id &&
          'bg-gray-200 dark:bg-black transition-colors'
      )}
      onClick={() => onSelectChat?.(chat)}
    >
      <div className="w-full grid grid-cols-[auto_1fr_auto_auto] grid-rows-2 gap-x-2 [&>*]:self-center">
        <div className="row-span-2">
          <Avatar active={conversant?.online}>
            <AvatarImage src={conversant?.picture} />
            <AvatarFallback>
              {conversant?.name?.at(0)?.toUpperCase()}
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
          {formateTime(chat?.lastMessage?.timestamp)}
        </span>

        <span
          className={cn(
            'col-span-3 text-ellipsis overflow-hidden text-nowrap text-sm font-medium',
            unreadCount ? 'text-black dark:text-white' : 'text-gray-400'
          )}
        >
          {lastMessage}
        </span>
      </div>
    </button>
  )
}
