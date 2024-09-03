import tsconfigPaths from 'vite-tsconfig-paths'
// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.unit.test.?(c|m)[jt]s?(x)'],
    globals: true
  },
  plugins: [tsconfigPaths()]
})
