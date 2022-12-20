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
  selectionIds: string[]
  highlightId: string | undefined
}

const initialState: Pair<PanelState> = {
  left: {
    outdated: {},
    nodeId: '1',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    highlightId: undefined,
  },
  right: {
    outdated: {},
    nodeId: '2',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    highlightId: undefined,
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
    updateSelection: (state, { payload }: PayloadAction<{ side: Side; ids: string[] }>) => {
      state[payload.side].selectionIds = payload.ids
    },
    updateHighlight: (
      state,
      { payload }: PayloadAction<{ side: Side; id: string | undefined }>,
    ) => {
      state[payload.side].highlightId = payload.id
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
  updateHighlight,
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

export const selectSelectionIds = (state: RootState, side: Side): string[] =>
  state.panel[side].selectionIds
export const selectHighlightId = (state: RootState, side: Side): string | undefined =>
  state.panel[side].highlightId

export const selectFocusedPanelSelectionIds = (state: RootState): string[] =>
  state.panel[state.app.focusedSide].selectionIds

export const selectFocusedPanelHasSelection = (state: RootState): boolean =>
  state.panel[state.app.focusedSide].selectionIds.length > 0
export const selectFocusedPanelHasHighlight = (state: RootState): boolean =>
  state.panel[state.app.focusedSide].highlightId !== undefined

export default panelStateSlice.reducer
