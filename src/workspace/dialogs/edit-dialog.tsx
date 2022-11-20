import { BTN } from '../../bookmarks/types'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import { useState } from 'react'

interface EditDialogProps {
  readonly open: boolean
  readonly node?: BTN
  onConfirm: (node: BTN) => void
  onCancel: () => void
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  node,
  onConfirm,
  onCancel,
}: EditDialogProps) => {
  if (node === undefined) {
    throw new Error('The "node" argument should never be undefined')
  }

  console.log(`EditDialog - id: ${node.id}`)

  const isRegularBookmark = node.url !== undefined && node.url.length > 0 // not a folder (directory)

  const [title, setTitle] = useState<string>(node.title)
  const [validTitle, setValidTitle] = useState<boolean>(true)

  const [url, setUrl] = useState<string | undefined>(node.url)
  const [validUrl, setValidUrl] = useState<boolean>(true)

  const handleTitleValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTitle(e.target.value)
    setValidTitle(isRegularBookmark || e.target.value.length > 0) // folders should have names
  }
  const handleUrlValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setUrl(e.target.value)
    setValidUrl(e.target.value !== undefined && e.target.value.length > 0)
  }

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby='dialog-title'>
      <DialogTitle id='dialog-title'>
        {isRegularBookmark ? 'Edit bookmark' : 'Edit folder'}
      </DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          autoFocus
          margin='dense'
          label='Name'
          type='text'
          fullWidth
          variant='standard'
          value={title}
          onChange={handleTitleValidation}
          error={!validTitle}
        />
        {isRegularBookmark ? (
          <TextField
            id='url'
            margin='dense'
            label='URL'
            type='url'
            fullWidth
            variant='standard'
            value={url}
            onChange={handleUrlValidation}
            required
            error={!validUrl}
          />
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!validTitle || !validUrl}
          onClick={() =>
            onConfirm({
              ...node,
              title,
              url,
            })
          }
        >
          Ok
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
