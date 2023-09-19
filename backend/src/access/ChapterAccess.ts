import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Chapter, ChapterEntity } from 'src/model/entity/ChapterEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Chapter model.
 */
@injectable()
export class ChapterAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options?: FindManyOptions<Chapter>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Chapter>(ChapterEntity.name, options);
  }
}
