import { Field, InputType } from 'type-graphql';
import { UserRole, UserStatus } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field({ nullable: true })
  tel: string;

  @Field()
  gender: string;

  @Field({ nullable: true })
  @Field({ nullable: true })
  activationDate?: string;

  @Field()
  profession: string;

  @Field()
  departementId: number;

  @Field(() => String, { nullable: true })
  role?: UserRole;

  @Field(() => String, { nullable: true })
  status?: UserStatus;
}
