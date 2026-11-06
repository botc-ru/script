/**
 * Копирует текст в буфер обмена. Если буфер недоступен, показывает текст для ручного копирования.
 *
 * Возвращает `true`, если текст скопирован.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    window.prompt('Скопируйте текст:', text)
    return false
  }
}
