import { useEffect, useRef, useState } from 'react'
import { CopyIcon, DownloadIcon, ShareIcon } from './icons'
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
      <button
        type="button"
        className="share-menu__trigger"
        aria-label="Поделиться"
        title="Поделиться"
        onClick={() => setOpen((value) => !value)}
      >
        <ShareIcon size={18} />
      </button>

      {open && (
        <div className="share-menu__dropdown">
          <div className="share-menu__row">
            <span className="share-menu__row-label">JSON</span>
            <div className="share-menu__segmented">
              <button type="button" aria-label="Копировать" title="Копировать" onClick={() => select(onCopyJson)}>
                <CopyIcon size={18} />
              </button>
              <button
                type="button"
                aria-label="Скачать"
                title="Скачать"
                onClick={() => select(onDownloadJson)}
              >
                <DownloadIcon size={18} />
              </button>
            </div>
          </div>

          <div className="share-menu__row">
            <span className="share-menu__row-label">Ссылка</span>
            <div className="share-menu__segmented">
              <button type="button" aria-label="Копировать" title="Копировать" onClick={() => select(onCopyLink)}>
                <CopyIcon size={18} />
              </button>
            </div>
          </div>

          <div className="share-menu__row">
            <span className="share-menu__row-label">PDF</span>
            <div className="share-menu__segmented">
              <button
                type="button"
                aria-label="Скачать"
                title="Скачать"
                onClick={() => select(onDownloadPdf)}
              >
                <DownloadIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
