import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/firebase'

export default function Auth() {
  const navigate = useNavigate()

  const handleSignUp = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate('/chat')
    })
  }

  return (
    <div>
      <button type="button" onClick={handleSignUp}>
        Sign up with google
      </button>
    </div>
  )
}
