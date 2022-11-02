import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('EditAccountInput')
export class EditAccountInput extends PartialType(
  PickType(User, ['id', 'email', 'password', 'name', 'company']),
) {}

@ObjectType()
export class EditAccountOutput extends CoreOutput {}
