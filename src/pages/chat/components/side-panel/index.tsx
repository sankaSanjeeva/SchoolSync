import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon, ThinArrowIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatItem, ChatItemSkeleton } from '@/components/common'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tab } from '@/enums'
import { useMediaQuery } from '@/hooks'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { useChat } from '@/contexts'
import { SearchResult, TopIcons } from './components'

interface ContentProps {
  isDesktop: boolean
}

function Skeleton() {
  return (
    <div className="h-[calc(100svh_-_176px)] overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => i + 1).map((x) => (
        <ChatItemSkeleton key={x} />
      ))}
    </div>
  )
}

function Content({ isDesktop }: ContentProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const { chats, loading, setChat } = useChat()

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

  const allChats = useMemo(
    () => (
      <AnimatePresence>
        {chats?.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <ChatItem key={chat.id} chat={chat} onClick={setChat} />
          </motion.div>
        ))}
      </AnimatePresence>
    ),

    [chats, setChat]
  )

  const privateChats = useMemo(
    () => (
      <AnimatePresence>
        {chats
          ?.filter((chat) => chat.type === 'private')
          ?.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ChatItem key={chat.id} chat={chat} onClick={setChat} />
            </motion.div>
          ))}
      </AnimatePresence>
    ),
    [chats, setChat]
  )

  const groupChats = useMemo(
    () => (
      <AnimatePresence>
        {chats
          ?.filter((chat) => chat.type === 'group')
          ?.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <ChatItem key={chat.id} chat={chat} onClick={setChat} />
            </motion.div>
          ))}
      </AnimatePresence>
    ),
    [chats, setChat]
  )

  return (
    <aside className={cn('flex-shrink-0', isDesktop ? 'w-[300px]' : 'w-full')}>
      <TopIcons />

      <div className="px-5">
        <Input
          placeholder="Search or Start a new chat"
          variant="search"
          className="pl-8"
          startAdornment={<SearchIcon className="text-gray-400" />}
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="mt-3">
        {search ? (
          <SearchResult />
        ) : (
          <Tabs defaultValue={Tab.ALL}>
            <TabsList>
              <TabsTrigger disabled={loading} value={Tab.ALL}>
                ALL CHATS
              </TabsTrigger>
              <TabsTrigger disabled={loading} value={Tab.PRIVATE}>
                PRIVATE
              </TabsTrigger>
              <TabsTrigger disabled={loading} value={Tab.GROUP}>
                GROUP
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100svh_-_176px)]">
              <TabsContent value={Tab.ALL}>
                {loading ? <Skeleton /> : allChats}
              </TabsContent>
              <TabsContent value={Tab.PRIVATE}>{privateChats}</TabsContent>
              <TabsContent value={Tab.GROUP}>{groupChats}</TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </div>
    </aside>
  )
}

export default function SidePanel() {
  const [drawerOpen, setDrawerOpen] = useState(true)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { chat } = useChat()

  useEffect(() => {
    setDrawerOpen(false)
  }, [chat])

  if (isDesktop) {
    return <Content isDesktop={isDesktop} />
  }

  return (
    <Drawer open={drawerOpen} direction="left" onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="fixed w-10 h-10 rounded-full top-1/2 left-1 -translate-y-1/2 z-10 flex justify-center items-center bg-gray-500/50 shadow-[0_0_20px_5px_#72727287]">
        <ThinArrowIcon className="text-white dark:text-black" />
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <Content isDesktop={isDesktop} />
        <DrawerClose className="fixed w-10 h-10 rounded-full top-1/2 right-1 -translate-y-1/2 z-10 flex justify-center items-center bg-gray-500/50 shadow-[0_0_20px_5px_#72727287]">
          <ThinArrowIcon className="rotate-180 text-white dark:text-black" />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
