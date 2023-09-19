import { Column, Entity } from 'typeorm';

export type QuestionCategory = {
  questionId: string;
  categoryId: string;
};

@Entity({ name: 'question_category' })
export class QuestionCategoryEntity implements QuestionCategory {
  @Column({ primary: true, name: 'question_id', type: 'text' })
  questionId!: string;

  @Column({ primary: true, name: 'category_id', type: 'uuid' })
  categoryId!: string;
}
