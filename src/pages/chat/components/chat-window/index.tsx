import { ChangeEvent } from 'react'
import { auth } from '@/firebase'
import { Chat } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreIcon, PaperclipIcon, SmileyIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const active = true

export default function ChatWindow({ chat }: { chat?: Partial<Chat> }) {
  const receiver = chat?.members?.find((u) => u.uid !== auth.currentUser?.uid)

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`
  }

  return (
    <main className="flex flex-grow bg-gray-100 dark:bg-black transition-colors">
      {chat ? (
        <div className="flex flex-col w-full">
          <header className="px-5 py-3 mx-0.5 grid grid-cols-[auto_1fr_auto] grid-rows-2 gap-x-2 [&>*]:self-center bg-white dark:bg-gray-900">
            <div className="row-span-2">
              <Avatar active={active}>
                <AvatarImage src={receiver?.picture} />
                <AvatarFallback>
                  {receiver?.name?.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <span>{receiver?.name}</span>
            <Button variant="ghost" size="icon" className="row-span-2">
              <MoreIcon />
            </Button>
            <span className="text-xs text-gray-400">Online</span>
          </header>

          {/* <ScrollArea className="h-full"> */}

          <div className="flex flex-col-reverse overflow-auto">
            <div className="p-10">hello1</div>
            <div className="p-10">hello2</div>
            <div className="p-10">hello3</div>
            <div className="p-10">hello4</div>
            <div className="p-10">hello5</div>
            <div className="p-10">hello6</div>
            <div className="p-10">hello7</div>
            <div className="p-10">hello8</div>
            <div className="p-10">hello9</div>
            <div className="p-10">hello</div>
          </div>

          {/* </ScrollArea> */}

          <div className="p-5">
            <Textarea
              variant="chat"
              rows={1}
              startAdornment={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <SmileyIcon />
                </Button>
              }
              endAdornment={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <PaperclipIcon />
                </Button>
              }
              className="px-[54px] py-3"
              onChange={handleInput}
            />
          </div>
        </div>
      ) : (
        <div />
      )}
    </main>
  )
}
