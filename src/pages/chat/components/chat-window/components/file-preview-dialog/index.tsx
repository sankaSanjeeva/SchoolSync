import { useEffect, useMemo, useState } from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Attachment } from '@/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useFileUpload } from '@/contexts'
import { FileIcon } from '@/assets/icons'

interface Props extends DialogProps {
  attachments: Attachment[]
}

function Content({ id, downloadURL, type }: Attachment) {
  const [preview, setPreview] = useState<string>()

  const { files } = useFileUpload()

  const file = useMemo(() => files.find((x) => x.fileName === id), [id, files])

  useEffect(() => {
    if (downloadURL) {
      setPreview(downloadURL)
      return undefined
    }

    if (!file) {
      return undefined
    }

    const objectUrl = URL.createObjectURL(file.file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [downloadURL, file])

  switch (type) {
    case 'image':
      return <img src={preview} alt="" className="max-h-svh" />

    case 'video':
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={preview}
          controls
          controlsList="nodownload noremoteplayback noplaybackrate"
          disablePictureInPicture
        />
      )

    case 'pdf':
      return <embed src={preview} className="w-full h-full" />

    default:
      return <FileIcon className="w-24 h-24 text-gray-500" />
  }
}

export default function FilePreviewDialog({ attachments, ...rest }: Props) {
  return (
    <Dialog {...rest}>
      <DialogContent className="p-0 border-none max-w-screen-lg h-svh items-center !bg-transparent">
        <Carousel>
          <CarouselContent>
            {attachments.map((attachment, index) => (
              <CarouselItem
                className="flex justify-center items-center"
                key={attachment.downloadURL ?? index}
              >
                <Content {...attachment} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {attachments.length > 1 && (
            <>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
