import {
  isDynamicRouteLiteral as idr,
  dynamicRouteLiteralToRegexp as drtr,
} from '../lib/routes'

describe('isDynamicRoute', () => {
  it('handles typical static patterns', () => {
    expect(idr('/')).toBe(false)
    expect(idr('/api/function')).toBe(false)
    expect(idr('/about-us')).toBe(false)
    expect(idr('/nested/folders')).toBe(false)
    expect(idr('/nested/folders/with.extentions')).toBe(false)
  })
  it('handles typical dynamic patterns', () => {
    expect(idr('/user/[user]')).toBe(true)
    expect(idr('/gready/[...nomnom]')).toBe(true)
    expect(idr('/gready/[...nomnom]/with/more')).toBe(true)
    expect(idr('/gready/[...nomnom]/with.extensions')).toBe(true)
    expect(idr('/[...catchall]')).toBe(true)
  })
  it('handles a zero length string', () => {
    expect(idr('')).toBe(false)
  })
  it('handles gibberish', () => {
    expect(idr('/8287da1hoij/d82jnd.#//[d][918')).toBe(false)
  })
})

describe('dynamicRouteToRegexp', () => {
  it('handles typical dynamic paths', () => {
    const user = drtr('/user/[user]')
    expect(user.test('/user/marcus')).toBe(true)
    expect(user.test('/user/chris')).toBe(true)
    expect(user.test('/user/chris/more')).toBe(false)

    const more = drtr('/user/[user]/more')
    expect(more.test('/user/marcus')).toBe(false)
    expect(more.test('/user/chris')).toBe(false)
    expect(more.test('/user/chris/more')).toBe(true)

    const greedy = drtr('/proxy/[...greedy]')
    expect(greedy.test('/api')).toBe(false)
    expect(greedy.test('/api/more')).toBe(false)
    expect(greedy.test('/proxy')).toBe(true)
    expect(greedy.test('/proxy/marcus')).toBe(true)
    expect(greedy.test('/proxy/marcus/more')).toBe(true)
    expect(greedy.test('/proxy/chris/more')).toBe(true)
  })
})

describe('dirToRoutes', () => {
  it.todo('generates valid static client routes')
})
