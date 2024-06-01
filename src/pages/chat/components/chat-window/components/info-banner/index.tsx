import { PropsWithChildren } from 'react'

export default function InfoBanner({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center pointer-events-none">
      <div className="rounded-lg px-2 text-sm bg-gray-300 dark:bg-gray-900 transition-colors">
        <em className="opacity-50">{children}</em>
      </div>
    </div>
  )
}
