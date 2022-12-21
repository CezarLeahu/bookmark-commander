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
      parentId: '1',
      id: '7',
      title: 'Link F',
      url: 'https://link-f',
    },
    {
      id: '1',
      title: 'Rez 1',
    },
    {
      id: '2',
      title: 'Rez 2',
    },
    {
      id: '3',
      title: 'Rez 3',
      url: 'https://rez.link.bla',
    },
    {
      id: '4',
      title: 'Rez 4',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '5',
      title: 'Rez 5',
      url: 'https://rez.link.bla',
    },
    {
      id: '6',
      title: 'Rez 6',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '8',
      title: 'Rez 8',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '9',
      title: 'Rez 9',
      url: 'https://rez.link.bla',
    },
    {
      id: '10',
      title: 'Rez 10',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '11',
      title: 'Rez 11',
    },
    {
      id: '12',
      title: 'Rez 12',
    },
    {
      id: '13',
      title: 'Rez 13',
      url: 'https://rez.link.bla',
    },
    {
      id: '14',
      title: 'Rez 14',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '15',
      title: 'Rez 15',
      url: 'https://rez.link.bla',
    },
    {
      id: '16',
      title: 'Rez 16',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '17',
      title: 'Rez 17',
      url: 'https://rez.link.bla',
    },
    {
      id: '18',
      title: 'Rez 18',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '19',
      title: 'Rez 19',
      url: 'https://rez.link.bla',
    },
    {
      id: '20',
      title: 'Rez 20',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '21',
      title: 'Rez 21',
    },
    {
      id: '22',
      title: 'Rez 22',
    },
    {
      id: '23',
      title: 'Rez 23',
      url: 'https://rez.link.bla',
    },
    {
      id: '24',
      title: 'Rez 24',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '25',
      title: 'Rez 25',
      url: 'https://rez.link.bla',
    },
    {
      id: '26',
      title: 'Rez 26',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '27',
      title: 'Rez 27',
      url: 'https://rez.link.bla',
    },
    {
      id: '28',
      title: 'Rez 28',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '29',
      title: 'Rez 29',
      url: 'https://rez.link.bla',
    },
    {
      id: '30',
      title: 'Rez 30',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '40',
      title: 'Rez 40',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '41',
      title: 'Rez 41',
    },
    {
      id: '42',
      title: 'Rez 42',
    },
    {
      id: '43',
      title: 'Rez 43',
      url: 'https://rez.link.bla',
    },
    {
      id: '44',
      title: 'Rez 44',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '45',
      title: 'Rez 45',
      url: 'https://rez.link.bla',
    },
    {
      id: '46',
      title: 'Rez 46',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '47',
      title: 'Rez 47',
      url: 'https://rez.link.bla',
    },
    {
      id: '48',
      title: 'Rez 48',
      url: 'https://rez.link.blu/foo/bar',
    },
    {
      id: '49',
      title: 'Rez 49',
      url: 'https://rez.link.bla',
    },
  ]
}
