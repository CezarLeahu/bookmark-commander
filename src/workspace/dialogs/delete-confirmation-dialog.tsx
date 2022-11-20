import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getNode } from '../../bookmarks/queries'
import { BTN } from '../../bookmarks/types'
import { isDirectory } from '../../misc/utils'

const dialogTitleAndMessage = async (nodeIds: string[]): Promise<[string, string]> => {
  if (nodeIds.length !== 1) {
    return ['Delete items?', `Delete ${nodeIds.length} items?`]
  }

  const node: BTN = await getNode(nodeIds[0])

  if (isDirectory(node)) {
    return ['Delete folder?', `Delete the "${node.title}" folder?`]
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

  useEffect(() => {
    dialogTitleAndMessage(nodeIds)
      .then(([t, m]) => setMessages([t, m]))
      .catch(e => console.log(e))
  }, [nodeIds])

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      aria-describedby='dialog-description'
    >
      <DialogTitle id='dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='dialog-description'>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onCancel} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
