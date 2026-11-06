const PT_PER_MM = 2.834645669

/** Переводит миллиметры в пункты: единицы `@react-pdf`. */
export function mm(value: number): number {
  return value * PT_PER_MM
}
