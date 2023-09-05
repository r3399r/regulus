import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import uniqid from 'uniqid';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { QuestionAccess } from 'src/access/QuestionAccess';
import {
  GetQuestionParams,
  GetQuestionResponse,
  PostQuestionRequest,
  PostQuestionResponse,
} from 'src/model/api';
import { QuestionEntity } from 'src/model/entity/QuestionEntity';
import { NotFoundError } from 'src/model/error';

/**
 * Service class for Question
 */
@injectable()
export class QuestionService {
  @inject(QuestionAccess)
  private readonly questionAccess!: QuestionAccess;

  @inject(CategoryAccess)
  private readonly categoryAccess!: CategoryAccess;

  @inject(ChapterAccess)
  private readonly chapterAccess!: ChapterAccess;

  public async addQuestion(
    data: PostQuestionRequest
  ): Promise<PostQuestionResponse> {
    const categories = await this.categoryAccess.find();
    const chapters = await this.chapterAccess.find();

    const thisCategories = data.category?.map((v) => {
      const category = categories.find((c) => c.name === v);
      if (category) return category;
      throw new NotFoundError(`category ${v} not found`);
    });
    const thisChapters = data.chapter?.map((v) => {
      const chapter = chapters.find((c) => c.name === v);
      if (chapter) return chapter;
      throw new NotFoundError(`chapter ${v} not found`);
    });

    const question = new QuestionEntity();
    question.id = uniqid.time();
    question.content = data.content;
    question.answer = data.answer;
    question.answerFormat = data.answerFormat;
    question.categories = thisCategories ?? [];
    question.chapters = thisChapters ?? [];
    question.youtube = data.youtube ?? null;

    return await this.questionAccess.save(question);
  }

  public async getQuestionList(
    params: GetQuestionParams | null
  ): Promise<GetQuestionResponse> {
    if (params?.id) {
      const res = await this.questionAccess.findOne({
        where: { id: params.id },
      });

      return {
        data: res ? [res] : [],
        paginate: { limit: 0, offset: 0, count: res ? 1 : 0 },
      };
    }

    const limit = params?.limit ? Number(params.limit) : 50;
    const offset = params?.offset ? Number(params.offset) : 0;

    let questionIds: string[] = [];
    if (params?.categoryId || params?.chapterId)
      questionIds = await this.questionAccess.findDistinctId({
        categoryId: params?.categoryId?.split(','),
        chapterId: params?.chapterId?.split(','),
      });

    const res = await this.questionAccess.findAndCount({
      where: questionIds.length > 0 ? { id: In(questionIds) } : undefined,
      order: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return { data: res[0], paginate: { limit, offset, count: res[1] } };
  }
}
