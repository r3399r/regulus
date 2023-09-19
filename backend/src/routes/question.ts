import { bindings } from 'src/bindings';
import { QuestionService } from 'src/logic/QuestionService';
import {
  GetQuestionParams,
  PostQuestionRequest,
  PutQuestionRequest,
} from 'src/model/api';
import { LambdaEvent } from 'src/model/Lambda';

const question = async (event: LambdaEvent) => {
  const service = bindings.get(QuestionService);

  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new Error('missing body');

      return await service.addQuestion(
        JSON.parse(event.body) as PostQuestionRequest
      );
    case 'PUT':
      if (!event.pathParameters) throw new Error('missing pathParameters');
      if (!event.body) throw new Error('missing body');

      return await service.reviseQuestion(
        event.pathParameters.id,
        JSON.parse(event.body) as PutQuestionRequest
      );
    case 'GET':
      return await service.getQuestionList(
        event.queryStringParameters as GetQuestionParams | null
      );
  }

  throw new Error('unexpected httpMethod');
};

export default question;
