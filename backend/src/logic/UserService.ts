import { differenceInCalendarDays } from 'date-fns';
import { inject, injectable } from 'inversify';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { ResultAccess } from 'src/access/ResultAccess';
import { UserAccess } from 'src/access/UserAccess';
import {
  GetUserIdResponse,
  GetUserResponse,
  PostUserRequest,
  PutUserRequest,
} from 'src/model/api';
import { UserEntity } from 'src/model/entity/UserEntity';
import { bn } from 'src/util/bignumber';

/**
 * Service class for User
 */
@injectable()
export class UserService {
  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ResultAccess)
  private readonly resultAccess!: ResultAccess;

  @inject(CategoryAccess)
  private readonly categoryAccess!: CategoryAccess;

  @inject(ChapterAccess)
  private readonly chapterAccess!: ChapterAccess;

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
    const [user, results, categories, chapters] = await Promise.all([
      this.userAccess.findOneOrFail({ where: { id } }),
      this.resultAccess.find({
        where: { userId: id },
        order: { examDate: 'desc' },
      }),
      this.categoryAccess.find({ order: { createdAt: 'asc' } }),
      this.chapterAccess.find({ order: { createdAt: 'asc' } }),
    ]);

    const r = 0.96;

    const categoryScore = [];
    for (const c of categories) {
      const filtered = results.filter((v) =>
        v.question.categories.map((o) => o.id).includes(c.id)
      );
      if (filtered.length === 0) continue;
      const [sum, weight] = filtered.reduce(
        (acc, cur) => {
          const diff = differenceInCalendarDays(
            new Date(),
            new Date(cur.examDate ?? '')
          );
          const sum = bn(r).pow(diff).times(cur.score).plus(acc[0]);
          const weight = bn(r).pow(diff).plus(acc[1]);

          return [sum, weight];
        },
        [bn(0), bn(0)]
      );
      categoryScore.push({ name: c.name, score: sum.div(weight).toNumber() });
    }

    const chapterScore = [];
    for (const c of chapters) {
      const filtered = results.filter((v) =>
        v.question.chapters.map((o) => o.id).includes(c.id)
      );
      if (filtered.length === 0) continue;
      const [sum, weight] = filtered.reduce(
        (acc, cur) => {
          const diff = differenceInCalendarDays(
            new Date(),
            new Date(cur.examDate ?? '')
          );
          const sum = bn(r).pow(diff).times(cur.score).plus(acc[0]);
          const weight = bn(r).pow(diff).plus(acc[1]);

          return [sum, weight];
        },
        [bn(0), bn(0)]
      );
      chapterScore.push({ name: c.name, score: sum.div(weight).toNumber() });
    }

    return {
      ...user,
      categoryScore,
      chapterScore,
      results: results.slice(0, 100),
    };
  }
}
