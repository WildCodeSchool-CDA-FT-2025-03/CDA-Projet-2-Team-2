import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Hello } from '../entities/hello.entities';

@Resolver(Hello)
export class HelloResolver {
  @Query(() => [Hello])
  async getHello(): Promise<Hello[]> {
    return await Hello.find();
  }

  @Query(() => Hello, { nullable: true })
  async getHelloById(@Arg('id') id: number): Promise<Hello | null> {
    return await Hello.findOne({ where: { id } });
  }

  @Mutation(() => Hello)
  async createHello(@Arg('message') message: string): Promise<Hello> {
    const hello = new Hello();
    hello.message = message;
    await hello.save();
    return hello;
  }
}
