/** Делит список на колонки: сначала заполняется левая. */
export function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns) || 1
  return Array.from({ length: columns }, (_, index) => (
    items.slice(index * perColumn, (index + 1) * perColumn)
  ))
}
