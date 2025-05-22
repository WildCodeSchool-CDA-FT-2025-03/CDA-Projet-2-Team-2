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

  @Field()
  departementId: number;

  @Field(() => String, { nullable: true })
  role?: UserRole;

  @Field(() => String, { nullable: true })
  status?: UserStatus;
}

// Faut-il garder ???

@InputType()
export class GetUserByMailInput {
  @Field()
  email: string;
}
