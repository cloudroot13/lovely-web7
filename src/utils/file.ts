export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Falha ao converter arquivo para data URL'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}
