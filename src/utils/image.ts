import { readFileAsDataUrl } from './file'

type ImageReadOptions = {
  maxSize?: number
  quality?: number
}

const DEFAULT_MAX_SIZE = 1600
const DEFAULT_QUALITY = 0.86

function shouldBypassResize(file: File) {
  const type = file.type.toLowerCase()
  return type.includes('gif') || type.includes('svg')
}

export async function readImageFileAsDataUrl(file: File, options: ImageReadOptions = {}) {
  if (shouldBypassResize(file)) {
    return readFileAsDataUrl(file)
  }

  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE
  const quality = options.quality ?? DEFAULT_QUALITY

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const targetWidth = Math.max(1, Math.round(bitmap.width * scale))
  const targetHeight = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return readFileAsDataUrl(file)
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  try {
    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    return readFileAsDataUrl(file)
  }
}

