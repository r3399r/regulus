import { inject, injectable } from 'inversify';
import { FindOptionsWhere, In, Like } from 'typeorm';
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
import { Question, QuestionEntity } from 'src/model/entity/QuestionEntity';
import { TagEntity } from 'src/model/entity/TagEntity';
import { NotFoundError } from 'src/model/error';
import { Pagination } from 'src/model/Pagination';
import { AwsUtil } from 'src/util/AwsUtil';
import { bn } from 'src/util/bignumber';

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

  @inject(AwsUtil)
  private readonly awsUtil!: AwsUtil;

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
    question.categories = thisCategories;
    question.chapters = thisChapters;
    question.tags = thisTags;
    question.youtube = data.youtube ?? null;
    question.hasSolution = data.hasSolution;
    question.hasImage = data.image === undefined ? false : true;
    question.accumulativeScore = data.defaultScore ?? null;
    question.accumulativeCount = data.defaultCount?.toString() ?? null;

    const newQuestion = await this.questionAccess.save(question);

    if (data.image) {
      let n = 0;
      for (const i of data.image) {
        n = n + 1;
        await this.awsUtil.s3Upload(i, `${newQuestion.id}/${n}`);
      }
    }

    return newQuestion;
  }

  public async updateQuestion(
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

    // delete & re-upload images
    if (data.image && data.image.length > 0 && question.hasImage) {
      const s3Objects = await this.awsUtil.listS3Objects(question.id);
      if (s3Objects.Contents)
        await this.awsUtil.deleteS3Objects(
          s3Objects.Contents.map((v) => v.Key ?? '').filter((v) => v !== '')
        );
    }
    if (data.image && data.image.length > 0) {
      let n = 0;
      for (const i of data.image) {
        n = n + 1;
        await this.awsUtil.s3Upload(i, `${question.id}/${n}`);
      }
    }

    question.content = data.content ?? question.content;
    question.answer = data.answer ?? question.answer;
    question.categories = thisCategories ?? question.categories;
    question.chapters = thisChapters ?? question.chapters;
    question.tags = thisTags ?? question.tags;
    question.youtube = data.youtube ?? question.youtube;
    question.hasSolution = data.hasSolution ?? question.hasSolution;
    question.hasImage = data.image === undefined ? question.hasImage : true;

    const updatedQuestion = await this.questionAccess.save(question);

    // clean up
    const tagIds = await this.tagAccess.findIdNotExists();
    await Promise.all(tagIds.map((v) => this.tagAccess.deleteById(v)));

    return updatedQuestion;
  }

  public async getQuestionList(
    params: GetQuestionParams | null
  ): Promise<Pagination<GetQuestionResponse>> {
    if (params?.id) {
      const res = await this.questionAccess.findOne({
        where: { id: params.id.toLowerCase() },
      });
      let imageUrl: string[] | null = null;
      if (res?.hasImage) {
        const s3Objects = await this.awsUtil.listS3Objects(
          params.id.toLowerCase()
        );
        if (s3Objects.Contents && s3Objects.Contents.length > 0)
          imageUrl = s3Objects.Contents.map((v) =>
            v.Key ? this.awsUtil.getS3SignedUrl(v.Key) : ''
          ).filter((v) => v !== '');
      }
      const average =
        res && res.accumulativeCount !== null && res.accumulativeScore !== null
          ? bn(res.accumulativeScore)
              .div(res.accumulativeCount)
              .times(5)
              .dp(1)
              .toNumber()
          : null;

      return {
        data: res ? [{ ...res, imageUrl, average }] : [],
        paginate: { limit: 0, offset: 0, count: res ? 1 : 0 },
      };
    }

    const limit = params?.limit ? Number(params.limit) : 50;
    const offset = params?.offset ? Number(params.offset) : 0;

    let questionIds: string[] | null = null;
    if (params?.category || params?.chapter || params?.tag || params?.q)
      questionIds = await this.questionAccess.findDistinctId({
        category: params?.category?.split(','),
        chapter: params?.chapter?.split(','),
        tag: params?.tag?.split(','),
      });

    let where:
      | FindOptionsWhere<Question>
      | FindOptionsWhere<Question>[]
      | undefined = undefined;
    if (questionIds && params?.q)
      where = [
        { id: In(questionIds), content: Like(params.q) },
        { id: In(questionIds), answer: Like(params.q) },
      ];
    else if (questionIds && !params?.q) where = { id: In(questionIds) };
    else if (!questionIds && params?.q)
      where = [{ content: Like(params.q) }, { answer: Like(params.q) }];

    const res = await this.questionAccess.findAndCount({
      where,
      order: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const questions = await Promise.all(
      res[0].map(async (q) => {
        let imageUrl: string[] | null = null;
        if (q.hasImage) {
          const s3Objects = await this.awsUtil.listS3Objects(q.id);
          if (s3Objects.Contents && s3Objects.Contents.length > 0)
            imageUrl = s3Objects.Contents.map((v) =>
              v.Key ? this.awsUtil.getS3SignedUrl(v.Key) : ''
            ).filter((v) => v !== '');
        }
        const average =
          q.accumulativeCount !== null && q.accumulativeScore !== null
            ? bn(q.accumulativeScore)
                .div(q.accumulativeCount)
                .times(5)
                .dp(1)
                .toNumber()
            : null;

        return { ...q, imageUrl, average };
      })
    );

    return { data: questions, paginate: { limit, offset, count: res[1] } };
  }
}
