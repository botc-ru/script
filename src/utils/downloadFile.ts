import { downloadBlob } from './downloadBlob'

/** Скачивает текст как файл. */
export function downloadFile(name: string, content: string) {
  downloadBlob(name, new Blob([content]))
}
