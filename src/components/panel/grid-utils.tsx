import { BTN } from '../../services/bookmarks/types'
import { GetRowIdParams } from 'ag-grid-community'

export const rowIdProvider = (params: GetRowIdParams<BTN>): string => params.data.id
