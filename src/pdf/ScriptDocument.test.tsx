import { render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { PrintSettings } from '../types/PrintSettings'
import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'
import type { Team } from '../types/Team'
import { DEFAULT_PRINT_SETTINGS } from '../utils/defaultPrintSettings'
import { DEFAULT_SCRIPT } from '../utils/defaultScript'
import { ScriptDocument } from './ScriptDocument'

interface MockProps {
  children?: ReactNode
}

// Вёрстку здесь не проверить: подмена показывает только, что попало на какой лист
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  Document: ({ children }: MockProps) => <div>{children}</div>,
  Page: ({ children }: MockProps) => <section data-testid="page">{children}</section>,
  View: ({ children }: MockProps) => <div>{children}</div>,
  Text: ({ children }: MockProps) => <span>{children}</span>,
  Image: ({ src }: { src: string }) => <img src={src} alt="" />,
}))

function createRole(
  id: string,
  name: string,
  team: Team | undefined,
  fields: Partial<Role> = {},
): Role {
  return { id, name, team, ability: `Способность: ${name}`, image: `${id}.png`, ...fields }
}

const ROLES: RolesById = {
  chef: createRole('chef', 'Повар', 'townsfolk', {
    firstNight: 30,
    firstNightReminder: 'Покажи число',
  }),
  empath: createRole('empath', 'Эмпат', 'townsfolk', {
    firstNight: 40,
    otherNight: 50,
    otherNightReminder: 'Покажи соседей',
  }),
  baron: createRole('baron', 'Барон', 'minion', { modifications: '+2 Изгоя' }),
  boffin: createRole('boffin', 'Умник', 'minion', {
    jinxes: [{ id: 'goon', reason: 'Правило Умника' }],
  }),
  goon: createRole('goon', 'Громила', 'outsider'),
  knaves: createRole('knaves', 'Плуты', 'loric'),
  ferryman: createRole('ferryman', 'Лодочник', 'fabled'),
  djinn: createRole('djinn', 'Джинн', 'fabled'),
  beggar: createRole('beggar', 'Нищий', 'traveller'),
  dusk: createRole('dusk', 'Закат', undefined, { firstNight: 1, otherNight: 1 }),
  demoninfo: createRole('demoninfo', 'Демон', undefined, { firstNight: 20 }),
}

const ALL_ROLES = ['chef', 'empath', 'baron', 'boffin', 'goon', 'knaves', 'ferryman', 'beggar']

function renderPdf(settings: Partial<PrintSettings> = {}, roleIds = ALL_ROLES, name = 'Буря') {
  render(
    <ScriptDocument
      script={{ ...DEFAULT_SCRIPT, name, author: 'Автор', roleIds, customOrder: true }}
      roles={ROLES}
      settings={{ ...DEFAULT_PRINT_SETTINGS, ...settings }}
    />,
  )
  return screen.queryAllByTestId('page')
}

function getPage(pages: HTMLElement[], index: number) {
  const page = pages[index]
  if (!page) throw new Error('Page not found')
  return within(page)
}

function getImages(page: HTMLElement | undefined) {
  return Array.from(page?.querySelectorAll('img') ?? [], (image) => image.getAttribute('src'))
}

describe('ScriptDocument', () => {
  it('по умолчанию содержит три листа', () => {
    expect(renderPdf()).toHaveLength(3)
  })

  it.each<Partial<PrintSettings>>([
    { playerSheet: false },
    { storytellerSheet: false },
    { nightOrder: false },
  ])('выключенный лист пропадает: %j', (settings) => {
    expect(renderPdf(settings)).toHaveLength(2)
  })

  it('показывает порядок листов: игрок, рассказчик, ночь', () => {
    const pages = renderPdf()

    expect(getPage(pages, 0).getByText('* Не в первую ночь')).toBeDefined()
    expect(getPage(pages, 1).getAllByText('ИГРОКИ').length).toBeGreaterThan(0)
    expect(getPage(pages, 2).getByText('Покажи число')).toBeDefined()
  })

  it('без названия пишет Сценарий', () => {
    const pages = renderPdf({}, [], '')

    expect(getPage(pages, 0).getAllByText('Сценарий').length).toBeGreaterThan(0)
  })

  describe('лист игрока', () => {
    it('показывает название, автора и только основные команды', () => {
      const page = getPage(renderPdf(), 0)

      expect(page.getAllByText('Буря').length).toBeGreaterThan(0)
      expect(page.getByText('Автор')).toBeDefined()
      expect(page.getAllByText('Повар').length).toBeGreaterThan(0)
      expect(page.queryByText('Плуты')).toBeNull()
      expect(page.queryByText('Нищий')).toBeNull()
    })

    it('скрывает пустые команды', () => {
      const page = getPage(renderPdf({}, ['chef']), 0)

      expect(page.getAllByText('Горожане').length).toBeGreaterThan(0)
      expect(page.queryByText('Демоны')).toBeNull()
    })

    it.each([2, 1] as const)('показывает модификации при колонках: %i', (columns) => {
      const page = getPage(renderPdf({ columns }), 0)

      expect(page.getByText('[+2 Изгоя]', { exact: false }).textContent).toBe(' [+2 Изгоя]')
    })

    it.each([2, 1] as const)('показывает иконки джинксов при колонках: %i', (columns) => {
      const images = getImages(renderPdf({ columns })[0])

      expect(images.filter((image) => image === 'goon.png')).toHaveLength(2)
    })

    it('логотип и фон выключаются', () => {
      const withBoth = getImages(renderPdf()[0])
      document.body.innerHTML = ''
      const withoutBoth = getImages(renderPdf({ logo: false, background: false })[0])

      expect(withBoth.length - withoutBoth.length).toBe(2)
    })
  })

  describe('лист рассказчика', () => {
    it('показывает Летописцев, Джинна, джинксы, Сказочников и Странников', () => {
      const page = getPage(renderPdf(), 1)

      expect(page.getAllByText('Плуты').length).toBeGreaterThan(0)
      expect(page.getAllByText('Джинн').length).toBeGreaterThan(0)
      expect(page.getByText('Правило Умника')).toBeDefined()
      expect(page.getAllByText('Лодочник').length).toBeGreaterThan(0)
      expect(page.getAllByText('Нищий').length).toBeGreaterThan(0)
    })

    it('без джинксов Джинна нет', () => {
      const page = getPage(renderPdf({}, ['chef', 'ferryman']), 1)

      expect(page.queryByText('Джинн')).toBeNull()
      expect(page.queryByText('Правила Джинна')).toBeNull()
    })

    it('Сказочники с Джинном последним и правила Джинна идут отдельными секциями', () => {
      const text = getPage(renderPdf(), 1).getByText('Правила Джинна').closest('section')
        ?.textContent ?? ''

      expect(text.indexOf('Сказочники')).toBeGreaterThanOrEqual(0)
      expect(text.indexOf('Лодочник')).toBeLessThan(text.indexOf('Джинн'))
      expect(text.indexOf('Джинн')).toBeLessThan(text.indexOf('Правила Джинна'))
      expect(text.indexOf('Правила Джинна')).toBeLessThan(text.indexOf('Правило Умника'))
    })

    it('Странники и таблица выключаются', () => {
      const page = getPage(renderPdf({ travellers: false, playersTable: false }), 1)

      expect(page.queryByText('Нищий')).toBeNull()
      expect(page.queryByText('ИГРОКИ')).toBeNull()
    })

    it('колонки порядка ночи выключаются', () => {
      const page = getPage(renderPdf({ nightOrderColumns: false }), 1)

      expect(page.queryByText('Первая ночь')).toBeNull()
      expect(page.queryByText('Другие ночи')).toBeNull()
    })

    it('список других ночей идёт в обратном порядке: колонка перевёрнута', () => {
      const pages = renderPdf({ playerSheet: false })
      const text = pages[0]?.textContent ?? ''

      expect(text.lastIndexOf('Закат')).toBeGreaterThan(text.lastIndexOf('Эмпат'))
    })
  })

  describe('подробный порядок ночи', () => {
    it('сортирует записи и добавляет служебные', () => {
      const text = renderPdf()[2]?.textContent ?? ''

      expect(text.indexOf('Закат')).toBeLessThan(text.indexOf('Повар'))
      expect(text.indexOf('Повар')).toBeLessThan(text.indexOf('Эмпат'))
    })

    it('показывает подсказки обеих колонок', () => {
      const page = getPage(renderPdf(), 2)

      expect(page.getByText('Покажи число')).toBeDefined()
      expect(page.getByText('Покажи соседей')).toBeDefined()
    })

    it('без подсказок оставляет записи', () => {
      const page = getPage(renderPdf({ nightHints: false }), 2)

      expect(page.queryByText('Покажи число')).toBeNull()
      expect(page.queryByText('Покажи соседей')).toBeNull()
      expect(page.getAllByText('Повар').length).toBeGreaterThan(0)
    })

    it('при 5-6 игроках скрывает информацию для Демона', () => {
      expect(getPage(renderPdf(), 2).getAllByText('Демон').length).toBeGreaterThan(0)
      document.body.innerHTML = ''
      expect(getPage(renderPdf({ playersCount: '5-6' }), 2).queryByText('Демон')).toBeNull()
    })
  })
})
