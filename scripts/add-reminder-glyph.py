"""Добавляет в шрифт знак 𒊹 (U+122B9) из Noto Sans Cuneiform.

В подсказках порядка ночи этим знаком отмечено, где положить напоминание. На сайте его рисует
браузер запасным шрифтом, а в PDF запасных шрифтов нет, и без глифа знак пропадает.
Знак переносится с тем же размером относительно кегля, что и в Noto.
Запуск: python scripts/add-reminder-glyph.py <NotoSansCuneiform-Regular.ttf> <шрифт.ttf>
Шрифт перезаписывается. Нужен пакет fonttools.
"""
import sys

from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable

CODE_POINT = 0x122B9
GLYPH_NAME = 'u122B9'

source_path, target_path = sys.argv[1:3]
source = TTFont(source_path)
target = TTFont(target_path)

source_name = source.getBestCmap()[CODE_POINT]
scale = target['head'].unitsPerEm / source['head'].unitsPerEm

pen = TTGlyphPen(None)
source.getGlyphSet()[source_name].draw(TransformPen(pen, (scale, 0, 0, scale, 0, 0)))
glyph = pen.glyph()

glyph_order = target.getGlyphOrder()
if GLYPH_NAME not in glyph_order:
    target.setGlyphOrder([*glyph_order, GLYPH_NAME])
target['glyf'][GLYPH_NAME] = glyph
glyph.recalcBounds(target['glyf'])
target['hmtx'][GLYPH_NAME] = (round(source['hmtx'][source_name][0] * scale), glyph.xMin)

# Знак вне BMP: формат 4 его не вмещает, нужна таблица формата 12
cmap = target['cmap']
full = cmap.getcmap(3, 10)
if full is None:
    full = CmapSubtable.newSubtable(12)
    full.platformID, full.platEncID, full.language = 3, 10, 0
    full.cmap = dict(cmap.getBestCmap())
    cmap.tables.append(full)
full.cmap[CODE_POINT] = GLYPH_NAME

target.save(target_path)
