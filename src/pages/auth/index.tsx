import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { getAdditionalUserInfo, onAuthStateChanged } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, database } from '@/firebase'
import { Button } from '@/components/ui/button'
import { Role } from '@/enums'
import { SpinnerIcon } from '@/assets/icons'
import { User } from '@/types'

export default function Auth() {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [signInWithGoogle, , , error] = useSignInWithGoogle(auth)

  const handleSignUp = async () => {
    setLoading(true)

    const userCredential = await signInWithGoogle()

    const user = getAdditionalUserInfo(userCredential!)

    if (!userCredential?.user.uid) {
      throw new Error('uid is not defined')
    }

    const newUser: User = {
      uid: userCredential?.user.uid,
      name: user?.profile?.name as string,
      email: user?.profile?.email as string,
      picture: user?.profile?.picture as string,
      role: Role.User,
      online: true,
      lastOnline: +new Date(),
    }

    if (user?.isNewUser) {
      await set(ref(database, `users/${userCredential.user.uid}`), newUser)
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
