import { GetContextMenuItemsParams, GridApi, MenuItemDef, RowNode } from 'ag-grid-community'
import { isDirectory, isSimpleBookmark } from '../../services/bookmarks/utils'
import { openAllInNewTabs, openInNewTab } from '../../services/tabs/tabs'

import { BTN } from '../../services/bookmarks/types'
import { OpenDialogActions } from './panel'
import { useCallback } from 'react'

export function useCustomContextMenuItems(
  currentNode: BTN | undefined,
  openDialogActions: OpenDialogActions,
): (params: GetContextMenuItemsParams<BTN>) => Array<string | MenuItemDef> {
  return useCallback(
    (params: GetContextMenuItemsParams<BTN>): Array<string | MenuItemDef> => {
      // root dir
      if (currentNode?.parentId === undefined) {
        return []
      }

      const highlightedRow = getHighlightedRow(params.api)
      if (highlightedRow === undefined) {
        return []
      }
      const node = params.node
      if (node === null || node.data === undefined || node.id !== highlightedRow.data?.id) {
        return []
      }

      // first row (parent dir)
      if (node.id === currentNode.parentId) {
        return []
      }

      const selectedNodes: BTN[] = params.api.getSelectedRows()

      const focusedRowSelected = selectedNodes.filter(n => n.id === node.id).length === 1

      // multiple nodes
      if (selectedNodes.length > 1) {
        return menuForMultipleSelections(openDialogActions, !focusedRowSelected, selectedNodes)
      }

      if (selectedNodes.length === 1) {
        return menuForSingleSelection(openDialogActions, !focusedRowSelected, selectedNodes[0])
      }

      return menuForSingleSelection(openDialogActions, true, node.data)
    },
    [currentNode, openDialogActions],
  )
}

const menuForMultipleSelections = (
  openDialogActions: OpenDialogActions,
  allDisabled: boolean,
  selectedNodes: BTN[],
): Array<string | MenuItemDef> => {
  const simpleBookmarks = selectedNodes.filter(n => isSimpleBookmark(n))

  // multiple items: Open all (nr), |,  Delete
  return [
    {
      name: `Open all (${simpleBookmarks.length})`,
      disabled: allDisabled || simpleBookmarks.length === 0,
      action: () => openAllInNewTabs(simpleBookmarks.map(b => b.url) as string[]),
    },
    'separator',
    {
      name: 'Delete',
      disabled: allDisabled,
      action: openDialogActions.openDelete,
    },
  ]
}
const menuForSingleSelection = (
  openDialogActions: OpenDialogActions,
  disabled: boolean,
  node: BTN,
): Array<string | MenuItemDef> => {
  // folder        : Rename, Delete
  // bookmark      : Open in new tab, |, Edit, Delete
  return isDirectory(node)
    ? [
        {
          name: 'Rename',
          disabled,
          action: openDialogActions.openEdit,
        },
        {
          name: 'Delete',
          disabled,
          action: openDialogActions.openDelete,
        },
      ]
    : [
        {
          name: 'Open in new tab ',
          disabled,
          action: () => openInNewTab(node.url as string),
        },
        'separator',
        {
          name: 'Edit',
          disabled,
          action: openDialogActions.openEdit,
        },
        {
          name: 'Delete',
          disabled,
          action: openDialogActions.openDelete,
        },
      ]
}

const getHighlightedRow = (api: GridApi): RowNode<BTN> | undefined => {
  const rowIndex = api.getFocusedCell()?.rowIndex
  if (rowIndex === undefined || rowIndex < 0) {
    return undefined
  }
  return api.getModel().getRow(rowIndex)
}
