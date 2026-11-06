"""Создаёт жирное начертание шрифта Petersburg: у него есть только обычное.

Повторяет жирный, который браузер рисует на странице: вертикальные штрихи заметно толще,
тонкие горизонтальные линии почти не меняются, а буквы раздвигаются на ту же величину.
Запуск: python scripts/embolden-font.py <вход.ttf> <выход.ttf> [по_горизонтали] [по_вертикали]
Нужны пакеты fonttools и freetype-py.
"""
import ctypes
import sys

import freetype
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates

source, target = sys.argv[1:3]
x_strength = int(sys.argv[3]) if len(sys.argv) > 3 else 130
y_strength = int(sys.argv[4]) if len(sys.argv) > 4 else 20

font = TTFont(source)
face = freetype.Face(source)
glyf = font['glyf']
hmtx = font['hmtx']
flags = freetype.FT_LOAD_NO_SCALE | freetype.FT_LOAD_NO_HINTING | freetype.FT_LOAD_NO_BITMAP

for name in font.getGlyphOrder():
    glyph = glyf[name]
    width = hmtx[name][0] + x_strength
    if glyph.numberOfContours <= 0:
        hmtx[name] = (width, hmtx[name][1])
        continue

    face.load_glyph(font.getGlyphID(name), flags)
    outline = face.glyph.outline
    freetype.FT_Outline_EmboldenXY(ctypes.byref(outline._FT_Outline), x_strength, y_strength)
    points = [(x, y - y_strength // 2) for x, y in outline.points]
    if len(points) != len(glyph.coordinates):
        raise ValueError(f'{name}: изменилось число точек')

    glyph.coordinates = GlyphCoordinates(points)
    glyph.program.fromBytecode(b'')
    glyph.recalcBounds(glyf)
    hmtx[name] = (width, glyph.xMin)

for table in ('fpgm', 'prep', 'cvt ', 'hdmx', 'VDMX', 'LTSH'):
    if table in font:
        del font[table]

font['OS/2'].usWeightClass = 700
font['OS/2'].fsSelection = (font['OS/2'].fsSelection & ~0x40) | 0x20
font['head'].macStyle |= 1
for record in font['name'].names:
    if record.nameID in (2, 4, 6):
        record.string = f'{record.toUnicode()} Bold'

font.save(target)
