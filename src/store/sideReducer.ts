import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Side, other } from '../services/utils/types'

import { RootState } from './store'

export const sideSlice = createSlice({
  name: 'side',
  initialState: 'left' as Side,
  reducers: {
    focusLeft: side => 'left',
    focusRight: side => 'right',
    change: side => other(side),
    focusSide: (side, { payload }: PayloadAction<Side>) => payload,
  },
})

export const { focusLeft, focusRight, change, focusSide } = sideSlice.actions

export const selectSide = (state: RootState): Side => state.side

export default sideSlice.reducer
