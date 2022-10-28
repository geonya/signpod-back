import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileUpload } from 'graphql-upload-minimal'

import { Repository } from 'typeorm'
import { generateUniqueFilename } from '../libs/files/generate-unique-filename'
import { Photo } from '../photo/entities/photo.entity'
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
    @InjectRepository(Photo)
    private readonly photos: Repository<Photo>,
    private readonly storageService: StorageService,
  ) {}

  async createWork(
    creator: User,
    { title, description, category }: CreateWorkInput,
    files: Promise<FileUpload>[],
  ): Promise<CreateWorkOutput> {
    try {
      console.log('hi')
      console.log(files)
      const work = this.works.create({ title, description, category })
      work.creator = creator
      const fileUrlList: string[] = []
      if (files.length > 0) {
        files.map(async (file) => {
          const { createReadStream, filename } = await file
          const uniqueFilename = generateUniqueFilename(filename)
          const fileUrl = await this.storageService.upload(
            createReadStream,
            'photos/' + uniqueFilename,
          )
          if (typeof fileUrl === 'string') {
            fileUrlList.push(fileUrl)
            const photo = this.photos.create({ url: fileUrl })
            photo.work = work
            await this.photos.save(photo)
          }
        })
      }
      await this.works.save(work)
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
