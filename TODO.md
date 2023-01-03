# Backlog

- one common method for setting the highlight/selection - for Move/DnD/Dialog result
- actually fix the ('goAway') focus on search cancellation
- remove effects/callbacks on REFs

- Cut & Paste events - in a future version

- [Extension] Check what else is needed to publish the extension
- [Extension] Actually publish the extension
- [Extension] Check if tabs permissions are needed - ask for them anyway

# Normal flow of events

1. API/Mouse/Key triggers
2. onFocusedCell/onSelectionChanged events -> update AG grid + update Redux state
3. onComponentReady -> ensure everything is ok

Also:

- focus()/clearFocus() calls need to be tied to the panel **side** focus (especially the former)
- recheck all 'clearFocus'
- select() calls need to be decoupled from all highlight/focus actions
- move actions (all 3) must _update highlight_
- dnd actions (all 3) must _update highlight_
- check 'useSelectionReset' - check if clear focus is needed as well - since now selection was decoupled from focus
- ensure focused row is also set when selection is changed - if needed
- check if focus needs to be reset after dialogs

## Selection - independent&separate from Focus/Highlight

- Mouse Selection Event
- Key Selection Event
- AG api.setSelection
  - -> onSelectionChanged -> updatePanelState (Redux) -> componenetStateChangedHandler

## Highlight - depends on app side Focus/Highlight

- Mouse Highlight Event
- Key Highlight Event
- AG api.setFocusedCell
  - -> onCellFocused
    1. -> updatePanelState (Redux) -> componenetStateChangedHandler
    2. -> updateAppState (Redux) -> componenetStateChangedHandler
- key events: Up, Down, Left, Right, Backspace, Enter, Delete, F2, Tab
- key events on Dialogs: Escape, Enter, Tab
- key events on Search: Escape, Up, Down, Enter, Escape (while in dropdown list)
- mouse events:
  - select, deselect
  - drag-and-drop same panel, drag-and-drop between panels
  - dnd single element, dnd multiple elements
  - double click on Dir, double click on bookmark
  - M3 on single element (highlighted)
  - M3 on multiple selected elements
  - M3 on element when other elements selected (do nothing)

# TESTS

- check search item "enter"
  - target highlighted and selected
- check DND selection & highlight
- check move buttons selection & highlight
- check focus on new dialogs
- check selection/highlight afer dialog Ok/Cancel

## Done

- fix selection with Space key on large pages (it scrolls to end at the moment)
- handle Ctrl+A key (or command)
- handle F6 key (or command) - Move, add labels

- replace resetSelection... with actual panelRefs calls

- highlight row after edit/create confirmation or cancelation
- highlight nearby row after delete confirmation or same old row on cancelation
- after deletion the focus should go a nearby row

- onMove or on DND between panels lastHighlightId (in the source panel) should be cleared - it no longer exists
- moving of element should result in the element remaining selected
- on Move events: fix Selection, fix Focus, change highlighted panel on move (dnd)
- Replace highlightSide & highlightOtherSide with dispatch(focusSide()) calls

- delete non-empty folders has enabled 'Yes' button

- fix scroll to row on search

- handle case when selection exists, but no highlight - can we use keys - Up/Down

- handle 'Enter' on '..' parent dir (when highlighted)

- consider handling row de-selection (regardless of highlighting) - onClick prevent default?

- remove 'selectHighlightedRow'

- focus input an new Dialog

- [Extension] Redraw extension icon in Paint (as PNG) to avoid any copyright issues

- remove Pair fetching from redux -> it always generates new objects
- add custom hooks for the callbacks that depend on a 'side' arg
- check all useAppSelect for shallowEquals
- maybe join some of the state updates (e.g., the ones in loadPanelContent)

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

- rename gridApi

- add context menu's ("Open in new tab", "Open all in new tab", "Rename", "Edit bookmark...", "Delete...")

- Capture F keys (F2-10)
  - can't easily grab F keys, not a good ideea anyway -> ideea scrapped
