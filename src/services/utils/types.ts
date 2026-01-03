export type Side = 'left' | 'right'

export const other = (side: Side | undefined): Side =>
  side === 'left' || side === undefined ? 'right' : 'left'

export interface Pair<S> {
  left: S
  right: S
}
