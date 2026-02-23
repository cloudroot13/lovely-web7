import { createContext, useContext } from 'react'
import type { AppConfig, LoveData } from '../types/types'

export interface AppState {
  config: AppConfig
  loveData: LoveData
  setConfig: (next: Partial<AppConfig>) => void
  setLoveData: (next: Partial<LoveData>) => void
  resetAll: () => void
}

export const AppContext = createContext<AppState | undefined>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
