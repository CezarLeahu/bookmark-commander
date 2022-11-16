interface BookmarkTreeNode {
  children?: BookmarkTreeNode[]
  dateAdded?: number
  dateGroupModified?: number
  id: string
  index?: number
  parentId?: string
  title: string
  unmodifiable?: boolean
  url?: string
}

interface CreateDetails {
  index?: number
  parentId?: string
  title?: string
  url?: string
}

export function bookmarks(): BookmarkTreeNode[] {
  return [
    { id: '0', title: 'Mata', url: 'Masa' },
    { id: '1', title: 'Snow', url: 'Jon' },
    { id: '2', title: 'Lannister', url: 'Cersei' },
    { id: '3', title: 'Lannister', url: 'Jaime' },
    { id: '4', title: 'Stark', url: 'Arya' },
    { id: '5', title: 'Targaryen', url: 'Daenerys' },
    { id: '6', title: 'Melisandre' },
    { id: '7', title: 'Clifford', url: 'Ferrara' },
    { id: '8', title: 'Frances', url: 'Rossini' },
    { id: '9', title: 'Roxie', url: 'Harvey' },

    { id: '10', title: 'Mata', url: 'Masa' },
    { id: '11', title: 'Snow', url: 'Jon' },
    { id: '12', title: 'Lannister', url: 'Cersei' },
    { id: '13', title: 'Lannister', url: 'Jaime' },
    { id: '14', title: 'Stark', url: 'Arya' },
    { id: '15', title: 'Targaryen', url: 'Daenerys' },
    { id: '16', title: 'Melisandre' },
    { id: '17', title: 'Clifford', url: 'Ferrara' },
    { id: '18', title: 'Frances', url: 'Rossini' },
    { id: '19', title: 'Roxie', url: 'Harvey' },

    { id: '20', title: 'Mata', url: 'Masa' },
    { id: '21', title: 'Snow', url: 'Jon' },
    { id: '22', title: 'Lannister', url: 'Cersei' },
    { id: '23', title: 'Lannister', url: 'Jaime' },
    { id: '24', title: 'Stark', url: 'Arya' },
    { id: '25', title: 'Targaryen', url: 'Daenerys' },
    { id: '26', title: 'Melisandre' },
    { id: '27', title: 'Clifford', url: 'Ferrara' },
    { id: '28', title: 'Frances', url: 'Rossini' },
    { id: '29', title: 'Roxie', url: 'Harvey' },

    { id: '30', title: 'Mata', url: 'Masa' },
    { id: '31', title: 'Snow', url: 'Jon' },
    { id: '32', title: 'Lannister', url: 'Cersei' },
    { id: '33', title: 'Lannister', url: 'Jaime' },
    { id: '34', title: 'Stark', url: 'Arya' },
    { id: '35', title: 'Targaryen', url: 'Daenerys' },
    { id: '36', title: 'Melisandre' },
    { id: '37', title: 'Clifford', url: 'Ferrara' },
    { id: '38', title: 'Frances', url: 'Rossini' },
    { id: '39', title: 'Roxie', url: 'Harvey' },

    { id: '40', title: 'Mata', url: 'Masa' },
    { id: '41', title: 'Snow', url: 'Jon' },
    { id: '42', title: 'Lannister', url: 'Cersei' },
    { id: '43', title: 'Lannister', url: 'Jaime' },
    { id: '44', title: 'Stark', url: 'Arya' },
    { id: '45', title: 'Targaryen', url: 'Daenerys' },
    { id: '46', title: 'Melisandre' },
    { id: '47', title: 'Clifford', url: 'Ferrara' },
    { id: '48', title: 'Frances', url: 'Rossini' },
    { id: '49', title: 'Roxie', url: 'Harvey' },

    { id: '60', title: 'Mata', url: 'Masa' },
    { id: '61', title: 'Snow', url: 'Jon' },
    { id: '62', title: 'Lannister', url: 'Cersei' },
    { id: '63', title: 'Lannister', url: 'Jaime' },
    { id: '64', title: 'Stark', url: 'Arya' },
    { id: '65', title: 'Targaryen', url: 'Daenerys' },
    { id: '66', title: 'Melisandre' },
    { id: '67', title: 'Clifford', url: 'Ferrara' },
    { id: '68', title: 'Frances', url: 'Rossini' },
    { id: '69', title: 'Roxie', url: 'Harvey' },

    { id: '70', title: 'Mata', url: 'Masa' },
    { id: '71', title: 'Snow', url: 'Jon' },
    { id: '72', title: 'Lannister', url: 'Cersei' },
    { id: '73', title: 'Lannister', url: 'Jaime' },
    { id: '74', title: 'Stark', url: 'Arya' },
    { id: '75', title: 'Targaryen', url: 'Daenerys' },
    { id: '76', title: 'Melisandre' },
    { id: '77', title: 'Clifford', url: 'Ferrara' },
    { id: '78', title: 'Frances', url: 'Rossini' },
    { id: '79', title: 'Roxie', url: 'Harvey' },

    { id: '80', title: 'Mata', url: 'Masa' },
    { id: '81', title: 'Snow', url: 'Jon' },
    { id: '82', title: 'Lannister', url: 'Cersei' },
    { id: '83', title: 'Lannister', url: 'Jaime' },
    { id: '84', title: 'Stark', url: 'Arya' },
    { id: '85', title: 'Targaryen', url: 'Daenerys' },
    { id: '86', title: 'Melisandre' },
    { id: '87', title: 'Clifford', url: 'Ferrara' },
    { id: '88', title: 'Frances', url: 'Rossini' },
    { id: '89', title: 'Roxie', url: 'Harvey' },

    { id: '90', title: 'Mata', url: 'Masa' },
    { id: '91', title: 'Snow', url: 'Jon' },
    { id: '92', title: 'Lannister', url: 'Cersei' },
    { id: '93', title: 'Lannister', url: 'Jaime' },
    { id: '94', title: 'Stark', url: 'Arya' },
    { id: '95', title: 'Targaryen', url: 'Daenerys' },
    { id: '96', title: 'Melisandre' },
    { id: '97', title: 'Clifford', url: 'Ferrara' },
    { id: '98', title: 'Frances', url: 'Rossini' },
    { id: '99', title: 'Roxie', url: 'Harvey' },

    { id: '100', title: 'Mata', url: 'Masa' },
    { id: '101', title: 'Snow', url: 'Jon' },
    { id: '102', title: 'Lannister', url: 'Cersei' },
    { id: '103', title: 'Lannister', url: 'Jaime' },
    { id: '104', title: 'Stark', url: 'Arya' },
    { id: '105', title: 'Targaryen', url: 'Daenerys' },
    { id: '106', title: 'Melisandre' },
    { id: '107', title: 'Clifford', url: 'Ferrara' },
    { id: '108', title: 'Frances', url: 'Rossini' },
    { id: '109', title: 'Roxie', url: 'Harvey' },

    { id: '110', title: 'Mata', url: 'Masa' },
    { id: '111', title: 'Snow', url: 'Jon' },
    { id: '112', title: 'Lannister', url: 'Cersei' },
    { id: '113', title: 'Lannister', url: 'Jaime' },
    { id: '114', title: 'Stark', url: 'Arya' },
    { id: '115', title: 'Targaryen', url: 'Daenerys' },
    { id: '116', title: 'Melisandre' },
    { id: '117', title: 'Clifford', url: 'Ferrara' },
    { id: '118', title: 'Frances', url: 'Rossini' },
    { id: '119', title: 'Roxie', url: 'Harvey' },

    { id: '120', title: 'Mata', url: 'Masa' },
    { id: '121', title: 'Snow', url: 'Jon' },
    { id: '122', title: 'Lannister', url: 'Cersei' },
    { id: '123', title: 'Lannister', url: 'Jaime' },
    { id: '124', title: 'Stark', url: 'Arya' },
    { id: '125', title: 'Targaryen', url: 'Daenerys' },
    { id: '126', title: 'Melisandre' },
    { id: '127', title: 'Clifford', url: 'Ferrara' },
    { id: '128', title: 'Frances', url: 'Rossini' },
    { id: '129', title: 'Roxie', url: 'Harvey' },

    { id: '130', title: 'Mata', url: 'Masa' },
    { id: '131', title: 'Snow', url: 'Jon' },
    { id: '132', title: 'Lannister', url: 'Cersei' },
    { id: '133', title: 'Lannister', url: 'Jaime' },
    { id: '134', title: 'Stark', url: 'Arya' },
    { id: '135', title: 'Targaryen', url: 'Daenerys' },
    { id: '136', title: 'Melisandre' },
    { id: '137', title: 'Clifford', url: 'Ferrara' },
    { id: '138', title: 'Frances', url: 'Rossini' },
    { id: '139', title: 'Roxie', url: 'Harvey' },

    { id: '140', title: 'Mata', url: 'Masa' },
    { id: '141', title: 'Snow', url: 'Jon' },
    { id: '142', title: 'Lannister', url: 'Cersei' },
    { id: '143', title: 'Lannister', url: 'Jaime' },
    { id: '144', title: 'Stark', url: 'Arya' },
    { id: '145', title: 'Targaryen', url: 'Daenerys' },
    { id: '146', title: 'Melisandre' },
    { id: '147', title: 'Clifford', url: 'Ferrara' },
    { id: '148', title: 'Frances', url: 'Rossini' },
    { id: '149', title: 'Roxie', url: 'Harvey' },

    { id: '150', title: 'Mata', url: 'Masa' },
    { id: '151', title: 'Snow', url: 'Jon' },
    { id: '152', title: 'Lannister', url: 'Cersei' },
    { id: '153', title: 'Lannister', url: 'Jaime' },
    { id: '154', title: 'Stark', url: 'Arya' },
    { id: '155', title: 'Targaryen', url: 'Daenerys' },
    { id: '156', title: 'Melisandre' },
    { id: '157', title: 'Clifford', url: 'Ferrara' },
    { id: '158', title: 'Frances', url: 'Rossini' },
    { id: '159', title: 'Roxie', url: 'Harvey' },

    { id: '160', title: 'Mata', url: 'Masa' },
    { id: '161', title: 'Snow', url: 'Jon' },
    { id: '162', title: 'Lannister', url: 'Cersei' },
    { id: '163', title: 'Lannister', url: 'Jaime' },
    { id: '164', title: 'Stark', url: 'Arya' },
    { id: '165', title: 'Targaryen', url: 'Daenerys' },
    { id: '166', title: 'Melisandre' },
    { id: '167', title: 'Clifford', url: 'Ferrara' },
    { id: '168', title: 'Frances', url: 'Rossini' },
    { id: '169', title: 'Roxie', url: 'Harvey' },
  ]
}

export function path(node: BookmarkTreeNode): BookmarkTreeNode[] {
  return [
    { id: '164', title: 'Stark', url: 'Arya' },
    { id: '165', title: 'Targaryen', url: 'Daenerys' },
    { id: '166', title: 'Melisandre' },
    { id: '167', title: 'Clifford', url: 'Ferrara' },
  ]
}

export function breadcrumbs(): [BookmarkTreeNode[], BookmarkTreeNode] {
  return [
    [
      { id: '164', title: 'Stark', url: 'Arya' },
      { id: '165', title: 'Targaryen', url: 'Daenerys' },
      { id: '166', title: 'Melisandre' },
    ],
    { id: '167', title: 'Clifford', url: 'Ferrara' },
  ]
}

export function mainLocations(): BookmarkTreeNode[] {
  return [
    { id: '165', title: 'Bookmark menu', url: 'TODO' },
    { id: '166', title: 'Other bookmarks', url: 'TODO' },
  ]
}
