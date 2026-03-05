"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

const STORAGE_KEY = "toeic_theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // 載入主題
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved) {
      setTheme(saved)
    }
    setMounted(true)
  }, [])

  // 切換主題
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  // 套用主題到 body
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
