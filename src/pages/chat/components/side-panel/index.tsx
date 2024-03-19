import { SearchIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatItem, TopIcons } from './components'
import { ScrollArea } from '@/components/ui/scroll-area'

enum Tab {
  ALL = 'all',
  PRIVATE = 'private',
  GROUP = 'group',
}

export default function SidePanel() {
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
          <ScrollArea className="h-[calc(100vh_-_176px)]">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 56, 85, 122].map(
              (x) => (
                <ChatItem
                  key={x}
                  id={x}
                  unReadCount={x}
                  lastMessage="Thank you very much, I am waiting"
                  time="11:23 PM"
                  name="Sanka"
                />
              )
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value={Tab.PRIVATE}>private</TabsContent>
        <TabsContent value={Tab.GROUP}>group</TabsContent>
      </Tabs>
    </aside>
  )
}
