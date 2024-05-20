import { doc, updateDoc } from 'firebase/firestore'
import { DialogProps } from '@radix-ui/react-alert-dialog'
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
import { auth, db } from '@/firebase'
import { useChat } from '@/contexts'

export default function LeaveGroup(props: DialogProps) {
  const { chat } = useChat()

  const handleLeaveGroup = () => {
    updateDoc(doc(db, `chats/${chat?.id}`), {
      participants: chat?.participants?.filter(
        (uid) => uid !== auth.currentUser?.uid
      ),
      participantsMeta: chat?.participantsMeta?.filter(
        (meta) => meta.uid !== auth.currentUser?.uid
      ),
    })
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Group?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you leave the group, you won&apos;t be able to see old messages
            or rejoin by yourself. You&apos;ll need someone in the group to add
            you back.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveGroup}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
