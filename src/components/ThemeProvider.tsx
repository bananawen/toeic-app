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
  // 從 localStorage 讀取主題（同步）
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light"
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "light"
  }
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // 套用主題到 html
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light")
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
