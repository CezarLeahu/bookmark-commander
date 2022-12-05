import { BTN } from '../bookmarks/types'

export const isDirectory = (node: BTN): boolean => node.url === undefined

export const isSimpleBookmark = (node: BTN): boolean => node.url !== undefined

export const closeCurrentTab = (): void => {
  chrome.tabs
    .query({ currentWindow: true, active: true })
    .then(tabs => {
      const tabId = tabs[0].id
      if (tabId !== undefined) {
        chrome.tabs.remove(tabId).catch(e => console.log(e))
      }
    })
    .catch(e => console.log(e))
}

export const isNonEmptyDirectory = (node: BTN): boolean => {
  return containsNonEmptyDirectories([node])
}

export const containsNonEmptyDirectories = (nodes: BTN[]): boolean => {
  return (
    nodes.find(e => e.url === undefined && e.children !== undefined && e.children.length > 0) !==
    undefined
  )
}

export const getFaviconUrl = (url: string): string => {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(
    url,
  )}&size=16`
}
