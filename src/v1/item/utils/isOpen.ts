import { Item, Mapped } from 'v1/item'

export const isOpen = ({ _open }: Item | Mapped): boolean => _open
export const isClosed = (entry: Item | Mapped): boolean => !isOpen(entry)
