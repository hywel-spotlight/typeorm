import { Inject } from '@nestjs/common';
import { Connection, DataSourceOptions } from 'typeorm';
import { EntityClassOrSchema } from '../interfaces/entity-class-or-schema.type';
import { DEFAULT_CONNECTION_NAME } from '../typeorm.constants';
import {
  getConnectionToken,
  getEntityManagerToken,
  getRepositoryToken,
} from './typeorm.utils';

export const InjectRepository = (
  entity: EntityClassOrSchema,
  connection: string = DEFAULT_CONNECTION_NAME,
): ReturnType<typeof Inject> => Inject(getRepositoryToken(entity, connection));

export const InjectConnection: (
  connection?: Connection | DataSourceOptions | string,
) => ReturnType<typeof Inject> = (
  connection?: Connection | DataSourceOptions | string,
) => Inject(getConnectionToken(connection));

export const InjectEntityManager: (
  connection?: Connection | DataSourceOptions | string,
) => ReturnType<typeof Inject> = (
  connection?: Connection | DataSourceOptions | string,
) => Inject(getEntityManagerToken(connection));
