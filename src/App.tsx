import { useRoles } from './contexts/roles/useRoles'

/**
 * Корневой компонент приложения.
 *
 * Показывает состояние загрузки ролей.
 */
export function App() {
  const roles = useRoles()

  return (
    <>
      <h1>Редактор сценариев</h1>
      {roles.status === 'loading' && <p>Загрузка ролей...</p>}
      {roles.status === 'error' && <p>Не удалось загрузить роли</p>}
      {roles.status === 'ready' && <p>Загружено ролей: {Object.keys(roles.roles).length}</p>}
    </>
  )
}
