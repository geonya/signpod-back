import { Inject, Injectable } from '@nestjs/common'
import { StorageFile } from './storage-file'
import StorageConfig from './storage-config'
import { Bucket, DownloadResponse, Storage } from '@google-cloud/storage'
import { ConfigType } from '@nestjs/config'
import storageConfig from './storage-config'
import { FileUpload } from 'graphql-upload-minimal'

@Injectable()
export class StorageService {
  private storage: Storage
  private bucket: Bucket

  constructor(
    @Inject(storageConfig.KEY) private config: ConfigType<typeof storageConfig>,
  ) {
    this.storage = new Storage({
      projectId: config.projectId,
      credentials: {
        client_email: config.clientEmail,
        private_key: config.privateKey,
      },
    })

    this.bucket = this.storage.bucket(config.bucketId)
  }

  async upload(
    createReadStream: FileUpload['createReadStream'],
    filename: string,
  ) {
    return new Promise((resolves, rejects) =>
      createReadStream()
        .pipe(
          this.bucket.file(filename).createWriteStream({
            resumable: false,
            gzip: true,
          }),
        )
        .on('error', (err: any) => rejects(err))
        .on('finish', () =>
          resolves(
            `https://storage.cloud.google.com/${this.config.bucketId}/${filename}`,
          ),
        ),
    )
  }

  async delete(path: string) {
    await this.bucket.file(path).delete({ ignoreNotFound: true })
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.bucket
      .file(path)
      .download()
    const [buffer] = fileResponse
    const storageFile = new StorageFile()
    storageFile.buffer = buffer
    storageFile.metadata = new Map<string, string>()
    return storageFile
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.bucket.file(path).getMetadata()
    const fileResponse: DownloadResponse = await this.bucket
      .file(path)
      .download()
    const [buffer] = fileResponse

    const storageFile = new StorageFile()
    storageFile.buffer = buffer
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}),
    )
    storageFile.contentType = storageFile.metadata.get('contentType')
    return storageFile
  }
}
