import {  injectable } from 'inversify';
import { GetQuestionResponse } from 'src/model/api';

/**
 * Service class for Question
 */
@injectable()
export class QuestionService {
  // @inject(UserAccess)
  // private readonly userAccess!: UserAccess;

  public async getAllUsers(): Promise<GetQuestionResponse> {
    return {}
  }
}
