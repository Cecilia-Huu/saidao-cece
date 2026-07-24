type HomePageProps = {
  onStart: () => void
  onResume?: () => void
  hasProgress?: boolean
}

export function HomePage({ onStart, onResume, hasProgress }: HomePageProps) {
  return (
    <section className="fade-up relative overflow-hidden rounded-[2rem] border border-[#0b3d3a]/12 bg-[#0b3d3a] px-6 py-14 text-[#e8f2f0] shadow-[0_30px_80px_-40px_rgba(11,61,58,0.8)] sm:px-12 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 85%, rgba(244,201,95,.4), transparent 28%), radial-gradient(circle at 88% 18%, rgba(255,107,74,.32), transparent 30%)',
        }}
      />
      <div className="pointer-events-none absolute top-8 right-10 text-5xl opacity-30 float-soft">🏝️</div>
      <div className="pointer-events-none absolute bottom-10 left-8 text-4xl opacity-25 float-soft-delay">🧭</div>

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-[#f4c95f] uppercase">
          赛道测测 · 趣味版
        </p>
        <h1 className="font-display mt-4 text-4xl leading-[1.1] font-extrabold sm:text-6xl">
          测测你适合哪条
          <br />
          <span className="text-[#ff6b4a]">互联网赛道</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#e8f2f0]/80 sm:text-lg">
          兴趣岛 + MBTI + 职场情景 + 已会工具 + 学历专业。大约 7 分钟，拿到职业人设、Top6
          岗位与卡点对策。
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="wiggle-hover rounded-full bg-[#ff6b4a] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ff6b4a]/25 transition hover:translate-y-[-2px] hover:bg-[#ff7d61]"
          >
            {hasProgress ? '重新开一把 ✨' : '出发去选岛 🏝️'}
          </button>
          {hasProgress && onResume && (
            <button
              type="button"
              onClick={onResume}
              className="rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-[#e8f2f0] backdrop-blur-sm transition hover:bg-white/15"
            >
              继续上次进度
            </button>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 text-left sm:grid-cols-5">
          {[
            { t: '🏝️', d: '兴趣岛排序' },
            { t: '🧠', d: 'MBTI 性格' },
            { t: '💼', d: '职场情景' },
            { t: '🛠️', d: '已会工具' },
            { t: '🎓', d: '学历+专业' },
          ].map((item) => (
            <div
              key={item.d}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm"
            >
              <p className="text-2xl">{item.t}</p>
              <p className="mt-1 text-xs text-[#e8f2f0]/75">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
