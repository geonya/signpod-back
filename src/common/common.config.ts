export const cookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? '.signpod.app' : 'localhost',
  secure: process.env.NODE_ENV === 'production' ? true : false,
  path: '/',
}
