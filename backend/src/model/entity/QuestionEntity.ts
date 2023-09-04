import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Category, CategoryEntity } from './CategoryEntity';
import { Chapter, ChapterEntity } from './ChapterEntity';

export type Question = {
  id: string;
  content: string;
  answer: string | null;
  answerFormat: string | null;
  youtube: string | null;
  categories: Category[];
  chapters: Chapter[];
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'question' })
export class QuestionEntity implements Question {
  @Column({ primary: true, type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', default: null })
  answer: string | null = null;

  @Column({ type: 'text', name: 'answer_format', default: null })
  answerFormat: string | null = null;

  @Column({ type: 'text', default: null })
  youtube: string | null = null;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @ManyToMany(() => CategoryEntity, { cascade: true })
  @JoinTable({
    name: 'question_category',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Category[];

  @ManyToMany(() => ChapterEntity, { cascade: true })
  @JoinTable({
    name: 'question_chapter',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chapter_id', referencedColumnName: 'id' },
  })
  chapters!: Chapter[];

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}
