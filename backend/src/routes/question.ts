import { bindings } from 'src/bindings';
import { QuestionService } from 'src/logic/QuestionService';
import { PostQuestionRequest } from 'src/model/api';
import { LambdaEvent } from 'src/model/Lambda';

const question = async (event: LambdaEvent) => {
  const service = bindings.get(QuestionService);

  switch (event.httpMethod) {
    case 'POST':
      if (!event.body) throw new Error('missing body');

      return await service.addQuestion(
        JSON.parse(event.body) as PostQuestionRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

export default question;
