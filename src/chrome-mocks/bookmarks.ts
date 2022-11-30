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
  return [
    {
      id: '11111',
      title: 'Bookmark 11111',
    },
    {
      id: '22222',
      title: 'Bookmark 22222',
    },
  ]
}

export async function getChildren(id: string): Promise<BTN[]> {
  return [
    {
      id: '00',
      title: 'Child 000',
    },
    {
      id: '11',
      title: 'Child 111',
    },
    {
      id: '22',
      title: 'Child 222',
    },
    {
      id: '33',
      title: 'Child 333',
      url: 'https://333.to',
    },
    {
      id: '44',
      title: 'Child 444',
      url: 'https://444.to',
    },
    {
      id: '55',
      title: 'Child 555',
      url: 'https://555.to',
    },
    {
      id: '66',
      title: 'Child 666',
      url: 'https://666.to',
    },
    {
      id: '77',
      title: 'Child 777',
      url: 'https://777.to',
    },
  ]
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