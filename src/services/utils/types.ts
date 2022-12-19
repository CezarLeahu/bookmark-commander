export type Side = 'left' | 'right'

export const other = (side: Side): Side => (side === 'left' ? 'right' : 'left')

export interface Pair<S> {
  left: S
  right: S
}
