import { Skeleton, randomWidth } from '@/components/ui/skeleton'

export default function ChatItemSkeleton() {
  return (
    <div className="w-full grid grid-cols-[auto_1fr_auto_auto] grid-rows-2 gap-x-2 p-[10px] pl-5">
      <div className="row-span-2">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
      </div>

      <Skeleton className="h-5 self-center" style={{ width: randomWidth() }} />

      <span />

      <Skeleton className="h-4 w-11 self-center" />

      <Skeleton
        className="col-span-3 h-4 self-center"
        style={{ width: randomWidth() }}
      />
    </div>
  )
}
