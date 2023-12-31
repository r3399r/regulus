import { bindings } from 'src/bindings';
import { FieldService } from 'src/logic/FieldService';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: FieldService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(FieldService);

  switch (event.resource) {
    case '/api/field':
      return await defaultField();
    case '/api/field/tag':
      return await getTagList();
  }
  throw new BadRequestError('unexpected resource');
};

const defaultField = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getAllFields();
  }

  throw new Error('unexpected httpMethod');
};

const getTagList = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getTagByQuery(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};
