import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { type FileUpload, GraphQLUpload } from 'graphql-upload-minimal'
import { AuthUser } from '../auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateWorkInput, CreateWorkOutput } from './dtos/create-work.dto'
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
}
