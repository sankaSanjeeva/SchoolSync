import { useEffect } from 'react'
import { onDisconnect, onValue, ref, update } from 'firebase/database'
import { ChatWindow, SidePanel } from './components'
import { auth, database } from '@/firebase'
import { ChatProvider, UserProvider } from '@/contexts'

export default function Chat() {
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
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserProvider>
      <ChatProvider>
        <div className="flex max-w-screen-lg mx-auto h-svh">
          <SidePanel />
          <ChatWindow />
        </div>
      </ChatProvider>
    </UserProvider>
  )
}
