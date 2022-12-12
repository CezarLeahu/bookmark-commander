import {
  DependencyList,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'

export interface PairState<S> {
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

export interface PairRef<T> {
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

type F = () => void
export interface PairCallback<T extends F> {
  left: T
  right: T
}

export function usePairCallbacks<T extends F>(
  callbackLeft: T,
  callbackRight: T,
  deps: DependencyList,
): PairCallback<T> {
  return {
    left: useCallback<T>(callbackLeft, [callbackLeft, ...deps]),
    right: useCallback<T>(callbackRight, [callbackRight, ...deps]),
  }
}
