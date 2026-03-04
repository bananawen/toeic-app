"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Heart, GraduationCap, X } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [selectedName, setSelectedName] = useState("")
  const [questionCount, setQuestionCount] = useState(5)
  // 分類列表
  const categories = [
    { type: "verb-tense", name: "動詞時態", color: "blue" },
    { type: "preposition", name: "介系詞", color: "green" },
    { type: "modal-verbs", name: "助動詞", color: "yellow" },
    { type: "conditionals", name: "條件句", color: "orange" },
    { type: "passive-voice", name: "被動語態", color: "red" },
    { type: "word-form", name: "詞性變化", color: "purple" },
    { type: "relative-pronoun", name: "關係代名詞", color: "indigo" },
    { type: "conjunction", name: "連接詞", color: "pink" },
    { type: "quantifiers", name: "數量詞", color: "cyan" },
    { type: "gerund-infinitive", name: "動名詞", color: "teal" },
    { type: "comparative", name: "比較級", color: "amber" },
    { type: "article", name: "冠詞", color: "slate" },
  ]

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
    cyan: "bg-cyan-100 text-cyan-600",
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  }

  // 開始測驗
  const startQuiz = (type: string, name: string) => {
    setSelectedType(type)
    setSelectedName(name)
    setQuestionCount(5)
    setShowModal(true)
  }

  // 確認開始
  const confirmStart = () => {
    setShowModal(false)
    router.push(`/quiz?type=${selectedType}&count=${questionCount}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-1">
            🦈 鯊逼多益
          </h1>
          <p className="text-gray-600 text-sm">TOEIC 練習 App</p>
        </div>

        {/* 選擇題目數量Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">開始練習</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedName}</p>
              
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">選擇題目數量</label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map(num => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        questionCount === num 
                          ? "border-blue-500 bg-blue-50 text-blue-600" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {num} 題
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={confirmStart} className="w-full">
                開始練習
              </Button>
            </div>
          </div>
        )}

        {/* Menu Cards - 統一題庫 */}
        <div className="grid gap-4 max-w-lg mx-auto">
          {/* Part 5 句子填空 */}
          <button onClick={() => startQuiz("part5", "Part 5 句子填空")} className="block w-full text-left">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Part 5 句子填空</CardTitle>
                    <p className="text-xs text-gray-500">字彙與文法選擇題</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    63 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </button>

          {/* Part 2 應答問題 */}
          <button onClick={() => startQuiz("part2", "Part 2 應答問題")} className="block w-full text-left">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Part 2 應答問題</CardTitle>
                    <p className="text-xs text-gray-500">三選一應答題</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    15 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </button>

          {/* Part 6 段落填空 */}
          <button onClick={() => startQuiz("part6", "Part 6 段落填空")} className="block w-full text-left">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Part 6 段落填空</CardTitle>
                    <p className="text-xs text-gray-500">短文填空題</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    6 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </button>

          {/* Part 7 閱讀測驗 */}
          <button onClick={() => startQuiz("part7", "Part 7 閱讀測驗")} className="block w-full text-left">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Part 7 閱讀測驗</CardTitle>
                    <p className="text-xs text-gray-500">閱讀理解題</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    4 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </button>

          {/* 分類練習 - 從統一題庫篩選 */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-700">分類練習</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <Link key={cat.type} href={`/quiz?type=${cat.type}`} className="block">
                  <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
                    <CardHeader className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[cat.color]}`}>
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-sm">{cat.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* 我的單字本 */}
          <Link href="/notebook" className="block mt-4">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">我的單字本</CardTitle>
                    <p className="text-xs text-gray-500">收藏不會的單字</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Progress Section - 縮小間距 */}
        <div className="mt-8 text-center">
          <Card className="max-w-sm mx-auto">
            <CardHeader className="py-3">
              <CardTitle className="text-base">📊 今日進度</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-2xl font-bold text-blue-600">0 / 10 題</div>
              <p className="text-xs text-gray-500 mt-1">累積練習 0 天</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
