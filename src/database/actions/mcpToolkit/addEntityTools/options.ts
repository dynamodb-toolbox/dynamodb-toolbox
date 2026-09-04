import type { AddToolsOptions } from '../options.js'

/**
 * Options for entity MCP tools, adding the database table key to `AddToolsOptions`.
 */
export interface AddEntityToolsOptions extends AddToolsOptions {
  dbTableKey: string
}
