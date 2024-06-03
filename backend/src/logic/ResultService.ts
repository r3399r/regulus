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
    for (const res of data) {
      const result = new ResultEntity();
      result.questionId = res.questionId.toLowerCase();
      result.userId = res.userId;
      result.score = res.score;
      result.examDate = res.date
        ? new Date(res.date).toISOString()
        : new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

      const question = await this.questionAccess.findOneOrFail({
        where: { id: res.questionId.toLowerCase() },
      });
      question.accumulativeScore = question.accumulativeScore
        ? question.accumulativeScore + res.score
        : res.score;
      const count = question.accumulativeCount
        ? parseInt(question.accumulativeCount) + 1
        : 1;
      question.accumulativeCount = count.toString();

      await this.questionAccess.save(question);
      await this.resultAccess.save(result);
    }
  }
}
