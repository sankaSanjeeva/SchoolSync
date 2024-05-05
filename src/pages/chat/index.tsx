import { useEffect, useState } from 'react'
import { onDisconnect, onValue, ref, update } from 'firebase/database'
import { ChatWindow, SidePanel } from './components'
import { Chat as C } from '@/types'
import { auth, database } from '@/firebase'
import { UserProvider } from '@/hooks/user'

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
            online: false,
            lastOnline: +new Date(),
          })
          .then(() => {
            update(userRef, {
              online: true,
              lastOnline: +new Date(),
            })
          })
      }
    )

    return () => {
      update(userRef, {
        online: false,
        lastOnline: +new Date(),
      })
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserProvider>
      <div className="flex max-w-screen-lg mx-auto h-svh">
        <SidePanel selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        <ChatWindow chat={selectedChat} onCreateChat={setSelectedChat} />
      </div>
    </UserProvider>
  )
}
