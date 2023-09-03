import { BeforeInsert, BeforeUpdate, Column, Entity, Generated } from 'typeorm';

export type Category = {
  id: string;
  name: string;
  createdAt: string | null;
  updatedAt: string | null;
};

@Entity({ name: 'category' })
export class CategoryEntity implements Category {
  @Column({ primary: true })
  @Generated('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'timestamp', name: 'created_at', default: null })
  createdAt!: string;

  @Column({ type: 'timestamp', name: 'updated_at', default: null })
  updatedAt: string | null = null;

  @BeforeInsert()
  setDateCreated(): void {
    this.createdAt = new Date().toISOString();
  }

  @BeforeUpdate()
  setDateUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}
