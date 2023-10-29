import { inject, injectable } from 'inversify';
import { QuestionAccess } from 'src/access/QuestionAccess';
import { ResultAccess } from 'src/access/ResultAccess';
import { PostResultRequest } from 'src/model/api';
import { ResultEntity } from 'src/model/entity/ResultEntity';

/**
 * Service class for Result
 */
@injectable()
export class ResultService {
  @inject(ResultAccess)
  private readonly resultAccess!: ResultAccess;

  @inject(QuestionAccess)
  private readonly questionAccess!: QuestionAccess;

  public async addResult(data: PostResultRequest) {
    const result = new ResultEntity();
    result.questionId = data.questionId.toLowerCase();
    result.userId = data.userId;
    result.score = data.score;
    result.examDate = data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString();

    const question = await this.questionAccess.findOneOrFail({
      where: { id: data.questionId.toLowerCase() },
    });
    question.accumulativeScore = question.accumulativeScore
      ? question.accumulativeScore + data.score
      : data.score;
    const count = question.accumulativeCount
      ? parseInt(question.accumulativeCount) + 1
      : 1;
    question.accumulativeCount = count.toString();
    await this.questionAccess.save(question);

    return await this.resultAccess.save(result);
  }
}
