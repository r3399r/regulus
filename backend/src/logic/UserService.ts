import BN from 'bignumber.js';
import { differenceInCalendarDays } from 'date-fns';
import { inject, injectable } from 'inversify';
import { ResultAccess } from 'src/access/ResultAccess';
import { UserAccess } from 'src/access/UserAccess';
import {
  GetUserIdResponse,
  GetUserResponse,
  PostUserRequest,
  PutUserRequest,
} from 'src/model/api';
import { Result } from 'src/model/entity/ResultEntity';
import { UserEntity } from 'src/model/entity/UserEntity';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

/**
 * Service class for User
 */
@injectable()
export class UserService {
  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ResultAccess)
  private readonly resultAccess!: ResultAccess;

  public async addUser(data: PostUserRequest) {
    const user = new UserEntity();
    user.name = data.name;
    user.email = data.email;
    user.birthday = data.birthday;
    user.memo = data.memo;

    return await this.userAccess.save(user);
  }

  public async updateUser(id: string, data: PutUserRequest) {
    const user = await this.userAccess.findOneOrFail({ where: { id } });
    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.birthday = data.birthday ?? user.birthday;
    user.memo = data.memo ?? user.memo;

    return await this.userAccess.save(user);
  }

  public async getUsers(): Promise<GetUserResponse> {
    return await this.userAccess.find({ order: { updatedAt: 'desc' } });
  }

  public async getUserDetail(id: string): Promise<GetUserIdResponse> {
    const r = 0.96;

    const [user, results] = await Promise.all([
      this.userAccess.findOneOrFail({ where: { id } }),
      this.resultAccess.find({
        where: { userId: id },
        order: { examDate: 'desc' },
      }),
    ]);

    // aggregate data by examDate
    const scoreDateMap = results.reduce((acc, cur) => {
      const date = new Date(cur.examDate);
      const key = date.toISOString();
      if (acc[key] === undefined) {
        const diff = differenceInCalendarDays(new Date(), new Date(date));
        const weight = bn(r).pow(diff);
        acc[key] = { date, weight, result: [] };
      }
      acc[key].result.push(cur);

      return acc;
    }, {} as { [key: string]: { date: Date; weight: BN; result: Result[] } });

    const scoreDate = Object.values(scoreDateMap).sort(compare('date'));

    const tsResult = [];
    const caScore = [];
    const chScore = [];
    for (const sd of scoreDate) {
      for (const res of sd.result) {
        for (const category of res.question.categories) {
          const idx = caScore.findIndex((v) => v.name === category.name);
          if (idx < 0)
            caScore.push({
              name: category.name,
              sum: bn(res.score).times(sd.weight),
              weight: bn(sd.weight),
            });
          else {
            caScore[idx].sum = bn(res.score)
              .times(sd.weight)
              .plus(caScore[idx].sum);
            caScore[idx].weight = caScore[idx].weight.plus(sd.weight);
          }
        }
        for (const chapter of res.question.chapters) {
          const idx = chScore.findIndex((v) => v.name === chapter.name);
          if (idx < 0)
            chScore.push({
              name: chapter.name,
              sum: bn(res.score).times(sd.weight),
              weight: bn(sd.weight),
            });
          else {
            chScore[idx].sum = bn(res.score)
              .times(sd.weight)
              .plus(chScore[idx].sum);
            chScore[idx].weight = chScore[idx].weight.plus(sd.weight);
          }
        }
      }

      tsResult.push({
        date: sd.date.toISOString(),
        category: caScore
          .map((v) => ({ name: v.name, score: v.sum.div(v.weight).toNumber() }))
          .sort(compare('name')),
        chapter: chScore
          .map((v) => ({ name: v.name, score: v.sum.div(v.weight).toNumber() }))
          .sort(compare('name')),
      });
    }

    return { user, timeseries: tsResult, results: results.slice(0, 100) };
  }
}
