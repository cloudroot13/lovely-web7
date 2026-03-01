import { useEffect } from 'react'

const INVIEW_CLASS = 'anim-inview'
const PAUSABLE_CLASS = 'anim-pausable'
const NO_PAUSE_ATTR = 'data-no-inview-pause'

function canPauseAnimations() {
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useInViewAnimations() {
  useEffect(() => {
    if (!canPauseAnimations()) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.add(INVIEW_CLASS)
          } else {
            el.classList.remove(INVIEW_CLASS)
          }
        })
      },
      { threshold: 0.15 },
    )

    const register = (el: Element) => {
      if (!(el instanceof HTMLElement)) return
      if (el.closest(`[${NO_PAUSE_ATTR}="1"]`)) return
      if (el.classList.contains(PAUSABLE_CLASS)) return
      const styles = window.getComputedStyle(el)
      if (styles.animationName === 'none' || styles.animationDuration === '0s') return
      el.classList.add(PAUSABLE_CLASS)
      observer.observe(el)
    }

    const scan = () => {
      document.querySelectorAll('*').forEach(register)
    }

    scan()

    const mutation = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          register(node)
          node.querySelectorAll?.('*').forEach(register)
        })
      })
    })

    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutation.disconnect()
      observer.disconnect()
    }
  }, [])
}
