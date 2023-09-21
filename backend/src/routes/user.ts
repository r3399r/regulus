import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { PostUserRequest, PutUserRequest } from 'src/model/api';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: UserService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(UserService);

  switch (event.resource) {
    case '/api/user':
      return await defaultUser();
    case '/api/user/{id}':
      return await handleUser();
  }
  throw new BadRequestError('unexpected resource');
};

const defaultUser = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new BadRequestError('body should not be empty');

      return await service.addUser(JSON.parse(event.body) as PostUserRequest);
    case 'GET':
      return await service.getUsers();
  }

  throw new Error('unexpected httpMethod');
};

const handleUser = async () => {
  if (!event.pathParameters) throw new Error('missing pathParameters');

  switch (event.httpMethod) {
    case 'PUT':
      if (!event.body) throw new Error('missing body');

      return await service.updateUser(
        event.pathParameters.id,
        JSON.parse(event.body) as PutUserRequest
      );
    case 'GET':
      return await service.getUserDetail(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
};
