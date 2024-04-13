import { createContext, useContext, useMemo } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { ref } from 'firebase/database'
import { User } from '@/types'
import { database } from '@/firebase'

type UserProviderProps = {
  children: React.ReactNode
}

type UserProviderState = {
  users: User[]
  loading: boolean
}

const UserProviderContext = createContext<UserProviderState>({
  users: [],
  loading: false,
})

export function UserProvider({ children, ...props }: UserProviderProps) {
  const [users, loading] = useListVals<User>(ref(database, 'users'))

  const value = useMemo(
    () => ({
      users: users ?? [],
      loading,
    }),
    [loading, users]
  )

  return (
    <UserProviderContext.Provider {...props} value={value}>
      {children}
    </UserProviderContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserProviderContext)

  if (context === undefined)
    throw new Error('useUser must be used within a UserProvider')

  return context
}
