import { inject, injectable } from 'inversify';
import { Result, ResultEntity } from 'src/model/entity/ResultEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Result model.
 */
@injectable()
export class ResultAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(data: Result) {
    const qr = await this.database.getQueryRunner();
    const entity = new ResultEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
