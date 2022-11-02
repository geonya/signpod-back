import { DOMAIN } from './common.constants'

export const cookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
  secure: process.env.NODE_ENV === 'production' ? true : false,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}
