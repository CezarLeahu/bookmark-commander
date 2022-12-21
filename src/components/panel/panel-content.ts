import { childrenAndParent, getNode, parentPath } from '../../services/bookmarks/queries'
import { updateBreadcrumbs, updateNode, updateRows } from '../../store/panel-state-reducers'
import { useCallback, useEffect } from 'react'
import {
  useSearchResultSelection,
  useSelectAppOutdated,
  useSelectIsHighlighted,
} from '../../store/app-state-hooks'
import { useSelectNode, useSelectNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { ComponentStateChangedEvent } from 'ag-grid-community'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { clearSearchResultSelection } from '../../store/app-state-reducers'
import { useAppDispatch } from '../../store/hooks'

export function useLoadPanelContentEffect(side: Side): void {
  const dispatch = useAppDispatch()

  const appOutdated = useSelectAppOutdated()
  const nodeId = useSelectNodeId(side)

  const node = useSelectNode(side)

  useEffect(() => {
    getNode(nodeId).then(
      node => dispatch(updateNode({ side, node })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId])

  useEffect(() => {
    parentPath(node).then(
      nodes => dispatch(updateBreadcrumbs({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, node])

  useEffect(() => {
    childrenAndParent(nodeId).then(
      ([nodes]) => dispatch(updateRows({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId, appOutdated])
}

export function useComponenetStateChangedHandler(
  side: Side,
): (event: ComponentStateChangedEvent<BTN>) => void {
  const dispatch = useAppDispatch()
  const highlighted = useSelectIsHighlighted(side)
  const searchResultSelection = useSearchResultSelection()

  return useCallback(
    (event: ComponentStateChangedEvent<BTN>) => {
      if (!highlighted) {
        event.api.clearFocusedCell()
        return
      }
      if (event.api.getDisplayedRowCount() === 0) {
        return
      }

      if (highlighted && searchResultSelection.current !== undefined) {
        dispatch(clearSearchResultSelection())

        const row = event.api.getRowNode(searchResultSelection.current.id)
        if (row === undefined) {
          return
        }
        event.api.setFocusedCell(row.rowIndex ?? 0, TITLE_COLUMN)
        event.api.ensureNodeVisible(row)
        row.setSelected(true)
        return
      }

      const currentIndex = event.api.getFocusedCell()?.rowIndex ?? -1
      const index =
        currentIndex < 0 || currentIndex >= event.api.getModel().getRowCount() ? 0 : currentIndex
      event.api.setFocusedCell(index, TITLE_COLUMN)
      event.api.ensureIndexVisible(index)
    },
    [dispatch, highlighted, searchResultSelection],
  )
}
