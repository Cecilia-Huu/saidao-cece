import { EDU_OPTIONS, MAJOR_OPTIONS, type EduId, type MajorId } from '../data/catalog'

type ProfileStepProps = {
  edu: EduId | null
  major: MajorId | null
  onEdu: (id: EduId) => void
  onMajor: (id: MajorId) => void
  onNext: () => void
  onBack: () => void
}

export function ProfileStep({ edu, major, onEdu, onMajor, onNext, onBack }: ProfileStepProps) {
  const ready = Boolean(edu && major)

  return (
    <section className="fade-up mx-auto max-w-3xl">
      <p className="inline-flex items-center gap-2 rounded-full bg-[#f4c95f]/25 px-3 py-1 text-xs font-bold text-[#0b3d3a]">
        🎓 最后一步 · 你的身份卡
      </p>
      <h2 className="font-display mt-3 text-3xl font-bold text-[#102a28] sm:text-4xl">
        你现在是哪种「岛民身份」？
      </h2>
      <p className="mt-3 text-[#5c736f]">
        学历 + 专业会微调推荐，并生成更贴你的行动建议（依然很趣味，别紧张～）
      </p>

      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-[#102a28]">1. 学历阶段</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {EDU_OPTIONS.map((item) => {
            const active = edu === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onEdu(item.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-[#0b3d3a] bg-[#0b3d3a] text-[#e8f2f0]'
                    : 'border-[#0b3d3a]/12 bg-white/70 hover:border-[#0b3d3a]/30'
                }`}
              >
                <p className="font-semibold">{item.label}</p>
                <p className={`mt-1 text-xs ${active ? 'text-[#e8f2f0]/7' : 'text-[#5c736f]'}`}>
                  {item.hint}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-[#102a28]">2. 专业方向</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MAJOR_OPTIONS.map((item) => {
            const active = major === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onMajor(item.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-[#ff6b4a] bg-[#fff4f0] shadow-sm'
                    : 'border-[#0b3d3a]/12 bg-white/70 hover:border-[#0b3d3a]/30'
                }`}
              >
                <p className="font-semibold text-[#102a28]">{item.label}</p>
                <p className="mt-1 text-xs text-[#5c736f]">{item.hint}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-[#5c736f] hover:bg-white/60"
        >
          返回答题
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={onNext}
          className="rounded-full bg-[#ff6b4a] px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          生成我的专属报告 ✨
        </button>
      </div>
    </section>
  )
}
