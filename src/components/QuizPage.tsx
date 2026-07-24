import { useEffect, useMemo, useState } from 'react'
import { SECTION_META, type QuestionCategory } from '../data/catalog'
import { QUIZ_QUESTIONS, type Answers } from '../lib/matching'

type QuizPageProps = {
  initialAnswers?: Answers
  initialIndex?: number
  onComplete: (answers: Answers) => void
  onProgress: (answers: Answers, index: number) => void
  onBack: () => void
}

function asIndices(raw: number | number[] | undefined): number[] {
  if (raw === undefined) return []
  return Array.isArray(raw) ? raw : [raw]
}

export function QuizPage({
  initialAnswers = {},
  initialIndex = 0,
  onComplete,
  onProgress,
  onBack,
}: QuizPageProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [selected, setSelected] = useState<number | null>(null)
  const [multiSelected, setMultiSelected] = useState<number[]>([])
  const [cheer, setCheer] = useState<string | null>(null)

  const question = QUIZ_QUESTIONS[currentIndex]
  const total = QUIZ_QUESTIONS.length
  const progress = ((currentIndex + 1) / total) * 100
  const sectionLabel = SECTION_META[question.category].label
  const isMulti = Boolean(question.multi)

  const sectionProgress = useMemo(() => {
    const cats: QuestionCategory[] = ['personality', 'scenario', 'background']
    return cats.map((cat) => {
      const ids = QUIZ_QUESTIONS.filter((q) => q.category === cat).map((q) => q.id)
      const done = ids.filter((id) => answers[id] !== undefined).length
      return { cat, done, total: ids.length, meta: SECTION_META[cat] }
    })
  }, [answers])

  useEffect(() => {
    onProgress(answers, currentIndex)
  }, [answers, currentIndex, onProgress])

  useEffect(() => {
    const existing = answers[question.id]
    if (question.multi) {
      setMultiSelected(asIndices(existing))
      setSelected(null)
    } else {
      setSelected(typeof existing === 'number' ? existing : null)
      setMultiSelected([])
    }
  }, [question.id, question.multi, answers])

  const goNext = (nextAnswers: Answers) => {
    const isLastInSection =
      currentIndex === total - 1 ||
      QUIZ_QUESTIONS[currentIndex + 1]?.category !== question.category

    window.setTimeout(() => {
      if (isLastInSection && currentIndex < total - 1) {
        setCheer(SECTION_META[question.category].cheer)
        window.setTimeout(() => {
          setCheer(null)
          setCurrentIndex((i) => i + 1)
          setSelected(null)
          setMultiSelected([])
        }, 1100)
        return
      }
      if (currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1)
        setSelected(null)
        setMultiSelected([])
      } else {
        onComplete(nextAnswers)
      }
    }, 280)
  }

  const handleSelect = (optIdx: number) => {
    if (isMulti) return
    if (answers[question.id] !== undefined) return
    setSelected(optIdx)
    const nextAnswers = { ...answers, [question.id]: optIdx }
    setAnswers(nextAnswers)
    goNext(nextAnswers)
  }

  const handleMultiToggle = (optIdx: number) => {
    const opt = question.options[optIdx]
    const isNone = opt?.flags?.includes('tool_none')
    setMultiSelected((prev) => {
      if (isNone) return prev.includes(optIdx) ? [] : [optIdx]
      const withoutNone = prev.filter((i) => !question.options[i]?.flags?.includes('tool_none'))
      return withoutNone.includes(optIdx)
        ? withoutNone.filter((i) => i !== optIdx)
        : [...withoutNone, optIdx]
    })
  }

  const handleMultiConfirm = () => {
    if (multiSelected.length === 0) return
    const nextAnswers = { ...answers, [question.id]: multiSelected }
    setAnswers(nextAnswers)
    goNext(nextAnswers)
  }

  if (cheer) {
    return (
      <section className="fade-up mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
        <div className="rounded-[1.75rem] border border-[#0b3d3a]/12 bg-white/90 px-8 py-12 text-center shadow-lg">
          <p className="text-4xl float-soft">🎉</p>
          <p className="font-display mt-4 text-xl font-bold text-[#102a28]">{cheer}</p>
          <p className="mt-2 text-sm text-[#5c736f]">马上进入下一篇…</p>
        </div>
      </section>
    )
  }

  return (
    <section className="fade-up mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-wide text-[#0b3d3a]/70">
          {question.category === 'personality' ? '🧠 ' : question.category === 'scenario' ? '💼 ' : '🎒 '}
          {sectionLabel} · {currentIndex + 1}/{total}
        </p>
        <button type="button" onClick={onBack} className="text-sm text-[#5c736f] hover:text-[#102a28]">
          回兴趣岛
        </button>
      </div>

      <div className="mb-4 flex gap-1.5">
        {sectionProgress.map((s) => (
          <div key={s.cat} className="flex-1">
            <div className="mb-1 text-[10px] text-[#5c736f]">{s.meta.label}</div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#0b3d3a]/10">
              <div
                className="h-full rounded-full bg-[#0b3d3a] transition-all"
                style={{ width: `${(s.done / Math.max(s.total, 1)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-[#0b3d3a]/12 bg-white/85 p-6 shadow-[0_20px_60px_-40px_rgba(11,61,58,0.45)] sm:p-8">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#0b3d3a]/10">
          <div
            className="progress-fill h-full rounded-full bg-[#ff6b4a]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="font-display text-2xl leading-snug font-bold text-[#102a28]">{question.text}</h2>
        {question.hint && <p className="mt-2 text-sm text-[#5c736f]">{question.hint}</p>}

        <div className="mt-6 space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = isMulti ? multiSelected.includes(idx) : selected === idx
            const locked = !isMulti && answers[question.id] !== undefined
            return (
              <button
                key={`${question.id}-${idx}`}
                type="button"
                disabled={locked}
                onClick={() => (isMulti ? handleMultiToggle(idx) : handleSelect(idx))}
                className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                  isSelected
                    ? 'border-[#0b3d3a] bg-[#0b3d3a] text-[#e8f2f0]'
                    : 'border-[#0b3d3a]/12 bg-[#f7f1e8]/50 hover:border-[#0b3d3a]/35'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isSelected
                      ? 'bg-[#f4c95f] text-[#102a28]'
                      : 'border border-[#0b3d3a]/25 text-[#0b3d3a]'
                  }`}
                >
                  {isMulti ? (isSelected ? '✓' : '+') : String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base leading-relaxed">{opt.text}</span>
              </button>
            )
          })}
        </div>

        {isMulti ? (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={multiSelected.length === 0}
              onClick={handleMultiConfirm}
              className="rounded-full bg-[#ff6b4a] px-8 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              选好了，下一题（已选 {multiSelected.length}）
            </button>
            <p className="text-center text-sm text-[#5c736f]">可多选；「都还不太会」与其他选项互斥</p>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-[#5c736f]">凭直觉点就好，没有标准答案～</p>
        )}
      </div>
    </section>
  )
}
