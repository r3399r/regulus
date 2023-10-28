import { inject, injectable } from 'inversify';
import { Like } from 'typeorm';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { TagAccess } from 'src/access/TagAccess';
import { GetFieldResponse, GetTagParams, GetTagResponse } from 'src/model/api';
import { BadRequestError } from 'src/model/error';

/**
 * Service class for Field
 */
@injectable()
export class FieldService {
  @inject(CategoryAccess)
  private readonly categoryAccess!: CategoryAccess;

  @inject(ChapterAccess)
  private readonly chapterAccess!: ChapterAccess;

  @inject(TagAccess)
  private readonly tagAccess!: TagAccess;

  public async getAllFields(): Promise<GetFieldResponse> {
    const [category, chapter] = await Promise.all([
      this.categoryAccess.find({ order: { createdAt: 'asc' } }),
      this.chapterAccess.find({ order: { createdAt: 'asc' } }),
    ]);

    return { category, chapter };
  }

  public async getTagByQuery(
    params: GetTagParams | null
  ): Promise<GetTagResponse> {
    if (params === null || !params.query)
      throw new BadRequestError('bad request');

    return await this.tagAccess.find({
      where: { name: Like(`%${params.query}%`) },
    });
  }
}
