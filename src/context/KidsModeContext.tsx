'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface KidsModeContextType {
  kidsMode: boolean
  toggleKidsMode: () => void
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(
  undefined
)

export function KidsModeProvider({ children }: { children: ReactNode }) {
  const [kidsMode, setKidsMode] = useState(false)

  // Try to load saved preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('kidsMode')
    if (savedMode) {
      setKidsMode(savedMode === 'true')
    }
  }, [])

  const toggleKidsMode = () => {
    const newMode = !kidsMode
    setKidsMode(newMode)
    // Save preference to localStorage
    localStorage.setItem('kidsMode', String(newMode))
  }

  return (
    <KidsModeContext.Provider value={{ kidsMode, toggleKidsMode }}>
      {children}
    </KidsModeContext.Provider>
  )
}

export function useKidsMode(): KidsModeContextType {
  const context = useContext(KidsModeContext)
  if (context === undefined) {
    throw new Error('useKidsMode must be used within a KidsModeProvider')
  }
  return context
}
