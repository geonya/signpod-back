import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
  ) {}

  async createWork(
    creator: User,
    createWorkInput: CreateWorkInput,
  ): Promise<CreateWorkOutput> {
    try {
      const work = this.works.create(createWorkInput)
      work.creator = creator
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
