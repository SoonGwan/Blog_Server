import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import User from './User';
import Category from './Category';

@Entity('post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({
    length: 255,
    nullable: false,
  })
  title: string;

  @Column('text', {
    nullable: false,
  })
  content: string;

  @Column({
    nullable: false,
    default: 0,
  })
  view: number;

  @Column({
    nullable: false,
    default: false,
  })
  is_deleted: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  is_private: boolean;

  @Column({
    nullable: false,
    default: false
  })
  is_temp: boolean;

  @ManyToOne(type => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;

  @Column({
    length: 255,
    nullable: true,
  })
  fk_user_id: string;

  @ManyToOne(type => Category, { onDelete: "SET NULL" })
  @JoinColumn({ name: 'fk_category_idx' })
  category: Category;

  @Column({
    nullable: true,
  })
  fk_category_idx: number;

  @Column({
    length: 1000,
    nullable: true,
  })
  thumbnail: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at: Date;
}