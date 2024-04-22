import { memo, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, orderBy, query, where } from 'firebase/firestore'
import { SearchIcon, ThinArrowIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChatItem,
  ChatItemSkeleton,
  SearchResult,
  TopIcons,
} from './components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tab } from '@/enums'
import { auth, db } from '@/firebase'
import { Chat, chatConverter } from '@/types'
import { useMediaQuery } from '@/hooks'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

interface Props {
  selectedChat?: Partial<Chat>
  onSelectChat?: (chat?: Partial<Chat>) => void
}

export default function SidePanel({ selectedChat, onSelectChat }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(true)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [chats, loading] = useCollectionData(
    query(
      collection(db, 'chats').withConverter(chatConverter),
      where('participants', 'array-contains', auth.currentUser?.uid),
      orderBy('lastMessage.timestamp', 'desc')
    )
  )

  useEffect(() => {
    const chat = chats?.find(({ id }) => id === selectedChat?.id)
    if (chat) {
      onSelectChat?.(chat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats])

  const Component = memo(function Component() {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get('search') ?? ''

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target

      setSearchParams((params) => {
        if (value) {
          params.set('search', value)
        } else {
          params.delete('search')
        }
        return params
      })
    }

    const handleSelectSearchedChat = (chat?: Partial<Chat>) => {
      onSelectChat?.(chat)
      setSearchParams((params) => {
        params.delete('search')
        return params
      })
      setDrawerOpen(false)
    }

    const handleSelectChat = (chat?: Partial<Chat>) => {
      onSelectChat?.(chat)
      setDrawerOpen(false)
    }

    return (
      <aside
        className={cn('flex-shrink-0', isDesktop ? 'w-[300px]' : 'w-full')}
      >
        <TopIcons />

        <div className="px-5">
          <Input
            placeholder="Search or start new chat"
            variant="search"
            className="pl-8"
            startAdornment={<SearchIcon className="text-gray-400" />}
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="mt-3">
          {search ? (
            <SearchResult
              chats={chats}
              search={search}
              onSelectChat={handleSelectSearchedChat}
            />
          ) : (
            <Tabs
              defaultValue={Tab.ALL}
              // onValueChange={(e) => console.log(e)}
            >
              <TabsList>
                <TabsTrigger value={Tab.ALL}>ALL CHATS</TabsTrigger>
                <TabsTrigger value={Tab.PRIVATE}>PRIVATE</TabsTrigger>
                <TabsTrigger value={Tab.GROUP}>GROUP</TabsTrigger>
              </TabsList>
              <TabsContent value={Tab.ALL}>
                {loading ? (
                  <div className="h-[calc(100vh_-_176px)] overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((x) => (
                      <ChatItemSkeleton key={x} />
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh_-_176px)]">
                    {chats?.map((chat) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        selectedChat={selectedChat}
                        onSelectChat={handleSelectChat}
                      />
                    ))}
                  </ScrollArea>
                )}
              </TabsContent>
              <TabsContent value={Tab.PRIVATE}>private</TabsContent>
              <TabsContent value={Tab.GROUP}>group</TabsContent>
            </Tabs>
          )}
        </div>
      </aside>
    )
  })

  if (isDesktop) {
    return <Component />
  }

  return (
    <Drawer open={drawerOpen} direction="left" onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="fixed w-10 h-10 rounded-full top-1/2 left-1 -translate-y-1/2 z-10 flex justify-center items-center bg-gray-500/50 shadow-[0_0_20px_5px_#72727287]">
        <ThinArrowIcon className="text-white dark:text-black" />
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <Component />
        <DrawerClose className="fixed w-10 h-10 rounded-full top-1/2 right-1 -translate-y-1/2 z-10 flex justify-center items-center bg-gray-500/50 shadow-[0_0_20px_5px_#72727287]">
          <ThinArrowIcon className="rotate-180 text-white dark:text-black" />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
