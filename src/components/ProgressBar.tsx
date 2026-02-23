interface ProgressBarProps {
  total: number
  current: number
  colorClass?: string
  currentProgress?: number
}

export function ProgressBar({ total, current, colorClass = 'bg-pink-500', currentProgress = 0.55 }: ProgressBarProps) {
  return (
    <div className="flex w-full gap-2 px-4 pt-4">
      {Array.from({ length: total }).map((_, index) => {
        const isDone = index < current
        const isCurrent = index === current

        return (
          <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-700/80">
            <div
              className={`h-full rounded-full transition-all duration-100 ${isDone || isCurrent ? colorClass : 'bg-transparent'}`}
              style={{ width: isDone ? '100%' : isCurrent ? `${Math.max(0, Math.min(100, currentProgress * 100))}%` : '0%' }}
            />
          </div>
        )
      })}
    </div>
  )
}
