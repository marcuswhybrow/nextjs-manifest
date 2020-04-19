import { resolve as r } from 'path'
import { existsSync as exists } from 'fs'

const NEXT_CONFIG_FILE = 'next.config.js'

export type NextPaths = {
  rootDir: string
  buildDir: string
  buildStaticDir: string
  buildPagesDir: string
  buildManifest: string
  publicDir: string
  staticDir: string
}

export function nextPaths(nextConfigDir: string): NextPaths {
  const rootDir = r(process.cwd(), nextConfigDir)
  const buildDir = ((): string => {
    const configFile = r(rootDir, NEXT_CONFIG_FILE)
    if (!exists(configFile))
      throw new Error(
        `${NEXT_CONFIG_FILE} does not exist in directory ${nextConfigDir}`
      )

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configObj = require(configFile)

    const config =
      typeof configObj === 'function'
        ? configObj('phase-production-build', {})
        : configObj

    if (config.target !== 'serverless')
      throw new Error('"target" must be "serverless" in next.config.js')
    return r(rootDir, config.distDir || '.next')
  })()
  return {
    rootDir,
    buildDir,
    buildStaticDir: r(buildDir, 'static'),
    buildPagesDir: r(buildDir, 'serverless/pages'),
    buildManifest: r(buildDir, 'serverless/pages-manifest.json'),
    publicDir: r(rootDir, 'public'),
    staticDir: r(rootDir, 'static'),
  }
}

export default nextPaths
