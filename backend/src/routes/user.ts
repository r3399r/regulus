import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { PostUserRequest } from 'src/model/api';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: UserService;

export const user = async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(UserService);

  switch (event.resource) {
    case '/api/user':
      if (!event.body) throw new Error('missing body');

      return await defaultUser();
  }
  throw new BadRequestError('unexpected resource');
};

const defaultUser = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new Error('missing body');

      return await service.addUser(JSON.parse(event.body) as PostUserRequest);
  }

  throw new Error('unexpected httpMethod');
};
