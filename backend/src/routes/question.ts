import { bindings } from 'src/bindings';
import { QuestionService } from 'src/logic/QuestionService';
import {
  GetQuestionParams,
  PostQuestionRequest,
  PutQuestionRequest,
} from 'src/model/api';
import { LambdaEvent } from 'src/model/Lambda';

export const question = async (event: LambdaEvent) => {
  const service = bindings.get(QuestionService);

  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new Error('missing body');

      return await service.addQuestion(
        JSON.parse(event.body) as PostQuestionRequest
      );
    case 'GET':
      return await service.getQuestionList(
        event.queryStringParameters as GetQuestionParams | null
      );
  }

  throw new Error('unexpected httpMethod');
};

export const questionId = async (event: LambdaEvent) => {
  const service = bindings.get(QuestionService);
  if (!event.pathParameters) throw new Error('missing pathParameters');

  switch (event.httpMethod) {
    case 'PUT':
      if (!event.body) throw new Error('missing body');

      return await service.reviseQuestion(
        event.pathParameters.id,
        JSON.parse(event.body) as PutQuestionRequest
      );
  }

  throw new Error('unexpected httpMethod');
};
