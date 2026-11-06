/** Сколько живёт ссылка на файл: мобильные браузеры начинают скачивание не сразу. */
const URL_LIFETIME = 40_000

/**
 * Скачивает данные как файл.
 *
 * Тип всегда `application/octet-stream`: файлы, которые браузер умеет показывать, например PDF,
 * мобильные браузеры открывают вместо скачивания и не смотрят на атрибут `download`.
 */
export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, URL_LIFETIME)
}
