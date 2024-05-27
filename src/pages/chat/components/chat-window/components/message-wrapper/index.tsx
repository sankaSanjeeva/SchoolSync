import { PropsWithChildren, useEffect, useMemo } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { useElementIsVisible } from '@/hooks'
import { auth, db } from '@/firebase'
import { useChat } from '@/contexts'
import { Message } from '@/types'
import { MsgStatus } from '@/enums'

interface Props extends PropsWithChildren {
  message: Message
  isLast: boolean
}

export default function MessageWrapper({ message, isLast, children }: Props) {
  const { ref, visible } = useElementIsVisible({ threshold: 0.8 })

  const { chat } = useChat()

  const shouldAddRef = useMemo(
    () =>
      !(auth.currentUser?.uid === message.senderID) &&
      // if group chat
      ((chat?.type === 'group' && isLast) ||
        // if private chat
        (chat?.type === 'private' && message.status === MsgStatus.SENT)),
    [chat?.type, isLast, message.senderID, message.status]
  )

  useEffect(() => {
    if (visible) {
      if (chat?.type === 'private') {
        updateDoc(doc(db, `chats/${chat?.id}/messages/${message.id}`), {
          status: MsgStatus.READ,
        })
      }
      if (isLast) {
        updateDoc(doc(db, `chats/${chat?.id}`), {
          participantsMeta: chat?.participantsMeta?.map((participant) => {
            if (participant.uid === auth.currentUser?.uid) {
              return {
                ...participant,
                unreadCount: 0,
              }
            }
            return participant
          }),
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return <div {...(shouldAddRef && { ref })}>{children}</div>
}
