import type { RolesById } from '../types/RolesById'

export const TEST_ROLES: RolesById = {
  librarian: { id: 'librarian', name: 'Библиотекарь', ability: 'Узнаёт Изгоя', image: '', team: 'townsfolk' },
  chef: { id: 'chef', name: 'Повар', ability: 'Узнаёт пары', image: '', team: 'townsfolk' },
  drunk: { id: 'drunk', name: 'Пьяница', ability: 'Думает, что Горожанин', image: '', team: 'outsider' },
  poisoner: { id: 'poisoner', name: 'Отравитель', ability: 'Отравляет игрока', image: '', team: 'minion' },
  imp: { id: 'imp', name: 'Бес', ability: 'Убивает ночью', image: '', team: 'demon' },
  knaves: { id: 'knaves', name: 'Плуты', ability: 'Плутуют', image: '', team: 'loric' },
  ferryman: { id: 'ferryman', name: 'Лодочник', ability: 'Возвращает голоса', image: '', team: 'fabled' },
  djinn: { id: 'djinn', name: 'Джинн', ability: 'Вводит особое правило', image: '', team: 'fabled' },
  boffin: {
    id: 'boffin',
    name: 'Умник',
    ability: 'Демон получает способность',
    image: '',
    team: 'minion',
    jinxes: [{ id: 'goon', reason: 'Правило Умника и Громилы' }],
  },
  goon: {
    id: 'goon',
    name: 'Громила',
    ability: 'Первый выбравший пьянеет',
    image: '',
    team: 'outsider',
    jinxes: [{ id: 'boffin', reason: 'Правило Умника и Громилы' }],
  },
  beggar: { id: 'beggar', name: 'Нищий', ability: 'Просит жетоны', image: '', team: 'traveller' },
}
