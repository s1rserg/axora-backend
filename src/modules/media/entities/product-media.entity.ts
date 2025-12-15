import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductEntity } from '@modules/product';

import { MediaEntity } from './media.entity';

@Entity('product_media')
@Index(['productId', 'isMain'], { unique: true, where: '"is_main" = true' })
export class ProductMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_main', default: false })
  isMain: boolean;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => MediaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media: MediaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
