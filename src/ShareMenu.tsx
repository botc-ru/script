import { useEffect, useRef, useState } from 'react'
import './ShareMenu.css'

interface ShareMenuProps {
  onCopyJson: () => void
  onDownloadJson: () => void
  onCopyLink: () => void
  onDownloadPdf: () => void
}

export function ShareMenu({ onCopyJson, onDownloadJson, onCopyLink, onDownloadPdf }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function select(action: () => void) {
    action()
    setOpen(false)
  }

  return (
    <div className="share-menu" ref={ref}>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        Поделиться
      </button>

      {open && (
        <div className="share-menu__dropdown">
          <div className="share-menu__group">
            <span className="share-menu__group-label">JSON</span>
            <button type="button" onClick={() => select(onCopyJson)}>
              Копировать
            </button>
            <button type="button" onClick={() => select(onDownloadJson)}>
              Скачать
            </button>
          </div>

          <div className="share-menu__group">
            <span className="share-menu__group-label">Ссылка</span>
            <button type="button" onClick={() => select(onCopyLink)}>
              Копировать
            </button>
          </div>

          <div className="share-menu__group">
            <span className="share-menu__group-label">PDF</span>
            <button type="button" onClick={() => select(onDownloadPdf)}>
              Скачать
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
