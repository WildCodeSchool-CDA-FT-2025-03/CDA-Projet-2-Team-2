import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;
}
