import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useSelectBreadcrumbs, useSelectNode } from '../../store/panel-state-hooks'

import { Side } from '../../services/utils/types'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'

export interface BreadcrumbsProps {
  readonly side: Side
}

const BreadcrumbsFC: React.FC<{ side: Side }> = ({ side }: BreadcrumbsProps) => {
  const dispatch = useAppDispatch()
  const currentNode = useSelectNode(side)
  const breadcrumbs = useSelectBreadcrumbs(side)

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
