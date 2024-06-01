import { createContext, useContext, useMemo } from 'react'
import { useListVals } from 'react-firebase-hooks/database'
import { ref } from 'firebase/database'
import { User } from '@/types'
import { auth, database } from '@/firebase'

type UserProviderProps = {
  children: React.ReactNode
}

type UserProviderState = {
  user: User | undefined
  users: User[] | undefined
  loading: boolean
}

const UserProviderContext = createContext<UserProviderState>({
  user: undefined,
  users: undefined,
  loading: false,
})

export function UserProvider({ children, ...props }: UserProviderProps) {
  const [users, loading] = useListVals<User>(ref(database, 'users'))

  const value = useMemo(
    () => ({
      user: users?.find(({ uid }) => uid === auth.currentUser?.uid),
      users,
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
