import { defineConfig as Config } from 'vitest/config'

export default Config({
  test: {
    include: ['test/*.test.ts'],
  },
})
