import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import uniqid from 'uniqid';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { QuestionAccess } from 'src/access/QuestionAccess';
import { TagAccess } from 'src/access/TagAccess';
import {
  GetQuestionParams,
  GetQuestionResponse,
  PostQuestionRequest,
  PostQuestionResponse,
  PutQuestionRequest,
  PutQuestionResponse,
} from 'src/model/api';
import { QuestionEntity } from 'src/model/entity/QuestionEntity';
import { TagEntity } from 'src/model/entity/TagEntity';
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

  @inject(TagAccess)
  private readonly tagAccess!: TagAccess;

  private async getCategoryEntities(names: string[]) {
    const categories = await this.categoryAccess.find();

    return names.map((v) => {
      const category = categories.find((c) => c.name === v);
      if (category) return category;
      throw new NotFoundError(`category ${v} not found`);
    });
  }

  private async getChapterEntities(names: string[]) {
    const chapters = await this.chapterAccess.find();

    return names.map((v) => {
      const chapter = chapters.find((c) => c.name === v);
      if (chapter) return chapter;
      throw new NotFoundError(`chapter ${v} not found`);
    });
  }

  private async getTagEntities(names: string[]) {
    const tags = await this.tagAccess.find();

    return await Promise.all(
      names.map(async (v) => {
        const tag = tags.find((c) => c.name === v);
        if (tag) return tag;
        const newTag = new TagEntity();
        newTag.name = v;

        return await this.tagAccess.save(newTag);
      })
    );
  }

  public async addQuestion(
    data: PostQuestionRequest
  ): Promise<PostQuestionResponse> {
    const thisCategories = data.category
      ? await this.getCategoryEntities(data.category)
      : [];
    const thisChapters = data.chapter
      ? await this.getChapterEntities(data.chapter)
      : [];
    const thisTags = data.tag ? await this.getTagEntities(data.tag) : [];

    const question = new QuestionEntity();
    question.id = uniqid.time();
    question.content = data.content;
    question.answer = data.answer;
    question.answerFormat = data.answerFormat;
    question.categories = thisCategories;
    question.chapters = thisChapters;
    question.tags = thisTags;
    question.youtube = data.youtube ?? null;

    return await this.questionAccess.save(question);
  }

  public async reviseQuestion(
    id: string,
    data: PutQuestionRequest
  ): Promise<PutQuestionResponse> {
    const thisCategories = data.category
      ? await this.getCategoryEntities(data.category)
      : undefined;
    const thisChapters = data.chapter
      ? await this.getChapterEntities(data.chapter)
      : undefined;
    const thisTags = data.tag ? await this.getTagEntities(data.tag) : undefined;

    const question = await this.questionAccess.findOneOrFail({ where: { id } });
    question.content = data.content ?? question.content;
    question.answer = data.answer ?? question.answer;
    question.answerFormat = data.answerFormat ?? question.answerFormat;
    question.categories = thisCategories ?? question.categories;
    question.chapters = thisChapters ?? question.chapters;
    question.tags = thisTags ?? question.tags;
    question.youtube = data.youtube ?? question.youtube;

    const updatedQuestion = await this.questionAccess.save(question);

    // clean up
    const tagIds = await this.tagAccess.findIdNotExists();
    await Promise.all(tagIds.map((v) => this.tagAccess.deleteById(v)));

    return updatedQuestion;
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
        tagId: params?.tagId?.split(','),
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
