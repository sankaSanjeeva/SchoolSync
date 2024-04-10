import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, update } from 'firebase/database'
import { ChatWindow, SidePanel } from './components'
import { Chat as C } from '@/types'
import { auth, database } from '@/firebase'

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Partial<C>>()

  const uid = auth.currentUser?.uid

  const userRef = ref(database, `/users/${uid}`)

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, '.info/connected'),
      (snapshot) => {
        if (snapshot.val() === false) {
          return
        }

        onDisconnect(userRef)
          .update({
            onlineStatus: false,
            onlineStatusChanged: +new Date(),
          })
          .then(() => {
            update(userRef, {
              onlineStatus: true,
              onlineStatusChanged: +new Date(),
            })
          })
      }
    )

    return () => {
      update(userRef, {
        onlineStatus: false,
        onlineStatusChanged: +new Date(),
      })
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex max-w-screen-lg mx-auto h-screen">
      <SidePanel selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      <ChatWindow chat={selectedChat} onCreateChat={setSelectedChat} />
    </div>
  )
}
