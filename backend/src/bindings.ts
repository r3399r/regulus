import { S3 } from 'aws-sdk';
import { Container } from 'inversify';
import 'reflect-metadata';
import { CategoryAccess } from './access/CategoryAccess';
import { ChapterAccess } from './access/ChapterAccess';
import { DbAccess } from './access/DbAccess';
import { QuestionAccess } from './access/QuestionAccess';
import { TagAccess } from './access/TagAccess';
import { UserAccess } from './access/UserAccess';
import { FieldService } from './logic/FieldService';
import { QuestionService } from './logic/QuestionService';
import { UserService } from './logic/UserService';
import { CategoryEntity } from './model/entity/CategoryEntity';
import { ChapterEntity } from './model/entity/ChapterEntity';
import { QuestionCategoryEntity } from './model/entity/QuestionCategoryEntity';
import { QuestionChapterEntity } from './model/entity/QuestionChapterEntity';
import { QuestionEntity } from './model/entity/QuestionEntity';
import { TagEntity } from './model/entity/TagEntity';
import { UserEntity } from './model/entity/UserEntity';
import { AwsUtil } from './util/AwsUtil';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();
container.bind<AwsUtil>(AwsUtil).toSelf();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(QuestionEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(CategoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ChapterEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TagEntity);
container
  .bind<Function>(dbEntitiesBindingId)
  .toFunction(QuestionCategoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(QuestionChapterEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(UserEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<QuestionAccess>(QuestionAccess).toSelf();
container.bind<CategoryAccess>(CategoryAccess).toSelf();
container.bind<ChapterAccess>(ChapterAccess).toSelf();
container.bind<TagAccess>(TagAccess).toSelf();
container.bind<UserAccess>(UserAccess).toSelf();

// service
container.bind<QuestionService>(QuestionService).toSelf();
container.bind<FieldService>(FieldService).toSelf();
container.bind<UserService>(UserService).toSelf();

// AWS
container.bind<S3>(S3).toDynamicValue(() => new S3());

export { container as bindings };
