import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppContext, type AppState } from './appStore'
import type { AppConfig, LoveData } from '../types/types'

const STORAGE_KEY = 'lovely-romance-app-v2'
const LEGACY_STORAGE_KEY = 'lovely-romance-app'

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

type StoredState = {
  config: AppConfig
  loveDataByKey: Record<string, LoveData>
}

function buildExperienceKey(config: AppConfig) {
  return `${config.mode}:${config.variant}`
}

function normalizeLoveData(data?: LoveData) {
  return { ...initialLoveData, ...(data ?? {}) }
}

function getStoredState(): StoredState {
  const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!raw) {
    return {
      config: initialConfig,
      loveDataByKey: { [buildExperienceKey(initialConfig)]: initialLoveData },
    }
  }

  try {
    const parsed = JSON.parse(raw) as {
      config?: AppConfig
      loveData?: LoveData
      loveDataByKey?: Record<string, LoveData>
    }
    const config = { ...initialConfig, ...parsed.config }
    const fallbackKey = buildExperienceKey(config)
    const baseMap = parsed.loveDataByKey
      ? Object.fromEntries(Object.entries(parsed.loveDataByKey).map(([key, value]) => [key, normalizeLoveData(value)]))
      : {}

    if (!parsed.loveDataByKey && parsed.loveData) {
      baseMap[fallbackKey] = normalizeLoveData(parsed.loveData)
    }

    if (!baseMap[fallbackKey]) {
      baseMap[fallbackKey] = initialLoveData
    }

    return {
      config,
      loveDataByKey: baseMap,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return {
      config: initialConfig,
      loveDataByKey: { [buildExperienceKey(initialConfig)]: initialLoveData },
    }
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<AppConfig>(() => getStoredState().config)
  const [loveDataByKey, setLoveDataByKey] = useState<Record<string, LoveData>>(() => getStoredState().loveDataByKey)
  const experienceKey = useMemo(() => buildExperienceKey(config), [config])
  const loveData = useMemo(() => normalizeLoveData(loveDataByKey[experienceKey]), [experienceKey, loveDataByKey])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, loveDataByKey }))
  }, [config, loveDataByKey])

  const value = useMemo<AppState>(
    () => ({
      config,
      loveData,
      setConfig: (next) => setConfigState((prev) => ({ ...prev, ...next })),
      setLoveData: (next) =>
        setLoveDataByKey((prev) => ({
          ...prev,
          [experienceKey]: { ...normalizeLoveData(prev[experienceKey]), ...next },
        })),
      resetAll: () => {
        setConfigState(initialConfig)
        setLoveDataByKey((prev) => ({
          ...prev,
          [buildExperienceKey(initialConfig)]: initialLoveData,
        }))
      },
    }),
    [config, experienceKey, loveData, loveDataByKey],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
