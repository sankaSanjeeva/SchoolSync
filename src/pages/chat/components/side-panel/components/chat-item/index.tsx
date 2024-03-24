import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { Chat } from '@/types'

const selected = false
const active = true

export default function ChatItem({ lastMessage, members }: Chat) {
  const user = members.filter((x) => x.uid !== auth.currentUser?.uid)[0]

  return (
    <button
      type="button"
      className={cn(
        'p-[10px] pl-5 w-full text-left hover:bg-gray-100 dark:hover:bg-black transition-colors duration-300',
        selected && 'bg-gray-100 dark:bg-black transition-colors'
      )}
    >
      <div className="w-full grid grid-cols-[auto_1fr_auto_auto] grid-rows-2 gap-x-2">
        <div className="row-span-2">
          <Avatar active={active}>
            <AvatarImage src={user.picture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-ellipsis overflow-hidden text-nowrap font-bold self-center">
          {user.name}
        </span>
        {user.unreadCount ? (
          <span className="text-xs px-1 pt-0.5 pb-1 self-center rounded-full text-white leading-none bg-green-500">
            {user.unreadCount > 99 ? '99+' : user.unreadCount}
          </span>
        ) : (
          <span />
        )}
        <span className="self-center text-xs font-medium text-gray-500">
          {lastMessage.timestamp}
        </span>
        <span
          className={cn(
            'col-span-3 text-ellipsis overflow-hidden text-nowrap text-sm self-center font-medium',
            user.unreadCount ? 'text-black dark:text-white' : 'text-gray-400'
          )}
        >
          {lastMessage.content}
        </span>
      </div>
    </button>
  )
}
