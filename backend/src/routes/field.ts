import { bindings } from 'src/bindings';
import { FieldService } from 'src/logic/FieldService';
import { LambdaEvent } from 'src/model/Lambda';

export const field = async (event: LambdaEvent) => {
  const service = bindings.get(FieldService);

  switch (event.httpMethod) {
    case 'GET':
      return await service.getAllFields();
  }

  throw new Error('unexpected httpMethod');
};
