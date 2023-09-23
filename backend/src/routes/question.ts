import { bindings } from 'src/bindings';
import { QuestionService } from 'src/logic/QuestionService';
import {
  GetQuestionParams,
  PostQuestionRequest,
  PutQuestionRequest,
} from 'src/model/api';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: QuestionService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(QuestionService);

  switch (event.resource) {
    case '/api/question':
      return await defaultQuestion();
    case '/api/question/{id}':
      if (!event.pathParameters) throw new Error('missing pathParameters');

      return await handleQuestion();
  }
  throw new BadRequestError('unexpected resource');
};

const defaultQuestion = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new BadRequestError('body should not be empty');

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

const handleQuestion = async () => {
  if (!event.pathParameters) throw new Error('missing pathParameters');

  switch (event.httpMethod) {
    case 'PUT':
      if (!event.body) throw new Error('missing body');

      return await service.updateQuestion(
        event.pathParameters.id,
        JSON.parse(event.body) as PutQuestionRequest
      );
  }
  throw new Error('unexpected httpMethod');
};
