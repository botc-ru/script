import { useEffect, useState } from 'react'

export function usePath(): [string, (path: string) => void] {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(to: string) {
    window.history.pushState(null, '', to + window.location.search)
    setPath(to)
  }

  return [path, navigate]
}
