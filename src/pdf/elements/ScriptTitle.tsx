import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { ScriptTitleProps } from './ScriptTitleProps'

/**
 * Название сценария в его цвете на листе рассказчика и в подробном порядке ночи.
 * Общий компонент, чтобы размер на этих листах совпадал. На листе игрока название крупнее.
 */
export function ScriptTitle({ title, color }: ScriptTitleProps) {
  const fontSize = useFontSize()
  return <Bold style={{ fontSize: fontSize(5.5), color }}>{title}</Bold>
}
