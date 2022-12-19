import { Breadcrumbs, Link, Typography } from '@mui/material'
import { selectBreadcrumbs, selectNode, updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { Side } from '../../services/utils/types'
import { shallowEqual } from 'react-redux'

export interface BreadcrumbsProps {
  readonly side: Side
}

const BreadcrumbsFC: React.FC<{ side: Side }> = ({ side }: BreadcrumbsProps) => {
  const dispatch = useAppDispatch()
  const currentNode = useAppSelector(state => selectNode(state, side), shallowEqual)
  const breadcrumbs = useAppSelector(state => selectBreadcrumbs(state, side), shallowEqual)

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {breadcrumbs.map(d => (
        <Link key={d.id} onClick={() => dispatch(updateNodeId({ side, id: d.id }))}>
          {d.title}
        </Link>
      ))}
      <Typography color='text.primary'>{currentNode?.title}</Typography>
    </Breadcrumbs>
  )
}

export default BreadcrumbsFC
