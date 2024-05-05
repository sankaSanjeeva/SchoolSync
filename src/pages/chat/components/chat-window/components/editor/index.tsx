import { useMemo } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import { PaperclipIcon, SendIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import 'react-quill/dist/quill.snow.css'

interface Props extends ReactQuillProps {
  onSubmit: () => void
}

export default function Editor({ onSubmit, ...rest }: Props) {
  const textContent = useMemo(() => {
    const element = document.createElement('div')
    element.innerHTML = `${rest.value ?? ''}`
    return element.textContent
  }, [rest.value])

  return (
    <div className="relative p-2 [&_.ql-toolbar]:border-none [&_.ql-container]:border-none [&_.ql-container]:text-base">
      <ReactQuill
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ],
        }}
        className="rounded-3xl shadow-lg bg-white dark:bg-gray-900 [&_.ql-editor]:p-[0px_40px_8px_16px] [&_.ql-editor>*]:word-break [&_.ql-editor.ql-blank::before]:text-gray-500 [&_blockquote]:blockquote"
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
