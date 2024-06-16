import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/firebase'
import { messageConverter } from '@/types'

type FileToUpload = {
  /**
   * fileName = `${chatId}-${messageId}-${index}`
   */
  fileName: string
  uploading: boolean
  file: File
}

type FileUploadProviderState = {
  files: FileToUpload[]
  setFiles: (files: FileToUpload[]) => void
}

const FileUploadProviderContext = createContext<FileUploadProviderState>({
  files: [],
  setFiles: () => null,
})

export function FileUploadProvider({ children }: PropsWithChildren) {
  const [files, setFiles] = useState<FileUploadProviderState['files']>([])

  const value = useMemo(() => ({ files, setFiles }), [files])

  const uploadFile = ({ fileName, file }: FileToUpload) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.fileName === fileName) {
          return { ...f, uploading: true }
        }
        return f
      })
    )

    const uploadTask = uploadBytesResumable(ref(storage, `${fileName}`), file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error)
        },
        async () => {
          try {
            const [chatId, messageId] = fileName.split('-')

            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            const docRef = doc(
              db,
              `chats/${chatId}/messages/${messageId}`
            ).withConverter(messageConverter)

            const res = await getDoc(docRef)

            await updateDoc(docRef, {
              attachments: res.data()?.attachments?.map((x) => {
                if (x.id === fileName) {
                  return { ...x, downloadURL }
                }
                return x
              }),
            })

            setFiles((prev) => prev.filter((f) => f.fileName !== fileName))
            resolve(undefined)
          } catch (error) {
            reject()
          }
        }
      )
    })
  }

  useEffect(() => {
    const iterateUploads = async () => {
      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        if (!file.uploading) {
          // eslint-disable-next-line no-await-in-loop
          await uploadFile(file)
        }
      }
    }
    iterateUploads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length])

  return (
    <FileUploadProviderContext.Provider value={value}>
      {children}
    </FileUploadProviderContext.Provider>
  )
}

export const useFileUpload = () => {
  const context = useContext(FileUploadProviderContext)

  if (context === undefined)
    throw new Error('useFileUpload must be used within a FileUploadProvider')

  return context
}
