import { v4 as uuid } from 'uuid'
export const generateUniqueFilename = (filename: string): string => {
  // step 1 - scrub filenname to remove spaces
  const trimmedFilename = filename.replace(/\s+/g, `-`)
  const unique = uuid()

  return `${unique}-${trimmedFilename}`
}
