import { OAuth2Plugin, defaultGetToken } from 'payload-oauth2'

export const googleOAuth = OAuth2Plugin({
  enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  strategyName: 'google',
  useEmailAsIdentity: true,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  authorizePath: '/oauth/google',
  callbackPath: '/oauth/google/callback',
  authCollection: 'users',
  subFieldName: 'googleId',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  scopes: [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  getUserInfo: async (accessToken: string) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const user = await response.json()

    return {
      email: user.email,
      sub: user.sub,
      googleId: user.sub,
      googleProfileImage: user.picture,
    }
  },
  successRedirect: () => '/admin',
  failureRedirect: () => '/admin/login',
})
