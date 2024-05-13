import { Message } from '@/types'
import Actions from '../actions'
import { MsgStatus } from '@/enums'
import { DoubleTickIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { auth } from '@/firebase'
import { useChat } from '@/contexts'

interface Props extends Message {
  isCurrentUser: boolean
  isLast: boolean
  className?: string
}

function DeleteBanner({ text }: { text: string }) {
  return (
    <div className="col-start-2 self-center rounded-lg px-2 pointer-events-none bg-gray-300 dark:bg-gray-900 transition-colors">
      <em className="opacity-50">{text}</em>
    </div>
  )
}

export default function MessageContent(props: Props) {
  const { className, content, status, deletedFor, isCurrentUser } = props

  const { chat } = useChat()

  if (
    (status === MsgStatus.DELETED && isCurrentUser) ||
    deletedFor?.includes(auth.currentUser?.uid ?? '')
  ) {
    return <DeleteBanner text="you deleted this message" />
  }

  if (status === MsgStatus.DELETED && !isCurrentUser) {
    return <DeleteBanner text="this message was deleted" />
  }

  return (
    <div
      className={cn(
        className,
        'relative rounded-lg p-3 [&:hover>#action-trigger]:opacity-100 bg-gray-300 dark:bg-gray-900 transition-colors',
        isCurrentUser && 'bg-[#005c4b] dark:bg-[#005c4b]'
      )}
    >
      <Actions {...props} />

      <div
        className={cn(
          '[&_blockquote]:blockquote',
          '[&>*]:word-break text-black dark:text-gray-100',
          isCurrentUser && 'text-white [&_blockquote]:!bg-[#005040]'
        )}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {isCurrentUser && chat?.type === 'private' && (
        <DoubleTickIcon
          className={cn(
            'absolute bottom-0.5 right-1 text-gray-400 transition-colors',
            status === MsgStatus.READ && 'text-theme'
          )}
        />
      )}
    </div>
  )
}
