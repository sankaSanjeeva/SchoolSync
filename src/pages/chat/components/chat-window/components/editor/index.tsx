import ReactQuill, { ReactQuillProps } from 'react-quill'
import { PaperclipIcon, SendIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import 'react-quill/dist/quill.snow.css'

interface Props extends ReactQuillProps {
  onSend: () => void
}

export default function Editor({ onSend, ...rest }: Props) {
  const textContent = document.querySelector('.ql-editor')?.textContent

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
        className="rounded-3xl shadow-lg bg-white dark:bg-gray-900 [&_.ql-editor]:p-[0px_40px_8px_16px] [&_.ql-editor.ql-blank::before]:text-gray-500 [&_blockquote]:blockquote"
        placeholder="Type here"
        theme="snow"
        {...rest}
      />
      {textContent ? (
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full absolute right-2 top-1/2 -translate-y-1/2"
          onClick={onSend}
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
