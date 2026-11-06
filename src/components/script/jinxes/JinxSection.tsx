import { SectionTitle } from '../section/SectionTitle'
import type { JinxSectionProps } from './JinxSectionProps'

import './JinxSection.css'

/**
 * Секция «Правила Джинна»: для каждой пары ролей иконки обеих ролей и текст правила.
 */
export function JinxSection({ jinxes }: JinxSectionProps) {
  return (
    <section>
      <SectionTitle title="Правила Джинна" count={jinxes.length} />
      <ul className="jinx-section__list">
        {jinxes.map(({ roleA, roleB, reason }) => (
          <li key={`${roleA.id}-${roleB.id}`} className="jinx-section__item">
            <img className="jinx-section__icon" src={roleA.image} alt={roleA.name} />
            <img className="jinx-section__icon" src={roleB.image} alt={roleB.name} />
            <span className="jinx-section__reason">{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
