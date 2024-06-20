import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.unit.test.?(c|m)[jt]s?(x)'],
    globals: true
  },
  plugins: [tsconfigPaths()]
})
