export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export type QuestionCategory = 'personality' | 'interest' | 'scenario' | 'background'
export type HollandScoreKey = 'hR' | 'hI' | 'hA' | 'hS' | 'hE' | 'hC'
export type ScoreKey = MbtiLetter | HollandScoreKey | 'impact' | 'growth' | 'stability' | 'creativity'

export type BackgroundFlag =
  | 'internship_yes'
  | 'internship_no'
  | 'skill_code'
  | 'skill_design'
  | 'skill_ops'
  | 'skill_none'
  | 'goal_tech'
  | 'goal_product'
  | 'goal_ops'
  | 'goal_unsure'
  | 'pressure_ok'
  | 'pressure_balance'
  | 'tool_python'
  | 'tool_backend'
  | 'tool_frontend'
  | 'tool_data'
  | 'tool_figma'
  | 'tool_content'
  | 'tool_office'
  | 'tool_none'

export interface QuestionOption {
  text: string
  scores?: Partial<Record<ScoreKey, number>>
  flags?: BackgroundFlag[]
  vibe?: string
}

export interface Question {
  id: number
  category: QuestionCategory
  text: string
  options: QuestionOption[]
  /** 多选题：可选多个工具/技能 */
  multi?: boolean
  hint?: string
}

export interface Career {
  id: string
  title: string
  track: 'tech' | 'product-ops' | 'business' | 'function'
  emoji: string
  description: string
  daily: string
  skills: string[]
  salary: string
  outlook: string
  tags: string[]
  ideal: Partial<Record<ScoreKey, number>>
  channels: string[]
  searchTips: string[]
  tipInterview: string
  /** 更匹配的专业方向 */
  majorFit: MajorId[]
  /** 参考大厂校招品类 */
  refs: string[]
}

export type EduId =
  | 'college'
  | 'undergrad'
  | 'master'
  | 'phd'
  | 'graduated'

export type MajorId =
  | 'cs'
  | 'ee'
  | 'math'
  | 'business'
  | 'design'
  | 'media'
  | 'humanities'
  | 'other'

export interface EduOption {
  id: EduId
  label: string
  hint: string
}

export interface MajorOption {
  id: MajorId
  label: string
  hint: string
}

export interface Channel {
  id: string
  name: string
  bestFor: string
  tip: string
}

export interface Persona {
  id: string
  title: string
  emoji: string
  blurb: string
  egg: string
  strengths: { title: string; detail: string; tag?: string }[]
  blockers: { title: string; detail: string; solution: string; signal?: string }[]
}

export interface Island {
  code: HollandCode
  name: string
  emoji: string
  subtitle: string
  description: string
  vibe: string
}

export const SECTION_META: Record<
  QuestionCategory,
  { label: string; cheer: string; order: number }
> = {
  personality: {
    label: '性格偏好',
    cheer: '性格篇完成！你已经比 80% 还在纠结的人更了解自己一点了 ✨',
    order: 1,
  },
  interest: {
    label: '兴趣倾向',
    cheer: '兴趣篇搞定！赛道轮廓开始浮现了 🧭',
    order: 2,
  },
  scenario: {
    label: '职场情景',
    cheer: '情景篇通关！你在真实工作里大概会这样做事 💼',
    order: 3,
  },
  background: {
    label: '背景经验',
    cheer: '最后冲刺！背景信息会让推荐更贴你本人 🎯',
    order: 4,
  },
}

/** 性格10 + 兴趣8 + 情景8 + 背景5（含工具多选）；答题页会跳过兴趣岛重叠题 */
export const QUESTIONS: Question[] = [
  // ——— 性格 10 ———
  {
    id: 1,
    category: 'personality',
    text: '周末你更享受哪种充电方式？',
    options: [
      { text: '跟朋友轰趴 / 线下局，越热闹越有电', scores: { E: 2 }, vibe: '社交充电' },
      { text: '宅家打游戏看电影，世界暂时安静一下', scores: { I: 2 }, vibe: '独处回血' },
    ],
  },
  {
    id: 2,
    category: 'personality',
    text: '群聊里突然 @ 全员征集想法，你通常？',
    options: [
      { text: '秒回一长串，边想边说', scores: { E: 2, P: 1 } },
      { text: '先默默把思路理清，再发一条干货', scores: { I: 2, J: 1 } },
    ],
  },
  {
    id: 3,
    category: 'personality',
    text: '学新东西时，你更吃哪套？',
    options: [
      { text: '先看教程一步步跟练，稳稳落地', scores: { S: 2 } },
      { text: '先搞懂「这玩意儿到底在解决啥」，再自己玩', scores: { N: 2 } },
    ],
  },
  {
    id: 4,
    category: 'personality',
    text: '朋友吐槽工作好崩溃，你第一反应是？',
    options: [
      { text: '帮他拆问题：原因是啥、下一步怎么走', scores: { T: 2 } },
      { text: '先共情：太难了吧，你真的很不容易', scores: { F: 2 } },
    ],
  },
  {
    id: 5,
    category: 'personality',
    text: '出门旅行你更像？',
    options: [
      { text: '行程表拉满，景点门票全预约好', scores: { J: 2 } },
      { text: '大概方向有了，到了再随缘探索', scores: { P: 2 } },
    ],
  },
  {
    id: 6,
    category: 'personality',
    text: '团队聚餐点菜环节，你经常是？',
    options: [
      { text: '主动张罗：这家必点、那家避雷', scores: { E: 2 } },
      { text: '安静听大家说，被点名再表态', scores: { I: 2 } },
    ],
  },
  {
    id: 7,
    category: 'personality',
    text: '看一部剧 / 一部产品，你更容易记住？',
    options: [
      { text: '具体桥段、交互细节、彩蛋', scores: { S: 2 } },
      { text: '整体氛围、隐喻、未来可怎么玩', scores: { N: 2 } },
    ],
  },
  {
    id: 8,
    category: 'personality',
    text: '做决定卡住时，你更信？',
    options: [
      { text: '数据、对比表、利弊清单', scores: { T: 2 } },
      { text: '直觉、价值观、会不会后悔的感觉', scores: { F: 2 } },
    ],
  },
  {
    id: 9,
    category: 'personality',
    text: 'DDL 临近，你的经典操作是？',
    options: [
      { text: '早就拆好任务，按计划收尾', scores: { J: 2, stability: 1 } },
      { text: '压力激发灵感，最后爆发式完成', scores: { P: 2, growth: 1 } },
    ],
  },
  {
    id: 10,
    category: 'personality',
    text: '别人夸你时，你更希望被夸？',
    options: [
      { text: '「靠谱、逻辑清晰、交付稳」', scores: { T: 1, J: 1, S: 1 } },
      { text: '「有想法、会共情、气氛担当」', scores: { F: 1, N: 1, E: 1 } },
    ],
  },

  // ——— 兴趣 8（霍兰德） ———
  {
    id: 11,
    category: 'interest',
    text: '如果开一家小店，你更想？',
    options: [
      { text: '自己动手改装修、修设备、把空间搭出来', scores: { hR: 2 } },
      { text: '研究选址数据、算账、优化经营模型', scores: { hI: 2, hC: 1 } },
    ],
  },
  {
    id: 12,
    category: 'interest',
    text: '空闲晚上你更可能在干嘛？',
    options: [
      { text: '画画 / 剪视频 / 写点有感觉的东西', scores: { hA: 2, creativity: 1 } },
      { text: '帮朋友参谋、组织局、当气氛组', scores: { hS: 2 } },
    ],
  },
  {
    id: 13,
    category: 'interest',
    text: '社团招新，你更想负责？',
    options: [
      { text: '拉赞助、谈合作、冲业绩', scores: { hE: 2, impact: 1 } },
      { text: '做表格、排班、把流程理顺', scores: { hC: 2, stability: 1 } },
    ],
  },
  {
    id: 14,
    category: 'interest',
    text: '刷到「一天搞定 XX」的教程，你心动点是？',
    options: [
      { text: '亲手做出来那个实物 / Demo', scores: { hR: 2, hS: 0 } },
      { text: '搞懂原理，顺手写个笔记总结', scores: { hI: 2 } },
    ],
  },
  {
    id: 15,
    category: 'interest',
    text: '你更享受哪种「被需要」的感觉？',
    options: [
      { text: '有人说：你的审美救了这个项目！', scores: { hA: 2, creativity: 1 } },
      { text: '有人说：多亏你协调，大家才能对齐！', scores: { hS: 2, hE: 1 } },
    ],
  },
  {
    id: 16,
    category: 'interest',
    text: '如果必须二选一当一周体验官？',
    options: [
      { text: '数据分析师：挖洞察、出结论', scores: { hI: 2, hC: 1 } },
      { text: '活动主理人：拉人、控场、冲结果', scores: { hE: 2, hS: 1 } },
    ],
  },
  {
    id: 17,
    category: 'interest',
    text: '整理电脑文件夹对你来说？',
    options: [
      { text: '有点爽，分类命名是一种秩序之美', scores: { hC: 2, J: 1 } },
      { text: '能找到就行，时间留给创造更重要', scores: { hA: 1, P: 1, hR: 1 } },
    ],
  },
  {
    id: 18,
    category: 'interest',
    text: '你更想被朋友安利成？',
    options: [
      { text: '「靠谱技术向」——问他就有解法', scores: { hI: 1, hR: 1, T: 1 } },
      { text: '「会玩会表达」——内容/活动都有一手', scores: { hA: 1, hE: 1, hS: 1 } },
    ],
  },

  // ——— 职场情景 8 ———
  {
    id: 19,
    category: 'scenario',
    text: '老板丢来一个超模糊需求，你会？',
    options: [
      { text: '先画原型 / 列假设，确认后再干', scores: { N: 1, J: 1, impact: 1 } },
      { text: '先做一个最小可用版本扔出去试', scores: { P: 1, hR: 1, growth: 1 } },
    ],
  },
  {
    id: 20,
    category: 'scenario',
    text: '联调出 bug，群里开始甩锅边缘，你？',
    options: [
      { text: '先复现定位，用事实说话', scores: { T: 2, I: 1 } },
      { text: '先缓和气氛，再一起对齐责任边界', scores: { F: 2, S: 1 } },
    ],
  },
  {
    id: 21,
    category: 'scenario',
    text: '周会你更想贡献什么？',
    options: [
      { text: '一份清晰的进度与风险清单', scores: { hC: 2, J: 1 } },
      { text: '一个新玩法 / 新增长点子', scores: { N: 1, E: 1, hA: 1 } },
    ],
  },
  {
    id: 22,
    category: 'scenario',
    text: '你理想中的「高光工作日」更像？',
    options: [
      { text: '深潜写代码 / 做分析，心流到忘记吃饭', scores: { I: 2, hR: 1 } },
      { text: '连续对齐多方，把项目推进一截', scores: { E: 2, S: 1 } },
    ],
  },
  {
    id: 23,
    category: 'scenario',
    text: '产品上线后数据不达预期，你第一动作？',
    options: [
      { text: '拆漏斗、看埋点、找假设哪里错了', scores: { I: 2, T: 1 } },
      { text: '找用户聊聊、看反馈、改文案或活动', scores: { S: 1, hA: 1, F: 1 } },
    ],
  },
  {
    id: 24,
    category: 'scenario',
    text: '同事方案你觉得有坑，你会？',
    options: [
      { text: '直接指出逻辑问题，附替代方案', scores: { T: 2, E: 1 } },
      { text: '私下委婉提，保护对方面子', scores: { F: 2, S: 1 } },
    ],
  },
  {
    id: 25,
    category: 'scenario',
    text: '同时来了三个紧急需求，你怎么排？',
    options: [
      { text: '按影响面 / 优先级矩阵硬排', scores: { J: 2, hC: 1, T: 1 } },
      { text: '先问清楚谁更急，边沟通边调整', scores: { P: 1, S: 1, E: 1 } },
    ],
  },
  {
    id: 26,
    category: 'scenario',
    text: '你更受不了哪种工作环境？',
    options: [
      { text: '毫无规范、改来改去、永远在救火', scores: { hC: 1, J: 1, stability: 2 } },
      { text: '流程死板、没有发挥空间、创意被摁死', scores: { hA: 1, P: 1, creativity: 2 } },
    ],
  },

  // ——— 背景 4 ———
  {
    id: 27,
    category: 'background',
    text: '目前的实习 / 项目经历更接近？',
    options: [
      {
        text: '有过互联网相关实习或完整项目',
        flags: ['internship_yes'],
        scores: { growth: 1 },
        vibe: '有实战底子',
      },
      {
        text: '还在积累，主要是课程 / 社团 / 个人练手',
        flags: ['internship_no'],
        scores: { growth: 1 },
        vibe: '蓄力中',
      },
    ],
  },
  {
    id: 28,
    category: 'background',
    text: '你目前更熟的一手能力是？',
    options: [
      { text: '写代码 / 数据分析（技术向）', flags: ['skill_code'], scores: { I: 1, hR: 1, hI: 1 } },
      { text: '设计 / 内容表达（创意向）', flags: ['skill_design'], scores: { hA: 1, creativity: 1 } },
      { text: '活动 / 社群 / 沟通推进（运营向）', flags: ['skill_ops'], scores: { hS: 1, hE: 1 } },
      { text: '还在广泛试，暂不确定', flags: ['skill_none'], scores: { N: 1 } },
    ],
  },
  {
    id: 31,
    category: 'background',
    multi: true,
    text: '下面这些工具 / 技能，你已经会一点或做过实战的有哪些？',
    hint: '可多选；选得越准，岗位推荐越贴手',
    options: [
      {
        text: 'Python（脚本 / 分析 / 爬虫）',
        flags: ['tool_python'],
        scores: { hI: 1, T: 1 },
      },
      {
        text: 'Java / Go / C++ 等后端语言',
        flags: ['tool_backend'],
        scores: { hR: 1, T: 1 },
      },
      {
        text: 'JavaScript / HTML / CSS（前端）',
        flags: ['tool_frontend'],
        scores: { hA: 1, hR: 1 },
      },
      {
        text: 'SQL / Excel / 数据看板',
        flags: ['tool_data'],
        scores: { hI: 1, hC: 1 },
      },
      {
        text: 'Figma / 原型 / UI 设计工具',
        flags: ['tool_figma'],
        scores: { hA: 1, creativity: 1 },
      },
      {
        text: '剪辑 / AE / 内容生产工具',
        flags: ['tool_content'],
        scores: { hA: 1, creativity: 1 },
      },
      {
        text: 'PPT / Notion / 文档协作',
        flags: ['tool_office'],
        scores: { hE: 1, hC: 1 },
      },
      {
        text: '都还不太会，正在学',
        flags: ['tool_none'],
        scores: { growth: 1 },
      },
    ],
  },
  {
    id: 29,
    category: 'background',
    text: '接下来一年，你更想靠近哪条赛道？',
    options: [
      { text: '技术研发 / 数据', flags: ['goal_tech'], scores: { I: 1, hR: 1, hI: 1 } },
      { text: '产品 / 设计', flags: ['goal_product'], scores: { N: 1, hA: 1 } },
      { text: '运营 / 增长 / 市场', flags: ['goal_ops'], scores: { hE: 1, hS: 1 } },
      { text: '还在探索，都行', flags: ['goal_unsure'], scores: { P: 1 } },
    ],
  },
  {
    id: 30,
    category: 'background',
    text: '你更能接受哪种节奏？',
    options: [
      {
        text: '高压冲刺换快速成长（加班也能扛一阵）',
        flags: ['pressure_ok'],
        scores: { growth: 2, E: 1 },
      },
      {
        text: '节奏稳一点，留生活与学习余量',
        flags: ['pressure_balance'],
        scores: { stability: 2 },
      },
    ],
  },
]

export const CHANNELS: Channel[] = [
  {
    id: 'boss',
    name: 'BOSS直聘',
    bestFor: '直接沟通 HR / 业务',
    tip: '关键词要准，善用屏蔽过滤外包。',
  },
  {
    id: 'nowcoder',
    name: '牛客网',
    bestFor: '互联网校招 / 笔面试',
    tip: '面经、真题、讨论区，应届与转码必备。',
  },
  {
    id: 'maimai',
    name: '脉脉',
    bestFor: '内推与口碑背调',
    tip: '主动经营人脉，查企业评价找内推。',
  },
  {
    id: 'liepin',
    name: '猎聘',
    bestFor: '中高端与经验岗',
    tip: '有一定经历后再重点投入。',
  },
  {
    id: 'zhilian',
    name: '智联 / 前程无忧',
    bestFor: '海投与大型企业',
    tip: '企业库大，适合补投稳定向岗位。',
  },
  {
    id: 'zcool',
    name: '站酷 / 设计师社区',
    bestFor: '设计作品集曝光',
    tip: '作品集比海投更重要，先打磨再投。',
  },
]

export { CAREERS } from './careers'

export const EDU_OPTIONS: EduOption[] = [
  { id: 'college', label: '大专 / 高职在读或毕业', hint: '偏落地执行与技能型岗位也有机会' },
  { id: 'undergrad', label: '本科在读', hint: '大学生 / 应届本科，校招主力人群' },
  { id: 'master', label: '硕士在读', hint: '可冲研发算法、分析与产品等' },
  { id: 'phd', label: '博士在读', hint: '算法研究、深度技术方向更匹配' },
  { id: 'graduated', label: '已毕业 / 职场新人', hint: '1-3 年经验，社招+校招尾声都可看' },
]

export const MAJOR_OPTIONS: MajorOption[] = [
  { id: 'cs', label: '计算机 / 软工 / 人工智能', hint: '研发、算法、数据主赛道' },
  { id: 'ee', label: '电子 / 通信 / 自动化', hint: '客户端、嵌入式、部分研发很吃香' },
  { id: 'math', label: '数学 / 统计 / 金融工程', hint: '算法、数据、商业分析加分' },
  { id: 'business', label: '经管 / 市场 / 工商管理', hint: '运营、市场、采销、战略更近' },
  { id: 'design', label: '设计 / 艺术 / 视觉相关', hint: '设计、部分内容与游戏策划' },
  { id: 'media', label: '新闻 / 传媒 / 中文', hint: '内容、市场、品牌、部分运营' },
  { id: 'humanities', label: '人文社科 / 国关 / 教育心理等', hint: '战略、市场、内容、HR、部分产品运营更近' },
  { id: 'other', label: '其他专业 / 跨专业', hint: '靠项目与兴趣证明匹配度' },
]

export const PERSONAS: Persona[] = [
  {
    id: 'logic-builder',
    title: '逻辑实干家',
    emoji: '🦊',
    blurb: '你擅长把模糊问题拆干净，再一件件落地。适合需要深度与可靠交付的赛道。',
    egg: '面试时记得多讲「你怎么定位问题」，HR 超爱听冷静头脑。',
    strengths: [
      {
        title: '结构化拆解力',
        tag: '战略思维',
        detail:
          '面对含糊需求，你能快速拆成目标、约束、路径与验收标准。这是研发、数据、产品里最稀缺的「把事说清楚」能力。',
      },
      {
        title: '客观决策与低情绪内耗',
        tag: '执行力',
        detail:
          '你更信证据而非气氛。争论时能回到事实与利弊，适合高压排障、技术选型与跨团队对齐里的「冷静锚点」。',
      },
      {
        title: '深度攻坚耐力',
        tag: '才干长板',
        detail:
          '别人觉得枯燥的硬问题，你能沉下去。独立模块、复杂 bug、系统边界问题，往往是你的高光区。',
      },
      {
        title: '交付可预期',
        tag: '职场信誉',
        detail:
          '你习惯给时间盒与风险预判，领导对你的预期管理成本低——这会转化成被委以关键事项的信任。',
      },
    ],
    blockers: [
      {
        title: '「懂了但没同步」——贡献隐形',
        signal: '预警：周会很少听到你的进展，但活其实你在扛',
        detail: '埋头把事做完，默认别人会看见。结果资源与晋升叙事都偏弱。',
        solution:
          '每周固定一次「结论→进展→卡点→需要什么」同步；把踩坑写成短复盘，让价值可被检索。',
      },
      {
        title: '完美主义拖慢试错窗口',
        signal: '预警：总想再改一版才敢交，错过验证时机',
        detail: '追求 100 分方案，容易在快速迭代环境显得慢。',
        solution:
          '设「可上线标准」：先交 80 分可验证版本，再列第二轮优化清单；区分不可逆风险与可回滚试错。',
      },
      {
        title: '跨部门「翻译」不足',
        signal: '预警：业务说你太技术，技术说你太理想',
        detail: '默认别人跟得上你的推理链，沟通显得生硬。',
        solution:
          '先复述对方目标，再用对方的语言讲方案；复杂内容准备「一页纸结论 + 附录细节」。',
      },
    ],
  },
  {
    id: 'creative-social',
    title: '创意社交达人',
    emoji: '🦄',
    blurb: '你既有表达欲，又懂跟人打交道。内容、运营、产品协作类岗位会很吃你这套。',
    egg: '面试多讲你策划过的活动或内容案例，比空谈性格更杀。',
    strengths: [
      {
        title: '氛围带动与关系建立',
        tag: '影响力',
        detail:
          '你能快速让团队「动起来」：拉齐情绪、推动协作、让冷场变热场。这在运营、市场、用户侧岗位是真·生产力。',
      },
      {
        title: '把抽象感觉讲清楚',
        tag: '表达力',
        detail:
          '用户洞察、品牌调性、内容方向这类「说不清」的东西，你能转化成故事与画面，降低协作误解。',
      },
      {
        title: '共情与用户视角',
        tag: '关系建立',
        detail:
          '你容易站在对方角度想问题，适合做用户运营、内容、部分产品沟通——反馈收集与安抚成本更低。',
      },
      {
        title: '创意爆发与临场 improvise',
        tag: '创造力',
        detail:
          '截止前你常有高光点子。活动玩法、传播钩子、内容选题，是你的「不费力擅长区」。',
      },
    ],
    blockers: [
      {
        title: '灵感多头，收尾变弱',
        signal: '预警：同时开很多项目，完成率却上不去',
        detail: '点子太多会散焦，职场会被看成「会聊不会交」。',
        solution: '每期只押注 1 个主创意；用「本周唯一目标」看板，完成再开下一张牌。',
      },
      {
        title: '感觉有了，数字没跟上',
        signal: '预警：汇报靠氛围词，老板追问 ROI 时卡住',
        detail: '创意岗位也要讲转化。缺指标会被低估。',
        solution: '每个活动/内容预先定 1～2 个核心指标，复盘只讲前后对比与下一轮假设。',
      },
      {
        title: '太好说话 → 边界耗能',
        signal: '预警：总在帮别人救火，自己的主线被稀释',
        detail: '共情强容易变成「万能补位」，长期倦怠。',
        solution: '先共情再排期：可以帮，但说清优先级与截止；学会礼貌地排期而不是硬扛。',
      },
    ],
  },
  {
    id: 'steady-executor',
    title: '稳健执行者',
    emoji: '🐻',
    blurb: '你重视秩序与质量，是团队里让人安心的那一位。测试、项目、部分后端运维很搭。',
    egg: '准备一个「你如何避免翻车」的小故事，稳重感直接拉满。',
    strengths: [
      {
        title: '质量门禁与风险嗅觉',
        tag: '尽责性',
        detail:
          '你对漏洞、遗漏、流程缺口很敏感。测试、项目、运维、部分后端里，这种「少出事」本身就是核心业绩。',
      },
      {
        title: '流程沉淀与可复制交付',
        tag: '执行力',
        detail:
          '你愿意把一次性经验变成 checklist / 模板，让团队下次更稳——这是组织真正需要的基建能力。',
      },
      {
        title: '长期主义抗压',
        tag: '情绪稳定',
        detail:
          '混乱局里你仍能按节奏推进。别人焦虑时你在排期、对齐风险，是天然的「定盘星」。',
      },
      {
        title: '细节可靠形成信任资产',
        tag: '职场信誉',
        detail:
          '答应的事你会盯到底。这种信誉一旦建立，关键项目会优先找你——即使你不抢话。',
      },
    ],
    blockers: [
      {
        title: '变更频繁时适应慢',
        signal: '预警：需求改第三次时情绪明显变差、效率下滑',
        detail: '秩序被打破会消耗你，显得「不够敏捷」。',
        solution: '把变更写成影响面清单（改什么/风险/工期），用结构化响应替代情绪抵抗。',
      },
      {
        title: '「稳住了」但没被看见',
        signal: '预警：事故少了，但绩效叙事仍空洞',
        detail: '防患于未然很难量化，容易被当成理所当然。',
        solution: '月报写清「避免了什么损失」；用前后对比（故障率/返工率）证明价值。',
      },
      {
        title: '过度谨慎错过窗口',
        signal: '预警：等条件完美才动手，别人已经试完两轮',
        detail: '稳健变成迟缓时，机会成本上升。',
        solution: '区分不可逆风险与可回滚试错；后者允许小步快跑，前者才上强审批。',
      },
    ],
  },
  {
    id: 'growth-hunter',
    title: '增长猎手',
    emoji: '🐺',
    blurb: '你喜欢目标、节奏和结果。增长、市场、偏业务的产品岗会让你燃起来。',
    egg: '用一组前后对比数据讲成果，比态度积极更有说服力。',
    strengths: [
      {
        title: '强目标感与结果导向',
        tag: '影响力',
        detail:
          '你天然追指标：拉新、转化、GMV、完成率。能把模糊业务翻译成「这周要赢什么」。',
      },
      {
        title: '试错勇气与节奏感',
        tag: '进取',
        detail:
          '你不怕先做一版再改。增长、活动、销售推进里，这种速度本身构成竞争优势。',
      },
      {
        title: '推动多方拿结果',
        tag: '领导力萌芽',
        detail:
          '你会催对齐、追反馈、卡节点。不是甩锅，是让事情发生——组织很需要这种「推手」。',
      },
      {
        title: '竞争情境下的能量水平',
        tag: '外向性',
        detail:
          '有挑战时你更兴奋。适合快节奏业务线；把压力转化成输出，而不是回避。',
      },
    ],
    blockers: [
      {
        title: '冲刺过度 → burnout',
        signal: '预警：连续高压后效率断崖、情绪易燃',
        detail: '续航跟不上野心时，身体和关系会先报警。',
        solution: '设定冲刺周+恢复周；核心指标外留不可侵占休息块；把可持续当成绩效的一部分。',
      },
      {
        title: '只追短线数字，忽略基建',
        signal: '预警：这个月好看，下个月方法复用不了',
        detail: '缺少模板、自动化与方法论沉淀，增长不可复制。',
        solution: '每月留约 20% 时间做可复用资产：脚本、模板、复盘库。',
      },
      {
        title: '催进度伤协作',
        signal: '预警：设计/研发开始回避你的「催更」',
        detail: '结果导向过强，会变成压迫感。',
        solution: '先问对方约束，再共定里程碑；催的是节点与风险，不是人身。',
      },
    ],
  },
  {
    id: 'insight-seeker',
    title: '洞察研究员',
    emoji: '🦉',
    blurb: '你对「为什么」充满兴趣，适合数据、算法、深度产品分析方向。',
    egg: '带上一次「你用分析改变决策」的经历，气场立刻专业。',
    strengths: [
      {
        title: '模式识别与好奇心',
        tag: '战略思维',
        detail:
          '你能从噪声里看出趋势与异常。数据、策略、研究岗里，这种「多看一层」就是差异化。',
      },
      {
        title: '证据驱动的说服力',
        tag: '分析力',
        detail:
          '你习惯用假设-验证说话。报告与评审中，你能把争论拉回可检验的问题上。',
      },
      {
        title: '复杂信息压缩能力',
        tag: '认知耐力',
        detail:
          '长材料、多变量、模糊业务，你愿意啃。适合商业分析、算法评估、深度调研。',
      },
      {
        title: '独立判断，不随大流',
        tag: '开放性',
        detail:
          '你不轻易被口号带走。当团队需要「唱反调但有依据」的人时，你很有价值。',
      },
    ],
    blockers: [
      {
        title: '分析瘫痪：挖得深、动得慢',
        signal: '预警：材料很厚，但「下一步做什么」始终缺席',
        detail: '洞察停在认知层，业务等不了完美答案。',
        solution: '强制每份分析以「所以呢」结尾：给出 1 个可执行建议与验证方式。',
      },
      {
        title: '表达偏学术，业务听不进',
        signal: '预警：汇报时对方开始刷手机或说「结论是？」',
        detail: '术语与篇幅劝退决策者。',
        solution: '一页纸结论先行，细节放附录；把公式翻译成业务语言。',
      },
      {
        title: '顾问感过强，落地闭环弱',
        signal: '预警：你提了建议，但从不跟实验到结果',
        detail: '缺少共创，影响力停留在文档。',
        solution: '主动认领一个小实验跟到验证；从「给建议」升级为「共担结果」。',
      },
    ],
  },
  {
    id: 'experience-crafter',
    title: '体验造梦师',
    emoji: '🐰',
    blurb: '你在意感受与美感，设计与用户向产品是你的主场。',
    egg: '作品集里讲清设计取舍，比只放精美大图更打动人。',
    strengths: [
      {
        title: '用户同理与体验敏感度',
        tag: '宜人性/共情',
        detail:
          '你能察觉「哪里别扭」。交互、内容体验、产品细节优化，是你不费力却很值钱的地方。',
      },
      {
        title: '审美表达有辨识度',
        tag: '创造力',
        detail:
          '视觉与叙事上你有风格。设计、品牌、内容岗位里，辨识度本身就是壁垒。',
      },
      {
        title: '化繁为简的产品直觉',
        tag: '体验思维',
        detail:
          '你倾向删掉多余步骤。流程、信息架构、引导文案，常因你变得更好用。',
      },
      {
        title: '跨角色翻译（用户↔团队）',
        tag: '协作',
        detail:
          '你能把用户感受翻译给研发/业务听，也能把约束翻译回设计语言，降低扯皮。',
      },
    ],
    blockers: [
      {
        title: '审美争论变成立场战',
        signal: '预警：讨论停留在「好不好看」，缺少用户证据',
        detail: '主观审美对撞会耗时耗关系。',
        solution: '用目标用户与可用性证据开场；少说「我觉得」，多说「用户在这一步流失」。',
      },
      {
        title: '理想方案撞上工程成本',
        signal: '预警：方案惊艳，排期直接翻倍，最后被砍到尴尬版',
        detail: '不懂约束时，落地会打折并伤害信任。',
        solution: '设计前先问约束；准备「理想版 + 可上线版」双方案。',
      },
      {
        title: '作品好看，叙事偏弱',
        signal: '预警：面试官夸图，却问不出你的决策逻辑',
        detail: '缺过程会让优势显得「只是手熟」。',
        solution: '项目按 问题→洞察→方案→结果 讲述；把取舍写进作品集。',
      },
    ],
  },
]



export const ISLANDS: Island[] = [
  {
    code: 'R',
    name: '自然原始岛',
    emoji: '🏕️',
    subtitle: '动手实干派',
    description: '野生动物、手工建造、户外实践。喜欢把想法做成看得见的东西。',
    vibe: '动手 · 工具 · 落地',
  },
  {
    code: 'I',
    name: '深思冥想岛',
    emoji: '🔭',
    subtitle: '研究探索派',
    description: '天文馆与图书馆环绕，追问「为什么」，热爱观察与研究。',
    vibe: '研究 · 分析 · 求真',
  },
  {
    code: 'A',
    name: '美丽浪漫岛',
    emoji: '🎨',
    subtitle: '表达创造派',
    description: '美术馆与音乐厅遍布，用设计、叙事和审美表达自我。',
    vibe: '创意 · 审美 · 表达',
  },
  {
    code: 'S',
    name: '友善亲切岛',
    emoji: '🤝',
    subtitle: '助人协作派',
    description: '社区紧密、乐于助人，重视教育、合作与人文关怀。',
    vibe: '服务 · 沟通 · 支持',
  },
  {
    code: 'E',
    name: '显赫富庶岛',
    emoji: '🏆',
    subtitle: '影响推进派',
    description: '商业活跃，善于说服、组织，把事情做成。',
    vibe: '影响 · 经营 · 进取',
  },
  {
    code: 'C',
    name: '现代井然岛',
    emoji: '🗂️',
    subtitle: '秩序系统派',
    description: '流程清晰、管理完善，擅长规划与规范执行。',
    vibe: '秩序 · 流程 · 细致',
  },
]

export const TYPE_NAMES: Record<string, string> = {
  INTJ: '建筑师',
  INTP: '逻辑学家',
  ENTJ: '指挥官',
  ENTP: '辩论家',
  INFJ: '提倡者',
  INFP: '调停者',
  ENFJ: '主人公',
  ENFP: '竞选者',
  ISTJ: '物流师',
  ISFJ: '守卫者',
  ESTJ: '总经理',
  ESFJ: '执政官',
  ISTP: '鉴赏家',
  ISFP: '探险家',
  ESTP: '企业家',
  ESFP: '表演者',
}

export const MBTI_TIPS: Record<string, { workplace: string; watchout: string }> = {
  E: { workplace: '外向能量能带动协作与信息流通', watchout: '注意留给自己深度思考的时间' },
  I: { workplace: '内向深潜能产出高质量独立成果', watchout: '主动同步进度，避免「隐形贡献」' },
  S: { workplace: '务实落地，细节与执行力强', watchout: '偶尔抬头看方向，别只埋头干活' },
  N: { workplace: '善于想象可能性和创新路径', watchout: '方案要配落地步骤，才能说服团队' },
  T: { workplace: '逻辑清晰，决策有依据', watchout: '反馈时先顾及感受，再讲对错' },
  F: { workplace: '共情强，能维护团队关系', watchout: '关键决策时也要敢讲硬标准' },
  J: { workplace: '计划感强，交付节奏稳定', watchout: '留给变化一点弹性空间' },
  P: { workplace: '灵活应变，临场爆发力强', watchout: '用小里程碑防止最后一刻堆工' },
}
