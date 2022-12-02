import { RowDragLeaveEvent, RowDragMoveEvent, RowHighlightPosition } from 'ag-grid-community'
import { BTN } from '../bookmarks/types'

export const isDirectory = (node: BTN): boolean => node.url === undefined

export const isSimpleBookmark = (node: BTN): boolean => node.url !== undefined

export const closeCurrentTab = (): void => {
  chrome.tabs
    .query({ currentWindow: true, active: true })
    .then(tabs => {
      const tabId = tabs[0].id
      if (tabId !== undefined) {
        chrome.tabs.remove(tabId).catch(e => console.log(e))
      }
    })
    .catch(e => console.log(e))
}

export const isNonEmptyDirectory = (node: BTN): boolean => {
  return containsNonEmptyDirectories([node])
}

export const containsNonEmptyDirectories = (nodes: BTN[]): boolean => {
  return (
    nodes.find(e => e.url === undefined && e.children !== undefined && e.children.length > 0) !==
    undefined
  )
}

export interface DnDMoveInfo {
  highlightedRowIndex: number
  position: RowHighlightPosition | null
}

export const moveInfo = (
  e: RowDragMoveEvent<BTN>,
  totalRowCount: number,
): DnDMoveInfo | undefined => {
  if (totalRowCount <= 0) {
    return undefined
  }
  if (e.overIndex === 0) {
    return {
      highlightedRowIndex: 0,
      position: RowHighlightPosition.Below,
    }
  }
  if (e.overIndex < 0) {
    return {
      highlightedRowIndex: totalRowCount - 1,
      position: RowHighlightPosition.Below,
    }
  }

  return {
    highlightedRowIndex: e.overIndex,
    position: rowHighlightPosition(e),
  }
}

const rowHighlightPosition = (e: RowDragMoveEvent<BTN>): RowHighlightPosition | null => {
  const rowHeight = e.overNode?.rowHeight ?? undefined
  if (rowHeight === undefined) {
    return null
  }

  const bookmarkNode = e.overNode?.data ?? undefined
  if (bookmarkNode === undefined) {
    return null
  }

  const pixelPositionInRow = e.y % rowHeight
  if (isSimpleBookmark(bookmarkNode)) {
    return pixelPositionInRow < rowHeight / 2
      ? RowHighlightPosition.Above
      : RowHighlightPosition.Below
  }

  // else, if Directory:

  if (pixelPositionInRow < rowHeight / 4) {
    return RowHighlightPosition.Above
  }
  if (pixelPositionInRow > (rowHeight / 4) * 3) {
    return RowHighlightPosition.Below
  }
  return null
}

interface DndDropInfo {
  isDir: boolean
  index?: number
}

export const dropInfo = (
  e: RowDragLeaveEvent<BTN>,
  totalRowCount: number,
): DndDropInfo | undefined => {
  if (totalRowCount <= 0) {
    return undefined
  }
  if (e.overIndex === 0) {
    return {
      isDir: false,
      index: 1,
    }
  }
  if (e.overIndex < 0) {
    return {
      isDir: false,
      index: totalRowCount,
    }
  }

  const rowHeight = e.overNode?.rowHeight ?? undefined
  if (rowHeight === undefined) {
    return undefined
  }

  const bookmarkNode = e.overNode?.data ?? undefined
  if (bookmarkNode === undefined) {
    return undefined
  }

  const pixelPositionInRow = e.y % rowHeight
  if (isSimpleBookmark(bookmarkNode)) {
    return {
      isDir: false,
      index: pixelPositionInRow < rowHeight / 2 ? e.overIndex : e.overIndex + 1,
    }
  }

  // else, if Directory:

  if (pixelPositionInRow < rowHeight / 4) {
    return {
      isDir: false,
      index: e.overIndex,
    }
  }
  if (pixelPositionInRow > (rowHeight / 4) * 3) {
    return {
      isDir: false,
      index: e.overIndex + 1,
    }
  }
  return {
    isDir: true,
  }
}
