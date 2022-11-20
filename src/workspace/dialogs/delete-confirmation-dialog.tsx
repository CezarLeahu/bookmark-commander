import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { getNode } from '../../bookmarks/queries'
import { BTN } from '../../bookmarks/types'
import { isDirectory } from '../../misc/utils'

const dialogTitleAndMessage = async (nodeIds: string[]): Promise<string> => {
  if (nodeIds.length !== 1) {
    return `Delete ${nodeIds.length} items?`
  }

  const node: BTN = await getNode(nodeIds[0])

  return `Delete the "${node.title}" ${isDirectory(node) ? 'folder' : 'bookmark'}?`
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
  const [message, setMessages] = useState<string>('Delete items?')

  useEffect(() => {
    dialogTitleAndMessage(nodeIds)
      .then(m => setMessages(m))
      .catch(e => console.log(e))
  }, [nodeIds])

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby='dialog-title'>
      <DialogTitle id='dialog-title'>{message}</DialogTitle>
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
