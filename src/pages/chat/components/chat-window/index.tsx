import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { Button } from '@/components/ui/button'

export default function ChatWindow() {
  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <main className="flex-grow bg-gray-100">
      <Button onClick={handleSignOut}>Sign Out</Button>
    </main>
  )
}
