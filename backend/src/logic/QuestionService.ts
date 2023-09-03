import { inject, injectable } from 'inversify';
import uniqid from 'uniqid';
import { CategoryAccess } from 'src/access/CategoryAccess';
import { ChapterAccess } from 'src/access/ChapterAccess';
import { QuestionAccess } from 'src/access/QuestionAccess';
import { PostQuestionRequest } from 'src/model/api';
import { QuestionEntity } from 'src/model/entity/QuestionEntity';

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

  public async addQuestion(data: PostQuestionRequest) {
    const categories = await this.categoryAccess.find();
    const chapters = await this.chapterAccess.find();

    for (const q of data) {
      const thisCategories = categories.filter((v) =>
        q.category.includes(v.name)
      );
      const thisChapters = chapters.filter((v) => q.chapter.includes(v.name));

      const question = new QuestionEntity();
      question.id = uniqid();
      question.content = q.content;
      question.answer = q.answer;
      question.answerFormat = q.answerFormat;
      question.categories = thisCategories;
      question.chapters = thisChapters;
      question.youtube = q.youtube;
      await this.questionAccess.save(question);
    }
  }
}
