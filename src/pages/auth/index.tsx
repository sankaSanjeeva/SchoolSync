import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { getAdditionalUserInfo, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { Button } from '@/components/ui/button'
import { Role } from '@/enums'
import { SpinnerIcon } from '@/assets/icons'

export default function Auth() {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [signInWithGoogle, , , error] = useSignInWithGoogle(auth)

  const handleSignUp = async () => {
    setLoading(true)

    const userCredential = await signInWithGoogle()

    const user = getAdditionalUserInfo(userCredential!)

    if (user?.isNewUser) {
      await setDoc(doc(db, 'users', user?.profile?.id as string), {
        name: user?.profile?.name,
        email: user?.profile?.email,
        picture: user?.profile?.picture,
        role: Role.User,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/chat')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  return (
    <div className="flex justify-center items-center h-screen">
      <Button disabled={loading} onClick={handleSignUp}>
        {loading && <SpinnerIcon className="animate-spin mr-3" />}
        <span>Sign in with google</span>
      </Button>
    </div>
  )
}
