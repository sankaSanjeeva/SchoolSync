import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formateTime(date: Date | number | undefined) {
  if (!date || Number.isNaN(Number(date))) {
    return ''
  }
  return new Date(date).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}
