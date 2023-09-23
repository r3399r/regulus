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
import { Tag, TagEntity } from './TagEntity';

export type Question = {
  id: string;
  content: string;
  answer: string | null;
  answerFormat: string | null;
  youtube: string | null;
  hasSolution: boolean;
  hasImage: boolean;
  categories: Category[];
  chapters: Chapter[];
  tags: Tag[];
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

  @Column({ type: 'boolean', name: 'has_solution' })
  hasSolution = false;

  @Column({ type: 'boolean', name: 'has_image' })
  hasImage = false;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'question_category',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Category[];

  @ManyToMany(() => ChapterEntity)
  @JoinTable({
    name: 'question_chapter',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chapter_id', referencedColumnName: 'id' },
  })
  chapters!: Chapter[];

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'question_tag',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags!: Tag[];

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}
