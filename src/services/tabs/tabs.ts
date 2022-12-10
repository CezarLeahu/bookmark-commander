export const openInNewTab = (url: string, switchTo?: boolean): void => {
  chrome.tabs.create({ url, active: switchTo ?? false }).catch(e => console.log(e))
}

export const openAllInNewTabs = (urls: string[]): void => {
  Promise.all(urls.map(async url => await chrome.tabs.create({ url, active: false }))).catch(e =>
    console.log(e),
  )
}

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
