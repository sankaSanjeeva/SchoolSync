import { useMemo, useState } from 'react'
import { differenceInMinutes } from 'date-fns'
import { doc, updateDoc } from 'firebase/firestore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronIcon } from '@/assets/icons'
import { Chat, Message } from '@/types'
import { auth, db } from '@/firebase'
import { MSG_DELETE_FOR_ME_TIMEOUT } from '@/constants'
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
import { MsgStatus } from '@/enums'

export default function Actions({
  chatId,
  id,
  senderID,
  timestamp,
  deletedFor = [],
}: Message & { chatId: Chat['id'] }) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  // const showEdit = useMemo(
  //   () =>
  //     auth.currentUser?.uid === senderID &&
  //     differenceInMinutes(+new Date(), timestamp) < MSG_EDIT_TIMEOUT,
  //   [senderID, timestamp]
  // )

  const showDeleteForEveryone = useMemo(
    () =>
      auth.currentUser?.uid === senderID &&
      differenceInMinutes(+new Date(), timestamp) < MSG_DELETE_FOR_ME_TIMEOUT,
    [senderID, timestamp]
  )

  const deleteMessageForMe = () => {
    updateDoc(doc(db, `chats/${chatId}/messages/${id}`), {
      deletedFor: [...deletedFor, auth.currentUser?.uid],
    })
  }

  const deleteMessageForEveryone = () => {
    updateDoc(doc(db, `chats/${chatId}/messages/${id}`), {
      status: MsgStatus.DELETED,
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            id="action-trigger"
            className="absolute top-1 right-1 h-auto w-auto rounded-full opacity-0 transition-opacity"
          >
            <ChevronIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* {showEdit && <DropdownMenuItem>Edit</DropdownMenuItem>} */}
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The &quot;delete for me&quot; option will only remove the message
              from your chat, while the &quot;delete for everyone&quot; option
              will remove the message from both your chat and the
              recipient&apos;s chat
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <div className="flex gap-2 flex-col-reverse sm:flex-row sm:justify-end">
              <AlertDialogAction onClick={deleteMessageForMe}>
                Delete for me
              </AlertDialogAction>
              {showDeleteForEveryone && (
                <AlertDialogAction onClick={deleteMessageForEveryone}>
                  Delete for everyone
                </AlertDialogAction>
              )}
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
