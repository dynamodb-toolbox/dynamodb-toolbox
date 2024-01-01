import type { Extension } from 'v1/schema'

export type HasExtension<EXTENSION extends Extension> = [EXTENSION] extends [never] ? false : true
