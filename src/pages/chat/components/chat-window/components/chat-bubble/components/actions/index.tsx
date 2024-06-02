import { useEffect, useMemo, useRef, useState } from 'react'
import { differenceInMinutes } from 'date-fns'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import ReactQuill from 'react-quill'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronIcon, PencilIcon, TrashIcon } from '@/assets/icons'
import { Message } from '@/types'
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
import { useChat } from '@/contexts'
import Editor from '../../../editor'

interface Props extends Message {
  isLast: boolean
}

export default function Actions({
  id,
  content,
  senderID,
  timestamp,
  isLast,
}: Props) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newMessage, setNewMessage] = useState(content)

  const editor = useRef<ReactQuill>(null)

  const { chat } = useChat()

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

  const handleEditorOpen = (open: boolean) => {
    if (!open) {
      setNewMessage(content)
    }
    setShowEditDialog(open)
  }

  const deleteMessageForMe = () => {
    updateDoc(doc(db, `chats/${chat?.id}/messages/${id}`), {
      deletedFor: arrayUnion(auth.currentUser?.uid),
    })

    if (isLast) {
      updateDoc(doc(db, `chats/${chat?.id}`), {
        participantsMeta: chat?.participantsMeta?.map((participant) => {
          if (participant.uid === auth.currentUser?.uid) {
            return {
              ...participant,
              lastMessageContent: 'you deleted this message',
            }
          }
          return participant
        }),
      })
    }
  }

  const deleteMessageForEveryone = () => {
    updateDoc(doc(db, `chats/${chat?.id}/messages/${id}`), {
      status: MsgStatus.DELETED,
    })

    if (isLast) {
      updateDoc(doc(db, `chats/${chat?.id}`), {
        participantsMeta: chat?.participantsMeta?.map((participant) => ({
          ...participant,
          lastMessageContent:
            participant.uid === auth.currentUser?.uid
              ? 'you deleted this message'
              : 'this message was deleted',
        })),
      })
    }
  }

  const editMessage = () => {
    updateDoc(doc(db, `chats/${chat?.id}/messages/${id}`), {
      content: newMessage,
      edited: true,
    })

    if (isLast) {
      updateDoc(doc(db, `chats/${chat?.id}`), {
        lastMessage: {
          content: newMessage,
          timestamp,
        },
      })
    }

    setShowEditDialog(false)
  }

  useEffect(() => {
    if (showEditDialog) {
      setTimeout(() => {
        editor.current?.focus()
      }, 0)
    }
  }, [showEditDialog])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            id="action-trigger"
            className="absolute top-1 right-1 h-auto w-auto rounded-full hover:bg-black/15 opacity-0 transition-all"
          >
            <ChevronIcon className="text-gray-800 dark:text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {showEdit && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Edit
              <DropdownMenuShortcut>
                <PencilIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500 focus:!text-red-500"
            onClick={() => setShowDeleteAlert(true)}
          >
            Delete
            <DropdownMenuShortcut>
              <TrashIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={handleEditorOpen}>
        <DialogContent className="max-w-2xl w-[96%]">
          <DialogTitle>Edit message</DialogTitle>
          <Editor
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={editMessage}
            ref={editor}
            editMessage
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
