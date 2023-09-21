import { LambdaContext, LambdaEvent } from 'src/model/Lambda';
import { DbAccess } from './access/DbAccess';
import { bindings } from './bindings';
import { field } from './routes/field';
import { question, questionId } from './routes/question';
import { user } from './routes/user';
import { errorOutput, successOutput } from './util/lambdaHelper';

export const handler = async (event: LambdaEvent, _context?: LambdaContext) => {
  console.log(event);
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  try {
    let res: any;

    switch (event.resource) {
      case '/api/question':
        res = await question(event);
        break;
      case '/api/question/{id}':
        res = await questionId(event);
        break;
      case '/api/field':
        res = await field(event);
        break;
      case '/api/user':
        res = await user(event);
        break;
    }

    const output = successOutput(res);
    await db.commitTransaction();

    return output;
  } catch (e) {
    console.log(e);
    await db.rollbackTransaction();

    return errorOutput(e);
  } finally {
    await db.cleanup();
  }
};
