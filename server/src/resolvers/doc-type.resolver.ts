import { Query, Resolver, Arg } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { DocType, DocumentType } from '../entities/doc-type.entity';

@Resolver()
export class DocTypeResolver {
  @Query(() => [DocType])
  async getAllDocType(@Arg('typeDoc') typeDoc: string): Promise<DocType[]> {
    switch (typeDoc) {
      case DocumentType.PATIENT:
        return await DocType.find({ where: { type: DocumentType.PATIENT } });
      case DocumentType.APPOINTMENT:
        return await DocType.find({ where: { type: DocumentType.APPOINTMENT } });
    }
    throw new GraphQLError('Document Type incorrect', {
      extensions: {
        code: 'GET_ALL_DOC_TYPE_FAILED',
        originalError: 'Le type de coument demandé est incorrect',
      },
    });
  }
}
