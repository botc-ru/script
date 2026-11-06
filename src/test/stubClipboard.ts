/** Подменяет буфер обмена: в jsdom его нет. */
export function stubClipboard(clipboard: Partial<Clipboard>) {
  Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true })
}
