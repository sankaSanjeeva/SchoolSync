import { useState } from 'react'
import { ChatWindow, SidePanel } from './components'
import { Chat as C } from '@/types'

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Partial<C>>()

  return (
    <div className="flex max-w-screen-lg mx-auto h-screen">
      <SidePanel selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      <ChatWindow chat={selectedChat} onCreateChat={setSelectedChat} />
    </div>
  )
}
