import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Logo from '@/assets/logo.svg?react'
import { auth } from './firebase'
import { Auth, Chat, Error } from './pages'
import { FORCE_LOADING_TIMEOUT } from './constants'

function ProtectedRoute({
  children,
  isAuthenticated,
}: {
  children: ReactNode
  isAuthenticated: boolean
}) {
  return isAuthenticated ? children : <Navigate to="/auth" />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isForceDelay, setIsForceDelay] = useState(true)
  const [loading, setLoading] = useState(true)

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: isAuthenticated ? (
            <Navigate to="/chat" />
          ) : (
            <Navigate to="/auth" />
          ),
          errorElement: <Error />,
        },
        {
          path: 'chat',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Chat />
            </ProtectedRoute>
          ),
        },
        {
          path: 'auth',
          element: <Auth />,
        },
      ]),
    [isAuthenticated]
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    const timeout = setTimeout(() => {
      setIsForceDelay(false)
    }, FORCE_LOADING_TIMEOUT * 1000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  if (loading || isForceDelay) {
    return (
      <div className="h-svh flex justify-center items-center animate-pulse">
        <Logo className="w-32 lg:w-36 xl:w-40" />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export default App
