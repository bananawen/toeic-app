import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Clock, Heart, GraduationCap } from "lucide-react"

export default function Home() {
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

        {/* Menu Cards - 優化間距和大小 */}
        <div className="grid gap-4 max-w-lg mx-auto">
          {/* 單字測驗 */}
          <Link href="/quiz?type=vocabulary" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">單字測驗</CardTitle>
                    <p className="text-xs text-gray-500">練習 TOEIC 必備單字</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    5 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* 文法測驗 */}
          <Link href="/quiz?type=grammar" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">文法測驗</CardTitle>
                    <p className="text-xs text-gray-500">Part 5 文法題型</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    5 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* 模擬考試 */}
          <Link href="/quiz?type=full" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer bg-white">
              <CardHeader className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">模擬考試</CardTitle>
                    <p className="text-xs text-gray-500">完整 TOEIC 測驗</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    10 題
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* 分類練習 */}
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
