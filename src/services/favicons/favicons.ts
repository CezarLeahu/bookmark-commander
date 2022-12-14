export const getFaviconUrl = (url: string): string => {
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(
    url,
  )}&size=16`
}
export const getFaviconUrlMock = (url: string): string => {
  return './icon.png'
}
