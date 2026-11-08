"""Создаёт шрифт Token с одним глифом — заполненным кругом, значком игрового жетона.

В подсказках порядка ночи жетон обозначается символом «𒊹» (U+122B9). В Roboto Condensed
его нет, а системных шрифтов react-pdf не знает, поэтому PDF берёт круг из этого шрифта.
Круг также привязан к «●» (U+25CF). Размер подобран под высоту строчных Roboto Condensed.
Запуск: python scripts/build-token-font.py <выход.ttf>
Нужен пакет fonttools.
"""
import sys

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

UNITS_PER_EM = 1000
RADIUS = 280
CENTER_Y = 260
SIDE_BEARING = 60
ADVANCE = 2 * (RADIUS + SIDE_BEARING)
KAPPA = 0.5523  # приближение четверти окружности кубической кривой Безье


def circle_glyph():
    pen = TTGlyphPen(None)
    cubic = Cu2QuPen(pen, max_err=1, reverse_direction=True)
    cx, cy, r, k = ADVANCE / 2, CENTER_Y, RADIUS, RADIUS * KAPPA
    cubic.moveTo((cx + r, cy))
    cubic.curveTo((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))
    cubic.curveTo((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))
    cubic.curveTo((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))
    cubic.curveTo((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))
    cubic.closePath()
    return pen.glyph()


builder = FontBuilder(UNITS_PER_EM, isTTF=True)
builder.setupGlyphOrder(['.notdef', 'token'])
builder.setupCharacterMap({0x122B9: 'token', 0x25CF: 'token'})
builder.setupGlyf({'.notdef': TTGlyphPen(None).glyph(), 'token': circle_glyph()})
builder.setupHorizontalMetrics({'.notdef': (ADVANCE, 0), 'token': (ADVANCE, SIDE_BEARING)})
builder.setupHorizontalHeader(ascent=930, descent=-240)
builder.setupNameTable({'familyName': 'Token', 'styleName': 'Regular', 'psName': 'Token-Regular'})
builder.setupOS2(sTypoAscender=930, sTypoDescender=-240, usWinAscent=930, usWinDescent=240)
builder.setupPost()
builder.save(sys.argv[1])
