import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function ChatItem({
  id,
  name,
  lastMessage,
  time,
  unReadCount,
}: {
  id: number
  name: string
  lastMessage: string
  time: string
  unReadCount?: number
}) {
  return (
    <button
      type="button"
      className={cn(
        'p-[10px] pl-5 flex gap-3 w-full text-left',
        id === 1 && 'bg-gray-100 dark:bg-black transition-colors'
      )}
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto] grid-rows-2 gap-x-2">
        <div className="row-span-2">
          <Avatar active={id === 1 || id === 2}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-ellipsis overflow-hidden text-nowrap font-bold self-center">
          {name}
        </span>
        {unReadCount ? (
          <span className="text-xs px-1 pt-0.5 pb-1 self-center rounded-full text-white leading-none bg-green-500">
            {unReadCount > 99 ? '99+' : unReadCount}
          </span>
        ) : (
          <span />
        )}
        <span className="self-center text-xs font-medium text-gray-500">
          {time}
        </span>
        <span
          className={cn(
            'col-span-3 text-ellipsis overflow-hidden text-nowrap text-sm self-center font-medium',
            unReadCount ? 'text-black dark:text-white' : 'text-gray-400'
          )}
        >
          {lastMessage}
        </span>
      </div>
    </button>
  )
}
