import { splitIntoColumns } from './splitIntoColumns'

/** Строки колонок из `splitIntoColumns`. В неполной строке на месте пустых ячеек `undefined`. */
export function splitIntoRows<T>(items: T[], columns: number): (T | undefined)[][] {
  const parts = splitIntoColumns(items, columns)
  return (parts[0] ?? []).map((_, row) => parts.map((column) => column[row]))
}
