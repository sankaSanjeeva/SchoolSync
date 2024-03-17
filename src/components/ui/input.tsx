import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-10 w-full text-sm px-3 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none',
  {
    variants: {
      variant: {
        default: '',
        search: 'rounded-full bg-gray-100 dark:bg-black',
        chat: 'rounded-full bg-white dark:bg-gray-900 shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        {startAdornment && (
          <div className="absolute top-1/2 left-2">
            <div className="-translate-y-1/2">{startAdornment}</div>
          </div>
        )}

        <input
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />

        {endAdornment && (
          <div className="absolute top-1/2 right-2 shadow">
            <div className="-translate-y-1/2">{endAdornment}</div>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
