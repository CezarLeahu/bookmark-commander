import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

import sideReducer from './sideReducers'

export const store = configureStore({
  reducer: {
    side: sideReducer,
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
