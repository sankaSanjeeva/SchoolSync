import { useEffect, useMemo, useState } from 'react'
import { Attachment } from '@/types'
import { useFileUpload } from '@/contexts'
import { FileIcon, PdfIcon, PlayIcon, SpinnerIcon } from '@/assets/icons'

export default function FilePreview({
  attachment,
}: {
  attachment: Attachment
}) {
  const [preview, setPreview] = useState<string>()

  const { files } = useFileUpload()

  const file = useMemo(
    () => files.find((x) => x.fileName === attachment.id),
    [attachment.id, files]
  )

  useEffect(() => {
    if (attachment.downloadURL) {
      setPreview(attachment.downloadURL)
      return undefined
    }

    if (!file) {
      return undefined
    }

    const objectUrl = URL.createObjectURL(file.file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [attachment.downloadURL, file])

  const getPreview = () => {
    if (attachment.type.startsWith('image')) {
      return (
        <img src={preview} alt="preview" className="object-cover w-40 h-40" />
      )
    }

    if (attachment.type.startsWith('video')) {
      return (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={preview} className="object-cover w-40 h-40" />
          <PlayIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
        </>
      )
    }

    return (
      <div className="flex h-full items-center p-2">
        {attachment.type === 'pdf' ? (
          <PdfIcon className="w-24 h-24" />
        ) : (
          <FileIcon className="w-24 h-24 text-gray-500" />
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {file && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/50">
          <SpinnerIcon className="w-8 h-8 animate-spin text-white" />
        </div>
      )}

      {getPreview()}
    </div>
  )
}
