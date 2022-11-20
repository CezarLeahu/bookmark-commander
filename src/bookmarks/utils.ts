import { BTN } from './types'

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
