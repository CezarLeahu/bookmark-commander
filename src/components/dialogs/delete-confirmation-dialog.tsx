import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { containsNonEmptyDirectories, isDirectory } from '../../services/utils/utils'
import { useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { getNodesWithImmediateChildren } from '../../services/bookmarks/queries'

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
  readonly nodeIds: string[]
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  nodeIds,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  const [[title, message], setMessages] = useState<[string, string]>([
    'Delete items?',
    'Delete items?',
  ])
  const [nonEmptyDirs, setNonEmptyDirs] = useState<boolean>(false)

  useEffect(() => {
    getNodesWithImmediateChildren(nodeIds)
      .then(nodes => {
        const hasEmptyDirs = containsNonEmptyDirectories(nodes)
        setMessages(dialogTitleAndMessage(nodes, hasEmptyDirs))
        setNonEmptyDirs(hasEmptyDirs)
      })
      .catch(e => console.log(e))
  }, [nodeIds])

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      aria-describedby='dialog-description'
      onKeyDown={e => {
        if (e.key === 'Enter' && !nonEmptyDirs) {
          onConfirm()
        }
      }}
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