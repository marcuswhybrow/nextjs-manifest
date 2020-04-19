import nextPaths from '../lib/nextPaths'
import { readFileSync, existsSync } from 'fs'
import { relative, resolve } from 'path'
import {
  Route,
  isDynamicRouteLiteral,
  dynamicRouteLiteralToRegexp,
  dirToRoutes,
} from '../lib/routes'
import { getSortedRoutes } from '../lib/sortedRoutes'

export function manifest(nextConfigDir: string): Route[] {
  const paths = nextPaths(nextConfigDir)

  if (!existsSync(paths.buildManifest))
    throw new Error(`Bad build. Could not find ${paths.buildManifest}`)

  const nextManifest: Record<string, string> = JSON.parse(
    readFileSync(paths.buildManifest, 'utf8')
  )
  const routeLiteralMap = Object.entries(nextManifest).reduce(
    (acc, [routeLiteral, buildFilePath]) => {
      const relFilePath = relative('pages', buildFilePath)
      const absFilePath = resolve(paths.buildPagesDir, relFilePath)
      if (!existsSync(absFilePath)) return acc
      acc[routeLiteral] = {
        literal: routeLiteral,
        regExp: isDynamicRouteLiteral(routeLiteral)
          ? dynamicRouteLiteralToRegexp(routeLiteral)
          : undefined,
        ssr: buildFilePath.endsWith('.js'),
        file: {
          absPath: absFilePath,
          relPath: relFilePath,
        },
      }
      return acc
    },
    {} as Record<string, Route>
  )

  const routes = getSortedRoutes(Object.keys(routeLiteralMap)).map<Route>(
    (routeLiteral) => routeLiteralMap[routeLiteral]
  )

  return [
    ...routes,
    ...dirToRoutes(paths.publicDir),
    ...dirToRoutes(paths.staticDir, 'static'),
    ...dirToRoutes(paths.buildStaticDir, '_next/static'),
  ]
}

export default manifest

// const { routes, dynamicRoutes, ssrRoutes } = manifest('../app')

// const [defaultRoutes, apiRoutes] = routes.reduce(
//   (acc, route) => {
//     acc[route[0].startsWith('/api') ? 1 : 0] = route
//     return acc
//   },
//   [{}, {}]
// )

// const [clientEpitomes, ssrEpitomes] = routes.reduce(
//   (acc, [route, file, relPath]) => {
//     if (route in ssrRoutes) {
//       // provision lambda
//       const fn = new aws.lambda.Function(/* ... */)
//       acc[1][route] = fn.name
//     } else {
//       // provision S3 object
//       acc[0][route] = relPath
//     }
//     return acc
//   },
//   [{}, {}]
// )

// const [staticClientRoutes, dynamicClientRoutes, staticSsrRoutes, dynamicSsrRoutes] =

// for (const route of allRoutes.withDynamicAssets().asHash()) {
// }

// defaultRoutes.asRouter()
// apiRoutes.asRouter()

// const apiRoutes = allRoutes.whichStartWith('/api').withADynamicAsset()
// const staticAssets = m.routes({ asset = 'static' })
