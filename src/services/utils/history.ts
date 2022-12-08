import { Stack, staticStack } from './stack'

export interface History<T> {
  put: (e: T) => void
  back: () => T | undefined
  forwardRef: () => T | undefined
  hasBackHistory: () => boolean
  hasForwardHistory: () => boolean
}

export function history<T>(capacity: number): History<T> {
  let current: T | undefined
  const backStack: Stack<T> = staticStack<T>(capacity)
  const forwardStack: Stack<T> = staticStack<T>(capacity)

  return {
    put: (e: T): void => {
      if (e === undefined || e === current) {
        return
      }
      if (current === undefined) {
        current = e
        return
      }

      forwardStack.clear()
      backStack.push(current)
      current = e
    },

    back: (): T | undefined => {
      if (current === undefined || backStack.size() === 0) {
        return current
      }

      const e: T | undefined = backStack.pop()
      if (e === undefined) {
        return current
      }
      forwardStack.push(current)
      current = e
      return current
    },

    forwardRef: (): T | undefined => {
      if (current === undefined || forwardStack.size() === 0) {
        return current
      }

      const e: T | undefined = forwardStack.pop()
      if (e === undefined) {
        return current
      }
      backStack.push(current)
      current = e
      return current
    },
    hasBackHistory: (): boolean => backStack.size() !== 0,
    hasForwardHistory: (): boolean => forwardStack.size() !== 0,
  }
}
