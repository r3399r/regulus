import { inject, injectable } from 'inversify';
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

  public async addResult(data: PostResultRequest) {
    const result = new ResultEntity();
    result.questionId = data.questionId.toLowerCase();
    result.userId = data.userId;
    result.score = data.score;

    return await this.resultAccess.save(result);
  }
}
