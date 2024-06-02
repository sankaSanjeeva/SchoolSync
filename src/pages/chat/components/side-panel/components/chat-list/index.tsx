import { AnimatePresence, AnimationProps, motion } from 'framer-motion'
import { ChatItem } from '@/components/common'
import { useChat } from '@/contexts'
import { Chat } from '@/types'
import { Tab } from '@/enums'
import { PenIcon } from '@/assets/icons'

const animationProps: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

interface ChatListProps {
  chats: Chat[] | undefined
  tab?: Tab
}

export default function ChatList({ chats, tab }: ChatListProps) {
  const { setChat } = useChat()

  if (!chats?.length) {
    return (
      <motion.div
        className="h-[calc(100svh_-_176px)] flex justify-center items-center p-2"
        {...animationProps}
      >
        <p className="text-center italic text-gray-500">
          <span>{`No ${tab === Tab.PRIVATE ? 'private' : ''}${tab === Tab.GROUP ? 'group' : ''} chats found.`}</span>
          <br />
          <span>Start a new chat</span>
          <PenIcon className="inline-block ml-1" />
        </p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {chats.map((chat) => (
        <motion.div key={chat.id} {...animationProps} layout>
          <ChatItem chat={chat} onClick={setChat} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
