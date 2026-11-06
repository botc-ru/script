"""Создаёт жирное начертание шрифта Petersburg: у него есть только обычное.

Контуры букв утолщаются, а ширина знаков остаётся прежней, поэтому вёрстка не меняется.
Запуск: python scripts/embolden-font.py <вход.ttf> <выход.ttf> [толщина]
Нужны пакеты fonttools и freetype-py.
"""
import ctypes
import sys

import freetype
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates

source, target = sys.argv[1:3]
strength = int(sys.argv[3]) if len(sys.argv) > 3 else 140

font = TTFont(source)
face = freetype.Face(source)
glyf = font['glyf']
hmtx = font['hmtx']
flags = freetype.FT_LOAD_NO_SCALE | freetype.FT_LOAD_NO_HINTING | freetype.FT_LOAD_NO_BITMAP

for name in font.getGlyphOrder():
    glyph = glyf[name]
    if glyph.numberOfContours <= 0:
        continue

    face.load_glyph(font.getGlyphID(name), flags)
    outline = face.glyph.outline
    freetype.FT_Outline_Embolden(ctypes.byref(outline._FT_Outline), strength)
    points = [(x - strength // 2, y - strength // 2) for x, y in outline.points]
    if len(points) != len(glyph.coordinates):
        raise ValueError(f'{name}: изменилось число точек')

    glyph.coordinates = GlyphCoordinates(points)
    glyph.program.fromBytecode(b'')
    glyph.recalcBounds(glyf)
    hmtx[name] = (hmtx[name][0], glyph.xMin)

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
