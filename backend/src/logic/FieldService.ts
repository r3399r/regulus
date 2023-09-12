import { inject, injectable } from 'inversify';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { TagAccess } from 'src/access/TagAccess';
import { GetFieldResponse } from 'src/model/api';

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
    const [category, chapter, tag] = await Promise.all([
      this.categoryAccess.find(),
      this.chapterAccess.find(),
      this.tagAccess.find(),
    ]);

    return { category, chapter, tag };
  }
}
