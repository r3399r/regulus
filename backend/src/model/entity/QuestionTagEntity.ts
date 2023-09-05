import { Column, Entity } from 'typeorm';

export type QuestionTag = {
  questionId: string;
  tagId: string;
};

@Entity({ name: 'question_tag' })
export class QuestionTagEntity implements QuestionTag {
  @Column({ primary: true, name: 'question_id', type: 'text' })
  questionId!: string;

  @Column({ primary: true, name: 'tag_id', type: 'uuid' })
  tagId!: string;
}
