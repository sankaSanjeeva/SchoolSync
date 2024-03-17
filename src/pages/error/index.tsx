import { useRouteError } from 'react-router-dom'

export default function Error() {
  const error = useRouteError()

  return (
    <div className="flex flex-col justify-center items-center gap-5 min-h-svh">
      <h1 className="text-2xl">Oops!</h1>
      <p className="text-xl">Sorry, an unexpected error has occurred.</p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  )
}
