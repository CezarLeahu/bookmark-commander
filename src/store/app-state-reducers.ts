import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'
import { Side } from '../services/utils/types'

export interface AppState {
  focusedSide: Side
  topNodes: BTN[]
  outdated: object
}

const initialState: AppState = {
  focusedSide: 'left',
  topNodes: [],
  outdated: {},
}

export const appStateSlice = createSlice({
  name: 'side',
  initialState,
  reducers: {
    focusLeft: state => {
      state.focusedSide = 'left'
    },
    focusRight: state => {
      state.focusedSide = 'right'
    },
    focusSide: (state, { payload }: PayloadAction<Side>) => {
      state.focusedSide = payload
    },
    updateTopNodes: (state, { payload }: PayloadAction<{ nodes: BTN[] }>) => {
      state.topNodes = payload.nodes
    },
    refreshApp: state => {
      state.outdated = {}
    },
  },
})

export const { focusLeft, focusRight, focusSide, refreshApp, updateTopNodes } =
  appStateSlice.actions

export const selectFocusedSide = (state: RootState): Side => state.app.focusedSide

export const selectAppOutdated = (state: RootState): object => state.app.outdated

export const selectTopNodes = (state: RootState): BTN[] => state.app.topNodes

export const selectIsHighlighted = (state: RootState, side: Side): boolean =>
  state.app.focusedSide === side

export default appStateSlice.reducer
