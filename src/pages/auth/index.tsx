import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/firebase'
import { Button } from '@/components/ui/button'

export default function Auth() {
  const navigate = useNavigate()

  const handleSignUp = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate('/chat')
    })
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleSignUp}>Sign up with google</Button>
    </div>
  )
}
