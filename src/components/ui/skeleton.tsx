import { cn } from '@/lib/utils'

const randomWidth = () => {
  let random = Math.random()

  if (random < 0.25) {
    random += 0.25
  }

  return `${random * 100}%`
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-100 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton, randomWidth }
