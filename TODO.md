* [App] Keep track of the current selected panel
  - type Side 'left'|'right'
  - side = useRef<Side>(left)
  - pass callback to children: updateSelectedSide(side) :void { currentSide.current  = side }, have the children call this on any DataGrid select

* [App] Capture keys (F2-10)

* [App] Embed RenameBookmark modal top-level
  - ...

* [App] Allow in-line renaming
  - editable flag re-enabled for the title field
  - action&/focus for rename
  - handle key (F2)
  - handle edit on Submmit/Enter
  + forceRerender ? (probably not be needed here)

* [App] Move functionality
  - Part 1: from current folder to a different one
    - move command
    - handle key (F3)
  - Part 2: inside the same folder, but on a different index
  + on both: forceRerender

* [App - Search] Use the currently-selected side as the target for opening up *Directory* search results 
* [App - Search] Navigate to bookmark location and select the bookmark entry (in case of actual bookmarks)

* [App] New Folder functionality

* [App] Delete functionality
  - yes, add confirmation pop-up, default focus on the 'No' button
  - handle key (F8)

* [App] Handle Exit action
  - handle exit: close extension (current) tab
  - handle key (F10)

* [App] Copy Functionality
  - implement this last 
  - handle key (F5)

* [Extension] Check if tabs permissions are needed
* [Extension] Redraw extension icon in Paint (as PNG) to avoid any copyright issues
* [Extension] Check what else is needed to publish the extension
* [Extension] Actually publish the extension
