import { bindings } from 'src/bindings';
import { QuestionService } from 'src/logic/QuestionService';
import { LambdaEvent } from 'src/model/Lambda';

const question = async (event: LambdaEvent) => {
  const service = bindings.get(QuestionService);

  switch (event.httpMethod) {
    case 'GET':
      return await service.getAllUsers();
  }

  throw new Error('unexpected httpMethod');
};

export default question;
