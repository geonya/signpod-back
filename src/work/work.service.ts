import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FileUpload } from 'graphql-upload-minimal'
import { Repository } from 'typeorm'
import { checkFileSize } from '../libs/files/check-filesize'
import { generateUniqueFilename } from '../libs/files/generate-unique-filename'
import { StorageService } from '../storage/storage.service'
import { User } from '../user/entities/user.entity'
import { CreateWorkInput, CreateWorkOutput } from './dtos/create-work.dto'
import { Work } from './entities/work.entity'

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly works: Repository<Work>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  async createWork(
    creator: User,
    { title, description }: CreateWorkInput,
    files: Promise<FileUpload>[],
  ): Promise<CreateWorkOutput> {
    try {
      files.map(async (file) => {
        const { createReadStream, filename } = await file
        const uniqueFilename = generateUniqueFilename(filename)
        await this.storageService.upload(createReadStream, uniqueFilename)
        // await this.works.save(work)
      })
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
      }
    }
  }
}
