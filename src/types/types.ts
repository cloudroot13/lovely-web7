export type Mode = 'classic' | 'wrapped'

export type ClassicVariant = 'normal' | 'netflix'

export type WrappedVariant = 'stories' | 'spotify' | 'jornada' | 'game'

export interface MomentHighlight {
  text: string
  id?: string
  date?: string
  title?: string
  message?: string
  imageDataUrl: string
}

export interface LoveData {
  nomeCriador: string
  nomePessoa: string
  apelido: string
  classicTitle: string
  classicMessage: string
  classicCounterStyle: 'default' | 'classic' | 'simple'
  classicPhotoDisplay: 'coverflow' | 'cube' | 'cards' | 'flip'
  classicBackgroundAnimation: 'none' | 'hearts' | 'stars_meteors' | 'clouds'
  classicMemoriesTitle: string
  classicMemoriesBannerDataUrl: string
  localConheceram: string
  comoConheceram: string
  momentoEspecial: string
  atividadeJuntos: string
  dataImportante: string
  weeklyMeetups: number
  monthlyMeetups: number
  minutesTogether: number
  memoriesCreated: number
  laughsShared: number
  startDate: string
  oQueMaisAmo: string
  musicaSource: 'none' | 'spotify_link'
  musicaSpotifyUrl: string
  musicaNome: string
  fotoCasalDataUrl: string
  totalPhotos: number
  storiesImagesDataUrls: string[]
  momentHighlights: MomentHighlight[]
  anos: number
  meses: number
  dias: number
}

export interface AppConfig {
  mode: Mode
  variant: ClassicVariant | WrappedVariant
  theme: string
}
