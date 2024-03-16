import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

export default function Chat() {
  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <div>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  )
}
