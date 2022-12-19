import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import currentNodeIdsReducer from './currentNodeIdsReducer'
import sideReducer from './sideReducer'

export const store = configureStore({
  reducer: {
    side: sideReducer,
    currentNodeIds: currentNodeIdsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
