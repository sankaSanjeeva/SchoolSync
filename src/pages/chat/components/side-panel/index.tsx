import { ChevronIcon, PencilIcon, SearchIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SidePanel() {
  return (
    <aside className="w-[300px]">
      <div className="p-5 flex justify-end gap-1">
        <Button variant="ghost" size="icon">
          <PencilIcon />
        </Button>
        <Button variant="ghost" size="icon">
          <ChevronIcon />
        </Button>
      </div>

      <div className="px-5">
        <Input
          placeholder="Search or start new chat"
          variant="search"
          className="pl-8"
          startAdornment={<SearchIcon className="text-gray-400" />}
        />
      </div>
    </aside>
  )
}
