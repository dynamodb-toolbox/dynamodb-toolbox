import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.unit.test.?(c|m)[jt]s?(x)'],
    globals: true
  },
  resolve: {
    alias: {
      v1: path.resolve(__dirname, 'src', 'v1')
    }
  }
})
