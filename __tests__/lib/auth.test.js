import { authOptions } from '@/lib/auth'

describe('Authentication Service', () => {
  it('should have correct providers configured', () => {
    expect(authOptions.providers).toHaveLength(2)
    expect(authOptions.providers[0].id).toBe('github')
    expect(authOptions.providers[1].id).toBe('google')
  })

  it('should have custom sign-in page', () => {
    expect(authOptions.pages.signIn).toBe('/login')
  })

  it('should use JWT strategy', () => {
    expect(authOptions.session.strategy).toBe('jwt')
  })

  it('should have jwt callback', () => {
    expect(authOptions.callbacks.jwt).toBeDefined()
  })

  it('should have session callback', () => {
    expect(authOptions.callbacks.session).toBeDefined()
  })

  it('should add user id to token in jwt callback', async () => {
    const token = {}
    const user = { id: '123' }
    const result = await authOptions.callbacks.jwt({ token, user })
    expect(result.id).toBe('123')
  })

  it('should add user id to session', async () => {
    const session = { user: {} }
    const token = { id: '456' }
    const result = await authOptions.callbacks.session({ session, token })
    expect(result.user.id).toBe('456')
  })
})