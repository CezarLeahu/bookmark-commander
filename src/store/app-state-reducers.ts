import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { Side } from '../services/utils/types'

export interface AppState {
  focusedSide: Side
  rowsOutdated: object
}

const initialState: AppState = {
  focusedSide: 'left',
  rowsOutdated: {},
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
  },
})

export const { focusLeft, focusRight, focusSide, refreshRows } = appStateSlice.actions

export const selectFocusedSide = (state: RootState): Side => state.app.focusedSide

export const selectRowsOutdated = (state: RootState): object => state.app.rowsOutdated

export default appStateSlice.reducer
