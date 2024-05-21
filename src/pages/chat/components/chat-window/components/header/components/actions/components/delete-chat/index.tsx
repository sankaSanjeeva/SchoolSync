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

export default function DeleteChat(props: DialogProps) {
  const { chat } = useChat()

  const handleChatDelete = () => {
    updateDoc(doc(db, `chats/${chat?.id}`), {
      participantsMeta: chat?.participantsMeta?.map((participant) => {
        if (participant.uid === auth.currentUser?.uid) {
          return { ...participant, lastDeletedOn: +new Date() }
        }
        return participant
      }),
    })
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you delete the chat, you won&apos;t be able to see the old
            messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleChatDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
