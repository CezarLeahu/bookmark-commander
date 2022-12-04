import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { getNode } from '../../services/bookmarks/queries'
import { isDirectory } from '../../services/utils/utils'

interface EditDialogProps {
  readonly open: boolean
  readonly nodeId?: string
  onConfirm: (node: BTN) => void
  onCancel: () => void
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  nodeId,
  onConfirm,
  onCancel,
}: EditDialogProps) => {
  if (nodeId === undefined) {
    throw new Error('The "nodeId" argument should never be undefined')
  }

  console.log(`EditDialog - id: ${nodeId}`)

  const [node, setNode] = useState<BTN>()
  const [isDir, setIsDir] = useState(false)

  const [title, setTitle] = useState<string>('')
  const [validTitle, setValidTitle] = useState<boolean>(true)
  const [url, setUrl] = useState<string | undefined>()
  const [validUrl, setValidUrl] = useState<boolean>(isDir)

  useEffect(() => {
    getNode(nodeId)
      .then(n => {
        console.log('edit dialog - useEffect - retrieve node from id')
        setNode(n)
        setIsDir(isDirectory(n))
        setTitle(n.title)
        setValidTitle(true)
        setUrl(n.url)
        setValidUrl(n.url === undefined || n.url.length > 0)
      })
      .catch(e => console.log(e))
  }, [nodeId])

  const handleTitleValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTitle(e.target.value)
    setValidTitle(!isDir || e.target.value.length > 0) // folders should have names
  }
  const handleUrlValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setUrl(e.target.value)
    setValidUrl(e.target.value !== undefined && e.target.value.length > 0)
  }

  const handleConfirm = (): void => {
    if (node !== undefined && validTitle && validUrl) {
      onConfirm({ ...node, title, url })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      onKeyDown={e => e.key === 'Enter' && handleConfirm()}
    >
      <DialogTitle id='dialog-title'>{isDir ? 'Edit folder' : 'Edit bookmark'}</DialogTitle>
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
        {!isDir ? (
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
        <Button disabled={node === undefined || !validTitle || !validUrl} onClick={handleConfirm}>
          Ok
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog