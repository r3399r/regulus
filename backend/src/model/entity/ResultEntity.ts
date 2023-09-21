import { BeforeInsert, Column, Entity, Generated } from 'typeorm';

export type Result = {
  id: string;
  questionId: string;
  userId: string;
  score: number;
  createdAt: string | null;
};

@Entity({ name: 'result' })
export class ResultEntity implements Result {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ name: 'question_id', type: 'text' })
  questionId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'float' })
  score!: number;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }
}
