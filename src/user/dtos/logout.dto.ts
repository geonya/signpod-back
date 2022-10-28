import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('LogoutInput')
export class LogoutInput extends PickType(User, ['id']) {}

@ObjectType()
export class LogoutOutput extends CoreOutput {}
