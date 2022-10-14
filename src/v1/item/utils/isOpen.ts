import { Item, MapAttribute } from 'v1/item'

export const isOpen = ({ _open }: Item | MapAttribute): boolean => _open
export const isClosed = (entry: Item | MapAttribute): boolean => !isOpen(entry)
