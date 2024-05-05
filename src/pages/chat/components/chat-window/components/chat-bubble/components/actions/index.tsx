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
import { MSG_DELETE_FOR_ME_TIMEOUT, MSG_EDIT_TIMEOUT } from '@/constants'
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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import Editor from '../../../editor'

interface Props extends Message {
  chatId: Chat['id']
  isLast: boolean
}

export default function Actions({
  chatId,
  id,
  content,
  senderID,
  timestamp,
  status,
  deletedFor = [],
  isLast,
}: Props) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newMessage, setNewMessage] = useState(content)

  const showEdit = useMemo(
    () =>
      auth.currentUser?.uid === senderID &&
      differenceInMinutes(+new Date(), timestamp) < MSG_EDIT_TIMEOUT,
    [senderID, timestamp]
  )

  const showDeleteForEveryone = useMemo(
    () =>
      auth.currentUser?.uid === senderID &&
      differenceInMinutes(+new Date(), timestamp) < MSG_DELETE_FOR_ME_TIMEOUT,
    [senderID, timestamp]
  )

  const updateLastMessage = (
    newStatus: Message['status'],
    newDeletedFor = deletedFor
  ) => {
    if (isLast) {
      updateDoc(doc(db, `chats/${chatId}`), {
        lastMessage: {
          content: newMessage,
          status: newStatus,
          deletedFor: newDeletedFor,
          timestamp,
        },
      })
    }
  }

  const deleteMessageForMe = () => {
    const newDeletedFor = [...deletedFor, auth.currentUser?.uid ?? '']

    updateDoc(doc(db, `chats/${chatId}/messages/${id}`), {
      deletedFor: newDeletedFor,
    })
    updateLastMessage(status, newDeletedFor)
  }

  const deleteMessageForEveryone = () => {
    updateDoc(doc(db, `chats/${chatId}/messages/${id}`), {
      status: MsgStatus.DELETED,
    })
    updateLastMessage(MsgStatus.DELETED)
  }

  const editMessage = () => {
    updateDoc(doc(db, `chats/${chatId}/messages/${id}`), {
      content: newMessage,
      status: MsgStatus.EDITED,
    })
    updateLastMessage(MsgStatus.EDITED)
    setShowEditDialog(false)
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
          {showEdit && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogTitle>Edit message</DialogTitle>
          <Editor
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={editMessage}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {`The "Delete for me" option will only remove the message from your chat${showDeleteForEveryone && `, while the "Delete for everyone" option will remove the message from both your chat and the recipient's chat`}`}
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
