import { Column, Entity } from 'typeorm';

export type QuestionChapter = {
  questionId: string;
  chapterId: string;
};

@Entity({ name: 'question_chapter' })
export class QuestionChapterEntity implements QuestionChapter {
  @Column({ primary: true, name: 'question_id', type: 'text' })
  questionId!: string;

  @Column({ primary: true, name: 'chapter_id', type: 'uuid' })
  chapterId!: string;
}
