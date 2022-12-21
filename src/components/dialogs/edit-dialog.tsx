import * as keys from '../../services/utils/keys'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { KeyboardEvent, useCallback, useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { getNode } from '../../services/bookmarks/queries'
import { isDirectory } from '../../services/bookmarks/utils'
import { useKeyDownCallback } from './dialog-keys'

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
  const [url, setUrl] = useState<string>('')
  const [validUrl, setValidUrl] = useState<boolean>(isDir)

  useEffect(() => {
    getNode(nodeId)
      .then(n => {
        console.log('edit dialog - useEffect - retrieve node from id')
        setNode(n)
        setIsDir(isDirectory(n))
        setTitle(n.title)
        setValidTitle(true)
        setUrl(n.url ?? '')
        setValidUrl(isDirectory(n) || (n.url !== undefined && n.url.length > 0))
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

  const handleConfirm = useCallback((): void => {
    if (node !== undefined && validTitle && validUrl) {
      onConfirm({ ...node, title, url: isDir ? undefined : url })
    }
  }, [onConfirm, isDir, node, title, url, validTitle, validUrl])

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key !== keys.ENTER) {
        return
      }
      e.stopPropagation()

      handleConfirm()
    },
    [handleConfirm],
  )
  const handleKeyDown = useKeyDownCallback()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      onKeyUpCapture={handleKeyUp}
      onKeyDownCapture={handleKeyDown}
    >
      <DialogTitle id='dialog-title'>{isDir ? 'Edit folder' : 'Edit bookmark'}</DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          autoFocus
          inputRef={input => input?.focus()}
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
