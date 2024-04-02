import { useEffect, useRef, useState } from 'react'

const useElementIsVisible = (options?: IntersectionObserverInit) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  const callbackFn = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    setVisible(entry.isIntersecting)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFn, options)
    const { current } = ref

    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [ref, options])

  return { ref, visible }
}

export default useElementIsVisible
