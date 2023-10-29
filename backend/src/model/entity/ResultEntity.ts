import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Question, QuestionEntity } from './QuestionEntity';

export type Result = {
  id: string;
  questionId: string;
  question: Question;
  userId: string;
  score: number;
  examDate: string;
  createdAt: string | null;
};

@Entity({ name: 'result' })
export class ResultEntity implements Result {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ name: 'question_id', type: 'text' })
  questionId!: string;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'float' })
  score!: number;

  @Column({ type: 'timestamp', name: 'exam_date' })
  examDate!: string;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }
}
