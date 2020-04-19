import { nextPaths, NextPaths } from '../lib/nextPaths'
import { resolve as r } from 'path'
import fs from 'fs'

jest.mock('fs')
jest.mock(
  '/app/next.config.js',
  () => (): {} => ({
    target: 'serverless',
    distDir: 'build',
  }),
  {
    virtual: true,
  }
)

describe('nextPaths from a function based next.config.js', () => {
  it('derives the correct paths', async () => {
    ;(fs.existsSync as jest.Mock).mockReturnValue(true)
    expect(nextPaths('/app')).toStrictEqual({
      rootDir: r('/app'),
      buildDir: r('/app/build'),
      buildManifest: r('/app/build/serverless/pages-manifest.json'),
      buildPagesDir: r('/app/build/serverless/pages'),
      buildStaticDir: r('/app/build/static'),
      publicDir: r('/app/public'),
      staticDir: r('/app/static'),
    } as NextPaths)
  })
})
