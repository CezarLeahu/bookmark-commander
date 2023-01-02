import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { Side } from '../services/utils/types'

export interface AppState {
  outdated: object
  focusedSide: Side
  topNodes: BTN[]
  searchResultSelection: {
    current: BTN | undefined
  }
}

const initialState: AppState = {
  outdated: {},
  focusedSide: 'left',
  topNodes: [],
  searchResultSelection: { current: undefined },
}

export const appStateSlice = createSlice({
  name: 'side',
  initialState,
  reducers: {
    refreshApp: state => {
      state.outdated = {}
    },
    focusSide: (state, { payload }: PayloadAction<Side>) => {
      state.focusedSide = payload
    },
    updateTopNodes: (state, { payload }: PayloadAction<{ nodes: BTN[] }>) => {
      state.topNodes = payload.nodes
    },
    updateSearchResultSelection: (state, { payload }: PayloadAction<BTN>) => {
      state.searchResultSelection.current = payload
    },
    clearSearchResultSelection: state => {
      state.searchResultSelection.current = undefined
    },
  },
})

export const {
  refreshApp,
  focusSide,
  updateTopNodes,
  updateSearchResultSelection,
  clearSearchResultSelection,
} = appStateSlice.actions

export default appStateSlice.reducer
