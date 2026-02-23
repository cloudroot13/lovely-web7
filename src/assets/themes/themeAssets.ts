import classicDarkBg from './classic-normal/dark-bg.jpg'
import classicGlowOverlay from './classic-normal/glow-overlay.png'
import classicPolaroidFrame from './classic-normal/polaroid-frame.png'
import classicRomanticBg from './classic-normal/romantic-bg.jpg'

import netflixHeroOverlay from './classic-netflix/hero-overlay.png'
import netflixRedGradient from './classic-netflix/red-gradient.png'
import netflixTop10Bg from './classic-netflix/top10-bg.jpg'

import storiesDarkAbstract from './wrapped-stories/dark-abstract.jpg'
import storiesNeonLines from './wrapped-stories/neon-lines.png'
import storiesPinkGradient from './wrapped-stories/pink-gradient.jpg'

import spotifyDarkBg from './wrapped-spotify/spotify-dark-bg.jpg'
import spotifyPlayerShadow from './wrapped-spotify/player-shadow.png'
import spotifyVinylOverlay from './wrapped-spotify/vinyl-overlay.png'

export const classicNormalThemes = {
  'Romantic Pink': {
    bg: classicRomanticBg,
    overlay: classicGlowOverlay,
    frame: classicPolaroidFrame,
  },
  'Dark Love': {
    bg: classicDarkBg,
    overlay: classicGlowOverlay,
    frame: classicPolaroidFrame,
  },
  'Minimal Black': {
    bg: classicDarkBg,
    overlay: classicGlowOverlay,
    frame: classicPolaroidFrame,
  },
} as const

export const wrappedStoriesThemes = {
  'Pink Gradient': {
    bg: storiesPinkGradient,
    accent: storiesNeonLines,
  },
  'Dark Abstract': {
    bg: storiesDarkAbstract,
    accent: storiesNeonLines,
  },
  'Neon Love': {
    bg: storiesPinkGradient,
    accent: storiesNeonLines,
  },
} as const

export const netflixAssets = {
  heroOverlay: netflixHeroOverlay,
  top10Bg: netflixTop10Bg,
  redGradient: netflixRedGradient,
} as const

export const spotifyAssets = {
  bg: spotifyDarkBg,
  playerShadow: spotifyPlayerShadow,
  vinylOverlay: spotifyVinylOverlay,
} as const
