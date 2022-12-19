import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import currentNodeIdsReducer from './panel-state-reducers'
import sideReducer from './common-app-state-reducers'

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
