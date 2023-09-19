import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Question, QuestionEntity } from 'src/model/entity/QuestionEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Question model.
 */
@injectable()
export class QuestionAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(data: Question) {
    const qr = await this.database.getQueryRunner();
    const entity = new QuestionEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }

  public async findAndCount(options?: FindManyOptions<Question>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findAndCount<Question>(QuestionEntity.name, {
      relations: { categories: true, chapters: true, tags: true },
      ...options,
    });
  }

  public async findOne(options?: FindOneOptions<Question>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Question>(QuestionEntity.name, {
      relations: { categories: true, chapters: true, tags: true },
      ...options,
    });
  }

  public async findOneOrFail(options?: FindOneOptions<Question>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Question>(QuestionEntity.name, {
      relations: { categories: true, chapters: true, tags: true },
      ...options,
    });
  }

  public async findDistinctId(options: {
    category?: string[];
    chapter?: string[];
    tag?: string[];
  }): Promise<string[]> {
    const qr = await this.database.getQueryRunner();
    const queryBuilder = qr.manager
      .createQueryBuilder(QuestionEntity.name, 'q')
      .distinctOn(['q.id'])
      .innerJoinAndSelect('question_category', 'qc', 'qc.question_id = q.id')
      .innerJoinAndSelect('category', 'c', 'qc.category_id = c.id')
      .innerJoinAndSelect('question_chapter', 'qc2', 'qc2.question_id = q.id')
      .innerJoinAndSelect('chapter', 'c2', 'qc2.chapter_id = c2.id')
      .innerJoinAndSelect('question_tag', 'qt', 'qt.question_id = q.id')
      .innerJoinAndSelect('tag', 't', 'qt.tag_id = t.id');

    if (options.category) {
      queryBuilder.where('c.name IN (:...category)', {
        category: options.category,
      });
      if (options.chapter)
        queryBuilder.andWhere('c2.name IN (:...chapter)', {
          chapter: options.chapter,
        });
      if (options.tag)
        queryBuilder.andWhere('t.name IN (:...tag)', {
          tag: options.tag,
        });
    } else if (options.chapter) {
      queryBuilder.where('c2.name IN (:...chapter)', {
        chapter: options.chapter,
      });
      if (options.tag)
        queryBuilder.andWhere('t.name IN (:...tag)', {
          tag: options.tag,
        });
    } else if (options.tag)
      queryBuilder.where('t.name IN (:...tag)', {
        tag: options.tag,
      });

    const res = await queryBuilder.getRawMany();

    return res.map((v) => v.q_id);
  }
}
