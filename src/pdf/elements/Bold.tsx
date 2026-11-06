import { StyleSheet, Text } from '@react-pdf/renderer'

import type { BoldProps } from './BoldProps'

const styles = StyleSheet.create({
  bold: {
    fontWeight: 700,
  },
})

/** Жирный текст шрифтом Petersburg. */
export function Bold({ style = [], children }: BoldProps) {
  return <Text style={[...[style].flat(), styles.bold]}>{children}</Text>
}
