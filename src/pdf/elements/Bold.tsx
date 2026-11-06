import { StyleSheet, Text, View } from '@react-pdf/renderer'

import type { BoldProps } from './BoldProps'

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: -0.35,
    left: 0.35,
  },
})

/**
 * Жирный текст шрифтом Petersburg. У шрифта нет такого начертания,
 * поэтому поверх текста со сдвигом лежит его копия.
 */
export function Bold({ style = [], children }: BoldProps) {
  const textStyles = [style].flat()

  return (
    <View style={styles.wrap}>
      <Text style={textStyles}>{children}</Text>
      <Text style={[...textStyles, styles.overlay]}>{children}</Text>
    </View>
  )
}
