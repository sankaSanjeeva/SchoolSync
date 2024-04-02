import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = (): string => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''

  for (let i = 0; i < 20; i += 1) {
    id += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return id
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
