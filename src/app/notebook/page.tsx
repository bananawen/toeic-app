"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, BookOpen, Home, ArrowLeft } from "lucide-react"

type Word = {
  id: string
  word: string
  partOfSpeech: string
  meaning: string
  example: string
  synonyms: string
  createdAt: number
}

const STORAGE_KEY = "toeic_notebook"

export default function NotebookPage() {
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [newWord, setNewWord] = useState({ word: "", meaning: "", example: "" })
  const [isAdding, setIsAdding] = useState(false)

  // 載入單字本
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setWords(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load notebook:", e)
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
      createdAt: Date.now()
    }

    saveWords([word, ...words])
    setNewWord({ word: "", meaning: "", example: "" })
    setIsAdding(false)
  }

  // 刪除單字
  const handleDeleteWord = (id: string) => {
    if (confirm("確定要刪除這個單字嗎？")) {
      saveWords(words.filter(w => w.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-3 py-4 max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button onClick={() => router.push("/")} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回
          </Button>
          <h1 className="text-xl font-bold text-blue-600">
            📖 我的單字本
          </h1>
        </div>

        {/* 新增表單 */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" /> 新增單字
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAdding ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="英文單字"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="中文意思"
                  value={newWord.meaning}
                  onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="例句（選填）"
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddWord} size="sm" className="flex-1">
                    儲存
                  </Button>
                  <Button onClick={() => {
                    setIsAdding(false)
                    setNewWord({ word: "", meaning: "", example: "" })
                  }} variant="outline" size="sm">
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> 新增單字
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 單字列表 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-700">
            已收藏 ({words.length} 個單字)
          </h2>

          {words.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>單字本還沒有任何單字</p>
                <p className="text-sm">點擊上方「新增單字」開始收藏</p>
              </CardContent>
            </Card>
          ) : (
            words.map((w) => (
              <Card key={w.id} className="relative">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-blue-600">{w.word}</div>
                      {w.partOfSpeech && (
                        <div className="text-xs text-purple-600 font-medium">{w.partOfSpeech}</div>
                      )}
                      <div className="text-gray-700 mt-1">{w.meaning}</div>
                      {w.example && (
                        <div className="text-sm text-blue-600 mt-2 italic">
                          💬 {w.example}
                        </div>
                      )}
                      {w.synonyms && (
                        <div className="text-sm text-yellow-700 mt-2">
                          🔗 搭配詞: {w.synonyms}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteWord(w.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
