"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import questions from "@/data/questions.json"
import { CheckCircle, XCircle, RotateCcw, Home, AlertCircle, LogOut } from "lucide-react"

type Question = {
  id: string
  type: string
  category: string
  difficulty: string
  question: string
  options: { key: string; text: string }[]
  correctAnswer: string
  explanation: string
  passage?: string  // For Part 6 & 7
  blankNumber?: number  // For Part 6
  // For Part 6 new format (one passage with multiple blanks)
  questions?: {
    number: number
    question: string
    options: { key: string; text: string }[]
    correctAnswer: string
    explanation: string
  }[]
}

type Word = {
  id: string
  word: string
  partOfSpeech: string  // 詞性
  meaning: string       // 解釋
  example: string      // 例句
  synonyms: string     // 搭配詞/同義詞
  createdAt: number
}

// Fisher-Yates 洗牌算法（使用 seed 確保伺服器/客戶端一致）
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array]
  // 使用固定的 seed 或預設值，確保 SSR 一致
  let random = seed ?? 42
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 簡單的線性同餘生成器
    random = (random * 1103515245 + 12345) & 0x7fffffff
    const j = random % (i + 1)
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

// 根據類型過濾題庫並隨機抽取
const getQuestionsByType = (type: string, count: number = 5, seed?: number): Question[] => {
  const allQuestions = questions.questions as Question[]
  let pool: Question[]
  
  switch (type) {
    // 統一題庫：vocabulary/grammar/full 都指向 part5
    case "vocabulary":
    case "grammar":
    case "full":
      pool = allQuestions.filter(q => q.type === "part5")
      break
    case "part2":
      pool = allQuestions.filter(q => q.type === "part2")
      break
    case "part5":
      pool = allQuestions.filter(q => q.type === "part5")
      break
    // 文法分類題庫
    case "verb-tense":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "verb-tense")
      break
    case "preposition":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "preposition")
      break
    case "modal-verbs":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "modal-verbs")
      break
    case "conditionals":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "conditionals")
      break
    case "passive-voice":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "passive-voice")
      break
    case "word-form":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "word-form")
      break
    case "relative-pronoun":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "relative-pronoun")
      break
    case "conjunction":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "conjunction")
      break
    case "quantifiers":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "quantifiers")
      break
    case "gerund-infinitive":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "gerund-infinitive")
      break
    case "comparative":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "comparative")
      break
    case "article":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "article")
      break
    case "noun-clause":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "noun-clause")
      break
    case "adjective-order":
      pool = allQuestions.filter(q => q.type === "part5" && q.category === "adjective-order")
      break
    // TOEIC Part 大題分類
    case "part3":
      pool = allQuestions.filter(q => q.type === "part3")
      break
    case "part4":
      pool = allQuestions.filter(q => q.type === "part4")
      break
      break
    case "part5":
      pool = allQuestions.filter(q => q.type === "part5")
      break
    case "part6":
      pool = allQuestions.filter(q => q.type === "part6")
      break
    case "part7":
      pool = allQuestions.filter(q => q.type === "part7")
      break
    default:
      pool = allQuestions
  }
  
  // 使用固定 seed 確保 SSR 一致
  return shuffleArray(pool, seed).slice(0, count)
}

// 測驗時間設定（秒）
const TIME_LIMITS: Record<string, number> = {
  vocabulary: 2 * 60,   // 2 分鐘
  grammar: 3 * 60,     // 3 分鐘  
  full: 5 * 60,        // 5 分鐘
  // 分類測驗時間
  "verb-tense": 3 * 60,
  "preposition": 3 * 60,
  "modal-verbs": 3 * 60,
  "conditionals": 3 * 60,
  "passive-voice": 3 * 60,
  "word-form": 3 * 60,
  "relative-pronoun": 3 * 60,
  "conjunction": 3 * 60,
  "quantifiers": 3 * 60,
  "gerund-infinitive": 3 * 60,
  "comparative": 3 * 60,
  "article": 3 * 60,
  "noun-clause": 3 * 60,
  "adjective-order": 3 * 60,
  // TOEIC Part 大題
  "part2": 3 * 60,
  "part3": 3 * 60,
  "part4": 3 * 60,
  "part5": 3 * 60,
  "part6": 3 * 60,
  "part7": 5 * 60,
}

// 思考過久閾值（秒）- 超過這個時間未答題視為思考過久
const LONG_THINK_THRESHOLD = 30

// 格式化時間顯示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function QuizPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const quizType = searchParams.get("type") || "grammar"
  const questionCount = parseInt(searchParams.get("count") || "5", 10)
  const storageKey = `toeic_quiz_${quizType}`

  // 從 localStorage 恢復進度
  const [initialState, setInitialState] = useState<{
    currentIndex: number
    answers: Record<string, string>
    questionTimes: Record<number, number>
    timeLeft: number
  } | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showAddWordModal, setShowAddWordModal] = useState(false)
  const [isWordEditable, setIsWordEditable] = useState(false)
  const [selectedWord, setSelectedWord] = useState({ word: "", partOfSpeech: "", meaning: "", example: "", synonyms: "" })
  const [timeLeft, setTimeLeft] = useState(TIME_LIMITS[quizType as keyof typeof TIME_LIMITS] || 180)
  
  // 長按計時器
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // 追蹤每題的答題時間
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({})
  const questionStartTimeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化計時器 ref（只在客戶端）
  useEffect(() => {
    questionStartTimeRef.current = Date.now()
  }, [])

  // 載入 localStorage（只在客戶端）
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setInitialState(parsed)
        setCurrentIndex(parsed.currentIndex || 0)
        setAnswers(parsed.answers || {})
        setQuestionTimes(parsed.questionTimes || {})
        setTimeLeft(parsed.timeLeft || TIME_LIMITS[quizType as keyof typeof TIME_LIMITS] || 180)
      } catch (e) {
        console.error('Failed to parse saved quiz state:', e)
      }
    }
  }, [storageKey, quizType])

  // 儲存到 localStorage（只在客戶端）
  useEffect(() => {
    if (initialState && !showResult) {
      const state = {
        currentIndex,
        answers,
        questionTimes,
        timeLeft
      }
      localStorage.setItem(storageKey, JSON.stringify(state))
    }
  }, [currentIndex, answers, questionTimes, timeLeft, showResult, storageKey, initialState])

  // 清除 localStorage（完成測驗時）
  useEffect(() => {
    if (showResult) {
      localStorage.removeItem(storageKey)
    }
  }, [showResult, storageKey])

  const quizQuestions = useMemo(() => {
    const questions = getQuestionsByType(quizType, questionCount)
    
    // 將 Part 6 的多題格式攤平為單一題目
    if (quizType === "part6") {
      const flattened: Question[] = []
      questions.forEach(item => {
        if (item.questions) {
          item.questions.forEach(q => {
            flattened.push({
              ...item,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              blankNumber: q.number,
              questions: undefined
            })
          })
        } else {
          flattened.push(item)
        }
      })
      return flattened
    }
    
    return questions
  }, [quizType, questionCount])
  
  // 確保 quizQuestions 和 currentIndex 是有效的（防呆）
  const safeCurrentIndex = currentIndex ?? 0
  const safeQuizLength = quizQuestions?.length ?? 5
  const validIndex = Math.min(safeCurrentIndex, safeQuizLength - 1)
  const currentQuestion = quizQuestions?.[validIndex]

  // 計時器 logic
  useEffect(() => {
    if (showResult) {
      // 測驗結束，停止計時
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [showResult])

  const getQuizTitle = () => {
    const titles: Record<string, string> = {
      vocabulary: "單字測驗",
      grammar: "文法測驗",
      full: "模擬考試",
      "verb-tense": "動詞時態",
      preposition: "介系詞",
      "modal-verbs": "助動詞",
      conditionals: "條件句",
      "passive-voice": "被動語態",
      "word-form": "詞性變化",
      "relative-pronoun": "關係代名詞",
      conjunction: "連接詞",
      quantifiers: "數量詞",
      "gerund-infinitive": "動名詞/不定詞",
      comparative: "比較級",
      article: "冠詞",
      "noun-clause": "名詞子句",
      "adjective-order": "形容詞順序",
      // TOEIC Part 大題
      "part2": "Part 2 應答問題",
      "part3": "Part 3 簡短對話",
      "part4": "Part 4 簡短獨白",
      "part5": "Part 5 句子填空",
      "part6": "Part 6 段落填空",
      "part7": "Part 7 閱讀測驗",
    }
    return titles[quizType] || "測驗"
  }

  // 查詢單字定義
  const fetchWordInfo = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      if (!response.ok) return null
      const data = await response.json()
      if (!Array.isArray(data) || !data[0]) return null
      
      const entry = data[0]
      const meanings = entry.meanings || []
      
      // 收集所有詞性、解釋、例句、同義詞
      const partsOfSpeech: string[] = []
      const definitions: string[] = []
      const examples: string[] = []
      const synonyms: string[] = []
      
      meanings.forEach((meaning: { partOfSpeech?: string, definitions?: { definition?: string, example?: string }[], synonyms?: string[] }) => {
        if (meaning.partOfSpeech) partsOfSpeech.push(meaning.partOfSpeech)
        if (meaning.definitions) {
          meaning.definitions.slice(0, 2).forEach((def) => {
            if (def.definition && !definitions.includes(def.definition)) {
              definitions.push(def.definition)
            }
            if (def.example && !examples.includes(def.example)) {
              examples.push(def.example)
            }
          })
        }
        if (meaning.synonyms) {
          meaning.synonyms.slice(0, 5).forEach((syn) => {
            if (!synonyms.includes(syn)) synonyms.push(syn)
          })
        }
      })
      
      return {
        partOfSpeech: partsOfSpeech.join(", "),
        meaning: definitions.join("\n"),
        example: examples.join("\n"),
        synonyms: synonyms.join(", ")
      }
    } catch (e) {
      console.error("Failed to fetch word info:", e)
      return null
    }
  }

  // 加入生詞本
  const handleAddToNotebook = async (word: string) => {
    // 先設定單字，顯示 loading
    setSelectedWord({ word, partOfSpeech: "查詢中...", meaning: "查詢中...", example: "", synonyms: "" })
    setShowAddWordModal(true)
    setIsWordEditable(false)
    
    // 自動查詢完整資訊
    const info = await fetchWordInfo(word)
    if (info) {
      setSelectedWord({ 
        word, 
        partOfSpeech: info.partOfSpeech, 
        meaning: info.meaning, 
        example: info.example, 
        synonyms: info.synonyms 
      })
    } else {
      setSelectedWord({ word, partOfSpeech: "", meaning: "", example: "", synonyms: "" })
    }
  }

  const confirmAddToNotebook = () => {
    if (!selectedWord.word.trim()) return
    
    const NOTEBOOK_KEY = "toeic_notebook"
    const saved = localStorage.getItem(NOTEBOOK_KEY)
    let words: Word[] = []
    
    if (saved) {
      try {
        words = JSON.parse(saved)
      } catch (e) {
        console.error("Failed to load notebook:", e)
      }
    }

    // 檢查是否已存在
    if (words.some(w => w.word.toLowerCase() === selectedWord.word.toLowerCase())) {
      alert("這個單字已經在生詞本中了！")
      setShowAddWordModal(false)
      return
    }

    const newWord: Word = {
      id: Date.now().toString(),
      word: selectedWord.word.trim(),
      partOfSpeech: selectedWord.partOfSpeech || "",
      meaning: selectedWord.meaning.trim() || selectedWord.word.trim(),
      example: selectedWord.example.trim() || "",
      synonyms: selectedWord.synonyms.trim() || "",
      createdAt: Date.now()
    }

    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify([newWord, ...words]))
    setShowAddWordModal(false)
    alert(`「${selectedWord.word}」已加入生詞本！`)
  }

  const handleAnswer = (optionKey: string) => {
    if (isAnswered) return
    
    // 記錄這題的答題時間
    const startTime = questionStartTimeRef.current || Date.now()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    setQuestionTimes(prev => ({
      ...prev,
      [currentIndex]: timeSpent
    }))
    
    setIsAnswered(true)
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }))
    
    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsAnswered(false)
        questionStartTimeRef.current = Date.now() // 重置下一題的開始時間
      } else {
        setShowResult(true)
      }
    }, 400)
  }

  const handleSubmitEarly = () => {
    // 記錄當前題目的時間（如果還沒回答）
    if (!answers[currentQuestion?.id] && questionStartTimeRef.current) {
      const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
      setQuestionTimes(prev => ({
        ...prev,
        [currentIndex]: timeSpent
      }))
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setShowResult(true)
  }

  const calculateScore = () => {
    let correct = 0
    let longThinkCount = 0
    
    quizQuestions.forEach((q, index) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
      // 檢查是否有思考過久的題目
      if (questionTimes[index] && questionTimes[index] > LONG_THINK_THRESHOLD) {
        longThinkCount++
      }
    })
    return { 
      correct, 
      total: quizQuestions.length,
      longThinkCount
    }
  }

  // 檢查題目是否為空
  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">暫無題目</h2>
          <p className="text-gray-500 mb-4">這個分類目前還沒有題目</p>
          <Button onClick={() => router.push("/")} variant="outline">
            返回首頁
          </Button>
        </div>
      </div>
    )
  }

  if (showResult) {
    const { correct, total, longThinkCount } = calculateScore()
    const percentage = Math.round((correct / total) * 100)
    const totalTime = TIME_LIMITS[quizType as keyof typeof TIME_LIMITS] - timeLeft

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-3 py-6 max-w-lg">
          <Card className="mb-6">
            <CardHeader className="text-center pb-2">
              <div className="text-5xl mb-2">
                {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
              </div>
              <CardTitle className="text-2xl">
                {timeLeft === 0 ? "時間到！" : "測驗完成！"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-blue-600">
                {percentage}%
              </div>
              <div className="text-gray-600">
                正確題數: {correct} / {total}
              </div>
              <div className="text-sm text-gray-500">
                答題時間: {formatTime(totalTime)}
              </div>
              
              {longThinkCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  有 {longThinkCount} 題思考時間超過 {LONG_THINK_THRESHOLD} 秒
                </div>
              )}
              
              <div className="flex gap-3 justify-center pt-2">
                <Button onClick={() => router.push("/")} variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-1" /> 返回首頁
                </Button>
                <Button onClick={() => window.location.reload()} size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" /> 重新測驗
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">📝 題目解析</h2>
            
            {quizQuestions.map((q, index) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correctAnswer
              const timeSpent = questionTimes[index]
              const isLongThink = timeSpent && timeSpent > LONG_THINK_THRESHOLD
              
              return (
                <Card key={q.id} className={isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            第 {index + 1} 題 · {q.category}
                          </span>
                          {timeSpent && (
                            <span className={`text-xs ${isLongThink ? "text-yellow-600 font-medium" : "text-gray-400"}`}>
                              {isLongThink && "⏰ "}{formatTime(timeSpent)}
                            </span>
                          )}
                        </div>
                        <div className="font-medium">{q.question}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-sm">
                    {!isCorrect && userAnswer && (
                      <div className="text-red-600">
                        ❌ 您的答案: {userAnswer}. {q.options.find(o => o.key === userAnswer)?.text}
                      </div>
                    )}
                    <div className="text-green-700 font-medium">
                      ✅ 正確答案: {q.correctAnswer}. {q.options.find(o => o.key === q.correctAnswer)?.text}
                    </div>
                    <div className="text-gray-600 bg-white/50 p-2 rounded mt-2">
                      📝 {q.explanation}
                    </div>
                    {isLongThink && (
                      <div className="text-xs text-yellow-600 mt-2">
                        ⚠️ 這題思考了 {timeSpent} 秒，建議加強練習
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 離開確認對話框 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-2">確認離開？</h3>
            <p className="text-gray-600 mb-4">離開後目前的作答進度將會喪失。</p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowExitConfirm(false)} variant="outline" size="sm">
                取消
              </Button>
              <Button onClick={() => {
                localStorage.removeItem(storageKey)
                router.push("/")
              }} size="sm" className="bg-red-500 hover:bg-red-600">
                確定離開
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 加入生詞本對話框 */}
      {showAddWordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 w-[80vw] max-w-md shadow-xl h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold mb-2 flex-shrink-0">📖 加入生詞本</h3>
            <div className="space-y-3 overflow-y-auto flex-1">
              <div>
                <label className="text-sm text-gray-600">單字</label>
                <input
                  type="text"
                  value={selectedWord.word}
                  onChange={(e) => setSelectedWord({ ...selectedWord, word: e.target.value })}
                  disabled={!isWordEditable}
                  className="w-full p-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">詞性</label>
                <div className="p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {selectedWord.partOfSpeech || "-"}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">解釋</label>
                  <button
                    onClick={() => setIsWordEditable(!isWordEditable)}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    {isWordEditable ? "🔒 取消編輯" : "✏️ 編輯"}
                  </button>
                </div>
                <textarea
                  value={selectedWord.meaning}
                  onChange={(e) => setSelectedWord({ ...selectedWord, meaning: e.target.value })}
                  disabled={!isWordEditable}
                  rows={3}
                  placeholder="自動查詢中..."
                  className="w-full p-2 border-2 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 resize-none"
                />
              </div>
              {selectedWord.example && (
                <div>
                  <label className="text-sm text-gray-600">例句</label>
                  <div className="p-2 bg-blue-50 rounded-lg text-sm text-gray-700 italic">
                    {selectedWord.example}
                  </div>
                </div>
              )}
              {selectedWord.synonyms && (
                <div>
                  <label className="text-sm text-gray-600">搭配詞 / 同義詞</label>
                  <div className="p-2 bg-yellow-50 rounded-lg text-sm text-gray-700">
                    {selectedWord.synonyms}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Button onClick={() => {
                setShowAddWordModal(false)
                setIsWordEditable(false)
              }} variant="outline" size="sm">
                取消
              </Button>
              <Button onClick={() => {
                confirmAddToNotebook()
                setIsWordEditable(false)
              }} size="sm">
                加入
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 計時器 Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-lg mx-auto">
          {/* 橫條計時器 */}
          <div className="w-full h-2 bg-gray-200">
            <div 
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 30 ? "bg-red-500" : 
                timeLeft <= 60 ? "bg-orange-500" : "bg-blue-500"
              }`}
              style={{ 
                width: `${(timeLeft / (TIME_LIMITS[quizType as keyof typeof TIME_LIMITS] || 180)) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-600">
            🦈 {getQuizTitle()}
          </h1>
          <Button onClick={() => setShowExitConfirm(true)} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-1" /> 離開
          </Button>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            第 {currentIndex + 1} 題，共 {quizQuestions.length} 題
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
            }}
          />
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{currentQuestion.category}</span>
              <span className="capitalize">{currentQuestion.difficulty}</span>
            </div>
            {/* 顯示 Part 6 段落 */}
            {currentQuestion.passage && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3 whitespace-pre-wrap">
                {currentQuestion.passage}
              </div>
            )}
            {/* Part 6: 顯示題號 */}
            {currentQuestion.passage && (
              <div className="text-sm font-medium text-blue-600 mb-2">
                第 {currentQuestion.blankNumber || 1} 題
              </div>
            )}
            {/* Part 5/7 顯示題目 */}
            {!currentQuestion.passage && (
            <div className="text-lg leading-relaxed select-none" style={{ touchAction: 'manipulation' }}>
              {currentQuestion.question.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline cursor-pointer hover:bg-blue-100 rounded px-0.5 select-none"
                  onTouchStart={(e) => {
                    e.preventDefault()
                    longPressTimerRef.current = setTimeout(() => {
                      handleAddToNotebook(word)
                    }, 500)
                  }}
                  onTouchEnd={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current)
                    }
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </div>
            )}
            <div className="text-xs text-gray-400 mt-1">(長按單字加入生詞本)</div>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.key
              return (
                <div
                  key={option.key}
                  onClick={() => !isAnswered && handleAnswer(option.key)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    handleAddToNotebook(option.text)
                  }}
                  onTouchStart={(e) => {
                    // 長按選項加入生詞本
                    longPressTimerRef.current = setTimeout(() => {
                      handleAddToNotebook(option.text)
                    }, 500)
                  }}
                  onTouchEnd={() => {
                    if (longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current)
                    }
                  }}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center gap-2 select-none cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : isAnswered
                        ? "border-gray-100 bg-gray-50 opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold w-6 text-center">{option.key}.</span>
                  <span className="flex-1">{option.text}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToNotebook(option.text)
                    }}
                    className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer"
                    title="加入生詞本"
                  >
                    ♡
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
