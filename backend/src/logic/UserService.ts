import { inject, injectable } from 'inversify';
import { UserAccess } from 'src/access/UserAccess';
import { PostUserRequest } from 'src/model/api';
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
}
