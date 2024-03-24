import { Children } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, query, where } from 'firebase/firestore'
import { SearchIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatItem, ChatItemSkeleton, TopIcons } from './components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tab } from '@/enums'
import { auth, db } from '@/firebase'
import { chatConverter } from '@/types'

export default function SidePanel() {
  const [chats, loading] = useCollectionData(
    query(
      collection(db, 'chats').withConverter(chatConverter),
      where('memberIDs', 'array-contains', auth.currentUser?.uid)
    )
  )

  return (
    <aside className="w-[300px]">
      <TopIcons />

      <div className="px-5">
        <Input
          placeholder="Search or start new chat"
          variant="search"
          className="pl-8"
          startAdornment={<SearchIcon className="text-gray-400" />}
        />
      </div>

      <Tabs
        defaultValue={Tab.ALL}
        className="mt-3"
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
              {Children.toArray(
                // eslint-disable-next-line react/jsx-key
                chats?.map((chat) => <ChatItem {...chat} />)
              )}
            </ScrollArea>
          )}
        </TabsContent>
        <TabsContent value={Tab.PRIVATE}>private</TabsContent>
        <TabsContent value={Tab.GROUP}>group</TabsContent>
      </Tabs>
    </aside>
  )
}
