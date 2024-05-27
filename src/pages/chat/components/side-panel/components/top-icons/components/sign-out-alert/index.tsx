import { DialogProps } from '@radix-ui/react-alert-dialog'
import { ref, update } from 'firebase/database'
import { signOut } from 'firebase/auth'
import { auth, database } from '@/firebase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function SignOutAlert(props: DialogProps) {
  const handleSignOut = () => {
    update(ref(database, `/users/${auth.currentUser?.uid}`), {
      online: false,
      lastOnline: +new Date(),
    })
    signOut(auth)
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            After signing out of this account, you will need to sign in again to
            access this page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
