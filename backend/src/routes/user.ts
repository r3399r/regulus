import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { PostUserRequest } from 'src/model/api';
import { LambdaEvent } from 'src/model/Lambda';

export const user = async (event: LambdaEvent) => {
  const service = bindings.get(UserService);

  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new Error('missing body');

      return await service.addUser(JSON.parse(event.body) as PostUserRequest);
  }

  throw new Error('unexpected httpMethod');
};
