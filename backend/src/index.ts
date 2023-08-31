import { LambdaContext, LambdaEvent } from 'src/model/Lambda';
import { errorOutput, successOutput } from './util/lambdaHelper';
import question from './routes/question';

export const handler = async (event: LambdaEvent, _context?: LambdaContext) => {
  // let db: DbAccess | null = null;
  try {
    console.log(event);
    // db = bindings.get(DbAccess);
    let res: any;

    const category = event.resource.split('/')[2];
    switch (category) {
      case 'question':
        res = await question(event);
        break;
    }

    return successOutput(res);
  } catch (e) {
    console.log(e);

    return errorOutput(e);
  // } finally {
  //   await db?.cleanup();
  }
};
