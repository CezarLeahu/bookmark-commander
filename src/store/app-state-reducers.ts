import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'
import { Side } from '../services/utils/types'

export interface AppState {
  focusedSide: Side
  rowsOutdated: object
  topNodes: BTN[]
}

const initialState: AppState = {
  focusedSide: 'left',
  rowsOutdated: {},
  topNodes: [],
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
    refreshRows: state => {
      state.rowsOutdated = {}
    },
    updateTopNodes: (state, { payload }: PayloadAction<{ nodes: BTN[] }>) => {
      state.topNodes = payload.nodes
    },
  },
})

export const { focusLeft, focusRight, focusSide, refreshRows, updateTopNodes } =
  appStateSlice.actions

export const selectFocusedSide = (state: RootState): Side => state.app.focusedSide

export const selectRowsOutdated = (state: RootState): object => state.app.rowsOutdated

export const selectTopNodes = (state: RootState): BTN[] => state.app.topNodes

export const selectHighlighted = (state: RootState, side: Side): boolean =>
  state.app.focusedSide === side

export default appStateSlice.reducer
