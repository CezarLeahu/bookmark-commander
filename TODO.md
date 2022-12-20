# Backlog

- remove 'selectHighlightedRow'
- remove 'ensureAtLeastOneRowSelected'

- remove Pair fetching from redux -> it always generates new objects
- add custom hooks for the callbacks that depend on a 'side' arg
- check all useAppSelect for shallowEquals
- maybe join some of the state updates (e.g., the ones in loadPanelContent)

- rename gridApi
- remove effects/callbacks on REFs

- SPLIT FOCUS FROM SELECTION!!!

- fix scroll to row on search

- fix delete

- consider handling row de-selection (regardless of highlighting) - onClick prevent default?

- handle 'Enter' on '..' parent dir (when highlighted)

- handle case when selection exists, but no highlight - can we use keys - Up/Down

- actually fix the ('goAway') focus on search cancelation
- handle Ctrl+A key (or command)

- Copy & Paste events

- [Extension] Redraw extension icon in Paint (as PNG) to avoid any copyright issues
- [Extension] Check what else is needed to publish the extension
- [Extension] Actually publish the extension
- [Extension] Check if tabs permissions are needed - ask for them anyway

# EVENTS

## Create

## Edit

## Delete

## JumpTo (Search)

## OnSelect (panel)

## OnKeyUp (panel)

# TESTS

- check search item "enter"
  - target highlighted and selected
-

## Done

- on empty dirs disable the buttons (when the highlighted row is the parent)

- enable buttons when a row is highlighted, not just when one row is selected

- Handle navigation inside DataGrids

  - events: up, down, Enter, Backspace, Delete, Tab

- handle Delete key
- handle Tab key
- handle Enter key (on single select of Dir row)

- Disable row re-ordering

- Deselect rows after Edit dialog

- add key Up/Down/Enter events on search box and result list

- add scroll to row when searching (on jumpTo action)

- handle cell edit

- fix Select row on searching

- add a panel history (latst 10 locations), handle back&forward - Handle MOUSE4 & MOUSE5 events (back and forward)

- open ALL the selected items on Middle Click

- Handle Drag-n-drop between panels

- Handle Drag-and-drop in the same panel

- Enhance code with 'useCallback' & 'useMemo' hooks - especially on some of the dialogs

- Navigate to bookmark location and select the bookmark entry (in case of actual bookmarks)

- Move functionality

  - Part 1: from current folder to a different one
    - move command
  - Part 2: inside the same folder, but on a different index

  * on both: forceRerender

- New Folder functionality

  - dialog

- Delete functionality

  - yes, add confirmation pop-up, default focus on the 'No' button

- Handle Exit action

  - handle exit: close extension (current) tab

- Embed EditBookmark modal top-level

- Keep track of the current selected panel

  - type Side 'left'|'right'
  - side = useRef<Side>(left)
  - pass callback to children: updateSelectedSide(side) :void { currentSide.current = side }, have the children call this on any DataGrid select

- Use the currently-selected side as the target for opening up _Directory_ search results

## Scrapped

- add context menu's ("Open in new tab", "Open all in new tab", "Rename", "Edit bookmark...", "Delete...")

- Capture F keys (F2-10)
  - can't easily grab F keys, not a good ideea anyway -> ideea scrapped
