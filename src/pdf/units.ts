const PT_PER_MM = 2.834645669
const PT_PER_PX = 0.75

export function mm(value: number): number {
  return value * PT_PER_MM
}

export function px(value: number): number {
  return value * PT_PER_PX
}
