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

const STORAGE_KEY = "toic_theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // 客戶端掛載後才讀取 localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.add(saved)
    }
  }, [])

  // 切換主題
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light"
      localStorage.setItem(STORAGE_KEY, newTheme)
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return newTheme
    })
  }

  // 避免 hydration mismatch
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
