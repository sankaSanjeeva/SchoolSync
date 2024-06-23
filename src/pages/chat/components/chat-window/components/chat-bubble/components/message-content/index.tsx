import { useState } from 'react'
import { Message } from '@/types'
import Actions from '../actions'
import { MsgStatus } from '@/enums'
import { DoubleTickIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { auth } from '@/firebase'
import { useChat } from '@/contexts'
import FilePreview from '../file-preview'
import FilePreviewDialog from '../../../file-preview-dialog'

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
  const { className, content, status, deletedFor, attachments, isCurrentUser } =
    props

  const [openFilePreview, setOpenFilePreview] = useState(false)

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

  const handleClick = () => {
    setOpenFilePreview(true)
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

      <button
        type="button"
        className={cn(
          attachments && attachments?.length > 1
            ? 'grid grid-cols-2 gap-2'
            : 'flex'
        )}
        onClick={handleClick}
      >
        {attachments?.slice(0, 4)?.map((attachment, i) => (
          <FilePreview
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            attachment={attachment}
          />
        ))}
        {attachments && attachments?.length > 4 && (
          <div className="absolute bottom-3 right-3 w-40 h-40 flex justify-center items-center bg-black/50">
            + {attachments.length - 3} items
          </div>
        )}
      </button>

      {isCurrentUser && chat?.type === 'private' && (
        <DoubleTickIcon
          className={cn(
            'absolute bottom-0.5 right-1 text-gray-400 transition-colors',
            status === MsgStatus.READ && 'text-theme'
          )}
        />
      )}

      {openFilePreview && attachments && (
        <FilePreviewDialog
          open
          onOpenChange={setOpenFilePreview}
          attachments={attachments}
        />
      )}
    </div>
  )
}
