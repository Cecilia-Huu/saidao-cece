import {
  CAREERS,
  CHANNELS,
  PERSONAS,
  QUESTIONS,
  TYPE_NAMES,
  type BackgroundFlag,
  type Career,
  type Channel,
  type EduId,
  type HollandCode,
  type HollandScoreKey,
  type MajorId,
  type MbtiLetter,
  type Persona,
  type ScoreKey,
} from '../data/catalog'

export type Answers = Record<number, number | number[]>

/** 兴趣岛已覆盖霍兰德，答题只保留性格 / 情景 / 背景 */
export const QUIZ_QUESTIONS = QUESTIONS.filter((q) => q.category !== 'interest')

const TOOL_FLAGS: BackgroundFlag[] = [
  'tool_python',
  'tool_backend',
  'tool_frontend',
  'tool_data',
  'tool_figma',
  'tool_content',
  'tool_office',
]

function hasTechSignal(flags: BackgroundFlag[]): boolean {
  return (
    flags.includes('skill_code') ||
    flags.includes('goal_tech') ||
    flags.includes('tool_python') ||
    flags.includes('tool_backend') ||
    flags.includes('tool_frontend') ||
    flags.includes('tool_data')
  )
}

const MBTI_KEYS: MbtiLetter[] = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
const HOLLAND_KEYS: HollandScoreKey[] = ['hR', 'hI', 'hA', 'hS', 'hE', 'hC']
const HOLLAND_FROM_CODE: Record<HollandCode, HollandScoreKey> = {
  R: 'hR',
  I: 'hI',
  A: 'hA',
  S: 'hS',
  E: 'hE',
  C: 'hC',
}
const HOLLAND_LABEL: Record<HollandScoreKey, string> = {
  hR: 'R',
  hI: 'I',
  hA: 'A',
  hS: 'S',
  hE: 'E',
  hC: 'C',
}
const VALUE_KEYS = ['impact', 'growth', 'stability', 'creativity'] as const

export interface Profile {
  scores: Record<string, number>
  mbtiType: string
  mbtiName: string
  hollandCode: string
  hollandRank: HollandCode[]
  flags: BackgroundFlag[]
  persona: Persona
  edu?: EduId
  major?: MajorId
}

export interface RankedCareer extends Career {
  match: number
  channelDetails: Channel[]
  why: string[]
}

function emptyScores(): Record<string, number> {
  const scores: Record<string, number> = {}
  ;[...MBTI_KEYS, ...HOLLAND_KEYS, ...VALUE_KEYS].forEach((k) => {
    scores[k] = 0
  })
  return scores
}

export function buildProfile(
  answers: Answers,
  hollandRank: HollandCode[] = [],
  edu?: EduId,
  major?: MajorId,
): Profile {
  const scores = emptyScores()
  const flags: BackgroundFlag[] = []

  // 兴趣岛权重：第1/2/3 名
  const islandWeights = [8, 5, 3]
  hollandRank.forEach((code, i) => {
    const key = HOLLAND_FROM_CODE[code]
    scores[key] = (scores[key] ?? 0) + (islandWeights[i] ?? 2)
  })

  QUIZ_QUESTIONS.forEach((q) => {
    const raw = answers[q.id]
    if (raw === undefined) return
    const indices = Array.isArray(raw) ? raw : [raw]
    indices.forEach((optIdx) => {
      const opt = q.options[optIdx]
      if (!opt) return
      if (opt.scores) {
        Object.entries(opt.scores).forEach(([k, v]) => {
          scores[k] = (scores[k] ?? 0) + (v ?? 0)
        })
      }
      if (opt.flags) flags.push(...opt.flags)
    })
  })

  // 学历微调：博士强化研究向，本科强化执行成长向
  if (edu === 'phd') {
    scores.hI += 3
    scores.I += 2
    scores.N += 1
  } else if (edu === 'master') {
    scores.hI += 1
    scores.T += 1
  } else if (edu === 'college') {
    scores.hR += 1
    scores.S += 1
  }

  const mbtiType = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('')

  const hollandSorted = [...HOLLAND_KEYS].sort((a, b) => scores[b] - scores[a])
  const hollandCode =
    hollandRank.length === 3
      ? hollandRank.join('')
      : hollandSorted.slice(0, 3).map((k) => HOLLAND_LABEL[k]).join('')

  return {
    scores,
    mbtiType,
    mbtiName: TYPE_NAMES[mbtiType] ?? '探索者',
    hollandCode,
    hollandRank,
    flags,
    persona: pickPersona(scores, flags),
    edu,
    major,
  }
}

function pickPersona(scores: Record<string, number>, flags: BackgroundFlag[]): Persona {
  const candidates: { id: string; score: number }[] = [
    {
      id: 'logic-builder',
      score: scores.T * 2 + scores.I + scores.J + scores.hR + scores.hI,
    },
    {
      id: 'creative-social',
      score: scores.hA * 2 + scores.E + scores.hS + scores.F + scores.creativity,
    },
    {
      id: 'steady-executor',
      score: scores.hC * 2 + scores.J + scores.S + scores.stability,
    },
    {
      id: 'growth-hunter',
      score:
        scores.hE * 2 + scores.growth + scores.impact + (flags.includes('pressure_ok') ? 4 : 0),
    },
    {
      id: 'insight-seeker',
      score: scores.hI * 2 + scores.I + scores.N + scores.T,
    },
    {
      id: 'experience-crafter',
      score: scores.hA * 2 + scores.F + scores.N + scores.creativity,
    },
  ]

  candidates.sort((a, b) => b.score - a.score)
  return PERSONAS.find((p) => p.id === candidates[0].id) ?? PERSONAS[0]
}

function cosineSimilarity(
  user: Record<string, number>,
  ideal: Partial<Record<ScoreKey, number>>,
): number {
  const keys = Object.keys(ideal) as ScoreKey[]
  if (keys.length === 0) return 0

  let dot = 0
  let normU = 0
  let normI = 0
  keys.forEach((k) => {
    const u = user[k] ?? 0
    const i = ideal[k] ?? 0
    const uScaled = Math.min(100, u * 12)
    dot += uScaled * i
    normU += uScaled * uScaled
    normI += i * i
  })
  if (normU === 0 || normI === 0) return 0
  return dot / (Math.sqrt(normU) * Math.sqrt(normI))
}

function applyBackgroundBoost(career: Career, flags: BackgroundFlag[]): number {
  let boost = 0
  if (flags.includes('skill_code') && career.track === 'tech') boost += 0.04
  if (flags.includes('skill_design') && ['design', 'content-ops', 'pm'].includes(career.id))
    boost += 0.05
  if (
    flags.includes('skill_ops') &&
    ['user-ops', 'content-ops', 'growth', 'marketing', 'sales-cs'].includes(career.id)
  )
    boost += 0.05
  if (flags.includes('goal_tech') && career.track === 'tech') boost += 0.03
  if (flags.includes('goal_product') && ['pm', 'design'].includes(career.id)) boost += 0.04
  if (
    flags.includes('goal_ops') &&
    ['user-ops', 'content-ops', 'growth', 'marketing'].includes(career.id)
  )
    boost += 0.04
  if (flags.includes('pressure_balance') && (career.ideal.stability ?? 0) >= 65) boost += 0.02
  if (flags.includes('pressure_ok') && (career.ideal.growth ?? 0) >= 70) boost += 0.02

  // 已会工具：比「方向感觉」更硬的匹配信号
  boost += applyToolBoost(career, flags)
  return boost
}

function applyToolBoost(career: Career, flags: BackgroundFlag[]): number {
  const hasTools = TOOL_FLAGS.some((f) => flags.includes(f))
  if (!hasTools) return 0

  let boost = 0
  const hit = (ids: string[]) => (ids.includes(career.id) ? 0.055 : 0)

  if (flags.includes('tool_python'))
    boost += hit(['data', 'algorithm', 'backend', 'data-eng', 'fullstack'])
  if (flags.includes('tool_backend'))
    boost += hit(['backend', 'client', 'fullstack', 'devops', 'security', 'algorithm'])
  if (flags.includes('tool_frontend')) boost += hit(['frontend', 'fullstack', 'client', 'design'])
  if (flags.includes('tool_data'))
    boost += hit(['data', 'growth', 'strategy', 'pm', 'product-ops', 'ecommerce-ops'])
  if (flags.includes('tool_figma')) boost += hit(['design', 'pm', 'product-ops', 'game-planner'])
  if (flags.includes('tool_content'))
    boost += hit(['content-ops', 'live-ops', 'marketing', 'design', 'game-planner'])
  if (flags.includes('tool_office'))
    boost += hit(['strategy', 'pm', 'hr', 'project', 'product-ops', 'marketing'])

  // 工具加分封顶，避免多选把性格主排序盖掉
  return Math.min(0.12, boost)
}

/** 需要较强工程门槛的岗位：非对口专业默认压下去，避免「国关 → 后端」 */
const STEM_STRICT_IDS = new Set([
  'frontend',
  'backend',
  'client',
  'fullstack',
  'algorithm',
  'data-eng',
  'devops',
  'security',
  'test',
])

/**
 * 专业只做「门槛 + 微弱加分」，不再强行牵引 Top3。
 * 性格 / 兴趣岛 / 情景题才是主排序；专业负责挡住明显不现实的硬核工程岗。
 */
function applyMajorAdjustment(
  career: Career,
  flags: BackgroundFlag[],
  edu?: EduId,
  major?: MajorId,
): number {
  let adj = 0
  if (!major) return adj

  const fits = career.majorFit.includes(major)
  const wantsTech = hasTechSignal(flags)

  if (STEM_STRICT_IDS.has(career.id) && !fits) {
    // 无技术信号：强过滤；有代码/技术目标：仅轻降，允许性格真的偏研发时冲进来
    adj += wantsTech ? -0.08 : -0.22
  } else if (fits) {
    // 专业对口只做轻量加分（约 2～3 分），不能盖过性格差异
    adj += 0.025
  }

  if (edu === 'phd' && ['algorithm', 'data', 'strategy', 'security'].includes(career.id)) adj += 0.03
  if (edu === 'master' && fits && STEM_STRICT_IDS.has(career.id)) adj += 0.015
  if (
    edu === 'college' &&
    ['frontend', 'test', 'user-ops', 'content-ops', 'ecommerce-ops', 'sales-cs'].includes(career.id)
  )
    adj += 0.02
  if (edu === 'graduated' && ['sales-cs', 'growth', 'project', 'hr'].includes(career.id)) adj += 0.015
  return adj
}

/** 让 Top3 与结果页「人设」同向，减少「性格说一套、岗位推另一套」 */
function applyPersonaAffinity(career: Career, personaId: string): number {
  const affinity: Record<string, string[]> = {
    'logic-builder': ['backend', 'data', 'algorithm', 'frontend', 'project', 'test', 'devops'],
    'creative-social': ['content-ops', 'user-ops', 'marketing', 'live-ops', 'design', 'game-planner'],
    'steady-executor': ['project', 'test', 'supply-chain', 'hr', 'ecommerce-ops', 'product-ops'],
    'growth-hunter': ['growth', 'sales-cs', 'marketing', 'live-ops', 'ecommerce-ops', 'user-ops'],
    'insight-seeker': ['data', 'strategy', 'algorithm', 'pm', 'product-ops'],
    'experience-crafter': ['design', 'content-ops', 'pm', 'game-planner', 'product-ops', 'user-ops'],
  }
  return affinity[personaId]?.includes(career.id) ? 0.04 : 0
}

export function getRecommendations(profile: Profile, topN = 6): RankedCareer[] {
  const ranked = CAREERS.map((career) => {
    // 主分：性格/兴趣/价值观余弦相似
    const sim = cosineSimilarity(profile.scores, career.ideal)
    const boost =
      applyBackgroundBoost(career, profile.flags) +
      applyPersonaAffinity(career, profile.persona.id) +
      applyMajorAdjustment(career, profile.flags, profile.edu, profile.major)
    const match = Math.min(98, Math.max(38, Math.round((sim + boost) * 100)))
    const channelDetails = career.channels
      .map((id) => CHANNELS.find((c) => c.id === id))
      .filter((c): c is Channel => Boolean(c))

    const why: string[] = [
      `性格侧：MBTI ${profile.mbtiType}（${profile.mbtiName}）与「${career.title}」工作风格较契合`,
      `兴趣侧：兴趣岛 ${profile.hollandCode} 与该岗位气质有重叠`,
      `人设侧：与「${profile.persona.title}」的优势发挥场景更接近`,
    ]
    if (profile.major && career.majorFit.includes(profile.major)) {
      why.push('专业侧：与你的专业叙事更顺（加分项，非唯一依据）')
    } else if (profile.major && STEM_STRICT_IDS.has(career.id) && !career.majorFit.includes(profile.major)) {
      why.push('门槛提醒：该方向偏工程技术，非对口专业需先确认兴趣并补作品/实习')
    }
    if (profile.flags.includes('internship_yes')) {
      why.push('你已有相关实战经历，可按校招/正式岗标准准备作品与简历')
    }
    const toolHits = TOOL_FLAGS.filter((f) => profile.flags.includes(f))
    if (toolHits.length > 0 && applyToolBoost(career, profile.flags) >= 0.05) {
      why.push('工具侧：你勾选的技能栈与该岗位日常工具较匹配')
    }

    return { ...career, match, channelDetails, why }
  })

  ranked.sort((a, b) => b.match - a.match)
  return ranked.slice(0, topN)
}

export function buildIdentityTip(edu?: EduId, major?: MajorId, topTitle?: string): string {
  const target = topTitle ?? '目标岗位'
  const majorHint =
    major === 'cs'
      ? '计算机背景很吃香，简历突出项目与代码能力。'
      : major === 'math'
        ? '数理背景适合强调建模、分析与严谨推理。'
        : major === 'business'
          ? '经管背景适合强调商业sense、活动与结果数据。'
          : major === 'design'
            ? '设计背景一定要作品集说话。'
            : major === 'media'
              ? '传媒背景适合内容案例与传播复盘。'
              : major === 'ee'
                ? '电子信息背景可强调系统感与工程实践。'
                : major === 'humanities'
                  ? '人文/国关等背景适合强调研究、写作、跨文化沟通与政策/商业洞察，优先产品运营、市场、战略、内容等方向。'
                  : '跨专业也没关系，用项目证明兴趣与能力迁移。'

  if (edu === 'phd') {
    return `博士阶段冲「${target}」时，突出研究深度与可落地成果；若走技术岗需补工程作品。${majorHint}`
  }
  if (edu === 'master') {
    return `硕士在读冲「${target}」，校招窗口很关键：针对性补作品/实习，再精准投递。${majorHint}`
  }
  if (edu === 'undergrad') {
    return `本科在读冲「${target}」，优先实习与作品，把专业优势写进岗位匹配叙事。${majorHint}`
  }
  if (edu === 'college') {
    return `大专/高职同学冲「${target}」，用扎实作品与实习证明能力，岗位可更偏执行落地。${majorHint}`
  }
  if (edu === 'graduated') {
    return `已毕业可把「${target}」按初级岗准备，突出可量化成绩与可迁移能力。${majorHint}`
  }
  return `结合身份信息，建议先深挖「${target}」，用 2～3 个项目证明你为什么适合它。${majorHint}`
}

export function buildExperienceTip(flags: BackgroundFlag[], topTitle: string): string {
  if (flags.includes('internship_yes')) {
    return `你已有相关实习/项目底子，推荐岗位「${topTitle}」可以按校招或初级正式岗去冲；把项目量化进简历，主攻牛客面经 + BOSS 精准投递。`
  }
  if (flags.includes('skill_none') || flags.includes('internship_no')) {
    return `你还在积累期，建议先以「${topTitle}」为方向做 1 个可展示小项目或找实习；作品比海投数量更重要。`
  }
  if (flags.includes('skill_code')) {
    return `技术向能力是你的加分项，冲「${topTitle}」时优先补齐对应栈的作品，并刷牛客真题找手感。`
  }
  if (flags.includes('skill_design')) {
    return `创意表达是你的长板，冲「${topTitle}」请先打磨作品集，再配合 BOSS 定向投递。`
  }
  if (flags.includes('skill_ops')) {
    return `你有推进与沟通底子，冲「${topTitle}」时准备 1～2 个活动/社群案例（目标-动作-数据），会很加分。`
  }
  return `结合测评，建议先深挖「${topTitle}」：看 3 份 JD、做 1 个小练习、再决定是否主投。`
}

export const STORAGE_KEY = 'saidao-quiz-v5'

export interface StoredState {
  page: 'home' | 'islands' | 'quiz' | 'profile' | 'result'
  answers: Answers
  index: number
  hollandRank: HollandCode[]
  edu?: EduId
  major?: MajorId
}

export function loadStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredState
  } catch {
    return null
  }
}

export function saveStored(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearStored() {
  localStorage.removeItem(STORAGE_KEY)
}
