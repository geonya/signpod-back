import { FileUpload } from 'graphql-upload-minimal'

export const checkFileSize = (
  createReadStream: FileUpload['createReadStream'],
  maxSize: number,
) => {
  return new Promise((resolves, rejects) => {
    let filesize = 0
    const stream = createReadStream()
    stream.on('data', (chunk) => {
      filesize += chunk.length
      if (filesize > maxSize) {
        rejects(filesize)
      }
    })
    stream.on('end', () => resolves(filesize))
    stream.on('error', rejects)
  })
}
