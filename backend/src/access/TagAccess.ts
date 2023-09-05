import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Tag, TagEntity } from 'src/model/entity/TagEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Tag model.
 */
@injectable()
export class TagAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(data: Tag) {
    const qr = await this.database.getQueryRunner();
    const entity = new TagEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }

  public async find(options?: FindManyOptions<Tag>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Tag>(TagEntity.name, options);
  }

  public async findIdNotExists() {
    const qr = await this.database.getQueryRunner();

    const tags = await qr.manager
      .createQueryBuilder<Tag>(TagEntity.name, 't')
      .where('t.id NOT IN (SELECT tag_id FROM question_tag)')
      .getMany();

    return tags.map((v) => v.id);
  }

  public async deleteById(id: string) {
    const qr = await this.database.getQueryRunner();
    await qr.manager.delete(TagEntity.name, { id });
  }
}
