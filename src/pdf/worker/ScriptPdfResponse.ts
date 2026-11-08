/** Ответ потока PDF на запрос `id`: готовый файл или текст ошибки. */
export type ScriptPdfResponse =
  | { id: number, blob: Blob }
  | { id: number, error: string }
