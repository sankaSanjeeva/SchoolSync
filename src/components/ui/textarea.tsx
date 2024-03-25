import * as React from 'react'

import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const inputVariants = cva(
  'flex w-full px-3 focus-visible:outline-none bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        chat: 'rounded-3xl shadow-lg resize-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        {startAdornment && (
          <div className="absolute top-1/2 left-2">
            <div className="-translate-y-1/2">{startAdornment}</div>
          </div>
        )}

        <textarea
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />

        {endAdornment && (
          <div className="absolute top-1/2 right-2">
            <div className="-translate-y-1/2">{endAdornment}</div>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
