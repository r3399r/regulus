import { Container } from 'inversify';
import 'reflect-metadata';
import { CategoryAccess } from './access/CategoryAccess';
import { ChapterAccess } from './access/ChapterAccess';
import { DbAccess } from './access/DbAccess';
import { QuestionAccess } from './access/QuestionAccess';
import { QuestionService } from './logic/QuestionService';
import { CategoryEntity } from './model/entity/CategoryEntity';
import { ChapterEntity } from './model/entity/ChapterEntity';
import { QuestionEntity } from './model/entity/QuestionEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(QuestionEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(CategoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ChapterEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<QuestionAccess>(QuestionAccess).toSelf();
container.bind<CategoryAccess>(CategoryAccess).toSelf();
container.bind<ChapterAccess>(ChapterAccess).toSelf();

// service
container.bind<QuestionService>(QuestionService).toSelf();

export { container as bindings };
