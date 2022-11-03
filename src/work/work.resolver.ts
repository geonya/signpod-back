import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'
import { AuthUser } from '../auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateWorkInput, CreateWorkOutput } from './dtos/create-work.dto'
import { GetWorksOutput } from './dtos/get-works.dto'
import { Work } from './entities/work.entity'
import { WorkService } from './work.service'

@Resolver((of) => Work)
export class WorkResolver {
  constructor(private readonly workService: WorkService) {}
  @Mutation((returns) => CreateWorkOutput)
  async createWork(
    @AuthUser() creator: User,
    @Args('input') createWorkInput: CreateWorkInput,
    @Args('files', { type: () => [GraphQLUpload], nullable: true })
    files: Promise<FileUpload>[],
  ): Promise<CreateWorkOutput> {
    return this.workService.createWork(creator, createWorkInput, files)
  }

  @Query((returns) => GetWorksOutput)
  async getWorks(): Promise<GetWorksOutput> {
    return this.workService.getWorks()
  }
}
