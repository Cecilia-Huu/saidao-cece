import { ISLANDS, type HollandCode } from '../data/catalog'

type HollandStepProps = {
  ranked: HollandCode[]
  onChange: (next: HollandCode[]) => void
  onNext: () => void
  onBack: () => void
}

export function HollandStep({ ranked, onChange, onNext, onBack }: HollandStepProps) {
  const toggle = (code: HollandCode) => {
    if (ranked.includes(code)) {
      onChange(ranked.filter((c) => c !== code))
      return
    }
    if (ranked.length >= 3) return
    onChange([...ranked, code])
  }

  return (
    <section className="fade-up mx-auto max-w-4xl">
      <div className="text-center sm:text-left">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#f4c95f]/25 px-3 py-1 text-xs font-bold text-[#0b3d3a]">
          🏝️ 第一步 · 霍兰德兴趣岛
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold text-[#102a28] sm:text-4xl">
          假如要在一座岛上住三个月…
        </h2>
        <p className="mt-3 max-w-2xl text-[#5c736f]">
          凭第一直觉选出最想去的 <strong className="text-[#ff6b4a]">3 座岛</strong>
          。点击顺序 = 偏好排序（先点的最喜欢）～
        </p>
      </div>

      {ranked.length > 0 && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b3d3a] px-4 py-2 text-sm text-[#e8f2f0]">
          你的岛民代码
          <span className="font-display text-lg font-bold tracking-[0.25em] text-[#f4c95f]">
            {ranked.join('')}
          </span>
          <span className="text-[#e8f2f0]/55">({ranked.length}/3)</span>
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ISLANDS.map((island, i) => {
          const order = ranked.indexOf(island.code)
          const active = order !== -1
          return (
            <button
              key={island.code}
              type="button"
              onClick={() => toggle(island.code)}
              style={{ animationDelay: `${i * 0.05}s` }}
              className={`fade-up relative rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
                active
                  ? 'border-[#ff6b4a] bg-white shadow-[0_16px_40px_-18px_rgba(255,107,74,0.55)] ring-2 ring-[#ff6b4a]/20'
                  : 'border-[#0b3d3a]/12 bg-white/70 hover:border-[#0b3d3a]/30'
              }`}
            >
              {active && (
                <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6b4a] text-sm font-bold text-white shadow-md">
                  {order + 1}
                </span>
              )}
              <span className="float-soft text-4xl">{island.emoji}</span>
              <p className="font-display mt-3 text-xs font-bold tracking-[0.18em] text-[#0b3d3a]/5">
                {island.code} 岛
              </p>
              <h3 className="font-display mt-1 text-xl font-bold text-[#102a28]">{island.name}</h3>
              <p className="mt-1 text-xs font-semibold text-[#ff6b4a]">{island.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#5c736f]">{island.description}</p>
              <p className="mt-3 text-xs text-[#0b3d3a]/5">{island.vibe}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-[#5c736f] hover:bg-white/60"
        >
          返回
        </button>
        <button
          type="button"
          disabled={ranked.length !== 3}
          onClick={onNext}
          className="rounded-full bg-[#0b3d3a] px-6 py-2.5 text-sm font-semibold text-[#e8f2f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          选好了，去测 MBTI →
        </button>
      </div>
    </section>
  )
}
