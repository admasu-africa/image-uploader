import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ItemImage } from './item-image.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(ItemImage) private itemImageRepository: Repository<ItemImage>,
  ) {}

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.find({ 
      relations: ['images'],
    });
  }


  async createItem(title: string, description: string, files: Express.Multer.File[]): Promise<Item> {
    

    const item = this.itemRepository.create({ title, description });
    const savedItem = await this.itemRepository.save(item);

    const images = [];
    for (const file of files) {
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null); // End the stream

      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(new BadRequestException('Failed to upload image to Cloudinary.'));
              } else {
                resolve(result);
              }
            }
          );
          bufferStream.pipe(uploadStream);
        });

        const image = this.itemImageRepository.create({
          url: uploadResult.secure_url,
          item: savedItem,
        });
        images.push(image);
      } catch (error) {
        throw error; 
      }
    }


    await this.itemImageRepository.save(images);

    return savedItem;
  }
}