import { pathToRegexp } from 'path-to-regexp'
import { existsSync as exists } from 'fs'

import { join, relative } from 'path'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export type Route = {
  literal: string
  regExp?: RegExp
  ssr: boolean
  file: {
    absPath: string
    relPath: string
  }
}

const regExp = /\/\[[^\/]+?\](?=\/|$)/

export const isDynamicRouteLiteral = (route: string): boolean =>
  regExp.test(route)

export const dynamicRouteLiteralToRegexp = (route: string): RegExp =>
  pathToRegexp(
    route.replace(/\[\.\.\.(.*)]$/, ':$1*').replace(/\[(.*?)]/g, ':$1')
  )

function* getFiles(dir: string): Generator<string> {
  const files = readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const filePath = resolve(dir, file.name)
    if (file.isDirectory()) yield* getFiles(filePath)
    else yield filePath
  }
}

export function* dirToRoutes(dir: string, prefix = ''): Generator<Route> {
  if (exists(dir)) {
    for (const absFilePath of getFiles(dir)) {
      const relFilePath = join(prefix, relative(dir, absFilePath))
      yield {
        literal: `/${relFilePath}`,
        regExp: undefined,
        ssr: false,
        file: {
          absPath: absFilePath,
          relPath: relFilePath,
        },
      }
    }
  }
}
