import { Route } from './routes'

/**
 * Partions routes by prefix, returning [default, prefix1, prefix2, ...].
 */
export const partitionRoutes = (
  routes: Route[],
  ...partitions: string[]
): Route[][] => {
  return routes.reduce(
    (acc, route) => {
      const pID = partitions.findIndex((prefix) =>
        route.literal.startsWith(prefix)
      )
      acc[pID >= 0 ? pID + 1 : 0].push(route)
      return acc
    },
    [[], ...partitions.map(() => [])] as Route[][]
  )
}

export default partitionRoutes
