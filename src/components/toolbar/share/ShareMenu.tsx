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
 * Меню «Поделиться» с группами «Открыть», «Копировать» и «Скачать».
 * «Открыть» заменяет текущий сценарий: из буфера обмена (ссылка или JSON) и из файла JSON.
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
      title: 'Открыть',
      actions: [
        { icon: Clipboard, label: 'Вставить', onClick: importFromClipboard },
        { icon: FileUp, label: 'Загрузить', onClick: () => fileInput.current?.click() },
      ],
    },
    {
      title: 'Копировать',
      actions: [
        {
          icon: Link,
          label: 'Ссылку',
          onClick: () => copy(buildScriptLink(script), 'Ссылка скопирована'),
        },
        {
          icon: Copy,
          label: 'JSON',
          onClick: () => copy(buildScriptJson(script), 'JSON скопирован'),
        },
      ],
    },
    {
      title: 'Скачать',
      actions: [
        { icon: FileDown, label: 'PDF', disabled: !onDownloadPdf, onClick: onDownloadPdf },
        {
          icon: Download,
          label: 'JSON',
          onClick: () => downloadFile(`${script.name || 'script'}.json`, buildScriptJson(script)),
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
