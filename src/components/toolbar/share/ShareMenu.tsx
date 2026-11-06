import { Clipboard, Copy, Download, FileDown, FileUp, Link, Share2 } from 'lucide-react'
import { type ChangeEvent, useRef } from 'react'

import { copyText } from '../../../utils/copyText'
import { downloadFile } from '../../../utils/downloadFile'
import { parseScriptText } from '../../../utils/parseScriptText'
import { buildScriptJson } from '../../../utils/scriptJson'
import { buildScriptLink } from '../../../utils/scriptLink'
import type { MenuGroup } from '../menu/MenuGroup'
import { PopupMenu } from '../menu/PopupMenu'
import type { ShareMenuProps } from './ShareMenuProps'

/**
 * Меню «Поделиться». Импорт заменяет текущий сценарий: из буфера обмена (ссылка или JSON)
 * и из файла JSON. Экспорт: копирование и скачивание JSON, копирование ссылки, скачивание PDF.
 * Без `onDownloadPdf` скачивание PDF неактивно.
 *
 * Результат действия передаётся в `onNotify`.
 */
export function ShareMenu({ script, onImport, onNotify, onDownloadPdf }: ShareMenuProps) {
  const fileInput = useRef<HTMLInputElement>(null)

  function importText(text: string) {
    const imported = parseScriptText(text)
    if (imported) onImport(imported)
    else onNotify('Не удалось распознать сценарий')
  }

  function importFromClipboard() {
    Promise.resolve()
      .then(() => navigator.clipboard.readText())
      .then(importText)
      .catch(() => onNotify('Нет доступа к буферу обмена'))
  }

  function importFromFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target
    input.files?.[0]?.text()
      .then(importText)
      .catch(() => onNotify('Не удалось прочитать файл'))
      .finally(() => {
        input.value = ''
      })
  }

  function copy(text: string, message: string) {
    void copyText(text).then((isCopied) => {
      if (isCopied) onNotify(message)
    })
  }

  const groups: MenuGroup[] = [
    {
      title: 'Импорт',
      actions: [
        { icon: Clipboard, label: 'Из буфера обмена', onClick: importFromClipboard },
        { icon: FileUp, label: 'Из файла JSON', onClick: () => fileInput.current?.click() },
      ],
    },
    {
      title: 'Экспорт',
      actions: [
        {
          icon: Copy,
          label: 'Копировать JSON',
          onClick: () => copy(buildScriptJson(script), 'JSON скопирован'),
        },
        {
          icon: Download,
          label: 'Скачать JSON',
          onClick: () => downloadFile(
            `${script.name || 'script'}.json`,
            buildScriptJson(script),
            'application/json',
          ),
        },
        {
          icon: Link,
          label: 'Копировать ссылку',
          onClick: () => copy(buildScriptLink(script), 'Ссылка скопирована'),
        },
        {
          icon: FileDown,
          label: 'Скачать PDF',
          disabled: !onDownloadPdf,
          onClick: onDownloadPdf,
        },
      ],
    },
  ]

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        aria-label="Файл сценария"
        hidden
        onChange={importFromFile}
      />
      <PopupMenu icon={Share2} label="Поделиться" groups={groups} align="right" />
    </>
  )
}
