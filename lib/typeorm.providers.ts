import { Provider } from '@nestjs/common';
import {
  AbstractRepository,
  Connection,
  DataSourceOptions,
  getMetadataArgsStorage,
  Repository,
} from 'typeorm';
import { getConnectionToken, getRepositoryToken } from './common/typeorm.utils';
import { EntityClassOrSchema } from './interfaces/entity-class-or-schema.type';

export function createTypeOrmProviders(
  entities?: EntityClassOrSchema[],
  connection?: Connection | DataSourceOptions | string,
): Provider[] {
  return (entities || []).map((entity) => ({
    provide: getRepositoryToken(entity, connection),
    useFactory: (connection: Connection) => {
      if (
        entity instanceof Function &&
        (entity.prototype instanceof Repository ||
          entity.prototype instanceof AbstractRepository)
      ) {
        return connection.getCustomRepository(entity);
      }

      return connection.options.type === 'mongodb'
        ? connection.getMongoRepository(entity)
        : connection.getRepository(entity);
    },
    inject: [getConnectionToken(connection)],
    /**
     * Extra property to workaround dynamic modules serialisation issue
     * that occurs when "TypeOrm#forFeature()" method is called with the same number
     * of arguments and all entities share the same class names.
     */
    targetEntitySchema: getMetadataArgsStorage().tables.find(
      (item) => item.target === entity,
    ),
  }));
}
