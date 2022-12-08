export interface Stack<T> {
  push: (e: T) => void
  pop: () => T | undefined
  peek: () => T | undefined
  size: () => number
  clear: () => void
}

export function staticStack<T>(capacity: number): Stack<T> {
  if (capacity < 1) {
    throw new Error('Invalid capacity')
  }
  const storage: T[] = []

  return {
    push: (e: T): void => {
      if (storage.length === capacity) {
        storage.shift()
      }
      storage.push(e)
    },
    pop: (): T | undefined => {
      return storage.pop()
    },
    peek: (): T | undefined => {
      if (storage.length === 0) {
        return undefined
      }
      return storage[storage.length - 1]
    },
    size: (): number => {
      return storage.length
    },
    clear: (): void => {
      storage.splice(0)
    },
  }
}
