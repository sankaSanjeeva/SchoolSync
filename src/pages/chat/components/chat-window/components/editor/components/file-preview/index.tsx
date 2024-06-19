import { ButtonHTMLAttributes, useCallback, useEffect, useState } from 'react'
import { CloseIcon, FileIcon, PdfIcon, PlayIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  file: File
  className?: string
  onRemove: () => void
}

export default function FilePreview({
  file,
  className,
  onRemove,
  ...rest
}: Props) {
  const [preview, setPreview] = useState<string>()

  const getPreview = useCallback(() => {
    if (file.type.startsWith('image')) {
      return (
        <img
          src={preview}
          alt="preview"
          className={cn('object-cover w-40 h-40', className)}
        />
      )
    }

    if (file.type.startsWith('video')) {
      return (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={preview}
            className={cn('object-cover w-40 h-40', className)}
          />
          <PlayIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
        </>
      )
    }

    return (
      <div className="flex h-full items-center p-2">
        {file.type === 'application/pdf' ? (
          <PdfIcon className="w-16 h-16" />
        ) : (
          <FileIcon className="w-16 h-16 text-gray-500" />
        )}
        <span className="max-w-40 overflow-hidden text-ellipsis text-nowrap ml-1">
          {file.name}
        </span>
      </div>
    )
  }, [className, file.name, file.type, preview])

  useEffect(() => {
    if (!file) {
      setPreview(undefined)
      return undefined
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <button
      type="button"
      className={cn(
        "relative flex-shrink-0 rounded-md overflow-hidden snap-start group before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:absolute hover:before:bg-black/20 before:transition-colors",
        file.type.startsWith('video') && 'before:bg-black/20'
      )}
      {...rest}
    >
      <CloseIcon
        className="w-5 h-5 z-10 absolute top-0 right-0 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all text-white"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      />

      {getPreview()}
    </button>
  )
}
