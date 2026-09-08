import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { Role, RolesById, Team } from '../types'
import type { ScriptMeta } from '../scriptModel'
import type { PrintSettings } from '../print'
import { TEAM_LABELS } from '../teams'
import { getActiveJinxes, type ActiveJinx } from '../jinx'
import {
  TEAM_PRINT_COLOR,
  PLAYERS_COUNT_TABLE,
  getNightOrder,
  splitIntoColumns,
  type NightOrderEntry,
} from '../printData'
import { registerPdfFonts } from './fonts'
import { mm, px } from './units'
import type { Style } from '@react-pdf/types'
import logoImage from '../assets/images/logo.png'
import paperImage from '../assets/images/paper.jpg'

registerPdfFonts()

const PAGE1_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
const DJINN_ID = 'djinn'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Petersburg',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: mm(210),
    height: mm(297),
    objectFit: 'cover',
  },
  content: {
    position: 'relative',
    flex: 1,
    paddingTop: mm(8),
    paddingLeft: mm(8),
    paddingRight: mm(8),
    paddingBottom: mm(6),
  },
  contentStorytellerPage: {
    paddingTop: mm(6),
    paddingLeft: mm(6),
    paddingRight: mm(6),
    paddingBottom: mm(6),
  },
  contentBody: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(2.5),
  },
  watermark: {
    position: 'absolute',
    width: mm(250),
    left: mm(-20),
    top: mm(50),
    opacity: 0.1,
  },
  notFirstNight: {
    textAlign: 'right',
    marginBottom: mm(-1),
    fontFamily: 'Roboto-Condensed',
    fontWeight: 300,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 0,
  },
  boldWrap: {
    position: 'relative',
  },
  boldOverlay: {
    position: 'absolute',
    top: 0,
    left: 0.35,
  },
  title: {},
  titleSmall: {
    textAlign: 'center',
    marginBottom: mm(2),
  },
  titleSmallBoldWrap: {
    alignItems: 'center',
    marginBottom: mm(2),
  },
  author: {
    opacity: 0.7,
    marginBottom: mm(5),
  },
  section: {
    flexShrink: 0,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mm(2),
  },
  sectionTitle: {
    textTransform: 'uppercase',
  },
  sectionTitleLine: {
    flex: 1,
    height: 0.8,
    marginLeft: mm(2),
    backgroundColor: '#000',
  },
  travellersSectionTitle: {
    marginTop: mm(2),
    marginBottom: mm(5),
  },
  columns: {
    flexDirection: 'row',
    gap: mm(4),
  },
  columnsStretch: {
    flex: 1,
    flexShrink: 0,
  },
  columnStretch: {
    justifyContent: 'space-evenly',
  },
  column: {
    flex: 1,
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(1.5),
  },
  columnCompact: {
    gap: mm(0.8),
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  roleIcon: {
    width: mm(14.4),
    height: mm(14.4),
    objectFit: 'contain',
  },
  roleText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: mm(5),
  },
  roleAbility: {
    fontFamily: 'Roboto-Condensed',
    fontWeight: 300,
    color: '#333',
  },
  roleAbilityStacked: {
    marginTop: mm(0.6),
  },
  roleModifications: {
    fontFamily: 'Roboto-Condensed',
    fontWeight: 400,
    color: '#333',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameRowCompact: {
    flexWrap: 'wrap',
  },
  roleJinxIcons: {
    flexDirection: 'row',
    gap: mm(0.5),
    marginLeft: mm(1),
    marginTop: mm(-0.5),
    marginBottom: mm(-0.5),
  },
  roleJinxIconsCompact: {
    marginTop: 0,
    marginBottom: 0,
  },
  roleJinxIcon: {
    width: mm(5),
    height: mm(5),
    flexShrink: 0,
    objectFit: 'contain',
  },
  roleJinxIconCompact: {
    width: mm(5.5),
    height: mm(5.5),
    flexShrink: 0,
    objectFit: 'contain',
  },
  roleCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  roleIconCompact: {
    width: mm(8),
    height: mm(8),
    objectFit: 'contain',
  },
  roleNameCompact: {
    width: mm(26),
    marginLeft: mm(1),
  },
  roleAbilityCompact: {
    flex: 1,
    marginLeft: mm(1),
  },
  jinxIcons: {
    flexDirection: 'row',
    gap: mm(1),
  },
  jinxIcon: {
    width: mm(10.8),
    height: mm(10.8),
    objectFit: 'contain',
  },
  playersTable: {
    borderWidth: 0.75,
    borderColor: '#776644',
    padding: mm(0.15),
  },
  playersTableInner: {
    borderWidth: 0.75,
    borderColor: '#776644',
    paddingVertical: mm(0.75),
    paddingRight: mm(2),
  },
  playersCellInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playersLabelCellInner: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nightColumns: {
    flexDirection: 'row',
    flex: 1,
    gap: mm(4),
  },
  nightColumnNarrow: {
    width: mm(38),
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(3.5),
  },
  nightColumnNarrowLeft: {
    paddingRight: mm(6),
  },
  nightColumnNarrowRight: {
    paddingLeft: mm(6),
    justifyContent: 'flex-end',
  },
  nightColumnWide: {
    flex: 1,
    flexDirection: 'column',
  },
  nightColumnDivider: {
    borderRightWidth: 0.75,
    borderRightColor: '#ccc',
  },
  nightColumnDividerLeft: {
    borderLeftWidth: 0.75,
    borderLeftColor: '#ccc',
  },
  nightColumnRotated: {
    transform: 'rotate(180deg)',
  },
  nightColumnTitle: {
    width: mm(32),
    textTransform: 'uppercase',
    color: '#776644',
  },
  nightColumnList: {
    flexDirection: 'column',
    gap: mm(3.5),
  },
  nightColumnRow: {
    width: mm(32),
    flexDirection: 'row',
    alignItems: 'center',
    gap: mm(1.5),
  },
  nightColumnIcon: {
    width: mm(8),
    height: mm(8),
    flexShrink: 0,
    objectFit: 'contain',
  },
  nightColumnName: {
    flex: 1,
    fontFamily: 'Roboto-Condensed',
    fontWeight: 700,
    color: '#333',
  },
  middleColumnBody: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(4),
  },
  nightDetailColumns: {
    flexDirection: 'row',
    flex: 1,
    gap: mm(6),
  },
  nightDetailColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  nightDetailTitleWrap: {
    alignItems: 'flex-start',
    marginBottom: mm(5),
  },
  nightDetailTitleWrapRotated: {
    alignItems: 'flex-start',
    marginBottom: 0,
    marginTop: mm(5),
  },
  nightDetailTitle: {
    textTransform: 'uppercase',
    color: '#776644',
  },
  nightDetailList: {
    flexDirection: 'column',
    gap: mm(3),
  },
  nightDetailListGrow: {
    flex: 1,
  },
  nightDetailListGrowRotated: {
    justifyContent: 'flex-end',
  },
  nightDetailIcon: {
    width: mm(8),
    height: mm(8),
    flexShrink: 0,
    objectFit: 'contain',
  },
  nightDetailFooter: {
    alignItems: 'flex-end',
    paddingVertical: mm(2),
  },
  nightDetailFooterRotated: {
    alignItems: 'flex-end',
  },
  singleColumnList: {
    flexDirection: 'column',
    gap: mm(2),
  },
  playersRow: {
    flexDirection: 'row',
  },
  playersLabelCell: {
    width: mm(32),
    paddingVertical: mm(1),
    paddingHorizontal: mm(0.5),
  },
  playersCell: {
    flex: 1,
    paddingVertical: mm(1),
    paddingHorizontal: mm(0.3),
  },
})

interface ScriptPdfDocumentProps {
  script: ScriptMeta
  roles: Role[]
  allRoles: RolesById
  settings: PrintSettings
}

export function ScriptPdfDocument({ script, roles, allRoles, settings }: ScriptPdfDocumentProps) {
  const { name, author, color } = script
  const title = name || 'Сценарий'
  const { stretch, fontScale } = settings
  const fs = (value: number) => mm(value) * fontScale

  const fabledRoles = roles.filter((role) => role.team === 'fabled' && role.id !== DJINN_ID)
  const travellerRoles = roles.filter((role) => role.team === 'traveller')
  const jinxes = getActiveJinxes(roles, allRoles)
  const djinn = allRoles[DJINN_ID]
  const showFabledSection = jinxes.length > 0 || fabledRoles.length > 0
  const scriptRoleIds = new Set(roles.map((role) => role.id))
  const jinxPartnersByRole: Record<string, Role[]> = {}
  for (const role of roles) {
    jinxPartnersByRole[role.id] = (role.jinxes ?? [])
      .filter((jinx) => scriptRoleIds.has(jinx.id))
      .map((jinx) => allRoles[jinx.id])
  }
  const hiddenServiceRoleIds =
    settings.playersCount === '5-6' ? new Set(['demoninfo', 'minioninfo']) : new Set<string>()
  const serviceRoles = Object.values(allRoles).filter(
    (role) => !role.team && !hiddenServiceRoleIds.has(role.id),
  )
  const nightOrderRoles = [...roles, ...serviceRoles]
  const firstNightOrder = getNightOrder(nightOrderRoles, 'first')
  const otherNightOrder = getNightOrder(nightOrderRoles, 'other')
  const hasNightOrder =
    settings.nightOrder && (firstNightOrder.length > 0 || otherNightOrder.length > 0)

  return (
    <Document title={title}>
      {settings.playerSheet && (
        <Page size="A4" style={styles.page}>
          {settings.background && <Image src={paperImage} style={styles.background} />}
          <View style={styles.content}>
            {settings.logo && <Image src={logoImage} style={styles.watermark} />}
            <View style={styles.titleRow}>
              <Bold style={[styles.title, { fontSize: px(32) * fontScale, color }]}>{title}</Bold>
              {author && <Text style={[styles.author, { fontSize: fs(3.5) }]}>{author}</Text>}
            </View>
            <Text style={[styles.notFirstNight, { fontSize: fs(3.2) }]}>* Не в первую ночь</Text>

            <View style={styles.contentBody}>
              {PAGE1_TEAMS.map((team) => (
                <RoleTypeSection
                  key={team}
                  title={TEAM_LABELS[team]}
                  roles={roles.filter((role) => role.team === team)}
                  columns={settings.columns}
                  stretch={stretch}
                  fontScale={fontScale}
                  jinxPartnersByRole={jinxPartnersByRole}
                />
              ))}
            </View>
          </View>
        </Page>
      )}

      {settings.storytellerSheet && (
        <Page size="A4" style={styles.page}>
          {settings.background && <Image src={paperImage} style={styles.background} />}
          <View style={[styles.content, styles.contentStorytellerPage]}>
            <View style={styles.nightColumns}>
              {settings.nightOrderColumns && firstNightOrder.length > 0 && (
                <NightOrderColumn
                  title="Первая ночь"
                  entries={firstNightOrder}
                  fontScale={fontScale}
                  divider
                />
              )}

              <View style={styles.nightColumnWide}>
                <View style={styles.titleSmallBoldWrap}>
                  <Bold style={{ fontSize: fs(5.5) }}>{title}</Bold>
                </View>
                {author && (
                  <Text style={[styles.author, styles.titleSmall, { fontSize: fs(4.5) }]}>
                    {author}
                  </Text>
                )}

                <View style={styles.middleColumnBody}>
                  {showFabledSection && (
                    <View style={styles.singleColumnList}>
                      {jinxes.length > 0 && djinn && (
                        <RoleCard role={djinn} fontScale={fontScale} colored={false} />
                      )}
                      {jinxes.map((jinx) => (
                        <JinxRow
                          key={`${jinx.roleA.id}-${jinx.roleB.id}`}
                          jinx={jinx}
                          fontScale={fontScale}
                        />
                      ))}
                      {fabledRoles.map((role) => (
                        <RoleCard key={role.id} role={role} fontScale={fontScale} colored={false} />
                      ))}
                    </View>
                  )}

                  {settings.travellers && travellerRoles.length > 0 && (
                    <View style={styles.section}>
                      <SectionTitle
                        title="Рекомендованные странники"
                        fontScale={fontScale}
                        style={styles.travellersSectionTitle}
                      />
                      <View style={styles.singleColumnList}>
                        {travellerRoles.map((role) => (
                          <RoleCard
                            key={role.id}
                            role={role}
                            fontScale={fontScale}
                            jinxPartners={jinxPartnersByRole[role.id]}
                          />
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {settings.playersTable && <PlayersCountTable fontScale={fontScale} />}
              </View>

              {settings.nightOrderColumns && otherNightOrder.length > 0 && (
                <NightOrderColumn
                  title="Другие ночи"
                  entries={otherNightOrder}
                  fontScale={fontScale}
                  rotated
                  divider
                />
              )}
            </View>
          </View>
        </Page>
      )}

      {hasNightOrder && (
        <Page size="A4" style={styles.page}>
          {settings.background && <Image src={paperImage} style={styles.background} />}
          <View style={[styles.content, styles.contentStorytellerPage]}>
            <View style={styles.nightDetailColumns}>
              {firstNightOrder.length > 0 && (
                <NightOrderDetailColumn
                  title="Первая ночь"
                  entries={firstNightOrder}
                  fontScale={fontScale}
                  scriptTitle={title}
                />
              )}
              {otherNightOrder.length > 0 && (
                <NightOrderDetailColumn
                  title="Другие ночи"
                  entries={otherNightOrder}
                  fontScale={fontScale}
                  scriptTitle={title}
                  rotated
                />
              )}
            </View>
          </View>
        </Page>
      )}
    </Document>
  )
}

function Bold({ style, children }: { style: Style | Style[]; children: string }) {
  return (
    <View style={styles.boldWrap}>
      <Text style={style}>{children}</Text>
      <Text style={[style, styles.boldOverlay]}>{children}</Text>
    </View>
  )
}

function SectionTitle({
  title,
  fontScale,
  style,
}: {
  title: string
  fontScale: number
  style?: Style
}) {
  return (
    <View style={[styles.sectionTitleRow, style ?? {}]}>
      <Bold style={[styles.sectionTitle, { fontSize: mm(3.5) * fontScale }]}>{title}</Bold>
      <View style={styles.sectionTitleLine} />
    </View>
  )
}

function RoleJinxIcons({ roles, compact = false }: { roles: Role[]; compact?: boolean }) {
  if (roles.length === 0) return null

  return (
    <View style={[styles.roleJinxIcons, compact ? styles.roleJinxIconsCompact : {}]}>
      {roles.map((role) => (
        <Image
          key={role.id}
          src={role.image}
          style={compact ? styles.roleJinxIconCompact : styles.roleJinxIcon}
        />
      ))}
    </View>
  )
}

function RoleTypeSection({
  title,
  roles,
  columns,
  stretch,
  fontScale,
  jinxPartnersByRole = {},
}: {
  title: string
  roles: Role[]
  columns: 1 | 2
  stretch: boolean
  fontScale: number
  jinxPartnersByRole?: Record<string, Role[]>
}) {
  if (roles.length === 0) return null

  const compact = columns === 1
  const abilityStyle = [styles.roleAbility, { fontSize: mm(3.5) * fontScale }]

  const canStretch = stretch && roles.length > 1

  return (
    <View style={[styles.section, canStretch ? { flexGrow: roles.length } : {}]}>
      <SectionTitle title={title} fontScale={fontScale} />
      <View style={[styles.columns, canStretch ? styles.columnsStretch : {}]}>
        {splitIntoColumns(roles, columns).map((column, index) => (
          <View
            key={index}
            style={[
              styles.column,
              compact ? styles.columnCompact : {},
              canStretch && column.length > 1 ? styles.columnStretch : {},
            ]}
          >
            {column.map((role) => {
              const nameStyle = {
                fontSize: mm(3.5) * fontScale,
                color: role.team ? TEAM_PRINT_COLOR[role.team] : undefined,
              }
              const jinxPartners = jinxPartnersByRole[role.id] ?? []
              return compact ? (
                <View key={role.id} style={styles.roleCompact} wrap={false}>
                  <Image src={role.image} style={styles.roleIconCompact} />
                  <View style={[styles.roleNameCompact, styles.nameRow, styles.nameRowCompact]}>
                    <Bold style={nameStyle}>{role.name}</Bold>
                    <RoleJinxIcons roles={jinxPartners} compact />
                  </View>
                  <Text style={[...abilityStyle, styles.roleAbilityCompact]}>
                    {role.ability}
                    {role.modifications && (
                      <Text style={styles.roleModifications}> [{role.modifications}]</Text>
                    )}
                  </Text>
                </View>
              ) : (
                <View key={role.id} style={styles.role} wrap={false}>
                  <Image src={role.image} style={styles.roleIcon} />
                  <View style={styles.roleText}>
                    <View style={styles.nameRow}>
                      <Bold style={nameStyle}>{role.name}</Bold>
                      <RoleJinxIcons roles={jinxPartners} />
                    </View>
                    <Text style={[...abilityStyle, styles.roleAbilityStacked]}>
                      {role.ability}
                      {role.modifications && (
                        <Text style={styles.roleModifications}> [{role.modifications}]</Text>
                      )}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        ))}
      </View>
    </View>
  )
}

function RoleCard({
  role,
  fontScale,
  colored = true,
  jinxPartners = [],
}: {
  role: Role
  fontScale: number
  colored?: boolean
  jinxPartners?: Role[]
}) {
  const nameStyle = {
    fontSize: mm(3.5) * fontScale,
    color: colored ? (role.team ? TEAM_PRINT_COLOR[role.team] : undefined) : '#333',
  }

  return (
    <View style={styles.role} wrap={false}>
      <Image src={role.image} style={styles.roleIcon} />
      <View style={styles.roleText}>
        <View style={styles.nameRow}>
          <Bold style={nameStyle}>{role.name}</Bold>
          <RoleJinxIcons roles={jinxPartners} />
        </View>
        <Text
          style={[styles.roleAbility, styles.roleAbilityStacked, { fontSize: mm(3.5) * fontScale }]}
        >
          {role.ability}
          {role.modifications && (
            <Text style={styles.roleModifications}> [{role.modifications}]</Text>
          )}
        </Text>
      </View>
    </View>
  )
}

function JinxRow({ jinx, fontScale }: { jinx: ActiveJinx; fontScale: number }) {
  return (
    <View style={styles.role} wrap={false}>
      <View style={styles.jinxIcons}>
        <Image src={jinx.roleA.image} style={styles.jinxIcon} />
        <Image src={jinx.roleB.image} style={styles.jinxIcon} />
      </View>
      <View style={styles.roleText}>
        <Text style={[styles.roleAbility, { fontSize: mm(3.5) * fontScale }]}>{jinx.reason}</Text>
      </View>
    </View>
  )
}

function NightOrderColumn({
  title,
  entries,
  fontScale,
  rotated = false,
  divider = false,
}: {
  title: string
  entries: NightOrderEntry[]
  fontScale: number
  rotated?: boolean
  divider?: boolean
}) {
  const orderedEntries = rotated ? [...entries].reverse() : entries

  const titleEl = (
    <View style={rotated ? styles.nightColumnRotated : {}}>
      <Bold style={[styles.nightColumnTitle, { fontSize: mm(4) * fontScale }]}>{title}</Bold>
    </View>
  )
  const listEl = (
    <View style={styles.nightColumnList}>
      {orderedEntries.map(({ role }) => (
        <View
          key={role.id}
          style={[styles.nightColumnRow, rotated ? styles.nightColumnRotated : {}]}
          wrap={false}
        >
          <Image src={role.image} style={styles.nightColumnIcon} />
          <Text style={[styles.nightColumnName, { fontSize: mm(3.5) * fontScale }]}>
            {role.name}
          </Text>
        </View>
      ))}
    </View>
  )

  const sideStyle = rotated ? styles.nightColumnNarrowRight : styles.nightColumnNarrowLeft
  const dividerStyle = divider
    ? rotated
      ? styles.nightColumnDividerLeft
      : styles.nightColumnDivider
    : {}

  return (
    <View style={[styles.nightColumnNarrow, sideStyle, dividerStyle]}>
      {rotated ? (
        <>
          {listEl}
          {titleEl}
        </>
      ) : (
        <>
          {titleEl}
          {listEl}
        </>
      )}
    </View>
  )
}

function NightOrderDetailColumn({
  title,
  entries,
  fontScale,
  scriptTitle,
  rotated = false,
}: {
  title: string
  entries: NightOrderEntry[]
  fontScale: number
  scriptTitle: string
  rotated?: boolean
}) {
  const orderedEntries = rotated ? [...entries].reverse() : entries
  const rotatedStyle = rotated ? styles.nightColumnRotated : {}

  const titleEl = (
    <View
      style={[
        styles.nightDetailTitleWrap,
        rotated ? styles.nightDetailTitleWrapRotated : {},
        rotatedStyle,
      ]}
    >
      <Bold style={[styles.nightDetailTitle, { fontSize: mm(5) * fontScale }]}>{title}</Bold>
    </View>
  )

  const footerEl = (
    <View
      style={[
        styles.nightDetailFooter,
        rotated ? styles.nightDetailFooterRotated : styles.nightColumnRotated,
      ]}
    >
      <Bold style={{ fontSize: mm(4) * fontScale }}>{scriptTitle}</Bold>
    </View>
  )

  const listEl = (
    <View
      style={[
        styles.nightDetailList,
        styles.nightDetailListGrow,
        rotated ? styles.nightDetailListGrowRotated : {},
      ]}
    >
      {orderedEntries.map(({ role, hint }) => (
        <View key={role.id} style={[styles.role, rotatedStyle]} wrap={false}>
          <Image src={role.image} style={styles.nightDetailIcon} />
          <View style={styles.roleText}>
            <Bold
              style={{
                fontSize: mm(3.5) * fontScale,
                color: role.team ? TEAM_PRINT_COLOR[role.team] : '#776644',
              }}
            >
              {role.name}
            </Bold>
            {hint && (
              <Text
                style={[
                  styles.roleAbility,
                  styles.roleAbilityStacked,
                  { fontSize: mm(3.5) * fontScale },
                ]}
              >
                {hint}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.nightDetailColumn}>
      {rotated ? (
        <>
          {footerEl}
          {listEl}
          {titleEl}
        </>
      ) : (
        <>
          {titleEl}
          {listEl}
          {footerEl}
        </>
      )}
    </View>
  )
}

function PlayersCountTable({ fontScale }: { fontScale: number }) {
  const { players, townsfolk, outsider, minion, demon } = PLAYERS_COUNT_TABLE

  const rows: [string, number[], string][] = [
    ['ГОРОЖАНЕ', townsfolk, '#0066bb'],
    ['ИЗГОИ', outsider, '#0066bb'],
    ['ПРИСПЕШНИКИ', minion, '#aa2211'],
    ['ДЕМОНЫ', demon, '#aa2211'],
  ]

  const cellFontSize = { fontSize: mm(5) * fontScale, transform: 'scaleY(0.8)' }
  const labelFontSize = { fontSize: mm(3.2) * fontScale }

  return (
    <View style={styles.playersTable}>
      <View style={styles.playersTableInner}>
        <View style={styles.playersRow}>
          <View style={[styles.playersLabelCell, styles.playersLabelCellInner]}>
            <Bold style={[labelFontSize, { color: '#776644' }]}>ИГРОКИ</Bold>
          </View>
          {players.map((count, index) => (
            <View key={count} style={[styles.playersCell, styles.playersCellInner]}>
              <Bold style={[cellFontSize, { color: '#776644' }]}>
                {index === players.length - 1 ? '15+' : String(count)}
              </Bold>
            </View>
          ))}
        </View>
        {rows.map(([label, counts, color]) => (
          <View key={label} style={styles.playersRow}>
            <View style={[styles.playersLabelCell, styles.playersLabelCellInner]}>
              <Bold style={[labelFontSize, { color }]}>{label}</Bold>
            </View>
            {counts.map((count, index) => (
              <View key={players[index]} style={[styles.playersCell, styles.playersCellInner]}>
                <Bold style={[cellFontSize, { color }]}>{String(count)}</Bold>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
