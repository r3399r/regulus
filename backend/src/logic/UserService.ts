import { inject, injectable } from 'inversify';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { ResultAccess } from 'src/access/ResultAccess';
import { UserAccess } from 'src/access/UserAccess';
import {
  GetUserIdResponse,
  PostUserRequest,
  PutUserRequest,
} from 'src/model/api';
import { UserEntity } from 'src/model/entity/UserEntity';

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

  public async getUsers() {
    return await this.userAccess.find();
  }

  public async getUserDetail(id: string): Promise<GetUserIdResponse> {
    const [user, results, categories, chapters] = await Promise.all([
      this.userAccess.findOneOrFail({ where: { id } }),
      this.resultAccess.find({
        where: { userId: id },
        order: { createdAt: 'asc' },
      }),
      this.categoryAccess.find(),
      this.chapterAccess.find(),
    ]);
    console.log(JSON.stringify(user), JSON.stringify(results));

    const categoryScore = [];
    for (const c of categories) {
      const filtered = results.filter((v) =>
        v.question.categories.map((o) => o.id).includes(c.id)
      );
      if (filtered.length === 0) {
        categoryScore.push({ name: c.name, score: 0 });
        continue;
      }
      const sum = filtered.reduce(
        (acc, cur, i) => acc + cur.score * (i + 1),
        0
      );
      const weight = ((1 + filtered.length) * filtered.length) / 2;
      categoryScore.push({ name: c.name, score: (sum / weight) * 10 });
    }

    const chapterScore = [];
    for (const c of chapters) {
      const filtered = results.filter((v) =>
        v.question.chapters.map((o) => o.id).includes(c.id)
      );
      if (filtered.length === 0) {
        chapterScore.push({ name: c.name, score: 0 });
        continue;
      }
      const sum = filtered.reduce(
        (acc, cur, i) => acc + cur.score * (i + 1),
        0
      );
      const weight = ((1 + filtered.length) * filtered.length) / 2;
      chapterScore.push({ name: c.name, score: (sum / weight) * 10 });
    }

    return { ...user, categoryScore, chapterScore, results };
  }
}
