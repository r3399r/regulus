import { Container } from 'inversify';
import 'reflect-metadata';
import { QuestionService } from './logic/QuestionService';

const container: Container = new Container();

// container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
// container.bind<Function>(dbEntitiesBindingId).toFunction(UserEntity);
// container.bind<Function>(dbEntitiesBindingId).toFunction(LogEntity);
// container.bind<Function>(dbEntitiesBindingId).toFunction(MessageEntity);

// db access for tables
// container.bind<DbAccess>(DbAccess).toSelf();
// container.bind<UserAccess>(UserAccess).toSelf();
// container.bind<LogAccess>(LogAccess).toSelf();
// container.bind<MessageAccess>(MessageAccess).toSelf();

// service
container.bind<QuestionService>(QuestionService).toSelf();

export { container as bindings };
