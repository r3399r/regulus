import { inject, injectable } from 'inversify';
import { UserAccess } from 'src/access/UserAccess';
import { PostUserRequest, PutUserRequest } from 'src/model/api';
import { UserEntity } from 'src/model/entity/UserEntity';

/**
 * Service class for User
 */
@injectable()
export class UserService {
  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

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
}
