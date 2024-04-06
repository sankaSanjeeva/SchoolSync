import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/firebase'
import { cn, formateTime } from '@/lib/utils'
import { Chat } from '@/types'

const active = true

interface Props {
  chat?: Partial<Chat>
  selectedChat?: Partial<Chat>
  onSelectChat?: (chat: Props['chat']) => void
}

export default function ChatItem({ chat, selectedChat, onSelectChat }: Props) {
  const user = chat?.members?.filter((x) => x.uid !== auth.currentUser?.uid)[0]

  const currentUser = useMemo(
    () => chat?.members?.find((member) => member.uid === auth.currentUser?.uid),
    [chat?.members]
  )

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
          <Avatar active={active}>
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name?.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <span className="text-ellipsis overflow-hidden text-nowrap font-bold">
          {user?.name}
        </span>

        {currentUser?.unreadCount ? (
          <span className="text-xs px-1 pt-0.5 pb-1 rounded-full text-white leading-none bg-theme">
            {currentUser?.unreadCount > 99 ? '99+' : currentUser?.unreadCount}
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
            currentUser?.unreadCount
              ? 'text-black dark:text-white'
              : 'text-gray-400'
          )}
        >
          {chat?.lastMessage?.content}
        </span>
      </div>
    </button>
  )
}
