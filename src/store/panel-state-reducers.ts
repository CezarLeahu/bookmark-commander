import { Pair, Side, other } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'

interface PanelState {
  outdated: object
  nodeId: string
  node: BTN | undefined
  breadcrumbs: BTN[]
  rows: BTN[]
  selection: BTN[]
  hilightedIndex: number | null
}

const initialState: Pair<PanelState> = {
  left: {
    outdated: {},
    nodeId: '1',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selection: [],
    hilightedIndex: null,
  },
  right: {
    outdated: {},
    nodeId: '2',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selection: [],
    hilightedIndex: null,
  },
}

export const panelStateSlice = createSlice({
  name: 'currentNodeIds',
  initialState,
  reducers: {
    refreshPanel: (state, { payload }: PayloadAction<{ side: Side }>) => {
      state[payload.side].outdated = {}
    },
    updateNodeIdLeft: (state, { payload }: PayloadAction<string>) => {
      state.left.nodeId = payload
    },
    updateNodeIdRight: (state, { payload }: PayloadAction<string>) => {
      state.right.nodeId = payload
    },
    updateNodeId: (state, { payload }: PayloadAction<{ side: Side; id: string }>) => {
      state[payload.side].nodeId = payload.id
    },
    updateNode: (state, { payload }: PayloadAction<{ side: Side; node: BTN }>) => {
      state[payload.side].node = payload.node
    },
    updateBreadcrumbs: (state, { payload }: PayloadAction<{ side: Side; nodes: BTN[] }>) => {
      state[payload.side].breadcrumbs = payload.nodes
    },
    updateRows: (state, { payload }: PayloadAction<{ side: Side; nodes: BTN[] }>) => {
      state[payload.side].rows = payload.nodes
    },
    updateSelection: (state, { payload }: PayloadAction<{ side: Side; nodes: BTN[] }>) => {
      state[payload.side].selection = payload.nodes
    },
    updateHighlightedIndex: (
      state,
      { payload }: PayloadAction<{ side: Side; index: number | null }>,
    ) => {
      state[payload.side].hilightedIndex = payload.index
    },
  },
})

export const {
  refreshPanel,
  updateNodeIdLeft,
  updateNodeIdRight,
  updateNodeId,
  updateNode,
  updateBreadcrumbs,
  updateRows,
  updateSelection,
  updateHighlightedIndex,
} = panelStateSlice.actions

export const selectPanelOutdated = (state: RootState, side: Side): object =>
  state.panel[side].outdated

export const selectLeftNodeId = (state: RootState): string => state.panel.left.nodeId
export const selectRightNodeId = (state: RootState): string => state.panel.right.nodeId

export const selectFocusedPanelInRootDir = (state: RootState): boolean =>
  state.panel[state.app.focusedSide].nodeId === '0'

export const selectNodeId = (state: RootState, side: Side): string => state.panel[side].nodeId

export const selectFocusedNodeId = (state: RootState): string =>
  state.panel[state.app.focusedSide].nodeId
export const selectOtherNodeId = (state: RootState): string =>
  state.panel[other(state.app.focusedSide)].nodeId

export const selectNode = (state: RootState, side: Side): BTN | undefined => state.panel[side].node
export const selectBreadcrumbs = (state: RootState, side: Side): BTN[] =>
  state.panel[side].breadcrumbs
export const selectRows = (state: RootState, side: Side): BTN[] => state.panel[side].rows

export const selectSelection = (state: RootState, side: Side): BTN[] => state.panel[side].selection
export const selectHighlightedIndex = (state: RootState, side: Side): number | null =>
  state.panel[side].hilightedIndex

export default panelStateSlice.reducer
