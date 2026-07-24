import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import {
  CAREERS,
  EDU_OPTIONS,
  ISLANDS,
  MAJOR_OPTIONS,
  MBTI_TIPS,
  type EduId,
  type HollandCode,
  type MajorId,
} from '../data/catalog'
import {
  buildExperienceTip,
  buildIdentityTip,
  buildProfile,
  getRecommendations,
  type Answers,
  type RankedCareer,
} from '../lib/matching'

type ResultPageProps = {
  answers: Answers
  hollandRank: HollandCode[]
  edu: EduId
  major: MajorId
  onReset: () => void
}

const TRACK_LABEL: Record<string, string> = {
  tech: '研发',
  'product-ops': '产品运营',
  business: '商业/市场',
  function: '职能支持',
}

export function ResultPage({ answers, hollandRank, edu, major, onReset }: ResultPageProps) {
  const profile = useMemo(
    () => buildProfile(answers, hollandRank, edu, major),
    [answers, hollandRank, edu, major],
  )
  const recommendations = useMemo(() => getRecommendations(profile, 6), [profile])
  const [selected, setSelected] = useState<RankedCareer | null>(null)
  const [sharing, setSharing] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [longImageUrl, setLongImageUrl] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const [openStrengths, setOpenStrengths] = useState<number[]>([])
  const [openBlockers, setOpenBlockers] = useState<number[]>([])
  const longImageRef = useRef<HTMLDivElement>(null)

  const tip = buildExperienceTip(profile.flags, recommendations[0]?.title ?? '目标岗位')
  const identityTip = buildIdentityTip(edu, major, recommendations[0]?.title)
  const egg = selected?.tipInterview ?? profile.persona.egg
  const islandMeta = hollandRank
    .map((code) => ISLANDS.find((i) => i.code === code))
    .filter(Boolean)
  const eduLabel = EDU_OPTIONS.find((e) => e.id === edu)?.label
  const majorLabel = MAJOR_OPTIONS.find((m) => m.id === major)?.label

  const handleGenerateLongImage = async () => {
    setSharing(true)
    setShareError(null)
    setCapturing(true)
    try {
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      // 再等字体稍稳一点
      await new Promise((r) => setTimeout(r, 80))
      const el = longImageRef.current
      if (!el) throw new Error('long image node missing')

      const canvas = await html2canvas(el, {
        backgroundColor: '#f7f1e8',
        scale: Math.min(2, window.devicePixelRatio || 2),
        useCORS: true,
        logging: false,
        width: el.offsetWidth,
        height: el.scrollHeight,
        windowWidth: el.offsetWidth,
        windowHeight: el.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      })
      setLongImageUrl(canvas.toDataURL('image/png', 1))
    } catch (err) {
      console.error(err)
      setShareError('长图生成失败，请换 Chrome 再试，或先用「复制分享文案」')
    } finally {
      setCapturing(false)
      setSharing(false)
    }
  }

  const handleDownloadLongImage = () => {
    if (!longImageUrl) return
    const link = document.createElement('a')
    link.download = `saidao-cece-result-${profile.persona.id}.png`
    link.href = longImageUrl
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleCopyLink = async () => {
    const text = `我在「赛道测测」测出职业人设是【${profile.persona.emoji} ${profile.persona.title}】，MBTI ${profile.mbtiType}，兴趣岛 ${profile.hollandCode}，Top1 推荐 ${recommendations[0]?.title}！你也来测：${window.location.href}`
    try {
      await navigator.clipboard.writeText(text)
      alert('分享文案已复制，去朋友圈/小红书粘贴吧～')
    } catch {
      alert(text)
    }
  }

  return (
    <section className="fade-up mx-auto max-w-4xl space-y-6">
      {/* 人设英雄卡 */}
      <div className="overflow-hidden rounded-[1.75rem] border border-[#0b3d3a]/12 bg-white p-6 sm:p-9">
        <p className="text-sm font-semibold text-[#ff6b4a]">🎉 探索完成！你的职业人设出炉</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="float-soft text-6xl">{profile.persona.emoji}</span>
          <div>
            <h2 className="font-display text-3xl font-extrabold text-[#102a28] sm:text-4xl">
              {profile.persona.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5c736f]">
              {profile.persona.blurb}
            </p>
            <p className="mt-2 text-xs text-[#0b3d3a]/7">
              身份：{eduLabel} · {majorLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#0b3d3a] p-4 text-[#e8f2f0]">
            <p className="text-xs font-semibold text-[#f4c95f]">🧠 MBTI 性格</p>
            <p className="font-display mt-1 text-2xl font-bold">
              {profile.mbtiType}
              <span className="ml-2 text-base font-semibold text-[#e8f2f0]/7">
                · {profile.mbtiName}
              </span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  ['E', 'I'],
                  ['S', 'N'],
                  ['T', 'F'],
                  ['J', 'P'],
                ] as const
              ).map((pair) => {
                const left = profile.scores[pair[0]] || 0
                const right = profile.scores[pair[1]] || 0
                const total = left + right || 1
                const chosen = profile.mbtiType.includes(pair[0]) ? pair[0] : pair[1]
                const tip = MBTI_TIPS[chosen]
                return (
                  <div key={pair.join('')} className="rounded-xl bg-white/10 px-2.5 py-2">
                    <div className="flex justify-between text-[10px] text-[#e8f2f0]/65">
                      <span>{pair[0]}</span>
                      <span>{pair[1]}</span>
                    </div>
                    <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-black/20">
                      <div className="bg-[#f4c95f]" style={{ width: `${(left / total) * 100}%` }} />
                      <div className="bg-[#ff6b4a]" style={{ width: `${(right / total) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-[10px] leading-snug text-[#e8f2f0]/7">{tip?.workplace}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#f7f1e8] p-4">
            <p className="text-xs font-semibold text-[#5c736f]">🏝️ 你选中的兴趣岛</p>
            <p className="font-display mt-1 text-2xl font-bold tracking-widest text-[#ff6b4a]">
              {profile.hollandCode}
            </p>
            <div className="mt-3 space-y-2">
              {islandMeta.map((island, idx) =>
                island ? (
                  <div key={island.code} className="flex items-center gap-2 text-sm text-[#102a28]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b4a] text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-lg">{island.emoji}</span>
                    <span>
                      {island.name}
                      <span className="text-[#5c736f]"> · {island.subtitle}</span>
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 职场优点 */}
      <div className="rounded-[1.5rem] border border-[#0b3d3a]/12 bg-white/85 p-6">
        <h3 className="font-display text-xl font-bold text-[#102a28]">✨ 你在职场的优点</h3>
        <p className="mt-1 text-sm text-[#5c736f]">点开看具体描述，可同时展开多条</p>
        <div className="mt-4 space-y-3">
          {profile.persona.strengths.map((s, idx) => {
            const open = openStrengths.includes(idx)
            return (
              <div
                key={s.title}
                className={`overflow-hidden rounded-2xl border transition ${
                  open ? 'border-[#0b3d3a]/25 bg-[#eef6f4]' : 'border-[#0b3d3a]/10 bg-[#f7f1e8]/60'
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  onClick={() =>
                    setOpenStrengths((prev) =>
                      open ? prev.filter((i) => i !== idx) : [...prev, idx],
                    )
                  }
                >
                  <span className="flex flex-wrap items-center gap-2 font-semibold text-[#102a28]">
                    <span>
                      {idx + 1}. {s.title}
                    </span>
                    {s.tag && (
                      <span className="rounded-full bg-[#f4c95f]/25 px-2 py-0.5 text-[10px] font-medium text-[#0b3d3a]">
                        {s.tag}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-[#5c736f]">{open ? '收起' : '展开'}</span>
                </button>
                {open && (
                  <div className="border-t border-[#0b3d3a]/8 px-4 py-3">
                    <p className="text-sm leading-relaxed text-[#5c736f]">{s.detail}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 卡点 + 解法 */}
      <div className="rounded-[1.5rem] border border-[#0b3d3a]/12 bg-white/85 p-6">
        <h3 className="font-display text-xl font-bold text-[#102a28]">🚧 未来可能遇到的卡点</h3>
        <p className="mt-1 text-sm text-[#5c736f]">
          不是缺点审判，是提前打补丁。点开看对策，可同时展开多条
        </p>
        <div className="mt-4 space-y-3">
          {profile.persona.blockers.map((b, idx) => {
            const open = openBlockers.includes(idx)
            return (
              <div
                key={b.title}
                className={`overflow-hidden rounded-2xl border transition ${
                  open ? 'border-[#ff6b4a]/40 bg-[#fff8f5]' : 'border-[#0b3d3a]/10 bg-[#f7f1e8]/60'
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  onClick={() =>
                    setOpenBlockers((prev) =>
                      open ? prev.filter((i) => i !== idx) : [...prev, idx],
                    )
                  }
                >
                  <span className="font-semibold text-[#102a28]">
                    {idx + 1}. {b.title}
                  </span>
                  <span className="text-xs text-[#5c736f]">{open ? '收起' : '看解法'}</span>
                </button>
                {open && (
                  <div className="border-t border-[#0b3d3a]/8 px-4 py-3">
                    {b.signal && (
                      <p className="mb-2 rounded-lg bg-[#ff6b4a]/10 px-3 py-2 text-xs text-[#b5472c]">
                        {b.signal}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed text-[#5c736f]">{b.detail}</p>
                    <div className="mt-3 rounded-xl bg-[#0b3d3a] px-3 py-3 text-sm text-[#e8f2f0]">
                      <p className="text-xs font-semibold text-[#f4c95f]">💊 可以这样破</p>
                      <p className="mt-1 leading-relaxed">{b.solution}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Top6 */}
      <div>
        <h3 className="font-display text-2xl font-bold text-[#102a28]">🔥 推荐岗位 Top 6</h3>
        <p className="mt-1 text-sm text-[#5c736f]">
          以性格 / 兴趣岛 / 职场情景 / 已会工具为主排序；专业只做门槛过滤（共 {CAREERS.length}{' '}
          个方向）
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((career, idx) => (
            <button
              key={career.id}
              type="button"
              onClick={() => setSelected(career)}
              className="rounded-[1.5rem] border border-[#0b3d3a]/12 bg-white/85 p-5 text-left transition hover:-translate-y-1 hover:border-[#ff6b4a]/50 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#5c736f]">
                    TOP {idx + 1} · {TRACK_LABEL[career.track] ?? career.track}
                  </p>
                  <h4 className="font-display mt-1 text-lg font-bold text-[#102a28]">
                    {career.emoji} {career.title}
                  </h4>
                </div>
                <span className="rounded-full bg-[#0b3d3a] px-2.5 py-1 text-sm font-bold text-[#f4c95f]">
                  {career.match}%
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-[#5c736f]">{career.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-[#0b3d3a]/2 bg-[#0b3d3a]/[0.03] p-5">
        <p className="text-xs font-semibold tracking-wide text-[#5c736f]">🎓 针对你的身份建议</p>
        <p className="mt-2 text-sm leading-relaxed text-[#102a28]">{identityTip}</p>
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-[#0b3d3a]/2 bg-white/70 p-5">
        <p className="text-xs font-semibold tracking-wide text-[#5c736f]">📌 经验建议</p>
        <p className="mt-2 text-sm leading-relaxed text-[#102a28]">{tip}</p>
      </div>

      <div className="rounded-[1.5rem] border border-[#f4c95f]/40 bg-[#f4c95f]/15 p-5">
        <p className="text-xs font-semibold text-[#0b3d3a]">💡 面试彩蛋</p>
        <p className="mt-2 text-sm leading-relaxed text-[#102a28]">{egg}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateLongImage}
          disabled={sharing}
          className="rounded-full bg-[#ff6b4a] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sharing ? '长图生成中…' : '生成结果长图'}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-full border border-[#0b3d3a]/2 bg-white px-6 py-2.5 text-sm font-semibold text-[#0b3d3a]"
        >
          复制分享文案
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-[#5c736f] hover:bg-white/70"
        >
          重新测试
        </button>
      </div>
      {shareError && <p className="text-sm text-[#b5472c]">{shareError}</p>}

      {/* 仅生成时挂载长图模板：移出视口，避免叠字；用实色+简单样式提高截图成功率 */}
      {capturing && (
        <>
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#072e2c] text-[#e8f2f0]">
            <p className="text-sm font-semibold tracking-wide">正在生成结果长图…</p>
          </div>
          <div
            ref={longImageRef}
            aria-hidden
            style={{
              position: 'fixed',
              left: -10000,
              top: 0,
              zIndex: 60,
              width: 390,
              boxSizing: 'border-box',
              padding: 28,
              background: '#f7f1e8',
              color: '#102a28',
              fontFamily: 'DM Sans, PingFang SC, Microsoft YaHei, sans-serif',
            }}
          >
            <div
              style={{
                background: '#0b3d3a',
                color: '#e8f2f0',
                borderRadius: 20,
                padding: 22,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.2em', color: '#f4c95f', fontWeight: 700 }}>
                赛道测测 · 结果长图
              </p>
              <p style={{ margin: '16px 0 0', fontSize: 40 }}>{profile.persona.emoji}</p>
              <h2 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
                {profile.persona.title}
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: 13, opacity: 0.75 }}>
                {profile.mbtiType} · {profile.mbtiName} · 兴趣岛 {profile.hollandCode}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
                {profile.persona.blurb}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 11, opacity: 0.6 }}>
                {eduLabel} · {majorLabel}
              </p>
            </div>

            <div style={{ marginTop: 16, background: '#fff', borderRadius: 16, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>🏝️ 兴趣岛排序</p>
              {islandMeta.map((island, idx) =>
                island ? (
                  <p key={island.code} style={{ margin: '8px 0 0', fontSize: 13, color: '#5c736f' }}>
                    {idx + 1}. {island.emoji} {island.name} · {island.subtitle}
                  </p>
                ) : null,
              )}
            </div>

            <div style={{ marginTop: 12, background: '#fff', borderRadius: 16, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>✨ 职场优点</p>
              {profile.persona.strengths.map((s, idx) => (
                <div key={s.title} style={{ marginTop: 12 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
                    {idx + 1}. {s.title}
                    {s.tag ? (
                      <span style={{ marginLeft: 6, fontSize: 10, color: '#0b3d3a', background: '#f4c95f55', borderRadius: 999, padding: '2px 6px' }}>
                        {s.tag}
                      </span>
                    ) : null}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.55, color: '#5c736f' }}>
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, background: '#fff', borderRadius: 16, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>🚧 可能遇到的卡点</p>
              {profile.persona.blockers.map((b, idx) => (
                <div key={b.title} style={{ marginTop: 12 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
                    {idx + 1}. {b.title}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.55, color: '#5c736f' }}>
                    {b.detail}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.55, color: '#0b3d3a' }}>
                    解法：{b.solution}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, background: '#fff', borderRadius: 16, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>🔥 推荐岗位 Top 6</p>
              {recommendations.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 12,
                    background: '#f7f1e8',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
                    TOP {i + 1} {c.emoji} {c.title}
                    <span style={{ marginLeft: 8, color: '#ff6b4a' }}>{c.match}%</span>
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#5c736f' }}>
                    {TRACK_LABEL[c.track] ?? c.track} · {c.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, background: '#fff8e8', borderRadius: 16, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>💡 面试小提示</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.55, color: '#5c736f' }}>
                {profile.persona.egg}
              </p>
            </div>

            <p
              style={{
                margin: '20px 0 0',
                textAlign: 'center',
                fontSize: 11,
                color: '#5c736f',
              }}
            >
              测测你适合哪条互联网赛道 · saidao-cece.vercel.app
            </p>
          </div>
        </>
      )}

      {longImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#072e2c]/55 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setLongImageUrl(null)}
          role="presentation"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[1.75rem] bg-[#f7f1e8] p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="结果长图预览"
          >
            <h3 className="font-display text-xl font-bold text-[#102a28]">你的结果长图</h3>
            <p className="mt-1 text-sm text-[#5c736f]">
              手机可长按图片保存到相册；电脑点下方下载
            </p>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#0b3d3a]/10 bg-white">
              <img
                src={longImageUrl}
                alt="赛道测测结果长图"
                className="block w-full"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadLongImage}
                className="rounded-full bg-[#ff6b4a] px-5 py-2.5 text-sm font-semibold text-white"
              >
                下载长图 PNG
              </button>
              <button
                type="button"
                onClick={() => setLongImageUrl(null)}
                className="rounded-full border border-[#0b3d3a]/2 bg-white px-5 py-2.5 text-sm font-semibold text-[#0b3d3a]"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#072e2c]/45 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] bg-[#f7f1e8] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl">{selected.emoji}</p>
                <h3 className="font-display mt-1 text-2xl font-bold text-[#102a28]">
                  {selected.title}
                </h3>
                <p className="mt-1 text-sm text-[#5c736f]">
                  匹配度 {selected.match}% · {TRACK_LABEL[selected.track]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full px-3 py-1 text-sm text-[#5c736f] hover:bg-white"
              >
                关闭
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#102a28]/80">{selected.description}</p>
            <p className="mt-2 text-sm text-[#5c736f]">日常：{selected.daily}</p>
            <ul className="mt-4 space-y-2">
              {selected.why.map((line) => (
                <li key={line} className="text-sm text-[#102a28]">
                  · {line}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold text-[#5c736f]">必备技能</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[#0b3d3a]/8 px-2.5 py-1 text-xs text-[#0b3d3a]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold text-[#5c736f]">薪资参考</p>
                <p className="mt-2 text-sm font-semibold text-[#102a28]">{selected.salary}</p>
                <p className="mt-2 text-xs text-[#5c736f]">{selected.outlook}</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#0b3d3a] p-4 text-[#e8f2f0]">
              <p className="font-display text-sm font-bold text-[#f4c95f]">精准渠道</p>
              <div className="mt-3 space-y-3">
                {selected.channelDetails.map((ch) => (
                  <div key={ch.id}>
                    <p className="text-sm font-semibold">
                      {ch.name}
                      <span className="ml-2 text-xs font-normal text-[#e8f2f0]/65">{ch.bestFor}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-[#e8f2f0]/7">{ch.tip}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#e8f2f0]/65">
                搜索词：{selected.searchTips.join(' / ')}
              </p>
            </div>
            <p className="mt-4 text-sm text-[#102a28]">💡 {selected.tipInterview}</p>
          </div>
        </div>
      )}
    </section>
  )
}
