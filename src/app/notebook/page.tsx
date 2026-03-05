"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, BookOpen, Home, ArrowLeft, RotateCcw, Check, X, ChevronLeft, ChevronRight } from "lucide-react"

// 單字類型
type Word = {
  id: string
  word: string
  partOfSpeech: string
  meaning: string
  example: string
  synonyms: string
  createdAt: number
  // 艾賓浩斯複習欄位
  reviewCount: number      // 複習次數
  nextReview: number|null  // 下次複習時間（timestamp）
  lastReview: number|null  // 上次複習時間
}

const STORAGE_KEY = "toeic_notebook"

// 艾賓浩斯複習間隔（天數）
const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30]  // 第0次=當天

export default function NotebookPage() {
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [newWord, setNewWord] = useState({ word: "", meaning: "", example: "" })
  const [isAdding, setIsAdding] = useState(false)
  
  // 複習模式
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewWords, setReviewWords] = useState<Word[]>([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  // 載入單字本
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setWords(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse words:", e)
      }
    }
  }, [])

  // 儲存單字本
  const saveWords = (newWords: Word[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWords))
    setWords(newWords)
  }

  // 新增單字
  const handleAddWord = () => {
    if (!newWord.word.trim() || !newWord.meaning.trim()) return
    
    const word: Word = {
      id: Date.now().toString(),
      word: newWord.word.trim(),
      partOfSpeech: "",
      meaning: newWord.meaning.trim(),
      example: newWord.example.trim(),
      synonyms: "",
      createdAt: Date.now(),
      reviewCount: 0,
      nextReview: Date.now(),  // 立即可複習
      lastReview: null
    }
    
    saveWords([...words, word])
    setNewWord({ word: "", meaning: "", example: "" })
    setIsAdding(false)
  }

  // 刪除單字
  const handleDeleteWord = (id: string) => {
    saveWords(words.filter(w => w.id !== id))
  }

  // 開始複習
  const startReview = () => {
    const now = Date.now()
    // 找出需要複習的單字（nextReview <= 現在）
    const dueWords = words.filter(w => !w.nextReview || w.nextReview <= now)
    
    if (dueWords.length === 0) {
      alert("今天沒有需要複習的單字！")
      return
    }
    
    // 隨機排序
    const shuffled = dueWords.sort(() => Math.random() - 0.5)
    setReviewWords(shuffled)
    setReviewIndex(0)
    setShowAnswer(false)
    setReviewMode(true)
  }

  // 標記為「會了」
  const handleCorrect = () => {
    const currentWord = reviewWords[reviewIndex]
    const newReviewCount = (currentWord.reviewCount || 0) + 1
    const intervalDays = REVIEW_INTERVALS[Math.min(newReviewCount, REVIEW_INTERVALS.length - 1)]
    const nextReviewTime = Date.now() + intervalDays * 24 * 60 * 60 * 1000
    
    // 更新單字
    const updatedWord = {
      ...currentWord,
      reviewCount: newReviewCount,
      nextReview: nextReviewTime,
      lastReview: Date.now()
    }
    
    const newWords = words.map(w => w.id === currentWord.id ? updatedWord : w)
    saveWords(newWords)
    
    // 進入下一題
    goNext()
  }

  // 標記為「不會」
  const handleIncorrect = () => {
    const currentWord = reviewWords[reviewIndex]
    // 不會的話，明天再複習
    const nextReviewTime = Date.now() + 1 * 24 * 60 * 60 * 1000
    
    const updatedWord = {
      ...currentWord,
      reviewCount: 0,  // 重置
      nextReview: nextReviewTime,
      lastReview: Date.now()
    }
    
    const newWords = words.map(w => w.id === currentWord.id ? updatedWord : w)
    saveWords(newWords)
    
    // 進入下一題
    goNext()
  }

  // 進入下一題
  const goNext = () => {
    if (reviewIndex < reviewWords.length - 1) {
      setReviewIndex(reviewIndex + 1)
      setShowAnswer(false)
    } else {
      // 複習完成
      setReviewMode(false)
      alert(`複習完成！共 ${reviewWords.length} 個單字`)
    }
  }

  // 計算下次複習時間
  const getNextReviewText = (timestamp: number | null) => {
    if (!timestamp) return "立即"
    const now = Date.now()
    const diff = timestamp - now
    if (diff <= 0) return "現在"
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
    return `${days} 天後`
  }

  // 複習模式 UI
  if (reviewMode) {
    const currentWord = reviewWords[reviewIndex]
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-6 max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setReviewMode(false)} className="p-2">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-sm text-gray-500">
              {reviewIndex + 1} / {reviewWords.length}
            </div>
          </div>

          {/* 單字卡 */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-4">
                {currentWord.word}
              </div>
              
              {!showAnswer ? (
                <Button onClick={() => setShowAnswer(true)} className="w-full">
                  顯示答案
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-lg text-gray-600">
                    {currentWord.meaning}
                  </div>
                  {currentWord.example && (
                    <div className="text-sm text-gray-400 italic">
                      {currentWord.example}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 答案按鈕 */}
          {showAnswer && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleIncorrect}
                className="bg-red-500 hover:bg-red-600"
              >
                <X className="w-4 h-4 mr-2" />
                不會
              </Button>
              <Button 
                onClick={handleCorrect}
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-2" />
                會了
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 一般模式 UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/")} className="p-2">
            <Home className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">我的單字本</h1>
          <button onClick={startReview} className="p-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* 複習按鈕 */}
        {words.length > 0 && (
          <Button onClick={startReview} className="w-full mb-4 bg-blue-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            開始複習 ({words.filter(w => !w.nextReview || w.nextReview <= Date.now()).length})
          </Button>
        )}

        {/* 新增表單 */}
        {isAdding ? (
          <Card className="mb-4">
            <CardContent className="p-4 space-y-3">
              <input
                type="text"
                placeholder="單字"
                value={newWord.word}
                onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="解釋"
                value={newWord.meaning}
                onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="例句（選填）"
                value={newWord.example}
                onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddWord} className="flex-1">儲存</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>取消</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} className="w-full mb-4">
            <Plus className="w-4 h-4 mr-2" />
            新增單字
          </Button>
        )}

        {/* 單字列表 */}
        <div className="space-y-2">
          {words.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              還沒有單字，開始新增吧！
            </div>
          ) : (
            words.map(word => (
              <Card key={word.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{word.word}</div>
                      <div className="text-sm text-gray-600">{word.meaning}</div>
                      {word.example && (
                        <div className="text-xs text-gray-400 italic mt-1">{word.example}</div>
                      )}
                      <div className="text-xs text-blue-500 mt-1">
                        複習次數: {word.reviewCount || 0} | 下次: {getNextReviewText(word.nextReview)}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteWord(word.id)} className="p-1 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
