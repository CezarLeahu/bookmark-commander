import { Pair, Side, other } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'

interface PanelState {
  nodeId: string
  node: BTN | undefined
}

const initialState: Pair<PanelState> = {
  left: {
    nodeId: '1',
    node: undefined,
  },
  right: {
    nodeId: '2',
    node: undefined,
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
  },
})

export const { updateNodeIdLeft, updateNodeIdRight, updateNodeId } = panelStateSlice.actions

export const selectNodeIds = (state: RootState): Pair<string> => ({
  left: state.panel.left.nodeId,
  right: state.panel.right.nodeId,
})

export const selectLeftNodeId = (state: RootState): string => state.panel.left.nodeId
export const selectRightNodeId = (state: RootState): string => state.panel.right.nodeId

export const selectFocusedPanelInRootDir = (state: RootState): boolean =>
  state.panel[state.app.focusedSide].nodeId === '0'
export const selectSameNodeIds = (state: RootState): boolean =>
  state.panel.left.nodeId === state.panel.right.nodeId

export const selectNodeId = (state: RootState, side: Side): string => state.panel[side].nodeId

export const selectFocusedNodeId = (state: RootState): string =>
  state.panel[state.app.focusedSide].nodeId
export const selectOtherNodeId = (state: RootState): string =>
  state.panel[other(state.app.focusedSide)].nodeId

export default panelStateSlice.reducer
