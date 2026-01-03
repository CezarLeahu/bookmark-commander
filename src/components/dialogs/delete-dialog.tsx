import * as keys from '../../services/utils/keys'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { containsNonEmptyDirectories, isDirectory } from '../../services/bookmarks/utils'

import { BTN } from '../../services/bookmarks/types'
import { Side } from '../../services/utils/types'
import { getNodesWithImmediateChildren } from '../../services/bookmarks/queries'
import { useKeyDownCallback } from './dialog-keys'
import { useSelectSelectionIds } from '../../store/panel-state-hooks'

const dialogTitleAndMessage = (nodes: BTN[], nonEmptyDirs: boolean): [string, string] => {
  if (nodes.length !== 1) {
    return [
      'Delete items?',
      nonEmptyDirs
        ? 'The selected items contain non-empty folders!'
        : `Delete ${nodes.length} items?`,
    ]
  }

  const node: BTN = nodes[0]
  if (isDirectory(node)) {
    return [
      'Delete folder?',
      nonEmptyDirs
        ? `The "${node.title}" folder is not empty!`
        : `Delete the "${node.title}" folder?`,
    ]
  }
  return ['Delete bookmark?', `Delete the "${node.title}" bookmark?`]
}

interface DeleteConfirmationDialogProps {
  readonly open: boolean
  readonly side: Side
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  side,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  if (side === undefined) {
    throw new Error('The "side" argument should never be undefined')
  }

  const [[title, message], setMessages] = useState<[string, string]>([
    'Delete items?',
    'Delete items?',
  ])
  const [nonEmptyDirs, setNonEmptyDirs] = useState<boolean>(false)

  const nodeIds = useSelectSelectionIds(side)

  useEffect(() => {
    getNodesWithImmediateChildren(nodeIds)
      .then(nodes => {
        const hasEmptyDirs = containsNonEmptyDirectories(nodes)
        setMessages(dialogTitleAndMessage(nodes, hasEmptyDirs))
        setNonEmptyDirs(hasEmptyDirs)
      })
      .catch(e => console.log(e))
  }, [nodeIds])

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key !== keys.ENTER || nonEmptyDirs) {
        return
      }
      e.stopPropagation()

      onConfirm()
    },
    [onConfirm, nonEmptyDirs],
  )
  const handleKeyDown = useKeyDownCallback()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      aria-describedby='dialog-description'
      onKeyUpCapture={handleKeyUp}
      onKeyDownCapture={handleKeyDown}
    >
      <DialogTitle id='dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='dialog-description'>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} autoFocus={!nonEmptyDirs} disabled={nonEmptyDirs}>
          Yes
        </Button>
        <Button onClick={onCancel} autoFocus={nonEmptyDirs}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
