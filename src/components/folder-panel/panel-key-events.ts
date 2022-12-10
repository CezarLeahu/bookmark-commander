import { SuppressHeaderKeyboardEventParams, SuppressKeyboardEventParams } from 'ag-grid-community'

export function suppressHeaderKeys(params: SuppressHeaderKeyboardEventParams): boolean {
  return true
}

const KEY_ENTER = 'Enter'
const KEY_PAGE_UP = 'PageUp'
const KEY_PAGE_DOWN = 'PageDown'
const KEY_TAB = 'Tab'
const KEY_LEFT = 'ArrowLeft'
const KEY_UP = 'ArrowUp'
const KEY_RIGHT = 'ArrowRight'
const KEY_DOWN = 'ArrowDown'
const KEY_F2 = 'F2'
const KEY_BACKSPACE = 'Backspace'
const KEY_ESCAPE = 'Escape'
const KEY_SPACE = ' '
const KEY_DELETE = 'Delete'
const KEY_PAGE_HOME = 'Home'
const KEY_PAGE_END = 'End'

const KeysToPermit = new Set<string>([
  KEY_ENTER,
  KEY_PAGE_UP,
  KEY_PAGE_DOWN,
  KEY_TAB,
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN,
  KEY_F2,
  KEY_BACKSPACE,
  KEY_ESCAPE,
  KEY_SPACE,
  KEY_DELETE,
  KEY_PAGE_HOME,
  KEY_PAGE_END,
])

export function suppressKeys(params: SuppressKeyboardEventParams): boolean {
  const key = params.event.key
  return !KeysToPermit.has(key)
}
