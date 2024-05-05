import { Skeleton, randomWidth } from '@/components/ui/skeleton'
import { ChatType } from '@/enums'
import { cn } from '@/lib/utils'

interface Props {
  type: ChatType | undefined
  isCurrentUser: boolean
}

export default function ChatBubbleSkeleton({ type, isCurrentUser }: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_minmax(100px,_1fr)] grid-rows-[auto_minmax(auto,_1fr)_auto] w-full max-w-[calc(100%_-_100px)] px-3',
        isCurrentUser && 'mr-0 ml-auto'
      )}
    >
      {type === ChatType.GROUP && !isCurrentUser && (
        <>
          <Skeleton
            className="col-start-2 mb-1 mx-3 h-4 max-w-40 bg-gray-300"
            style={{ width: randomWidth() }}
          />
          <Skeleton className="h-12 w-12 mr-3 rounded-full" />
        </>
      )}
      <Skeleton
        className={cn(
          'col-start-2 h-12 self-center bg-gray-300',
          isCurrentUser && 'mr-0 ml-auto'
        )}
        style={{ width: randomWidth() }}
      />
      <Skeleton
        className={cn(
          'col-start-2 h-4 w-16 mt-1 mx-3 bg-gray-300',
          isCurrentUser && 'mr-0 ml-auto'
        )}
      />
    </div>
  )
}
