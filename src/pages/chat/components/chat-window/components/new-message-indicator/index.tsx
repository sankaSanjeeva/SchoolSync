import { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { ChevronIcon } from '@/assets/icons'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  messageCount: number
}

export default function NewMessageIndicator({ messageCount, ...rest }: Props) {
  const [render, setRender] = useState(false)

  /**
   * Since the initial value of "loading" was false in the parent component, this component was displayed unnecessarily. A delay was added to fix it.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  if (!render) {
    return null
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute bottom-0 right-1/2 translate-x-1/2"
        {...rest}
      >
        <div className="flex flex-col items-center rounded-2xl px-3 py-1 opacity-70 hover:opacity-100 transition-opacity shadow-lg bg-gray-400 dark:bg-gray-800">
          <span>
            {messageCount === 1
              ? 'New message'
              : `${messageCount} new messages`}
          </span>
          <ChevronIcon className="animate-bounce" />
        </div>
      </button>
    </div>
  )
}
