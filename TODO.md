# Backlog

- Handle Drag-n-drop between panels

- Copy & Paste events

- Handle navigation inside DataGrids
  - events: up, down, Enter, Backspace, Delete, Tab

- Deselect rows after Edit dialog

- Handle row re-ordering

  - it's available in the mui pro version
  - we might need to re-implement everything... (from the base table & all)

- Handle MOUSE4 & MOUSE5 events (back and forward)
  - need to add history

- Allow in-line renaming - POSTPONED till MUI gets new functionality

  - editable flag re-enabled for the title field
  - action&/focus for rename
  - handle edit on Submmit/Enter

  * forceRerender ? (probably not be needed here)

- [Extension] Check if tabs permissions are needed
- [Extension] Redraw extension icon in Paint (as PNG) to avoid any copyright issues
- [Extension] Check what else is needed to publish the extension
- [Extension] Actually publish the extension

## Done
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

## Scrapped

- Use the currently-selected side as the target for opening up _Directory_ search results

- Capture keys (F2-10)
  - can't easily grab F keys, not a good ideea anyway -> ideea scrapped

- Copy Functionality - Ah, skip this one

  - implement this last

