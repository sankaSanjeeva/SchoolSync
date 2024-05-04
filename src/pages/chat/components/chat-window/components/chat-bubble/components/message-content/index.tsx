import { Chat, Message } from '@/types'
import Actions from '../actions'
import { MsgStatus } from '@/enums'
import { DoubleTickIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { auth } from '@/firebase'

interface Props extends Message {
  chatId: Chat['id']
  isCurrentUser: boolean
  isLast: boolean
}

function DeleteBanner({ text }: { text: string }) {
  return (
    <div className="col-start-2 rounded-lg px-2 pointer-events-none bg-gray-300 dark:bg-gray-900 transition-colors">
      <em className="opacity-50">{text}</em>
    </div>
  )
}
export default function MessageContent(props: Props) {
  const { content, status, deletedFor, isCurrentUser } = props

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
        'col-start-2 self-center relative rounded-lg p-3 [&:hover>#action-trigger]:opacity-100 bg-gray-300 dark:bg-gray-900 transition-colors',
        !isCurrentUser && 'bg-[#005c4b] dark:bg-[#005c4b]'
      )}
    >
      <Actions {...props} />

      <div
        className={cn(
          '[&_blockquote]:blockquote',
          '[&>*]:word-break text-black dark:text-gray-100',
          !isCurrentUser && '!text-white [&_blockquote]:!bg-[#005040]'
        )}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {isCurrentUser && (
        <DoubleTickIcon
          className={cn(
            'absolute bottom-0.5 right-1 transition-colors',
            [MsgStatus.READ, MsgStatus.EDITED].includes(status) && 'text-theme'
          )}
        />
      )}
    </div>
  )
}
