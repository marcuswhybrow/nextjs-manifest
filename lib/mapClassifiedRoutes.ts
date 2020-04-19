import { ClassifiedRoutes } from './classifyRoutes'
import { Route } from './routes'

export type MapClassifiedRoutesMapArgs<TClient, TSsr> = {
  clientMap: (route: Route) => TClient
  ssrMap: (route: Route) => TSsr
}

export type FinalisedClassification<TClient, TSsr> = {
  static: {
    client: Record<string, TClient>
    ssr: Record<string, TSsr>
  }
  dynamic: {
    client: [RegExp, TClient][]
    ssr: [RegExp, TSsr][]
  }
}

export function finaliseClassification<TClient, TSsr>(
  classifiedRoutes: ClassifiedRoutes,
  mapArgs: MapClassifiedRoutesMapArgs<TClient, TSsr>
): FinalisedClassification<TClient, TSsr>

export function finaliseClassification<TClient, TSsr>(
  classifiedRoutes: ClassifiedRoutes[],
  mapArgs: MapClassifiedRoutesMapArgs<TClient, TSsr>
): FinalisedClassification<TClient, TSsr>[]

export function finaliseClassification<TClient, TSsr>(
  classifiedRoutes: ClassifiedRoutes | ClassifiedRoutes[],
  mapArgs: MapClassifiedRoutesMapArgs<TClient, TSsr>
):
  | FinalisedClassification<TClient, TSsr>
  | FinalisedClassification<TClient, TSsr>[] {
  const isArray = Array.isArray(classifiedRoutes)
  const material = isArray
    ? (classifiedRoutes as ClassifiedRoutes[])
    : ([classifiedRoutes] as ClassifiedRoutes[])
  const results = material.map(
    (routes) =>
      ({
        static: {
          client: routes.static.client.reduce((acc, route) => {
            acc[route.literal] = mapArgs.clientMap(route)
            return acc
          }, {} as Record<string, TClient>),
          ssr: routes.static.ssr.reduce((acc, route) => {
            acc[route.literal] = mapArgs.ssrMap(route)
            return acc
          }, {} as Record<string, TSsr>),
        },
        dynamic: {
          client: routes.dynamic.client.map((route) => [
            route.regExp,
            mapArgs.clientMap(route),
          ]),
          ssr: routes.dynamic.ssr.map((route) => [
            route.regExp,
            mapArgs.ssrMap(route),
          ]),
        },
      } as FinalisedClassification<TClient, TSsr>)
  )
  return isArray ? results : results[0]
}

export default finaliseClassification
