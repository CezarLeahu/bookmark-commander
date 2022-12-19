import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import appStateReducer from './app-state-reducers'
import panelStateReducer from './panel-state-reducers'

export const store = configureStore({
  reducer: {
    app: appStateReducer,
    panel: panelStateReducer,
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
