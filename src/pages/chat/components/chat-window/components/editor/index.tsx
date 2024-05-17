import { useMemo } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import { PaperclipIcon, SendIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import 'react-quill/dist/quill.snow.css'

interface Props extends ReactQuillProps {
  onSubmit: () => void
  className?: string
}

export default function Editor({ onSubmit, className, ...rest }: Props) {
  const textContent = useMemo(() => {
    const element = document.createElement('div')
    element.innerHTML = `${rest.value ?? ''}`
    return element.textContent
  }, [rest.value])

  return (
    <div
      className={cn(
        'relative [&_.ql-toolbar]:border-none [&_.ql-container]:border-none [&_.ql-container]:text-base [&_.ql-container]:max-h-[calc(100svh_-_144px)] [&_.ql-container]:overflow-auto',
        className
      )}
    >
      <ReactQuill
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        }}
        className="rounded-3xl shadow-[0_0_10px_0_#0000001a] dark:shadow-[0_0_10px_0_black] bg-white dark:bg-gray-900 [&_.ql-editor]:p-[0px_40px_8px_16px] [&_.ql-editor>*]:word-break [&_.ql-editor.ql-blank::before]:text-gray-500 [&_blockquote]:blockquote transition-all"
        placeholder="Type here"
        theme="snow"
        {...rest}
      />
      {textContent ? (
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full absolute right-2 top-1/2 -translate-y-1/2"
          onClick={onSubmit}
        >
          <SendIcon className="text-gray-500" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full absolute right-2 top-1/2 -translate-y-1/2"
        >
          <PaperclipIcon className="text-gray-500" />
        </Button>
      )}
    </div>
  )
}
