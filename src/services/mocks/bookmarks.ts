import { BTN } from '../bookmarks/types'

export interface BookmarkDestinationArg {
  parentId?: string | undefined
  index?: number | undefined
}
export interface BookmarkChangesArg {
  title?: string | undefined
  url?: string | undefined
}

export interface BookmarkCreateArg {
  parentId?: string | undefined
  index?: number | undefined
  title?: string | undefined
  url?: string | undefined
}

const tree: BTN = {
  id: '0',
  title: 'root',
  children: [
    {
      parentId: '0',
      id: '1',
      title: 'Bookmarks bar',
      children: [
        {
          parentId: '1',
          id: '4',
          title: 'Folder A',
        },
        {
          parentId: '1',
          id: '5',
          title: 'Folder B',
        },
        {
          parentId: '1',
          id: '6',
          title: 'Folder C',
        },
        {
          parentId: '1',
          id: '7',
          title: 'Link F',
          url: 'https://link-f',
        },
        {
          parentId: '1',
          id: '8',
          title: 'Link G',
          url: 'https://link-g',
        },
        {
          parentId: '1',
          id: '9',
          title: 'Link H',
          url: 'https://link-h',
        },
      ],
    },
    {
      parentId: '0',
      id: '2',
      title: 'Other bookmarks',
      children: [
        {
          parentId: '2',
          id: '10',
          title: 'Folder D',
        },
        {
          parentId: '2',
          id: '11',
          title: 'Folder E',
        },
        {
          parentId: '2',
          id: '12',
          title: 'Link I',
          url: 'https://link-i',
        },
        {
          parentId: '2',
          id: '13',
          title: 'Link J',
          url: 'https://link-j',
        },
        {
          parentId: '2',
          id: '14',
          title: 'Link K',
          url: 'https://link-k',
        },
        {
          parentId: '2',
          id: '15',
          title: 'Link L',
          url: 'https://link-l',
        },
        {
          parentId: '2',
          id: '16',
          title: 'Link M',
          url: 'https://link-m',
        },
        {
          parentId: '2',
          id: '17',
          title: 'Link N',
          url: 'https://link-n',
        },
        {
          parentId: '2',
          id: '18',
          title: 'Link O',
          url: 'https://link-o',
        },
      ],
    },
    {
      parentId: '0',
      id: '3',
      title: 'Mobile bookmarks',
      children: [],
    },
  ],
}

const buildMap = (): Map<string, BTN> => {
  const map = new Map<string, BTN>([[tree.id, tree]])
  tree.children?.forEach(n => map.set(n.id, n))
  tree.children
    ?.flatMap(n => n.children)
    .filter(n => n !== undefined)
    .forEach(n => n !== undefined && map.set(n.id, n))

  return map
}

const treeElementsMap: Map<string, BTN> = buildMap()

export async function update(id: string, changes: BookmarkChangesArg): Promise<BTN> {
  return { title: 'RandomTitle', id: '1234' }
}

export async function create(bookmark: BookmarkCreateArg): Promise<BTN> {
  return { title: bookmark.title ?? 'New title', id: '4567' }
}

export async function remove(id: string): Promise<void> {
  console.log('Do nothing')
}

export async function move(id: string, destination: BookmarkDestinationArg): Promise<BTN> {
  return {
    title: 'RollingTitle',
    id: '7890',
  }
}

export function get(id: string): Promise<BTN[]>
export async function get(idList: string[]): Promise<BTN[]>
export async function get(ids: string | string[]): Promise<BTN[]> {
  if (Array.isArray(ids)) {
    return ids
      .filter(id => id !== undefined)
      .map(id => treeElementsMap.get(id))
      .filter(e => e !== undefined) as BTN[]
  }
  const node = treeElementsMap.get(ids)
  return node !== undefined ? [node] : []
}

export async function getChildren(id: string): Promise<BTN[]> {
  return treeElementsMap.get(id)?.children ?? []
}
export async function search(query: string): Promise<BTN[]> {
  return [
    {
      id: '111',
      title: 'Rez 111',
    },
    {
      id: '222',
      title: 'Rez 222',
    },
    {
      id: '333',
      title: 'Rez 333',
      url: 'https://rez.333.bla',
    },
    {
      id: '444',
      title: 'Rez 444',
      url: 'https://rez.444.blu/foo/bar',
    },
  ]
}
