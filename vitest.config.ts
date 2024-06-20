import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.unit.test.?(c|m)[jt]s?(x)'],
    globals: true
  },
  plugins: [tsconfigPaths()]
})
