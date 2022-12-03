import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react'

interface PairState<S> {
  left: {
    state: S
    setState: Dispatch<SetStateAction<S>>
  }
  right: {
    state: S
    setState: Dispatch<SetStateAction<S>>
  }
}

export function usePairStateEmpty<S = undefined>(): PairState<S | undefined> {
  const [leftState, setLeftState] = useState<S>()
  const [rightState, setRightState] = useState<S>()

  return {
    left: {
      state: leftState,
      setState: setLeftState,
    },
    right: {
      state: rightState,
      setState: setRightState,
    },
  }
}

export function usePairState<S>(initialLeft: S, initialRight: S): PairState<S> {
  const [leftState, setLeftState] = useState<S>(initialLeft)
  const [rightState, setRightState] = useState<S>(initialRight)

  return {
    left: {
      state: leftState,
      setState: setLeftState,
    },
    right: {
      state: rightState,
      setState: setRightState,
    },
  }
}

interface PairRef<T> {
  left: MutableRefObject<T>
  right: MutableRefObject<T>
}

export function usePairRefEmpty<T = undefined>(): PairRef<T | undefined> {
  return {
    left: useRef<T>(),
    right: useRef<T>(),
  }
}
export function usePairRef<T>(initialValueLeft: T, initialValueRight: T): PairRef<T> {
  return {
    left: useRef<T>(initialValueLeft),
    right: useRef<T>(initialValueRight),
  }
}
