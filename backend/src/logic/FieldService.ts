import { inject, injectable } from 'inversify';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
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

  public async getAllFields(): Promise<GetFieldResponse> {
    const [category, chapter] = await Promise.all([
      this.categoryAccess.find({ order: { createdAt: 'asc' } }),
      this.chapterAccess.find({ order: { createdAt: 'asc' } }),
    ]);

    return { category, chapter };
  }
}
