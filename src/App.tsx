import { useCallback, useEffect, useState } from 'react'
import { HomePage } from './components/HomePage'
import { HollandStep } from './components/HollandStep'
import { QuizPage } from './components/QuizPage'
import { ProfileStep } from './components/ProfileStep'
import { ResultPage } from './components/ResultPage'
import type { EduId, HollandCode, MajorId } from './data/catalog'
import {
  QUIZ_QUESTIONS,
  clearStored,
  loadStored,
  saveStored,
  type Answers,
} from './lib/matching'

type Page = 'home' | 'islands' | 'quiz' | 'profile' | 'result'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [answers, setAnswers] = useState<Answers>({})
  const [quizIndex, setQuizIndex] = useState(0)
  const [hollandRank, setHollandRank] = useState<HollandCode[]>([])
  const [edu, setEdu] = useState<EduId | null>(null)
  const [major, setMajor] = useState<MajorId | null>(null)
  const [hasProgress, setHasProgress] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = loadStored()
    if (stored && stored.page !== 'home') {
      setHasProgress(true)
      setHollandRank(stored.hollandRank ?? [])
      setAnswers(stored.answers ?? {})
      setQuizIndex(stored.index ?? 0)
      setEdu(stored.edu ?? null)
      setMajor(stored.major ?? null)
    }
    setReady(true)
  }, [])

  const persist = (partial: {
    page?: Page
    answers?: Answers
    index?: number
    hollandRank?: HollandCode[]
    edu?: EduId
    major?: MajorId
  }) => {
    saveStored({
      page: partial.page ?? page,
      answers: partial.answers ?? answers,
      index: partial.index ?? quizIndex,
      hollandRank: partial.hollandRank ?? hollandRank,
      edu: partial.edu ?? edu ?? undefined,
      major: partial.major ?? major ?? undefined,
    })
    setHasProgress(true)
  }

  const resetAll = () => {
    clearStored()
    setPage('home')
    setAnswers({})
    setQuizIndex(0)
    setHollandRank([])
    setEdu(null)
    setMajor(null)
    setHasProgress(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startFresh = () => {
    clearStored()
    setAnswers({})
    setQuizIndex(0)
    setHollandRank([])
    setEdu(null)
    setMajor(null)
    setHasProgress(false)
    setPage('islands')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resume = () => {
    const stored = loadStored()
    if (!stored) return
    setHollandRank(stored.hollandRank ?? [])
    setAnswers(stored.answers ?? {})
    setQuizIndex(stored.index ?? 0)
    setEdu(stored.edu ?? null)
    setMajor(stored.major ?? null)
    if (stored.page === 'result') setPage('result')
    else if (stored.page === 'profile') setPage('profile')
    else if (stored.page === 'quiz') setPage('quiz')
    else if (stored.page === 'islands') setPage('islands')
    else setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onProgress = useCallback(
    (ans: Answers, index: number) => {
      setAnswers(ans)
      setQuizIndex(index)
      saveStored({
        page: 'quiz',
        answers: ans,
        index,
        hollandRank,
        edu: edu ?? undefined,
        major: major ?? undefined,
      })
      setHasProgress(true)
    },
    [hollandRank, edu, major],
  )

  if (!ready) return null

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[#0b3d3a]/10 bg-[#f7f1e8]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button type="button" onClick={resetAll} className="flex items-center gap-2 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0b3d3a] text-sm text-[#f4c95f]">
              ✦
            </span>
            <div>
              <p className="font-display text-sm leading-none font-bold text-[#102a28]">赛道测测</p>
              <p className="mt-0.5 text-[10px] tracking-wide text-[#5c736f]">
                兴趣岛 · MBTI · 职场情景 · 身份卡
              </p>
            </div>
          </button>
          <p className="hidden text-xs text-[#5c736f] sm:block">25+ 互联网岗位方向</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {page === 'home' && (
          <HomePage onStart={startFresh} onResume={resume} hasProgress={hasProgress} />
        )}
        {page === 'islands' && (
          <HollandStep
            ranked={hollandRank}
            onChange={(next) => {
              setHollandRank(next)
              persist({ page: 'islands', hollandRank: next })
            }}
            onBack={() => setPage('home')}
            onNext={() => {
              setAnswers({})
              setQuizIndex(0)
              saveStored({
                page: 'quiz',
                answers: {},
                index: 0,
                hollandRank,
                edu: edu ?? undefined,
                major: major ?? undefined,
              })
              setPage('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
        {page === 'quiz' && (
          <QuizPage
            initialAnswers={answers}
            initialIndex={quizIndex}
            onProgress={onProgress}
            onBack={() => setPage('islands')}
            onComplete={(ans) => {
              setAnswers(ans)
              saveStored({
                page: 'profile',
                answers: ans,
                index: QUIZ_QUESTIONS.length - 1,
                hollandRank,
                edu: edu ?? undefined,
                major: major ?? undefined,
              })
              setPage('profile')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
        {page === 'profile' && (
          <ProfileStep
            edu={edu}
            major={major}
            onEdu={(id) => {
              setEdu(id)
              persist({ page: 'profile', edu: id })
            }}
            onMajor={(id) => {
              setMajor(id)
              persist({ page: 'profile', major: id })
            }}
            onBack={() => setPage('quiz')}
            onNext={() => {
              if (!edu || !major) return
              saveStored({
                page: 'result',
                answers,
                index: QUIZ_QUESTIONS.length - 1,
                hollandRank,
                edu,
                major,
              })
              setPage('result')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
        {page === 'result' && Object.keys(answers).length > 0 && edu && major && (
          <ResultPage
            answers={answers}
            hollandRank={hollandRank}
            edu={edu}
            major={major}
            onReset={resetAll}
          />
        )}
      </main>

      <footer className="border-t border-[#0b3d3a]/10 py-8 text-center text-xs text-[#5c736f]">
        <p>赛道测测 · 趣味职业探索 · 结果仅供参考</p>
      </footer>
    </div>
  )
}
