import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemImage } from './item-image.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true, default: 'No description Provided'})
  description: string;

  @OneToMany(() => ItemImage, (itemImage) => itemImage.item, { cascade: true })
  images: ItemImage[];
}
