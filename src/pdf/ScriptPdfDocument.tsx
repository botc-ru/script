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
import paperImage from '../assets/images/paper.png'

registerPdfFonts()

const PAGE1_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']

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
    paddingBottom: mm(8),
  },
  contentBody: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(4),
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
    marginBottom: mm(1),
    fontFamily: 'Roboto-Condensed',
    fontWeight: 300,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: mm(3.5),
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
  author: {
    opacity: 0.7,
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
    height: 1,
    marginLeft: mm(2),
    backgroundColor: '#000',
  },
  columns: {
    flexDirection: 'row',
    gap: mm(4),
  },
  columnsStretch: {
    flex: 1,
    flexShrink: 0,
  },
  column: {
    flex: 1,
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(2),
  },
  columnStretch: {
    justifyContent: 'space-around',
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
    marginTop: mm(1),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleJinxIcons: {
    flexDirection: 'row',
    gap: mm(0.5),
    marginLeft: mm(1),
    marginTop: mm(-1.5),
    marginBottom: mm(-1.5),
  },
  roleJinxIcon: {
    width: mm(7),
    height: mm(7),
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
  playersTable: {
    position: 'absolute',
    left: mm(8),
    right: mm(8),
    bottom: mm(6),
    borderWidth: 2,
    borderColor: '#776644',
  },
  playersRow: {
    flexDirection: 'row',
  },
  playersLabelCell: {
    width: mm(28),
    padding: mm(1.5),
    fontFamily: 'Roboto-Condensed',
  },
  playersCell: {
    flex: 1,
    padding: mm(1.5),
    textAlign: 'center',
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

  const loricRoles = roles.filter((role) => role.team === 'loric')
  const fabledRoles = roles.filter((role) => role.team === 'fabled')
  const travellerRoles = roles.filter((role) => role.team === 'traveller')
  const jinxes = getActiveJinxes(roles, allRoles)
  const scriptRoleIds = new Set(roles.map((role) => role.id))
  const jinxPartnersByRole: Record<string, Role[]> = {}
  for (const role of roles) {
    jinxPartnersByRole[role.id] = (role.jinxes ?? [])
      .filter((jinx) => scriptRoleIds.has(jinx.id))
      .map((jinx) => allRoles[jinx.id])
  }
  const firstNightOrder = getNightOrder(roles, 'first')
  const otherNightOrder = getNightOrder(roles, 'other')
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
          <View style={styles.content}>
            <Text style={[styles.titleSmall, { fontSize: fs(4) }]}>{title}</Text>

            <View style={styles.contentBody}>
              <RoleTypeSection
                title={TEAM_LABELS.loric}
                roles={loricRoles}
                columns={2}
                stretch={false}
                fontScale={fontScale}
                jinxPartnersByRole={jinxPartnersByRole}
              />
              <RoleTypeSection
                title={TEAM_LABELS.fabled}
                roles={fabledRoles}
                columns={2}
                stretch={false}
                fontScale={fontScale}
                jinxPartnersByRole={jinxPartnersByRole}
              />
              {jinxes.length > 0 && (
                <JinxSection jinxes={jinxes} columns={2} fontScale={fontScale} />
              )}
              <RoleTypeSection
                title={TEAM_LABELS.traveller}
                roles={travellerRoles}
                columns={2}
                stretch={false}
                fontScale={fontScale}
                jinxPartnersByRole={jinxPartnersByRole}
              />
            </View>

            <PlayersCountTable fontScale={fontScale} />
          </View>
        </Page>
      )}

      {hasNightOrder && (
        <Page size="A4" style={styles.page}>
          {settings.background && <Image src={paperImage} style={styles.background} />}
          <View style={styles.content}>
            <Text style={[styles.titleSmall, { fontSize: fs(4) }]}>{title}</Text>

            <View style={styles.contentBody}>
              {firstNightOrder.length > 0 && (
                <NightOrderSection
                  title="Первая ночь"
                  entries={firstNightOrder}
                  fontScale={fontScale}
                />
              )}
              {otherNightOrder.length > 0 && (
                <NightOrderSection
                  title="Другие ночи"
                  entries={otherNightOrder}
                  fontScale={fontScale}
                />
              )}
            </View>
          </View>
        </Page>
      )}
    </Document>
  )
}

// Petersburg не имеет отдельного жирного начертания, поэтому имитируем
// bold, накладывая копию текста со сдвигом в долю пункта.
function Bold({ style, children }: { style: Style | Style[]; children: string }) {
  return (
    <View style={styles.boldWrap}>
      <Text style={style}>{children}</Text>
      <Text style={[style, styles.boldOverlay]}>{children}</Text>
    </View>
  )
}

function SectionTitle({ title, fontScale }: { title: string; fontScale: number }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Bold style={[styles.sectionTitle, { fontSize: mm(3.5) * fontScale }]}>{title}</Bold>
      <View style={styles.sectionTitleLine} />
    </View>
  )
}

function RoleJinxIcons({ roles }: { roles: Role[] }) {
  if (roles.length === 0) return null

  return (
    <View style={styles.roleJinxIcons}>
      {roles.map((role) => (
        <Image key={role.id} src={role.image} style={styles.roleJinxIcon} />
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
            style={[styles.column, canStretch && column.length > 1 ? styles.columnStretch : {}]}
          >
            {column.map((role) => {
              const nameStyle = {
                fontSize: mm(3.5) * fontScale,
                color: TEAM_PRINT_COLOR[role.team],
              }
              const jinxPartners = jinxPartnersByRole[role.id] ?? []
              return compact ? (
                <View key={role.id} style={styles.roleCompact} wrap={false}>
                  <Image src={role.image} style={styles.roleIconCompact} />
                  <View style={[styles.roleNameCompact, styles.nameRow]}>
                    <Bold style={nameStyle}>{role.name}</Bold>
                    <RoleJinxIcons roles={jinxPartners} />
                  </View>
                  <Text style={[...abilityStyle, styles.roleAbilityCompact]}>{role.ability}</Text>
                </View>
              ) : (
                <View key={role.id} style={styles.role} wrap={false}>
                  <Image src={role.image} style={styles.roleIcon} />
                  <View style={styles.roleText}>
                    <View style={styles.nameRow}>
                      <Bold style={nameStyle}>{role.name}</Bold>
                      <RoleJinxIcons roles={jinxPartners} />
                    </View>
                    <Text style={[...abilityStyle, styles.roleAbilityStacked]}>{role.ability}</Text>
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

function JinxSection({
  jinxes,
  columns,
  fontScale,
}: {
  jinxes: ActiveJinx[]
  columns: 1 | 2
  fontScale: number
}) {
  return (
    <View style={styles.section}>
      <SectionTitle title="Правила Джинна" fontScale={fontScale} />
      <View style={styles.columns}>
        {splitIntoColumns(jinxes, columns).map((column, index) => (
          <View key={index} style={styles.column}>
            {column.map((jinx) => (
              <View
                key={`${jinx.roleA.id}-${jinx.roleB.id}`}
                style={styles.role}
                wrap={false}
              >
                <View style={styles.jinxIcons}>
                  <Image src={jinx.roleA.image} style={styles.roleIcon} />
                  <Image src={jinx.roleB.image} style={styles.roleIcon} />
                </View>
                <View style={styles.roleText}>
                  <Text style={[styles.roleAbility, { fontSize: mm(3.5) * fontScale }]}>
                    {jinx.reason}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

function NightOrderSection({
  title,
  entries,
  fontScale,
}: {
  title: string
  entries: NightOrderEntry[]
  fontScale: number
}) {
  return (
    <View style={styles.section}>
      <SectionTitle title={title} fontScale={fontScale} />
      <View style={styles.columns}>
        {splitIntoColumns(entries, 2).map((column, index) => (
          <View key={index} style={styles.column}>
            {column.map(({ role, hint }) => (
              <View key={role.id} style={styles.role} wrap={false}>
                <Image src={role.image} style={styles.roleIcon} />
                <View style={styles.roleText}>
                  <Bold style={{ fontSize: mm(3.5) * fontScale, color: TEAM_PRINT_COLOR[role.team] }}>
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
        ))}
      </View>
    </View>
  )
}

function PlayersCountTable({ fontScale }: { fontScale: number }) {
  const { players, townsfolk, outsider, minion, demon } = PLAYERS_COUNT_TABLE

  const rows: [string, number[]][] = [
    ['ГОРОЖАНЕ', townsfolk],
    ['ИЗГОИ', outsider],
    ['ПРИСПЕШНИКИ', minion],
    ['ДЕМОНЫ', demon],
  ]

  const labelStyle = [styles.playersLabelCell, { fontSize: mm(3) * fontScale }]
  const cellStyle = [styles.playersCell, { fontSize: mm(4) * fontScale }]

  return (
    <View style={styles.playersTable}>
      <View style={styles.playersRow}>
        <Text style={labelStyle}>ИГРОКИ</Text>
        {players.map((count, index) => (
          <Text key={count} style={cellStyle}>
            {index === players.length - 1 ? '15+' : count}
          </Text>
        ))}
      </View>
      {rows.map(([label, counts]) => (
        <View key={label} style={styles.playersRow}>
          <Text style={labelStyle}>{label}</Text>
          {counts.map((count, index) => (
            <Text key={players[index]} style={cellStyle}>
              {count}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}
