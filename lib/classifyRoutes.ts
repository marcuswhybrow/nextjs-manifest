import { Route } from './routes'

export type Classification<TClient, TSsr> = {
  static: {
    client: TClient[]
    ssr: TSsr[]
  }
  dynamic: {
    client: TClient[]
    ssr: TSsr[]
  }
}

export type ClassifiedRoutes = Classification<Route, Route>

export const classifyRoutes = (routes: Route[]): ClassifiedRoutes =>
  routes.reduce(
    (acc, route) => {
      const routeType = route.regExp ? 'dynamic' : 'static'
      const fileType = route.ssr ? 'ssr' : 'client'
      acc[routeType][fileType].push(route)
      return acc
    },
    {
      static: {
        client: [],
        ssr: [],
      },
      dynamic: {
        client: [],
        ssr: [],
      },
    } as ClassifiedRoutes
  )

export default classifyRoutes
