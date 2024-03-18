import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { Auth, Chat, Error } from './pages'

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

    return () => unsubscribe()
  }, [])

  if (loading) {
    return 'Loading...'
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
