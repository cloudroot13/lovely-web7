import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppContext, type AppState } from './appStore'
import type { AppConfig, LoveData } from '../types/types'

const STORAGE_KEY = 'lovely-romance-app'

const initialConfig: AppConfig = {
  mode: 'classic',
  variant: 'normal',
  theme: 'Romantic Pink',
}

const initialLoveData: LoveData = {
  nomeCriador: '',
  nomePessoa: '',
  apelido: '',
  classicTitle: '',
  classicMessage: '',
  classicCounterStyle: 'default',
  classicPhotoDisplay: 'coverflow',
  classicBackgroundAnimation: 'none',
  classicMemoriesTitle: '',
  classicMemoriesBannerDataUrl: '',
  comoConheceram: '',
  momentoEspecial: '',
  atividadeJuntos: '',
  dataImportante: '',
  weeklyMeetups: 1,
  monthlyMeetups: 4,
  minutesTogether: 0,
  memoriesCreated: 0,
  laughsShared: 0,
  startDate: '',
  oQueMaisAmo: '',
  musicaSource: 'none',
  musicaSpotifyUrl: '',
  musicaNome: '',
  fotoCasalDataUrl: '',
  totalPhotos: 5,
  storiesImagesDataUrls: [],
  momentHighlights: [],
  anos: 0,
  meses: 0,
  dias: 0,
}

function getStoredState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { config: initialConfig, loveData: initialLoveData }
  }

  try {
    const parsed = JSON.parse(raw) as { config?: AppConfig; loveData?: LoveData }
    return {
      config: { ...initialConfig, ...parsed.config },
      loveData: { ...initialLoveData, ...parsed.loveData },
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { config: initialConfig, loveData: initialLoveData }
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AppConfig>(() => getStoredState().config)
  const [loveData, setLoveDataState] = useState<LoveData>(() => getStoredState().loveData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, loveData }))
  }, [config, loveData])

  const value = useMemo<AppState>(
    () => ({
      config,
      loveData,
      setConfig: (next) => setConfigState((prev) => ({ ...prev, ...next })),
      setLoveData: (next) => setLoveDataState((prev) => ({ ...prev, ...next })),
      resetAll: () => {
        setConfigState(initialConfig)
        setLoveDataState(initialLoveData)
      },
    }),
    [config, loveData],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
