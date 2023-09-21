import { LambdaContext, LambdaEvent } from 'src/model/Lambda';
import { DbAccess } from './access/DbAccess';
import { bindings } from './bindings';
import { field } from './routes/field';
import { question } from './routes/question';
import { user } from './routes/user';
import { errorOutput, successOutput } from './util/lambdaHelper';

export const handler = async (event: LambdaEvent, _context?: LambdaContext) => {
  console.log(event);
  const db = bindings.get(DbAccess);
  await db.startTransaction();
  try {
    let res: any;

    const resource = event.resource.split('/')[2];
    switch (resource) {
      case 'question':
        res = await question(event);
        break;
      case 'field':
        res = await field(event);
        break;
      case 'user':
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
