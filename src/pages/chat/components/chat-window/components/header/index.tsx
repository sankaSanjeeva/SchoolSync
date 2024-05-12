import { useMemo } from 'react'
import { formatDistance } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { GroupIcon, MoreIcon } from '@/assets/icons'
import { useChat, useUser } from '@/contexts'
import { User } from '@/types'
import { auth } from '@/firebase'

export default function Header() {
  const { users } = useUser()
  const { chat } = useChat()

  const conversant = useMemo(() => {
    if (chat?.type === 'group') {
      return {
        name: chat.name,
      } as User
    }
    const conversantId = chat?.participants?.find(
      (participant) => participant !== auth.currentUser?.uid
    )
    return users?.find((user) => user.uid === conversantId)
  }, [chat?.name, chat?.participants, chat?.type, users])

  const subText = useMemo(() => {
    if (chat?.type === 'group') {
      return `${chat?.participants?.length} members`
    }
    if (conversant?.online) {
      return 'Online'
    }
    return formatDistance(conversant?.lastOnline ?? new Date(), new Date(), {
      addSuffix: true,
    })
  }, [
    chat?.participants?.length,
    chat?.type,
    conversant?.lastOnline,
    conversant?.online,
  ])

  return (
    <header className="px-5 py-3 mx-0.5 grid grid-cols-[auto_1fr_auto] grid-rows-2 gap-x-2 [&>*]:self-center shadow-lg dark:shadow-[0_5px_10px_0_black] z-10 bg-white dark:bg-gray-900 transition-colors">
      <div className="row-span-2">
        <Avatar active={conversant?.online}>
          <AvatarImage src={conversant?.picture} />
          <AvatarFallback>
            {chat?.type === 'private' ? (
              conversant?.name?.at(0)?.toUpperCase()
            ) : (
              <GroupIcon className="h-8 w-8" />
            )}
          </AvatarFallback>
        </Avatar>
      </div>
      <span>{conversant?.name}</span>
      <Button variant="ghost" size="icon" className="row-span-2">
        <MoreIcon />
      </Button>

      <span className="text-xs text-gray-400">{subText}</span>
    </header>
  )
}
