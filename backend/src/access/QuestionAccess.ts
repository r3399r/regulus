import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { QuestionCategoryEntity } from 'src/model/entity/QuestionCategoryEntity';
import { QuestionChapterEntity } from 'src/model/entity/QuestionChapterEntity';
import { Question, QuestionEntity } from 'src/model/entity/QuestionEntity';
import { QuestionTagEntity } from 'src/model/entity/QuestionTagEntity';
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
    categoryId?: string[];
    chapterId?: string[];
    tagId?: string[];
  }): Promise<string[]> {
    const qr = await this.database.getQueryRunner();
    const queryBuilder = qr.manager
      .createQueryBuilder(QuestionEntity.name, 'q')
      .distinctOn(['q.id'])
      .innerJoinAndSelect(
        QuestionCategoryEntity.name,
        'qc',
        'qc.question_id = q.id'
      )
      .innerJoinAndSelect(
        QuestionChapterEntity.name,
        'qc2',
        'qc2.question_id = q.id'
      )
      .innerJoinAndSelect(
        QuestionTagEntity.name,
        'qt',
        'qt.question_id = q.id'
      );

    if (options.categoryId) {
      queryBuilder.where('qc.category_id IN (:...id)', {
        id: options.categoryId,
      });
      if (options.chapterId)
        queryBuilder.andWhere('qc2.chapter_id IN (:...id)', {
          id: options.chapterId,
        });
      if (options.tagId)
        queryBuilder.andWhere('qt.tag_id IN (:...id)', {
          id: options.tagId,
        });
    } else if (options.chapterId) {
      queryBuilder.where('qc2.chapter_id IN (:...id)', {
        id: options.chapterId,
      });
      if (options.tagId)
        queryBuilder.andWhere('qt.tag_id IN (:...id)', {
          id: options.tagId,
        });
    } else if (options.tagId)
      queryBuilder.where('qt.tag_id IN (:...id)', {
        id: options.tagId,
      });

    const res = await queryBuilder.getRawMany();

    return res.map((v) => v.q_id);
  }
}
