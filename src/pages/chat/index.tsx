import { ChatWindow, SidePanel } from './components'

export default function Chat() {
  return (
    <div className="flex max-w-screen-lg mx-auto h-screen">
      <SidePanel />
      <ChatWindow />
    </div>
  )
}
