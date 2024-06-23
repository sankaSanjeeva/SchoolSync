import { useEffect, useState } from 'react'
import { ChevronIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import FilePreview from '../file-preview'

export default function FilesPreviewer({
  files,
  onRemoveFile,
}: {
  files: File[]
  onRemoveFile: (file: File) => void
}) {
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const element = document.getElementById('editor-file-previewer')
    if (element) {
      setHasScroll(element.scrollWidth > element.clientWidth)
    }
  }, [files])

  useEffect(() => {
    const element = document.getElementById('editor-file-previewer')
    if (!element) return undefined
    const resizeObserver = new ResizeObserver(() => {
      setHasScroll(element.scrollWidth > element.clientWidth)
    })
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="relative ml-4 mr-12 pb-2">
      <div
        id="editor-file-previewer"
        className="flex gap-2 overflow-auto scrollbar-hidden scroll-smooth snap-x"
      >
        {hasScroll && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 dark:bg-black/50"
            onClick={() => {
              document.getElementById('editor-file-previewer')!.scrollLeft -= 88
            }}
          >
            <ChevronIcon className="rotate-90" />
          </Button>
        )}

        {files.map((file) => (
          <FilePreview
            key={file.lastModified}
            file={file}
            className="w-20 h-20"
            onRemove={() => onRemoveFile(file)}
            // onClick={() => console.log('clicked')}
          />
        ))}

        {hasScroll && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 dark:bg-black/50"
            onClick={() => {
              document.getElementById('editor-file-previewer')!.scrollLeft += 88
            }}
          >
            <ChevronIcon className="-rotate-90" />
          </Button>
        )}
      </div>
    </div>
  )
}
