import { bindings } from 'src/bindings';
import { ResultService } from 'src/logic/ResultService';
import { PostResultRequest } from 'src/model/api';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: ResultService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(ResultService);

  switch (event.resource) {
    case '/api/result':
      return await defaultResult();
  }
  throw new BadRequestError('unexpected resource');
};

const defaultResult = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new BadRequestError('body should not be empty');

      return await service.addResult(
        JSON.parse(event.body) as PostResultRequest
      );
  }

  throw new Error('unexpected httpMethod');
};
