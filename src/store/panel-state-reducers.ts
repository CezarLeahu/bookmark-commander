import { Pair, Side, other } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { GridApi } from 'ag-grid-community'
import { RootState } from './store'

interface PanelState {
  nodeId: string
  node: BTN | undefined
  breadcrumbs: BTN[]
  rows: BTN[]
  api: GridApi<BTN> | undefined
}

const initialState: Pair<PanelState> = {
  left: {
    nodeId: '1',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    api: undefined,
  },
  right: {
    nodeId: '2',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    api: undefined,
  },
}

export const panelStateSlice = createSlice({
  name: 'currentNodeIds',
  initialState,
  reducers: {
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
    updateGridApi: (state, { payload }: PayloadAction<{ side: Side; api: GridApi<BTN> }>) => {
      state[payload.side].api = payload.api
    },
  },
})

export const {
  updateNodeIdLeft,
  updateNodeIdRight,
  updateNodeId,
  updateNode,
  updateBreadcrumbs,
  updateRows,
  updateGridApi,
} = panelStateSlice.actions

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

export const selectGridApi = (state: RootState, side: Side): GridApi<BTN> | undefined =>
  state.panel[side].api

export const selectLeftGridApi = (state: RootState): GridApi<BTN> | undefined =>
  state.panel.left.api
export const selectRightGridApi = (state: RootState): GridApi<BTN> | undefined =>
  state.panel.right.api

export default panelStateSlice.reducer
