import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import { PaperclipIcon, SendIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks'
import { cn } from '@/lib/utils'
import { FilesPreviewer } from './components'
import 'react-quill/dist/quill.snow.css'

interface Props extends ReactQuillProps {
  onSubmit: () => void
  className?: string
  editMessage?: boolean
}

const Editor = forwardRef<ReactQuill, Props>(
  ({ onSubmit, className, editMessage = false, ...rest }, ref) => {
    const editorHint = useRef<HTMLSpanElement>(null)

    const [files, setFiles] = useState<File[]>([])

    const isDesktop = useMediaQuery('(min-width: 768px)')

    const hasTextContent = useMemo(() => {
      const element = document.createElement('div')
      element.innerHTML = `${rest.value ?? ''}`
      return !!element.textContent
    }, [rest.value])

    const selectFile = () => {
      const input = document.createElement('input')
      input.type = 'file'
      // input.accept = 'image/*'
      input.multiple = true
      input.onchange = () => {
        setFiles((prev) => [...prev, ...input.files!])
      }
      input.click()
    }

    const onRemoveFile = (file: File) => {
      setFiles((prev) => prev.filter((f) => f !== file))
    }

    useEffect(() => {
      editorHint.current?.animate(
        {
          opacity: [0, 0.4],
        },
        300
      )
    }, [hasTextContent])

    return (
      <div
        className={cn(
          'relative bg-white dark:bg-gray-900 shadow-[0_0_10px_0_#0000001a] dark:shadow-[0_0_10px_0_black]',
          editMessage && 'shadow-none dark:shadow-none',
          className
        )}
        onKeyDownCapture={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
      >
        <ReactQuill
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          }}
          className="[&_.ql-toolbar]:border-none [&_.ql-container]:border-none [&_.ql-container]:text-base [&_.ql-container]:max-h-[calc(100svh_-_144px)] [&_.ql-container]:overflow-auto [&_.ql-editor]:p-[0px_44px_8px_16px] [&_.ql-editor>*]:word-break [&_.ql-editor.ql-blank::before]:text-gray-500 [&_blockquote]:blockquote transition-all"
          placeholder="Type here"
          theme="snow"
          ref={ref}
          {...rest}
        />

        {hasTextContent || editMessage ? (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full absolute right-2 top-1/2 -translate-y-1/2"
            onClick={onSubmit}
            disabled={!hasTextContent}
          >
            <SendIcon className="text-gray-500" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full absolute right-2 top-1/2 -translate-y-1/2"
            onClick={selectFile}
          >
            <PaperclipIcon className="text-gray-500" />
          </Button>
        )}

        {hasTextContent && isDesktop && (
          <span
            className="absolute top-1 right-14 text-xs opacity-40"
            ref={editorHint}
          >
            Shift + Enter to add a new line
          </span>
        )}

        <FilesPreviewer files={files} onRemoveFile={onRemoveFile} />
      </div>
    )
  }
)
Editor.displayName = 'Editor'

export default Editor
