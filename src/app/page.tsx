"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, GraduationCap, Shuffle, ClipboardList, Settings, RotateCcw, Check, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

export default function Home() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [questionCount, setQuestionCount] = useState(10)
  const [currentSection, setCurrentSection] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Section 2: Part 選擇
  const [selectedParts, setSelectedParts] = useState<string[]>(["part2", "part5", "part6", "part7"])

  const togglePart = (part: string) => {
    setSelectedParts(prev =>
      prev.includes(part)
        ? prev.filter(p => p !== part)
        : [...prev, part]
    )
  }

  // Part 列表
  const allParts = [
    { type: "part1", name: "Part 1 圖片描述", enabled: false },
    { type: "part2", name: "Part 2 應答問題", enabled: true },
    { type: "part3", name: "Part 3 簡短對話", enabled: false },
    { type: "part4", name: "Part 4 簡短獨白", enabled: false },
    { type: "part5", name: "Part 5 句子填空", enabled: true },
    { type: "part6", name: "Part 6 段落填空", enabled: true },
    { type: "part7", name: "Part 7 閱讀測驗", enabled: true },
  ]

  // 分類列表
  const categories = [
    { type: "verb-tense", name: "動詞時態", color: "bg-blue-100" },
    { type: "preposition", name: "介系詞", color: "bg-green-100" },
    { type: "modal-verbs", name: "助動詞", color: "bg-yellow-100" },
    { type: "conditionals", name: "條件句", color: "bg-orange-100" },
    { type: "passive-voice", name: "被動語態", color: "bg-red-100" },
    { type: "word-form", name: "詞性變化", color: "bg-purple-100" },
    { type: "relative-pronoun", name: "關係代名詞", color: "bg-indigo-100" },
    { type: "conjunction", name: "連接詞", color: "bg-pink-100" },
    { type: "quantifiers", name: "數量詞", color: "bg-cyan-100" },
    { type: "gerund-infinitive", name: "動名詞", color: "bg-teal-100" },
    { type: "comparative", name: "比較級", color: "bg-amber-100" },
    { type: "article", name: "冠詞", color: "bg-slate-100" },
  ]

  // 開始測驗
  const startRandomQuiz = () => {
    router.push(`/quiz?type=random&types=${selectedParts.join(",")}&count=${questionCount}`)
  }

  const startCategoryQuiz = (type: string) => {
    router.push(`/quiz?type=${type}&count=${questionCount}`)
  }

  const startMockQuiz = () => {
    router.push(`/quiz?type=mock&count=100`)
  }

  // 滾動檢測
  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const sectionWidth = container.scrollWidth / sections.length
      const newSection = Math.round(scrollLeft / sectionWidth)
      if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        setCurrentSection(newSection)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [currentSection])

  // 區塊內容
  const sections = [
    // Section 1: 立刻測驗
    <div key="section1" className="w-full">
      <h2 className="text-sm font-bold text-gray-700 mb-2">⚡ 立刻測驗</h2>
      <div className="space-y-2">
        <button onClick={startRandomQuiz} className="block w-full text-left">
          <Card className="hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 border-0">
            <CardHeader className="py-3 px-3">
              <Shuffle className="w-5 h-5 text-white mb-1" />
              <CardTitle className="text-white text-sm">隨機測驗</CardTitle>
              <p className="text-purple-100 text-xs">{questionCount} 題</p>
            </CardHeader>
          </Card>
        </button>

        <Link href="/notebook?review=true" className="block w-full text-left">
          <Card className="hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 border-0">
            <CardHeader className="py-3 px-3">
              <RotateCcw className="w-5 h-5 text-white mb-1" />
              <CardTitle className="text-white text-sm">單字複習</CardTitle>
              <p className="text-orange-100 text-xs">艾賓浩斯遺忘曲線</p>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/notebook" className="block w-full text-left">
          <Card className="hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-500 to-red-600 border-0">
            <CardHeader className="py-3 px-3">
              <Heart className="w-5 h-5 text-white mb-1" />
              <CardTitle className="text-white text-sm">我的單字</CardTitle>
              <p className="text-red-100 text-xs">收藏不會的單字</p>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>,

    // Section 2: 自選測驗
    <div key="section2" className="w-full">
      <h2 className="text-sm font-bold text-gray-700 mb-2">📝 自選測驗</h2>
      <Card>
        <CardContent className="p-3">
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {allParts.map(part => (
              <button
                key={part.type}
                onClick={() => part.enabled && togglePart(part.type)}
                disabled={!part.enabled}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                  part.enabled
                    ? selectedParts.includes(part.type)
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
                    : "bg-gray-50 opacity-50 cursor-not-allowed"
                }`}
              >
                <span className={`text-sm ${part.enabled ? "text-gray-700" : "text-gray-400"}`}>
                  {part.name}
                </span>
                {part.enabled && (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedParts.includes(part.type) ? "bg-blue-500" : "bg-gray-200"
                  }`}>
                    {selectedParts.includes(part.type) && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}
                {!part.enabled && <span className="text-xs text-gray-400">敬請期待</span>}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <label className="text-xs text-gray-500 mb-2 block">題目數量</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 30].map(num => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    questionCount === num
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={startRandomQuiz}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            disabled={selectedParts.length === 0}
          >
            開始測驗
          </Button>
        </CardContent>
      </Card>
    </div>,

    // Section 3: 分類練習
    <div key="section3" className="w-full">
      <h2 className="text-sm font-bold text-gray-700 mb-2">📚 分類練習</h2>
      <div className="grid grid-cols-4 gap-2">
        {categories.map(cat => (
          <button
            key={cat.type}
            onClick={() => startCategoryQuiz(cat.type)}
            className="text-left"
          >
            <Card className="hover:shadow-sm transition-all cursor-pointer h-full">
              <CardHeader className="py-2 px-2">
                <div className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center mb-1`}>
                  <GraduationCap className="w-3 h-3 text-gray-600" />
                </div>
                <CardTitle className="text-xs">{cat.name}</CardTitle>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </div>,

    // Section 4: 模擬試題
    <div key="section4" className="w-full">
      <h2 className="text-sm font-bold text-gray-700 mb-2">🎯 模擬試題</h2>
      <button onClick={startMockQuiz} className="block w-full text-left">
        <Card className="hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 border-0">
          <CardHeader className="py-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-base">模擬試題</CardTitle>
                <p className="text-amber-100 text-xs mt-1">完整 TOEIC 100 題</p>
              </div>
              <ClipboardList className="w-8 h-8 text-white opacity-50" />
            </div>
          </CardHeader>
        </Card>
      </button>
    </div>,

    // Section 5: 設定
    <div key="section5" className="w-full">
      <h2 className="text-sm font-bold text-gray-700 mb-2">⚙️ 設定</h2>
      
      {/* 主題設定 */}
      <button onClick={toggleTheme} className="block w-full text-left mb-2">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {theme === "light" ? <Moon className="w-4 h-4 text-gray-600" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                </div>
                <div>
                  <CardTitle className="text-sm">主題</CardTitle>
                  <p className="text-xs text-gray-400">{theme === "light" ? "淺色模式" : "深色模式"}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </button>

      <button className="block w-full text-left" disabled>
        <Card className="bg-gray-100 opacity-60 cursor-not-allowed">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm text-gray-500">其他設定</CardTitle>
                <p className="text-xs text-gray-400">敬請期待</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </button>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🦈 鯊逼多益
          </h1>
          <p className="text-gray-500 text-xs mt-1">TOEIC 練習 App</p>
        </div>

        {/* 輪播區域 */}
        <div className="min-h-[70vh] flex flex-col">
          {/* 輪播內容 */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* 左側空白 */}
              <div className="w-[15%] flex-shrink-0 snap-start" />

              {/* 區塊 */}
              {sections.map((section, i) => (
                <div
                  key={i}
                  className={`w-[70%] flex-shrink-0 px-2 snap-center transition-opacity duration-300 ${
                    i === currentSection ? "opacity-100" :
                    Math.abs(i - currentSection) === 1 ? "opacity-50" : "opacity-20"
                  }`}
                  onClick={() => setCurrentSection(i)}
                >
                  {section}
                </div>
              ))}

              {/* 右側空白 */}
              <div className="w-[15%] flex-shrink-0 snap-end" />
            </div>
          </div>

          {/* 導航 */}
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => {
                if (currentSection > 0) {
                  setCurrentSection(currentSection - 1)
                  carouselRef.current?.scrollTo({ left: (currentSection - 1) * (carouselRef.current.scrollWidth / sections.length), behavior: 'smooth' })
                }
              }}
              className={`p-2 rounded-full ${currentSection === 0 ? "opacity-30" : "opacity-80 hover:opacity-100"}`}
              disabled={currentSection === 0}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex gap-1">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSection ? "w-6 bg-blue-500" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (currentSection < sections.length - 1) {
                  setCurrentSection(currentSection + 1)
                  carouselRef.current?.scrollTo({ left: (currentSection + 1) * (carouselRef.current.scrollWidth / sections.length), behavior: 'smooth' })
                }
              }}
              className={`p-2 rounded-full ${currentSection === sections.length - 1 ? "opacity-30" : "opacity-80 hover:opacity-100"}`}
              disabled={currentSection === sections.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-400 mt-4 pb-4">
          v1.1.0
        </div>
      </div>
    </div>
  )
}
