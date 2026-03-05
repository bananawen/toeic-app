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
  // 初始為 null，避免 hydration mismatch
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    // 只在客戶端執行
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initialTheme = saved || "light"
    setTheme(initialTheme)
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const current = prev || "light"
      const newTheme = current === "light" ? "dark" : "light"
      localStorage.setItem(STORAGE_KEY, newTheme)
      
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      
      return newTheme
    })
  }

  // 避免 hydration mismatch：未載入前顯示預設
  if (theme === null) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
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
