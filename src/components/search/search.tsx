import * as keys from '../../services/utils/keys'

import {
  Box,
  ClickAwayListener,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popper,
} from '@mui/material'
import React, { ChangeEvent, FocusEvent, KeyboardEvent, useCallback, useRef, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import SearchIcon from '@mui/icons-material/Search'
import { getFaviconUrl } from '../../services/favicons/favicons'
import { isDirectory } from '../../services/bookmarks/utils'
import { search } from '../../services/bookmarks/commands'
import { useJumpToParent } from '../app/app-content'

export interface SearchProps {
  goAway: () => void
}

const Search: React.FC<SearchProps> = ({ goAway }: SearchProps) => {
  const [open, setOpen] = useState(false)
  const inputBoxEl = useRef<HTMLElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)
  const resultListEl = useRef<HTMLUListElement>(null)

  const sid = open ? 'search-popper' : undefined

  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<BTN[]>([])
  const focusedIndex = useRef<number>(-1)

  const jumpToParent = useJumpToParent()

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value)
    handleSearch(event.target.value)
  }

  const handleGoAway = useCallback((): void => {
    setOpen(false)
    setSearchValue('')
    setSearchResults([])
    goAway()
  }, [goAway])

  const handleOnKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      switch (event.key) {
        case keys.ESCAPE: {
          handleGoAway()
          break
        }
        case keys.DOWN: {
          if (
            searchResults.length === 0 ||
            resultListEl.current === undefined ||
            resultListEl.current === null
          ) {
            break
          }
          const list = resultListEl.current
          if (list.firstElementChild !== null && list.firstElementChild instanceof HTMLLIElement) {
            list.firstElementChild.focus()
            focusedIndex.current = 0
          }
          break
        }
      }
    },
    [searchResults, handleGoAway],
  )

  const focusLiElement = useCallback((index: number): HTMLLIElement | undefined => {
    if (index < 0 || index - 1 > (resultListEl.current?.childElementCount ?? 0)) {
      return
    }
    const child = resultListEl.current?.children[index]
    if (child === undefined || child === null || !(child instanceof HTMLLIElement)) {
      return
    }
    child.focus()
  }, [])

  const handleSearch = useCallback((val: string): void => {
    if (val.length < 3) {
      setOpen(false)
      return
    }
    search(val)
      .then(res => {
        setSearchResults(res)
        setOpen(res.length > 0)
      })
      .catch(e => console.log(e))
  }, [])

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => handleSearch(event.target.value),
    [handleSearch],
  )

  const handleClose = useCallback((): void => {
    setOpen(false)
    setSearchResults([])
  }, [])

  const handleJumpTo = useCallback(
    (node: BTN): void => {
      setOpen(false)
      setSearchResults([])
      jumpToParent(node)
    },
    [jumpToParent],
  )

  const handleListOnKeyUp = useCallback(
    (event: KeyboardEvent): void => {
      switch (event.key) {
        case keys.ESCAPE: {
          handleGoAway()
          break
        }
        case keys.DOWN: {
          if (focusedIndex.current + 1 < searchResults.length) {
            focusedIndex.current++
          }
          break
        }
        case keys.UP: {
          if (focusedIndex.current >= 0) {
            focusedIndex.current--
          }
          break
        }
        case keys.ENTER: {
          handleJumpTo(searchResults[focusedIndex.current])
          break
        }
      }
      if (focusedIndex.current < 0) {
        inputEl.current?.focus()
      } else {
        focusLiElement(focusedIndex.current)
      }
    },
    [focusLiElement, handleGoAway, handleJumpTo, searchResults],
  )

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='standard' aria-describedby=''>
          <InputLabel htmlFor='search-bookkmarks'>Search bookmarks</InputLabel>
          <Input
            aria-describedby={sid}
            type='text'
            ref={inputBoxEl}
            inputRef={inputEl}
            onChange={handleChange}
            onKeyUp={handleOnKeyUp}
            onFocus={handleFocus}
            value={searchValue}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <Popper
          id={sid}
          open={open}
          placement='bottom-start'
          sx={{
            position: 'absolute',
            top: 28,
            right: 0,
            left: 0,
            zIndex: 1,
            border: '1px solid',
            p: 1,
            bgcolor: 'background.paper',
            width: '100%',
          }}
          anchorEl={inputBoxEl.current}
          disablePortal={true}
          modifiers={[
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: 'viewport',
                padding: 8,
              },
            },
          ]}
        >
          <Box minWidth='sm' width='sm' maxWidth='sm' maxHeight='sm'>
            <Grid item xs={12} md={6}>
              <List
                ref={resultListEl}
                sx={{
                  width: '100%',
                  maxWidth: '50ch',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 800,
                  '& ul': { padding: 0 },
                }}
              >
                {searchResults.map((node, i) => (
                  <ListItem
                    key={node.id}
                    tabIndex={i}
                    onKeyUp={handleListOnKeyUp}
                    onClick={() => handleJumpTo(node)}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      {isDirectory(node) ? (
                        <FolderIcon
                          fontSize='small'
                          sx={{ verticalAlign: 'middle', outerHeight: '16' }}
                        />
                      ) : (
                        <img
                          src={getFaviconUrl(node.url ?? '')}
                          height='16'
                          style={{ verticalAlign: 'middle', paddingLeft: '2px' }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={node.title} secondary={node.url ?? null} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default Search
